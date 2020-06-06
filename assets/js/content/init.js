"use strict";

/**
 *  ______     ____
 * /_  __/__ _/ / /_ __
 *  / / / _ `/ / / // /
 * /_/  \_,_/_/_/\_, /
 *              /___/
 *
 *  https://tallysavestheinternet.com
 *
 */





Config.logTimeSinceLoad("TallyInit (script loaded, game objects created) [1]");

window.TallyInit = (function() {
	// PRIVATE
	let DEBUG = Debug.ALL.TallyInit,
		tallyConsoleIcon = 'font-size:12px; background:url("' +
		chrome.extension.getURL('assets/img/tally/tally-clear-20w.png') + '") no-repeat;',
		dataLoaded = false;

	Config.logTimeSinceLoad("TallyInit (object created) [2]");

	// global error handler
	window.onerror = function(message, source, lineno, colno, error) {
		console.error("Tally", message, source, lineno, colno, error);
	};



	try {
		// Config.logTimeSinceLoad("TallyInit (calling getDataFromBackground()) [3]");
		// get data from background, perform start checks
		// getDataFromBackground();
	} catch (err) {
		console.error("🔥 TallyInit.getDataFromBackground() failed", err);
	}





	/**
	 *	1. Get all data from background
	 *  - can be called multiple times, w/ or w/o callback
	 *  - if sent with contentStartChecks callback then resets game in content script
	 *  - assumes background data is current (so does not sync with server)
	 */
	// async function getDataFromBackground(callback = null) {
	// 	try {
	// 		Promise
	// 			.all([TallyStorage.getUserPromise, getOptionsPromise, getMetaPromise,
	// 				getNearbyMonstersPromise, getStatsPromise, getTopMonstersPromise
	// 			])
	// 			.then(function() {
	// 				if (DEBUG) console.log('🔥 TallyInit.getDataFromBackground() [1] all promises have resolved');
	// 				// if (DEBUG) console.log("%ctally_user", Debug.styles.green, JSON.stringify(tally_user));
	// 				// if (DEBUG) console.log("%ctally_options", Debug.styles.green, JSON.stringify(tally_options));
	// 				// if (DEBUG) console.log("%ctally_meta", Debug.styles.green, JSON.stringify(tally_meta));
	// 				// tally_nearby_monsters, tally_top_monsters, tally_stats
	// 				if (callback) callback();
    //
	//
    //
    //
    //                     Config.logTimeSinceLoad("TallyInit (getDataFromBackground() resolved) [4]");
    //
    //         		// welcome message for the curious
    //         		console.log("%c   Hello, I'm Tally!", tallyConsoleIcon);
	// 			})
	// 			.catch(function(err) {
	// 				console.error('🔥 TallyInit.getDataFromBackground() -> ' +
	// 					'one or more promises have failed: ' + err,
	// 					"\n tally_user =", tally_user,
	// 					"\n tally_options =", tally_options,
	// 					"\n tally_meta =", tally_meta,
	// 					"\n tally_nearby_monsters =", tally_nearby_monsters,
	// 					"\n tally_top_monsters =", tally_top_monsters,
	// 					"\n tally_stats =", tally_stats
	// 				);
	// 			});
	// 	} catch (err) {
	// 		console.error(err);
	// 	}
	// }



	// PUBLIC
	return {
        set dataLoaded (value) {
            dataLoaded = value;
        },
        get dataLoaded () {
            return dataLoaded;
        },
		tallyConsoleIcon: tallyConsoleIcon
	};
}());
