"use strict";




/*  AJAX FUNCTIONS
 ******************************************************************************/

/**
 *  Check if API Server is online
 */
function checkAPIServerStatus() {
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
		// since server is online check token
		verifyToken();
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
	// if a token does not exist
	if (!_tally_secret.token || _tally_secret.token == "") {
		handleTokenStatus(0, 0, "", 0);
		return;
	}
	// check with server
	$.ajax({
		url: _tally_meta.api + "/user/verifyToken",
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
		//console.log("result.tokenExpires",result.tokenExpires,moment().format(result.tokenExpires));
		// check date on token
		if (result.tokenExpires){
			//diff = returnDateDifferenceMinutes(result.tokenExpires);
			// console.log("diff",diff,moment(result.tokenExpires).diff(moment()));
			diff = FS_Date.difference(result.tokenExpires,"now");
		}
		// if diff is > 0 (in the future)
		if (diff && diff > 0) {
			console.log("<{!}> verifyToken() OK", diff, result.tokenExpires);
			handleTokenStatus(result.tokenExpires, diff, "ok", 1);
		} else {
			console.log("<{!}> verifyToken() EXPIRED", result.tokenExpires);
			handleTokenStatus(result.tokenExpires, diff, "expired", 0);
		}
	}).fail(function(jqXHR, textStatus, errorThrown) {
		console.log("<{!}> verifyToken() result =", jqXHR, textStatus, errorThrown);
		handleTokenStatus(0, 0, "error", 0);
	});
}

/**
 *  Handle token status
 */
function handleTokenStatus(_expires, _expiresDiff, _status, _valid) {
	//console.log("handleTokenStatus()",_expires, _expiresDiff, _status, _valid);
	let _tally_meta = store("tally_meta");
	_tally_meta.userTokenExpires = moment().format(_expires);
	_tally_meta.userTokenExpiresDiff = _expiresDiff;
	_tally_meta.userTokenStatus = _status;
	_tally_meta.userTokenValid = _valid;
	// save result
	store("tally_meta", _tally_meta);
	//dataReport();
	// if userTokenStatus is ok
	if (_tally_meta.userTokenStatus == "ok") {
		console.log(">>>>> handleTokenStatus() -> everything is cool, start game");
		checkServerForDataOnStartApp();
		// content script takes over
	} else if (_tally_meta.userTokenStatus == "expired") {
		console.log(">>>>> handleTokenStatus() -> TOKEN EXPIRED");
		// prompts handled by content script
	} else {
		// tally_meta exists but there is no token or there is an error
		// have we prompted them before?
		// launch registration
		console.log(">>>>> handleTokenStatus() -> NO TOKEN FOUND");
		launchStartScreen();
	}
}

/**
 *  Send update to API server
 */
function sendServerUpdate(data) {
	console.log("<{!}> sendServerUpdate()", data);
	let _tally_meta = store("tally_meta"),
		_tally_user = store("tally_user");
	if (!_tally_meta.serverOnline || _tally_meta.userTokenStatus != "ok") return;
	$.ajax({
		type: "PUT",
		url: _tally_meta.api + "/user/extensionUpdate",
		contentType: 'application/json',
		dataType: 'json',
		data: JSON.stringify(data)
	}).done(result => {
		console.log("<{!}> sendServerUpdate() RESULT =", JSON.stringify(result));
		// treat all server data as master, store in local background user
		if (result[0].username) _tally_user.username = result[0].username;
		if (result[0].clicks) _tally_user.score.clicks = result[0].clicks;
		if (result[0].likes) _tally_user.score.likes = result[0].likes;
		if (result[0].pages) _tally_user.score.pages = result[0].pages;
		if (result[0].score) _tally_user.score.score = result[0].score;
		if (result[0].time) _tally_user.score.time = result[0].time;
		if (result[0].consumable) _tally_user.consumable = result[0].consumable;
		store("tally_user", _tally_user);
	}).fail(error => {
		console.error("<{!}> sendServerUpdate() RESULT =", JSON.stringify(error));
		// server might not be reachable
		checkAPIServerStatus();
	});
}


/**
 *  Send monster update to API server
 */
function sendMonsterUpdate(data) {
	console.log("<{!}> sendMonsterUpdate()", data);
	let _tally_meta = store("tally_meta"),
		_tally_user = store("tally_user"),
		_tally_top_monsters = store("tally_top_monsters");
	if (!_tally_meta.serverOnline || _tally_meta.userTokenStatus != "ok") return;
	$.ajax({
		type: "PUT",
		url: _tally_meta.api + "/user/extensionMonsterUpdate",
		contentType: 'application/json',
		dataType: 'json',
		data: JSON.stringify(data)
	}).done(result => {
		//console.log("<{!}> sendMonsterUpdate() RESULT =", JSON.stringify(result));

		// treat all server data as master
		_tally_user.monsters = convertArrayToObject(result.userMonsters,"mid");
		_tally_top_monsters = convertArrayToObject(result.topMonsters,"mid");

		//console.log("<{!}> sendMonsterUpdate() RESULT =", JSON.stringify(_tally_user.monsters));
		//console.log("<{!}> sendMonsterUpdate() RESULT =", JSON.stringify(_tally_top_monsters));

		store("tally_user", _tally_user);
		store("tally_top_monsters", _tally_top_monsters);
	}).fail(error => {
		console.error("<{!}> sendMonsterUpdate() RESULT =", JSON.stringify(error));
		// server might not be reachable
		checkAPIServerStatus();
	});
}
/**
 *  Refresh monsters from API server
 */
function getMonstersFromServer() {
	//console.log("<{!}> getMonstersFromServer()");
	let _tally_meta = store("tally_meta"),
		_tally_user = store("tally_user"),
		_tally_top_monsters = store("tally_top_monsters"),
		username = "";

	console.log("<{!}> getMonstersFromServer()",_tally_meta,_tally_user);
	if (!_tally_meta.serverOnline || _tally_meta.userTokenStatus != "ok") return;
	if (prop(_tally_user.username) && _tally_user.username != "") username = _tally_user.username;
	$.ajax({
		type: "GET",
		url: _tally_meta.api + "/monsters/"+username,
		contentType: 'application/json',
		dataType: 'json',
	}).done(result => {
		//console.log("<{!}> getMonstersFromServer() RESULT =", JSON.stringify(result));

		// treat all server data as master
		_tally_user.monsters = convertArrayToObject(result.userMonsters,"mid");
		_tally_top_monsters = convertArrayToObject(result.topMonsters,"mid");

		//console.log("<{!}> getMonstersFromServer() RESULT =", JSON.stringify(_tally_user.monsters));
		//console.log("<{!}> getMonstersFromServer() RESULT =", JSON.stringify(_tally_top_monsters));

		store("tally_user", _tally_user);
		store("tally_top_monsters", _tally_top_monsters);
	}).fail(error => {
		console.error("<{!}> getMonstersFromServer() RESULT =", JSON.stringify(error));
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
