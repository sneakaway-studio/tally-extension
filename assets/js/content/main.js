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

window.TallyMain = (function () {
	// PRIVATE
	let DEBUG = Debug.ALL.TallyMain;

	$(function () {
		// test();
	});

	/**
	 *	0. Script loading order:
	 *  - t.js, debug.js, storage.js",
	 *  - everything else ...
	 *  - main.js
	 */


	/**
	 *	1. Perform test - wait until startUpPromisesResolved (data loads from background)
	 */
	function test() {
		try {
			Debug.elapsedTime("TallyMain.test() [1]");
			let safety = 0;
			while (!T.startUpPromisesResolved) {
				if (++safety > 1000) {
					console.log("🧰 TallyMain SAFETY FIRST!");
					console.log("🧰 TallyMain - >", T.tally_user);
					Debug.elapsedTime("TallyMain.test() [1.2]");
					contentStartChecks();
					break;
				}
				Debug.elapsedTime("TallyMain.test() [2] T.startUpPromisesResolved =", T.startUpPromisesResolved);
			}
		} catch (err) {
			console.error("🧰 TallyMain.test() failed", err);
		}
	}

	/**
	 *	2. Perform all start checks
	 *	- confirm it is safe to run game; then add all required elements to DOM
	 *  - runs every time
	 */
	async function contentStartChecks() {
		try {
			let log = "🧰 TallyMain.contentStartChecks()";
			if (DEBUG) Debug.dataReportHeader(log + " [1]", "#", "before");
			if (DEBUG) console.log(log, '[1.1] -> T.tally_user.username =', T.tally_user.username);

			// if (DEBUG) console.log(log, '[1.1] -> T.tally_user =',T.tally_user);
			// if (DEBUG) console.log(log, '[1.1] -> T.tally_options =',T.tally_options);
			// if (DEBUG) console.log(log, '[1.1] -> T.tally_meta =',T.tally_meta);
			// if (DEBUG) console.log(log, '[1.1] -> T.tally_nearby_monsters =',T.tally_nearby_monsters);
			// if (DEBUG) console.log(log, '[1.1] -> T.tally_stats =',T.tally_stats);
			// if (DEBUG) console.log(log, '[1.1] -> T.tally_top_monsters =',T.tally_top_monsters);


			// 2.1. Check Page.data
			if (DEBUG) console.log(log, '[2.1] -> SET Page.data');

			// stop if Page.data failed
			if (!prop(Page.data)) return console.warn("... Page.data NOT FOUND");
			// check page mode before proceeding
			Page.data.mode = getPageMode();
			// stop if page mode marked notActive
			if (Page.data.mode.notActive) return console.log(" NOT ACTIVE - Page.data.mode =", Page.data.mode);
			// are we on the tally website
			Page.data.actions.onTallyWebsite = Page.data.url.includes(T.tally_meta.website) || false;
			// if so are we on the dashboard?
			if (Page.data.actions.onTallyWebsite)
				Page.data.actions.onDashboard = Page.data.url.includes(T.tally_meta.website + "/dashboard") || false;


			// 2.2. Remove blocked trackers
			if (DEBUG) console.log(log, '[2.2] -> Check and block trackers');

            // show the number of trackers in the badge
            Tracker.setBadgeText(FS_Object.objLength(Page.data.trackers.found));
			// were trackers dealt with?
			if (FS_Object.objLength(Page.data.trackers.found) > 0 && !Tracker.blockAttempted) {
				// console.log("Page.data.trackers", Page.data.trackers);
				// remove blocked trackers (and save in Page.data.trackers)
				Tracker.removeBlocked();
				// console.log("Page.data.trackers", Page.data.trackers);
			}


			// 2.3. Check for Flags (in case we need to pause and restart game with data)
			if (DEBUG) console.log(log, '[2.3] -> Check for flags');

			// if user has just logged into their account on Tally website
			let dashboardLogin = await Flag.checkForDashboardLogin();
			// if user resets their data on the dashboard
			let accountReset = await Flag.checkForAccountReset();

			// handle this first - most important
			if (dashboardLogin) {
				// stop, get data from server, and start game again
				await TallyStorage.resetTallyUserFromServer();
				return;
			} else if (accountReset) {
				// stop, get data from server, and start game again
				await TallyStorage.resetTallyUserFromServer();
				return;
			}


			// 2.4. Add stylesheets and debugger
			if (DEBUG) console.log(log, '[2.4] -> Add game requirements');

			// add required CSS for game
			FS_String.insertStylesheets();
			// add html for game
			Interface.addBaseHTML();
			// add debugger to page and update
			Debug.add();
			Debug.update();
			// now safe to add Tally
			addTallyToPage();


		} catch (err) {
			console.error(err);
		}
	}

	/**
	 *	Get the page mode for the current page - Make sure Tally isn't disabled on this page | domain | subdomain | etc
	 */
	function getPageMode() {
		try {
			let log = "🧰 TallyMain.getPageMode() -> ";

			// start from scratch
			let mode = {
				active: 0,
				loggedIn: 0,
				serverOffline: 0,
				notActive: 0
			};

			// NOT ACTIVE
			// - something really wrong with page;
			// - tally does not show at all, does not save in background or prompt for login

			// Page.data failed - game cannot start at all
			if (!prop(Page.data)) {
				if (DEBUG) console.log(log + "No Page.data found");
				mode.notActive = 1;
			}
			// this is a disabled domain - user has added this to blocklist
			else if (prop(T.tally_options.disabledDomains) && (
					($.inArray(Page.data.domain, T.tally_options.disabledDomains) >= 0) ||
					($.inArray(Page.data.subDomain, T.tally_options.disabledDomains) >= 0)
				)) {
				if (DEBUG) console.log(log + "Tally is disabled on this domain");
				mode.notActive = 1;
			}
			// this is not a web page (e.g. a PDF or image)
			else if (Page.data.contentType != "text/html") {
				if (DEBUG) console.log(log + "Tally is disabled on pages like " + Page.data.contentType);
				mode.notActive = 1;
			}
			// this is a file:// URI
			else if (Page.data.url.indexOf("file://") > -1) {
				if (DEBUG) console.log(log + "Tally is disabled on file:// urls");
				mode.notActive = 1;
			}
			// this is a popup / signin that is really small
			else if (Page.data.browser.width < 600) {
				if (DEBUG) console.log(log + "Tally is disabled on small windows");
				mode.notActive = 1;
			}

			// SERVER IS OFFLINE
			// - tally can still point to trackers, save in bg
			// - the game can run using the background only, for example, if user not logged-in or server is offline
			if (!T.tally_meta.server.online) {
				if (DEBUG) console.log(log + "Connection to Tally server is down");
				mode.serverOffline = 1;
			}

			// NOT LOGGED IN OR NO ACCOUNT
			// - no account or did not validate;
			// - tally can still point to trackers, prompt for login (assuming server is online), save in bg
			else if (T.tally_meta.userLoggedIn) {
				if (DEBUG) console.log(log + "T.tally_meta.userLoggedIn =", T.tally_meta.userLoggedIn);
				mode.loggedIn = 1;
			}

			// ACTIVE
			// - background, login, server, and everything else (like the above) is good, let's roll
			if (mode.notActive == 0 && mode.serverOffline == 0 && mode.loggedIn === 1) {
				if (DEBUG) console.log(log + "All is good, setting mode.active = 1");
				mode.active = 1;
			}

			// return to save in Page.data.mode
			return mode;

		} catch (err) {
			console.error(err);
		}
	}

	/**
	 *	3. Add Tally to page
	 *	- confirm it is safe to run game; then add all required elements to DOM
	 */
	function addTallyToPage() {
		try {
			// 3.1. add Tally character
			if (DEBUG) console.log('🧰 TallyMain.addTallyToPage() [3.1] -> Add tally');

			// add Tally character
			Tally.addCharacter();
			// add timed events listeners
			TallyEvents.startTimeEvents();
			// add main click listener
			TallyListeners.addMainClickEventListener();
			// add scroll listener
			Progress.createScrollListeners();
			// create a fresh background update
			TallyData.createBackgroundUpdate();
			// add stats
			Tally.addStats();
			// add disguise
			Disguise.displayIfTrackerBlocked();

			// start game on the page
			startGameOnPage();

		} catch (err) {
			console.error(err);
		}
	}

	/**
	 * 	4. Run game on this page, can be called as many times as necessary
	 */
	function startGameOnPage() {
		try {
			if (DEBUG) Debug.dataReportHeader("🧰 TallyMain.startGameOnPage()", "#", "before");

			// allow offline
			if (Page.data.mode.notActive) return console.warn("🧰 TallyMain.startGameOnPage() Page.data.mode =", Page.data.mode);
			// don't allow if mode disabled
			if (T.tally_options.gameMode === "disabled") return;



			// Check and show items
			if (DEBUG) console.log("🧰 TallyMain.startGameOnPage() [4.1] -> Add items");

			// potentially add a consumable
			Consumable.randomizer();
			// update debugger
			Debug.update();
			// add key debugging
			Debug.addKeys();
			// start Demo if we are running in demo mode
			Demo.start();


			// checks to perform after user has interacted with page
			setTimeout(function () {

				if (DEBUG) console.log("🧰 TallyMain.startGameOnPage() [4.2] -> Check progress");
				// check for, and possibly complete any progress
				Progress.check("TallyMain");

				// check last active status and potentially recharge
				// TallyEvents.checkLastActiveAndRecharge();


				if (DEBUG) console.log("🧰 TallyMain.startGameOnPage() [4.3] -> Check badges");
				// potentially add badge
				Badge.check();

				// after a bit more time
				setTimeout(function () {
					if (DEBUG) console.log("🧰 TallyMain.startGameOnPage() [4.4] -> Check monsters");
					// check for, and potentially add monsters on the page
					MonsterCheck.check();
				}, 2000);

			}, 10);




			// ?
			// should be done in bg?
			// check for, and potentially execute and flags from server (from previous update)
			// Flag.checkFromServer();


		} catch (err) {
			console.error(err);
		}
	}






	// PUBLIC
	return {
		getPageMode: getPageMode,
		contentStartChecks: contentStartChecks,
		startGameOnPage: startGameOnPage
	};
}());
