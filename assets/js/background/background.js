"use strict";

/**
 *  Listener for installations (first|any)
 */
chrome.runtime.onInstalled.addListener(function() {
	console.log("!!!!! new installation detected");
	// is this the first install?
	if (!prop(store("tally_meta"))) {
		console.log("!!!!! no tally_meta found, creating app");
		// attempt to install if not found
		createApp();
		// otherwise is there a valid token?
	} else {
		// check the API status, if connected then check token
		checkAPIServerStatus(checkTokenStatus);
	}
});

/**
 *  Contact server to verify token
 */
function checkTokenStatus() {
	let _tally_meta = store("tally_meta");
	// if server not online, stop everything
	if (!_tally_meta.serverOnline) return;
	// get token status
	_tally_meta.userTokenStatus = verifyToken(handleTokenStatus);
	store("tally_meta", _tally_meta);
}

function handleTokenStatus(){
	let _tally_meta = store("tally_meta");
	//dataReport();
	// if userTokenStatus is ok
	if (_tally_meta.userTokenStatus == "ok") {
		console.log(">>>>> handleTokenStatus() -> everything is cool, starting game");
	} else if (_tally_meta.userTokenStatus == "expired") {
		console.log(">>>>> handleTokenStatus() -> TOKEN EXPIRED");
		// prompt handled by content script
	} else {
		// there is no token, but have we prompted them before?
		// launch registration
		console.log(">>>>> handleTokenStatus() -> NO TOKEN FOUND");
		launchRegistration();
	}
}


/**
 *  Launch registration page
 */
function launchRegistration() {
	let _tally_meta = store("tally_meta");
	// if we haven't prompted them too many times
	if (_tally_meta.userTokenPrompts < 2) {
		// increment prompts
		_tally_meta.userTokenPrompts++;
		store("tally_meta", _tally_meta);

		//launch install page
		chrome.tabs.create({
			url: _tally_meta.website + "/signup"
		}, function(tab) {
			console.log("!!!!! launchRegistration() -> launching registration page",tab.url);
		});
	}
}

/**
 *  Data report
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
