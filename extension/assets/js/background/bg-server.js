"use strict";

window.Server = (function() {
	// PRIVATE
	let DEBUG = Debug.ALL.BackgroundServer,
		timedEvents = null,

		serverTimeSinceLastCheckLength = 10 * 60 // check server online every n seconds
	;

	// DEBUG = true;


	async function checkIfUserOnline() {
		try {
			// get tally_meta
			T.tally_meta = store('tally_meta');
				if (DEBUG) console.log("📟 Server.checkIfUserOnline()", T.tally_meta.userOnline, navigator.onLine);

T.tally_meta.userOnline = navigator.onLine;

store('tally_meta',T.tally_meta);

			return navigator.onLine;
		} catch (err) {
			console.error(err);
		}
	}


	/**
	 *	Timed events to check on server, login status, etc. (mins * secs * millis)
	 */
	function startServerTimedEvents() {
		try {
			let log = "🕒 timedEvents.";
			timedEvents = {

				// check if user online (connected to internet)
				userOnlineInterval: setInterval(function() {
					checkIfUserOnline();
				}, (60 * 1000)), // every 1 minute - this has low overhead


				// check if tally server is online
				serverOnlineInterval: setInterval(function() {
					// get tally_meta
					T.tally_meta = store('tally_meta');
					// update time since last checked server
					T.tally_meta.serverTimeSinceLastCheck += 1;

					if (DEBUG) console.log(log + "serverOnlineInterval()",
						"T.tally_meta.serverTimeSinceLastCheck =", T.tally_meta.serverTimeSinceLastCheck);
					// save
					store('tally_meta', T.tally_meta);

					// has it been a long time since the last successful check?
					if (T.tally_meta.serverTimeSinceLastCheck > serverTimeSinceLastCheckLength) {
						if (Math.random() < 0.7)
							Server.checkIfOnline();
						else
							Server.getTallyUser(true);
					}

				}, (60 * 1000)), // once / minute

			};
		} catch (err) {
			console.error(err);
		}
	}



	function connectionManager() {

	}


	// manage all new attempts at connection
	// if connectionAttempt
	//   -- how long has it been?
	//   -- if > n
	// 		-- try again




	// events
	// - just came back online



	/**
	 *	Check if API Server is online, save status
	 */
	async function checkIfOnline() {
		T.tally_meta = store("tally_meta");
		let _url = T.tally_meta.api,
			_startTimeMillis = new Date().getTime(),
			serverResponseMillis = -1,
			serverOnlineResponse = false,
			serverJustCameBackOnline = false;

		// update userOnline status
		T.tally_meta.userOnline = navigator.onLine;

		// 1. if user !online
		if (!T.tally_meta.userOnline) {
			if (DEBUG) console.warn("📟 Server.checkIfOnline() [1] *** USER NOT ONLINE ***");
			// since we can't check server, we can't rely on any other connections
			T.tally_meta.userLoggedIn = false;
		}

		// 2. check if server online
		else {
			// get response
			serverOnlineResponse = await fetch(_url)
				.then((response) => {
					if (DEBUG) console.log("📟 Server.checkIfOnline() [2.1] response.status =", response.status);
					// go to next .then()
					if (response.status === 200) return response.json();
					// go straight to .catch()
					else throw new Error('Something went wrong');
				})
				.then((data) => {
					if (DEBUG) console.log("📟 Server.checkIfOnline() [2.2] SUCCESS", JSON.stringify(data));
					// update state
					serverResponseMillis = new Date().getTime() - _startTimeMillis;
					return true;
				})
				.catch((error) => {
					// server is not online
					if (DEBUG) console.warn("📟 Server.checkIfOnline() [2.3] FAIL", _url, "😢 NOT ONLINE", JSON.stringify(error), Debug.getCurrentDateStr());
					return false;
				});

		}
		// if (DEBUG) console.log("📟 Server.checkIfOnline() [3]", "RUN AFTER FETCH()!! serverOnlineResponse =", serverOnlineResponse);

		// reset time since last checked server
		T.tally_meta.serverTimeSinceLastCheck = 0;
		// update last time checked
		T.tally_meta.serverTimeOfLastCheckMillis = new Date().getTime();
		// update server response time
		T.tally_meta.serverResponseMillis = serverResponseMillis;

		// if server wasn't online before, has just come online, and this isn't the first run
		if (!T.tally_meta.serverOnline && serverOnlineResponse && timedEvents != null)
			// make a note and run at end
			serverJustCameBackOnline = true;

		// save status
		T.tally_meta.serverOnline = serverOnlineResponse;

		// since we can't check server, we can't rely on any other connections
		if (!serverOnlineResponse) T.tally_meta.userLoggedIn = false;

		// store
		store("tally_meta", T.tally_meta);

		// if (DEBUG) console.log("📟 Server.checkIfOnline() [4]", "RUN AFTER CLEANUP!! serverOnlineResponse =", serverOnlineResponse);

		// start timed event intervals on first run
		if (timedEvents == null) {
			// after a second
			setTimeout(function() {
				startServerTimedEvents();
			}, 1000);
		}

		// if just came back then check logged in too
		if (serverJustCameBackOnline) await getTallyUser();

		// return
		return serverOnlineResponse;
	}





	/**
	 *  Get latest T.tally_user data from API
	 */
	async function getTallyUser(auto = false) {
		T.tally_meta = store("tally_meta");
		let _startTimeMillis = new Date().getTime(),
			_url = T.tally_meta.api + "/user/getTallyUser",
			serverResponseMillis = -1,
			userLoggedInResponse = false;

		// update userOnline status
		T.tally_meta.userOnline = navigator.onLine;

		// 1. return early if user !online
		if (!T.tally_meta.userOnline) {
			if (DEBUG) console.warn("📟 Server.getTallyUser() [1.1] *** USER NOT ONLINE ***");
			// therefore we can't rely on any other connections either so let them be
		}

		// 2. return early if !server
		else if (!T.tally_meta.serverOnline) {
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
					if (response) T.tally_meta.serverOnline = true;

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
						T.tally_user = result;
						store("tally_user", T.tally_user);
						serverResponseMillis = new Date().getTime() - _startTimeMillis;
						return true;
					} else {
						if (DEBUG) console.warn("📟 Server.getTallyUser() [3.3] FAIL result.username = %c" + JSON.stringify(result.username), Debug.styles.redbg);
						return false;
					}
				})
				.catch((error) => {
					// user (or server) is not online
					if (DEBUG) console.warn("📟 Server.getTallyUser() [3.4] FAIL", _url, "😢 USER NOT LOGGED-IN", JSON.stringify(error), Debug.getCurrentDateStr());
					T.tally_meta.serverOnline = false;
					return false;
				});

		}
		if (DEBUG) console.log("📟 Server.getTallyUser() [4.1] SAVING data");

		// reset time since last checked server
		T.tally_meta.serverTimeSinceLastCheck = 0;
		// update last time checked
		T.tally_meta.serverTimeOfLastCheckMillis = new Date().getTime();
		// update server response time
		T.tally_meta.serverResponseMillis = serverResponseMillis;

		// save tally_meta
		T.tally_meta.userLoggedIn = userLoggedInResponse;
		
		// return status
		return userLoggedInResponse;
	}




	/**
	 *  Refresh T.tally_top_monsters from API server
	 */
	async function returnTopMonsters() {
		try {
			T.tally_meta = store("tally_meta");
			T.tally_user = store("tally_user");
			T.tally_top_monsters = store("tally_top_monsters");

			// if (DEBUG) console.log("📟 Server.returnTopMonsters() [1]", T.tally_meta, T.tally_user);

			// 1. return early if user !online
			if (!T.tally_meta.userOnline) {
				if (DEBUG) console.warn("📟 Server.getTallyUser() [1.1] *** USER NOT ONLINE ***");
				return false;
			}

			// 2. return early if !server
			else if (!T.tally_meta.serverOnline) {
				if (DEBUG) console.warn("📟 Server.getTallyUser() [1.2] *** SERVER NOT ONLINE ***");
				return false;
			}


			// return early if no username
			else if (FS_Object.prop(T.tally_user.username) && T.tally_user.username === ""){
				if (DEBUG) console.warn("📟 Server.getTallyUser() [1.3] *** NO USERNAME ***");
				return false;
			}


			return $.ajax({
				type: "GET",
				url: T.tally_meta.api + "/monsters/" + T.tally_user.username,
				contentType: 'application/json',
				dataType: 'json',
			}).done(result => {
				// treat all server data as master
				// if (DEBUG) console.log("📟 Server.returnTopMonsters() [1] RESULT =", JSON.stringify(result));
				T.tally_top_monsters = FS_Object.convertArrayToObject(result.topMonsters, "mid");
				// if (DEBUG) console.log("📟 Server.returnTopMonsters() [2] RESULT =", JSON.stringify(T.tally_top_monsters));
				// store top monsters
				store("tally_top_monsters", T.tally_top_monsters);
				return true;
			}).fail(error => {
				console.warn("📟 Server.returnTopMonsters() [3] ERROR =", Debug.getCurrentDateStr(), JSON.stringify(error));
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
		checkIfUserOnline: checkIfUserOnline,
		checkIfOnline: checkIfOnline,
		startServerTimedEvents: startServerTimedEvents,
		returnTopMonsters: returnTopMonsters,
		getTallyUser: getTallyUser,
		mergeAttackDataFromServer: mergeAttackDataFromServer
	};
}());




/**
 *	Chrome web request error handling
 */

// ::net errors
// potentially use filters to isolate specific errors for Tally
// > https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/webRequest/onErrorOccurred
// --> https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/webRequest/RequestFilter
// ----> https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/webRequest/ResourceType
chrome.webRequest.onErrorOccurred.addListener(function(details) {
	console.error(Debug.getCurrentDateStr(), "onErrorOccurred", details);


	if (details.error === "net::ERR_CONNECTION_REFUSED" && details.url === T.tally_meta.api) {
		console.error(Debug.getCurrentDateStr(), "TALLY CANNOT CONNECT");
	}


}, {
	urls: ["http://*/*", "https://*/*"]
});

// check for HTTP errors
chrome.webRequest.onHeadersReceived.addListener(function(details) {
	// console.error(Debug.getCurrentDateStr(), "onHeadersReceived", details);

	var status = extractStatus(details.statusLine);
	if (!status) return;
	// if error code is 4** or 5**
	if (status.code.charAt(0) == '5' || status.code.charAt(0) == '4')
		console.error(Debug.getCurrentDateStr(), "onHeadersReceived", details);
}, {
	urls: ["http://*/*", "https://*/*"]
});

// function handleNetworkError(details) {
// 	console.error(Debug.getCurrentDateStr(), details);
// 	// console.error(Debug.getCurrentDateStr());
// }

/**
 *	Extract status code/message
 * 	'HTTP/1.1 200 OK' => { "code": 200, "message": "ok"}
 */
function extractStatus(line) {
	var match = line.match(/[^ ]* (\d{3}) (.*)/);
	if (match)
		return {
			code: match[1],
			message: match[2]
		};
	else return undefined;
}
