"use strict";

/*  BACKGROUND STORAGE
 ******************************************************************************/
// load this script first in manifest so data is available

window.TallyStorage = (function() {

	let DEBUG = true,
		// create "blank" background update obj for this page
		backgroundUpdate = newBackgroundUpdate();


	function newBackgroundUpdate(){
		let obj = {
			// all the individual props that can be updated, sent as arrays
			"itemData": {
				"achievements": [],
				"attacks": [],
				"badges": [],
				"consumables": [],
				"monsters": [],
				"progress": [],
				"trackers": [],
			},
			// SCORE
			"scoreData": {
				"clicks": 0,
				// "domains": 0, // don't track this locally,
				"likes": 0,
				"pages": 0,
				"score": 0
			},
			// PAGE
			"pageData": {
				"description": "", // pageData.description,
				"domain": "", // pageData.domain,
				"keywords": "", // pageData.keywords,
				"tags": "", // pageData.tags,
				"time": "", // pageData.time,
				"title": "", // pageData.title,
				"url": "", // pageData.url
			},
			// EVENTS
			"eventData": {
				"action": "",
				"text": ""
			},
			"token": "INSERT_IN_BACKGROUND",
		};
		return obj;
	}


	/**
	 *	Adds data to backgroundUpdate object (to be sent later)
	 */
	function addToBackgroundUpdate(cat = null, prop = null, val = null) {
		try {
			//console.trace();
			//console.log("💾 TallyStorage.addToBackgroundUpdate()", backgroundUpdate, cat, prop, val);
			// everything is required
			if (!FS_Object.prop(cat) || !FS_Object.prop(prop) || !FS_Object.prop(val)) return;

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
			TallyStorage.saveData("tally_user", tally_user);
			console.log("💾 TallyStorage.addToBackgroundUpdate()", backgroundUpdate, cat, prop, val);
		} catch (err) {
			console.error(err);
		}
	}


	/**
	 *	Send backgroundUpdate
	 */
	function sendBackgroundUpdate() {
		console.log('💾 TallyStorage.sendBackgroundUpdate()', backgroundUpdate);
		try {
			//if (!pageData.activeOnPage) return;
			chrome.runtime.sendMessage({
				'action': 'sendBackgroundUpdate',
				'data': backgroundUpdate
			}, function(response) {
				if (DEBUG) console.log('💾 TallyStorage.sendBackgroundUpdate() response =', response);
				// update tally_user
				tally_user = response.tally_user;
				// it is also possible one of the following is true and we need to reset a few other things
				// 1. during development switching users for testing
				// 2. a user resets their data but continues to play
				Stats.reset("tally");
				Debug.update();
				// reset backgroundUpdate
				backgroundUpdate = newBackgroundUpdate();
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
				console.log('💾 TallyStorage.sendBackgroundMonsterUpdate()', response);
				//		tally_user = response.tally_user;
				Debug.update();
			});
		} catch (err) {
			console.error(err);
		}
	}





	/**
	 *	Sync with API
	 */
	function syncWithServer() {
		try {
			//console.log("💾 TallyStorage.syncWithServer()", name, caller);
			let msg = {
				'action': 'syncWithServer'
			};
			chrome.runtime.sendMessage(msg, function(response) {
				console.log("💾 TallyStorage.syncWithServer()", name, JSON.stringify(response));
				//TallyMain.sync(start);
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
			//console.log("💾 > TallyStorage.getData()", name, caller);
			let msg = {
				'action': 'getData',
				'name': name
			};
			chrome.runtime.sendMessage(msg, function(response) {
				console.log("💾 > TallyStorage.getData() RESPONSE", name, JSON.stringify(response));
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
			//console.log("💾 < TallyStorage.saveData()", msg, caller);
			chrome.runtime.sendMessage(msg, function(response) {
				console.log("💾 < TallyStorage.saveData() RESPONSE", name, caller, JSON.stringify(response));
				//return response.data;
			});
		} catch (err) {
			console.error(err);
		}
	}
	// emergency only
	function launchStartScreen() {
		try {
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
			console.log("💾 TallyStorage.resetUser()", tokenOnPage, tokenData);
			chrome.runtime.sendMessage({
				'action': 'resetUser',
				'tokenOnPage': tokenOnPage,
				'tokenData': tokenData
			}, function(response) {
				return response.data;
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
			//console.log("💾 newBackgroundMonsterUpdate() -> obj", obj);
			return obj;
		} catch (err) {
			console.error(err);
		}
	}

	// SAVE TOKEN FROM DASHBOARD
	function saveToken(data) {
		try {
			chrome.runtime.sendMessage({
				'action': 'saveToken',
				'data': data
			}, function(response) {
				console.log('💾 TallyStorage.saveToken()', response);
				if (response.message == 1) {
					console.log("💾 TallyStorage.saveToken() -> token has been saved", data);
					// $.growl({
					// 	title: "TOKEN SAVED!",
					// 	message: "User token updated!"
					// });

					if (!Progress.get("tokenAdded")) {
						// mark as true and save
						Progress.update("tokenAdded", true);
						// reload page after token grabbed
						location.reload();
					} else if (!Progress.get("tokenAddedMessage")) {
						// mark as true and save
						Progress.update("tokenAddedMessage", true);
						// encourage them to explore
						Dialogue.showStr("Oh hi! I'm Tally!!!", "happy");
						Dialogue.showStr("Your token is now active and installed!", "happy");
						Dialogue.showStr("This is your dashboard.", "happy");
						Dialogue.showStr("You can edit your profile here.", "happy");
						Dialogue.showStr("Good to stay anonymous though, what with all the monsters around...", "cautious");
						Dialogue.showStr("Now, let's go find some trackers!", "happy");
					} else {
						// user has been here before
						Dialogue.showStr("Your user token has been updated!", "happy");
						Dialogue.showStr("Let's go get some trackers!", "happy");
						// // sync with API / background
						TallyMain.sync();
					}
				}
			});
		} catch (err) {
			console.error(err);
		}
	}

	// PUBLIC
	return {
		getData: function(name, caller) {
			return getData(name, caller);
		},
		saveData: function(name, data, caller) {
			return saveData(name, data, caller);
		},
		launchStartScreen: launchStartScreen,
		backgroundUpdate: backgroundUpdate,
		addToBackgroundUpdate: function(cat, prop, val) {
			addToBackgroundUpdate(cat, prop, val);
		},
		sendBackgroundUpdate: sendBackgroundUpdate,
		newBackgroundMonsterUpdate: function(mid) {
			return newBackgroundMonsterUpdate(mid);
		},
		saveToken: function(data) {
			saveToken(data);
		},
		resetUser: function(tokenOnPage, tokenData) {
			return resetUser(tokenOnPage, tokenData);
		}
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
		'tally_game_status',
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
					//console.log('😂 >>>>> createStartupPromises()',name);
					// call background
					chrome.runtime.sendMessage({
						'action': 'getData',
						'name': name
					}, function(response) {
						//console.log('😂 >>>>> createStartupPromises()', name, JSON.stringify(response.data));
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
			//console.log('💾 >>>>> getUserPromise()',JSON.stringify(response.data));
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
			//console.log('💾 >>>>> getOptionsPromise()',response.data);
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
			//console.log('💾 >>>>> getMetaPromise()',response.data);
			tally_meta = response.data; // store data
			resolve(response.data); // resolve promise
		});
	}
);
// GET GAME STATUS
const getGameStatusPromise = new Promise(
	(resolve, reject) => {
		//console.log("💾 getGameStatusPromise");
		//if (!pageData.activeOnPage) return;
		chrome.runtime.sendMessage({
			'action': 'getGameStatus'
		}, function(response) {
			//console.log('💾 >>>>> getGameStatus()',response.data);
			tally_game_status = response.data; // store data
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
			//console.log('💾 >>>>> getNearbyMonsters()',response.data);
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
			//console.log('💾 >>>>> getStats()',response.data);
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
		//console.log("💾 getTopMonstersPromise");
		chrome.runtime.sendMessage({
			'action': 'getTopMonstersPromise'
		}, function(response) {
			//console.log('💾 >>>>> getTopMonstersPromise()',response.data);
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
			//console.log('💾 >>>>> getLastBackgroundUpdatePromise()',response);
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
			//console.log("💾 <<<<< ",'> saveGameStatus()',JSON.stringify(response));
		});
	} catch (err) {
		console.error(err);
	}
}
