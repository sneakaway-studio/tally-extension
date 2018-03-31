"use strict";




/*  AJAX FUNCTIONS
 ******************************************************************************/


function sendServerUpdate(data) {
	console.log("sendServerUpdate()", data);
	let _tally_meta = store("tally_meta");
	if (!_tally_meta.serverOnline) return;
	$.ajax({
		//url: _tally_meta.api + "/user/userExtensionUpdate",
		url: "http://localhost:5000/api/user/extensionUpdate",
		type: "PUT",
		timeout: 15000, // set timeout to 15 secs to catch ERR_CONNECTION_REFUSED
		contentType: 'application/json',
		dataType: 'json',
		data: JSON.stringify(data),
		success: function(result) {
			console.log("\sendServerUpdate() RESULT =", JSON.stringify(result));
		},
		error: function(jqXhr, textStatus, errorThrown) {
			console.error(errorThrown);
		}
	}).fail(function(jqXHR, textStatus, errorThrown) {
		console.error(errorThrown);
	});
}


/**
 *  Check to see if API Server is online
 */
function checkAPIServerStatus() {
	let _tally_meta = store("tally_meta");
	// time it
	var started = new Date().getTime();
	$.ajax({
		type: "GET",
		timeout: 5000,
		url: _tally_meta.api,
		//context: document.body,
		success: function() {
			var ended = new Date().getTime();
			_tally_meta.serverOnline = 1;
			_tally_meta.userOnline = 1;
			_tally_meta.serverOnlineTime = ended - started;
			// save result
			store("tally_meta", _tally_meta);
			//console.log("RESULT: ", JSON.stringify(_tally_meta));
		},
		error: function(xhr, status, error) {
			_tally_meta.serverOnline = 0;
			_tally_meta.userOnline = 0;
			_tally_meta.serverOnlineTime = -1;
			// save result
			store("tally_meta", _tally_meta);
			//console.log("RESULT: ", JSON.stringify(_tally_meta));
		}
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
	}, 5 * 1000) //00
};
