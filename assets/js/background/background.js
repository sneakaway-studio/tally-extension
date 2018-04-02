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
	console.log("!!!!! new installation detected");
	// is this the first install?
	if (!prop(store("tally_meta"))) {
		console.log("!!!!! no tally_meta found, creating app");
		// run create app script
		createApp();
	} else {
		// run start app script
		startApp();
	}
});

/**
 *  Start the app (always called)
 */
function startApp(){
	// check the API status, if connected then check token
	checkAPIServerStatus();
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
