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
	 *	Perform all start checks
	 */
	function performStartChecks() {
		try {
			if (DEBUG) console.log('🧰 TallyMain.performStartChecks()');

			// check if extension should be active on this page before proceeding
			pageData.activeOnPage = shouldExtensionBeActiveOnPage();
			// do not procede if so
			if (!pageData.activeOnPage) return;

			// if we are on the dashboard there are a few flags we can find
			Page.checkForFlags();


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
	 * Run Game
	 */
	function startGameOnPage() {
		// don't run if pageData failed
		if (!pageData || pageData == undefined || !pageData.activeOnPage) return;
		console.log("%c   Hello, I'm Tally!", Tally.tallyConsoleIcon);
		// if (DEBUG) console.log(">>>>> startGameOnPage() -> Starting Tally on this page");
		// if (DEBUG) console.log(">>>>> pageData = "+ JSON.stringify(pageData));

		try {
			// LOAD GAME

			// add required CSS for game
			insertStylesheets();
			// add debugger
			Debug.add();

			Tally.start();
			TallyEvents.startTimeEvents();
			TallyListeners.addMainClickEventListener();

			checkToken();
			// if youtube
			if (pageData.domain == "youtube.com")
				// 	addMutationObserver();
				addTitleChecker();
			// remove trackers that have been caught
			// temp until I can add this to database
			//			Tracker.removeCaughtTrackers(pageData.trackers);
			// check for monsters on the page
			MonsterCheck.check();
			// update debugger
			Debug.update();
			// possibly add a consumable
			Consumable.randomizer();
			// check for, and possibly add badge
			Badge.randomizer();
			// check last active status
			TallyEvents.checkLastActive();
			// check to see if there are any progress complete
			Progress.check();

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
	function resetAppOnPage() {
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
	function checkToken() {
		try {
			//if (DEBUG) console.log(">>>>> tally_meta = " + JSON.stringify(tally_meta));
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
					if (DEBUG) console.log(">>>>> tally_meta >>>>>> TOKEN STILL BROKEN, tally_meta.userTokenPrompts = " + tally_meta.userTokenPrompts);
					// don't bother them every time
					//		if (tally_meta.userTokenPrompts % 5 == 0){
					let msg = "Please <a href='" + tally_meta.website + "/dashboard' target='_blank'>visit your dashboard</a> to update your token";
					Dialogue.showStr(msg, "sad");
					//		}
					tally_meta.userTokenPrompts++;
					TallyStorage.saveData('tally_meta', tally_meta, "🧰 TallyMain.checkToken()");
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

	/**
	 *	MutationObserver to detect title element changes (e.g. youtube and other ajax sites)
	 *	NOTE: This slows down the page
	 */
	function addMutationObserver() {
		// if running
		if (tally_options.gameMode === "disabled" || !pageData.activeOnPage) return;
		new MutationObserver(function(mutations) {
			console.log("title changed", mutations[0].target.nodeValue);
			refreshApp("TallyMain.addMutationObserver()");
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
				refreshApp("TallyMain.addTitleChecker()");
			} else {
				//console.log("title is same", pageData.title, " to: ",title);
			}
		}, 10000);
	}

	// PUBLIC
	return {
		getDataFromBackground: function(callback) {
			getDataFromBackground(callback);
		},
		performStartChecks: performStartChecks,
		startGameOnPage: startGameOnPage
	};
}());
