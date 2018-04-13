"use strict";

// load objects
let pageData = getPageData(),
	eventData = {},
	tally_user = {},
	tally_options = {},
	tally_meta = {},
	tally_game_status = getGameStatus(),
	tally_recent_monsters = {};

let MAIN_DEBUG = false;

$(function() {
	Promise // after async functions then update
		.all([getUserPromise, getOptionsPromise, getMetaPromise, getRecentMonstersPromise]) // , getLastBackgroundUpdatePromise
		.then(function() {
			if (MAIN_DEBUG) console.log('>>>>> init() Promise all data has loaded', tally_user, tally_options);
			// check if extension should be active on this page before proceeding
			pageData.activeOnPage = shouldExtensionBeActiveOnPage();
			if (pageData.activeOnPage)
				startGame();
		})
		.catch(function(error) {
			if (MAIN_DEBUG) console.log('one or more promises have failed: ' + error);
		});
});


/**
 * Make sure Tally isn't disabled on this page|domain|subdomain
 */
function shouldExtensionBeActiveOnPage() {
	if (!tally_meta.serverOnline) {
		if (MAIN_DEBUG) console.log("Connection to Tally server is down");
		return false;
	} else if (tally_options.disabledDomains.length < 1 ||
		($.inArray(pageData.domain, tally_options.disabledDomains) >= 0) ||
		($.inArray(pageData.subDomain, tally_options.disabledDomains) >= 0)) {
		if (MAIN_DEBUG) console.log("Tally is disabled on this domain");
		return false;
	} else if (pageData.contentType != "text/html") {
		if (MAIN_DEBUG) console.log("Tally is disabled on pages like " + pageData.contentType);
		return false;
	} else return true;
}
/**
 * Run Game
 */
function startGame() {
	if (MAIN_DEBUG) console.log(">>>>> startGame() -> Starting Tally on this page");
	//    console.log(">>>>> pageData = "+ JSON.stringify(pageData));


	Debug.add();
	startTally();
	addMainClickEventListener();
	//checkPageForMonsters(pageData.tags);

	if (MAIN_DEBUG) console.log(">>>>> tally_meta = " + JSON.stringify(tally_meta));
	if (pageData.url != tally_meta.website + "/dashboard") {
		if (tally_meta.userTokenStatus == "expired") {
			$.growl({
				title: "YOUR TOKEN HAS EXPIRED",
				message: "Click here to get a new one"
			});
		} else if (tally_meta.userTokenStatus != "ok") {
			$.growl({
				title: "YOU HAVE NO TOKEN", 
				message: "<a href='" + tally_meta.website + "/dashboard' target='_blank'>Link your account to start playing Tally</a>"
			});
		}
	}


	Monster.check();
	Debug.update();
}

/**
 * Timed functions
 */
var timedEvents = {
	pageTimerInterval: setInterval(function() {
		// if this page is visible
		if (document.hasFocus()) {
			pageData.time = pageData.time + 0.5;
			Debug.update();
		}
	}, 500)
};
