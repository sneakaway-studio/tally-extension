"use strict";

window.Monster = (function() {

	/**
	 *	1. MonsterCheck determines which monsters are nearby and calls Monster.create(_mid)
	 *	2. MonsterCheck determines which monsters are advancing to new stages
	 *	3. MonsterCheck calls Monster.show() if it reaches stage 3
	 *	4.
	 */

	let DEBUG = true,
		currentMID = 0,
		secondsBeforeDelete = 300; // 60 seconds for testing

	/**
	 *	Create a new monster object and return
	 */
	function create(_mid, _stage = 1) {
		if (!prop(_mid) || !prop(_stage) || !prop(MonsterData.dataById[_mid])) return;
		if (DEBUG) console.log('👿 ⊙!⊙⊙⊙ Monster.create()1', "_mid=" + _mid, "_stage=" + _stage, MonsterData.dataById[_mid]);
		tally_nearby_monsters[_mid] = {
			"stage": _stage,
			"level": returnMonsterLevel(),
			"slug": MonsterData.dataById[_mid].slug,
			"mid": _mid,
			"attacks": AttackData.returnMultipleAttacks(3),
			"totalCaptured": 0,
			"captured": 0,
			"missed": 0,
			"facing": MonsterData.dataById[_mid].facing,
			"stats": Stats.resetMonsterStats(_mid),
			"updatedAt": Date.now()
		};
		// if it already exists then make it the number of captures +1
		if (tally_user.monsters[_mid])
			tally_nearby_monsters[_mid].totalCaptured = tally_user.monsters[_mid].captured;
		if (DEBUG) console.log('👿 ⊙!⊙⊙⊙ Monster.create()2', _mid, tally_nearby_monsters[_mid], tally_user.monsters[_mid]);
		// save
		TallyStorage.saveData("tally_nearby_monsters",tally_nearby_monsters);
		return tally_nearby_monsters[_mid];
	}
	/**
	 *	Determine and return a monster's level
	 */
	function returnMonsterLevel() {
		let userLevel = tally_user.score.level,
			factor = 0.5;
		if (userLevel > 15) factor = 0.4;
		if (userLevel > 30) factor = 0.2;
		if (userLevel > 60) factor = 0.1;
		let min = Math.floor(userLevel - (userLevel * factor)),
			max = Math.ceil(userLevel + (userLevel * factor));
		let level = Math.floor(Math.random() * (max - min) + min);
		//if (r < 2) r = 2;
		return level;
	}

	/**
	 *	Add a product monster (contains checks)
	 */
	function add(_mid) {
		if (!_mid || _mid <= 0) return;
		if (DEBUG) console.log('👿 ⊙⊙⊙!⊙ Monster.add()', _mid, tally_nearby_monsters[_mid]);
		// don't show if game isn't running in full mode
		if (tally_options.gameMode != "full") return;
		// set currentMID
		currentMID = _mid;
		// display it on the page
		display(tally_nearby_monsters[_mid]);
	}
	/**
	 *	Display a monster on the page (call add() first)
	 */
	function display(monster) {
		if (DEBUG) console.log('👿 ⊙⊙⊙⊙! Monster.display()', monster);
		// show thought
		Thought.showThought(Thought.getThought(["monster", "display", 0]), true);

		// if they already have this one, add and increase the level
		//		if (tally_user.monsters[mid])
		//			tally_nearby_monsters[mid].level = tally_user.monsters[mid].level + 1;

		// reference to image file
		var url = chrome.extension.getURL('assets/img/monsters-300h/' + monster.mid + '-anim-sheet.png');
		// set content
		$('.tally_monster_sprite_inner').css('background-image', 'url( ' + url + ')');
		// position and show
		$('.tally_monster_sprite_container').attr('data-mid',monster.mid);
		Core.setElementAbsolute('.tally_monster_sprite_container');
		Core.setRandomPositionFull('.tally_monster_sprite_container');
		Core.showElement('.tally_monster_sprite_container');

		// set scale (formerly did this based on screen size)
		//let _scale = pageData.browser.width > 1200 ? 0.8 : 0.7;
		// now for hiding monster on page
		let _scale = 0.5;
		$('.tally_monster_sprite_container').css({
			'transform': 'scale(' + _scale + ')'
		});

		// add listeners
		$(document).on("mouseover", ".tally_monster_sprite_container", function() {
			let mid = Number($(this).attr('data-mid'));
			//console.log(mid);
			Thought.showThought(Thought.getThought(["battle", "choose", 0]), true);
		});
		$(document).on("click", ".tally_monster_sprite_container", function() {
			let mid = Number($(this).attr('data-mid'));
			//console.log(mid);
			// launch battle
			Battle.start(mid);
		});
		// // temp: show growl
		// $.growl({
		// 	title: "LAUNCHING MONSTER!!!",
		// 	message: "MONSTER: " + MonsterData.dataById[_mid].name + " [" + _mid + "] "
		// });


		// turn monster to face Tally
		if (prop(tally_nearby_monsters[_mid].facing) && tally_nearby_monsters[_mid].facing == "1")
			$('.tally_monster_sprite_container').css('transform', 'scaleX(-1)'); // left
		else
			$('.tally_monster_sprite_container').css('transform', 'scaleX(1)'); // reset (right)

		// saveMonster
		tally_nearby_monsters[monster.mid] = monster;
	}


	/**
	 *	Add a test monster
	 */
	function test() {
		// make sure there are monsters nearby
		if (!tally_nearby_monsters || objLength(tally_nearby_monsters) <= 0) return;

		// TESTING
		let _mid = randomObjKey(tally_nearby_monsters),
			_stage = 3;
		tally_nearby_monsters[_mid] = create(_mid, _stage);
		tally_nearby_monsters[_mid].captured = 0;
		tally_nearby_monsters[_mid].missed = 0;
		if (DEBUG) console.log("👿 ⊙⊙⊙⊙⊙ Monster.test()", MonsterData.dataById[_mid]);
		// save
		TallyStorage.saveData("tally_nearby_monsters",tally_nearby_monsters);
		// set the skin color
		Skin.setStage(tally_nearby_monsters[_mid].stage);
		Thought.showThought(Thought.getThought(["monster", "show", 0]), true);
		add();
	}


	function generateMonsterValues() {

		// generate a monsterLevel
		// monsterLevel = tallyLevel + frequency + randomness
		// 	7		+     (-2)    +     +/- Math.random() * (tallyLevel * .2 )
		// 	7		+     (0)    +     +/- 1
		// 	7		+     (4)   +     +/- 1

		// generate the health, str, df
		// health = monsterLevel * monster.health;


	}




	/**
	 *	Save monster locally, push to background / server
	 */
	function saveAndPush(_mid) {
		if (DEBUG) console.log('👿 <{!}> Monster.saveAndPush()', _mid, tally_nearby_monsters[_mid]);
		// add monsters to tally_user
		if (tally_user.monsters[_mid]) {
			tally_user.monsters[_mid].level = tally_nearby_monsters[_mid].level;
		} else {
			tally_user.monsters[_mid] = {
				"level": tally_nearby_monsters[_mid].level
			};
		}
		// save monsters
		TallyStorage.saveData("tally_nearby_monsters",tally_nearby_monsters);

		// save user in background
		TallyStorage.saveData(tally_user);
		// create backgroundUpdate object
		var backgroundMonsterUpdate = newBackgroundMonsterUpdate(_mid);
		// store the nearby monster in it
		backgroundMonsterUpdate.monsterData = tally_nearby_monsters[_mid];
		// then push to the server
		sendBackgroundMonsterUpdate(backgroundMonsterUpdate);
		// finally reset monster
		reset(_mid);
	}




	/**
	 *	Reset monster
	 */
	function reset(mid) {
		// reset one
		// if (tally_nearby_monsters[mid])
		// 	delete tally_nearby_monsters[mid];
		// reset them all
		tally_nearby_monsters = {};
		monster = {};
		TallyStorage.saveData("tally_nearby_monsters",tally_nearby_monsters);
		// set the skin color
		Skin.setStage(0);
	}


	// PUBLIC
	return {
		create: function(mid) {
			return create(mid);
		},
		add: function(mid) {
			add(mid);
		},
		currentMID: function(){
			return currentMID;
		},
		current: function(){
			return tally_nearby_monsters[currentMID];
		},
		saveAndPush: function(mid) {
			return saveAndPush(mid);
		},
		test: test,
	};
}());
