"use strict";

var Monster = (function() {

	let MONSTER_DEBUG = true,
		current = "",
		secondsBeforeDelete = 300; // 60 seconds for testing

	let animePath = {},
		animePathAnimation = {};


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
		tally_nearby_monsters[_mid].captured = 1;
		tally_nearby_monsters[_mid].missed = 0;
		if (MONSTER_DEBUG) console.log("+++++ Monster.test()", MonsterData.dataById[_mid]);
		// save
		saveNearbyMonsters();
		// set the skin color
		Skin.setStage(tally_nearby_monsters[_mid].stage);
		current = _mid;
		Thought.showThought(Thought.getThought(["monster", "launch", 0]), true);
		launch(_mid);
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
			current = mid;
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
		$.growl({
			title: "LAUNCHING MONSTER!!!",
			message: "MONSTER: " + MonsterData.dataById[mid].name + " [" + mid + "] "
		});

	}

	function launchFrom(_mid, _pos) {
		console.log("!!!!! Monster.launchFrom()", _mid, _pos, tally_nearby_monsters[_mid]);

		let _duration = ((pageData.browser.width / 15) + 3800) /*+ (tally_nearby_monsters[_mid].level * 100)*/ , // animation duration
			_direction = "normal", // default animation direction
			_scale = pageData.browser.width > 1200 ? 0.65 : 0.5, // increase scale w/larger screens
			pathID = randomObjKey(MonsterPaths); // pick a random path

		// position monster path
		$('.monster_path').css({
			'top': MonsterPaths[pathID].y,
			'left': MonsterPaths[pathID].x
		});
		// set data for monster path
		$('.monster_path path').attr('d', MonsterPaths[pathID].d);
		// set viewbox for monster path
		$('.monster_path').attr('viewBox', '0 0 ' + MonsterPaths[pathID].scale + ' ' + MonsterPaths[pathID].scale);

		// set position monster (off screen)
		$('.tally_monster_sprite_container').css({
			'top': MonsterPaths[pathID].y - 250,
			'left': MonsterPaths[pathID].x - 200,
			'display': 'block',
			'opacity': 1,
			'transform': 'scale(' + _scale + ')'
		});
		$('.tally_monster_sprite').css({
			'transform': 'scale(' + _scale + ')'
		});

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

		// path for animation
		animePath = anime.path('.monster_path path');
        // start animation
		animePathAnimation = anime({
			targets: '.tally_monster_sprite_container',
			translateX: animePath('x'),
			translateY: animePath('y'),
			//rotate: path('angle'),
			easing: 'linear',
			duration: _duration,
			direction: _direction, 
			loop: 1, // true will loop, for testing
            // if monster completes it's loop without user clicking call miss()
			complete: function(anim) {
				//console.log(anim.completed);
                miss(_mid);
			}
		});

        // add click handler
		$(document).on('click', '.tally_monster_sprite', function() {
            if (!prop(tally_nearby_monsters[_mid])) return;
			capture(_mid);
		});
	}


	/**
	 *	User captures monster
	 */
	function capture(_mid) {
		// pause animation
		animePathAnimation.pause();
		// show award
		showAward(_mid);
		// save and push results to server
		saveAndPush(_mid);
	}


	/**
	 *	User misses monster
	 */
	function miss(_mid) {
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
		if (MONSTER_DEBUG) console.log('<{!}> Monster.saveAfterLaunch()', _mid, tally_nearby_monsters[_mid]);
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
		// store the text

		// get the url for the monster sprite
		var url = chrome.extension.getURL('assets/img/monsters/' + mid + '-anim-sheet.png');
		// set monster sprite
		$('.tally_award_monster').css('background-image', 'url( ' + url + ')');

		// insert the text in all these
		$('.award_title').html("You caught the monster");
		$('.award_subtitle').html("You leveled up");
		$('.award_fact_title').html("Did you know?");
		$('.award_fact').html(Thought.getFact("trackers"));

		console.log("+++++ Monster.showAward()", mid);

		// move it into position
		var basicTimeline = anime.timeline();
		basicTimeline
			.add({
				targets: '.tally_award_background',
				rotate: {
					value: -20,
				},
				translateY: -1000,
				easing: 'easeInOutCubic',
				/*direction: 'alternate',
				delay: 1000,*/

			})
			.add({
				targets: '.tally_award_monster',
				translateY: -500,
				easing: 'easeOutExpo'
			})
			.add({
				targets: '.tally_award_text',
				translateX: -450,
				easing: 'easeOutExpo'
			});
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

	function getCurrent() {
		return current;
	}

	// PUBLIC
	return {
		check: check,
		current: getCurrent,
		test: test
	};
}());
