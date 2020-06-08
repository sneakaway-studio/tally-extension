"use strict";

/*  BADGE
 ******************************************************************************/

window.Badge = (function() {
	// PRIVATE

	let DEBUG = Debug.ALL.Badge,
		newBadgeLevel = 0;


	/**
	 *	0. Get badge (from player) or return new empty badge (from BadgeData)
	 */
	function get(name) {
		try {
			// start with blank data
			let badge = BadgeData.data[name];
			// if they have received one before
			if (T.tally_user.badges && T.tally_user.badges[name])
				// then update level
				badge.level = T.tally_user.badges[name].level;
			// if (DEBUG) console.log('🏆 Badge.get() name =', name, badge);
			return badge;
		} catch (err) {
			console.error(err);
		}
	}


	function startNewCheck(name) {
		// if (DEBUG) console.log("\n🏆 Badge.startNewCheck()", name);
		// get the current badge or a "blank" one
		let currentBadge = get(name);
		// reset (global) new badge level (to compare to current one)
		newBadgeLevel = 0;
		// log
		if (DEBUG) console.log("🏆 Badge.startNewCheck()", name, currentBadge);
		return currentBadge;
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
				currentBadge, newBadgeLevel;

			if (DEBUG) Debug.dataReportHeader(log, "#", "before");

			// var startNewCheck = function(name) {
			// 	// get the current badge or a "blank" one
			// 	currentBadge = get(name);
			// 	// reset new badge level (to compare to current one)
			// 	newBadgeLevel = 0;
			// 	// log
			// 	if (DEBUG) console.log(log, "startNewCheck()", name, currentBadge);
			// };





			// afterLoad
			// scrollAction
			// clickAction


			// which things should we check?
			let shouldCheck = {
				social: GameData.socialDomains.indexOf(Page.data.domain),
				tags: Progress.pageTagsProgressMatches || 0, // only if tags found on this page
				workday: FS_Date.isWorkday(),
				nighttime: FS_Date.isNight(),
				clickText: false,
				scrolling: false
			};
			if (DEBUG) console.log(log, "shouldCheck =", shouldCheck);



			////////////////////////////// ECONOMY //////////////////////////////

			if (shouldCheck.workday) { // 9a-5p M-F
				currentBadge = startNewCheck("worker-bee");
				newBadgeLevel = exp(T.tally_user.streamReport.tWorkday / 60 / 60 / 8); // ~ every 8 hours
				if (newBadgeLevel > currentBadge.level) {
					currentBadge.level = newBadgeLevel;
					if (DEBUG) console.log(log, "newBadgeLevel > currentBadge.level", "currentBadge =", currentBadge);
					if (1) return award(currentBadge);
				}
			} else if (shouldCheck.nighttime) { // 8p–6a
				currentBadge = startNewCheck("night-owl");
				newBadgeLevel = exp(T.tally_user.streamReport.tNight / 60 / 60 / 8); // ~ every 8 hours
				if (newBadgeLevel > currentBadge.level) {
					currentBadge.level = newBadgeLevel;
					if (DEBUG) console.log(log, "newBadgeLevel > currentBadge.level", "currentBadge =", currentBadge);
					if (1) return award(currentBadge);
				}
			}


			////////////////////////////// COMPUTER //////////////////////////////

			currentBadge = startNewCheck("big-clicker");
			newBadgeLevel = exp(T.tally_user.score.clicks / 350); // ~ every n clicks
			// if (DEBUG) console.log(log, "newBadgeLevel =", newBadgeLevel, "newBadgeLevel =", currentBadge.level);
			if (newBadgeLevel > currentBadge.level) {
				currentBadge.level = currentBadge.level + 1; //newBadgeLevel;
				if (DEBUG) console.log(log, "newBadgeLevel > currentBadge.level", "currentBadge =", currentBadge);
				if (1) return award(currentBadge);
			}


			////////////////////////////// CHECK ALL TAG BADGES //////////////////////////////

			if (shouldCheck.tags > 0) {
				for (var badgeName in Badges.data) {
					// if this badge has tags
					if (!Badges.data[badgeName].tags) continue;
					// get current badge (or a new default badge) and start new check
					currentBadge = startNewCheck(badgeName);
					// get new badge level and compare
					newBadgeLevel = exp(Progress.get(currentBadge.progress) / 10); // # tags
					if (DEBUG) console.log(log, "newBadgeLevel =", newBadgeLevel, "currentBadge =", currentBadge);
					if (newBadgeLevel > currentBadge.level) {
						// set new level and award new badge
						currentBadge.level = newBadgeLevel;
						if (DEBUG) console.log(log, "newBadgeLevel > currentBadge.level", "currentBadge =", currentBadge);
						if (1) return award(currentBadge);
					}
				}
			}


			////////////////////////////// SOCIAL DOMAINS //////////////////////////////


			/////////////// filter-bubble -> based on (increasing) likes on social media
			if (shouldCheck.social) {
				currentBadge = startNewCheck("filter-bubble");
				newBadgeLevel = exp(T.tally_user.score.likes / 25); // ~ every n likes
				if (newBadgeLevel > currentBadge.level) {
					currentBadge.level = newBadgeLevel;
					if (DEBUG) console.log(log, "newBadgeLevel > currentBadge.level", "currentBadge =", currentBadge);
					if (1) return award(currentBadge);
				}
			}

			/////////////// stalker -> based on (increasing) on social media but very few likes
			if (shouldCheck.social) {
				currentBadge = startNewCheck("stalker");
				newBadgeLevel = exp(T.tally_user.streamReport.pSocial / 60 / 30); // ~ every 30 min
				if (shouldCheck.social && newBadgeLevel > currentBadge.level) {
					currentBadge.level = newBadgeLevel;
					if (DEBUG) console.log(log, "newBadgeLevel > currentBadge.level", "currentBadge =", currentBadge);
					if (1) return award(currentBadge);
				}
			}







			// refresh
			// https://stackoverflow.com/questions/5004978/check-if-page-gets-reloaded-or-refreshed-in-javascript
			// if (performance.navigation.type == 1)



			// // test the exp function
			// for (let i = 0; i < 100; i++){
			// 	let str = (exp(i) / 250) + " = ";
			// 	for (let j = 0; j < i; j++){
			// 		str += ".";
			// 	}
			// 	if (DEBUG) console.log(str);
			// }

		} catch (err) {
			console.error(err);
		}
	}
	// use an exponent on the above number comparisons
	function exp(x) {
		try {
			// https://www.desmos.com/calculator
			// f(x)=x * (x/4)
			let n = x * (x / 4);
			if (DEBUG) console.log("🏆 Badge.exp() n =", n);
			return Math.round(n);
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

			let awardText = "<div class='tally tally-badge' style='background-color: " + (badge.color || "#111") + "'>" +
				"<img class='tally tally-badge-img' src='";
			// placeholder for badges not finished
			if (badge.ext && badge.ext !== "")
				awardText += chrome.extension.getURL('assets/img/badges/' + badge.name + badge.ext);
			else awardText += chrome.extension.getURL('assets/img/badges/placeholder.gif');
			awardText += "'>" +
				"<div class='tally do-not-break tally-badge-text'>" +
				"<span class='tally do-not-break'>" + badge.title + "</span>" +
				"<div class='tally tally-badge-text-level'>level " + badge.level + "</div>" +
				"</div></div>";
			// if they already have that badge
			if (T.tally_user.badges[badge.name] && badge.level > T.tally_user.badges[badge.name].level) {
				awardText += "You leveled up!";
			} else {
				awardText += "You earned a new badge!";
			}

			// show dialogue with badge image
			Dialogue.showData({
				text: awardText,
				mood: badge.sound
			}, {
				instant: true
			});
			Dialogue.showData(Dialogue.getData({
				category: "badge",
				subcategory: badge.name
			}));

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
