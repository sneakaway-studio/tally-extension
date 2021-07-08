"use strict";

window.Background = (function() {
	// PRIVATE

	let DEBUG = Debug.ALL.Background,
		gameStatus = {},
		timedEvents = null;

	/**
	 *  1. Listen for first install, or updated (code or from web store) installation
	 */
	chrome.runtime.onInstalled.addListener(async () => {
		try {
			Debug.elapsedTime("Background chrome.runtime.onInstalled() [1]");
			await runInstallChecks();
		} catch (err) {
			console.error(err);
		}
	});


	/**
	 *  2. Run installation checks
	 *	- always called on new install or update
	 * 	- checks for previous install, verifies user, gets latest server data
	 * 	- order of situations to account for
	 * 		2.1. firstTimeInstallation
	 * 				= true	-> no previous data found, install objects
	 * 				= false	-> previous data found, don't install objects
	 */
	async function runInstallChecks() {
		try {
			let log = "🧰 Background.runInstallChecks()";
			dataReportHeader(log, "@", "before");
			if (DEBUG) console.log("🧰 Background.onInstalled() -> new (or updated) installation detected");
			Debug.elapsedTime("Background.runInstallChecks() [1.0]");

			// 2.1 firstTimeInstallation

			// if T.tally_meta not found, install all objects
			let firstTimeInstallation;

			// FF version < 90 bug fix
			let ffBrowser = navigator.userAgent.indexOf("Firefox");
			let ffVersion = parseInt(navigator.userAgent.substring(ffBrowser + "firefox".length + 1));
			// A workaround to allow Tally to install properly on Firefox 89 or lower:
			// In Firefox Devoloper Edition(Firefox Version 90) and Firefox Nightly(Version 91)
			// this bug does not occur. Meaning this bug is due to a bug in Firefox's source.

			// if (ffBrowser > -1 && ffVersion < 90) {
			// 	firstTimeInstallation = await Install.init();
			// } else {
				firstTimeInstallation = await Install.init();
			// }
			if (DEBUG) console.log(log, "[2.0] ffBrowser =", ffBrowser, ", ffVersion =", ffVersion);
			if (DEBUG) console.log(log, "[2.1] firstTimeInstallation =", firstTimeInstallation);

			// set server/api production | development
			await Install.setEnvironment();

			// 2.2 check server connection and get tally_user

			// params for send()
			let params = {
				caller: "Background.runInstallChecks()",
				action: "getTallyUser",
				method: "GET",
				url: "/user/getTallyUser"
			};
			// contact server
			const getTallyUserResponse = await Server.send(params);
			if (DEBUG) console.log(log, "[3.0] getTallyUserResponse =", getTallyUserResponse);

			// if false returned from server during install
			if (!getTallyUserResponse) {
				// if first time install or a reinstall (a new version)
				// open start screen to prompt user to login
				const startScreenResponse = await Install.launchStartScreen();

				if (firstTimeInstallation)
					if (DEBUG) console.log(log, "[3.1] NEW INSTALL");
				else
					if (DEBUG) console.log(log, "[3.2] RE INSTALL");
			}
			// user logged in ...
			else {
				// 2.3 save more data for game and start

				// username is stored in T.tally_user and we can pass it to populate monsters
				const saveTopMonstersFromApiResponse = await Server.saveTopMonstersFromApi();
				if (DEBUG) console.log(log, "[2.5] saveTopMonstersFromApiResponse =", saveTopMonstersFromApiResponse);
				Debug.elapsedTime(log, "[2.5]");
				// return true to send data back to content
				return true;
			}

			// if we get this far then fail
			return false;

		} catch (err) {
			console.error(err);
		}
	}



	/**
	 *	Timed events to check on server, login status, etc. (mins * secs * millis)
	 */
	function startTimedEvents() {
		try {
			let log = "🧰 Background.startTimedEvents()";
			timedEvents = {

				// log times for monitoring overnight debugging
				logTimesInterval: setInterval(function() {
					console.log("\n🕒 - - - - - - - - - - - - ", Debug.getCurrentDateStr(), " - - - - - - - - - - - - \n");
				}, (60 * 60 * 1000)), // every 1 min

				// save top monsters from api
				saveTopMonstersFromApiInterval: setInterval(function() {
					console.log(log, "saveTopMonstersFromApiInterval", Debug.getCurrentDateStr());
					Server.saveTopMonstersFromApi();
				}, (7 * 24 * 60 * 60 * 1000)), // 1 time per week

			};
		} catch (err) {
			console.error(err);
		}
	}
	// start timed event intervals on first run
	if (timedEvents === null) {
		// after a second
		setTimeout(function() {
			startTimedEvents();
		}, 1000);
	}




	/**
	 *  Data reporting
	 */
	function dataReport() {
		try {
			dataReportHeader("🧰 Background.dataReport()", "#", "before");
			if (DEBUG) console.log("%cT.tally_user", Debug.styles.greenbg, JSON.stringify(T.tally_user));
			if (DEBUG) console.log("%cT.tally_options", Debug.styles.greenbg, JSON.stringify(T.tally_options));
			if (DEBUG) console.log("%cT.tally_meta", Debug.styles.greenbg, JSON.stringify(T.tally_meta));
			dataReportHeader("/ 🧰 Background.dataReport()", "#", "after");
		} catch (err) {
			console.error("dataReport() failed");
		}
	}

	function dataReportHeader(title, char, pos) {
		try {
			// console.trace();
			if (!DEBUG) return;
			// make string
			let line = "";
			for (let i = 0; i < 30; i++) {
				line += char;
			}
			if (pos == "before") console.log("\n");
			console.log(line + " " + title + " " + line);
			if (pos == "after") console.log("\n");
		} catch (err) {
			console.error("dataReportHeader() failed");
		}
	}



	// PUBLIC
	return {
		runInstallChecks: runInstallChecks,
		dataReport: dataReport,
		dataReportHeader: dataReportHeader
	};
}());
