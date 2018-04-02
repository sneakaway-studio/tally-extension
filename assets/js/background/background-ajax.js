"use strict";




/*  AJAX FUNCTIONS
 ******************************************************************************/

/**
 *  Check to see if API Server is online
 */
function checkAPIServerStatus(callback) {
	let _tally_meta = store("tally_meta");
	// time it
	var started = new Date().getTime();
	$.ajax({
		type: "GET",
		timeout: 5000,
		url: _tally_meta.api,
		contentType: 'application/json', // type of data you are sending
		dataType: 'json', // type of data you expect to receive
	}).done(result => {
		console.log("<{!}> checkAPIServerStatus() SERVER ONLINE", JSON.stringify(result));
		var ended = new Date().getTime();
		_tally_meta.serverOnline = 1;
		_tally_meta.userOnline = 1;
		_tally_meta.serverOnlineTime = ended - started;
		// callback (checkTokenStatus)
		if (callback) callback();
	}).fail(error => {
		// server is not online, do not start game
		console.error("<{!}> checkAPIServerStatus() SERVER IS NOT ONLINE, DO NOT START GAME", JSON.stringify(error));
		_tally_meta.serverOnline = 0;
		_tally_meta.userOnline = 0;
		_tally_meta.serverOnlineTime = -1;
	}).always(() => {
		//console.log("<{!}> checkAPIServerStatus() ALWAYS");
		// save result
		store("tally_meta", _tally_meta);
	});
}

/**
 *  Verify token is valid, not expired
 */
function verifyToken(callback) {
	let _tally_secret = store("tally_secret"),
		_tally_meta = store("tally_meta");
    // if a token exsts
    if (!prop(_tally_secret.token) || _tally_secret.token == "") return "";
    // check with server
	$.ajax({
		url: _tally_meta.api + "/verifyToken",
		type: "POST",
		timeout: 15000, // set timeout to 15 secs to catch ERR_CONNECTION_REFUSED
		contentType: 'application/json',
		dataType: 'json',
		data: JSON.stringify({
			"token": _tally_secret.token
		})
	}).done(result => {
		//console.log("<{!}> verifyToken()", JSON.stringify(result));
		let diff = null;
		// check date on token
		if (result.tokenExpires)
			diff = returnDateDifferenceMinutes(result.tokenExpires);

		if (diff && diff > 0) {
			console.log("<{!}> verifyToken() OK", diff, result.tokenExpires);
			_tally_meta.userTokenExpires = result.tokenExpires;
			_tally_meta.userTokenExpiresDiff = diff;
            _tally_meta.userTokenStatus = "ok";
			_tally_meta.userTokenValid = 1;
		} else {
			console.log("<{!}> verifyToken() EXPIRED", result.tokenExpires);
			_tally_meta.userTokenExpires = result.tokenExpires;
			_tally_meta.userTokenExpiresDiff = diff;
            _tally_meta.userTokenStatus = "expired";
			_tally_meta.userTokenValid = 0;
		}
	}).fail(function(jqXHR, textStatus, errorThrown) {
		console.log("<{!}> verifyToken() result =", jqXHR, textStatus, errorThrown);
        _tally_meta.userTokenExpires = 0;
        _tally_meta.userTokenExpiresDiff = 0
		_tally_meta.userTokenStatus = "error";
        _tally_meta.userTokenValid = 0;
	}).always(() => {
		console.log("<{!}> verifyToken() userTokenStatus =", _tally_meta.userTokenStatus);
		// save result
		store("tally_meta", _tally_meta);
        // callback: handleTokenStatus()
        if (callback) callback();
		return _tally_meta.userTokenStatus;
	});
}


function sendServerUpdate(data) {
	console.log("<{!}> sendServerUpdate()", data);
	let _tally_meta = store("tally_meta");
	if (!_tally_meta.serverOnline) return;
	$.ajax({
		type: "PUT",
		url: _tally_meta.api + "/user/extensionUpdate",
		contentType: 'application/json',
		dataType: 'json',
		data: JSON.stringify(data)
	}).done(result => {
		console.log("<{!}> sendServerUpdate() RESULT =", JSON.stringify(result));
	}).fail(error => {
		console.error("<{!}> sendServerUpdate() RESULT =", JSON.stringify(error));
		// server might not be reachable
		checkAPIServerStatus();
	});
}


// create timed functions
var timedEvents = {
	// check if user is online
	// userOnlineInt: setInterval(function() {
	// }, 5 * 1000),
	// check if server online
	serverOnlineInt: setInterval(function() {
		checkAPIServerStatus();
	}, 500 * 1000) //
};
