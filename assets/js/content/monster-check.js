"use strict";

var MonsterCheck = (function() {

	let DEBUG = true,
		currentMID = "",
		secondsBeforeDelete = 300; // 60 seconds for testing





	/**
	 *	Initial check function, refreshes nearby monsters from back end continues to next
	 */
	function check() {
		// don't check if disabled
		if (pageData.domain == "tallygame.net" ||
			tally_options.gameMode === "disabled" ||
			!pageData.activeOnPage) return;
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
					if (DEBUG) console.log("⊙⊙⊙⊙⊙ MonsterCheck.checkNearbyMonsterTimes() -> DELETING", MonsterData.dataById[mid].slug, "seconds", seconds);
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
		//if (DEBUG) console.log('⊙⊙⊙⊙⊙ MonsterCheck.checkForTagMatches()', pageData.tags);
		// loop through the tags on the page
		for (var i = 0, l = pageData.tags.length; i < l; i++) {
			// save reference
			let tag = pageData.tags[i];
			// if tag is in list
			if (MonsterData.idsByTag[tag]) {
				// save reference to related monster ids
				let arr = MonsterData.idsByTag[tag];
				// if there is at least one match...
				if (arr.length > 0) {
					// pick random monster id from list, this will be the page monster
					let mid = arr[Math.floor(Math.random() * arr.length)];
					if (DEBUG) console.log('!⊙⊙⊙⊙ MonsterCheck.checkForTagMatches() -> #' + tag,
											"has", arr.length, 'MATCH(ES)', arr,
											"randomly selecting...", MonsterData.dataById[mid].slug);
					// we have identified a match, let's handle the monster
					handleMatch(mid);
					break;
				}
			}
		}
	}




	/**
	 *	A monster has been matched to page tags, handle it
	 */
	function handleMatch(mid) {
		//if (DEBUG) console.log('⊙⊙!⊙⊙ MonsterCheck.handleMatch()', MonsterData.dataById[mid].slug, "stage="+tally_nearby_monsters[mid].stage);

		// will we launch the monster
		let launchMonster = false;

		// if the monster id does not exist in nearby_monsters
		if (!prop(tally_nearby_monsters[mid])) {
			// add it
			tally_nearby_monsters[mid] = Monster.create(mid);
		}
		// otherwise monster has been seen before
		else {
			// randomizer
			let r = Math.random();
			// what stage are we at with this monster?
			if (tally_nearby_monsters[mid].stage == 0) {
				// do nothing
				Thought.showTrackerThought();
			} else if (tally_nearby_monsters[mid].stage == 1) {
				if (r < 0.1) {
					// go back to normal stage
					tally_nearby_monsters[mid].stage = 0;
					Thought.showString("Want to give feedback? Click the survey button in the top-right menu.", "question");
				} else if (r < 0.4) {
					// show them a random thought, but don't change stage
					Thought.showTrackerThought();
				} else if (r < 0.7) {
					// show them a random thought, but don't change stage
					Thought.showThought(Thought.getThought(["monster", "far", 0]), true);
				} else {
					// or prompt stage 2
					tally_nearby_monsters[mid].stage = 2;
					Thought.showThought(Thought.getThought(["monster", "close", 0]), true);
				}
			} else if (tally_nearby_monsters[mid].stage == 2) {
				if (r < 0.2) {
					// do nothing
				} else if (r < 0.4) {
					// show them a random thought, but don't change stage
					Thought.showTrackerThought();
				} else if (r < 0.7) {
					// show them a random thought, but don't change stage
					Thought.showThought(Thought.getThought(["monster", "close", 0]), true);
				} else {
					// or prompt stage 3 - launch
					tally_nearby_monsters[mid].stage = 3;
					launchMonster = true;
				}
			}

			//if (DEBUG) console.log('!!!!! MonsterCheck.handleMatch()', MonsterData.dataById[mid].slug, tally_nearby_monsters[mid]);
		}
		if (DEBUG) console.log('⊙⊙!⊙⊙ MonsterCheck.handleMatch()', MonsterData.dataById[mid].slug, "stage="+ tally_nearby_monsters[mid].stage);
		// set skin
		Skin.setStage(tally_nearby_monsters[mid].stage);
		// save monsters
		saveNearbyMonsters();
		// should we launch a monster?
		if (launchMonster) {
			currentMID = mid;
			// show thought
			Thought.showThought(Thought.getThought(["monster", "launch", 0]), true);
			Monster.launch(mid);
		}
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
		check: check,
		current: getCurrent
	};
}());
