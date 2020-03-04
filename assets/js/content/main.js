"use strict";

/**
 *	TallyMain
 *	0. create global objects after all other scripts have loaded
 * 	1. get data from background
 *  2. perform start checks (data, token, Page.mode)
 */


// 0. create global objects

// objects created on server, mirrored locally
let tally_user = {},
	tally_top_monsters = {};
// objects that only exist locally
let tally_meta = {},
	tally_options = {},
	tally_nearby_monsters = {},
	tally_stats = {};


window.TallyMain = (function() {
	// PRIVATE
	let DEBUG = Debug.ALL.TallyMain;

	// global error handler
	window.onerror = function(message, source, lineno, colno, error) {
		console.error("Tally", message, source, lineno, colno, error);
	};

	$(function() {
		try {
			// welcome message for the curious
			console.log("%c   Hello, I'm Tally!", Tally.tallyConsoleIcon);
			// get data from background, perform start checks
			getDataFromBackground(contentStartChecks);
		} catch (err) {
			console.error("🧰 TallyMain.getDataFromBackground() failed", err);
		}
	});




	/**
	 *	1. Get all data from background (can be called multiple times, w/ or w/o callback)
	 */
	async function getDataFromBackground(callback = null) {
		try {
			Promise
				.all([getUserPromise, getOptionsPromise, getMetaPromise,
					getNearbyMonstersPromise, getStatsPromise, getTopMonstersPromise
				])
				.then(function() {
					if (DEBUG) console.log('🧰 TallyMain.getDataFromBackground() -> all promises have resolved');
					if (DEBUG) console.log("%ctally_user", Debug.styles.green, JSON.stringify(tally_user));
					if (DEBUG) console.log("%ctally_options", Debug.styles.green, JSON.stringify(tally_options));
					if (DEBUG) console.log("%ctally_meta", Debug.styles.green, JSON.stringify(tally_meta));
					// tally_nearby_monsters, tally_top_monsters, tally_stats
					if (callback) callback();
				})
				.catch(function(err) {
					console.error('🧰 TallyMain.getDataFromBackground() -> ' +
						'one or more promises have failed: ' + err,
						"\n tally_user =", tally_user,
						"\n tally_options =", tally_options,
						"\n tally_meta =", tally_meta,
						"\n tally_nearby_monsters =", tally_nearby_monsters,
						"\n tally_top_monsters =", tally_top_monsters,
						"\n tally_stats =", tally_stats
					);
				});
		} catch (err) {
			console.error(err);
		}
	}

	/**
	 *	2. Perform all start checks
	 *	- confirm it is safe to run game; then add all required elements to DOM
	 */
	function contentStartChecks() {
		try {

			// 2.1. Set the Page.mode
			if (DEBUG) console.log('🧰 TallyMain.contentStartChecks() [2.1] -> SET Page.mode');

			// stop if Page.data failed
			if (!prop(Page.data)) return console.error("... Page.data NOT FOUND");
			// check page mode before proceeding
			Page.updateMode(getPageMode());
			// stop if page mode marked notActive
			if (Page.mode().notActive) return console.error("... Page.mode = notActive", Page.mode());


			// 2.2. Check for Flags (in case we need to pause and restart game with data)
			if (DEBUG) console.log('🧰 TallyMain.contentStartChecks() [2.2] -> Check for flags');

			// check for, and possibly execute and flags
			Flag.check();
			// remove trackers that have been caught
			Tracker.removeCaughtTrackers();


			// 2.3. Add stylesheets and debugger
			if (DEBUG) console.log('🧰 TallyMain.contentStartChecks() [2.3] -> Add game requirements');

			// add required CSS for game
			FS_String.insertStylesheets();
			// add debugger to page and update
			Debug.add();
			Debug.update();

			addTallyToPage();

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
			// create a fresh background update
			TallyData.createBackgroundUpdate();

			// start game on the page
			startGameOnPage();

		} catch (err) {
			console.error(err);
		}
	}


	/**
	 * 	Make sure Tally isn't disabled on this page | domain | subdomain | etc
	 */
	function getPageMode() {
		try {
			let str = "🧰 TallyMain.getPageMode() -> ";

			// the server is not online
			if (!tally_meta.server.online) {
				console.log(str + "Connection to Tally server is down");
				return "serverOffline";
			}
			// Page.data failed
			else if (!prop(Page.data)) {
				console.log(str + "No Page.data found");
				return "notActive";
			}
			// this is a disabled domain
			else if (prop(tally_options.disabledDomains) &&
				(($.inArray(Page.data.domain, tally_options.disabledDomains) >= 0) ||
					($.inArray(Page.data.subDomain, tally_options.disabledDomains) >= 0))) {
				console.log(str + "Tally is disabled on this domain");
				return "notActive";
			}
			// this is not a web page (e.g. a PDF or image)
			else if (Page.data.contentType != "text/html") {
				console.log(str + "Tally is disabled on pages like " + Page.data.contentType);
				return "notActive";
			}
			// this is a file:// URI
			else if (Page.data.url.indexOf("file://") > -1) {
				console.log(str + "Tally is disabled on file:// urls");
				return "notActive";
			}
			// this is a popup / signin that is really small
			else if (Page.data.browser.width < 600) {
				console.log(str + "Tally is disabled on small windows");
				return "notActive";
			}
			// there is a problem with the token
			else if (tally_meta.token.status !== "ok") {
				console.log(str + "tally_meta.token.status =", tally_meta.token.status, tally_meta);
				return "noToken";
			} else {
				console.log(str + "All is good, setting mode=active");
				return "active";
			}

		} catch (err) {
			console.error(err);
		}
	}

	/**
	 * 	4. Run game on this page, can be called as many times as necessary
	 */
	function startGameOnPage() {
		try {
            // allow offline
            if (Page.mode().notActive) return;
            // don't allow if mode disabled
            if (tally_options.gameMode === "disabled") return;

			if (DEBUG) console.log("🧰 TallyMain.startGameOnPage() [1]");


            // 4.1.

            // check for, and possibly complete any progress
            Progress.check("TallyMain");


return;

			// RUN ALL GAME METHODS


			// check last active status and potentially recharge
			TallyEvents.checkLastActiveAndRecharge();
			// check for, and possibly add a consumable
			Consumable.randomizer();
			// check for, and possibly add badge
			Badge.randomizer();
			// check for, and possibly add monsters on the page
			MonsterCheck.check();


			// check for, and possibly execute and flags from server (from previous update)
			// checkForServerFlags();

			// update debugger
			Debug.update();


// ?
            // if in demo mode (server required) then go to new page
			if (tally_options.gameMode == "demo") Demo.goToNewPage(true);

            // are we running in demo mode?
			Demo.start();

		} catch (err) {
			console.error(err);
		}
	}






	/**
	 *	Check for flags from server
	 */
	function checkForServerFlags() {
		try {
			// are there flags?
			if (!FS_Object.prop(tally_user.flags) || FS_Object.isEmpty(tally_user.flags)) return;
			if (DEBUG) console.log("🧰 TallyMain.checkForServerFlags() 🚩", tally_user.flags);
			// address individual flags...

			// SERVER SAYS: we have leveled up!
			if (FS_Object.prop(tally_user.flags.levelUp)) {
				// make sure we have this flag in GameData
				if (!FS_Object.prop(GameData.flags.levelUp))
					return console.warn("Flag does not exist in GameData.");
				// // update stats
				// Stats.reset("tally");
				// tell user
				setTimeout(function() {
					Dialogue.showStr(GameData.flags.levelUp.dialogue, GameData.flags.levelUp.mood, true);
					// remove flag once handled
					remove("levelUp");
				}, 300);
			}
			// SERVER SAYS: we have received a new attack
			// might do this locally instead
			if (FS_Object.prop(tally_user.flags.newAttack)) {
				// remove flag once handled
			}

		} catch (err) {
			console.error(err);
		}
	}


	function removeFlag(name) {
		// confirm it exists
		if (FS_Object.prop(tally_user.flags[name])) {
			// get flag
			let flag = tally_user.flags[name];
			// mark as deleted
			flag.status = "delete";
			// remove it from tally_user
			delete tally_user.flags[name];
			// save in background
			TallyStorage.saveData("tally_user", tally_user, "🧰 TallyMain.removeFlag()");
			// save in background (and on server)
			TallyData.handle("itemData", "flags", flag, "🧰 TallyMain.removeFlag()");
		}
	}



	// PUBLIC
	return {
		getDataFromBackground: getDataFromBackground,
		contentStartChecks: contentStartChecks,
		startGameOnPage: startGameOnPage,
		checkForServerFlags: checkForServerFlags
	};
}());
