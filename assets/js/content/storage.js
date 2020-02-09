"use strict";

/*  BACKGROUND STORAGE
 ******************************************************************************/
// load this script first in manifest so data is available

window.TallyStorage = (function() {

	let DEBUG = Debug.ALL.TallyStorage,
		// create "blank" background update obj for this page
		backgroundUpdate = null,
		// track whether the current one has been edited
		backgroundUpdateInProgress = false;

	/**
	 * 	create the backgroundUpdate obj, default to type="update"
	 */
	function createBackgroundUpdate(type = "update") {
		try {
			//console.trace();
			if (DEBUG) console.log("💾 TallyStorage.createBackgroundUpdate()");
			// if a backgroundUpdate is already in progress then return early
			if (backgroundUpdateInProgress)
				return console.warn("💾 TallyStorage.createBackgroundUpdate() backgroundUpdateInProgress=true");

			let obj = {
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
					"description": pageData.description,
					"domain": pageData.domain,
					"keywords": pageData.keywords,
					"tags": pageData.tags,
					"time": pageData.time,
					"title": pageData.title,
					"url": pageData.url
				},
				// EVENTS
				"eventData": {
					"action": "",
					"text": ""
				},
				"timezone": Intl.DateTimeFormat().resolvedOptions().timeZone || "",
				"token": "INSERT_IN_BACKGROUND",
				"userAgent": navigator.userAgent || "",
			};
			return obj;
		} catch (err) {
			console.error(err);
		}
	}


	/**
	 *	Adds data to backgroundUpdate object (to be sent later)
	 */
	function addToBackgroundUpdate(cat = null, prop = null, val = null, caller = "") {
		try {
			//console.trace();
			if (DEBUG) console.log("💾 TallyStorage.addToBackgroundUpdate()", cat, prop, val, caller);
			// everything is required
			if (!FS_Object.prop(cat) || !FS_Object.prop(prop) || !FS_Object.prop(val)) return;
			// make sure a background update exists
			if (!FS_Object.prop(backgroundUpdate)) backgroundUpdate = createBackgroundUpdate("update");
			// mark backgroundUpdate in progres
			backgroundUpdateInProgress = true;

			// if this is an item
			if (cat === "itemData") {
				// push the object to the array
				backgroundUpdate[cat][prop].push(val);
				// save in tally_user so visible before server reply
				tally_user[prop][val.name] = val;
			}
			// if score data
			else if (cat === "scoreData") {
				// add the value
				backgroundUpdate[cat][prop] += val;
				// save in tally_user so visible before server reply
				tally_user.score[prop] += val;
			}
			// if event data
			else if (cat === "eventData") {
				//  store the obj
				backgroundUpdate[cat] = prop;
			}
			// otherwise it's just a string so ...
			else {
				// set the value
				backgroundUpdate[cat][prop] = val;
			}
			// save local edits (even though these will be overwritten)
			TallyStorage.saveData("tally_user", tally_user);
			console.log("💾 TallyStorage.addToBackgroundUpdate()", backgroundUpdate, cat, prop, val);
			// console.log(JSON.stringify(backgroundUpdate));

		} catch (err) {
			console.error(err);
		}
	}


	/**
	 *	Check and send backgroundUpdate if it has been edited
	 */
	function checkSendBackgroundUpdate() {
		try {
			// no need to send if not updated
			if (backgroundUpdateInProgress !== false)
				sendBackgroundUpdate();
		} catch (err) {
			console.error(err);
		}
	}


	/**
	 *	Send backgroundUpdate
	 */
	function sendBackgroundUpdate(force = false) {
		console.log('💾 TallyStorage.sendBackgroundUpdate()', backgroundUpdate);
		try {
			// no need to send if not updated
			if (!force && backgroundUpdateInProgress === false) return;
			//if (!pageData.activeOnPage) return;
			chrome.runtime.sendMessage({
				'action': 'sendBackgroundUpdate',
				'data': backgroundUpdate
			}, function(response) {
				if (DEBUG) console.log('💾 > TallyStorage.sendBackgroundUpdate() RESPONSE =', response);
				// update tally_user in content
				tally_user = response.tally_user;
				// it is also possible one of the following is true and we need to reset a few other things
				// 1. during development switching users for testing
				// 2. a user resets their data but continues to play
				Stats.reset("tally");
				Debug.update();
				// set it back to false
				backgroundUpdateInProgress = false;
				// reset backgroundUpdate after sending
				backgroundUpdate = createBackgroundUpdate("update");
			});
		} catch (err) {
			console.error(err);
		}
	}

	// SEND MONSTER DATA TO BACKGROUND
	function sendBackgroundMonsterUpdate(data) {
		try {
			//if (!pageData.activeOnPage) return;
			chrome.runtime.sendMessage({
				'action': 'sendBackgroundMonsterUpdate',
				'data': data
			}, function(response) {
				if (DEBUG) console.log('💾 > TallyStorage.sendBackgroundMonsterUpdate() RESPONSE =', response);
				//		tally_user = response.tally_user;
				Debug.update();
			});
		} catch (err) {
			console.error(err);
		}
	}





	/**
	 *	Get data from API
	 */
	function getDataFromServer(url, callback) {
		try {
			//if (DEBUG) console.log("💾 < TallyStorage.getDataFromServer()", url);
			let msg = {
				'action': 'getDataFromServer',
				'url': url
			};
			chrome.runtime.sendMessage(msg, function(response) {
				if (DEBUG) console.log("💾 > TallyStorage.getDataFromServer() RESPONSE =", JSON.stringify(response));
				//TallyMain.sync(start);
				callback(response);
			});
		} catch (err) {
			console.error(err);
		}
	}

	/**
	 *	Generic getData() function
	 */
	function getData(name, caller = "") {
		try {
			if (DEBUG) console.log("💾 < TallyStorage.getData()", name, caller);
			let msg = {
				'action': 'getData',
				'name': name
			};
			chrome.runtime.sendMessage(msg, function(response) {
				if (DEBUG) console.log("💾 > TallyStorage.getData() RESPONSE =", name, JSON.stringify(response));
				return response.data;
			});
		} catch (err) {
			console.error(err);
		}
	}
	/**
	 *	Generic saveData() function
	 */
	function saveData(name, data, caller = "") {
		try {
			let msg = {
				'action': 'saveData',
				'name': name,
				'data': data
			};
			if (DEBUG) console.log("💾 < TallyStorage.saveData()", msg, caller);
			chrome.runtime.sendMessage(msg, function(response) {
				if (DEBUG) console.log("💾 > TallyStorage.saveData() RESPONSE =", name, caller, JSON.stringify(response));
				//return response.data;
			});
		} catch (err) {
			console.error(err);
		}
	}


	/**
	 *	Save tally_user in content / background
	 */
	function saveTallyUser(cat, obj, caller = "") {
		try {
			if (DEBUG) console.log("💾 < TallyStorage.saveTallyUser()", cat, obj, caller);
			// get latest from background ? NO IDT this is required
			//tally_user = TallyStorage.getData("tally_user");
			// save in content
			tally_user[cat][obj.name] = obj;
			// save in background
			let msg = {
				'action': 'saveData',
				'name': 'tally_user',
				'data': tally_user
			};
			chrome.runtime.sendMessage(msg, function(response) {
				if (DEBUG) console.log("💾 > TallyStorage.saveTallyUser() RESPONSE =", JSON.stringify(response));
				// tally_user = response.data;
			});
		} catch (err) {
			console.error(err);
		}
	}


	// emergency only
	function launchStartScreen() {
		try {
			return;
			chrome.runtime.sendMessage({
				'action': 'launchStartScreen'
			}, function(response) {
				return response.data;
			});
		} catch (err) {
			console.error(err);
		}
	}
	// resetUser a.k.a. resetGame
	function resetUser(tokenOnPage = false, tokenData = {}) {
		try {
			if (DEBUG) console.log("💾 < TallyStorage.resetUser()", tokenOnPage, tokenData);
			chrome.runtime.sendMessage({
				'action': 'resetUser',
				'tokenOnPage': tokenOnPage,
				'tokenData': tokenData
			}, function(response) {
				if (DEBUG) console.log("💾 > TallyStorage.resetUser() RESPONSE =", response);
				return response.data;
			});
		} catch (err) {
			console.error(err);
		}
	}


	/**
	 *	Reset game data from server (after new install or token)
	 */
	function resetGameDataFromServer() {
		try {
			if (DEBUG) console.log("💾 <> TallyStorage.resetGameDataFromServer()");
			let msg = {
				'action': 'resetGameDataFromServer'
			};
			chrome.runtime.sendMessage(msg, function(response) {
				if (DEBUG) console.log("💾 <> TallyStorage.resetGameDataFromServer() RESPONSE =", JSON.stringify(response));

				// reset everything
				// pageData = PageData.getPageData();
				tally_user = {};
				tally_options = {};
				tally_meta = {};
				tally_nearby_monsters = {};
				tally_top_monsters = {};
				// now that all data is refreshed, grab from background and start game over on page
				TallyMain.getDataFromBackground(TallyMain.performStartChecks);

			});

		} catch (err) {
			console.error(err);
		}
	}






	/**
	 *  Create new newBackgroundMonsterUpdate object
	 */
	function newBackgroundMonsterUpdate(mid) {
		try {
			var obj = {
				"pageData": {
					"domain": pageData.domain,
					"tags": pageData.tags,
					"time": pageData.time,
					"url": pageData.url
				},

				"token": "INSERT_IN_BACKGROUND",

			};
			//if (DEBUG) console.log("💾 newBackgroundMonsterUpdate() -> obj", obj);
			return obj;
		} catch (err) {
			console.error(err);
		}
	}

	// SAVE TOKEN FROM DASHBOARD
	function saveTokenFromDashboard(data) {
		try {
			if (DEBUG) console.log('💾 < TallyStorage.saveTokenFromDashboard() TRYING TO SAVE NEW TOKEN... DATA =', data);
			// save locally first
			chrome.runtime.sendMessage({
				'action': 'saveToken',
				'data': data
			}, function(response) {
				if (DEBUG) console.log('💾 > TallyStorage.saveTokenFromDashboard() RESPONSE =', response);

				// if the token was different and it was updated ...
				if (response.message == 1) {

					// 1. if this is the first time user is saving a token
					if (!Progress.get("tokenAdded")) {
						if (DEBUG) console.log("💾 > TallyStorage.saveTokenFromDashboard() 1 -> NEW TOKEN WAS SAVED", data);
						// mark as true and save
						Progress.update("tokenAdded", true);
						// reload page after token grabbed
						location.reload();
					}
					// 2. after the page has refreshed
					else if (!Progress.get("tokenAddedPlayWelcomeMessage")) {
						if (DEBUG) console.log("💾 > TallyStorage.saveTokenFromDashboard() 2 -> NEW TOKEN WAS SAVED", data);
						// mark as true and save
						Progress.update("tokenAddedPlayWelcomeMessage", true);
						// introductions, then encourage them to explore
						Dialogue.showStr("Oh hi! I'm Tally!!!", "happy");
						Dialogue.showStr("Your account is now active and you are ready to play!", "happy");
						Dialogue.showStr("This is your dashboard.", "happy");
						Dialogue.showStr("You can edit your profile here.", "happy");
						Dialogue.showStr("Good to stay anonymous though, what with all the monsters around...", "cautious");
						Dialogue.showStr("Now, let's go find some trackers!", "happy");
					}
					// if user has been here before
					else {
						if (DEBUG) console.log("💾 > TallyStorage.saveTokenFromDashboard() 3 -> NEW TOKEN WAS SAVED", data);
						Dialogue.showStr("Your account has been updated!", "happy");
						Dialogue.showStr("Let's go get some trackers!", "happy");
						// force a background update to confirm with API / background
						// MAYBE DON'T NEED BECAUSE THIS ALL HAPPENS ON UPDATE
						//sendBackgroundUpdate(true);
					}

					resetGameDataFromServer();
				}
			});
		} catch (err) {
			console.error(err);
		}
	}

	// PUBLIC
	return {
		getDataFromServer: function(url, callback) {
			return getDataFromServer(url, callback);
		},
		getData: function(name, caller) {
			return getData(name, caller);
		},
		saveData: function(name, data, caller) {
			return saveData(name, data, caller);
		},
		saveTallyUser: function(cat, obj, caller) {
			saveTallyUser(cat, obj, caller);
		},
		launchStartScreen: launchStartScreen,
		// server
		createBackgroundUpdate: function(type) {
			createBackgroundUpdate(type);
		},
		backgroundUpdate: backgroundUpdate,
		backgroundUpdateInProgress: backgroundUpdateInProgress,
		addToBackgroundUpdate: function(cat, prop, val, caller) {
			addToBackgroundUpdate(cat, prop, val, caller);
		},
		checkSendBackgroundUpdate: checkSendBackgroundUpdate,
		sendBackgroundUpdate: sendBackgroundUpdate,
		newBackgroundMonsterUpdate: function(mid) {
			return newBackgroundMonsterUpdate(mid);
		},
		saveTokenFromDashboard: function(data) {
			saveTokenFromDashboard(data);
		},
		resetUser: function(tokenOnPage, tokenData) {
			return resetUser(tokenOnPage, tokenData);
		},
		resetGameDataFromServer: resetGameDataFromServer,
	};
})();







