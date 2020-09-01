"use strict";

/*  EVENTS
 ******************************************************************************/

window.TallyEvents = (function () {
	// PRIVATE
	let DEBUG = Debug.ALL.TallyEvents,
		timedEvents = {}
		// // how often to check if user connected (from this page) and save background if user online status has changed
		// saveUserOnlineStatusTime = 60 * 60 * 1000 // min * secs * millis
	;

	/**
	 * Timed functions
	 */
	function startTimedEvents() {
		try {
			timedEvents = {

				// track time on current page
				pageTimerInterval: setInterval(function () {
					// if this page is focussed
					if (document.hasFocus()) {
						Page.data.time = Page.data.time + 1;
						Debug.update();
					}
				}, 1000),

// moving to background
// marked for deletion
				// // check if user is online and save in background
				// userOnlineInterval: setInterval(function () {
				// 	// if this page is focussed
				// 	if (document.hasFocus()) {
				// 		T.tally_meta.userOnline = navigator.onLine;
				// 		TallyStorage.saveData("tally_meta", T.tally_meta);
				// 	}
				// }, saveUserOnlineStatusTime),

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
				setTimeout(function () {
					// reset tally stats
					Stats.reset("tally");
					// do we show notifications?
					if (!T.tally_options.showNotifications) return;
					// play sound
					Sound.playRandomJump();
					// tell them
					Dialogue.showData(Dialogue.getData({
						category: "random",
						subcategory: "recharge"
					}), {
						addIfInProcess: false,
						instant: true
					});
				}, 700);
			}
			// if player hasn't been online for n minutes then tell them you missed them
			if (FS_Date.diffMinutes("now", T.tally_user.lastActive) > 600) { // 0=testing
				setTimeout(function () {
					// do we show notifications?
					if (!T.tally_options.showNotifications) return;
					// tell them
					Dialogue.showData(Dialogue.getData({
						category: "random",
						subcategory: "long-return"
					}), {
						addIfInProcess: true,
						instant: false
					});
				}, 900);
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
		startTimedEvents: startTimedEvents,
		checkLastActiveAndRecharge: checkLastActiveAndRecharge
	};
})();
