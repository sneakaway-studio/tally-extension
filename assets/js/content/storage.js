"use strict";

/*  BACKGROUND STORAGE
 ******************************************************************************/
// load this script first in manifest so data is available

window.TallyStorage = (function() {

	/**
	 *	Generic getData() function
	 */
	function getData(name, caller="") {
		try {
			//console.log("💾 TallyStorage.getData()", name, caller);
			let msg = {
				'action': 'getData',
				'name': name
			};
			chrome.runtime.sendMessage(msg, function(response) {
				//console.log("💾 <<<<< ", '> TallyStorage.getData()', name, JSON.stringify(response));
				return response.data;
			});
		} catch(err){
			console.error(err);
		}
	}
	/**
	 *	Generic saveData() function
	 */
	function saveData(name, data, caller="") {
		try {
			let msg = {
				'action': 'saveData',
				'name': name,
				'data': data
			};
			//console.log("💾 TallyStorage.saveData()", msg, caller);
			chrome.runtime.sendMessage(msg, function(response) {
				//console.log("💾 >>>>> ", '> TallyStorage.saveData()', name, JSON.stringify(response));
				//return response.data;
			});
		} catch(err){
			console.error(err);
		}
	}
	// emergency only
	function launchStartScreen(){
		try {
			chrome.runtime.sendMessage({ 'action': 'launchStartScreen' }, function(response) {
				return response.data;
			});
		} catch(err){
			console.error(err);
		}
	}


	/**
	 *  Create new backgroundUpdate object
	 */
	function newBackgroundUpdate() {
		try {
			var obj = {
				"pageData": {
					"description": pageData.description,
					"domain": pageData.domain,
					"keywords": pageData.keywords,
					"tags": pageData.tags,
					"time": pageData.time,
					"title": pageData.title,
					"url": pageData.url
				},
				"scoreData": {
					"clicks": 0,
					// "domains": 0, // don't track this locally,
					"level": 0,
					"likes": 0,
					"pages": 0,
					"score": 0,
					// "time": 0, // don't track this locally
				},
				"eventData": {
					"action": "",
					"text": ""
				},
				"consumable": null,
				"userData": {
					"token": "INSERT_IN_BACKGROUND",
				}
			};
			console.log("<{!}> newBackgroundUpdate() -> obj", obj);
			return obj;
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
				"userData": {
					"token": "INSERT_IN_BACKGROUND",
				}
			};
			//console.log("<{!}> newBackgroundMonsterUpdate() -> obj", obj);
			return obj;
		} catch (err) {
			console.error(err);
		}
	}

	// PUBLIC
	return {
		getData: function(name,caller){
			return getData(name,caller);
		},
		saveData: function(name,data,caller){
			return saveData(name,data,caller);
		},
		launchStartScreen:launchStartScreen,
		newBackgroundUpdate:newBackgroundUpdate,
		newBackgroundMonsterUpdate: function(mid){
			return newBackgroundMonsterUpdate(mid);
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
		'tally_trackers',
		'tally_game_status',
		'tally_tutorial_history',
		'tally_top_monsters'
	];

function createStartupPromises(){
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
	} catch(err){
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
// GET LIST OF TRACKERS
const getTrackerBlockListPromise = new Promise(
	(resolve, reject) => {
		//console.log("💾 getTrackerBlockListPromise");
		//if (!pageData.activeOnPage) return;
		chrome.runtime.sendMessage({
			'action': 'getTrackerBlockList'
		}, function(response) {
			//console.log('💾 >>>>> getTrackerBlockList()',response.data);
			tally_trackers = response.data; // store data
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
// GET TUTORIAL HISTORY
const getTutorialHistoryPromise = new Promise(
	(resolve, reject) => {
		//console.log("💾 getTutorialHistoryPromise");
		chrome.runtime.sendMessage({
			'action': 'getTutorialHistoryPromise'
		}, function(response) {
			//console.log('💾 >>>>> getTutorialHistoryPromise()',response.data);
			tally_tutorial_history = response.data; // store data
			resolve(response.data); // resolve promise
		});
	}
);



/*  CUSTOM FUNCTIONS
 ******************************************************************************/

// SAVE TOKEN FROM DASHBOARD
function saveToken(data) {
	try {
		chrome.runtime.sendMessage({
			'action': 'saveToken',
			'data': data
		}, function(response) {
			console.log('💾 <{!}> saveToken()', response);
			if (response.message == 1) {
				console.log("💾 grab it", data);
				// $.growl({
				// 	title: "TOKEN SAVED!",
				// 	message: "User token updated!"
				// });

				Thought.showString("Your user token has been updated!", "happy");
			}
		});
	} catch(err){
		console.error(err);
	}
}

// SEND DATA TO BACKGROUND
function sendBackgroundUpdate(data) {
	try {
		//if (!pageData.activeOnPage) return;
		chrome.runtime.sendMessage({
			'action': 'sendBackgroundUpdate',
			'data': data
		}, function(response) {
			console.log('💾 <{!}> sendBackgroundUpdate()', response);
			tally_user = response.tally_user;

			if (response.tally_user.levelUpdated){
				Thought.showString("You just leveled up!", "happy");
			}

			Debug.update();
		});
	} catch(err){
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
			console.log('💾 <{!}> sendBackgroundMonsterUpdate()', response);
	//		tally_user = response.tally_user;
			Debug.update();
		});
	} catch(err){
		console.error(err);
	}
}


// GET LAST BACKGROUND UPDATE
const getLastBackgroundUpdatePromise = new Promise(
	(resolve, reject) => {
		//if (!pageData.activeOnPage) return;
		chrome.runtime.sendMessage({
			'action': 'getLastBackgroundUpdate'
		}, function(response) {
			//console.log('💾 >>>>> getLastBackgroundUpdatePromise()',response.data);
			let _lastBackgroundUpdate = {};
			if (prop(response.data)) {
				_lastBackgroundUpdate = response.data; // store data
				if (pageData)
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
	} catch(err){
		console.error(err);
	}
}
