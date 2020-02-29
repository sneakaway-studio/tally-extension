"use strict";

// all other scripts have loaded so safe to create global objects
let pageData = PageData.getPageData(),
	// objects created on server, mirrored locally
	tally_user = {},
	tally_top_monsters = {},
	// objects that only exist locally
	tally_meta = {},
	tally_options = {},
	tally_nearby_monsters = {};

window.TallyMain = (function() {
	// PRIVATE
	let DEBUG = Debug.ALL.TallyMain;

	// global error handler
	window.onerror = function(message, source, lineno, colno, error) {
		console.error(message, source, lineno, colno, error);
	};

	$(function() {
		try {
			// begin by getting data from background, then performing start checks
			getDataFromBackground(performStartChecks);
		} catch (err) {
			console.error("🧰 TallyMain.getDataFromBackground() failed", err);
		}
	});





	/**
	 *	Get all data from background (can be called multiple times, w/ or w/o callback)
	 */
	function getDataFromBackground(callback = null) {
		try {
			if (DEBUG) console.log('🧰 TallyMain.getDataFromBackground()');
			Promise
				.all([getUserPromise, getOptionsPromise, getMetaPromise,
					getNearbyMonstersPromise, getStatsPromise, getTopMonstersPromise
				]) // getLastBackgroundUpdatePromise
				.then(function() {
					if (DEBUG) console.log('🧰 TallyMain.getDataFromBackground() -> all promises have resolved',
						tally_user, tally_options, tally_meta
						// ,tally_nearby_monsters, tally_top_monsters
					);

					if (callback) callback();
				})
				.catch(function(err) {
					console.error('🧰 TallyMain.getDataFromBackground() -> ' +
						'one or more promises have failed: ' + err,
						"\n tally_user =", tally_user,
						"\n tally_options =", tally_options,
						"\n tally_meta =", tally_meta,
						"\n tally_nearby_monsters =", tally_nearby_monsters,
						"\n tally_top_monsters =", tally_top_monsters
					);
				});
		} catch (err) {
			console.error(err);
			// if for some reason there is error then prompt for new token
			// TallyStorage.launchStartScreen("getDataFromBackground");
		}
	}

	/**
	 *	Perform all start checks to make sure it is safe to run game
	 *	then, add all required elements to DOM that should only be added once
	 */
	function performStartChecks() {
		try {
			if (DEBUG) console.log('🧰 TallyMain.performStartChecks()');

			// do not procede if pageData failed
			if (!prop(pageData)) return;
			// check if extension should be active on this page before proceeding
			pageData.activeOnPage = shouldExtensionBeActiveOnPage();
			// if in demo mode then go to new page
			if (!pageData.activeOnPage && tally_options.gameMode == "demo") Demo.goToNewPage(true);
			// do not procede if so
			if (!pageData.activeOnPage) return;


			// first, remove trackers that have been caught
			Tracker.removeCaughtTrackers(pageData.trackers);
			// check for, and possibly execute and flags
			Flag.check();
			// add required CSS for game
			FS_String.insertStylesheets();
			// add debugger to page and update
			Debug.add();
			Debug.update();

			// add Tally character
			Tally.addCharacter();
			// add timed events listeners
			TallyEvents.startTimeEvents();
			// add main click listener
			TallyListeners.addMainClickEventListener();
			// check the token
			checkTokenStatus();
			// are we running in demo mode?
			Demo.start();

			// start game on this page
			startGameOnPage();
		} catch (err) {
			console.error(err);
			// if for some reason there is error then prompt for new token
			// TallyStorage.launchStartScreen();
		}
	}

	/**
	 * 	Make sure Tally isn't disabled on this page | domain | subdomain | etc
	 */
	function shouldExtensionBeActiveOnPage() {
		try {
			if (DEBUG) console.log("🧰 TallyMain.shouldExtensionBeActiveOnPage()");
			// do not start if ...
			// the server is not online
			if (!tally_meta.serverOnline) {
				console.log("!!!!! Connection to Tally server is down");
				return false;
			}
			// pageData failed
			else if (!prop(pageData)){
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
			// this is a popup / signin that is really small
			else if (pageData.browser.width < 600) {
				console.log("!!!!! Tally is disabled on small windows");
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
			if (DEBUG) console.log("🧰 TallyMain.startGameOnPage() ...");

			// don't run if pageData failed
			if (!pageData || pageData == undefined || !pageData.activeOnPage) return;
			// welcome message for the curious
			console.log("%c   Hello, I'm Tally!", Tally.tallyConsoleIcon);
			// if (DEBUG) console.log(">>>>> startGameOnPage() -> Starting Tally on this page");
			// if (DEBUG) console.log(">>>>> pageData = "+ JSON.stringify(pageData));

			// on startGameOnPage, create new backgroundUpdate before anything new happens on page
			TallyStorage.createBackgroundUpdate();

			// RUN ALL GAME METHODS

			// check last active status and potentially recharge
			TallyEvents.checkLastActiveAndRecharge();
			// check for, and possibly add a consumable
			Consumable.randomizer();
			// check for, and possibly add badge
			Badge.randomizer();
			// check for, and possibly add monsters on the page
			MonsterCheck.check();
			// check for, and possibly complete any progress
			Progress.check("TallyMain");

			// check for, and possibly execute and flags from server (from previous update)
			checkForServerFlags();
			// update debugger
			Debug.update();

			// UPDATE SERVER *ONLY* IF ANYTHING HAS CHANGED
			setTimeout(function() {
				// update will reset for any clicking afterwards...
				TallyStorage.checkSendBackgroundUpdate();
			}, 2000);

		} catch (err) {
			console.error(err);
		}
	}

	/**
	 *	Refresh app after page mutation
	 */
	function refreshAppAfterMutation(caller) {
		try {
			if (!pageData.activeOnPage) return;
			if (DEBUG) console.log("🧰 TallyMain.refreshAppAfterMutation() caller = " + caller);
			// refresh pageData
			pageData = PageData.getPageData();
			// check for monsters again
			MonsterCheck.check();
			Debug.update();
		} catch (err) {
			console.error(err);
		}
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
					"Please <a href='" + tally_meta.website + "/dashboard' target='_blank'>visit your dashboard</a> to reconnect your account",
					"You can't stop the trackers unless you <a href='" + tally_meta.website + "/dashboard' target='_blank'>connect your account</a>",
					"<a href='" + tally_meta.website + "/dashboard' target='_blank'>Link your account</a> to start playing Tally"
				];
				// for debugging
				if (tally_meta.userTokenStatus === "expired") {
					// $.growl({
					// 	title: "YOUR TOKEN HAS EXPIRED",
					// 	message: "Click here to get a new one"
					// });
				} else if (tally_meta.userTokenStatus != "ok") {
					// $.growl({
					// 	title: "YOU HAVE NO TOKEN",
					// 	message: msg[FS_Object.randomArrayIndex(msg)]
					// });
				}
				// if token not valid
				if (tally_meta.userTokenStatus !== "ok") { // expired || error || !ok
					if (DEBUG) console.log("🧰 TallyMain.checkTokenStatus() TOKEN (STILL) BROKEN " +
						"tally_meta.userTokenPrompts = " + tally_meta.userTokenPrompts);

					// don't bother them every time
					if (tally_meta.userTokenPrompts % 2 == 0) {
						setTimeout(function() {
							Dialogue.showStr(FS_Object.randomArrayIndex(msg), "sad", true);
						}, 500);
					}
					tally_meta.userTokenPrompts++;
					TallyStorage.saveData('tally_meta', tally_meta, "🧰 TallyMain.checkTokenStatus()");
				} else {
					if (DEBUG) console.log("🧰 TallyMain.checkTokenStatus() TOKEN OK ");
				}
			}
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
				// update stats
				Stats.reset("tally");
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
			// then add to server update (will be pushed on next update)
			TallyStorage.addToBackgroundUpdate("itemData", "flags", flag, "🧰 TallyMain.removeFlag()");
		}
	}



	// PUBLIC
	return {
		getDataFromBackground: function(callback) {
			getDataFromBackground(callback);
		},
		performStartChecks: performStartChecks,
		startGameOnPage: startGameOnPage,
		checkForServerFlags: checkForServerFlags,
		refreshAppAfterMutation: refreshAppAfterMutation
	};
}());
