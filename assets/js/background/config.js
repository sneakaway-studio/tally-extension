"use strict";

var Config = (function() {
	// PRIVATE
	let development = {
			"api": "http://localhost:5000/api",
			"website": "http://localhost:5000",
		},
		production = {
			"api": "https://tallygame.net/api",
			"website": "https://tallygame.net",
		},
		options = {
			"localhost": true,
			"hotreload": true,
			"debugging": true
		},
		DEBUG = false;

	/**
	 *	Track loading time for scripts, backend data
	 */
	let then = new Date().getTime();

	function logTimeSinceLoad(caller) {
		let now = new Date().getTime();
		if (DEBUG) console.log("🗜️ Config.logTimeSinceLoad() ELAPSED =", now - then, caller);
	}
	logTimeSinceLoad("Config [1]");

	// PUBLIC
	return {
		options: options,
		development: development,
		production: production,
		logTimeSinceLoad: logTimeSinceLoad
	};
})();
