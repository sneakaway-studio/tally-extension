"use strict";

/*  BACKGROUND STORAGE
 ******************************************************************************/
// load this script first in manifest so data is available

window.TallyStorage = (function() {

	let DEBUG = Debug.ALL.TallyStorage;








// MARKED FOR DELETION

	// // SEND MONSTER DATA TO BACKGROUND
	// function sendBackgroundMonsterUpdate(data) {
	// 	try {
	// 		// allow offline
	// 		if (Page.mode().notActive) return;
	// 		// don't allow if mode disabled or stealth
	// 		if (tally_options.gameMode === "disabled" || tally_options.gameMode === "stealth") return;
	//
	// 		chrome.runtime.sendMessage({
	// 			'action': 'sendBackgroundMonsterUpdate',
	// 			'data': data
	// 		}, function(response) {
	// 			if (DEBUG) console.log('💾 > TallyStorage.sendBackgroundMonsterUpdate() RESPONSE =', response);
	// 			//		tally_user = response.tally_user;
	// 			Debug.update();
	// 		});
	// 	} catch (err) {
	// 		console.error(err);
	// 	}
	// }
	//




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
	async function getData(name, caller = "") {
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
			if (DEBUG) console.log("💾 < TallyStorage.saveData()", name, msg, caller);
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
	function saveTallyUser(name, obj, caller = "") {
		try {
			if (DEBUG) console.log("💾 < TallyStorage.saveTallyUser()", name, obj, caller, "tally_user =", tally_user);
			if (!FS_Object.prop(tally_user.progress)) {
				console.error("💾 < TallyStorage.saveTallyUser() NO tally_user");
				return;
			}
			// get latest from background ? NO IDT this is required
			//tally_user = TallyStorage.getData("tally_user");
			// save in content
			tally_user[name][obj.name] = obj;
			// save in background
			let msg = {
				'action': 'saveData',
				'name': 'tally_user',
				'data': tally_user
			};
			chrome.runtime.sendMessage(msg, function(response) {
				if (DEBUG) console.log("💾 > TallyStorage.saveTallyUser() RESPONSE =", JSON.stringify(response));
				tally_user = response.data;
			});
		} catch (err) {
			console.error(err);
		}
	}




	//
	// // resetUser a.k.a. resetGame
	// function resetUser(tokenOnPage = false, tokenData = {}) {
	// 	try {
	// 		if (DEBUG) console.log("💾 < TallyStorage.resetUser()", tokenOnPage, tokenData);
	// 		chrome.runtime.sendMessage({
	// 			'action': 'resetUser',
	// 			'tokenOnPage': tokenOnPage,
	// 			'tokenData': tokenData
	// 		}, function(response) {
	// 			if (DEBUG) console.log("💾 > TallyStorage.resetUser() RESPONSE =", response);
	// 			return response.data;
	// 		});
	// 	} catch (err) {
	// 		console.error(err);
	// 	}
	// }





// MARKED FOR DELETION

	// /**
	//  *  Create new newBackgroundMonsterUpdate object
	//  */
	// function newBackgroundMonsterUpdate(mid) {
	// 	try {
	// 		var obj = {
	// 			"pageData": {
	// 				"domain": Page.data.domain,
	// 				"tags": Page.data.tags,
	// 				"time": Page.data.time,
	// 				"url": Page.data.url
	// 			},
	//
	// 			"token": "INSERT_IN_BACKGROUND",
	//
	// 		};
	// 		//if (DEBUG) console.log("💾 newBackgroundMonsterUpdate() -> obj", obj);
	// 		return obj;
	// 	} catch (err) {
	// 		console.error(err);
	// 	}
	// }

	// SAVE TOKEN FROM DASHBOARD
	async function saveTokenFromDashboard(data) {
		try {
			// do not allow offline
			if (Page.mode().serverOffline) return;

			if (DEBUG) console.log('💾 < TallyStorage.saveTokenFromDashboard() [1] 🔑 SAVING', data);

			chrome.runtime.sendMessage({
				'action': 'saveToken',
				'data': data
			}, function(response) {

				// if the token was different and it was updated ...
				if (response.message === "new") {
					if (DEBUG) console.log('💾 > TallyStorage.saveTokenFromDashboard() [2] 🔑 IS NEW', response);

					// update all objects
					tally_user = response.tally_user;
					tally_options = response.tally_options;
					tally_meta = response.tally_meta;


					// update Page.mode()
					Page.updateMode("active");
					// run game again
					TallyMain.contentStartChecks();

					// let caller know to restart
					return true;

				} else if (response.message === "same") {
					if (DEBUG) console.log('💾 > TallyStorage.saveTokenFromDashboard() [3] 🔑 IS THE SAME', response);
				} else {
					if (DEBUG) console.log('💾 > TallyStorage.saveTokenFromDashboard() [4] 🔑 FAILED', response);
				}
				return false;
			});
		} catch (err) {
			console.error(err);
		}
	}


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

	// PUBLIC
	return {
		getDataFromServer: getDataFromServer,
		getData: getData,
		saveData: saveData,
		saveTallyUser: saveTallyUser,
		// newBackgroundMonsterUpdate: newBackgroundMonsterUpdate,
		saveTokenFromDashboard: saveTokenFromDashboard,
		setBadgeText: setBadgeText
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
