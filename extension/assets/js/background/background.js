"use strict";

window.Background = (function() {
	// PRIVATE

	let DEBUG = Debug.ALL.Background,
		gameStatus = {},
		timedEvents = null;

	/**
	 *  1. Listen for first install, or updated (code or from web store) installation
	 */
	chrome.runtime.onInstalled.addListener(function() {
		try {
			Debug.elapsedTime("Background chrome.runtime.onInstalled() [1]");
			runInstallChecks();
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
	 * 		2.2. serverOnline
	 * 				= false	-> save in meta then stop
	 * 				= true	-> save, then continue
	 * 		2.3. userLoggedIn
	 * 				= false -> not logged-in, open login window
	 * 				= true  -> save data, then continue
	 */
	async function runInstallChecks() {
		try {
			let log = "🧰 Background.runInstallChecks()";
			dataReportHeader(log, "@", "before");
			if (DEBUG) console.log("🧰 Background.onInstalled() -> new (or updated) installation detected");
			Debug.elapsedTime("Background.runInstallChecks() [1]");

			// 2.1 firstTimeInstallation

			// if T.tally_meta not found, install all objects
			const firstTimeInstallation = await Install.init();
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
			if (DEBUG) console.log(log, "[2.4] getTallyUserResponse =", getTallyUserResponse);
			// if false returned
			if (!getTallyUserResponse) {

				// if first time install then definitely open start screen
				if (firstTimeInstallation) {
					if (DEBUG) console.log(log, "-> NEW INSTALL, LAUNCH START SCREEN");
					// prompt to install
					const startScreenResponse = await Install.launchStartScreen();
				}
				// else this is a reinstall and user needs to login
				else {
					if (DEBUG) console.log(log, "-> RE INSTALL, LET SERVER.SEND() LAUNCH START SCREEN");
				}
			}
			// user logged in ...
			else {
				// username is stored in T.tally_user and we can pass it to populate monsters
				const returnTopMonstersResponse = await Server.returnTopMonsters();
				if (DEBUG) console.log(log, "[2.5] returnTopMonstersResponse =", returnTopMonstersResponse);
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
					if (new Date().getMinutes() === "00")
						console.log("\n🕒 - - - - - - - - - - - - ", Debug.getCurrentDateStr(), " - - - - - - - - - - - - \n");
				}, (1 * 60 * 1000)), // every 1 min


				// // check if user online (connected to internet)
				// userOnlineInterval: setInterval(function() {
				// 	console.log(log, "userOnlineInterval", Debug.getCurrentDateStr());
				// 	Server.checkIfUserOnline();
				// }, (1 * 60 * 1000)), // every 1 minute (low overhead)


				// // check if tally server is online
				// serverOnlineInterval: setInterval(function() {
				// 	console.log(log, "serverOnlineInterval", Debug.getCurrentDateStr());
				// 	Server.send({
				// 		caller: "📟 Server.testSendFunction()",
				// 		action: "serverOnline",
				// 		method: "GET",
				// 		url: "",
				// 		data: {}
				// 	}).then(response => {
				// 		console.log("send() / response =", response);
				// 	});
				// }, (10 * 60 * 1000)), // every 10 minutes

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
