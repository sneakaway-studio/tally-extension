"use strict";

window.Monster = (function () {

	/**
	 *	1. MonsterCheck determines which monsters are nearby and calls Monster.create(mid)
	 *	2. MonsterCheck determines which monsters are advancing to new stages
	 *	3. MonsterCheck calls Monster.show() if it reaches stage 3
	 *	4. ...
	 */

	let DEBUG = Debug.ALL.Monster,
		onPage = false,
		currentMID = 0,
		secondsBeforeDelete = 300 // 60 seconds for testing
	;



	/**
	 *	Return the monster's tracker
	 */
	function setTracker() {
		try {
			let tracker = "";

			console.log("👿 Monster.setTracker()",
				"Page.data.trackers =", Page.data.trackers,
			);
			// if there are trackers on the page
			tracker = FS_Object.randomObjProperty(Page.data.trackers.found) || "";

			return tracker;

		} catch (err) {
			console.error(err);
		}
	}


	/**
	 *	Create a new monster object and return
	 */
	function create(mid, _stage = 1) {
		try {
			// allow offline
			if (Page.data.mode.notActive) return;
			// don't allow if mode disabled or stealth
			if (T.tally_options.gameMode === "disabled" || T.tally_options.gameMode === "stealth") return;

			let log = "👿 Monster.create()";

			// make sure we have required data
			if (!prop(mid) || !prop(_stage) || !prop(MonsterData.dataById[mid])) return;

			// set the tracker
			let tracker = setTracker();

			if (DEBUG) console.log(log, "[1] mid=" + mid, "tracker = " + tracker, "_stage = " + _stage, MonsterData.dataById[mid]);

			T.tally_nearby_monsters[mid] = {
				"stage": _stage,
				"level": returnNewMonsterLevel(),
				"name": MonsterData.dataById[mid].name,
				"slug": MonsterData.dataById[mid].slug,
				"mid": mid,
				"tracker": tracker,
				"totalCaptured": 0,
				"captured": 0,
				"missed": 0,
				"facing": MonsterData.dataById[mid].facing,
				"updatedAt": Date.now(),
				"tier1id": MonsterData.dataById[mid].tier1id
			};
			// if it already exists then make it the number of captures +1
			if (T.tally_user.monsters[mid])
				T.tally_nearby_monsters[mid].totalCaptured = T.tally_user.monsters[mid].captured;
			if (DEBUG) console.log(log, '[2]', mid, T.tally_nearby_monsters[mid], T.tally_user.monsters[mid]);
			// save
			TallyStorage.saveData("tally_nearby_monsters", T.tally_nearby_monsters, "👿 Monster.create()");
			return T.tally_nearby_monsters[mid];
		} catch (err) {
			console.error(err);
		}
	}

	/**
	 *	Determine and return a monster's level
	 */
	function returnNewMonsterLevel() {
		try {
			// if (DEBUG) console.log("👿 Monster.returnNewMonsterLevel()");
			let userLevel = T.tally_user.level || 1,
				factor = 0.5;
			// use factor to keep the level different but near the user's level
			if (userLevel > 15) factor = 0.4;
			if (userLevel > 30) factor = 0.2;
			if (userLevel > 60) factor = 0.1;
			let min = Math.floor(userLevel - (userLevel * factor)),
				max = Math.ceil(userLevel + (userLevel * factor));
			let level = Math.floor(Math.random() * (max - min) + min) - 1;
			if (level < 1) level = 1;
			if (DEBUG) console.log("👿 Monster.returnNewMonsterLevel()",
				"userLevel =", userLevel, "min, max =", min, max, "level =", level);
			return level;
		} catch (err) {
			console.error(err);
		}
	}

	/**
	 *	Add a product monster (contains checks)
	 */
	function showOnPage(mid) {
		try {
			// allow offline
			if (Page.data.mode.notActive) return;
			// don't allow if mode disabled or stealth
			if (T.tally_options.gameMode === "disabled" || T.tally_options.gameMode === "stealth") return;

			if (DEBUG) console.log('👿 Monster.showOnPage() [1]', mid, T.tally_nearby_monsters[mid]);

			// only proceed if mid is valid
			if (!mid || mid <= 0) {
				if (DEBUG) console.log('👿 Monster.showOnPage() [1.2] MID NOT VALID', mid);
				return;
			}

			// make sure everything has loaded before running
			setTimeout(function () {
				// set currentMID
				currentMID = mid;
				// reset / create new stats for monster
				Stats.reset("monster");
				// display it on the page
				display(T.tally_nearby_monsters[mid]);
			}, 500);
		} catch (err) {
			console.error(err);
		}
	}



	/**
	 *	Return
	 */
	function returnInnerHtml(monster) {
		try {} catch (err) {
			console.error(err);
		}
	}








	/**
	 *	Display a monster on the page (call add() first)
	 */
	function display(monster) {
		try {
			if (DEBUG) console.log('👿 Monster.display()', monster);
			// set marker
			onPage = monster.mid;

			// show dialogue
			Dialogue.showData(Dialogue.getData({
				category: "monster",
				subcategory: "display"
			}));
			// reference to image file (moved to server )
			var url = T.tally_meta.website + '/' + 'assets/img/monsters/monsters-300h/' + monster.mid + '-anim-sheet.png';
			//var url = chrome.extension.getURL('assets/img/472-master-3d-test.png');

			// set monster image
			$('.tally_monster_sprite_inner').css('background-image', 'url( ' + url + ')');

			// turn monster to face Tally
			if (prop(T.tally_nearby_monsters[monster.mid].facing) && T.tally_nearby_monsters[monster.mid].facing == "1")
				$('.tally_monster_sprite_flip').css('transform', 'scale(-.5,.5)'); // left
			else
				$('.tally_monster_sprite_flip').css('transform', 'scale(.5,.5)'); // reset (right)

			// get random position
			let preference = "";
			if (T.tally_user.level < 5) {
				preference = "above-the-fold";
			}
			let pos = Core.returnRandomPositionFull('.tally_monster_sprite_container', null, null, preference);
			let css = {
				'position': 'absolute',
				"display": "block",
				"z-index": 99999999999,
				"opacity": 1,
				"top": pos.y,
				"left": pos.x
			};
			// display monster on page
			$('.tally_monster_sprite_container').css(css);
			// set data attribute
			$('.tally_monster_sprite_container').attr('data-mid', monster.mid);

			// add listeners
			$(document).on("mouseover", ".tally_monster_sprite_container", function () {
				let mid = Number($(this).attr('data-mid'));
				//if (DEBUG) console.log(mid);
				// show dialogue with sound but don't add to queue in case they click
				Dialogue.showData(Dialogue.getData({
					category: "battle",
					subcategory: "choose"
				}), {
					addIfInProcess: false
				});
			});
			$(document).on("click", ".tally_monster_sprite_container", function () {
				let mid = Number($(this).attr('data-mid'));
				//console.log(mid);
				// launch battle
				Battle.start(mid);
			});

			// // temp: show growl
			// $.growl({
			// 	title: "LAUNCHING MONSTER!!!",
			// 	message: "MONSTER: " + MonsterData.dataById[mid].name + " [" + mid + "] "
			// });

			// saveMonster
			T.tally_nearby_monsters[monster.mid] = monster;
		} catch (err) {
			console.error(err);
		}
	}


	/**
	 *	Add a test monster
	 */
	function test() {
		try {
			// make sure there are monsters nearby
			if (!T.tally_nearby_monsters || FS_Object.objLength(T.tally_nearby_monsters) <= 0) return;

			// TESTING
			let mid = randomObjKey(T.tally_nearby_monsters),
				_stage = 3;
			T.tally_nearby_monsters[mid] = create(mid, _stage);
			T.tally_nearby_monsters[mid].captured = 0;
			T.tally_nearby_monsters[mid].missed = 0;
			if (DEBUG) console.log("👿 Monster.test()", MonsterData.dataById[mid]);
			// save
			TallyStorage.saveData("tally_nearby_monsters", T.tally_nearby_monsters, "👿 Monster.test()");
			// check/reset skin
			Skin.updateFromHighestMonsterStage();
			Dialogue.showData(Dialogue.getData({
				category: "monster",
				subcategory: "show"
			}));
			add();
		} catch (err) {
			console.error(err);
		}
	}





	/**
	 *	Reset monster
	 */
	function reset(mid) {
		try {
			// reset one
			// if (T.tally_nearby_monsters[mid])
			// 	delete T.tally_nearby_monsters[mid];
			// reset them all
			T.tally_nearby_monsters = {};
			monster = {};
			TallyStorage.saveData("tally_nearby_monsters", T.tally_nearby_monsters, "👿 Monster.reset()");
			// check/reset skin
			Skin.updateFromHighestMonsterStage();
		} catch (err) {
			console.error(err);
		}
	}

	function returnOnPage(state) {
		if (state != undefined && (state === true || state === false))
			onPage = state;
		return onPage;
	}


	// PUBLIC
	return {
		onPage: function (state) {
			return returnOnPage(state);
		},
		create: function (mid) {
			return create(mid);
		},
		showOnPage: showOnPage,
		currentMID: currentMID,
		current: function () {
			return T.tally_nearby_monsters[currentMID];
		},
		saveAndPush: function (mid) {
			return saveAndPush(mid);
		},
		test: test,
		returnNewMonsterLevel: returnNewMonsterLevel
	};
}());
