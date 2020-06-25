"use strict";

window.Background = (function() {
	// PRIVATE

	let DEBUG = true,
		gameReady = false;

	/**
	 *  1. Listen for first install, or updated (code or from web store) installation
	 */
	chrome.runtime.onInstalled.addListener(function() {
		try {
			if (DEBUG) console.log("🧰 Background.onInstalled() -> new (or updated) installation detected");
			Config.logTimeSinceLoad("Background chrome.runtime.onInstalled() [1]");
			runStartChecks();
		} catch (err) {
			console.error(err);
		}
	});


	/**
	 *  2. Run start checks
	 *	- always called on new install or update
	 * 	- checks for previous install, verifies user, gets latest server data
	 */
	async function runStartChecks() {
		try {
			let log = "🧰 Background.runStartChecks()";
			dataReportHeader(log, "@", "before");
			Config.logTimeSinceLoad("Background.runStartChecks() [1]");

			// if T.tally_meta not found, install objects
			const newInstall = await Install.init();
			// check the version
			await Install.setVersion();
			// set server/api production | development
			await Install.setCurrentAPI();
			// set development options
			await Install.setDevelopmentOptions();
			// check the API status
			const serverOnline = await Server.checkIfOnline();

			Config.logTimeSinceLoad(log, "[2]");

			// if server online ...
			if (serverOnline) {
				console.log(log, "-> SERVER ONLINE!");

				// refresh T.tally_user data from server
				const tallyUserResponse = await Server.getTallyUser();
				// now we know the username and we can pass it to populate monsters
				const _tally_top_monsters = await Server.returnTopMonsters();

				// if user logged in ...
				console.log(log, "-> SERVER ONLINE! tallyUserResponse =",tallyUserResponse);
				dataReportHeader("END " + log, "@", "after");
				// return true to send data back to content
				if (tallyUserResponse) return true;


				// they are not logged in because it is a new install
				else if (newInstall) {
					console.log(log, "-> NEW INSTALL, LAUNCH START SCREEN");
					// prompt to install
					const response = await Install.launchStartScreen();
					dataReportHeader("/ " + log, "@", "after");
				} else {
					console.log(log, "-> NOT LOGGED IN");
					dataReportHeader("END " + log, "@", "after");
				}
			} else {
				console.error(log, "-> API SERVER NOT ONLINE");
				dataReportHeader("END " + log, "@", "after");
			}
			console.log("END OF runStartChecks()");

		} catch (err) {
			console.error(err);
		}
	}


	/**
	 *  Data reporting
	 */
	function dataReport() {
		try {
			let _tally_user = store("tally_user"),
				_tally_options = store("tally_options"),
				_tally_meta = store("tally_meta");
			dataReportHeader("🧰 Background.dataReport()", "#", "before");
			if (DEBUG) console.log("%cT.tally_user", Debug.styles.greenbg, JSON.stringify(_tally_user));
			if (DEBUG) console.log("%cT.tally_options", Debug.styles.greenbg, JSON.stringify(_tally_options));
			if (DEBUG) console.log("%cT.tally_meta", Debug.styles.greenbg, JSON.stringify(_tally_meta));
			dataReportHeader("/ 🧰 Background.dataReport()", "#", "after");
		} catch (err) {
			console.error("dataReport() failed");
		}
	}

	function dataReportHeader(title, char, pos) {
		// console.trace();
		if (!DEBUG) return;
		// make string
		let line = "";
		for (let i = 0; i < 50; i++) {
			line += char;
		}
		if (pos == "before") console.log("");
		console.log(line + " " + title + " " + line);
		if (pos == "after") console.log("");
	}


	/**
	 *	Background timed events
	 */
	function serverCheckTimer() {
		try {
			setInterval(function(){
				Server.checkIfOnline();
			},(1000*60));
		} catch (err) {
			console.error("dataReport() failed");
		}
	}


	// PUBLIC
	return {
		gameReady: function(){
			return gameReady;
		},
		runStartChecks: runStartChecks,
		dataReport: dataReport,
		dataReportHeader: dataReportHeader
	};
}());
