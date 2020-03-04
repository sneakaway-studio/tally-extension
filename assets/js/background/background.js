"use strict";

window.Background = (function() {
	// PRIVATE

	let DEBUG = true;

	/**
	 *  1. Listen for new installation (or updated code)
	 */
	chrome.runtime.onInstalled.addListener(function() {
		try {
			if (DEBUG) console.log("🧰 Background.onInstalled() -> new installation (or updated code) detected");
			runStartChecks();
		} catch (err) {
			console.error(err);
		}
	});


	/**
	 *  2. Run start checks (always called on new install or update)

		 if tally_meta not found...
			 1. Install.init()
		 if server online
			 2. Install.launchStartScreen()
		 then (or if tally_meta exists)
			 3. Background.runStartChecks()
			 4. Server.checkIfOnline()
			 5. Server.verifyToken()
			 6. content script takes over

	 */
	async function runStartChecks() {
		try {
			dataReportHeader("🧰 Background.runStartChecks()", "@", "before");

			// install objects
			const newInstall = await Install.init();
			// check the version
			await Install.setVersion();
			// set server/api production | development
			await Install.setCurrentAPI();
			// check the API status
			const serverOnline = await Server.checkIfOnline();

			// if server online ...
			if (serverOnline) {
				console.log("🧰 Background.runStartChecks() -> SERVER ONLINE!");

				let tally_secret = await store("tally_secret");

				// if a token exists
				if (tally_secret.token) {
					// check token
					const tokenResponse = await Server.verifyToken();
					// if token is valid
					if (tokenResponse) {
						console.log("🧰 Background.runStartChecks() -> TOKEN VALID");
						// wait to refresh data from server
						const gameDataResponse = await Server.returnAllGameData();

// // populate monsters
// returnTopMonsters();

						dataReportHeader("END 🧰 Background.runStartChecks()", "@", "after");
						// return true to send data back to content
						if (gameDataResponse) return true;
					} else {
						console.log("🧰 Background.runStartChecks() -> TOKEN NOT VALID");
						// token not valid
						dataReportHeader("/ 🧰 Background.runStartChecks()", "@", "after");
					}
				}
				// no token exists because it is a new install
				else if (newInstall) {
					console.log("🧰 Background.runStartChecks() -> NEW INSTALL, LAUNCH START SCREEN");
					// prompt to get token
					const response = await Install.launchStartScreen();
					dataReportHeader("/ 🧰 Background.runStartChecks()", "@", "after");
				} else {
					console.log("🧰 Background.runStartChecks() -> NO TOKEN");
					dataReportHeader("END 🧰 Background.runStartChecks()", "@", "after");
				}
			} else {
				console.error("🧰 Background.runStartChecks() -> API SERVER NOT ONLINE");
				dataReportHeader("END 🧰 Background.runStartChecks()", "@", "after");
			}
console.log("END OF runStartChecks()")

		} catch (err) {
			console.error(err);
		}
	}


	/**
	 *  Data reporting
	 */
	function dataReport() {
		try {
			let tally_user = store("tally_user"),
				tally_options = store("tally_options"),
				tally_meta = store("tally_meta"),
				tally_secret = store("tally_secret");
			dataReportHeader("🧰 Background.dataReport()", "#", "before");
			if (DEBUG) console.log("%ctally_user", Debug.styles.green, JSON.stringify(tally_user));
			if (DEBUG) console.log("%ctally_options", Debug.styles.green, JSON.stringify(tally_options));
			if (DEBUG) console.log("%ctally_meta", Debug.styles.green, JSON.stringify(tally_meta));
			if (DEBUG) console.log("%ctally_secret", Debug.styles.green, JSON.stringify(tally_secret));
			dataReportHeader("/ 🧰 Background.dataReport()", "#", "after");
		} catch (ex) {
			console.error("dataReport() failed");
		}
	}
	function dataReportHeader(title, char, pos) {
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


	// PUBLIC
	return {
		runStartChecks: runStartChecks,
		dataReport: dataReport,
		dataReportHeader: dataReportHeader
	};
}());
