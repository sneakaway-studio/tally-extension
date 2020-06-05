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
		backgroundUpdateEditsCallers = [],
		// if the current backgroundUpdate is being sent to background
		backgroundUpdateInProgress = false,
		// interval to watch when pushUpdate() necessary
		managerTimeout = {},
		// time in millis to wait until sending update
		managerWaitTime = 3000,
		// only allow one manager to be called
		managerWorking = false;




	/**
	 * 	create the backgroundUpdate obj, default to type="update"
	 */
	function createBackgroundUpdate(type = "update") {
		try {
			// if (DEBUG) console.log("💾 TallyData.createBackgroundUpdate()");
			// console.trace();

			// if a backgroundUpdate is already in progress then return early
			if (backgroundUpdateEdits > 0)
				return console.log("💾 TallyData.createBackgroundUpdate() backgroundUpdateInProgress=true");

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
			if (!FS_Object.prop(tally_user)) return console.log(log, "missing: tally_user", type, prop, val, caller);
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
			// TallyStorage.saveData("tally_user", tally_user);



			// 2. add to backgroundUpdate - to be pushed to background and then server

			// make sure a background update exists
			if (!FS_Object.prop(backgroundUpdate)) createBackgroundUpdate();
			// mark backgroundUpdate in progress
			backgroundUpdateInProgress = true;

			// ITEM
			if (unit.type === "itemData") {
				// push the object to the array
				backgroundUpdate[unit.type][unit.prop].push(unit.val);
				// save in tally_user so visible before server reply
				tally_user[unit.prop][val.name] = unit.val;
			}
			// SCORE
			else if (unit.type === "scoreData") {
				// add the value
				backgroundUpdate[unit.type][unit.prop] += unit.val;
				// save in tally_user so visible before server reply
				tally_user.score[unit.prop] += unit.val;
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

			// if we made it this far then we know the backgroundUpdate was edited
			backgroundUpdateEdits++;
			backgroundUpdateEditsCallers.push(caller);

			// if (DEBUG) console.log("💾 TallyData.queue() [2]", backgroundUpdate);
			// if (DEBUG) console.log(JSON.stringify(backgroundUpdate));

			// start manager (a timer) to see if we need to send update soon
			manager();

		} catch (err) {
			console.error(err);
		}
	}


	/**
	 * 	Called after queue() - Sends update to server after n milliseconds and resets
	 */
	function manager() {
		try {
			// make sure manager isn't already waiting to send updates
			if (managerWorking) return;
			managerWorking = true;
			// if (DEBUG) console.log("💾 TallyData.manager() CHECKING FOR UPDATE");
			// start countdown
			managerTimeout = setTimeout(function() {
				// if there are no edits then kill interval
				if (backgroundUpdateEdits == 0) {
					clearTimeout(managerTimeout);
					// if (DEBUG) console.log("💾 TallyData.manager() NO UPDATES FOUND ");
				}
				else {
					// if (DEBUG) console.log("💾 TallyData.manager() SENDING TO pushUpdate()");
					// update background / server if anything has changed
					pushUpdate("💾 TallyData.manager()");
				}

			}, managerWaitTime);
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
				// "backgroundUpdateEditsCallers =",backgroundUpdateEditsCallers
			);



			// send update to background (which will determine whether to send to server)
			chrome.runtime.sendMessage({
				'action': 'sendUpdateToBackground',
				'data': backgroundUpdate
			}, function(response) {
				if (DEBUG) console.log('💾 > TallyData.pushUpdate() [2] RESPONSE =', response);
				// update tally_user in content
				tally_user = response.tally_user;

				// it is also possible one of the following is true and we need to reset a few other things
				// 1. during development switching users for testing
				// 2. a user resets their data but continues to play
				// Stats.reset("tally");

				// update debugger
				Debug.update();
				// set # edits and callers back to zero
				backgroundUpdateEdits = 0;
				backgroundUpdateEditsCallers = [];
				// set "in progress" back to false
				backgroundUpdateInProgress = false;
				// remove any intervals / timeouts
				clearTimeout(managerTimeout);
				// create new backgroundUpdate after sending
				createBackgroundUpdate();
				// allow manager to begin working again
				managerWorking = false;
			});

		} catch (err) {
			console.error(err);
		}
	}



	// PUBLIC
	return {
		manager: manager,
		queue: queue,
		backgroundUpdate: backgroundUpdate,
		returnBackgroundUpdate: function() {
			return backgroundUpdate;
		},
		createBackgroundUpdate: createBackgroundUpdate,
		backgroundUpdateInProgress: backgroundUpdateInProgress,
		pushUpdate: pushUpdate,
	};
})();
