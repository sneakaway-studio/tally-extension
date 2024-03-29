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

self.TallyMain = (function() {
	// PRIVATE
	let DEBUG = Debug.ALL.TallyMain;

	/**
	 *	Script loading order:
	 *  0. t.js, debug.js, storage.js", [...], main.js, [...], everything else ...
	 *	1. TallyMain.runStartupChecks() (et al functions) called after async operations
	 */


	/**
	 *	2. Perform all start checks
	 *	- confirm it is safe to run game; then add all required elements to DOM
	 *  - runs every time
	 */
	async function runStartupChecks() {
		try {
			let log = "🧰 TallyMain.runStartupChecks()";
			if (DEBUG) Debug.dataReportHeader(log + " [1]", "#", "before");
			if (DEBUG) console.log(log, '[1.1] -> T.tally_user.username =', T.tally_user.username);

			// if (DEBUG) console.log(log, '[1.1] -> T.tally_user =', T.tally_user);
			// if (DEBUG) console.log(log, '[1.1] -> T.tally_options =', T.tally_options);
			// if (DEBUG) console.log(log, '[1.1] -> T.tally_meta =', T.tally_meta);
			// if (DEBUG) console.log(log, '[1.1] -> T.tally_nearby_monsters =', T.tally_nearby_monsters);
			// if (DEBUG) console.log(log, '[1.1] -> T.tally_tag_matches =', T.tally_tag_matches);
			// if (DEBUG) console.log(log, '[1.1] -> T.tally_stats =', T.tally_stats);
			// if (DEBUG) console.log(log, '[1.1] -> T.tally_top_monsters =', T.tally_top_monsters);


			// 2.1. Check Page.data
			if (DEBUG) console.log(log, '[2.1] -> SET Page.data');

			// stop if Page.data failed
			if (!FS_Object.prop(Page.data)) return console.warn("... Page.data NOT FOUND");
			// check page mode before proceeding
			savePageMode();


			// 2.2. Check for Flags (in case we need to pause and restart game with data)
			if (DEBUG) console.log(log, '[2.2] -> Check for flags');

			// SET PAGE INFO

			// are we on the tally website?
			Page.data.actions.onTallyWebsite = Page.data.url.includes(T.tally_meta.env.website) || false;
			// if so are we on the dashboard?
			if (Page.data.actions.onTallyWebsite)
				Page.data.actions.onDashboard = Page.data.url.includes("/dashboard") || false;
			// browser name is async op
			Page.data.browser.name = await Environment.getBrowserName();

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


			// stop if page mode marked notActive
			if (Page.data.mode.notActive) {
				if (DEBUG) console.log(" NOT ACTIVE - Page.data.mode =", Page.data.mode);
				return;
			}

			// 2.3. Remove blocked trackers
			if (DEBUG) console.log(log, '[2.3] -> Check and block trackers');

			// show the number of trackers in the badge
			Tracker.setBadgeText(FS_Object.objLength(Page.data.trackers.found));
			// were trackers dealt with?
			if (T.tally_user.trackers && FS_Object.objLength(Page.data.trackers.found) > 0 && !Tracker.blockAttempted) {
				// console.log("Page.data.trackers", Page.data.trackers);
				// remove blocked trackers (and save in Page.data.trackers)
				Tracker.removeBlocked();
				// console.log("Page.data.trackers", Page.data.trackers);
			}



			// 2.4. Add stylesheets and debugger
			if (DEBUG) console.log(log, '[2.4] -> Add game requirements');

			// add required CSS for game
			FS_String.insertStylesheets();
			// add html for game
			Interface.addBaseHTML();

			// now safe to add Tally
			addTallyToPage();


		} catch (err) {
			console.error(err);
		}
	}


	const ignoreFiletypes = [
		"jpg", "gif", "png", "pdf",
		"xml", "json", "txt", "svg",
		"js", "css",
	];

	/**
	 *	Get the page mode for the current page
	 * 	- Make sure Tally isn't disabled on this page | domain | subdomain | etc
	 */
	function savePageMode() {
		try {
			let log = "🧰 TallyMain.savePageMode() -> ";

			// start from scratch
			let mode = {
				active: false,
				loggedIn: false,
				serverOnline: false,
				userOnline: navigator.onLine,
				notActive: false
			};


			// USER + SERVER IS ONLINE
			// - if not, tally can still point to trackers, save in bg
			// - if not, the game can run using the background only
			if (T.tally_meta.userOnline && T.tally_meta.serverOnline) {
				if (DEBUG) console.log(log + "User online and connection to Tally server is 👍");
				mode.serverOnline = true;
			}


			// NOT LOGGED IN OR NO ACCOUNT
			// - no account or did not validate;
			// - tally can still point to trackers, prompt for login (assuming server is online), save in bg
			if (T.tally_meta.userLoggedIn) {
				if (DEBUG) console.log(log + "T.tally_meta.userLoggedIn =", T.tally_meta.userLoggedIn);
				mode.loggedIn = true;
			}


			// NOT ACTIVE
			// - something really wrong with page;
			// - tally does not show at all, does not save in background or prompt for login

			// Page.data failed - game cannot start at all
			if (!FS_Object.prop(Page.data)) {
				if (DEBUG) console.log(log + "No Page.data found");
				mode.notActive = true;
			}
			// this is a disabled domain - user has added this to blocklist
			else if (FS_Object.prop(T.tally_options.disabledDomains) && (
					($.inArray(Page.data.domain, T.tally_options.disabledDomains) >= 0) ||
					($.inArray(Page.data.host, T.tally_options.disabledDomains) >= 0)
				)) {
				if (DEBUG) console.log(log + "Tally is disabled on this domain");
				mode.notActive = true;
			}
			// this is not a web page (e.g. a PDF or image)
			else if (Page.data.contentType != "text/html" || ignoreFiletypes.indexOf(Page.data.ext) > -1) {
				if (DEBUG) console.log(`${log} Tally is disabled on pages like ${Page.data.contentType} and/or .${Page.data.ext}`);
				mode.notActive = true;
			}
			// this is a file:// URI
			else if (Page.data.url.indexOf("file://") > -1) {
				if (DEBUG) console.log(log + "Tally is disabled on file:// urls");
				mode.notActive = true;
			}
			// this is a popup / signin that is really small
			else if (Page.data.browser.width < 600) {
				if (DEBUG) console.log(log + "Tally is disabled on small windows");
				mode.notActive = true;
			}
			//
			else if (T.tally_options.gameMode === "disabled") {
				if (DEBUG) console.log(log + "gamemode === disabled");
				mode.notActive = true;
			}


			// ACTIVE
			// - background, login, server, and everything else (like the above) is good, let's roll
			if (mode.notActive === false && mode.userOnline === true && mode.serverOnline === true && mode.loggedIn === true) {
				if (DEBUG) console.log(log + "All is good, setting mode.active = 1");
				mode.active = true;
			}

			// save in Page.data.mode
			// console.log("Page.data.mode", Page.data.mode);
			Page.data.mode = mode;
			if (DEBUG) console.log("Page.data.mode", Page.data.mode);

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
			TallyEvents.startTimedEvents();
			// add main click listener
			TallyListeners.addMainClickEventListener();
			// add scroll listener
			Progress.createScrollListeners();
			// create a fresh background update
			TallyData.createBackgroundUpdate();

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

			// stop if page mode is not active
			if (!Page.data.mode.active) return console.log("🧰 TallyMain.startGameOnPage() Page.data.mode =", Page.data.mode);
			// don't allow if mode disabled
			if (T.tally_options.gameMode === "disabled") return;


			// Check and show items
			if (DEBUG) console.log("🧰 TallyMain.startGameOnPage() [4.1] -> Add items");

			// add stats
			Tally.addStats();
			// add disguise
			Disguise.displayIfTrackerBlocked();
			// potentially add a consumable
			Consumable.randomizer();
			// add key debugging
			Debug.addKeys();
			// start Demo if we are running in demo mode
			Demo.start();

			// run checks on the page
			inPageChecks();

			// checks to perform after user has interacted with page
			setTimeout(function() {

				if (DEBUG) console.log("🧰 TallyMain.startGameOnPage() [4.2] -> Check progress");
				// check for, and possibly complete any progress
				Progress.check("TallyMain");

				// check last active status and potentially recharge
				TallyEvents.checkLastActiveAndRecharge();

				if (DEBUG) console.log("🧰 TallyMain.startGameOnPage() [4.3] -> Check badges");
				// potentially add badge
				Badge.check();

				// after a bit more time
				setTimeout(function() {
					if (DEBUG) console.log("🧰 TallyMain.startGameOnPage() [4.4] -> Check monsters");
					// check for, and potentially add monsters on the page
					MonsterCheck.check();

					// and a bit more...
					setTimeout(function() {
						if (DEBUG) console.log("🧰 TallyMain.startGameOnPage() [4.5] -> Check domain / url for match");
						// is this a domain / url that we would like to say something about?
						Dialogue.checkAddPageSpecificDialogue();
					}, 1500);
				}, 1500);

			}, 10);

		} catch (err) {
			console.error(err);
		}
	}


	/**
	 *	Checks to run in a page (on load or when we get new data from server
	 */
	function inPageChecks() {
		try {
			if (DEBUG) console.log("🧰 TallyMain.inPageChecks() [5.1] -> Check for serverFlags");
			// check for, and potentially execute and flags from server (from previous update)
			Flag.checkFromServer();

		} catch (err) {
			console.error(err);
		}
	}



	// PUBLIC
	return {
		savePageMode: savePageMode,
		runStartupChecks: runStartupChecks,
		startGameOnPage: startGameOnPage,
		inPageChecks: inPageChecks
	};
}());
