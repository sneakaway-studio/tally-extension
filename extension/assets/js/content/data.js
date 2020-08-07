"use strict";

/*  TALLY DATA MANAGER
 ******************************************************************************/

window.TallyData = (function () {
	// PRIVATE

	let DEBUG = Debug.ALL.TallyData,
		// create "blank" background update obj for this page
		backgroundUpdate = null,
		// number of edits to backgroundUpdate
		backgroundUpdateEdits = 0,
		// callers of edits to backgroundUpdate
		backgroundUpdateEditors = [],
		// if the current backgroundUpdate is being sent to background / server
		backgroundUpdateSending = false,
		// interval to watch when pushUpdate() necessary
		managerInterval = null,
		// seconds to wait until sending update
		managerCountdown = 0,
		// has page been pushed already? i.e. don't send tags again
		pageHasBeenPushedToServer = false;


	/**
	 *	Send server updates if user leaves
	 */
	$(window).on("beforeunload", function () {
		try {
			// if edits
			if (backgroundUpdateEdits > 0) {
				// push to server when user closes window
				pushUpdate("💾 TallyData -> beforeunload()");
			}

		} catch (err) {
			console.error(err);
		}
	});


	/**
	 * 	Create the backgroundUpdate object
	 */
	function createBackgroundUpdate(type = "update") {
		try {
			// if (DEBUG) console.log("💾 TallyData.createBackgroundUpdate()");
			// console.trace();

			// do not proceed if a backgroundUpdate already exists with edits
			if (backgroundUpdateEdits > 0) {
				if (DEBUG) console.log("💾 TallyData.createBackgroundUpdate() backgroundUpdateEdits =", backgroundUpdateEdits);
				return;
			}

			backgroundUpdate = {
				// the type of update (e.g. "update" | "sync")
				"updateType": type,
				// all the individual props that can be updated, sent as arrays
				"itemData": {
					"achievements": [],
					"attacks": [],
					"badges": [],
					"consumables": [],
					"disguises": [],
					"flags": [],
					"monsters": [],
					"progress": [],
					"skins": [],
					"trackers": [],
				},
				// SCORE
				"scoreData": {
					"clicks": 0,
					"likes": 0,
					"pages": 0,
					"score": 0
				},
				// PAGE
				"pageData": {
					"description": Page.data.description,
					"domain": Page.data.domain,
					"keywords": Page.data.keywords,
					"tags": Page.data.tags,
					"time": Page.data.time,
					"title": Page.data.title,
					"monsters": MonsterCheck.foundStreamSummary,
					"trackers": Tracker.foundAndBlockedDomains,
					"url": Page.data.url
				},
				"timezone": Intl.DateTimeFormat().resolvedOptions().timeZone || "",
				"userAgent": navigator.userAgent || "",
			};
		} catch (err) {
			console.error(err);
		}
	}

	/**
	 *	Queue a basic unit of data inside backgroundUpdate
	 *	** NOTE: prop must be defined above in createBackgroundUpdate()
	 */
	function queue(type = null, prop = null, val = null, caller = "") {
		try {
			let log = "💾 TallyData.queue()";
			// if (DEBUG) console.log(log, "[0]", type, prop, val, caller);
			// if (DEBUG) Debug.dataReportHeader(log + " # edits = " + backgroundUpdateEdits + ", caller = " + caller + "; " + type + "." + prop, "#", "before");

			// everything is required
			if (!FS_Object.prop(T.tally_user)) return console.log(log, "missing: T.tally_user", type, prop, val, caller);
			else if (!FS_Object.prop(type)) return console.log(log, "missing: type", type, prop, val, caller);
			else if (!FS_Object.prop(prop)) return console.log(log, "missing: prop", type, prop, val, caller);
			else if (!FS_Object.prop(val)) return console.log(log, "missing: val", type, prop, val, caller);

			// prepare the object
			let unit = {
				"type": type,
				"prop": prop,
				"val": val,
				"caller": caller
			};

			if (DEBUG) console.log(log, "backgroundUpdateEdits =", backgroundUpdateEdits,
				"backgroundUpdate =", backgroundUpdate,
				"unit =", unit);
			// console.trace();

			// ??
			// 1. saveData - so that it is visible immediately in game
			// save local edits (even though these will be overwritten)
			// TallyStorage.saveData("tally_user", T.tally_user);



			// 2. add to backgroundUpdate - to be pushed to background and then server

			// make sure a background update exists
			if (!FS_Object.prop(backgroundUpdate)) createBackgroundUpdate();
			// mark backgroundUpdate in progress

			// backgroundUpdate was edited so increment counter
			backgroundUpdateEdits++;
			backgroundUpdateEditors.push(caller);

			// ITEM
			if (unit.type === "itemData") {
				if (FS_Object.objLength(backgroundUpdate) > 0 &&
					FS_Object.objLength(backgroundUpdate[unit.type]) > 0 &&
					backgroundUpdate[unit.type][unit.prop].length > 0 &&
					unit.prop === "progress") {
					// make sure there isn't one already
					for (let i = 0, l = backgroundUpdate[unit.type][unit.prop].length; i < l; i++) {
						if (!backgroundUpdate[unit.type][unit.prop][i] || !unit.val) continue;
						// console.log("DUPLICATE?", backgroundUpdate[unit.type][unit.prop][i].name, unit.val.name);
						// if this one already there then delete it before we add new one
						if (backgroundUpdate[unit.type][unit.prop][i].name == unit.val.name) {
							backgroundUpdate[unit.type][unit.prop].splice(i, 1);
						}
					}
				}
				// push the object to the array
				backgroundUpdate[unit.type][unit.prop].push(unit.val);
				// save in T.tally_user so visible before server reply
				T.tally_user[unit.prop][val.name] = unit.val;
			}
			// SCORE
			else if (unit.type === "scoreData") {
				// add the value
				backgroundUpdate[unit.type][unit.prop] += unit.val;
				// save in T.tally_user so visible before server reply
				T.tally_user.score[unit.prop] += unit.val;
			}
			// EVENT
			else if (unit.type === "eventData") {
				//  store the obj
				backgroundUpdate[unit.type] = unit.prop;
			}
			// otherwise it's just a regular property
			else {
				// set the value
				backgroundUpdate[unit.type][unit.prop] = unit.val;
			}

			// if (DEBUG) console.log("💾 TallyData.queue() [2]", backgroundUpdate);
			// if (DEBUG) console.log(JSON.stringify(backgroundUpdate));

			// start manager (or increment countdown) to see if we need to send update soon
			startManager(caller);

		} catch (err) {
			console.error(err);
		}
	}

	/**
	 * 	Called after edits from queue()
	 *	- Sends update to server after n milliseconds and resets
	 *	- If called multiple times before pushUpdate() then increments wait time (limiting server calls)
	 */
	function startManager(caller) {
		try {
			let log = "💾 TallyData.startManager()",
				managerCountdownInterval = 4,
				managerCountdownMax = 8;

			// don't start if not online or if battle active
			if (!T.tally_meta.userLoggedIn || Battle.active) {
				if (DEBUG) console.log("💾 TallyData.startManager() [1]",
					"T.tally_meta.userLoggedIn =", T.tally_meta.userLoggedIn,
					"Battle.active =", Battle.active
				);
				return false;
			}

			// increment time to wait
			managerCountdown += managerCountdownInterval;
			// keep countdown to max
			managerCountdown = Math.min(managerCountdown, managerCountdownMax);

			// make sure manager isn't already waiting to send updates
			if (DEBUG) console.log("💾 TallyData.manager() IN-PROGRESS",
				"managerCountdown =", managerCountdown,
				"managerInterval =", managerInterval
			);
			if (managerInterval !== null) return;


			// if (DEBUG) console.log("💾 TallyData.startManager() CHECKING FOR UPDATE");

			// if not already running, start manager interval
			managerInterval = setInterval(function () {
				// run until pushUpdate()
				manager();
			}, 1000);
		} catch (err) {
			console.error(err);
		}
	}


	/**
	 *	Runs from the interval
	 */
	function manager() {
		try {
			// don't count down if the page doesn't have focus
			if (!document.hasFocus()) return;

			let log = "💾 TallyData.manager()";
			if (DEBUG) console.log(log, "[1] managerCountdown =", managerCountdown);

			// subtract time from counter
			managerCountdown -= 1;

			// if there are edits then then consider pushing update
			if (backgroundUpdateEdits > 0 && managerCountdown < 0 && !backgroundUpdateSending) {
				// if time complete then send update

				if (DEBUG) console.log(log, "[2] SENDING TO pushUpdate()",
					"backgroundUpdateEdits =", backgroundUpdateEdits,
					"managerCountdown =", managerCountdown,
					"backgroundUpdateSending =", backgroundUpdateSending
				);
				// update background / server if anything has changed
				pushUpdate("💾 TallyData.startManager()");

			}
			// safety - else kill interval and reset everything
			if (managerCountdown < -2) {
				if (DEBUG) console.log(log, " [3] SAFETY FIRST");
				// clearTimeout(managerInterval);
				resetManager();
			}

		} catch (err) {
			console.error(err);
		}
	}


	/**
	 *	Check and send backgroundUpdate if it has been edited
	 */
	function pushUpdate(caller) {
		try {
			// don't send if not online
			if (!T.tally_meta.userLoggedIn || Battle.active) {
				if (DEBUG) console.log("💾 TallyData.startManager() [1]",
					"T.tally_meta.userLoggedIn =", T.tally_meta.userLoggedIn,
					"Battle.active =", Battle.active
				);
				return false;
			}

			// no need to send if not updated
			if (backgroundUpdateEdits < 1) return;
			// do not attempt if currently sending
			if (backgroundUpdateSending === true) return;
			// set to true to prevent additional sending
			backgroundUpdateSending = true;

			// checks before sending the update

			// update and reset time
			backgroundUpdate.pageData.time = Page.data.time;
			Page.data.time = 0;

			// don't send tags again
			if (pageHasBeenPushedToServer)
				backgroundUpdate.pageData.tags = [];

			pageHasBeenPushedToServer = true;

			// send update to background (which will determine whether to send to server)
			chrome.runtime.sendMessage({
				'action': 'sendUpdateToBackground',
				'data': backgroundUpdate
			}, function (response) {
				if (DEBUG) console.log('💾 > TallyData.pushUpdate() [2] RESPONSE =', response);

				// if update was successful
				if (response.message && response.tally_user.username) {
					// update T.tally_user and T.tally_meta in content
					T.tally_user = response.tally_user;
					T.tally_meta = response.tally_meta;
					// check for level updates, etc.
					TallyMain.inPageChecks();
					return true;
				}
				// otherwise one of the following may be true
				// - user may have lost connection
				// - user logged out
				// - user reset their data
				// - player switched user accounts (probably in development only)
				else {
					// these two should be enough to halt the game on that page anyway
					TallyMain.savePageMode();
					T.tally_meta = response.tally_meta;
					// Stats.reset("tally");
					return false;
				}


				if (DEBUG) console.log("💾 TallyData.pushUpdate() [3]",
					// "backgroundUpdateEditors =",backgroundUpdateEditors
					"T.tally_meta.userLoggedIn =", T.tally_meta.userLoggedIn
				);


				// update debugger
				Debug.update();
			});
			// reset all manager vars
			resetManager();

		} catch (err) {
			console.error(err);
		}
	}
	/**
	 *	Reset all manager vars
	 */
	function resetManager() {
		try {
			// set # edits and callers back to zero
			backgroundUpdateEdits = 0;
			backgroundUpdateEditors = [];
			// set "in progress" back to false
			backgroundUpdateSending = false;
			// remove any intervals / timeouts
			clearTimeout(managerInterval);
			// allow manager to be started again
			managerInterval = null;
			// reset timer
			managerCountdown = 0;
			// create new backgroundUpdate after sending
			createBackgroundUpdate();
			// reset page time
			Page.data.time = 0;
		} catch (err) {
			console.error(err);
		}
	}



	// PUBLIC
	return {
		queue: queue,
		backgroundUpdate: backgroundUpdate,
		createBackgroundUpdate: createBackgroundUpdate,
		pushUpdate: pushUpdate,
	};
})();
