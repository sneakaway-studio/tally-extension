self.TallyEvents = (function () {
	// PRIVATE
	let DEBUG = Debug.ALL.TallyEvents,
		timedEvents = {};

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
					}
				}, 1000),

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
						addIfInProcess: true,
						instant: true
					});
					// say something after
					Dialogue.showData(Dialogue.getData({
						category: "random",
						subcategory: "recharge-post"
					}), {
						addIfInProcess: true,
						instant: false
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
