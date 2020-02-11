"use strict";

window.Background = (function() {
	// PRIVATE

	let DEBUG = true;

	/* FLOW OF BACKGROUND...

		if tally_meta not found...
			1. Install.init()
			2. Install.launchStartScreen()
		then (or if tally_meta exists)
			3. Background.startApp()
			4. Server.checkIfOnline()
			5. Server.verifyToken()
			6. content script takes over */




	/**
	 *  1. Listen for installations (first|any)
	 */
	chrome.runtime.onInstalled.addListener(function() {
		try {
			if (DEBUG) console.log("🧰 Background.onInstalled() -> new installation (or updated code) detected");
			// does tally_meta exists, or is this the first install?
			if (!prop(store("tally_meta"))) {
				if (DEBUG) console.log("🧰 no tally_meta found, creating app");
				// run create app script
				Install.init();
			} else {
				// run start app checks
				startApp();
			}
		} catch (err) {
			console.error(err);
		}
	});

	/**
	 *  2. Start the app (always called)
	 */
	function startApp() {
		try {
			if (DEBUG) console.log("🧰 Background.startApp()");
			// check the version
			isNewVersion();
			// set server/api production | development
			setCurrentAPI();
			// check the API status, if connected then check token
			Server.checkIfOnline();
		} catch (err) {
			console.error(err);
		}
	}



	/**
	 * 	2a. Check if it is a new version
	 */
	function isNewVersion() {
		try {
			let _tally_meta = store("tally_meta"),
				manifestData = chrome.runtime.getManifest();
			if (_tally_meta.version == manifestData.version) {
				if (DEBUG) console.log("🧰 Background.isNewVersion()", _tally_meta.version +"=="+ manifestData.version, "..... SAME VERSION");
				return false;
			} else {
				if (DEBUG) console.log("🧰 Background.isNewVersion()", _tally_meta.version +"!="+ manifestData.version, "!!!!! NEW VERSION");
				// update version
				_tally_meta.version = manifestData.version;
				store("tally_meta", _tally_meta);
				return true;
			}
		} catch (err) {
			console.error(err);
		}
	}


	/**
	 *  2b. Set development or production server
	 */
	function setCurrentAPI() {
		try {
			let _tally_meta = store("tally_meta");
			_tally_meta.api = Config[_tally_meta.currentAPI].api;
			_tally_meta.website = Config[_tally_meta.currentAPI].website;
			if (DEBUG) console.log("🧰 Background.setCurrentAPI() currentAPI=%c" + _tally_meta.currentAPI, Debug.styles.green,
				"api=" + _tally_meta.api, "website=" + _tally_meta.website);
			store("tally_meta", _tally_meta);
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
			if (DEBUG) console.log("############################## welcome back ! ##############################");
			if (DEBUG) console.log("%ctally_user", Debug.styles.green, JSON.stringify(tally_user));
			if (DEBUG) console.log("%ctally_options", Debug.styles.green, JSON.stringify(tally_options));
			if (DEBUG) console.log("%ctally_meta", Debug.styles.green, JSON.stringify(tally_meta));
			if (DEBUG) console.log("%ctally_secret", Debug.styles.green, JSON.stringify(tally_secret));
		} catch (ex) {
			console.log("dataReport() failed");
		}
	}


	// PUBLIC
	return {
		startApp: startApp,
		dataReport: dataReport
	};
}());
