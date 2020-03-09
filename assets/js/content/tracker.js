"use strict";

window.Tracker = (function() {
	// PRIVATE
	let DEBUG = Debug.ALL.Tracker;

	/**
	 *	Remove trackers that have been "caught"
	 */
	function removeCaughtTrackers() {
		try {
			if (!tally_user.trackers || Page.data.trackers.length < 1) return;

			if (DEBUG) console.log("🕷️ Tracker.removeCaughtTrackers() [1]", tally_user.trackers, Page.data.trackers);

			// loop through trackers on page and check if each is in block list
			for (let i = 0, l = Page.data.trackers.length; i < l; i++) {
				// if there is a match then block it
				if (tally_user.trackers[Page.data.trackers[i]] && tally_user.trackers[Page.data.trackers[i]].blocked) {

					if (DEBUG) console.log("🕷️ Tracker.removeCaughtTrackers() [2] ATTEMPT BLOCK", tally_user.trackers[i]);

					// reference to script element
					var x = $("script[src*='" + Page.data.trackers[i] + "']");

					// block it
					if (FS_Object.prop(x[0]) && FS_Object.prop(x[0].src)) {
						x[0].src = Page.data.trackers[i] + "-script-blocked-by-tally!!!";
						if (DEBUG) console.log("🕷️ Tracker.removeCaughtTrackers() [3] BLOCKED!", Page.data.trackers[i], x[0].src);
					}
				}
			}
		} catch (err) {
			console.error(err);
		}
	}
	/**
	 *	Add a tracker to remove list
	 */
	function addToRemoveList(tracker) {
		try {

		} catch (err) {
			console.error(err);
		}
	}

	// PUBLIC
	return {
		removeCaughtTrackers: removeCaughtTrackers,
		addToRemoveList: function(tracker) {
			addToRemoveList(tracker);
		}
	};
}());
