"use strict";

/*  BADGE
 ******************************************************************************/

window.Badge = (function() {
	// PRIVATE

	let DEBUG = Debug.ALL.Badge;


	/**
	 *	0. Get badge (from tally_user.badges) or new empty badge (from BadgeData)
	 */
	function get(name, nextLevel = 0) {
		try {
			// start with blank data
			let badge = BadgeData.data[name];
			// if (DEBUG) console.log('🏆 Badge.get() name =', name, badge);
			// if they have received one before
			if (T.tally_user.badges && T.tally_user.badges[name])
				// then update level
				badge.level = Number(T.tally_user.badges[name].level);
			// add new level to badge
			badge.nextLevel = nextLevel;
			// if (DEBUG) console.log('🏆 Badge.get() name =', name, badge);
			return badge;
		} catch (err) {
			console.error(err);
		}
	}



	/**
	 *	1. determine if player has earned a new badge
	 */
	function check() {
		try {
			// do not allow unless fully active
			if (!Page.data.mode.active) return;
			// don't allow if mode disabled or stealth
			if (T.tally_options.gameMode === "disabled" || T.tally_options.gameMode === "stealth") return;


			let log = "🏆 Badge.check()",
				badge = {};

			// what should we check?
			let shouldCheck = {
				social: GameData.socialDomains.indexOf(Page.data.domain),
				tags: Progress.pageTagsProgressMatches || 0, // only if tags found on this page
				workday: FS_Date.isWorkday(),
				nighttime: FS_Date.isNight(),
				clickText: false,
				scrolling: false
			};
			if (DEBUG) Debug.dataReportHeader(log, "#", "before");
			if (DEBUG) console.log(log, "shouldCheck =", shouldCheck);
			if (DEBUG) console.log(log, "T.tally_user.streamReport", T.tally_user.streamReport);






			////////////////////////////// ECONOMY //////////////////////////////

			if (shouldCheck.workday) { // 9a-5p M-F
				badge = get("worker-bee"); // tWorkday (seconds) / mins / hours / 8 = every 8 hours
				badge.nextLevel = nextLevelRound(badge, T.tally_user.streamReport.tWorkday / 60 / 60 / 8);
				// if the new level we have reached is > the current level
				if (badge.nextLevel > badge.level) {
					badge.level = badge.nextLevel;
					if (1) return award(badge);
				}
			} else if (shouldCheck.nighttime) { // 8p–6a
				badge = get("night-owl"); // tNight (seconds) / mins / hours / 8 = every 8 hours
				badge.nextLevel = nextLevelRound(badge, T.tally_user.streamReport.tNight / 60 / 60 / 8);
				if (badge.nextLevel > badge.level) {
					badge.level = badge.nextLevel;
					if (1) return award(badge);
				}
			}


			////////////////////////////// COMPUTER //////////////////////////////

			badge = get("big-clicker");
			badge.nextLevel = nextLevelExp(badge, T.tally_user.score.clicks / 350); // ~ every n clicks
			if (badge.nextLevel > badge.level) {
				badge.level = badge.nextLevel;
				if (1) return award(badge);
			}
			badge = get("long-distance-scroller"); // ~ 1 wheel click = 1 mm * 1,000,000 = 1 km
			badge.nextLevel = nextLevelRound(badge, Progress.get("pageActionScrollDistance") / 1000000);
			if (badge.nextLevel > badge.level) {
				badge.level = badge.nextLevel;
				if (1) return award(badge);
			}




			////////////////////////////// MEMORY //////////////////////////////

			badge = get("refresh-king");
			badge.nextLevel = nextLevelExp(badge, Progress.get("pageActionRefreshes") / 35); // # refreshes
			if (badge.nextLevel > badge.level) {
				badge.level = badge.nextLevel;
				if (1) return award(badge);
			}




			////////////////////////////// CHECK ALL TAG BADGES //////////////////////////////

			if (shouldCheck.tags > 0) {
				for (let name in Badges.data) {
					// if this badge has tags
					if (!Badges.data[name].tags || !Badges.data[name].tagProgress) continue;
					// get current badge (or a new default badge)
					badge = get(name);

					// console.log("\n🏆 Badge -> tags", "badge =", badge);

					// store current points
					badge.currentPoints = Progress.get(badge.tagProgress);
					// store points required to advance to next level
					badge.nextPoints = nextPointsExp(badge);
					// if currentPoints > nextPoints
					if (badge.currentPoints > badge.nextPoints) {
						// console.log("🏆 Badge.tags 🏆🏆🏆", "badge.currentPoints > badge.nextPoints (" +
						// 	badge.currentPoints, ">", badge.nextPoints + ")");
						// set new level and award or level-up the badge
						badge.level += 1;
						if (1) return award(badge);
					}
					// else {
					// 	console.log("🏆 Badge.tags", "badge.currentPoints <= badge.nextPoints (" +
					// 		badge.currentPoints, "<=", badge.nextPoints + ")");
					// }
				}
			}





			////////////////////////////// SOCIAL DOMAINS //////////////////////////////


			/////////////// filter-bubble -> based on (increasing) likes on social media
			if (shouldCheck.social) {
				badge = get("filter-bubble");
				badge.nextLevel = nextLevelExp(badge, T.tally_user.score.likes / 25); // ~ every n likes
				if (badge.nextLevel > badge.level) {
					badge.level = badge.nextLevel;
					if (1) return award(badge);
				}
			}

			/////////////// stalker -> based on (increasing) on social media but very few likes
			if (shouldCheck.social) {
				badge = get("stalker");
				badge.nextLevel = nextLevelExp(badge, T.tally_user.streamReport.tSocial / 60 / 30); // ~ every 30 min
				if (badge.nextLevel > badge.level) {
					badge.level = badge.nextLevel;
					if (1) return award(badge);
				}
			}




		} catch (err) {
			console.error(err);
		}
	}









	/**
	 *	Round and log the value (nextLevel) and return (NO EXPONENT)
	 */
	function nextLevelRound(badge, nextLevel) {
		try {
			// round to 2 decimals to log
			nextLevel = FS_Number.round(nextLevel, 2);
			let nextLevelRounded = Math.round(nextLevel);

			// show and format results in console.log
			let displayCondition = "<=",
				winnerStr = "";
			if (nextLevelRounded > badge.level) {
				displayCondition = ">";
				winnerStr = '🏆🏆🏆';
			}
			if (DEBUG) console.log("🏆 Badge.nextLevelRound() %c" + badge.name, Debug.styles.blue,
				"(nextLevelRounded " + displayCondition + " level) " +
				"", nextLevelRounded, displayCondition, badge.level, "",
				"nextLevel =", nextLevel, "",
				winnerStr
			);
			return Math.round(nextLevel);
		} catch (err) {
			console.error(err);
		}
	}

	/**
	 *	Compute ** nextLevel ** based on current points (with exponent)
	 */
	function nextLevelExp(badge, adjustedPoints) {
		try {
			// if (DEBUG) console.log("🏆 Badge.nextLevelExp() %c"+ badge.name, Debug.styles.blue,
			// 	", adjustedPoints =", adjustedPoints
			// );
			// https://www.desmos.com/calculator
			// f(x)=x * (x/4)
			let nextLevel = FS_Number.round(adjustedPoints * (adjustedPoints / 4), 2) || 1,
				nextLevelRounded = Math.round(nextLevel);
			adjustedPoints = FS_Number.round(adjustedPoints, 2);

			// show and format results in console.log
			let displayCondition = "<=",
				winnerStr = "";
			if (nextLevelRounded > badge.level) {
				displayCondition = ">";
				winnerStr = '🏆🏆🏆';
			}
			if (DEBUG) console.log("🏆 Badge.nextLevelExp() %c" + badge.name, Debug.styles.blue,
				"adjustedPoints =", adjustedPoints,
				", (nextLevelRounded " + displayCondition + " level) " +
				"", nextLevelRounded, displayCondition, badge.level, "",
				"nextLevel =", nextLevel, "",
				winnerStr
			);
			return nextLevelRounded;
		} catch (err) {
			console.error(err);
		}
	}

	/**
	 *	Compute ** nextPoints ** required to advance to next level (with exponent)
	 */
	function nextPointsExp(badge) {
		try {
			// see BadgeMath spreadsheet for graphs
			// https://docs.google.com/spreadsheets/d/17V-efNqn3Czp3KfSIR7xxJhHiW_921YLMK8j-CZoW_U/edit#gid=246948358
			// more info
			// http://howtomakeanrpg.com/a/how-to-make-an-rpg-levels.html
			let nextPoints = 0;

			// // my first one = (x * 30) * (x / 4)
			// nextPoints = Math.round((badge.currentLevel * 30) * (badge.currentLevel / 4));
			// // functionally equivilant to this = (15/2 * (x * x))
			// nextPoints = Math.round(7.5 * (badge.currentLevel * badge.currentLevel));
			// // Pokemon method
			// nextPoints = Math.round((4 * (badge.currentLevel * badge.currentLevel * badge.currentLevel)) / 5);

			// currently using
			nextPoints = Math.round(4.5 * ((badge.level + 0.1) * (badge.level + 0.1))) || 1;

			// show and format results in console.log
			let displayCondition = "<=",
				winnerStr = "";
			if (badge.currentPoints > nextPoints) {
				displayCondition = ">";
				winnerStr = '🏆🏆🏆';
			}

			if (DEBUG) console.log("🏆 Badge.nextPointsExp() %c" + badge.name, Debug.styles.blue,
				"level =", badge.level +
				", (currentPoints " + displayCondition + " nextPoints) " +
				"", badge.currentPoints, displayCondition, nextPoints, "",
				winnerStr
			);

			return nextPoints;
		} catch (err) {
			console.error(err);
		}
	}
	// test a function
	function testTagExp() {
		try {
			let str = "";
			// test the nextLevel function
			for (let i = 0; i < 10; i++) {
				// str = (nextLevelExp(i) / 250) + " = ";
				str = nextPointsExp(i, i * 7) + " = ";
				for (let j = 0; j < i; j++) {
					str += ".";
				}
				// if (DEBUG) console.log(str);
			}
		} catch (err) {
			console.error(err);
		}
	}




	/**
	 *	Award to player and save in background
	 */
	function award(badge = "") {
		try {
			if (!prop(badge) || !prop(badge.name) || badge.name === "") return console.error(badge);

			if (DEBUG) console.log("🏆 Badge.award()", badge);

			if (!badge.color1 || badge.color1 == "") badge.color1 = "rgb(70,24,153,1)";
			if (!badge.color2 || badge.color2 == "") badge.color2 = "rgba(170,24,153,1)";

			// background: rgb(255, 0, 0);
			// background: linear - gradient(180 deg, rgba(255, 0, 0, 1) 0 % , rgba(56, 255, 0, 1) 100 % );

			// string for dialogue box
			let str = "";
			str += "<div class='tally tally-dialogue-with-img' style=' " +
				"background: " + badge.color1 + ";" +
				"background: linear-gradient(180deg, " + badge.color1 + " 0%, " + badge.color2 + "100%);" +
				"'>";
			str += "<div class='tally-badge-award-wrapper'>";

			// add the badge image
			str += "<img class='tally tally-badge-img-wrapper' src='";
			if (badge.ext && badge.ext !== "")
				// placeholder for badges not finished
				str += chrome.extension.getURL('assets/img/badges/' + badge.name + badge.ext);
			else
				str += chrome.extension.getURL('assets/img/badges/placeholder.png');
			str += "'>";

			// add award text
			str += "<div class='tally do-not-break tally-badge-text'>";
			str += "<div class='tally do-not-break'>" + badge.title + "</div>";
			str += "<div class='tally tally-badge-text-level'>level " + badge.level + "</div>";
			str += "</div>";

			str += "</div>"; // close tally-badge-award-wrapper
			str += "</div>"; // close tally-dialogue-with-img

			// the text tally says
			str += "<div class='dialogue_text_after_image'>";
			if (T.tally_user.badges[badge.name] && badge.level > T.tally_user.badges[badge.name].level) {
				// if they already have that badge
				str += "You leveled up!";
			} else {
				str += "You earned a new badge!";
			}
			str += "</div>";




			// show dialogue with badge image
			Dialogue.showData({
				text: str,
				mood: badge.sound
			}, {
				instant: true
			});
			Dialogue.showData(Dialogue.getData({
				category: "badge",
				subcategory: badge.name
			}));

			// add floating animation
			let badgeFloatingAnim = anime({
				targets: ".tally-badge-img-wrapper",
				// translateY: -4,
				rotateZ: [{
						value: -5
					},
					{
						value: 5
					}
				],
				direction: 'alternate',
				loop: true,
				easing: 'easeInOutSine',
				duration: 600
			});

			// update progress
			Progress.update("badgesAwarded", FS_Object.objLength(T.tally_user.badges));
			// play sound
			Sound.playRandomPowerup();
			// save in background (and on server)
			TallyData.queue("itemData", "badges", badge, "🏆 Badge.award()");

		} catch (err) {
			console.error(err);
		}
	}




	// PUBLIC
	return {
		check: check,
	};
})();
