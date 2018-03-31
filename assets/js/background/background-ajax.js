"use strict";




/*  AJAX FUNCTIONS
******************************************************************************/


function sendServerUpdate(data) {
    console.log("sendServerUpdate()",data);
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
function checkAPIServerStatus(callback) {
    let tally_meta = store("tally_meta");
	// time it
	var started = new Date().getTime();
	// element to load into
	var img = document.body.appendChild(document.createElement("img"));
	img.onload = function() {
		var ended = new Date().getTime();
		tally_meta.serverOnline = 1;
		tally_meta.userOnline = 1;
		tally_meta.connectionSpeed = ended - started;
	};
	img.onerror = function() {
		tally_meta.serverOnline = 0;
		tally_meta.connectionSpeed = -1;
	};
    //console.log("tally_meta",tally_meta)
	console.log(tally_meta.api +"/pixel");
    try {
    	// attempt to load image file served by API
    	img.src = tally_meta.api +"/pixel";
        store("tally_meta");
    } catch(ex){
        console.log("server not online");
    }
}

// create timed functions
var timedEvents = {
	// check if user is online
	//userOnlineInt: setInterval( function(){ ping("http://google.com",userOnlineCallback); }, 5*1000),
	// check if server online
	serverOnlineInt: setInterval( function(){ checkAPIServerStatus(); }, 300*1000)
};
