"use strict";

/*  BADGE
 ******************************************************************************/

window.Badge = (function() {
	// PRIVATE

	let DEBUG = Debug.ALL.Badge;


	/**
	 *	0. Get badge (from player) or return new empty badge (from BadgeData)
	 */
	function get(name) {
		try {
			// start here
			let badge = BadgeData.data[name];
			// if they have received one before
			if (tally_user.badges && tally_user.badges[name])
				// then update level
				badge.level = tally_user.badges[name].level;
			if (DEBUG) console.log('🏆 Badge.get() name =', name, badge);
			return badge;
		} catch (err) {
			console.error(err);
		}
	}

	/**
	 *	1. determine if player has earned a new badge
	 */
	function check(type = "afterLoad") {
		try {
			// do not allow offline
			if (!Page.mode().active) return;
			// don't allow if mode disabled or stealth
			if (tally_options.gameMode === "disabled" || tally_options.gameMode === "stealth") return;

			let log = "🏆 Badge.check()",
				currentBadge, newBadgeLevel;
			var startNewCheck = function(name) {
				// the current badge or a "blank" one
				currentBadge = get(name);
				// reset new badge level (to compare to current one)
				newBadgeLevel = 0;
				// log
				console.log(log, "startNewCheck()", name, currentBadge);
			};


			

			// afterLoad
			// scrollAction
			// clickAction



			if (type == "clickAction"){

			}





			// which things should we check?
			let shouldCheck = {
				social: 1, // (GameData.socialDomains.indexOf(Page.data.domain) > -1),
				tags: false,
				workday: true,
				nighttime: true,
				clickText: false,
				scrolling: false
			};






			/////////////// SOCIAL DOMAINS ///////////////

			/////////////// filter-bubble -> based on (increasing) likes on social media
			// get current badge (or a new default badge) and start new check
			startNewCheck("filter-bubble");
			// get new badge level
			newBadgeLevel = Math.round(tally_user.score.likes / 5);
			// compare levels
			if (shouldCheck.social && newBadgeLevel > currentBadge.level) {
				console.log(log, "newBadgeLevel > currentBadge.level !!!!!");
				// set new level
				currentBadge.level = newBadgeLevel;
				// report
				console.log(log, "newBadgeLevel > currentBadge.level", "currentBadge =", currentBadge);
				// award new badge
				if (1) return award(currentBadge);
			}

			/////////////// stalker -> based on (increasing) on social media but very few likes
			startNewCheck("stalker");
			// every 30 min they level up
			newBadgeLevel = Math.round(tally_user.streamReport.pSocial / 60 / 30);
			if (shouldCheck.social && newBadgeLevel > currentBadge.level) {
				currentBadge.level = newBadgeLevel;
				console.log(log, "newBadgeLevel > currentBadge.level", "currentBadge =", currentBadge);
				if (1) return award(currentBadge);
			}







			/////////////// ECONOMY ///////////////

			/////////////// worker-bee -> 9a-5p M-F
			if (shouldCheck.workday && FS_Date.isWorkday()) {
				startNewCheck("worker-bee");
				newBadgeLevel = Math.round(tally_user.streamReport.tWorkday / 10000);
				if (newBadgeLevel > currentBadge.level) {
					currentBadge.level = newBadgeLevel;
					console.log(log, "newBadgeLevel > currentBadge.level", "currentBadge =", currentBadge);
					if (1) return award(currentBadge);
				}
			}
			///////////// night-owl -> 10p–6a
			else if (shouldCheck.nighttime && FS_Date.isNight()) {
				startNewCheck("night-owl");
				newBadgeLevel = Math.round(tally_user.streamReport.tNight / 10000);
				if (newBadgeLevel > currentBadge.level) {
					currentBadge.level = newBadgeLevel;
					console.log(log, "newBadgeLevel > currentBadge.level", "currentBadge =", currentBadge);
					if (1) return award(currentBadge);
				}
			}

			// refresh
			// https://stackoverflow.com/questions/5004978/check-if-page-gets-reloaded-or-refreshed-in-javascript
			// if (performance.navigation.type == 1)




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
			if (badge.ext !== "") awardText += chrome.extension.getURL('assets/img/badges/' + badge.name + badge.ext);
			else awardText += chrome.extension.getURL('assets/img/badges/placeholder.gif');
			awardText += "'>" +
				"<div class='tally do-not-break tally-badge-text'>" +
				"<span class='tally do-not-break'>" + badge.title + "</span>" +
				"<div class='tally tally-badge-text-level'>level " + badge.level + "</div>" +
				"</div></div>";
			// if they already have that badge
			if (tally_user.badges[badge.name] && badge.level > tally_user.badges[badge.name].level) {
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
			Progress.update("badgesAwarded", FS_Object.objLength(tally_user.badges));
			// play sound
			Sound.playRandomPowerup();
			// save in background (and on server)
			TallyData.handle("itemData", "badges", badge, "🏆 Badge.award()");

		} catch (err) {
			console.error(err);
		}
	}




	// PUBLIC
	return {
		check: check,
	};
})();
