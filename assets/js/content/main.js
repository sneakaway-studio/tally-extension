"use strict";

// load objects
let pageData = Page.getData(),
	eventData = {},
	tally_user = {},
	tally_options = {},
	tally_meta = {},
	tally_game_status = getGameStatus(),
	tally_nearby_monsters = {},
	tally_top_monsters = getTopMonsters(),
	tally_trackers = getTrackerBlockList();


let MAIN_DEBUG = false;

$(function() {
	Promise // after async functions then update
		.all([getUserPromise, getOptionsPromise, getMetaPromise, getNearbyMonstersPromise, getTrackerBlockListPromise]) // , getLastBackgroundUpdatePromise
		.then(function() {
			if (MAIN_DEBUG) console.log('>>>>> init() Promise all data has loaded', tally_user, tally_options, tally_trackers);

			// check if we can update the token
			Page.checkDashboardUpdateToken();

			// check if extension should be active on this page before proceeding
			pageData.activeOnPage = shouldExtensionBeActiveOnPage();
			if (pageData.activeOnPage)
				startGameOnPage();
		})
		.catch(function(error) {
			if (MAIN_DEBUG) console.log('one or more promises have failed: ' + error);
		});
});


/**
 * Make sure Tally isn't disabled on this page|domain|subdomain
 */
function shouldExtensionBeActiveOnPage() {
	//console.log("shouldExtensionBeActiveOnPage()",tally_options);
	if (!tally_meta.serverOnline) {
		if (MAIN_DEBUG) console.log("!!!!! Connection to Tally server is down");
		return false;
	} else if (prop(tally_options.disabledDomains) &&
		(($.inArray(pageData.domain, tally_options.disabledDomains) >= 0) ||
			($.inArray(pageData.subDomain, tally_options.disabledDomains) >= 0))) {
		if (MAIN_DEBUG) console.log("!!!!! Tally is disabled on this domain");
		return false;
	} else if (pageData.contentType != "text/html") {
		if (MAIN_DEBUG) console.log("!!!!! Tally is disabled on pages like " + pageData.contentType);
		return false;
	} else {
		//console.log("shouldExtensionBeActiveOnPage()", true);
		return true;
	}
}



/**
 * Run Game
 */
function startGameOnPage() {
	// don't run if pageData failed
	if (!pageData || pageData == undefined || !pageData.activeOnPage) return;
	if (MAIN_DEBUG) console.log(">>>>> startGameOnPage() -> Starting Tally on this page");
	//    console.log(">>>>> pageData = "+ JSON.stringify(pageData));

	insertStylesheets();
	Debug.add();
	Tally.start();
	startTimeEvents();
	addMainClickEventListener();
	//checkPageForMonsters(pageData.tags);

	checkToken();
	// if youtube
	if (pageData.domain == "youtube.com")
		// 	addMutationObserver();
		addTitleChecker();

	// remove trackers that have been caught
	Tracker.removeCaughtTrackers(pageData.trackers);
	// check for  monsters on the page
	MonsterCheck.check();
	// update debugger
	Debug.update();
	// possibly add a consumable
	Consumable.create();
	// check recharge status
	Stats.checkLastActive();
}

/**
 *	Refresh app
 */
function refreshApp() {
	if (!pageData.activeOnPage) return;
	pageData = Page.getData();
	tally_game_status = getGameStatus();
	MonsterCheck.check();
	Debug.update();
}


function checkToken() {
	//if (MAIN_DEBUG) console.log(">>>>> tally_meta = " + JSON.stringify(tally_meta));
	if (pageData.url != tally_meta.website + "/dashboard") {
		if (tally_meta.userTokenStatus == "expired") {
			// $.growl({
			// 	title: "YOUR TOKEN HAS EXPIRED",
			// 	message: "Click here to get a new one"
			// });
		} else if (tally_meta.userTokenStatus != "ok") {
			// $.growl({
			// 	title: "YOU HAVE NO TOKEN",
			// 	message: "<a href='" + tally_meta.website + "/dashboard' target='_blank'>Link your account to start playing Tally</a>"
			// });

		}
		// if token not valid
		if (tally_meta.userTokenStatus == "expired" || tally_meta.userTokenStatus != "ok") {
			if (MAIN_DEBUG) console.log(">>>>> tally_meta >>>>>> TOKEN STILL BROKEN, tally_meta.userTokenPrompts = "+ tally_meta.userTokenPrompts);
			// don't bother them every time
	//		if (tally_meta.userTokenPrompts % 5 == 0){
				let msg = "Please <a href='" + tally_meta.website + "/dashboard' target='_blank'>visit your dashboard</a> to update your token";
				Thought.showString(msg, "sad");
	//		}
			tally_meta.userTokenPrompts++;
			saveMeta("checkToken()");
		}
	}
}

// /**
//  * Prompt user to renew token?
//  */
// function promptUserRenewToken() {
// 	//console.log("promptUserRenewToken()",tally_options);
//
// 	if (!tally_meta.userTokenValid) {
// 		if (MAIN_DEBUG) console.log("!!!!! userTokenValid is not valid");
// 		return true;
// 	}
// }



/**
 *	MutationObserver to detect title element changes (e.g. youtube and other ajax sites)
 *	NOTE: This slows down the page
 */
function addMutationObserver() {
	// if running
	if (tally_options.gameMode === "disabled" || !pageData.activeOnPage) return;
	new MutationObserver(function(mutations) {
		console.log("title changed", mutations[0].target.nodeValue);
		refreshApp();
	}).observe(
		document.querySelector('title'), {
			subtree: true,
			characterData: true,
			childList: true
		}
	);
}

function addTitleChecker() {
	let pageTitleInterval = setInterval(function() {
		let title = getTitle();
		if (title != pageData.title) {
			//console.log("title changed", pageData.title, " to: ",title);
			refreshApp();
		} else {
			//console.log("title is same", pageData.title, " to: ",title);
		}
	}, 10000);
}



/**
 * Timed functions
 */
var timedEvents = {};

function startTimeEvents() {
	timedEvents = {
		pageTimerInterval: setInterval(function() {
			// if this page is visible
			if (document.hasFocus()) {
				pageData.time = pageData.time + 0.5;
				Debug.update();
			}
		}, 500)
	};
}
