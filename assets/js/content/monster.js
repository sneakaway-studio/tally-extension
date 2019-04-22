"use strict";

window.Monster = (function() {

	let DEBUG = true,
		currentMID = "",
		secondsBeforeDelete = 300; // 60 seconds for testing


	var monsterStats = {
		"health":100,
		"attack":100,
		"stamina":100,
		"accuracy":100,
		"evasion":100,
		"defense":100,
	};

	function stats(_stats){
		if (_stats && _stats.health){
			// update stats
			monsterStats = _stats;
		}
		return monsterStats;
	}


	/**
	 *	Create a monster (and return its data)
	 */
	function create(_mid, _stage = 1) {
		if (!prop(_mid) || !prop(_stage) || !prop(MonsterData.dataById[_mid])) return;
		if (DEBUG) console.log('⊙!⊙⊙⊙ Monster.create()', "_mid="+_mid, "_stage="+_stage, MonsterData.dataById[_mid]);
		let monster = {
			"totalCaptured": 0,
			"captured": 0,
			"missed": 0,
			"facing": MonsterData.dataById[_mid].facing,
			"level": 1,
			"mid": _mid,
			"stage": _stage,
			"stats": stats(),
			"slug": MonsterData.dataById[_mid].slug,
			"updatedAt": Date.now()
		};
		// if it already exists then make it the number of captures +1
		if (tally_user.monsters[_mid])
			monster.totalCaptured = tally_user.monsters[_mid].captured;
		//if (DEBUG) console.log('⊙!⊙⊙⊙ Monster.create()', _mid, monster,tally_user.monsters[_mid]);
		return monster;
	}




	/**
	 *	Display a monster on the page
	 */
	function display(_mid) {
		// don't launch them if game isn't running in full mode
		if (tally_options.gameMode != "full") return;

// // testing
// if (_mid == null || !tally_nearby_monsters[_mid])
// 	// add one
// 	_mid = test();

tally_nearby_monsters[_mid] = create(_mid,3);


		if (DEBUG) console.log('⊙⊙⊙!⊙ Monster.display()', _mid, tally_nearby_monsters[_mid]);

		// reference to image file
		var url = chrome.extension.getURL('assets/img/monsters-300h/' + _mid + '-anim-sheet.png');
		// set content
		$('.tally_monster_sprite_inner').css('background-image', 'url( ' + url + ')');

		// let pos = "bottom";
		// MonsterAward.launchFrom(_mid, pos);

		// // temp: show growl
		// $.growl({
		// 	title: "LAUNCHING MONSTER!!!",
		// 	message: "MONSTER: " + MonsterData.dataById[_mid].name + " [" + _mid + "] "
		// });

		// set scale based on screen size
		// let _scale = pageData.browser.width > 1200 ? 0.8 : 0.7;
		// $('.tally_monster_sprite_container').css({
		// 	'transform': 'scale(' + _scale + ')'
		// });
		// ^ resize files instead



		// face monster left
		if (prop(tally_nearby_monsters[_mid].facing) && tally_nearby_monsters[_mid].facing == "1")
			$('.tally_monster_sprite_inner').css('transform', 'scaleX(-1)');
		else // reset
			$('.tally_monster_sprite_inner').css('transform', 'scaleX(1)');

		// display stats
		$('.monster_stats').html(BattleStats.returnDisplay("monster"));


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
		if (DEBUG) console.log("⊙⊙⊙⊙⊙ Monster.test()", MonsterData.dataById[_mid]);
		// save
		saveNearbyMonsters();
		// set the skin color
		Skin.setStage(tally_nearby_monsters[_mid].stage);
		currentMID = _mid;
		Thought.showThought(Thought.getThought(["monster", "launch", 0]), true);
		return currentMID;
	}

	function testLaunch(){
		launch(test());
		// testing
		//MonsterAward.capture(_mid);
	}






	/**
	 *	Launch a product monster
	 */
	function launch(mid) {
		// don't launch them if game isn't running in full mode
		if (tally_options.gameMode != "full") return;
		if (DEBUG) console.log('⊙⊙⊙!⊙ Monster.launch()', mid, tally_nearby_monsters[mid]);

		// if they already have this one, add and increase the level
//		if (tally_user.monsters[mid])
//			tally_nearby_monsters[mid].level = tally_user.monsters[mid].level + 1;
		// reference to image file
		var url = chrome.extension.getURL('assets/img/monsters-300h/' + mid + '-anim-sheet.png');
		// set content
		$('.tally_monster_sprite_inner').css('background-image', 'url( ' + url + ')');

		let pos = "bottom";
		MonsterAward.launchFrom(mid, pos);

		// temp: show growl
		// $.growl({
		// 	title: "LAUNCHING MONSTER!!!",
		// 	message: "MONSTER: " + MonsterData.dataById[mid].name + " [" + mid + "] "
		// });

	}





	function generateMonsterValues(){

		// generate a monsterLevel
		// monsterLevel = tallyLevel + frequency + randomness
		// 	7		+     (-2)    +     +/- Math.random() * (tallyLevel * .2 )
		// 	7		+     (0)    +     +/- 1
		// 	7		+     (4)   +     +/- 1

		// generate the hp, str, df
		// hp = monsterLevel * monster.hp;


	}




	/**
	 *	Save monster locally, push to background / server
	 */
	function saveAndPush(_mid) {
		if (DEBUG) console.log('<{!}> Monster.saveAndPush()', _mid, tally_nearby_monsters[_mid]);
		// add monsters to tally_user
		if (tally_user.monsters[_mid]) {
			tally_user.monsters[_mid].level = tally_nearby_monsters[_mid].level;
		} else {
			tally_user.monsters[_mid] = {
				"level": tally_nearby_monsters[_mid].level
			};
		}

		// save user in background
		saveUser();
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
		saveNearbyMonsters();
		// set the skin color
		Skin.setStage(0);
	}

	/**
	 *	Save nearby monsters
	 */
	function saveNearbyMonsters() {
		chrome.runtime.sendMessage({
			'action': 'saveNearbyMonsters',
			'data': tally_nearby_monsters
		}, function(response) {
			//console.log('<<<<< > saveNearbyMonsters()',JSON.stringify(response));
		});
		Debug.update();
	}
	/**
	 *	Return current monster MID
	 */
	function getCurrent() {
		return currentMID;
	}

	// PUBLIC
	return {
		create: function(mid){
			return create(mid);
		},
		display: function(mid){
			display(mid);
		},
		saveAndPush: function(mid){
			return saveAndPush(mid);
		},
		current: getCurrent,
		test: test,
		testLaunch: testLaunch,
		stats: function(data){
			return stats(data);
		},
	};
}());
