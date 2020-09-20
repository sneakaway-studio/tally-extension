/**
 * 	Check for monsters on a page
 */

/* jshint strict: true */
window.MonsterCheck = (function() {
	"use strict";

	let DEBUG = Debug.ALL.MonsterCheck,
		highestStage = 0,
		potential = 0.5, // potential a monster will appear
		secondsBeforeDelete = 1 * 60 * 60, // seconds to keep a monster in the nearby_monsters queue
		foundStreamSummary = [ /* {mid: 000, stage: 1, tracker: "domain.com"} */ ];




	/**
	 *	Initial check function, error checking, refreshes nearby monsters from backend continues to next
	 */
	function check() {
		try {
			// allow offline
			if (Page.data.mode.notActive) return;
			// don't allow if mode disabled
			if (T.tally_options.gameMode === "disabled") return;
			// don't check on our site
			if (Page.data.domain == "tallygame.net" || Page.data.domain == "tallysavestheinternet.com") return;
			if (Page.data.actions.onTallyWebsite) return;

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
	async function checkNearbyMonsterTimes() {
		try {
			let log = "👿 MonsterCheck.checkNearbyMonsterTimes()";
			if (DEBUG) Debug.dataReportHeader(log, "#", "before", 15);

			let now = Date.now(),
				deleteList = [];
			// make sure T.tally_nearby_monsters exists
			if (T.tally_nearby_monsters && FS_Object.objLength(T.tally_nearby_monsters) > 0) {
				if (DEBUG) console.log(log, "[1] T.tally_nearby_monsters =", T.tally_nearby_monsters);
				// loop through them
				for (var mid in T.tally_nearby_monsters) {
					if (T.tally_nearby_monsters.hasOwnProperty(mid)) {
						// how long has it been since this monster was seen?
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
				if (deleteList.length > 0) console.log(log, "[2] DELETING", deleteList);
			// save
			TallyStorage.saveData("tally_nearby_monsters", T.tally_nearby_monsters, log);

			// set the skin color
			Skin.updateFromHighestMonsterStage();


			// only proceed if there are trackers
			if (FS_Object.objLength(Page.data.trackers.found) < 1) {
				if (DEBUG) console.log(log, "[3] NO TRACKERS ON THIS PAGE - Page.data.trackers =", Page.data.trackers);
				return;
			}

			// update stage 0 monsters using tags
			T.tally_tag_matches.s0 = await returnTagMatches();

			// update stage 1, 2, 3 monsters
			[T.tally_tag_matches.s1, T.tally_tag_matches.s2, T.tally_tag_matches.s3] = await returnMonsterStages();

			// update stages in background
			TallyStorage.saveData("tally_tag_matches", T.tally_tag_matches, "👿 MonsterCheck.checkNearbyMonsterTimes()");

			if (DEBUG) console.log(log, '[4] T.tally_tag_matches =', T.tally_tag_matches);

			if (T.tally_tag_matches.s0.length > 0)
				// once it returns, pick one from stage0 to elevate
				handleMatch(FS_Object.randomArrayIndexFromRange(T.tally_tag_matches.s0, 0, 5));


		} catch (err) {
			console.error(err);
		}
	}


	/**
	 *	Return mids from tag matches for stage0
	 */
	async function returnTagMatches() {
		try {
			let log = "👿 MonsterCheck.returnTagMatches()",
				arr = [];

			if (DEBUG) console.log(log, '[1] Page.data.tags =', Page.data.tags);

			// for each tag
			for (let i = 0, l = Page.data.tags.length; i < l; i++) {
				// if tag matches a monster
				if (MonsterData.idsByTag[Page.data.tags[i]]) {
					// if (DEBUG) console.log(log, '[2.1] #' + Page.data.tags[i], MonsterData.idsByTag[Page.data.tags[i]]);

					// add all mids from tag
					arr = arr.concat(
						MonsterData.idsByTag[Page.data.tags[i]]
					);
				}
			}
			// if (DEBUG) console.log(log, '[2.2] arr =', arr);
			arr = FS_Object.sortArrayByOccuranceRemoveDuplicates(arr);
			// if (DEBUG) console.log(log, '[2.3] arr (sorted) =', arr);

			return arr;

		} catch (err) {
			console.error(err);
		}
	}

	/**
	 *	Update object that stores mids found on page by stage
	 */
	async function returnMonsterStages() {
		try {
			let log = "👿 MonsterCheck.returnMonsterStages()",
				obj = { // store mids found on page by their current stage
					"s0": [], // newly discovered
					"s1": [], // randomly upgrade to #2
					"s2": [], // queued to appear on page next time there is a match
					"s3": [] // display on page
				};

			// FILL STAGES 1,2,3 FROM tally_nearby_monsters

			// for each mid in tally_nearby_monsters
			for (let mid in T.tally_nearby_monsters) {
				if (T.tally_nearby_monsters.hasOwnProperty(mid)) {
					if (!FS_Object.prop(T.tally_nearby_monsters[mid])) continue;
					if (DEBUG) console.log(log, '[2] mid =', mid);
					// add the mid to the array
					obj["s" + T.tally_nearby_monsters[mid].stage].push(Number(mid));
				}
			}
			// if (DEBUG) console.log(log, '[2.1] obj =', obj);

			return [obj.s1, obj.s2, obj.s3];

		} catch (err) {
			console.error(err);
		}
	}


	/**
	 *	A monster has been matched to page tags, either
	 *	1. add it to T.tally_nearby_monsters
	 *	2. or, if it is already "nearby", then determine if its stage will advance
	 */
	async function handleMatch(mid) {
		try {
			let log = "👿 MonsterCheck.handleMatch()";
			if (DEBUG) console.log(log, '[1] mid=' + mid);
			if (mid && mid !== 'undefined' && !isNaN(mid) && mid > 0 && T.tally_nearby_monsters &&
				MonsterData.dataById[mid] && T.tally_nearby_monsters[mid]) {
				if (DEBUG)
					console.log(log, MonsterData.dataById[mid].slug, "stage=" + T.tally_nearby_monsters[mid].stage);
			}

			// will we show monster on the page
			let showMonster = false,
				distance = "",
				advance = false,
				dialogue = "";

			// if the monster id does not exist in tally_nearby_monsters
			if (!FS_Object.prop(T.tally_nearby_monsters[mid])) {
				if (DEBUG) console.log(log, '[2] mid ' + mid + ' NOT IN tally_nearby_monsters');
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
					dialogue = "showDialogueAboutQuantity";
				}
				// STAGE == 1
				else if (T.tally_nearby_monsters[mid].stage == 1) {
					if (r < 0.05) {
						// go back to normal stage
						T.tally_nearby_monsters[mid].stage = 0;
						// do we show notifications?
						if (T.tally_options.showNotifications) Dialogue.showSurveyPrompt();
					} else if (r < 0.2) {
						// random dialogue, but don't change stage
						dialogue = "showDialogueAboutQuantity";
					} else if (r < 0.4) {
						// random dialogue, but don't change stage
						distance = "far";
					}
					// set advance - 70%
					if (r < 0.7) {
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
					// set advance - 70%
					if (r < 0.7) {
						advance = true;
					} else {
						// random dialogue, but don't change stage
						if (r < 0.2) {
							dialogue = "showDialogueAboutQuantity";
						} else if (r < 0.4) {
							distance = "close";
						}
					}
					// additional chance for new players
					if (advance || potential > 0.5) {
						// advance to stage 3 - add
						T.tally_nearby_monsters[mid].stage = 3;
						showMonster = true;
					}
				}
				// save to log after code above
				if (DEBUG) console.log(log, '[4] monster =', MonsterData.dataById[mid].slug, T.tally_nearby_monsters[mid]);
			}
			// update stage 1,2,3 monsters
			[T.tally_tag_matches.s1, T.tally_tag_matches.s2, T.tally_tag_matches.s3] = await returnMonsterStages();
			// update stages in background
			TallyStorage.saveData("tally_tag_matches", T.tally_tag_matches, log);

			// update the list of found monsters
			saveFoundForServer();
			// save monsters
			TallyStorage.saveData("tally_nearby_monsters", T.tally_nearby_monsters, log);

			// wait a moment to show on page; gives badges a chance to finish
			setTimeout(function() {
				if (dialogue === "showDialogueAboutQuantity") {
					showDialogueAboutQuantity();
				}
				// if set, show monster on page
				if (showMonster) Monster.showOnPage(mid);
				// check/reset skin
				Skin.updateFromHighestMonsterStage();
				// always show something (after the skin has updated)
				showSilhouetteDialogue(mid, distance);
			}, 1000);


		} catch (err) {
			console.error(err);
		}
	}


	/**
	 *	Update the found list
	 */
	function saveFoundForServer() {
		try {
			for (let mid in T.tally_nearby_monsters) {
				if (T.tally_nearby_monsters.hasOwnProperty(mid)) {
					if (!FS_Object.prop(T.tally_nearby_monsters[mid])) continue;
					foundStreamSummary.push({
						mid: T.tally_nearby_monsters[mid].mid,
						level: T.tally_nearby_monsters[mid].level,
						stage: T.tally_nearby_monsters[mid].stage,
						tracker: T.tally_nearby_monsters[mid].tracker.domain,
					});
				}
			}
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
			// do we show notifications?
			if (!T.tally_options.showNotifications) return;

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
			// do we show notifications?
			if (!T.tally_options.showNotifications) return;

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
			// don't allow if mode disabled or stealth
			if (T.tally_options.gameMode === "disabled" || T.tally_options.gameMode === "stealth") return;
			// do we show notifications?
			if (!T.tally_options.showNotifications) return;

			let str = "",
				monster = T.tally_nearby_monsters[mid];
			if (DEBUG) console.log("👿 MonsterCheck.showSilhouetteDialogue() mid=" + mid, monster);

			// console.log(monster);

			// set tutorial sequence active
			Tutorial.sequenceActive = true;

			// set monster image
			// remote version that doesn't work with CORS for some reason
			let url = T.tally_meta.website + '/' + 'assets/img/monsters/monsters-140h-solid-lt-purple/' + monster.mid + '-anim-sheet.png';
			// local version
			url = chrome.extension.getURL('assets/img/monsters/monsters-140h-solid-lt-purple/' + monster.mid + '-anim-sheet.png');


			// set background color
			let bgColor = Skin.currentSkinObj.front || "rgba(70,24,153,1)";

			// turn monster to face Tally
			let scale = 1,
				flipStyle = "transform:scale(" + scale + "," + scale + ");"; // default
			if (FS_Object.prop(T.tally_nearby_monsters[monster.mid].facing) && T.tally_nearby_monsters[monster.mid].facing == "1")
				flipStyle = "transform:scale(-" + scale + "," + scale + ");"; // left

			// string for dialogue box
			str += "<div class='tally tally-dialogue-with-img' style='display:hidden; left:-500px; background-color: " + bgColor + "'>";
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

			setTimeout(function() {
				// set tutorial sequence active
				Tutorial.sequenceActive = false;
			}, 2000);


		} catch (err) {
			console.error(err);
		}
	}







	// PUBLIC
	return {
		check: check,

		get foundStreamSummary() {
			return foundStreamSummary;
		},

	};
}());
