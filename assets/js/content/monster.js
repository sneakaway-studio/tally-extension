"use strict";

var Monster = (function() {

	let MONSTER_DEBUG = true,
		currentMID = "",
		secondsBeforeDelete = 300; // 60 seconds for testing








	/**
	 *	Display a monster on the page
	 */
	function display(_mid) {
		// don't launch them if game isn't running in full mode
		if (tally_options.gameMode != "full") return;

// testing
if (_mid == null || !tally_nearby_monsters[_mid])
	// add one
	_mid = test();


		if (MONSTER_DEBUG) console.log('⊙⊙⊙!⊙ Monster.display()', _mid, tally_nearby_monsters[_mid]);

		// reference to image file
		var url = chrome.extension.getURL('assets/img/monsters/' + _mid + '-anim-sheet.png');
		// set content
		$('.tally_monster_sprite_inner').css('background-image', 'url( ' + url + ')');

		// let pos = "bottom";
		// launchFrom(_mid, pos);

		// temp: show growl
		$.growl({
			title: "LAUNCHING MONSTER!!!",
			message: "MONSTER: " + MonsterData.dataById[_mid].name + " [" + _mid + "] "
		});

		// set scale based on screen size
		let _scale = pageData.browser.width > 1200 ? 0.75 : 0.65;
		$('.tally_monster_sprite_container').css({
			'transform': 'scale(' + _scale + ')'
		});
		// face monster left
		if (prop(tally_nearby_monsters[_mid].facing) && tally_nearby_monsters[_mid].facing == "1"){
			$('.tally_monster_sprite_inner').css('transform', 'scaleX(-1)');
		}


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
		if (MONSTER_DEBUG) console.log("⊙⊙⊙⊙⊙ Monster.test()", MonsterData.dataById[_mid]);
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
		//capture(_mid);
	}


	/**
	 *	Create a monster
	 */
	function create(_mid, _stage = 1) {
		if (!prop(_mid) || !prop(_stage) || !prop(MonsterData.dataById[_mid])) return;
		if (MONSTER_DEBUG) console.log('⊙!⊙⊙⊙ Monster.create()', _mid, _stage, MonsterData.dataById[_mid]);
		let monster = {
			"totalCaptured": 0,
			"captured": 0,
			"missed": 0,
			"facing": MonsterData.dataById[_mid].facing,
			"level": 1,
			"mid": _mid,
			"stage": _stage,
			"slug": MonsterData.dataById[_mid].slug,
			"updatedAt": Date.now()
		};
		// if it already exists then make it the number of captures +1
		if (tally_user.monsters[_mid])
			monster.totalCaptured = tally_user.monsters[_mid].captured;
		//if (MONSTER_DEBUG) console.log('⊙!⊙⊙⊙ Monster.create()', _mid, monster,tally_user.monsters[_mid]);
		return monster;
	}



	/**
	 *	Launch a product monster
	 */
	function launch(mid) {
		// don't launch them if game isn't running in full mode
		if (tally_options.gameMode != "full") return;
		if (MONSTER_DEBUG) console.log('⊙⊙⊙!⊙ Monster.launch()', mid, tally_nearby_monsters[mid]);

		// if they already have this one, add and increase the level
//		if (tally_user.monsters[mid])
//			tally_nearby_monsters[mid].level = tally_user.monsters[mid].level + 1;
		// reference to image file
		var url = chrome.extension.getURL('assets/img/monsters/' + mid + '-anim-sheet.png');
		// set content
		$('.tally_monster_sprite_inner').css('background-image', 'url( ' + url + ')');

		let pos = "bottom";
		launchFrom(mid, pos);

		// temp: show growl
		// $.growl({
		// 	title: "LAUNCHING MONSTER!!!",
		// 	message: "MONSTER: " + MonsterData.dataById[mid].name + " [" + mid + "] "
		// });

	}

	function launchFrom(_mid, _pos) {
		console.log("⊙⊙⊙⊙! Monster.launchFrom()", _mid, _pos, tally_nearby_monsters[_mid]);

		let _duration = ((pageData.browser.width / 15) + 3800) /*+ (tally_nearby_monsters[_mid].level * 100)*/ , // animation duration
			_direction = "normal", // default animation direction
			_scale = pageData.browser.width > 1200 ? 0.65 : 0.5; // increase scale w/larger screens

		// set direction of monster (default is normal, i.e. right)
		if (prop(tally_nearby_monsters[_mid].facing)) {
			// set direction left
			if (tally_nearby_monsters[_mid].facing == -1)
				_direction = "reverse";
			// pick random
			else if (tally_nearby_monsters[_mid].facing == 0) {
				let r = Math.random();
				if (r < 0.5)
					_direction = "reverse";
			}
		}

		// set start / end positions
		// need to add some randomness here
		let coords = {
			speed: 1,
			start: {
				x: -300,
				y: (pageData.browser.height * 0.25) + (Math.random() * (pageData.browser.height * 0.5))
			},
			end: {
				x: pageData.browser.width + 300,
				y: pageData.browser.height / 2 - 200
			}
		};
		//console.log("coords", coords);

		// add animation keyframes
		addKeyFrames(
			'leftToRight',
			'0%{ left: ' + coords.start.x + 'px; top: ' + coords.start.y + 'px;}' +
			'100%{ left: ' + coords.end.x + 'px; top: ' + coords.end.y + 'px;}'
		);
		// start animation
		$('.tally_monster_sprite_container').css({
			'animation-name': 'leftToRight',
			'animation-duration': '4s',
			'animation-iteration-count:': 1,
			'-webkit-animation-iteration-count': ' 1',
			'animation-direction': _direction,
			'animation-fill-mode': 'forwards',
			'display': 'block',
			'opacity': 1
		});
		$('.tally_monster_sprite_container').css({
			'transform': 'scale(' + _scale + ')'
		});

		// add event listener to check when done
		$(".tally_monster_sprite_container")
			.one("animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd", function() {
				console.log("animation done", tally_nearby_monsters[_mid]);
				// code to execute after animation ends
				if (prop(tally_nearby_monsters[_mid]) && tally_nearby_monsters[_mid].captured == 0)
					miss(_mid);
			});

		// add click handler
		$(document).on('click', '.tally_monster_sprite', function() {
			if (!prop(tally_nearby_monsters[_mid])) return;
			// remove the click listener from the monster
			$('.tally_monster_sprite').off("click");
			// capture the monster
			capture(_mid);
		});

		// TESTING
		//capture(_mid);
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
		if (MONSTER_DEBUG) console.log('<{!}> Monster.saveAndPush()', _mid, tally_nearby_monsters[_mid]);
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
			return display(mid);
		},
		current: getCurrent,
		test: test,
		testLaunch: testLaunch
	};
}());
