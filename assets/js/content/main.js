"use strict";

// all other scripts have loaded so safe to create global objects
let pageData = Page.getPageData(),
	// objects created on server, mirrored locally
	tally_user = {},
	tally_top_monsters = {},
	// objects that only exist locally
	tally_meta = {},
	tally_options = {},
	tally_game_status = {},
	tally_nearby_monsters = {};

window.TallyMain = (function() {
	// PRIVATE
	let DEBUG = true;

	// global error handler
	window.onerror = function(message, source, lineno, colno, error) {
		console.error(message, source, lineno, colno, error);
	};

	$(function() {
		// begin by getting data from background, then performing start checks
		getDataFromBackground(performStartChecks);
	});

	/**
	 *	Get all data from background (can be called multiple times, w/ or w/o callback)
	 */
	function getDataFromBackground(callback = null) {
		try {
			if (DEBUG) console.log('🧰 TallyMain.getDataFromBackground()');
			Promise
				.all([getUserPromise, getOptionsPromise, getMetaPromise, getGameStatusPromise,
					getNearbyMonstersPromise, getStatsPromise, getTopMonstersPromise
				]) // getLastBackgroundUpdatePromise
				.then(function() {
					// if (DEBUG) console.log('🧰 TallyMain.getDataFromBackground() -> all promises have resolved',
					// 			tally_user, tally_options, tally_meta, tally_game_status,
					// 			tally_nearby_monsters, tally_top_monsters);

					if (callback) callback();
				})
				.catch(function(err) {
					if (DEBUG) console.error('🧰 TallyMain.getDataFromBackground() -> ' +
						'one or more promises have failed: ' + err,
						"\n tally_user =", tally_user,
						"\n tally_options =", tally_options,
						"\n tally_meta =", tally_meta,
						"\n tally_game_status =", tally_game_status,
						"\n tally_nearby_monsters =", tally_nearby_monsters,
						"\n tally_top_monsters =", tally_top_monsters
					);
				});
		} catch (err) {
			console.error(err);
			// if for some reason there is error then prompt for new token
			TallyStorage.launchStartScreen();
		}
	}

	/**
	 *	Perform all start checks to make sure it is safe to run game
	 *	then, add all required elements to DOM that should only be added once
	 */
	function performStartChecks() {
		try {
			if (DEBUG) console.log('🧰 TallyMain.performStartChecks()');

			// check if extension should be active on this page before proceeding
			pageData.activeOnPage = shouldExtensionBeActiveOnPage();
			// do not procede if so
			if (!pageData.activeOnPage) return;

			// first, remove trackers that have been caught
			// temp until I can add this to database so game progress is saved
			// Tracker.removeCaughtTrackers(pageData.trackers);

			// add required CSS for game
			FS_String.insertStylesheets();
			// add debugger to page
			Debug.add();
			// add Tally character
			Tally.addCharacter();
			// add timed events listeners
			TallyEvents.startTimeEvents();
			// add main click listener
			TallyListeners.addMainClickEventListener();
			// check the token
			checkTokenStatus(); // shouldn't this be done already ?

			// start game on this page
			startGameOnPage();
		} catch (err) {
			console.error(err);
			// if for some reason there is error then prompt for new token
			TallyStorage.launchStartScreen();
		}
	}

	/**
	 * 	Make sure Tally isn't disabled on this page | domain | subdomain | etc
	 */
	function shouldExtensionBeActiveOnPage() {
		try {
			if (true) console.log("🧰 TallyMain.shouldExtensionBeActiveOnPage()");
			// do not start if ...
			// the server is not online
			if (!tally_meta.serverOnline) {
				console.log("!!!!! Connection to Tally server is down");
				return false;
			}
			// this is a disabled domain
			else if (prop(tally_options.disabledDomains) &&
				(($.inArray(pageData.domain, tally_options.disabledDomains) >= 0) ||
					($.inArray(pageData.subDomain, tally_options.disabledDomains) >= 0))) {
				console.log("!!!!! Tally is disabled on this domain");
				return false;
			}
			// this is not a web page (e.g. a PDF or image)
			else if (pageData.contentType != "text/html") {
				console.log("!!!!! Tally is disabled on pages like " + pageData.contentType);
				return false;
			}
			// this is a file:// URI
			else if (pageData.url.indexOf("file://") > -1) {
				console.log("!!!!! Tally is disabled on file:// urls");
				return false;
			}
			// otherwise it is safe
			else {
				//console.log("shouldExtensionBeActiveOnPage()", true);
				return true;
			}
		} catch (err) {
			console.error(err);
		}
	}

	/**
	 * 	Run game on this page, can be called as many times as necessary, getDataFromBackground() first
	 */
	function startGameOnPage() {
		try {
			// don't run if pageData failed
			if (!pageData || pageData == undefined || !pageData.activeOnPage) return;
			// welcome message for the curious
			console.log("%c   Hello, I'm Tally!", Tally.tallyConsoleIcon);
			// if (DEBUG) console.log(">>>>> startGameOnPage() -> Starting Tally on this page");
			// if (DEBUG) console.log(">>>>> pageData = "+ JSON.stringify(pageData));

			// RUN ALL GAME METHODS

			// check last active status and potentially recharge
			TallyEvents.checkLastActiveAndRecharge();
			// possibly add a consumable
			Consumable.randomizer();
			// check for, and possibly add badge
			Badge.randomizer();
			// check for monsters on the page
			MonsterCheck.check();
			// check to see if there are any progress complete
			Progress.check();
			// if we are on the dashboard there are a few flags we can find
			Page.checkForFlags();
			// update debugger
			Debug.update();

			// after 2 seconds update server
			setTimeout(function() {
				TallyStorage.sendBackgroundUpdate();
			}, 2000);

		} catch (err) {
			console.error(err);
		}
	}

	/**
	 *	Refresh app
	 */
	function refreshApp(caller) {
		try {
			if (!pageData.activeOnPage) return;
			if (DEBUG) console.log("🧰 TallyMain.refreshApp() caller = " + caller);
			// refresh pageData
			pageData = Page.getPageData();
			// refresh game status
			tally_game_status = TallyStorage.getData('tally_game_status');
			// check for monsters again
			MonsterCheck.check();
			Debug.update();
		} catch (err) {
			console.error(err);
		}
	}

	/**
	 *	May or may not need this
	 */
	function resetGameData() {
		// reset everything
		pageData = Page.getPageData();
		tally_user = {};
		tally_options = {};
		tally_meta = {};
		tally_game_status = {};
		tally_nearby_monsters = {};
		tally_top_monsters = {};
		getDataFromBackground(performStartChecks);
	}

	/**
	 *	Make sure user's token is current
	 */
	function checkTokenStatus() {
		try {
			if (DEBUG) console.log("🧰 TallyMain.checkTokenStatus() tally_meta = " + JSON.stringify(tally_meta));
			// if not on the dashboard
			if (pageData.url !== tally_meta.website + "/dashboard") {

				// an array of message prompts for new token
				let msg = [
					"Please <a href='" + tally_meta.website +
					"/dashboard' target='_blank'>visit your dashboard</a> to update your token",
					"<a href='" + tally_meta.website + "/dashboard' target='_blank'>Link your account to start playing Tally</a>"
				];
				// for debugging
				if (tally_meta.userTokenStatus === "expired") {
					// $.growl({
					// 	title: "YOUR TOKEN HAS EXPIRED",
					// 	message: "Click here to get a new one"
					// });
				} else if (tally_meta.userTokenStatus !== "ok") {
					// $.growl({
					// 	title: "YOU HAVE NO TOKEN",
					// 	message: msg[FS_Object.randomArrayIndex(msg)]
					// });
				}
				// if token not valid
				if (tally_meta.userTokenStatus === "expired" || tally_meta.userTokenStatus !== "ok") {
					if (DEBUG) console.log("🧰 TallyMain.checkTokenStatus() TOKEN (STILL) BROKEN " +
						"tally_meta.userTokenPrompts = " + tally_meta.userTokenPrompts);
					// don't bother them every time
					if (tally_meta.userTokenPrompts++ < 10 || tally_meta.userTokenPrompts % 5 == 0) {
						Dialogue.showStr(msg[FS_Object.randomArrayIndex(msg)], "sad");
					}
					TallyStorage.saveData('tally_meta', tally_meta, "🧰 TallyMain.checkTokenStatus()");
				}
			}
		} catch (err) {
			console.error(err);
		}
	}


	// /**
	//  * Prompt user to renew token?
	//  */
	// function promptUserRenewToken() {
	// 	//console.log("promptUserRenewToken()",tally_options);
	//
	// 	if (!tally_meta.userTokenValid) {
	// 		if (DEBUG) console.log("!!!!! userTokenValid is not valid");
	// 		return true;
	// 	}
	// }



	// PUBLIC
	return {
		getDataFromBackground: function(callback) {
			getDataFromBackground(callback);
		},
		performStartChecks: performStartChecks,
		startGameOnPage: startGameOnPage
	};
}());
