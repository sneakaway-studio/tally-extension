"use strict";

var Monster = (function() {

	let MONSTER_DEBUG = true,
		currentMID = "",
		secondsBeforeDelete = 300; // 60 seconds for testing

	/**
	 *	Test to make sure API is working
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
		if (MONSTER_DEBUG) console.log("+++++ Monster.test()", MonsterData.dataById[_mid]);
		// save
		saveNearbyMonsters();
		// set the skin color
		Skin.setStage(tally_nearby_monsters[_mid].stage);
		currentMID = _mid;
		Thought.showThought(Thought.getThought(["monster", "launch", 0]), true);
		launch(_mid);
        // testing
        //capture(_mid);
	}


	/**
	 *	Initial check function, refreshes nearby monsters from back end continues to next
	 */
	function check() {
		// don't check if disabled
		if (tally_options.gameMode === "disabled") return;
		checkNearbyMonsterTimes();
	}

	/**
	 *	Make sure all monsters are nearby, deletes those that aren't
	 */
	function checkNearbyMonsterTimes() {
		let now = Date.now(),
			highestStage = 0;
		// make sure tally_nearby_monsters exists
		if (tally_nearby_monsters && objLength(tally_nearby_monsters) > 0) {
			// loop through them
			for (var mid in tally_nearby_monsters) {
				// how long has it been since this monster was seen?
				// if longer than 5 mins (300 secs) then delete
				let seconds = ((now - tally_nearby_monsters[mid].updatedAt) / 1000);
				if ((seconds) > secondsBeforeDelete) {
					if (MONSTER_DEBUG) console.log("..... Monster.checkNearbyMonsterTimes() -> DELETING", MonsterData.dataById[mid].slug, "seconds", seconds);
					delete tally_nearby_monsters[mid];
				}
				// skin should reflect highest stage
				if (prop(tally_nearby_monsters[mid]) && tally_nearby_monsters[mid].stage > highestStage)
					highestStage = tally_nearby_monsters[mid].stage;
			}
		}
		saveNearbyMonsters();
		// set the skin color
		Skin.setStage(highestStage);
		// continue
		checkForTagMatches();
	}

	/**
	 *	Check the page for a monster
	 */
	function checkForTagMatches() {
		//console.log('>>>>> Monster.check()', pageData.tags);
		// loop through the tags on the page
		for (var i = 0, l = pageData.tags.length; i < l; i++) {
			// save reference
			let tag = pageData.tags[i];
			// if tag is in list
			if (MonsterData.idsByTag[tag]) {
				// save reference
				let arr = MonsterData.idsByTag[tag];
				// the monster id that will be picked
				let mid = 0;
				// if there are matches...
				if (arr.length > 1) {
					// pick random monster id from list, this will be the page monster
					mid = arr[Math.floor(Math.random() * arr.length)];
					if (MONSTER_DEBUG) console.log('!!!!! Monster.checkForTagMatches() -> #' + tag, "has", arr.length, 'MATCHES', arr, "randomly selecting...", MonsterData.dataById[mid].slug);
					// we have identified a match, let's handle the monster
					handleMatch(mid);
					break;
				}
			}
		}
	}


	/**
	 *	Create a monster
	 */
	function create(_mid, _stage = 1) {
		if (!prop(_mid) || !prop(_stage) || !prop(MonsterData.dataById[_mid])) return;
		if (MONSTER_DEBUG) console.log('..... Monster.create()', _mid, _stage, MonsterData.dataById[_mid]);
		let monster = {
			"captured": 0,
			"missed": 0,
			"facing": MonsterData.dataById[_mid].facing,
			"level": 1,
			"mid": _mid,
			"stage": _stage,
			"slug": MonsterData.dataById[_mid].slug,
			"updatedAt": Date.now()
		};
		if (tally_user.monsters[_mid] && tally_user.monsters[_mid].level)
			monster.level = tally_user.monsters[_mid].level + 1;
		return monster;
	}

	/**
	 *	A monster has been matched to page tags, handle it
	 */
	function handleMatch(mid) {
		let launchMonster = false;

		// if the monster id does not exist in nearby
		if (!prop(tally_nearby_monsters[mid])) {
			// add it
			tally_nearby_monsters[mid] = create(mid);
		}
		// otherwise monster has been seen before
		else {
			// randomizer
			let r = Math.random();
			// what stage are we at with this monster?
			if (tally_nearby_monsters[mid].stage == 0) {
				// do nothing
			} else if (tally_nearby_monsters[mid].stage == 1) {
				if (r < 0.2) {
					// go back to normal stage
					tally_nearby_monsters[mid].stage == 0
				} else if (r < 0.4) {
					// do nothing
				} else if (r < 0.7) {
					// show them a thought but don't change stage
					Thought.showThought(Thought.getThought(["monster", "far", 0]), true);
				} else {
					// or prompt stage 2
					tally_nearby_monsters[mid].stage = 2;
					Thought.showThought(Thought.getThought(["monster", "close", 0]), true);
				}
			} else if (tally_nearby_monsters[mid].stage == 2) {
				if (r < 0.4) {
					// do nothing
				} else if (r < 0.7) {
					// show them a thought
					Thought.showThought(Thought.getThought(["monster", "close", 0]), true);
				} else {
					// or prompt stage 3 - launch
					tally_nearby_monsters[mid].stage = 3;
					launchMonster = true;
				}
			}

			//if (MONSTER_DEBUG) console.log('!!!!! Monster.handleMatch()', MonsterData.dataById[mid].slug, tally_nearby_monsters[mid]);
		}
		if (MONSTER_DEBUG) console.log('!!!!! Monster.handleMatch()', MonsterData.dataById[mid].slug, "stage =", tally_nearby_monsters[mid].stage);
		// set skin
		Skin.setStage(tally_nearby_monsters[mid].stage);
		// save monsters
		saveNearbyMonsters();
		// should we launch a monster?
		if (launchMonster) {
			currentMID = mid;
			Thought.showThought(Thought.getThought(["monster", "launch", 0]), true);
			launch(mid);
		}
	}

	/**
	 *	Launch a product monster
	 */
	function launch(mid) {
		// don't launch them if game isn't running in full mode
		if (tally_options.gameMode != "full") return;
		if (MONSTER_DEBUG) console.log('!!!!! Monster.launch()', mid, tally_nearby_monsters[mid]);

		// if they already have this one, add and increase the level
		if (tally_user.monsters[mid])
			tally_nearby_monsters[mid].level = tally_user.monsters[mid].level + 1;
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
		console.log("!!!!! Monster.launchFrom()", _mid, _pos, tally_nearby_monsters[_mid]);

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
			capture(_mid);
		});
        // TESTING
        //capture(_mid);
	}


	/**
	 *	User captures monster
	 */
	function capture(_mid) {
		tally_nearby_monsters[_mid].captured = 1;
		tally_nearby_monsters[_mid].missed = 0;
		// move monster and show award
		moveMonsterToAward(_mid);
		showAward(_mid);
		// save and push results to server
		saveAndPush(_mid);
	}
	/**
	 *	Move monster down to award area
	 */
	function moveMonsterToAward(_mid) {
		console.log("!!!!! Monster.moveMonsterToAward()", _mid, tally_nearby_monsters[_mid]);

		let _scale = pageData.browser.width > 1200 ? 0.85 : 0.65; // increase scale w/larger screens

		// get monster position
		let pos = $('.tally_monster_sprite_container').position();
		// stop current animation
		$('.tally_monster_sprite_container').css({
			'animation-name': 'none',
			'left': (pos.left - 70) + 'px',
			'top': (pos.top - 70) + 'px',
		});
		// add new css keyframe
		addKeyFrames(
			'moveToAward',
			//'from{ background-color: red;}' +
			'to{ transform: scale(' + _scale + ',' + _scale + '); left: 30%; top: ' + (pageData.browser.height - 370) + 'px;}'
		);
		// start animation
		$('.tally_monster_sprite_container').css({
			'animation-name': 'moveToAward',
			'animation-duration': '0.5s',
			'animation-delay': '0.25s',
			'animation-direction': 'normal',
			'animation-iteration-count': 1,
			'animation-fill-mode': 'forwards'
		});
	}

	/**
	 *	User misses monster
	 */
	function miss(_mid) {
		console.log("!!!!! Monster.miss()", _mid, tally_nearby_monsters[_mid]);
		// stop current animation
		$('.tally_monster_sprite_container').css({
			'animation-name': 'none',
		});
		// set missed instead of captured
		tally_nearby_monsters[_mid].captured = 0;
		tally_nearby_monsters[_mid].missed = 1;
		// save and push results to server
		saveAndPush(_mid);
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
	 * Play award animation
	 */
	function showAward(mid) {
		console.log("+++++ Monster.showAward()", mid);

		// insert text
		$('.award_title').html("YOU CONTAINED THE MONSTER!!!!!");
		$('.award_subtitle').html("You leveled up! <a href='https://tallygame.net/signup'> Check out your score</a>");
		$('.award_did_you_know').html("<h6>Did you know?</h6>");
        let fact = Thought.getFact("trackers");
        let str = fact.fact || "";
        if (fact.url && fact.source) str += "Source: <a href='"+ fact.url +"' target='_blank'>"+ fact.source +"</a>";
        if (fact.year) str += " ("+ fact.year +")";
		$('.award_fact').html(str);

		var insertTimeline = anime.timeline();
		insertTimeline
			.add({
				targets: '.tally_award_background',
				rotate: -20,
				translateY: [{
						value: -1400,
						duration: 2000,
						delay: 0,
						elasticity: 100
					},
					{
						value: 1400,
						duration: 2000,
						delay: 6000,
						elasticity: 0
					}
				],
				easing: 'easeInOutCubic',
			})
			.add({
				targets: '.tally_award_text',
				translateX: [{
						value: -800,
						duration: 2000,
						delay: 600,
						elasticity: 0
					},
					{
						value: 800,
						duration: 2000,
						delay: 4000,
						elasticity: 0
					}
				],
				easing: 'easeOutExpo',
				offset: 900
			});

		// hide monster
		window.setTimeout(function() {
            // TESTING
            // return;

			// get monster position
			let pos = $('.tally_monster_sprite_container').position(),
				w = $('.tally_monster_sprite_container').width() / 2,
				h = $('.tally_monster_sprite_container').height() / 2;
			// stop current animation
			$('.tally_monster_sprite_container').css({
				'animation-name': 'none',
				'left': (pos.left - 70) + 'px',
				'top': (pos.top - 70) + 'px',
			});
			// add new css keyframe
			addKeyFrames(
				'hideBelow',
				//'from{ background-color: red;}' +
				'to{ top: 1000px; }'
			);
			// start animation
			$('.tally_monster_sprite_container').css({
				'animation-name': 'hideBelow',
				'animation-duration': '0.5s',
				'animation-direction': 'normal',
				'animation-iteration-count': 1,
				'animation-fill-mode': 'forwards'
			});
		}, 7000);


	}

	/**
	 *	Reset monster
	 */
	function reset(mid) {
		if (tally_nearby_monsters[mid])
			delete tally_nearby_monsters[mid];
		saveNearbyMonsters();
	}

	/**
	 *	Save the nearby monsters
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
     *	Return the current monster MID
     */
	function getCurrent() {
		return currentMID;
	}

	// PUBLIC
	return {
		check: check,
		current: getCurrent,
		test: test
	};
}());
