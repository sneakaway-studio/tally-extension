"use strict";

var Tracker = (function() {

	let TRACKER_DEBUG = true;

	/**
	 *	Remove trackers that have been "caught"
	 */
	function removeCaughtTrackers(trackersOnPage) {
		console.log("removeCaughtTrackers()", tally_trackers, trackersOnPage);
		if (tally_trackers.blocked.length < 1 || trackersOnPage.length < 1) return;
		// loop through trackers on page and check if each is in block list
		for (let i = 0, l = trackersOnPage.length; i < l; i++) {
			// if there is a match then block it
			if (tally_trackers.blocked.includes(trackersOnPage[i])) {
				// reference to script element
				var x = $("script[src*='" + trackersOnPage[i] + "']");

				if (TRACKER_DEBUG) console.log(trackersOnPage[i], x[0].src);

				// block it
				if (x[0].src) {
					x[0].src = "script-blocked-by-tally!!!";
				}
			}
		}
	}
	/**
	 *	Add a tracker to remove list
	 */
	function addToRemoveList(tracker)    {

	}

	// PUBLIC
	return {
		removeCaughtTrackers: removeCaughtTrackers,
		addToRemoveList: function(tracker) {
			addToRemoveList(tracker);
		}
	};
}());
