"use strict";

var Tracker = (function() {

	let TRACKER_DEBUG = true;

	function removeTracker(trackersOnPage){
		if (trackersOnPage.length < 1) return;
		for(let i=0,l=trackersOnPage.length; i<l; i++){
			var x = $("script[src*='"+ trackersOnPage[i] +"']");


			console.log(trackersOnPage[i],x[0].src);

			// block it
			if (x[0].src){
				x[0].src = "script-blocked-by-tally!!!";
			}
		}



	}

	// PUBLIC
	return {
		remove: removeTracker
	};
}());
