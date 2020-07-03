"use strict";

window.MonsterCheck = (function () {

	let DEBUG = Debug.ALL.MonsterCheck,
		highestStage = 0,
		potential = 0.5, // potential a monster will appear
		secondsBeforeDelete = 300; // 60 seconds for testing





	/**
	 *	Initial check function, error checking, refreshes nearby monsters from backend continues to next
	 */
	function check() {
		try {
			// allow offline
			if (Page.data.mode.notActive) return;
			// don't allow if mode disabled or stealth
			if (T.tally_options.gameMode === "disabled" || T.tally_options.gameMode === "stealth") return;
			// don't check on our site
			if (Page.data.domain == "tallygame.net" || Page.data.domain == "tallysavestheinternet.com") return;

			// set potential based on level
			if (T.tally_user.level < 5) {
				// increase potential
				potential = 0.95;
			}

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
			if (DEBUG) Debug.dataReportHeader(log, "#", "before", 15);

			let now = Date.now(),
				deleteList = [];
			// make sure T.tally_nearby_monsters exists
			if (T.tally_nearby_monsters && FS_Object.objLength(T.tally_nearby_monsters) > 0) {
				if (DEBUG) console.log(log, "[1] -> T.tally_nearby_monsters =", T.tally_nearby_monsters);
				// loop through them
				for (var mid in T.tally_nearby_monsters) {
					if (T.tally_nearby_monsters.hasOwnProperty(mid)) {
						// how long has it been since this monster was seen?
						// if longer than 5 mins (300 secs) then delete
						let seconds = ((now - T.tally_nearby_monsters[mid].updatedAt) / 1000);
						if ((seconds) > secondsBeforeDelete) {
							deleteList.push(MonsterData.dataById[mid].slug);
							delete T.tally_nearby_monsters[mid];
						}
						// if there are any leftover stage 3's
						else if (T.tally_nearby_monsters[mid].stage == 3) {
							delete T.tally_nearby_monsters[mid];
						}
					}
				}
			}
			// log deleted to console
			if (DEBUG)
				if (deleteList.length > 0) console.log(log, "[2] -> DELETING", deleteList);
			// save
			TallyStorage.saveData("tally_nearby_monsters", T.tally_nearby_monsters, log);

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

			// only proceed if there are trackers
			if (FS_Object.objLength(Page.data.trackers.found) < 1) {
				if (DEBUG) console.log(log, "[1] NO TRACKERS ON THIS PAGE - Page.data.trackers" + Page.data.trackers);
				// return;
			}
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
	 *	1. add it to T.tally_nearby_monsters
	 *	2. or, if it is already "nearby", then determine if its stage will advance
	 */
	function handleMatch(mid) {
		try {
			let log = "👿 MonsterCheck.handleMatch()";
			// if (DEBUG) console.log(log, '[1] mid=' + mid);
			if (mid && mid > 0 && T.tally_nearby_monsters && MonsterData.dataById[mid] && T.tally_nearby_monsters[mid]) {
				if (DEBUG) console.log(log, MonsterData.dataById[mid].slug, "stage=" + T.tally_nearby_monsters[mid].stage);
			}

			// will we show monster on the page
			let showMonster = false,
				distance = "",
				advance = false;

			// if the monster id does not exist in nearby_monsters
			if (!prop(T.tally_nearby_monsters[mid])) {
				if (DEBUG) console.log(log, '[2] mid ' + mid + ' NOT IN nearby_monsters');
				// add it
				T.tally_nearby_monsters[mid] = Monster.create(mid);
			}
			// otherwise monster has been seen before
			else {
				// randomizer - the higher it is the more likely monster will appear
				let r = Math.random();

				// gameMode === testing || demo
				if (["demo", "testing"].includes(T.tally_options.gameMode)) {
					T.tally_nearby_monsters[mid].stage = FS_Number.clamp(T.tally_nearby_monsters[mid].stage + 1, 0, 3);
					if (T.tally_nearby_monsters[mid].stage >= 3)
						showMonster = true;
					// if (DEBUG) console.log(log, '[3] stage =', T.tally_nearby_monsters[mid].stage);
				}
				// STAGE == 0
				else if (T.tally_nearby_monsters[mid].stage == 0) {
					// do nothing
					showDialogueAboutQuantity();
				}
				// STAGE == 1
				else if (T.tally_nearby_monsters[mid].stage == 1) {
					if (r < 0.05) {
						// go back to normal stage
						T.tally_nearby_monsters[mid].stage = 0;
						// Dialogue.showSurveyPrompt();
					} else if (r < 0.2) {
						// random dialogue, but don't change stage
						showDialogueAboutQuantity();
					} else if (r < 0.4) {
						// random dialogue, but don't change stage
						distance = "far";
					} else {
						// 60%
						advance = true;
					}
					// additional chance for new players
					if (advance || potential > 0.5) {
						// advance to stage 2
						T.tally_nearby_monsters[mid].stage = 2;
					}
				}
				// STAGE == 2
				else if (T.tally_nearby_monsters[mid].stage == 2) {
					// random dialogue, but don't change stage
					if (r < 0.2) {
						showDialogueAboutQuantity();
					} else if (r < 0.4) {
						distance = "close";
					} else {
						// 60%
						advance = true;
					}
					// additional chance for new players
					if (advance || potential > 0.5) {
						// advance to stage 3 - add
						T.tally_nearby_monsters[mid].stage = 3;
						showMonster = true;
					}
				}
				// save to log after code above
				if (DEBUG) console.log(log, '[4] -> monster =', MonsterData.dataById[mid].slug, T.tally_nearby_monsters[mid]);
			}






			// save monsters
			TallyStorage.saveData("tally_nearby_monsters", T.tally_nearby_monsters, log);
			// if set, show monster on page
			if (showMonster) Monster.showOnPage(mid);
			// check/reset skin
			Skin.updateFromHighestMonsterStage();
			// always show something (after the skin has updated)
			showSilhouetteDialogue(mid, distance);
		} catch (err) {
			console.error(err);
		}
	}



	/**
	 *	Return quantity of trackers
	 */
	function returnTrackerQuantity() {
		try {
			let str = "none";
			if (FS_Object.objLength(Page.data.trackers.found) > 0) str = "few";
			if (FS_Object.objLength(Page.data.trackers.found) > 3) str = "lots";
			// if (DEBUG) console.log("👿 MonsterCheck.returnTrackerQuantity() str=" + str);
			return str;
		} catch (err) {
			console.error(err);
		}
	}
	/**
	 *	Show a comment about trackers
	 */
	function showDialogueAboutQuantity() {
		try {
			Dialogue.showData(Dialogue.getData({
				category: "tracker",
				subcategory: returnTrackerQuantity()
			}));
		} catch (err) {
			console.error(err);
		}
	}

	/**
	 *	Show a comment about trackers
	 */
	function showDialogueAboutProximity(distance) {
		try {
			if (DEBUG) console.log("👿 MonsterCheck.showDialogueAboutProximity() distance=" + distance);
			Dialogue.showData(Dialogue.getData({
				category: "monster",
				subcategory: distance
			}));
		} catch (err) {
			console.error(err);
		}
	}


	/**
	 *	Show monster silhouette in dialogue
	 */
	function showSilhouetteDialogue(mid, distance = "") {
		try {
			let str = "",
				monster = T.tally_nearby_monsters[mid];
			if (DEBUG) console.log("👿 MonsterCheck.showSilhouetteDialogue() mid=" + mid, monster);

			// console.log(monster);

			// set tutorial sequence active
			Tutorial.sequenceActive = true;

			// set monster image
			let url = T.tally_meta.website + '/' + 'assets/img/monsters/monsters-140h-solid-lt-purple/' + monster.mid + '-anim-sheet.png';

			// set background color
			let bgColor = Skin.currentSkinObj.front || "rgba(70,24,153,1)";
	
			// turn monster to face Tally
			let scale = 1,
				flipStyle = "transform:scale(" + scale + "," + scale + ");"; // default
			if (prop(T.tally_nearby_monsters[monster.mid].facing) && T.tally_nearby_monsters[monster.mid].facing == "1")
				flipStyle = "transform:scale(-" + scale + "," + scale + ");"; // left

			// string for dialogue box
			str += "<div class='tally tally-dialogue-with-img' style='background-color: " + bgColor + "'>";
			str += "<div class='tally monster_sprite_outer_dialogue' style='" + flipStyle + "''>";
			str += "<div class='tally monster_sprite_inner_dialogue' style='background-image:url( " + url + " )'></div>";
			str += "<img src='" + url + "' class='monster_sprite_dialogue_loader' style='display:none'>"; // load here so we can check it is loaded in Dialogue
			str += "</div>";
			str += "</div>";

			// the text tally says
			str += "<div class='dialogue_text_after_image'>";
			if (monster.stage === 3)
				str += "There's a level " + monster.level + " " + monster.name + " monster on this page!";
			else if (distance !== "" && distance == "close")
				str += "A " + monster.name + " monster is hiding on this website!";
			else
				str += "There is a " + monster.name + " monster on this site!";
			str += "</div>";

			// show dialogue with badge image
			Dialogue.showData({
				text: str,
				mood: "excited"
			}, {
				instant: true
			});

			setTimeout(function () {
				// set tutorial sequence active
				Tutorial.sequenceActive = false;
			}, 2000);


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
			// if (T.tally_nearby_monsters[mid])
			// 	delete T.tally_nearby_monsters[mid];

			// reset them all
			T.tally_nearby_monsters = {};
			TallyStorage.saveData("tally_nearby_monsters", T.tally_nearby_monsters, "👿 MonsterCheck.reset()");

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
