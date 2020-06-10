"use strict";

/*  TALLY DATA MANAGER
 ******************************************************************************/

window.TallyData = (function() {
	// PRIVATE

	let DEBUG = Debug.ALL.TallyData,
		// create "blank" background update obj for this page
		backgroundUpdate = null,
		// number of edits to backgroundUpdate
		backgroundUpdateEdits = 0,
		// callers of edits to backgroundUpdate
		backgroundUpdateEditors = [],
		// if the current backgroundUpdate is being sent to background / server
		backgroundUpdateInProgress = false,
		// interval to watch when pushUpdate() necessary
		managerInterval = null,
		// seconds to wait until sending update
		managerCountdown = 0;


	/**
	 *	Send server updates if user leaves
	 */
	$(window).on("beforeunload", function() {
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
			if (backgroundUpdateEdits > 0)
				return console.log("💾 TallyData.createBackgroundUpdate() backgroundUpdateEdits =", backgroundUpdateEdits);

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
					"url": Page.data.url
				},
				"timezone": Intl.DateTimeFormat().resolvedOptions().timeZone || "",
				"token": "INSERT_IN_BACKGROUND",
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

			if (DEBUG) console.log(log, "backgroundUpdateEdits =", backgroundUpdateEdits, unit);
			// console.trace();

			// ??
			// 1. saveData - so that it is visible immediately in game
			// save local edits (even though these will be overwritten)
			// TallyStorage.saveData("tally_user", T.tally_user);



			// 2. add to backgroundUpdate - to be pushed to background and then server

			// make sure a background update exists
			if (!FS_Object.prop(backgroundUpdate)) createBackgroundUpdate();
			// mark backgroundUpdate in progress
			backgroundUpdateInProgress = true;

			// ITEM
			if (unit.type === "itemData") {
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
			let log = "💾 TallyData.startManager()";

			// backgroundUpdate was edited so increment counter
			backgroundUpdateEdits++;
			backgroundUpdateEditors.push(caller);
			// increment time to wait
			managerCountdown += 5;
			// keep countdown to max
			if (managerCountdown > 10) managerCountdown = 5;

			// make sure manager isn't already waiting to send updates
			if (managerInterval !== null) return console.log("💾 TallyData.manager() IN-PROGRESS",
				"managerCountdown =", managerCountdown,
				"managerInterval =", managerInterval
			);

			// if (DEBUG) console.log("💾 TallyData.startManager() CHECKING FOR UPDATE");

			// if not already running, start manager interval to count down until pushUpdate()
			managerInterval = setInterval(function() {
				if (DEBUG) console.log(log, "-> managerInterval() [1] managerCountdown =", managerCountdown);

				// if there are no edits then kill interval and reset everything
				if (backgroundUpdateEdits == 0) {
					if (DEBUG) console.log(log, "-> managerInterval() [2] NO UPDATES FOUND -> RESETTING EVERYTHING");
					clearTimeout(managerInterval);
					resetManager();
				} else {
					// subtract time from counter
					managerCountdown -= 1;
					// if time complete then send update
					if (managerCountdown < 0) {
						if (DEBUG) console.log(log, "-> managerInterval() [3] SENDING TO pushUpdate()");
						// update background / server if anything has changed
						pushUpdate("💾 TallyData.startManager()");
					}
				}
			}, 1000);
		} catch (err) {
			console.error(err);
		}
	}


	/**
	 *	Check and send backgroundUpdate if it has been edited
	 */
	function pushUpdate(caller) {
		try {
			if (DEBUG) Debug.dataReportHeader("💾 < TallyData.pushUpdate() [0] caller = " + caller, "#", "before");

			// no need to send if not updated
			if (backgroundUpdateEdits < 1) return;
			// do not attempt if currently sending
			if (backgroundUpdateInProgress === false) return;
			// set to true to prevent additional sending
			backgroundUpdateInProgress = true;

			if (DEBUG) console.log("💾 TallyData.pushUpdate() [1]", backgroundUpdate,
				// "backgroundUpdateEditors =",backgroundUpdateEditors
			);

			// checks before sending the update

			// update time
			backgroundUpdate.pageData.time = Page.data.time;




			// send update to background (which will determine whether to send to server)
			chrome.runtime.sendMessage({
				'action': 'sendUpdateToBackground',
				'data': backgroundUpdate
			}, function(response) {
				if (DEBUG) console.log('💾 > TallyData.pushUpdate() [2] RESPONSE =', response);
				// update T.tally_user in content
				T.tally_user = response.tally_user;

				// it is also possible one of the following is true and we need to reset a few other things
				// 1. during development switching users for testing
				// 2. a user resets their data but continues to play
				// Stats.reset("tally");

				// update debugger
				Debug.update();
				// reset all manager vars
				resetManager();
			});

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
			backgroundUpdateInProgress = false;
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
