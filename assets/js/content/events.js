"use strict";

/*  EVENTS
 ******************************************************************************/

window.TallyEvents = (function() {
	// PRIVATE
	let DEBUG = Debug.ALL.TallyEvents,
		timedEvents = {};

	/**
	 * Timed functions
	 */
	function startTimeEvents() {
		try {
			timedEvents = {

				// track time on current page
				pageTimerInterval: setInterval(function() {
					// if this page is visible
					if (document.hasFocus()) {
						Page.data.time = Page.data.time + 0.5;
						Debug.update();
					}
				}, 500),

				// check if user is online
				userOnlineInt: setInterval(function() {

				}, 5 * 1000),

			};
		} catch (err) {
			console.error(err);
		}
	}

	/**
	 *	Checks for the last time user was active
	 */
	function checkLastActiveAndRecharge() {
		try {
			// allow offline
			if (Page.data.mode.notActive) return;
			// don't allow if mode disabled or stealth
			if (T.tally_options.gameMode === "disabled" || T.tally_options.gameMode === "stealth") return;

			if (DEBUG) console.log("🕗 TallyEvents.checkLastActiveAndRecharge()", "00:00:00",
				FS_String.pad(FS_Date.diffHours("now", T.tally_user.lastActive), 2) + ":" +
				FS_String.pad(FS_Date.diffMinutes("now", T.tally_user.lastActive), 2) + ":" +
				FS_String.pad(FS_Date.diffSeconds("now", T.tally_user.lastActive), 2)
			);
			// if player hasn't been online for n minutes then recharge
			if (FS_Date.diffMinutes("now", T.tally_user.lastActive) > 60) { // 0=testing
				setTimeout(function() {
					// reset tally stats
					Stats.reset("tally");
					// play sound
					Sound.playRandomJump();
					// tell them
					Dialogue.showStr("You took a break from the internet to recharge!", "happy");
				}, 700);
			}
			// update last active
			T.tally_user.lastActive = moment().format();
			TallyStorage.saveData("tally_user", T.tally_user, "🕗 TallyEvents.checkLastActiveAndRecharge()");
			// if (DEBUG) console.log("🕗 TallyEvents.checkLastActiveAndRecharge()", T.tally_user.lastActive);
		} catch (err) {
			console.error(err);
		}
	}







	// PUBLIC
	return {
		startTimeEvents: startTimeEvents,
		checkLastActiveAndRecharge: checkLastActiveAndRecharge
	};
})();
