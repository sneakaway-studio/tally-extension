"use strict";

window.Monster = (function() {

	/**
	 *	1. MonsterCheck determines which monsters are nearby and calls Monster.create(mid)
	 *	2. MonsterCheck determines which monsters are advancing to new stages
	 *	3. MonsterCheck calls Monster.show() if it reaches stage 3
	 *	4. ...
	 */

	let DEBUG = Debug.ALL.Monster,
		currentMID = 0,
		secondsBeforeDelete = 300; // 60 seconds for testing

	/**
	 *	Create a new monster object and return
	 */
	function create(mid, _stage = 1) {
		try {
			if (!prop(mid) || !prop(_stage) || !prop(MonsterData.dataById[mid])) return;
			if (DEBUG) console.log('👿 ⊙!⊙⊙⊙ Monster.create()1', "mid=" + mid, "_stage=" + _stage, MonsterData.dataById[mid]);
			tally_nearby_monsters[mid] = {
				"stage": _stage,
				"level": returnNewMonsterLevel(),
				"name": MonsterData.dataById[mid].name,
				"slug": MonsterData.dataById[mid].slug,
				"mid": mid,
				"totalCaptured": 0,
				"captured": 0,
				"missed": 0,
				"facing": MonsterData.dataById[mid].facing,
				"updatedAt": Date.now()
			};

			// if it already exists then make it the number of captures +1
			if (tally_user.monsters[mid])
				tally_nearby_monsters[mid].totalCaptured = tally_user.monsters[mid].captured;
			if (DEBUG) console.log('👿 ⊙!⊙⊙⊙ Monster.create()2', mid, tally_nearby_monsters[mid], tally_user.monsters[mid]);
			// save
			TallyStorage.saveData("tally_nearby_monsters", tally_nearby_monsters, "👿 Monster.create()");
			return tally_nearby_monsters[mid];
		} catch (err) {
			console.error(err);
		}
	}
	/**
	 *	Determine and return a monster's level
	 */
	function returnNewMonsterLevel() {
		try {
			if (DEBUG) console.log("👿 Monster.returnNewMonsterLevel()",tally_user);
			let userLevel = tally_user.level,
				factor = 0.5;
			if (userLevel > 15) factor = 0.4;
			if (userLevel > 30) factor = 0.2;
			if (userLevel > 60) factor = 0.1;
			let min = Math.floor(userLevel - (userLevel * factor)),
				max = Math.ceil(userLevel + (userLevel * factor));
			let level = Math.floor(Math.random() * (max - min) + min);
			if (level < 1) level = 1;
			//if (DEBUG) console.log("👿 Monster.returnNewMonsterLevel()",userLevel,min,max,level);
			return level;
		} catch (err) {
			console.error(err);
		}
	}

	/**
	 *	Add a product monster (contains checks)
	 */
	function add(mid) {
		try {
			// don't show if game isn't running in full mode
			if (!pageData.activeOnPage || tally_options.gameMode !== "full") return;
			// only proceed if mid is valid
			if (!mid || mid <= 0) return;
			if (DEBUG) console.log('👿 ⊙⊙⊙!⊙ Monster.add()', mid, tally_nearby_monsters[mid]);
			// set currentMID
			currentMID = mid;
			// reset / create new stats for monster
			Stats.reset("monster");
			// display it on the page
			display(tally_nearby_monsters[mid]);
		} catch (err) {
			console.error(err);
		}
	}
	/**
	 *	Display a monster on the page (call add() first)
	 */
	function display(monster) {
		try {
			if (DEBUG) console.log('👿 ⊙⊙⊙⊙! Monster.display()', monster);
			// show dialogue
			Dialogue.show(DialogueData.get(["monster", "display", null]), true);
			// reference to image file (moved to server )
			var url = chrome.extension.getURL(tally_meta.website + '/' + 'assets/img/monsters-300h/' + monster.mid + '-anim-sheet.png');
			//var url = chrome.extension.getURL('assets/img/472-master-3d-test.png');

			// set monster image
			$('.tally_monster_sprite_inner').css('background-image', 'url( ' + url + ')');

			// turn monster to face Tally
			if (prop(tally_nearby_monsters[monster.mid].facing) && tally_nearby_monsters[monster.mid].facing == "1")
				$('.tally_monster_sprite_container').css('transform', 'scale(-.5,.5)'); // left
			else
				$('.tally_monster_sprite_container').css('transform', 'scale(.5,.5)'); // reset (right)

			// get random position
			let pos = Core.returnRandomPositionFull('.tally_monster_sprite_container');
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
			$(document).on("mouseover", ".tally_monster_sprite_container", function() {
				let mid = Number($(this).attr('data-mid'));
				//if (DEBUG) console.log(mid);
				// show dialogue with sound but don't add to queue in case they click
				Dialogue.show(DialogueData.get(["battle", "choose", null]), true, false);
			});
			$(document).on("click", ".tally_monster_sprite_container", function() {
				let mid = Number($(this).attr('data-mid'));
				//if (DEBUG) console.log(mid);
				// launch battle
				Battle.start(mid);
			});

			// // temp: show growl
			// $.growl({
			// 	title: "LAUNCHING MONSTER!!!",
			// 	message: "MONSTER: " + MonsterData.dataById[mid].name + " [" + mid + "] "
			// });

			// saveMonster
			tally_nearby_monsters[monster.mid] = monster;
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
			if (!tally_nearby_monsters || objLength(tally_nearby_monsters) <= 0) return;

			// TESTING
			let mid = randomObjKey(tally_nearby_monsters),
				_stage = 3;
			tally_nearby_monsters[mid] = create(mid, _stage);
			tally_nearby_monsters[mid].captured = 0;
			tally_nearby_monsters[mid].missed = 0;
			if (DEBUG) console.log("👿 ⊙⊙⊙⊙⊙ Monster.test()", MonsterData.dataById[mid]);
			// save
			TallyStorage.saveData("tally_nearby_monsters", tally_nearby_monsters, "👿 Monster.test()");
			// set the skin color
			Skin.setStage(tally_nearby_monsters[mid].stage);
			Dialogue.show(DialogueData.get(["monster", "show", null]), true);
			add();
		} catch (err) {
			console.error(err);
		}
	}

	/**
	 *	Save monster locally, push to background / server
	 */
	function saveAndPush(mid) {
		try {
			if (DEBUG) console.log('👿 Monster.saveAndPush()', mid, tally_nearby_monsters[mid]);
			// add monsters to tally_user
			if (tally_user.monsters[mid]) {
				tally_user.monsters[mid].level = tally_nearby_monsters[mid].level;
			} else {
				tally_user.monsters[mid] = {
					"level": tally_nearby_monsters[mid].level
				};
			}
			// save monsters
			TallyStorage.saveData("tally_nearby_monsters", tally_nearby_monsters, "👿 Monster.saveAndPush()");

			// save user in background
			TallyStorage.saveData('tally_user', tally_user, "👿 Monster.saveAndPush()");
			// create object
			var backgroundMonsterUpdate = TallyStorage.newBackgroundMonsterUpdate(mid);
			// store the nearby monster in it
			backgroundMonsterUpdate.monsterData = tally_nearby_monsters[mid];
			// then push to the server
			sendBackgroundMonsterUpdate(backgroundMonsterUpdate);
			// finally reset monster
			reset(mid);
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
			// if (tally_nearby_monsters[mid])
			// 	delete tally_nearby_monsters[mid];
			// reset them all
			tally_nearby_monsters = {};
			monster = {};
			TallyStorage.saveData("tally_nearby_monsters", tally_nearby_monsters, "👿 Monster.reset()");
			// set the skin color
			Skin.setStage(0);
		} catch (err) {
			console.error(err);
		}
	}


	// PUBLIC
	return {
		create: function(mid) {
			return create(mid);
		},
		add: function(mid) {
			add(mid);
		},
		currentMID: currentMID,
		current: function() {
			return tally_nearby_monsters[currentMID];
		},
		saveAndPush: function(mid) {
			return saveAndPush(mid);
		},
		test: test,
		returnNewMonsterLevel: returnNewMonsterLevel
	};
}());