/*  STARTUP PROMISES
 ******************************************************************************/

// arrays to hold all startupPromises, and their names
const startupPromises = [],
	startupPromiseNames = [
		'tally_user',
		'tally_options',
		'tally_meta',
		'tally_nearby_monsters',
		'tally_top_monsters'
	];

function createStartupPromises() {
	try {
		// loop through all startupPromisesNames and create Promises
		for (let i = 0; i < startupPromiseNames.length; i++) {
			let name = startupPromiseNames[i];
			/*jshint loopfunc: true */
			// add new promise
			startupPromiseNames[i] = new Promise(
				(resolve, reject) => {
					//if (DEBUG) console.log('😂 >>>>> createStartupPromises()',name);
					// call background
					chrome.runtime.sendMessage({
						'action': 'getData',
						'name': name
					}, function(response) {
						//if (DEBUG) console.log('😂 >>>>> createStartupPromises()', name, JSON.stringify(response.data));
						// store data
						window[startupPromiseNames[i]] = response.data;
						// resolve promise
						resolve(response.data);
					});
				}
			);
		}
	} catch (err) {
		console.error(err);
	}
}
//createStartupPromises();

// // testing
// Promise // after async functions then update
// 	.all(startupPromises)
// 	.then(function(result) {
// 		console.log('😂  testPromise all data has loaded', result);
// 	})
// 	.catch(function(err) {
// 		console.log('😂 one or more promises have failed: ' + err);
// 	});



