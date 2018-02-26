/*jshint esversion: 6 */




/*  AJAX FUNCTIONS
******************************************************************************/


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
        log("server not online");
    }
}

// create timed functions
var timedEvents = {
	// check if user is online
	//userOnlineInt: setInterval( function(){ ping("http://google.com",userOnlineCallback); }, 5*1000),
	// check if server online
	serverOnlineInt: setInterval( function(){ checkAPIServerStatus(); }, 300*1000)
};
