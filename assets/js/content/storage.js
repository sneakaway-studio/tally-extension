"use strict";

/*  BACKGROUND STORAGE
 ******************************************************************************/
// load this script first in manifest so data is available

window.TallyStorage = (function() {

	let DEBUG = Debug.ALL.TallyStorage;


	/**
	 *	Get data from API
	 */
	function getDataFromServer(url, callback) {
		try {
			//if (DEBUG) console.log("🗄️ < TallyStorage.getDataFromServer()", url);
			let msg = {
				'action': 'getDataFromServer',
				'url': url
			};
			chrome.runtime.sendMessage(msg, function(response) {
				if (DEBUG) console.log("🗄️ > TallyStorage.getDataFromServer() RESPONSE =", JSON.stringify(response));
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
			if (DEBUG) console.log("🗄️ < TallyStorage.getData()", name, caller);
			let msg = {
				'action': 'getData',
				'name': name
			};
			chrome.runtime.sendMessage(msg, function(response) {
				if (DEBUG) console.log("🗄️ > TallyStorage.getData() RESPONSE =", name, JSON.stringify(response));
				return response.data;
			});
		} catch (err) {
			console.error(err);
		}
	}
	/**
	 *	Generic saveData() function - saves in browser storage only
	 */
	function saveData(name, data, caller = "") {
		try {
			let msg = {
				'action': 'saveData',
				'name': name,
				'data': data
			};
			if (DEBUG) console.log("🗄️ < TallyStorage.saveData() <", caller, msg);
			chrome.runtime.sendMessage(msg, function(response) {
				// if (DEBUG) console.log("🗄️ > TallyStorage.saveData() RESPONSE =", name, caller, JSON.stringify(response));
				// no response needed
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
			if (DEBUG) console.log("🗄️ < TallyStorage.saveTallyUser()", name, obj, caller, "tally_user =", tally_user);
			if (!FS_Object.prop(tally_user.progress)) {
				console.error("🗄️ < TallyStorage.saveTallyUser() NO tally_user");
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
				if (DEBUG) console.log("🗄️ > TallyStorage.saveTallyUser() RESPONSE =", JSON.stringify(response));
				tally_user = response.data;
			});
		} catch (err) {
			console.error(err);
		}
	}



	/**
	 *	Save tally_user in content / background
	 * 	- a.k.a. "resetUser", "resetGame"
	 */
	function resetTallyUser(tokenOnPage = false, tokenData = {}) {
		try {
			if (DEBUG) console.log("🗄️ < TallyStorage.resetTallyUser()", tokenOnPage, tokenData);

			// if we already ran
			if (Page.data.resetTallyUserCalled)
				return console.log("🗄️ TallyStorage.resetTallyUser() ALREADY PERFORMED");
			// so we only check this once and don't check again
			Page.data.resetTallyUserCalled = true;


			if (DEBUG) console.log("🗄️ < TallyStorage.resetTallyUser()", tokenOnPage, tokenData);

			chrome.runtime.sendMessage({
				'action': 'resetTallyUser',
				'tokenOnPage': tokenOnPage,
				'tokenData': tokenData
			}, function(response) {
				if (DEBUG) console.log("🗄️ > TallyStorage.resetTallyUser() RESPONSE =", response);


				// update all objects
				tally_user = response.tally_user;
				tally_options = response.tally_options;
				tally_meta = response.tally_meta;
				// update Page.data.mode
				Page.data.mode = TallyMain.getPageMode();
				// run game again
				TallyMain.contentStartChecks();

				// return response.data;
			});
		} catch (err) {
			console.error(err);
		}
	}




	/**
	 *	Save token in background and run
	 * 	- Runs Background.runStartChecks()
	 */
	async function saveTokenFromDashboard(data) {
		try {
			// do not allow if server offline
			if (Page.data.mode.serverOffline) return;

			if (DEBUG) console.log('🗄️ < TallyStorage.saveTokenFromDashboard() [1] 🔑 SAVING', data);

			chrome.runtime.sendMessage({
				'action': 'saveToken',
				'data': data
			}, function(response) {

				// if the token was different and it was updated ...
				if (response.message === "new") {
					if (DEBUG) console.log('🗄️ > TallyStorage.saveTokenFromDashboard() [2] 🔑 IS NEW', response);

					// update all objects
					tally_user = response.tally_user;
					tally_options = response.tally_options;
					tally_meta = response.tally_meta;


					// update Page.data.mode
					Page.data.mode = TallyMain.getPageMode();
					// run game again
					TallyMain.contentStartChecks();

					// let caller know to restart
					return true;

				} else if (response.message === "same") {
					if (DEBUG) console.log('🗄️ > TallyStorage.saveTokenFromDashboard() [3] 🔑 IS THE SAME', response);
				} else {
					if (DEBUG) console.log('🗄️ > TallyStorage.saveTokenFromDashboard() [4] 🔑 FAILED', response);
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

	// // USER
	// const getUserPromise = new Promise(
	// 	(resolve, reject) => {
	// 		Config.logTimeSinceLoad("TallyStorage.getUserPromise() (creating promise)[1]");
	// 		chrome.runtime.sendMessage({
	// 			'action': 'getUser'
	// 		}, function(response) {
	// 			Config.logTimeSinceLoad("TallyStorage.getUserPromise() (response received) [2]");
	// 			if (DEBUG) console.log('🗄️ >>>>> getUserPromise()', JSON.stringify(response.data));
	// 			tally_user = response.data; // store data
	// 			Config.logTimeSinceLoad("TallyStorage.getUserPromise() (tally_user stored) [3]");
	// 			resolve(response.data); // resolve promise
	// 			Config.logTimeSinceLoad("TallyStorage.getUserPromise() (promise resolved) [4]");
	// 		});
	// 	}
	// );



	//
	// // A simple promise that resolves after a given time
	// const timeOut = (t) => {
	// 	return new Promise((resolve, reject) => {
	// 		setTimeout(() => {
	// 			if (t === 2000) {
	// 				reject(`Rejected in ${t}`)
	// 			} else {
	// 				resolve(`Completed in ${t}`)
	// 			}
	// 		}, t)
	// 	})
	// }
	//
	// const durations = [1000, 2000, 3000]
	//
	// const promises = []
	//
	// durations.map((duration) => {
	// 	promises.push(timeOut(duration))
	// })
	//
	// // We are passing an array of pending promises to Promise.all
	// Promise.all(promises)
	// 	.then(response => console.log(response)) // Promise.all cannot be resolved, as one of the promises passed got rejected.
	// 	.catch(error => console.log(`Error in executing ${error}`)) // Promise.all throws an error.
	//
	//


	//
	//
	// // resolve runs the first function in .then
	// promise.then(
	// 	result => console.log(result), // shows "done!" after 1 second
	// 	error => console.logalert(error) // doesn't run
	// );




	// arrays to hold all startupPromises, and their names
	let startupPromises = [],
		startupPromiseNames = [
			'tally_user',
			'tally_options',
			'tally_meta',
			'tally_nearby_monsters',
			'tally_stats',
			'tally_top_monsters'
		];
	// TallyStorage.getUserPromise, getOptionsPromise, getMetaPromise,
	// 	getNearbyMonstersPromise, getStatsPromise, getTopMonstersPromise
	// 	let tally_user = {},
	// 		tally_top_monsters = {};
	// 	// objects that only exist locally
	// 	let tally_meta = {},
	// 		tally_options = {},
	// 		tally_nearby_monsters = {},
	// 		tally_stats = {};







	// loop through all startupPromiseNames and create Promises
	// for (let i = 0; i < startupPromiseNames.length; i++) {
	// Config.logTimeSinceLoad("TallyStorage.createStartupPromises() [1] (starting loop)");
	// startupPromises.push(


	startupPromiseNames.map((name) => {
		startupPromises.push(createStartupPromise(name));
	});


	// return a promise
	function createStartupPromise(name) {
		try {
			// add new promise
			return new Promise(
				(resolve, reject) => {
					Config.logTimeSinceLoad("😂 TallyStorage.createStartupPromise() [1] (create) " + name + " ");
					// call background
					chrome.runtime.sendMessage({
						'action': 'getData',
						'name': name
					}, function(response) {
						if (DEBUG) console.log('😂 TallyStorage.createStartupPromise()', name, JSON.stringify(response.data));
						Config.logTimeSinceLoad("TallyStorage.createStartupPromises() [3] (resolve) " + name + "");
						// store data
						window[name] = response.data;

						if (DEBUG) console.log('😂 TallyStorage.createStartupPromise() -> window[name] =', window[name]);

						// resolve promise
						resolve(response.data);
					});
				}
			);

		} catch (err) {
			console.error(err);
		}





	}


	// DON"T NEED THIS BECAUSE THEY START AUTOMATICALLY??
	// testing
	Promise // after async functions then update
		.all(startupPromises)
		.then(function(result) {
			console.log('😂  testPromise all data has loaded', "TallyInit.dataLoaded =", TallyInit.dataLoaded, result);

			if (DEBUG) console.log('tally_user =', window["tally_user"]);
			if (DEBUG) console.log('tally_options =', tally_options);
			if (DEBUG) console.log('tally_meta =', tally_meta);
			if (DEBUG) console.log('tally_nearby_monsters =', tally_nearby_monsters);
			if (DEBUG) console.log('tally_stats =', tally_stats);
			if (DEBUG) console.log('tally_top_monsters =', tally_top_monsters);

			TallyInit.dataLoaded = true;
			TallyMain.contentStartChecks();
			console.log('😂  testPromise all data has loaded', "TallyInit.dataLoaded =", TallyInit.dataLoaded, result);


		})
		.catch(function(err) {
			console.log('😂 one or more promises have failed: ' + err);
		});




	// PUBLIC
	return {
		get startupPromises() {
			return startupPromises;
		},
		getDataFromServer: getDataFromServer,
		getData: getData,
		saveData: saveData,
		saveTallyUser: saveTallyUser,
		saveTokenFromDashboard: saveTokenFromDashboard,
		setBadgeText: setBadgeText,
		resetTallyUser: resetTallyUser
	};
})();







/*  STARTUP PROMISES
 ******************************************************************************/

// MARKED FOR DELETION

// // arrays to hold all startupPromises, and their names
// const startupPromises = [],
// 	startupPromiseNames = [
// 		'tally_user',
// 		'tally_options',
// 		'tally_meta',
// 		'tally_nearby_monsters',
// 		'tally_top_monsters'
// 	];
//
// function createStartupPromises() {
// 	try {
// 		// loop through all startupPromisesNames and create Promises
// 		for (let i = 0; i < startupPromiseNames.length; i++) {
// 			let name = startupPromiseNames[i];
// 			/*jshint loopfunc: true */
// 			// add new promise
// 			startupPromiseNames[i] = new Promise(
// 				(resolve, reject) => {
// 					//if (DEBUG) console.log('😂 >>>>> createStartupPromises()',name);
// 					// call background
// 					chrome.runtime.sendMessage({
// 						'action': 'getData',
// 						'name': name
// 					}, function(response) {
// 						//if (DEBUG) console.log('😂 >>>>> createStartupPromises()', name, JSON.stringify(response.data));
// 						// store data
// 						window[startupPromiseNames[i]] = response.data;
// 						// resolve promise
// 						resolve(response.data);
// 					});
// 				}
// 			);
// 		}
// 	} catch (err) {
// 		console.error(err);
// 	}
// }
// createStartupPromises();
//
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

// // USER
// const getUserPromise = new Promise(
// 	(resolve, reject) => {
// 		Config.logTimeSinceLoad("getUserPromise [1]");
// 		chrome.runtime.sendMessage({
// 			'action': 'getUser'
// 		}, function(response) {
// 		Config.logTimeSinceLoad("getUserPromise [2]");
// 			if (DEBUG) console.log('🗄️ >>>>> getUserPromise()',JSON.stringify(response.data));
// 			tally_user = response.data; // store data
// 			Config.logTimeSinceLoad("getUserPromise [3]");
// 			resolve(response.data); // resolve promise
// 			Config.logTimeSinceLoad("getUserPromise [4]");
// 		});
// 	}
// );
// OPTIONS
// const getOptionsPromise = new Promise(
// 	(resolve, reject) => {
// 		chrome.runtime.sendMessage({
// 			'action': 'getOptions'
// 		}, function(response) {
// 			//if (DEBUG) console.log('🗄️ >>>>> getOptionsPromise()',response.data);
// 			tally_options = response.data; // store data
// 			resolve(response.data); // resolve promise
// 		});
// 	}
// );
// // GET TALLY_META
// const getMetaPromise = new Promise(
// 	(resolve, reject) => {
// 		chrome.runtime.sendMessage({
// 			'action': 'getMeta'
// 		}, function(response) {
// 			//if (DEBUG) console.log('🗄️ >>>>> getMetaPromise()',response.data);
// 			tally_meta = response.data; // store data
// 			resolve(response.data); // resolve promise
// 		});
// 	}
// );
// // GET NEARBY MONSTERS
// const getNearbyMonstersPromise = new Promise(
// 	(resolve, reject) => {
// 		chrome.runtime.sendMessage({
// 			'action': 'getNearbyMonsters'
// 		}, function(response) {
// 			//if (DEBUG) console.log('🗄️ >>>>> getNearbyMonsters()',response.data);
// 			tally_nearby_monsters = response.data; // store data
// 			resolve(response.data); // resolve promise
// 		});
// 	}
// );
// // GET STATS
// const getStatsPromise = new Promise(
// 	(resolve, reject) => {
// 		chrome.runtime.sendMessage({
// 			'action': 'getStats'
// 		}, function(response) {
// 			//if (DEBUG) console.log('🗄️ >>>>> getStats()',response.data);
// 			// if stats is empty (game just installed)
// 			if (FS_Object.isEmpty(response.data))
// 				Stats.reset("tally");
// 			else
// 				Stats.overwrite("tally", response.data); // store data
// 			resolve(response.data); // resolve promise
// 		});
// 	}
// );
// // GET TOP MONSTERS
// const getTopMonstersPromise = new Promise(
// 	(resolve, reject) => {
// 		//if (DEBUG) console.log("🗄️ getTopMonstersPromise");
// 		chrome.runtime.sendMessage({
// 			'action': 'getTopMonstersPromise'
// 		}, function(response) {
// 			//if (DEBUG) console.log('🗄️ >>>>> getTopMonstersPromise()',response.data);
// 			tally_top_monsters = response.data; // store data
// 			resolve(response.data); // resolve promise
// 		});
// 	}
// );
