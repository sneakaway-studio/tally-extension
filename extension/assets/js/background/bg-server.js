"use strict";

window.Server = (function () {
	// PRIVATE
	let DEBUG = Debug.ALL.BackgroundServer,
		timedEvents = null,

		serverTimeSinceLastCheckLength = 10 * 60 // check server online every n seconds
	;



	/**
	 *	Timed events to check on server, login status, etc. (mins * secs * millis)
	 */
	function startServerTimedEvents() {
		try {
			let log = "\n🕒 timedEvents.";
			timedEvents = {

				// check if user online (connected to internet)
				userOnlineInterval: setInterval(function () {
					// if (DEBUG) console.log(log + "userOnlineInterval()");
					T.tally_meta.userOnline = navigator.onLine;
				}, (1 * 60 * 1000)), // every 1 minute (low overhead)


				// check if tally server is online
				serverOnlineInterval: setInterval(function () {
					// get tally_meta
					let _tally_meta = store('tally_meta');
					// update time since last checked server
					_tally_meta.serverTimeSinceLastCheck += 1;

					if (DEBUG) console.log(log + "serverOnlineInterval()",
						"_tally_meta.serverTimeSinceLastCheck =", _tally_meta.serverTimeSinceLastCheck);
					// save
					store('tally_meta', _tally_meta);

					// has it been a long time since the last successful check?
					if (_tally_meta.serverTimeSinceLastCheck > serverTimeSinceLastCheckLength) {
						if (Math.random() < 0.7)
							Server.checkIfOnline();
						else
							Server.getTallyUser(true);
					}

				}, (1000)), // once / minute

			};
		} catch (err) {
			console.error(err);
		}
	}






	/**
	 *	Check if API Server is online, save status
	 */
	async function checkIfOnline() {
		let _tally_meta = store("tally_meta"),
			_startTime = new Date().getTime(),
			_url = _tally_meta.api,
			serverResponseMillis = -1,
			serverOnlineResponse = false,
			serverJustCameBackOnline = false;

		// update userOnline status
		_tally_meta.userOnline = navigator.onLine;

		// 1. if user !online
		if (!_tally_meta.userOnline) {
			if (DEBUG) console.warn("📟 Server.checkIfOnline() [1] *** USER NOT ONLINE ***");
			// since we can't check server, we can't rely on any other connections
			_tally_meta.userLoggedIn = false;
		}

		// 2. check if server online
		else {
			// get response
			serverOnlineResponse = await fetch(_url)
				.then((response) => {
					// if (DEBUG) console.log("📟 Server.checkIfOnline() [2.1] response.status =", response.status);
					// go to next .then()
					if (response.status === 200) return response.json();
					// go straight to .catch()
					else throw new Error('Something went wrong');
				})
				.then((data) => {
					if (DEBUG) console.log("📟 Server.checkIfOnline() [2.2] SUCCESS", JSON.stringify(data));
					// update state
					serverResponseMillis = new Date().getTime() - _startTime;
					return true;
				})
				.catch((error) => {
					// server is not online
					if (DEBUG) console.warn("📟 Server.checkIfOnline() [2.3] FAIL", _url, "😢 NOT ONLINE", JSON.stringify(error));
					return false;
				});

		}
		// if (DEBUG) console.log("📟 Server.checkIfOnline() [3]", "THIS SHOULD RUN AFTER FETCH()!! serverOnlineResponse =", serverOnlineResponse);

		// reset time since last checked server
		_tally_meta.serverTimeSinceLastCheck = 0;
		// update last time checked
		_tally_meta.serverTimeOfLastCheckMillis = new Date().getTime();
		// update server response time
		_tally_meta.serverResponseMillis = serverResponseMillis;

		// if server wasn't online before, has just come online, and this isn't the first run
		if (!_tally_meta.serverOnline && serverOnlineResponse && timedEvents != null)
			// make a note and run at end
			serverJustCameBackOnline = true;

		// save status
		_tally_meta.serverOnline = serverOnlineResponse;

		// since we can't check server, we can't rely on any other connections
		if (!serverOnlineResponse) _tally_meta.userLoggedIn = false;

		// store
		store("tally_meta", _tally_meta);

		// if (DEBUG) console.log("📟 Server.checkIfOnline() [4]", "THIS SHOULD RUN AFTER CLEANUP!! serverOnlineResponse =", serverOnlineResponse);

		// start timed event intervals on first run
		if (timedEvents == null) startServerTimedEvents();

		// if just came back then check logged in too
		if (serverJustCameBackOnline) await getTallyUser();

		// return
		return serverOnlineResponse;
	}





	/**
	 *  Get latest T.tally_user data from API
	 */
	async function getTallyUser(auto = false) {
		let _tally_meta = store("tally_meta"),
			_startTime = new Date().getTime(),
			_url = _tally_meta.api + "/user/getTallyUser",
			serverResponseMillis = -1,
			userLoggedInResponse = false;

		// update userOnline status
		_tally_meta.userOnline = navigator.onLine;

		// 1. return early if user !online
		if (!_tally_meta.userOnline) {
			if (DEBUG) console.warn("📟 Server.getTallyUser() [1.1] *** USER NOT ONLINE ***");
			// therefore we can't rely on any other connections either so let them be
		}

		// 2. return early if !server
		else if (!_tally_meta.serverOnline) {
			if (DEBUG) console.warn("📟 Server.getTallyUser() [2.1] *** SERVER NOT ONLINE ***");
		}

		// 3. check if user logged in
		else {
			// get response
			userLoggedInResponse = await fetch(_url, {
					credentials: 'include'
				})
				.then((response) => {
					if (DEBUG) console.log("📟 Server.getTallyUser() [3.1] response.status =", response.status);

					// if response then server is online
					if (response) _tally_meta.serverOnline = true;

					// go to next .then()
					if (response.status === 200) return response.json();
					else if (response.status === 401) return false;
					// go straight to .catch()
					else throw new Error('Something went wrong');
				})
				.then(async (result) => {

					// make sure user was returned
					if (result && result.username) {
						if (DEBUG) console.log("📟 Server.getTallyUser() [3.2] SUCCESS result.username = %c" + JSON.stringify(result.username), Debug.styles.greenbg);
						// merge attack data from server with T.tally_user data properties
						result.attacks = Server.mergeAttackDataFromServer(result.attacks);
						store("tally_user", result);
						serverResponseMillis = new Date().getTime() - _startTime;
						return true;
					} else {
						if (DEBUG) console.warn("📟 Server.getTallyUser() [3.3] FAIL result.username = %c" + JSON.stringify(result.username), Debug.styles.redbg);
						return false;
					}
				})
				.catch((error) => {
					// user (or server) is not online
					if (DEBUG) console.warn("📟 Server.getTallyUser() [3.4] FAIL", _url, "😢 USER NOT LOGGED-IN", JSON.stringify(error));
					_tally_meta.serverOnline = false;
					return false;
				});

		}
		// if (DEBUG) console.log("📟 Server.getTallyUser() [4.1] SAVING tally_meta");

		// reset time since last checked server
		_tally_meta.serverTimeSinceLastCheck = 0;
		// update last time checked
		_tally_meta.serverTimeOfLastCheckMillis = new Date().getTime();
		// update server response time
		_tally_meta.serverResponseMillis = serverResponseMillis;

		// save tally_meta
		_tally_meta.userLoggedIn = userLoggedInResponse;
		store("tally_meta", _tally_meta);
		// return status
		return userLoggedInResponse;
	}




	/**
	 *  Refresh T.tally_top_monsters from API server
	 */
	async function returnTopMonsters() {
		try {
			let _tally_meta = await store("tally_meta"),
				_tally_user = await store("tally_user"),
				_tally_top_monsters = {},
				username = "";

			// if (DEBUG) console.log("📟 Server.returnTopMonsters() [1]", _tally_meta, _tally_user);

			// 1. return early if user !online
			if (!_tally_meta.userOnline) {
				if (DEBUG) console.warn("📟 Server.getTallyUser() [1.1] *** USER NOT ONLINE ***");
				return false;
			}

			// 2. return early if !server
			else if (!_tally_meta.serverOnline) {
				if (DEBUG) console.warn("📟 Server.getTallyUser() [2.1] *** SERVER NOT ONLINE ***");
				return false;
			}


			// return early if no username
			if (prop(_tally_user.username) && _tally_user.username != "")
				username = _tally_user.username;


			return $.ajax({
				type: "GET",
				url: _tally_meta.api + "/monsters/" + username,
				contentType: 'application/json',
				dataType: 'json',
			}).done(result => {
				// treat all server data as master
				// if (DEBUG) console.log("📟 Server.returnTopMonsters() [1] RESULT =", JSON.stringify(result));
				_tally_top_monsters = convertArrayToObject(result.topMonsters, "mid");
				// if (DEBUG) console.log("📟 Server.returnTopMonsters() [2] RESULT =", JSON.stringify(_tally_top_monsters));
				// store top monsters
				store("tally_top_monsters", _tally_top_monsters);
				return true;
			}).fail(error => {
				console.warn("📟 Server.returnTopMonsters() [3] RESULT =", JSON.stringify(error));
				// server might not be online
				// checkIfOnline();
			});
		} catch (err) {
			console.error(err);
		}
	}


	/**
	 *	Merge attack data from server with game data properties
	 */
	function mergeAttackDataFromServer(attacks) {
		try {
			// loop through attacks from server
			for (var key in attacks) {
				if (attacks.hasOwnProperty(key)) {
					// add AttackData properties to obj from server
					// if (DEBUG) console.log("📟 Server.mergeAttackDataFromServer()", key, attacks[key]);
					// save the data
					let attackData = AttackData.data[key];
					// save selected prop
					attackData.selected = attacks[key].selected;
					// set it back in attacks
					attacks[key] = attackData;
				}
			}
			return attacks;
		} catch (err) {
			console.error(err);
		}
	}


	// PUBLIC
	return {
		checkIfOnline: checkIfOnline,
		startServerTimedEvents: startServerTimedEvents,
		returnTopMonsters: returnTopMonsters,
		getTallyUser: getTallyUser,
		mergeAttackDataFromServer: mergeAttackDataFromServer
	};
}());
