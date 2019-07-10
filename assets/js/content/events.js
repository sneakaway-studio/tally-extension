"use strict";

/*  EVENTS
 ******************************************************************************/

window.TallyEvents = (function() {


	// PRIVATE

	let timedEvents = {};

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
						pageData.time = pageData.time + 0.5;
						Debug.update();
					}
				}, 500),

				// check if user is online
				// userOnlineInt: setInterval(function() {
				// }, 5 * 1000),


			};
		} catch (err) {
			console.error(err);
		}
	}

	/**
	 *	Checks for the last time user was active
	 */
	function checkLastActive() {
		try {
			console.log("🕗 TallyEvents.checkLastActive()", "00:00:00",
				FS_String.pad(FS_Date.diffHours("now", tally_user.lastActive), 2) + ":" +
				FS_String.pad(FS_Date.diffMinutes("now", tally_user.lastActive), 2) + ":" +
				FS_String.pad(FS_Date.diffSeconds("now", tally_user.lastActive), 2)
			);
			// if player hasn't been online for n minutes then recharge
			if (FS_Date.diffMinutes("now", tally_user.lastActive) > 60) { // 0=testing
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
			tally_user.lastActive = moment().format();
			TallyStorage.saveData('tally_user', tally_user, "🕗 TallyEvents.checkLastActive()");
			console.log("🕗 TallyEvents.checkLastActive()", tally_user.lastActive);
		} catch (err) {
			console.error(err);
		}
	}







	// PUBLIC
	return {
		startTimeEvents: startTimeEvents,
		checkLastActive: checkLastActive
	};
})();
