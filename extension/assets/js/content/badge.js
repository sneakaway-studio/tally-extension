"use strict";

/*  BADGE
 ******************************************************************************/

window.Badge = (function() {
	// PRIVATE

	let DEBUG = Debug.ALL.Badge;


	/**
	 *	0. Get badge (from tally_user.badges) or new empty badge (from BadgeData)
	 */
	function get(name) {
		try {
			// start with blank data
			let badge = BadgeData.data[name];
			// set default
			badge.level = 0;
			if (DEBUG) console.log("\n🏆 Badge.get() [1] %c" + badge.name, Debug.styles.blue);
			// if (DEBUG) console.log('🏆 Badge.get() [1]', badge);

			// if they have received one before
			if (T.tally_user.badges && T.tally_user.badges[name])
				// then update level
				badge.level = Number(T.tally_user.badges[name].level);

			// add next points / level for computing advancement
			badge.nextLevel = 1;
			badge.nextLevelFloat = 1.0;
			badge.points = -1;
			badge.nextPoints = -1;
			// if (DEBUG) console.log('🏆 Badge.get() [2]', badge);
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
			// do not allow unless active on page
			if (!Page.data.mode.active) return;
			// don't allow if mode disabled
			if (T.tally_options.gameMode === "disabled") return;
			// don't allow on dashboard
			if (Page.data.actions.onDashboard) return;

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
				badge = nextLevelRound(badge, T.tally_user.streamReport.tWorkday / 60 / 60 / 8);
				// if the new level we have reached is >= the current level
				if (badge.nextLevel > badge.level) {
					badge.level = badge.nextLevel;
					if (1) return award(badge);
				}
			} else if (shouldCheck.nighttime) { // 8p–6a
				badge = get("night-owl"); // tNight (seconds) / mins / hours / 8 = every 8 hours
				badge = nextLevelRound(badge, T.tally_user.streamReport.tNight / 60 / 60 / 8);
				if (badge.nextLevel > badge.level) {
					badge.level = badge.nextLevel;
					if (1) return award(badge);
				}
			}
			badge = get("shop-therefore"); // every 1 hour
			badge = nextLevelRound(badge, T.tally_user.streamReport.tCommercial / 60 / 60);
			if (badge.nextLevel > badge.level) {
				badge.level = badge.nextLevel;
				if (1) return award(badge);
			}



			////////////////////////////// COMPUTER //////////////////////////////

			badge = get("big-clicker");
			badge = nextPointsExp(badge, T.tally_user.score.clicks / 350); // ~ every n clicks
			if (badge.points >= badge.nextPoints) {
				badge.level = badge.nextLevel;
				if (1) return award(badge);
			}
			badge = get("long-distance-scroller"); // ~ 1 wheel click = 1 mm * 1,000,000 = 1 km
			badge = nextLevelRound(badge, Progress.get("pageActionScrollDistance") / 1000000);
			if (badge.nextLevel > badge.level) {
				badge.level = badge.nextLevel;
				if (1) return award(badge);
			}




			////////////////////////////// MEMORY //////////////////////////////

			badge = get("refresh-king");
			badge = nextPointsExp(badge, Progress.get("pageActionRefreshes") / 35); // # refreshes
			if (badge.points >= badge.nextPoints) {
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

					// get points required to advance to next level
					badge = nextPointsExp(badge, Progress.get(badge.tagProgress));
					// account for badges that don't have enough tags yet
					if (badge.points === undefined) continue;

					// if points >= nextPoints
					if (badge.points >= badge.nextPoints) {
						console.log("🏆 Badge.tags 🏆🏆🏆", "badge.points > badge.nextPoints (" +
							badge.points, ">=", badge.nextPoints + ")");

						// if this is a new badge and we want to jump straight to the highest level
						badge.nextLevel = Math.round(Math.sqrt(badge.points / 4.5));
						// get the level from the nextPoints
						badge.level = badge.nextLevel || 1;
						if (1) return award(badge);
					}
					// console.log("🏆 Badge.tags", "badge.points <= badge.nextPoints (" +
					// 	badge.points, "<", badge.nextPoints + ")");

				}
			}




			////////////////////////////// SECURITY //////////////////////////////


			/////////////// cookie-monster
			badge = get("cookie-monster");
			badge = nextPointsExp(badge, Progress.get("cookies") / 15); // ~ every n likes
			if (badge.points >= badge.nextPoints) {
				badge.level = badge.nextLevel;
				if (1) return award(badge);
			}
			badge = get("tracker-star");
			badge = nextPointsExp(badge, Progress.get("trackersSeen") / 35); // # refreshes
			if (badge.points >= badge.nextPoints) {
				badge.level = badge.nextLevel;
				if (1) return award(badge);
			}
			badge = get("browser-fingerprinting");
			badge = nextPointsExp(badge, Progress.get("trackersSeenFingerprinting") / 15); // # refreshes
			if (badge.points >= badge.nextPoints) {
				badge.level = badge.nextLevel;
				if (1) return award(badge);
			}




			////////////////////////////// SOCIAL DOMAINS //////////////////////////////


			/////////////// filter-bubble -> based on (increasing) likes on social media
			if (shouldCheck.social) {
				badge = get("filter-bubble");
				badge = nextPointsExp(badge, T.tally_user.score.likes / 35); // ~ every n likes
				if (badge.points >= badge.nextPoints) {
					badge.level = badge.nextLevel;
					if (1) return award(badge);
				}
			}

			/////////////// stalker -> based on (increasing) on social media but very few likes
			if (shouldCheck.social) {
				badge = get("stalker");
				badge = nextLevelRound(badge, T.tally_user.streamReport.tSocial / 60 / 60 / 8); // ~ every 8 hours
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
	function nextLevelRound(badge, nextLevelFloat) {
		try {
			if (DEBUG) console.log("🏆 Badge.nextLevelRound()", badge);

			// only if > 0
			if (nextLevelFloat <= 0) {
				badge.nextLevel = -1000;
				return badge;
			}

			// if nextLevelFloat received then use it (rounded to nearest 100th)
			badge.nextLevelFloat = FS_Number.round(nextLevelFloat, 4);

			// get rounded level from nextLevelFloat
			badge.nextLevel = Math.floor(badge.nextLevelFloat);

			// show and format results in console.log
			let displayCondition = "<=",
				winnerStr = " ";
			if (badge.nextLevel > badge.level) {
				displayCondition = ">";
				winnerStr = ' ✅ ';
			}
			// if (DEBUG) console.log("🏆" + winnerStr + "Badge.nextLevelRound()",
			// 	"(nextLevel " + displayCondition + " level) " +
			// 	badge.nextLevel, displayCondition, badge.level, "",
			// 	"nextLevelFloat =", badge.nextLevelFloat,
			// 	badge
			// );
			return badge;
		} catch (err) {
			console.error(err);
		}
	}


	/**
	 *	Compute ** nextPoints ** required to advance to next level (with exponent)
	 * 	- See Tally Data - BadgeMath spreadsheet for graphs
	 * 	- Graphing calculator https://www.desmos.com/calculator
	 * 	- Article on RPG math http://howtomakeanrpg.com/a/how-to-make-an-rpg-levels.html
	 */
	function nextPointsExp(badge, points) {
		try {
			if (DEBUG) console.log("🏆 Badge.nextPointsExp() [1]", badge);
			// only if > 0
			if (points <= 0) {
				badge.points = -1000;
				return badge;
			}

			// get the next highest level to compare to
			badge.nextLevel = badge.level + 1;
			badge.nextLevelFloat = badge.nextLevel;
			// if (DEBUG) console.log("🏆 Badge.nextPointsExp() [2]", badge);

			// if points received then use it (rounded to nearest 100th)
			if (points > 0) badge.points = FS_Number.round(points, 2);
			// if (DEBUG) console.log("🏆 Badge.nextPointsExp() [3]", badge);

			// // first one = (x * 30) * (x / 4) === f(x)=(x * 30) * (x / 4)
			// nextPoints = Math.round((badge.level * 30) * (badge.level / 4));
			// // functionally equivilant to this = (15/2 * (x * x))
			// nextPoints = Math.round(7.5 * (badge.level * badge.level));
			// // Pokemon method === f(x)= x * x * x
			// nextPoints = Math.round((4 * (badge.level * badge.level * badge.level)) / 5);

			// currently using f(x)= 4.5 * ((x+1) * (x+1))
			badge.nextPoints = Math.round(4.5 * (badge.nextLevel * badge.nextLevel)) || 2;

			// show and format results in console.log
			let displayCondition = "<",
				winnerStr = " ";
			if (badge.points >= badge.nextPoints) {
				displayCondition = ">=";
				winnerStr = ' ✅ ';
			}

			// if (DEBUG) console.log("🏆" + winnerStr + "Badge.nextPointsExp() [4]",
			// 	// "level =", badge.level +
			// 	// ", (points " + displayCondition + " nextPoints)", "",
			// 	badge.points, displayCondition, badge.nextPoints,
			// 	badge
			// );

			return badge;
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
			if (!FS_Object.prop(badge) || !FS_Object.prop(badge.name) || badge.name === "")
				return console.error("badge not found", badge);

			if (DEBUG) console.log("🏆 Badge.award()", badge);

			// string for dialogue box
			let str = "";

			// do we show notifications?
			if (T.tally_options.showNotifications) {

				if (!badge.color1 || badge.color1 == "") badge.color1 = "rgba(70,24,153,1)";
				if (!badge.color2 || badge.color2 == "") badge.color2 = "rgba(170,24,153,1)";

				str += "<div class='tally tally-dialogue-with-img' style=' " +
					"background: " + badge.color1 + ";" +
					"background: linear-gradient(180deg, " + badge.color1 + " 0%, " + badge.color2 + "100%);" +
					"'>";
				str += "<div class='tally-badge-award-wrapper'>";

				// add the badge image
				str += "<img class='tally tally-badge-img-wrapper' src='";
				if (badge.ext && badge.ext !== "")
					// placeholder for badges not finished
					str += chrome.runtime.getURL('assets/img/badges/' + badge.name + badge.ext);
				else
					str += chrome.runtime.getURL('assets/img/badges/placeholder.png');
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

				// Tally's comment
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
				// show comment after badge
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

				// play sound
				Sound.playRandomPowerup();
			}
			// else if in chill then show TEXT dialogue only
			else if (T.tally_options.gameMode === "chill") {

				// Tally's comment
				if (T.tally_user.badges[badge.name] && badge.level > T.tally_user.badges[badge.name].level) {
					// if they already have that badge
					str += "You leveled up your " + badge.name + " badge!";
				} else {
					str += "You earned a new " + badge.name + " badge!";
				}

				// show dialogue with badge image
				Dialogue.showData({
					text: str,
					mood: badge.sound
				}, {
					instant: true
				});
				// show comment after badge
				Dialogue.showData(Dialogue.getData({
					category: "badge",
					subcategory: badge.name
				}));
			}

			// update progress
			Progress.update("badgesAwarded", FS_Object.objLength(T.tally_user.badges));
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
