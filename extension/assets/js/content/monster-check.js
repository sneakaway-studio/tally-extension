/**
 * 	Check for monsters on a page
 */

/* jshint strict: true */
self.MonsterCheck = (function() {
	"use strict";

	let DEBUG = Debug.ALL.MonsterCheck,
		highestStage = 0,
		potential = 0.5, // potential a monster will appear
		secondsBeforeDelete = 1 * 60 * 60, // seconds to keep a monster in the nearby_monsters queue
		foundStreamSummary = [ /* {mid: 000, stage: 1, tracker: "domain.com"} */ ],
		savedFoundForServer = false; // prevent this from running multiple times, looking @ you youtube





	/**
	 *	Initial check function, error checking, refreshes nearby monsters from backend continues to next
	 */
	async function check() {
		try {
			// allow offline
			if (Page.data.mode.notActive) return;
			// don't allow if mode disabled
			if (T.tally_options.gameMode === "disabled") return;
			// don't check tally domains
			if ($.inArray(Page.data.domain, GameData.tallyDomains) >= 0) return;
			if (Page.data.actions.onTallyWebsite) return;

			let log = "👿 MonsterCheck.check()";

			// set potential based on level
			if (T.tally_user.level < 5) {
				// increase potential
				potential = 0.95;
			}

			if (DEBUG) Debug.dataReportHeader(log, "#", "before", 15);


			// 1. Check current nearby monsters

			// update/remove nearby monsters
			let removeOldResp = await removeOldNearbyMonsters();
			// save
			TallyStorage.saveData("tally_nearby_monsters", T.tally_nearby_monsters, log);
			if (DEBUG) console.log(log, "[1] removeOldResp =", removeOldResp);



			// 2. Get tag from page

			// save MIDs on page to stage 0
			T.tally_tag_matches.s0 = await returnTagMatches();
			// then update stage 1, 2, 3 monsters
			[T.tally_tag_matches.s1, T.tally_tag_matches.s2, T.tally_tag_matches.s3] = await returnMonsterStages();
			// save tag matches
			TallyStorage.saveData("tally_tag_matches", T.tally_tag_matches, log);
			if (DEBUG) console.log(log, "[2] T.tally_tag_matches.s0 =", T.tally_tag_matches.s0);


			// only proceed if there are trackers
			if (FS_Object.objLength(Page.data.trackers.found) < 1) {
				if (DEBUG) console.log(log, "[3] NO TRACKERS ON THIS PAGE - Page.data.trackers =", Page.data.trackers);
				// return;
			}

			// 3. Attempt tag/monster match

			let midMatched = await attemptTagMatch();

			// some monsters are too pervasive
			if (midMatched === 627 && Math.random() > 0.5) return;

			if (midMatched > -1) {
				if (DEBUG) console.log(log, "[3.1] 🙌 A MATCH ELEVATED midMatched =", midMatched);
				// if match
				handleMatch(midMatched);
			} else {
				if (DEBUG) console.log(log, "[3.2] ❌ NO MATCH ELEVATED midMatched =", midMatched);
			}
		} catch (err) {
			console.error(err);
		}
	}

	/**
	 *	Make sure all monsters are nearby, delete those that aren't
	 */
	async function removeOldNearbyMonsters() {
		try {
			let log = "👿 MonsterCheck.removeOldNearbyMonsters()";

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
				if (deleteList.length > 0) console.log(log, "[2] DELETED", deleteList);

			// set the skin color
			Skin.updateFromHighestMonsterStage();
			return true;
		} catch (err) {
			console.error(err);
		}
	}

	/**
	 *	Attempt to match page tags to monsters
	 */
	async function attemptTagMatch() {
		try {
			// make sure we have tags to choose from
			if (T.tally_tag_matches.s0.length < 1) return;

			let log = "👿 MonsterCheck.attemptTagMatch()",
				arr = [],
				midMatched = -1,
				secondsBlocked = 10 * 60,
				maxIndex = Math.min(8, T.tally_tag_matches.s0.length); // this array is sorted by occurance of tags


			if (T.tally_meta && T.tally_meta.game && T.tally_meta.game.midsRecentlyShown){
				// remove old tag matches from
				for (let mid in T.tally_meta.game.midsRecentlyShown) {
					mid = Number(mid);
					if (T.tally_meta.game.midsRecentlyShown.hasOwnProperty(mid)) {
						if (DEBUG) console.log(log, mid, "🧐 was last shown", FS_Date.diffSeconds("now", T.tally_meta.game.midsRecentlyShown[mid]), "seconds ago");

						// if time to remove from block list
						if (FS_Date.diffSeconds("now", T.tally_meta.game.midsRecentlyShown[mid]) > secondsBlocked) {
							if (DEBUG) console.log(log, "✅ REMOVING", mid, 'FROM BLOCK LIST');
							// remove it from array
							delete T.tally_meta.game.midsRecentlyShown[mid];
						}
					}
				}
			}

			// loop until we have an acceptable match to return
			let safety = 0;
			while (midMatched < 0) {
				midMatched = FS_Object.randomArrayIndexFromRange(T.tally_tag_matches.s0, 0, maxIndex);

				// if mid is still in recently shown on page list
				if (T.tally_meta.game.midsRecentlyShown[midMatched]) {

					if (DEBUG) console.log(log, midMatched, 'was last shown', FS_Date.diffSeconds("now", T.tally_meta.game.midsRecentlyShown[midMatched]), "seconds ago");

					// reset to try new match
					midMatched = -1;
				}
				if (++safety > 20) break;
			}
			return midMatched;

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
					// if (DEBUG) console.log(log, '[2] mid =', mid);
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
						if (T.tally_options.showNotifications)
							Dialogue.showData(Dialogue.getData({
								category: "help",
								subcategory: "survey"
							}));
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

			if (showMonster) {
				// add to recently shown
				T.tally_meta.game.midsRecentlyShown[mid] = moment();
				TallyStorage.saveData("tally_meta", T.tally_meta, log);
			}

			// update stage 1,2,3 monsters
			[T.tally_tag_matches.s1, T.tally_tag_matches.s2, T.tally_tag_matches.s3] = await returnMonsterStages();
			// save tag matches
			TallyStorage.saveData("tally_tag_matches", T.tally_tag_matches, log);

			// update the list of found monsters
			saveFoundForServer();
			// save monsters
			TallyStorage.saveData("tally_nearby_monsters", T.tally_nearby_monsters, log);

			// wait a moment to show on page
			let waitToTellMonster = setInterval(function() {
				if (DEBUG) console.log(log, '[5.1] monster =', MonsterData.dataById[mid].slug);

				// gives badges and tutorials a chance to finish
				if (Tutorial.sequenceActive) return;

				if (dialogue === "showDialogueAboutQuantity") {
					showDialogueAboutQuantity();
				}
				// if set, show monster on page
				if (showMonster) Monster.showOnPage(mid);

				// check/reset skin
				Skin.updateFromHighestMonsterStage();

				// always say something (after the skin has updated)
				if (T.tally_options.gameMode == "chill") {
					showRegularDialogue(mid, distance);
				} else {
					showSilhouetteDialogue(mid, distance);
				}

				clearInterval(waitToTellMonster);
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
			if (savedFoundForServer) return;
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
			savedFoundForServer = true;
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
	 *	Return a notification string
	 */
	function getNotificationDialogue(monster, distance) {
		try {
			if (DEBUG) console.log("👿 MonsterCheck.getNotificationDialogue()", monster, distance);

			// set color
			let color = Skin.currentSkinObj.front || "rgba(70,24,153,1)",
				str = "",
				mRef = "",
				needsVowel = false,
				r1 = Math.random(),
				r2 = Math.random(),
				r3 = Math.random();

			// use monster name and/or level
			if (r1 < 0.4)
				mRef = "level " + monster.level + " " + monster.name + " monster";
			else if (r1 < 0.6)
				mRef = monster.name + " monster";
			else if (r1 < 0.7)
				mRef = "level " + monster.level + " product monster";
			else if (r1 < 0.8)
				mRef = "product monster";
			else
				mRef = "monster";

			// if first letter is vowel add "an"
			if (FS_String.containsVowel(mRef[0]))
				// wrap reference to change color
				mRef = "an <span style='color: " + color + "'>" + mRef + "</span>";
			else
				mRef = "a <span style='color: " + color + "'>" + mRef + "</span>";

			// part 1
			if (r2 < 0.2) {
				str += "There's " + mRef;
			} else if (r2 < 0.4) {
				str += "There is " + mRef;
			} else if (r2 < 0.6) {
				str += "Yikes, " + mRef;
				needsVowel = true;
			} else if (r2 < 0.8) {
				str += "Uh oh, " + mRef;
				needsVowel = true;
			} else {
				// A / An ...
				str += FS_String.ucFirst(mRef);
				needsVowel = true;
			}

			// do we need a vowel?
			if (needsVowel) str += " is ";
			// random additions
			if (r1 < 0.5) str += " hiding ";

			// PAGE
			if (monster.stage === 3 && r3 < 0.5)
				str += " on the page!";
			else if (monster.stage === 3)
				str += " somewhere on this page!";

			// WEBSITE
			else if (distance !== "" && distance == "close" && r3 < 0.2)
				str += " on this website!";
			else if (distance !== "" && distance == "close" && r3 < 0.8)
				str += " somewhere on " + Page.data.domain + "!";
			else if (distance !== "" && distance == "close")
				str += " somewhere on this site!";

			// NEAR
			else if (r3 < 0.3)
				str += " on this site!";
			else if (r3 < 0.7)
				str += " somewhere on " + Page.data.domain + "!";
			else
				str += " nearby!";

			return str;
		} catch (err) {
			console.error(err);
		}
	}


	/**
	 *	Show regular monster notification dialogue
	 */
	function showRegularDialogue(mid, distance = "") {
		try {
			// don't allow if mode disabled or stealth
			if (T.tally_options.gameMode === "disabled" || T.tally_options.gameMode === "stealth") return;

			let str = "",
				monster = T.tally_nearby_monsters[mid];
			if (DEBUG) console.log("👿 MonsterCheck.showRegularDialogue() [1] mid=" + mid, monster);

			// show dialogue with badge image
			Dialogue.showData({
				text: getNotificationDialogue(monster, distance),
				mood: "excited"
			}, {
				instant: true
			});

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
			let url = T.tally_meta.env.website + '/' + 'assets/img/monsters/monsters-140h-solid-lt-purple/' + monster.mid + '-anim-sheet.png';
			// local version
			url = chrome.runtime.getURL('assets/img/monsters/monsters-140h-solid-lt-purple/' + monster.mid + '-anim-sheet.png');


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
			str += "<div class='dialogue_text_after_image'>" + getNotificationDialogue(monster, distance) + "</div>";

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
