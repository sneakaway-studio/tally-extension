"use strict";

window.Tracker = (function() {
	// PRIVATE
	let DEBUG = Debug.ALL.Tracker;

	/**
	 *	Remove trackers that have been "caught"
	 */
	function removeCaughtTrackers(trackersOnPage) {
		try {
			if (DEBUG) console.log("🕷️ Tracker.removeCaughtTrackers()", tally_user.trackers, trackersOnPage);
			if (tally_user.trackers.blocked.length < 1 || trackersOnPageData.length < 1) return;
			// loop through trackers on page and check if each is in block list
			for (let i = 0, l = trackersOnPageData.length; i < l; i++) {
				// if there is a match then block it
				if (tally_user.trackers.blocked.hasOwnProperty(trackersOnPage[i])) {
					// reference to script element
					var x = $("script[src*='" + trackersOnPage[i] + "']");

					if (DEBUG) console.log("🕷️ Tracker.removeCaughtTrackers()", trackersOnPage[i], x[0].src);

					// block it
					if (x[0].src) {
						x[0].src = "script-blocked-by-tally!!!";
					}
				}
			}
		} catch(err){
			console.error(err);
		}
	}
	/**
	 *	Add a tracker to remove list
	 */
	function addToRemoveList(tracker)    {
		try {

		} catch(err){
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
