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

// NOW HANDLED IN BACKGROUND...
			// check if server online
			// serverOnlineInt: setInterval(function() {
			// 	checkAPIServerStatus();
			// }, 500 * 1000)

		};
	}










	// PUBLIC
	return {
		startTimeEvents:startTimeEvents
	};
})();
