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
	 *	Save T.tally_user in content / background
	 */
	function saveTallyUser(name, obj, caller = "") {
		try {
			if (DEBUG) console.log("🗄️ < TallyStorage.saveTallyUser()", name, obj, caller, "T.tally_user =", T.tally_user);
			if (!FS_Object.prop(T.tally_user.progress)) {
				console.error("🗄️ < TallyStorage.saveTallyUser() NO T.tally_user");
				return;
			}
			// get latest from background ? NO IDT this is required
			//T.tally_user = TallyStorage.getData("tally_user");
			// save in content
			T.tally_user[name][obj.name] = obj;
			// save in background
			let msg = {
				'action': 'saveData',
				'name': "tally_user",
				'data': T.tally_user
			};
			chrome.runtime.sendMessage(msg, function(response) {
				if (DEBUG) console.log("🗄️ > TallyStorage.saveTallyUser() RESPONSE =", JSON.stringify(response));
				T.tally_user = response.data;
			});
		} catch (err) {
			console.error(err);
		}
	}



	/**
	 *	Save T.tally_user in content / background
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
				T.tally_user = response.tally_user;
				T.tally_options = response.tally_options;
				T.tally_meta = response.tally_meta;
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
					T.tally_user = response.tally_user;
					T.tally_options = response.tally_options;
					T.tally_meta = response.tally_meta;


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
				console.log("🗄️ > TallyStorage.setBadgeText() response =", response);
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
	// 			T.tally_user = response.data; // store data
	// 			Config.logTimeSinceLoad("TallyStorage.getUserPromise() (T.tally_user stored) [3]");
	// 			resolve(response.data); // resolve promise
	// 			Config.logTimeSinceLoad("TallyStorage.getUserPromise() (promise resolved) [4]");
	// 		});
	// 	}
	// );





	let startupPromises = [], // arrays to hold all startupPromises
		startupPromiseNames = []; // data objects to load

	/**
	 *	Get all data from background
	 *  - can be called multiple times, w/ or w/o callback
	 *  - if sent with TallyMain.contentStartChecks callback then resets game in content script
	 *  - assumes background data is current (so does not sync with server)
	 */
	async function getDataFromBackground(callback = null) {
		try {
			if (DEBUG) console.log('🗄️ TallyStorage.getDataFromBackground() [1]');

			// reset arrays
			startupPromises = [];
			startupPromiseNames = [
				"tally_user",
				"tally_options",
				"tally_meta",
				"tally_nearby_monsters",
				"tally_stats",
				"tally_top_monsters"
			];
			// loop through all startupPromiseNames and create Promises
			startupPromiseNames.map((name) => {
				startupPromises.push(createStartupPromise(name));
			});
			// run callback if exists
			if (callback) {
				if (DEBUG) console.log('🗄️ TallyStorage.getDataFromBackground() [2] (running callback)');
				callback();
			}
		} catch (err) {
			console.error(err);
		}
	}
	getDataFromBackground();


	/**
	 *	Return a promise
	 */
	function createStartupPromise(name) {
		try {
			// add new promise
			return new Promise(
				(resolve, reject) => {
					Config.logTimeSinceLoad("🗄️ TallyStorage.createStartupPromise() [1] (create) " + name + " ");
					// call background
					chrome.runtime.sendMessage({
						'action': 'getData',
						'name': name
					}, function(response) {
						// log before storage
						// if (DEBUG) console.log('🗄️ TallyStorage.createStartupPromise()', name, JSON.stringify(response.data));
						Config.logTimeSinceLoad("TallyStorage.createStartupPromises() [3] (resolve) " + name + "");

						// store data
						T[name] = response.data;

						// log after storage
						// if (DEBUG) console.log('🗄️ TallyStorage.createStartupPromise() -> T[name] =', T[name]);
						// if (DEBUG) console.log("%cT."+name, Debug.styles.green, JSON.stringify(T[name]));

						// resolve promise
						resolve(response.data);
					});
				}
			);
		} catch (err) {
			console.error(err);
		}
	}


	/**
	 *	After all promises have resolved
	 */
	Promise
		.all(startupPromises)
		.then(function(result) {
			// if (DEBUG) console.log('🗄️ > TallyStorage all data has loaded', "TallyInit.dataLoaded =", TallyInit.dataLoaded, result);
			// if (DEBUG) console.log('T.tally_user =', T.tally_user);
			// if (DEBUG) console.log('T.tally_options =', T.tally_options);
			// if (DEBUG) console.log('T.tally_meta =', T.tally_meta);
			// if (DEBUG) console.log('T.tally_nearby_monsters =', T.tally_nearby_monsters);
			// if (DEBUG) console.log('T.tally_stats =', T.tally_stats);
			// if (DEBUG) console.log('T.tally_top_monsters =', T.tally_top_monsters);
			Config.logTimeSinceLoad("TallyStorage.getDataFromBackground() resolved) [4]");

			TallyInit.dataLoaded = true;

			if (DEBUG) console.log('🗄️ > TallyStorage all data has loaded', "TallyInit.dataLoaded =", TallyInit.dataLoaded, result);

			// run start checks
			TallyMain.contentStartChecks();
		})
		.catch(function(err) {
			console.error('😂 TallyInit.getDataFromBackground() -> ' +
				'one or more promises have failed: ' + err,
				"\n T.tally_user =", T.tally_user,
				"\n T.tally_options =", T.tally_options,
				"\n T.tally_meta =", T.tally_meta,
				"\n T.tally_nearby_monsters =", T.tally_nearby_monsters,
				"\n T.tally_top_monsters =", T.tally_top_monsters,
				"\n T.tally_stats =", T.tally_stats
			);
		});




	// PUBLIC
	return {
		get startupPromises() {
			return startupPromises;
		},
		getDataFromServer: getDataFromServer,
		getDataFromBackground: getDataFromBackground,
		getData: getData,
		saveData: saveData,
		saveTallyUser: saveTallyUser,
		saveTokenFromDashboard: saveTokenFromDashboard,
		setBadgeText: setBadgeText,
		resetTallyUser: resetTallyUser
	};
})();
