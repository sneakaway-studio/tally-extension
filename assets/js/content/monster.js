"use strict";

var Monster = (function() {

	let MONSTER_DEBUG = true,
		current = "";

	/**
	 *	Initial check function, refreshes recent monsters from back end continues to next
	 */
	function check() {
		// don't check if disabled
		if (tally_options.gameMode === "disabled") return;
		checkRecentTimes();
	}

	/**
	 *	Make sure all monster are recent
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
				if ((seconds) > 60) { // 60 seconds for testing
					if (MONSTER_DEBUG) console.log("..... checkRecentTimes() -> DELETING", MonsterData.dataById[mid].slug, "seconds", seconds);
					delete tally_recent_monsters[mid];
				}
				// skin should reflect highest stage
				if (prop(tally_recent_monsters[mid]) && tally_recent_monsters[mid].stage > highestStage)
					highestStage = tally_recent_monsters[mid].stage;
			}
		}
		// set the skin color
		setSkinStage(highestStage);
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
				let mid = 0;
				// if there are matches...
				if (arr.length > 1) {
					// pick random monster id from list, this will be the page monster
					mid = arr[Math.floor(Math.random() * arr.length)];
					if (MONSTER_DEBUG) console.log('!!!!! #' + tag, "has", arr.length, 'MATCHES', arr, "randomly selecting...", MonsterData.dataById[mid].slug);
					// we have identified a match, let's handle the monster
					handleMatch(mid);
				}
			}
		}
		if (MONSTER_DEBUG) console.log('>>>>> Monster.checkForTagMatches()', JSON.stringify(tally_recent_monsters));
	}


	/**
	 *	A monster has been matched to page tags, handle it
	 */
	function handleMatch(mid) {
		let now = Date.now();

		// does the monster id exist in recent?
		if (!prop(tally_recent_monsters[mid])) {
			// add it
			tally_recent_monsters[mid] = {
				"stage": 1,
				"slug": MonsterData.dataById[mid].slug,
				"updatedAt": now
			};
		}
		// otherwise monster has been stored
		else {
			// randomizer
			let r = Math.random();
			// what stage are we at with this monster?
			if (tally_recent_monsters[mid].stage == 0) {

			} else if (tally_recent_monsters[mid].stage == 1) {
				if (r < 0.3) {
					// do nothing
				} else if (r < 0.6) {
					// show them a thought
					Thought.showThought(Thought.getThought(["monster", "far", 0]), true);
				} else {
					// or prompt stage 2
					tally_recent_monsters[mid].stage = 2;
					Thought.showThought(Thought.getThought(["monster", "close", 0]), true);
				}
			} else if (tally_recent_monsters[mid].stage == 2) {
				if (r < 0.3) {
					// do nothing
				} else if (r < 0.6) {
					// show them a thought
					Thought.showThought(Thought.getThought(["monster", "close", 0]), true);
				} else {
					// or prompt stage 3
					tally_recent_monsters[mid].stage = 3;
					current = mid;
					Thought.showThought(Thought.getThought(["monster", "launch", 0]), true);
					launch(mid);
				}
			}

			if (MONSTER_DEBUG) console.log('!!!!! handleMatch()', MonsterData.dataById[mid].slug, tally_recent_monsters[mid]);
		}
		// set skin
		setSkinStage(tally_recent_monsters[mid].stage);
		saveRecentMonsters();
	}
	/**
	 *	Set the skin color
	 */
	function setSkinStage(n) {
		let stageColors = [
			"color-magenta",
			"color-yellow",
			"color-orange",
			"color-red"
		];
		Skin.set(stageColors[n]);
	}

	/**
	 *	Launch a product monster
	 */
	function launch(mid, stage) {
		let monster = MonsterData.dataById[mid],
			duration = 4500,
			top = 600;

		// insert monster

		// reference to image file
		var url = chrome.extension.getURL('assets/img/monsters/' + monster.mid + '-anim-sheet.png');
		// set content
		$('.tally_monster_sprite').css('background-image', 'url( ' + url + ')');

		// hide outside page
		$('.tally_monster_sprite').css({
			'top': pageData.browser.height + 100 + "px", // hide it up
			'left': (pageData.browser.width / 2) - 250 + "px", // center
			'display': 'block',
			'opacity': 1
		});
		// animate up
		var anim = anime({
			targets: '.tally_monster_sprite',
			translateY: {
				delay: 500, // wait for page to load
				value: -top,
				duration: duration
			},
			begin: function() { // play sound n milliseconds after animation begins
				//playSound('powerup',0,10);
			}
		});



		$.growl({
			title: "LAUNCHING MONSTER!!!",
			message: "MONSTER: " + monster.name + " [" + monster.mid + "] <br>STAGE: " + stage
		});


		// temp: call after capture OR miss
		setTimeout(function() {
			reset(mid);
		}, 2000);
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
	 *	Save the recent
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
		current: getCurrent
	};
}());
