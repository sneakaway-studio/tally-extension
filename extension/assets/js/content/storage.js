"use strict";

/*  BACKGROUND STORAGE
 ******************************************************************************/

window.TallyStorage = (function () {

	let DEBUG = Debug.ALL.TallyStorage;

	console.log("%c   Hi, I'm Tally!", Debug.tallyConsoleIcon);


	/**
	 *	Get data from API - currently only uses for random urls for demo
	 */
	function getDataFromServer(url, callback) {
		try {
			//if (DEBUG) console.log("🗄️ < TallyStorage.getDataFromServer()", url);
			let msg = {
				'action': 'getDataFromServer',
				'url': url
			};
			chrome.runtime.sendMessage(msg, function (response) {
				if (DEBUG) console.log("🗄️ > TallyStorage.getDataFromServer() RESPONSE =", JSON.stringify(response));
				//TallyMain.sync(start);
				callback(response);
			});
		} catch (err) {
			console.error(err);
		}
	}

	/**
	 *	Generic getData() function - retrieve a key from the background (local storage)
	 */
	async function getData(name, caller = "") {
		try {
			if (DEBUG) console.log("🗄️ < TallyStorage.getData()", name, caller);
			let msg = {
				'action': 'getData',
				'name': name
			};
			chrome.runtime.sendMessage(msg, function (response) {
				if (DEBUG) console.log("🗄️ > TallyStorage.getData() RESPONSE =", name, JSON.stringify(response));
				return response.data;
			});
		} catch (err) {
			console.error(err);
		}
	}
	/**
	 *	Generic saveData() function - saves in background (local storage) only
	 */
	function saveData(name, data, caller = "") {
		try {
			let msg = {
				'action': 'saveData',
				'name': name,
				'data': data
			};
			if (DEBUG) console.log("🗄️ < TallyStorage.saveData() <", caller, msg);
			chrome.runtime.sendMessage(msg, function (response) {
				// if (DEBUG) console.log("🗄️ > TallyStorage.saveData() RESPONSE =", name, caller, JSON.stringify(response));
				// no response needed
				//return response.data;
			});
		} catch (err) {
			console.error(err);
		}
	}





	/**
	 *	Get new tally_user data from server and reset game
	 */
	async function resetTallyUserFromServer() {
		try {
			if (DEBUG) console.log("< 🗄️ TallyStorage.resetTallyUserFromServer() [1.1]",
				"Page.data.actions.resetTallyUserFromServerCalled =", Page.data.actions.resetTallyUserFromServerCalled);

			// so we only check this once and don't check again
			Page.data.actions.resetTallyUserFromServerCalled++;

			if (DEBUG) console.log("< 🗄️ TallyStorage.resetTallyUserFromServer() [1.2]",
				"Page.data.actions.resetTallyUserFromServerCalled =", Page.data.actions.resetTallyUserFromServerCalled);

			// send message
			chrome.runtime.sendMessage({
				'action': 'resetTallyUserFromServer'
			}, function (response) {
				if (DEBUG) console.log("🗄️ > TallyStorage.resetTallyUserFromServer() [2] RESPONSE =", response);

				// update all objects
				T.tally_user = response.tally_user;
				T.tally_options = response.tally_options;
				T.tally_meta = response.tally_meta;
				T.tally_top_monsters = response.tally_top_monsters;
				T.tally_nearby_monsters = response.tally_nearby_monsters;
				T.tally_stats = response.tally_stats;

				// update Page.data.mode
				TallyMain.savePageMode();
				// start game (again)
				TallyMain.contentStartChecks();
			});
		} catch (err) {
			console.error(err);
		}
	}





	let startupPromises = [], // array to hold all startupPromises
		startupPromiseNames = []; // data objects to load

	/**
	 *	Get all data from background
	 *  - can be called multiple times, w/ or w/o callback
	 *  - if sent with TallyMain.contentStartChecks callback then resets game in content script
	 *  - assumes background data is current (so does not sync with server)
	 */
	async function getDataFromBackground(callback = null) {
		try {
			if (DEBUG) console.log('🗄️ TallyStorage.getDataFromBackground() [1] -> CREATE STARTUP PROMISES');

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
				startupPromises.push(returnNewStartupPromise(name));
			});
			// run callback if exists
			if (callback) {
				if (DEBUG) console.log('🗄️ TallyStorage.getDataFromBackground() [2] -> RUN CALLBACK');
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
	function returnNewStartupPromise(name) {
		try {
			// add new promise
			return new Promise((resolve, reject) => {
				Debug.elapsedTime("🗄️ TallyStorage.returnNewStartupPromise() [1] (create) " + name + " ");
				// call background
				chrome.runtime.sendMessage({
					'action': 'getData',
					'name': name
				}, function (response) {
					// log before storage
					// if (DEBUG) console.log('🗄️ TallyStorage.returnNewStartupPromise()', name, JSON.stringify(response.data));
					Debug.elapsedTime("TallyStorage.returnNewStartupPromises() [2] (resolve) " + name + "");

					// store data
					T[name] = response.data;

					// log after storage
					// if (DEBUG) console.log('🗄️ TallyStorage.returnNewStartupPromise() -> T[name] =', T[name]);
					// if (DEBUG) console.log("%cT."+name, Debug.styles.greenbg, JSON.stringify(T[name]));

					// resolve promise
					resolve(response.data);
				});
			});
		} catch (err) {
			console.error(err);
		}
	}


	/**
	 *	After all promises have resolved, essentially a listener but allows data to be fetched in parallel
	 */
	Promise
		.all(startupPromises)
		.then(function (result) {
			Debug.elapsedTime("TallyStorage.getDataFromBackground() (promises resolved)");
			// if (DEBUG) console.log("🗄️ > TallyStorage STARTUP PROMISES -> T.startUpPromisesResolved =",T.startUpPromisesResolved);

			// if all is good with account
			if (result[0] && result[0].username) {

				// if (DEBUG) console.log('T.tally_user =', T.tally_user);
				// if (DEBUG) console.log('T.tally_options =', T.tally_options);
				// if (DEBUG) console.log('T.tally_meta =', T.tally_meta);
				// if (DEBUG) console.log('T.tally_nearby_monsters =', T.tally_nearby_monsters);
				// if (DEBUG) console.log('T.tally_stats =', T.tally_stats);
				// if (DEBUG) console.log('T.tally_top_monsters =', T.tally_top_monsters);

				if (DEBUG) console.log("🗄️ > TallyStorage STARTUP PROMISES -> result.username = %c" + JSON.stringify(result[0].username), Debug.styles.greenbg);

				// set status
				T.startUpPromisesResolved = true;
				// we can also assume this
				// T.tally_meta.userLoggedIn = true;
			} else {
				if (DEBUG) console.log("🗄️ > TallyStorage STARTUP PROMISES -> result[0] = %c" + JSON.stringify(result[0]), Debug.styles.redbg);
				// set status
				T.startUpPromisesResolved = false;
				// we can also assume this
				T.tally_meta.userLoggedIn = false;
			}
			if (DEBUG) console.log('🗄️ > TallyStorage STARTUP PROMISES ->', "T.startUpPromisesResolved =", T.startUpPromisesResolved, result);

			// start game (again) regardless whether server is running
			TallyMain.contentStartChecks();
		})
		.catch(function (err) {
			T.startUpPromisesResolved = false;

			console.error('😂 TallyStorage.getDataFromBackground() -> ' +
				'one or more promises have failed: ' + err,
				"\n T.tally_user =", T.tally_user,
				"\n T.tally_options =", T.tally_options,
				"\n T.tally_meta =", T.tally_meta,
				"\n T.tally_nearby_monsters =", T.tally_nearby_monsters,
				"\n T.tally_stats =", T.tally_stats,
				"\n T.tally_top_monsters =", T.tally_top_monsters
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
		resetTallyUserFromServer: resetTallyUserFromServer
	};
})();
