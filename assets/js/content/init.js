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

window.TallyInit = (function() {
	// PRIVATE
	let DEBUG = Debug.ALL.TallyInit,
		tallyConsoleIcon = 'font-size:12px; background:url("' +
		chrome.extension.getURL('assets/img/tally/tally-clear-20w.png') + '") no-repeat;',
		dataLoaded = false;

    console.log("%c   Hi, I'm Tally!", tallyConsoleIcon);
	Config.logTimeSinceLoad("TallyInit (object created) [2]");

	// global error handler
	window.onerror = function(message, source, lineno, colno, error) {
		console.error("Tally", message, source, lineno, colno, error);
	};

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
