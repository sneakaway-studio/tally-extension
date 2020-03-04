"use strict";

window.MonsterCheck = (function() {

	let DEBUG = Debug.ALL.MonsterCheck,
		highestStage = 0,
		secondsBeforeDelete = 300; // 60 seconds for testing





	/**
	 *	Initial check function, error checking, refreshes nearby monsters from backend continues to next
	 */
	function check() {
		try {
			// allow offline
			if (Page.mode().notActive) return;
			// don't allow if mode disabled or stealth
			if (tally_options.gameMode === "disabled" || tally_options.gameMode === "stealth") return;
			// don't check on our site
			if (Page.data.domain == "tallygame.net") return;

			checkNearbyMonsterTimes();

		} catch (err) {
			console.error(err);
		}
	}

	/**
	 *	Make sure all monsters are nearby, deletes those that aren't
	 */
	function checkNearbyMonsterTimes() {
		try {
			let log = "👿 MonsterCheck.checkNearbyMonsterTimes()";
			if (DEBUG) Debug.dataReportHeader(log, "⊙", "before", 30);

			let now = Date.now(),
				deleteList = [];
			// make sure tally_nearby_monsters exists
			if (tally_nearby_monsters && FS_Object.objLength(tally_nearby_monsters) > 0) {
				if (DEBUG) console.log(log, "[1] -> tally_nearby_monsters =", tally_nearby_monsters);
				// loop through them
				for (var mid in tally_nearby_monsters) {
					if (tally_nearby_monsters.hasOwnProperty(mid)) {
						// how long has it been since this monster was seen?
						// if longer than 5 mins (300 secs) then delete
						let seconds = ((now - tally_nearby_monsters[mid].updatedAt) / 1000);
						if ((seconds) > secondsBeforeDelete) {
							deleteList.push(MonsterData.dataById[mid].slug);
							delete tally_nearby_monsters[mid];
						}
						// if there are any leftover stage 3's
						else if (tally_nearby_monsters[mid].stage == 3) {
							delete tally_nearby_monsters[mid];
						}
					}
				}
			}
			// log deleted to console
			if (DEBUG)
				if (deleteList.length > 0)
					console.log(log, "[2] -> DELETING", deleteList);
			TallyStorage.saveData("tally_nearby_monsters", tally_nearby_monsters, log);

			// set the skin color
			Skin.updateFromHighestMonsterStage();
			// continue
			checkForTagMatches();
		} catch (err) {
			console.error(err);
		}
	}

	/**
	 *	Check the page for a monster
	 */
	function checkForTagMatches() {
		try {
			let log = "👿 MonsterCheck.checkForTagMatches()";
			if (DEBUG) console.log(log, '[1] -> Page.data.tags =', Page.data.tags);

			// loop through the tags on the page
			for (var i = 0, l = Page.data.tags.length; i < l; i++) {
				// save reference
				let tag = Page.data.tags[i];
				// if tag is in list
				if (MonsterData.idsByTag[tag]) {
					// save reference to related monster ids
					let arr = MonsterData.idsByTag[tag];
					// if there is at least one match...
					if (arr.length > 0) {
						// pick random monster id from list, this will be the page monster
						let randomMID = arr[Math.floor(Math.random() * arr.length)];
						// return if not a number or not found in dataById
						if (isNaN(randomMID) || !prop(MonsterData.dataById[randomMID])) return;
						if (DEBUG) console.log(log, '[2] -> #' + tag + " has", arr.length,
							'MATCH(ES) (' + arr + ') randomly selecting:', MonsterData.dataById[randomMID].slug);
						// we have identified a match, let's handle the monster
						handleMatch(randomMID);
						break;
					}
				}
			}
		} catch (err) {
			console.error(err);
		}
	}


	/**
	 *	A monster has been matched to page tags, either
	 *	1. add it to tally_nearby_monsters
	 *	2. or, if it is already "nearby", then determine if its stage will advance
	 */
	function handleMatch(mid) {
		try {
			let log = "👿 MonsterCheck.handleMatch()";
			if (DEBUG) console.log(log, '[1] mid=' + mid);
			if (mid && mid > 0 && tally_nearby_monsters && MonsterData.dataById[mid] && tally_nearby_monsters[mid]) {
				if (DEBUG) console.log(log, MonsterData.dataById[mid].slug,
					"stage=" + tally_nearby_monsters[mid].stage);
			}

			// will we add the monster
			let addMonster = false;

			// if the monster id does not exist in nearby_monsters
			if (!prop(tally_nearby_monsters[mid])) {
				if (DEBUG) console.log(log, '[2] mid NOT IN nearby_monsters');
				// add it
				tally_nearby_monsters[mid] = Monster.create(mid);
			}
			// otherwise monster has been seen before
			else {
				// randomizer
				let r = Math.random();

				// gameMode === testing
				if (["demo", "testing"].includes(tally_options.gameMode)) {
					tally_nearby_monsters[mid].stage = FS_Number.clamp(tally_nearby_monsters[mid].stage + 1, 0, 3);
					if (tally_nearby_monsters[mid].stage >= 3) addMonster = true;
					if (DEBUG) console.log(log, '[3] stage =', tally_nearby_monsters[mid].stage);
				}
				// stage 0
				else if (tally_nearby_monsters[mid].stage == 0) {
					// do nothing
					Dialogue.showTrackerDialogue();
				}
				// stage 1
				else if (tally_nearby_monsters[mid].stage == 1) {
					if (r < 0.1) {
						// go back to normal stage
						tally_nearby_monsters[mid].stage = 0;
						Dialogue.showStr("Want to give feedback? Click the survey button in the top-right menu.", "question");
					} else if (r < 0.4) {
						// random dialogue, but don't change stage
						Dialogue.showTrackerDialogue();
					} else if (r < 0.7) {
						// random dialogue, but don't change stage
						Dialogue.show(Dialogue.get(["monster", "far", null]), true);
					} else {
						// or prompt stage 2
						tally_nearby_monsters[mid].stage = 2;
						Dialogue.show(Dialogue.get(["monster", "close", null]), true);
					}
				}
				// stage 2
				else if (tally_nearby_monsters[mid].stage == 2) {
					if (r < 0.2) {
						// do nothing
					} else if (r < 0.4) {
						// random dialogue, but don't change stage
						Dialogue.showTrackerDialogue();
					} else if (r < 0.7) {
						// random dialogue, but don't change stage
						Dialogue.show(Dialogue.get(["monster", "close", null]), true);
					} else {
						// or prompt stage 3 - add
						tally_nearby_monsters[mid].stage = 3;
						addMonster = true;
					}
				}
				// save to log after code above
				if (DEBUG) console.log(log, '[4] -> monster =', MonsterData.dataById[mid].slug, tally_nearby_monsters[mid]);
			}
			// save monsters
			TallyStorage.saveData("tally_nearby_monsters", tally_nearby_monsters, log);
			// should we show the monster on the page?
			if (addMonster) {
				// show monster on page
				Monster.showOnPage(mid);
			}

			// check/reset skin
			Skin.updateFromHighestMonsterStage();
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
			TallyStorage.saveData("tally_nearby_monsters", tally_nearby_monsters, "👿 MonsterCheck.reset()");

			// check/reset skin
			Skin.updateFromHighestMonsterStage();
		} catch (err) {
			console.error(err);
		}
	}


	// PUBLIC
	return {
		check: check
	};
}());
