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
		// if the current backgroundUpdate is being sent to background
		backgroundUpdateInProgress = false,
		// interval to watch when pushUpdate() necessary
		managerInterval = {};



	/**
	 * 	Keep track of data status
	 */
	function startManager() {
		try {
			// start manager loop
			managerInterval = setTimeout(function() {
				managerLoop();
			}, 500);
		} catch (err) {
			console.error(err);
		}
	}

	/**
	 * 	Keep track of data status
	 */
	function managerLoop() {
		try {
			if (DEBUG) console.log("💾 TallyData.managerLoop()");

			// if there are no edits then kill interval
			if (backgroundUpdateEdits == 0) clearTimeout(managerInterval);
			else {
				// update background / server if anything has changed
				pushUpdate();
			}

		} catch (err) {
			console.error(err);
		}
	}




	/**
	 * 	create the backgroundUpdate obj, default to type="update"
	 */
	function createBackgroundUpdate(type = "update") {
		try {
			if (DEBUG) console.log("💾 TallyData.createBackgroundUpdate()");
			// console.trace();

			// if a backgroundUpdate is already in progress then return early
			if (backgroundUpdateEdits > 0)
				return console.error("💾 TallyData.createBackgroundUpdate() backgroundUpdateInProgress=true");

			backgroundUpdate = {
				// the type of update (e.g. "update" | "sync")
				"updateType": type,
				// all the individual props that can be updated, sent as arrays
				"itemData": {
					"achievements": [],
					"attacks": [],
					"badges": [],
					"consumables": [],
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
	 *	Handle a basic unit of data
	 */
	function handle(type = null, prop = null, val = null, caller = "") {
		try {
			if (DEBUG) Debug.dataReportHeader("💾 TallyData.handle() " + type + "." + prop, "#", "before", 30);

			if (!FS_Object.prop(val)) {
				return console.log("💾 TallyData.handle() NO VALUE RECEIVED", type, prop, val, caller);
			}

			// everything is required
			if (!FS_Object.prop(type) || !FS_Object.prop(prop) || !FS_Object.prop(tally_user)) {
				return console.error("💾 TallyData.handle() ERROR -> SOMETHING IS MISSING", type, prop, val, caller);
			}

			// prepare the object
			let unit = {
				"type": type,
				"prop": prop,
				"val": val,
				"caller": caller
			};

			if (DEBUG) console.log("💾 TallyData.handle() [1] backgroundUpdateEdits =", backgroundUpdateEdits, unit);
			// console.trace();


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
			// console.log("💾 TallyData.handle() [2]", backgroundUpdate);
			// console.log(JSON.stringify(backgroundUpdate));

			// start a timer to see if we need to send update soon
			startManager();

		} catch (err) {
			console.error(err);
		}
	}


	/**
	 *	Check and send backgroundUpdate if it has been edited
	 */
	function pushUpdate() {
		try {
			if (DEBUG) Debug.dataReportHeader("💾 < TallyData.pushUpdate()", "#", "before", 30);

			// no need to send if not updated
			if (backgroundUpdateEdits < 1) return;
			// do not attempt if currently sending
			if (backgroundUpdateInProgress === false) return;

			console.log("💾 TallyData.pushUpdate() [1]", backgroundUpdate);

			// set to true to prevent additional sending
			backgroundUpdateInProgress = true;

			// send update to background (which will determine whether to send to server)
			chrome.runtime.sendMessage({
				'action': 'sendUpdateToBackground',
				'data': TallyData.returnBackgroundUpdate()
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
				// reset # edits
				backgroundUpdateEdits = 0;
				// reset "in progress"
				backgroundUpdateInProgress = false;
				// remove any intervals / timeouts
				clearTimeout(managerInterval);
				// reset backgroundUpdate after sending
				createBackgroundUpdate();

			});

		} catch (err) {
			console.error(err);
		}
	}



	// PUBLIC
	return {
		startManager: startManager,
		handle: handle,
		backgroundUpdate: backgroundUpdate,
		returnBackgroundUpdate: function(){
			return backgroundUpdate;
		},
		createBackgroundUpdate: createBackgroundUpdate,
		backgroundUpdateInProgress: backgroundUpdateInProgress,
		pushUpdate: pushUpdate,
	};
})();