/*  STARTUP PROMISES (WHY DO I STILL NEED THESE?)
 ******************************************************************************/

// USER
const getUserPromise = new Promise(
	(resolve, reject) => {
		//if (!pageData.activeOnPage) return;
		chrome.runtime.sendMessage({
			'action': 'getUser'
		}, function(response) {
			//if (DEBUG) console.log('💾 >>>>> getUserPromise()',JSON.stringify(response.data));
			tally_user = response.data; // store data
			resolve(response.data); // resolve promise
		});
	}
);
// OPTIONS
const getOptionsPromise = new Promise(
	(resolve, reject) => {
		//if (!pageData.activeOnPage) return;
		chrome.runtime.sendMessage({
			'action': 'getOptions'
		}, function(response) {
			//if (DEBUG) console.log('💾 >>>>> getOptionsPromise()',response.data);
			tally_options = response.data; // store data
			resolve(response.data); // resolve promise
		});
	}
);
// GET TALLY_META
const getMetaPromise = new Promise(
	(resolve, reject) => {
		//if (!pageData.activeOnPage) return;
		chrome.runtime.sendMessage({
			'action': 'getMeta'
		}, function(response) {
			//if (DEBUG) console.log('💾 >>>>> getMetaPromise()',response.data);
			tally_meta = response.data; // store data
			resolve(response.data); // resolve promise
		});
	}
);
// GET NEARBY MONSTERS
const getNearbyMonstersPromise = new Promise(
	(resolve, reject) => {
		//if (!pageData.activeOnPage) return;
		chrome.runtime.sendMessage({
			'action': 'getNearbyMonsters'
		}, function(response) {
			//if (DEBUG) console.log('💾 >>>>> getNearbyMonsters()',response.data);
			tally_nearby_monsters = response.data; // store data
			resolve(response.data); // resolve promise
		});
	}
);
// GET STATS
const getStatsPromise = new Promise(
	(resolve, reject) => {
		//if (!pageData.activeOnPage) return;
		chrome.runtime.sendMessage({
			'action': 'getStats'
		}, function(response) {
			//if (DEBUG) console.log('💾 >>>>> getStats()',response.data);
			// if stats is empty (game just installed)
			if (FS_Object.isEmpty(response.data))
				Stats.reset("tally");
			else
				Stats.overwrite("tally", response.data); // store data
			resolve(response.data); // resolve promise
		});
	}
);
// GET TOP MONSTERS
const getTopMonstersPromise = new Promise(
	(resolve, reject) => {
		//if (DEBUG) console.log("💾 getTopMonstersPromise");
		chrome.runtime.sendMessage({
			'action': 'getTopMonstersPromise'
		}, function(response) {
			//if (DEBUG) console.log('💾 >>>>> getTopMonstersPromise()',response.data);
			tally_top_monsters = response.data; // store data
			resolve(response.data); // resolve promise
		});
	}
);



/*  CUSTOM FUNCTIONS
 ******************************************************************************/


// GET LAST BACKGROUND UPDATE
const getLastBackgroundUpdatePromise = new Promise(
	(resolve, reject) => {
		//if (!pageData.activeOnPage) return;
		chrome.runtime.sendMessage({
			'action': 'getLastBackgroundUpdate'
		}, function(response) {
			//if (DEBUG) console.log('💾 >>>>> getLastBackgroundUpdatePromise()',response);
			let _lastBackgroundUpdate = {};
			if (response.message === 1 && prop(response.data)) {
				_lastBackgroundUpdate = response.data; // store data
				if (pageData && prop(_lastBackgroundUpdate.pageData.url))
					pageData.previousUrl = _lastBackgroundUpdate.pageData.url;
			}
			resolve(_lastBackgroundUpdate); // resolve promise
		});
	}
);




function setBadgeText(data) {
	try {
		chrome.runtime.sendMessage({
			'action': 'setBadgeText',
			'data': data
		}, function(response) {
			// ?
		});
	} catch (err) {
		console.error(err);
	}
}
