"use strict";

var Monster = (function() {

<<<<<<< HEAD
	let MONSTER_DEBUG = true,
		current = "",
		secondsBeforeDelete = 60; // 60 seconds for testing

	/**
	 *	Test to make sure API is working
	 */
	function test() {
		// make sure there are monsters nearby
		if (!tally_recent_monsters || objLength(tally_recent_monsters) <= 0) return;

		// TESTING
		let _mid = randomObjKey(tally_recent_monsters),
			_stage = 3;
		tally_recent_monsters[_mid] = create(_mid, _stage);
		tally_recent_monsters[_mid].captured = 1;
		if (MONSTER_DEBUG) console.log("+++++ Monster.test()", MonsterData.dataById[_mid]);
		// save
		saveRecentMonsters();
		// set the skin color
		Skin.setStage(tally_recent_monsters[_mid].stage);
		current = _mid;
		Thought.showThought(Thought.getThought(["monster", "launch", 0]), true);
		launch(_mid);
		//capture(_mid);
	}


	/**
	 *	Initial check function, refreshes recent monsters from back end continues to next
	 */
	function check() {
		// don't check if disabled
		if (tally_options.gameMode === "disabled") return;
		checkRecentTimes();
	}

	/**
	 *	Make sure all monsters are recent, deletes those that aren't
	 */
	function checkRecentTimes() {
		let now = Date.now(),
			highestStage = 0;
		// make sure tally_recent_monsters exists
		if (tally_recent_monsters && objLength(tally_recent_monsters) > 0) {
			// loop through them
			for (var mid in tally_recent_monsters) {
				// how long has it been since this monster was seen?
				// if longer than 5 mins (300 secs) then delete
				let seconds = ((now - tally_recent_monsters[mid].updatedAt) / 1000);
				if ((seconds) > secondsBeforeDelete) {
					if (MONSTER_DEBUG) console.log("..... checkRecentTimes() -> DELETING", MonsterData.dataById[mid].slug, "seconds", seconds);
					delete tally_recent_monsters[mid];
				}
				// skin should reflect highest stage
				if (prop(tally_recent_monsters[mid]) && tally_recent_monsters[mid].stage > highestStage)
					highestStage = tally_recent_monsters[mid].stage;
			}
		}
		saveRecentMonsters();
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
					if (MONSTER_DEBUG) console.log('!!!!! #' + tag, "has", arr.length, 'MATCHES', arr, "randomly selecting...", MonsterData.dataById[mid].slug);
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
			"level": 1,
			"mid": _mid,
			"stage": _stage,
			"slug": MonsterData.dataById[_mid].slug,
			"updatedAt": Date.now()
		};
		return monster;
	}

	/**
	 *	A monster has been matched to page tags, handle it
	 */
	function handleMatch(mid) {
		let launchMonster = false;

		// if the monster id does not exist in recent
		if (!prop(tally_recent_monsters[mid])) {
			// add it
			tally_recent_monsters[mid] = create(mid);
		}
		// otherwise monster has been seen before
		else {
			// randomizer
			let r = Math.random();
			// what stage are we at with this monster?
			if (tally_recent_monsters[mid].stage == 0) {
				// do nothing
			} else if (tally_recent_monsters[mid].stage == 1) {
				if (r < 0.2) {
					// go back to normal stage
					tally_recent_monsters[mid].stage == 0
				} else if (r < 0.4) {
					// do nothing
				} else if (r < 0.7) {
					// show them a thought but don't change stage
					Thought.showThought(Thought.getThought(["monster", "far", 0]), true);
				} else {
					// or prompt stage 2
					tally_recent_monsters[mid].stage = 2;
					Thought.showThought(Thought.getThought(["monster", "close", 0]), true);
				}
			} else if (tally_recent_monsters[mid].stage == 2) {
				if (r < 0.4) {
					// do nothing
				} else if (r < 0.7) {
					// show them a thought
					Thought.showThought(Thought.getThought(["monster", "close", 0]), true);
				} else {
					// or prompt stage 3 - launch
					tally_recent_monsters[mid].stage = 3;
					launchMonster = true;
				}
			}

			//if (MONSTER_DEBUG) console.log('!!!!! handleMatch()', MonsterData.dataById[mid].slug, tally_recent_monsters[mid]);
		}
		if (MONSTER_DEBUG) console.log('!!!!! Monster.handleMatch()', MonsterData.dataById[mid].slug, "stage =", tally_recent_monsters[mid].stage);
		// set skin
		Skin.setStage(tally_recent_monsters[mid].stage);
		// save monsters
		saveRecentMonsters();
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
		if (MONSTER_DEBUG) console.log('!!!!! Monster.launch()', mid, tally_recent_monsters[mid].stage);
		// don't launch them if game isn't running in full
		if (tally_options.gameMode != "full") return;

		let monster = MonsterData.dataById[mid],
			level = 1;

		// if they already have this one, increase level
		if (tally_user.monsters[mid])
			level = tally_user.monsters[mid].level + 1;
		// reference to image file
		var url = chrome.extension.getURL('assets/img/monsters/' + monster.mid + '-anim-sheet.png');
		// set content
		$('.tally_monster_sprite_inner').css('background-image', 'url( ' + url + ')');

		let pos = "bottom";
		launchFrom(mid, pos, level);

		// temp
		$.growl({
			title: "LAUNCHING MONSTER!!!",
			message: "MONSTER: " + monster.name + " [" + monster.mid + "] <br>STAGE: " + tally_recent_monsters[mid].stage
		});

		// somewhere here we would attach a click listener to the monster
		// let's assume we've done that so we can test capture()
		//capture(mid, level);

		// temp: call after capture OR miss
		setTimeout(function() {
			reset(mid);
		}, 2000);

	}

	function launchFrom(_mid, _pos, _level) {
		console.log("launchFrom()", _mid, _pos)
		let _duration = 4500,
			_top = 300;

		// hide outside page
		$('.tally_monster_sprite_container').css({
			'top': (pageData.browser.height / 2) + 100 + "px", // hide it up
			'left': (pageData.browser.width / 2) - 250 + "px", // center
			'display': 'block',
			'opacity': 1
		});
		// animate up
		var anim = anime({
			targets: '.tally_monster_sprite_container',
			translateY: {
				delay: 500, // wait for page to load
				value: -_top,
				duration: _duration
			},
			begin: function() { // play sound n milliseconds after animation begins
				//playSound('powerup',0,10);

			}
		});

		$(document).on('click', '.tally_monster_sprite', function() {
			showAward(_mid);
			capture(_mid, _level);
		});


	}


	/**
	 *	User captures monster
	 */
	function capture(mid, level) {
		if (MONSTER_DEBUG) console.log('!!!!! Monster.capture()', mid);
		// add monsters to tally_user
		if (tally_user.monsters[mid]) {
			tally_user.monsters[mid].level = level;
		} else {
			tally_user.monsters[mid] = {
				"level": level
			};
		}
		// save user in background
		saveUser();
		// create backgroundUpdate object
		var backgroundMonsterUpdate = newBackgroundMonsterUpdate(mid);
		backgroundMonsterUpdate.monsterData = tally_recent_monsters[mid];
		backgroundMonsterUpdate.monsterData.level = level;
		backgroundMonsterUpdate.monsterData.captured = tally_recent_monsters[mid].captured;
		// then push to the server
		sendBackgroundMonsterUpdate(backgroundMonsterUpdate);
		// finally reset monster
		reset(mid);
	}


	/**
	 * Play award animation
	 */
	function showAward(mid) {
		// store the text

		// get the url for the monster sprite
		var url = chrome.extension.getURL('assets/img/monsters/' + mid + '-anim-sheet.png');
		// set monster sprite
		$('.tally_award_monster').css('background', 'url( ' + url + ')')
//		$('.tally_award_monster').css('background-size','100% 100%')

		// insert the text in all these
		$('.award_title').html("You caught the monster");
		$('.award_subtitle').html("You leveled up");
		$('.award_fact_title').html("Did you know?");
		$('.award_fact').html(Thought.getFact("trackers"));

		console.log("showAward()", mid);

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
				translateY: -400,
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
		if (tally_recent_monsters[mid])
			delete tally_recent_monsters[mid];
		saveRecentMonsters();
	}

	/**
	 *	Save the recent monsters
	 */
	function saveRecentMonsters() {
		chrome.runtime.sendMessage({
			'action': 'saveRecentMonsters',
			'data': tally_recent_monsters
		}, function(response) {
			//console.log('<<<<< > saveRecentMonsters()',JSON.stringify(response));
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
=======
    let MONSTER_DEBUG = true,
        current = "",
        secondsBeforeDelete = 60; // 60 seconds for testing

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
                    if (MONSTER_DEBUG) console.log("..... checkNearbyMonsterTimes() -> DELETING", MonsterData.dataById[mid].slug, "seconds", seconds);
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
                    if (MONSTER_DEBUG) console.log('!!!!! #' + tag, "has", arr.length, 'MATCHES', arr, "randomly selecting...", MonsterData.dataById[mid].slug);
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

            //if (MONSTER_DEBUG) console.log('!!!!! handleMatch()', MonsterData.dataById[mid].slug, tally_nearby_monsters[mid]);
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

        let monster = MonsterData.dataById[mid],
            level = 1;

        // if they already have this one, increase level
        if (tally_user.monsters[mid])
            level = tally_user.monsters[mid].level + 1;
        // reference to image file
        var url = chrome.extension.getURL('assets/img/monsters/' + monster.mid + '-anim-sheet.png');
        // set content
        $('.tally_monster_sprite_inner').css('background-image', 'url( ' + url + ')');

        let pos = "bottom";
        launchFrom(mid, pos, level);

        // temp: show growl
        $.growl({
            title: "LAUNCHING MONSTER!!!",
            message: "MONSTER: " + monster.name + " [" + monster.mid + "] "
        });

        // temp: call after capture OR miss
        setTimeout(function() {
            reset(mid);
        }, 2000);

    }

    function launchFrom(_mid, _pos, _level) {
        console.log("launchFrom()", _mid, _pos)
        let _duration = 4500;

        let pathID = randomObjKey(MonsterPaths);

        let x = MonsterPaths[pathID].x,
            y = MonsterPaths[pathID].y,
            scale = MonsterPaths[pathID]['scale'];

        // position monster
        $('.tally_monster_sprite_container').css({
            'top': y - 250,
            'left': x - 200,
            'display': 'block',
            'opacity': 1
        });

        $('.monster_path').css({
            'top': y,
            'left': x
        });

        $('.monster_path path').attr('d', MonsterPaths[pathID].d);
        $('.monster_path').attr('viewBox', '0 0 ' + scale + ' ' + scale);


        $(document).on('click', '.tally_monster_sprite', function () {
            showAward(_mid);
            capture(_mid, _level);
        });

        var path = anime.path('.monster_path path');

        var motionPath = anime({
            targets: '.tally_monster_sprite_container',
            translateX: path('x'),
            translateY: path('y'),
            rotate: path('angle'),
            easing: 'linear',
            duration: _duration,
            direction: MonsterPaths[pathID]['direction'],
            loop: true
        });

    }


    /**
     *	User captures monster
     */
    function capture(mid, level) {
        if (MONSTER_DEBUG) console.log('!!!!! Monster.capture()', mid);
        // add monsters to tally_user
        if (tally_user.monsters[mid]) {
            tally_user.monsters[mid].level = level;
        } else {
            tally_user.monsters[mid] = {
                "level": level
            };
        }
        // save user in background
        saveUser();
        // create backgroundUpdate object
        var backgroundMonsterUpdate = newBackgroundMonsterUpdate(mid);
        backgroundMonsterUpdate.monsterData = tally_nearby_monsters[mid];
        backgroundMonsterUpdate.monsterData.level = level;
        backgroundMonsterUpdate.monsterData.captured = tally_nearby_monsters[mid].captured;
        backgroundMonsterUpdate.monsterData.missed = tally_nearby_monsters[mid].missed;
        // then push to the server
        sendBackgroundMonsterUpdate(backgroundMonsterUpdate);
        // finally reset monster
        reset(mid);
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

        console.log("showAward()", mid);

        // move it into position
        var basicTimeline = anime.timeline();
        basicTimeline
            .add({
				targets: '.tally_award_background',
				rotate: {
    				value: -20,
    			},
				translateY:[
				    { value: -1000, duration: 2000, delay: 0, elasticity: 100 },
				    { value: 1000, duration: 2000, delay: 6000, elasticity: 0 }
				  ],
				easing: 'easeInOutCubic',

				})
				.add({
				targets: '.tally_award_text',
				translateX: [{ value: -450, duration: 2000, delay: 600, elasticity: 0 },
				    { value: 450, duration: 2000, delay: 4500, elasticity: 0 }
				  ],
				easing: 'easeOutExpo',
				offset: 900
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
>>>>>>> 830a53db0fe16681da9fa56483c952e09f41ad6e
}());
