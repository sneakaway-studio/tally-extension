"use strict";

// FLOW OF BACKGROUND...
/*	if tally_meta not found...
		-> createApp() -> launchStartScreen() -> startApp() ...
	if tally_meta is found OR after createApp()...
		-> startApp() -> checkAPIServerStatus() -> checkTokenStatus() -> content script takes over */



/**
 *  Listen for installations (first|any)
 */
chrome.runtime.onInstalled.addListener(function() {
	try {
		console.log("!!!!! new installation detected");
		// is this the first install?
		if (!prop(store("tally_meta"))) {
			console.log("!!!!! no tally_meta found, creating app");
			// run create app script
			createApp();

	// NEED TO KEEP WORKING ON THIS
		// } else if (isNewVersion()) {
		// 	// does the manifest version installed match the version in tally_meta
		// 	console.log("SAME VERSION");
		// 	createApp();
		} else {
			// run start app script
			startApp();
		}
	} catch (err) {
		console.error(err);
	}
});

/**
 *  Start the app (always called)
 */
function startApp() {
	try {
		console.log(">>>>> startApp()");
		isNewVersion();
		// set server/api (edit in Inspect views background page / Application / Local Storage)
		checkCurrentAPI();
		// check the API status, if connected then check token
		checkAPIServerStatus();
	} catch (err) {
		console.error(err);
	}
}

function checkServerForDataOnStartApp(){
	try {
	    // populate monsters
	    getMonstersFromServer();
	} catch (err) {
		console.error(err);
	}
}

/**
 * 	Check if it is a new version
 */
function isNewVersion() {
	try {
		let _tally_meta = store("tally_meta"),
			manifestData = chrome.runtime.getManifest();
		if (_tally_meta.version == manifestData.version) {
			console.log(_tally_meta.version, manifestData.version, "..... SAME VERSION");
			return true;
		} else {
			console.log(_tally_meta.version, manifestData.version, "!!!!! NEW VERSION");
			// update version
			_tally_meta.version = manifestData.version;
			store("tally_meta", _tally_meta);
			return false;
		}
	} catch (err) {
		console.error(err);
	}
}


/**
 *  Set development or production server
 */
function checkCurrentAPI() {
	try {
		let _tally_meta = store("tally_meta");
		_tally_meta.api = Config[_tally_meta.currentAPI].api;
		_tally_meta.website = Config[_tally_meta.currentAPI].website;
		console.log("checkCurrentAPI()", _tally_meta.currentAPI, _tally_meta.api, _tally_meta.website);
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
		console.log("############################## welcome back ! ##############################");
		console.log("tally_user", JSON.stringify(tally_user));
		console.log("tally_options", JSON.stringify(tally_options));
		console.log("tally_meta", JSON.stringify(tally_meta));
		console.log("tally_secret", JSON.stringify(tally_secret));
	} catch (ex) {
		console.log("dataReport() failed");
	}
}
