"use strict";

window.Server = (function() {
	// PRIVATE
	let DEBUG = Debug.ALL.BackgroundServer;





	/**
	 *	Check if game can send an update and track failed attempts
	 */
	function canSendUpdate() {
		try {
			// let connected = true;
			// // if we want to send an update but can't because ...
			// // user not logged in, server not online, or user not connected to internet
			// if (!T.tally_meta.userOnline) {
			// 	console.warn("📟 Server.canSendUpdate() ❌ USER OFFLINE");
			// 	T.tally_meta.userOnlineFailedAttempts++;
			// 	connected = false;
			// } else if (!T.tally_meta.serverOnline) {
			// 	console.warn("📟 Server.canSendUpdate() ❌ SERVER OFFLINE");
			// 	T.tally_meta.serverOnlineInFailedAttempts++;
			// 	connected = false;
			// } else if (!T.tally_meta.userLoggedIn) {
			// 	console.warn("📟 Server.canSendUpdate() ❌ USER NOT LOGGED-IN");
			// 	T.tally_meta.userLoggedInFailedAttempts++;
			// 	connected = false;
			// }
			// // save tally_meta
			// store('tally_meta', T.tally_meta);
			// return connected;
		} catch (err) {
			console.error(err);
		}
	}


	/**
	 *	Check if user is online, save and return status
	 */
	async function checkIfUserOnline() {
		try {
			// if different
			if (T.tally_meta.userOnline !== navigator.onLine) {
				if (DEBUG) console.log("📟 Server.checkIfUserOnline() CHANGED", T.tally_meta.userOnline, navigator.onLine);
				// update
				T.tally_meta.userOnline = navigator.onLine;
				store('tally_meta', T.tally_meta);
			}
			return navigator.onLine;
		} catch (err) {
			console.error(err);
		}
	}

	/**
	 *	Check if API Server is online, save status
	 */
	async function checkIfOnline() {
		try {
			//
			// // T.tally_meta = store("tally_meta");
			// let _url = T.tally_meta.env.api,
			// 	// set default server status info
			// 	_startTimeMillis = new Date().getTime(),
			// 	serverResponseMillis = -1,
			// 	serverOnlineResponse = false,
			// 	// serverJustCameBackOnline = false
			// 	;

			// 1. make sure user is online

			// // update userOnline status
			// T.tally_meta.userOnline = navigator.onLine;
			// // if !userOnline
			// if (!T.tally_meta.userOnline) {
			// 	if (DEBUG) console.warn("📟 Server.checkIfOnline() [1] *** USER NOT ONLINE ***");
			// 	// since we can't check server, we can't rely on any other connections
			// 	T.tally_meta.userLoggedIn = false;
			// }

			// // 2. if userOnline, check server status
			// else {
				// get response
				// serverOnlineResponse = await fetch(_url)
					// .then((response) => {
					// 	if (DEBUG) console.log("📟 Server.checkIfOnline() [2.1] response.status =", response.status);
					// 	// go to next .then()
					// 	if (response.status === 200) return response.json();
					// 	// go straight to .catch()
					// 	else throw new Error('Something went wrong');
					// })
					// .then((data) => {
					// 	if (DEBUG) console.log("📟 Server.checkIfOnline() [2.2] SUCCESS", JSON.stringify(data));
					// 	// update state
					// 	//serverResponseMillis = new Date().getTime() - _startTimeMillis;
					// 	return true;
					// })
					// .catch((error) => {
					// 	// server is not online
					// 	if (DEBUG) console.warn("📟 Server.checkIfOnline() [2.3] FAIL", _url, "😢 NOT ONLINE", JSON.stringify(error), Debug.getCurrentDateStr());
					// 	return false;
					// });
			// }


			// 3. look @ previous state
			// if (DEBUG) console.log("📟 Server.checkIfOnline() [3]", "LOOK @ PREVIOUS STATE serverOnlineResponse =", serverOnlineResponse);

			// // if server wasn't online before, has just come online, and this isn't the first run
			// if (!T.tally_meta.serverOnline && serverOnlineResponse && timedEvents != null)
			// 	// make a note and run getTallyUser() at end
			// 	serverJustCameBackOnline = true;


			// 4. update current state
			// if (DEBUG) console.log("📟 Server.checkIfOnline() [4]", "UPDATE STATE serverOnlineResponse =", serverOnlineResponse);

			// // save server status
			// updateStatusSaveMeta({
			// 	serverOnline: serverOnlineResponse,
			// 	serverSecondsSinceLastChecked: 0,
			// 	serverResponseMillis: serverResponseMillis
			// });

			// // if connection failed
			// if (!serverOnlineResponse) {
			// 	// track failed attempts
			// 	T.tally_meta.serverOnlineFailedAttempts++;
			// 	// since we can't check server, we can't rely on other connections
			// 	T.tally_meta.userLoggedIn = false;
			// } else {
			// 	// reset
			// 	T.tally_meta.serverOnlineFailedAttempts = 0;
			// }


			// 5. other functions
			// if (DEBUG) console.log("📟 Server.checkIfOnline() [5]", "OTHER FUNCTIONS! serverOnlineResponse =", serverOnlineResponse);



			// // if just came back then check logged in too
			// if (serverJustCameBackOnline) await getTallyUser();

			// return
			// return serverOnlineResponse;
		} catch (err) {
			console.error(err);
		}
	}



	function updateStatusSaveMeta(obj) {
		try {
			// // serverOnline status
			// T.tally_meta.serverOnline = obj.serverOnline || false;
			// // reset time since last checked server
			// T.tally_meta.serverSecondsSinceLastChecked = obj.serverSecondsSinceLastChecked || 0;
			// // update last time checked
			// T.tally_meta.serverTimestampFromLastCheck = new Date().getTime();
			// // update server response time
			// T.tally_meta.serverResponseMillis = obj.serverResponseMillis || -1;
			// // store object
			// store("tally_meta", T.tally_meta);
		} catch (err) {
			console.error(err);
		}
	}





	/**
	 *  A single function to handle all server requests and simplify logic. Returns true if successful.
	 * 	Called when
	 * 	- Installation or reinstallation
	 * 	- User clicks, initiates game events
	 * 	- Even when previously not connected
	 * 	Following params.actions are accepted
	 * 	- checkIfOnline		= GET /
	 * 	- getTallyUser 		= GET /user/getTallyUser
	 * 	- updateTallyUser 	= PUT /user/updateTallyUser
	 * 	After this function we know if...
	 * 	- user connected to internet
	 * 	- server is online
	 *  - user is logged into server
	 */
	async function send(params) {
		try {
			if (DEBUG) console.log("📟 Server.send() [1] params =", params);

			// 1. create request from params

			let _url = T.tally_meta.env.api + params.url,
				_startTimeMillis = new Date().getTime(),
				_serverResponseMillis = -1,
				responseFromSend = false,
				// _userJustCameBackOnline = false, // user was offline, now online
				// _serverJustCameBackOnline = false, // server was not responding, but is now
				request = {
					credentials: "include",
					method: params.method,
					headers: {
						'Content-Type': 'application/json'
					}
				};

			// if pushing data to server
			if (params.method === "PUT") {
				request.credentials = 'include';
				request.body = JSON.stringify(params.data) || "";
			}


			// 2.1 make sure user is online

			// update userOnline status
			T.tally_meta.userOnline = navigator.onLine;
			// if !userOnline
			if (!T.tally_meta.userOnline) {
				if (DEBUG) console.warn("📟 Server.send() [2.1] *** USER NOT ONLINE ***");
				// since we can't check server, we can't rely on any other connections
				T.tally_meta.serverOnline = false;
				T.tally_meta.userLoggedIn = false;
			}

			// 2.2 if userOnline, proceed
			else {
				if (DEBUG) console.log("📟 Server.send() [2.2] request =", request);

				responseFromSend = await fetch(_url, request)
					.then((response) => {
						if (DEBUG) console.log("📟 Server.send() [3.1] response =", response);
						if (DEBUG) console.log("📟 Server.send() [3.2] response.status =", response.status);

						// if response received then we know server online
						if (response) {
							T.tally_meta.serverOnline = true;
							T.tally_meta.serverOnlineFailedAttempts = 0;
						}
						// 200–299 = success, parse json response and go to next .then()
						if (response.ok) return response.json();
						// 401 = unauthorized (not logged in)
						else if (response.status === 401) {
							// save status
							T.tally_meta.userLoggedIn = false;
							return false;
						}
						// go straight to .catch()
						else throw new Error('Something went wrong');
					})
					.then((result) => {
						// if result then connection to server was successful
						if (result) {
							if (DEBUG) console.log("📟 Server.send() [4.1] SUCCESS result =", result);

							// if username present it is a tallyUser object and user is also loggedIn
							if (result.username) {
								if (DEBUG) console.log("📟 Server.send() [4.2] SUCCESS result.username = %c" + JSON.stringify(result.username), Debug.styles.greenbg);

								// if a username is present then reset
								T.tally_meta.userLoggedIn = true;
								T.tally_meta.userLoggedInFailedAttempts = 0;

								// merge attack data from server with T.tally_user data properties
								result.attacks = Server.mergeAttackDataFromServer(result.attacks);
								T.tally_user = result;
								store("tally_user", T.tally_user);
							}
							// if no username but trying to reach an endpoint that required authentication
							else if (params.action === "getTallyUser" || params.action === "updateTallyUser") {
								// track failed attempts
								T.tally_meta.userLoggedInFailedAttempts++;
								return false;
							}
							return true;
						} else {
							if (DEBUG) console.log("📟 Server.send() [4.1] %cresult.username", Debug.styles.redbg);
							// if connected to server but no result then something must be wrong with server
							throw new Error('Something went wrong');
						}
					})
					.catch((err) => {
						if (DEBUG) console.error("📟 Server.send() [5.1] 😢 NO RESPONSE FROM SERVER", _url, "err = ", JSON.stringify(err), Debug.getCurrentDateStr());

						// if no response from server then it is not online or not responding ATM
						T.tally_meta.serverOnline = false;
						T.tally_meta.serverOnlineFailedAttempts++;
						// also can't be loggedIn if not online
						T.tally_meta.serverOnline = false;
						return false;
					});

				// reset time since last checked server
				T.tally_meta.serverSecondsSinceLastChecked = 0;
				// update last time checked
				T.tally_meta.serverTimestampFromLastCheck = new Date().getTime();
				// update server response time
				T.tally_meta.serverResponseMillis = T.tally_meta.serverTimestampFromLastCheck - _startTimeMillis;
			}


			// SAVING JUST IN CASE

			// // 3. look @ previous state
			// if (DEBUG) console.log("📟 Server.send() [6]", "LOOK @ PREVIOUS STATE responseFromSend =", responseFromSend);
			//
			// // if server wasn't online before, has just come online, and this isn't the first run
			// if (!T.tally_meta.serverOnline && responseFromSend && Background.timedEvents != null)
			// 	// make a note and run getTallyUser() at end
			// 	_serverJustCameBackOnline = true;
			//
			// // 4. update current state
			//
			// // // if just came back then check logged in too
			// // if (_serverJustCameBackOnline) await getTallyUser();


			if (DEBUG) console.log("📟 Server.send() [6] RETURN responseFromSend =", responseFromSend, "POST send()",
				"\n    T.tally_meta.userOnline =", T.tally_meta.userOnline,
				"\n    T.tally_meta.serverOnline =", T.tally_meta.serverOnline,
				"\n    T.tally_meta.userLoggedIn =", T.tally_meta.userLoggedIn,
				"\n    T.tally_meta.serverOnlineFailedAttempts =", T.tally_meta.serverOnlineFailedAttempts,
				"\n    T.tally_meta.userLoggedInFailedAttempts =", T.tally_meta.userLoggedInFailedAttempts,
				"\n    T.tally_meta.serverSecondsSinceLastChecked =", T.tally_meta.serverSecondsSinceLastChecked,
				"\n    T.tally_meta.serverResponseMillis =", T.tally_meta.serverResponseMillis,
				""
			);

			// store object
			store("tally_meta", T.tally_meta);
			// return to calling function
			return responseFromSend;
		} catch (err) {
			console.error(err);
		}
	}


	/**
	 * 	Tests for the send() function
	 */
	 function testSendFunction() {

 		// is the server online?
 		send({
			caller: "📟 Server.testSendFunction()",
			action: "serverOnline",
			method: "GET",
			url: "",
			data: {}
 		}).then(response => {
 			console.log("send() / response =", response);
 		});

 		// get tally user
 		send({
			caller: "📟 Server.testSendFunction()",
			action: "getTallyUser",
 			url: "/user/getTallyUser",
 			method: "GET",
 			data: {}
 		}).then(response => {
 			console.log("send() /user/getTallyUser response =", response);
 		});

 		// update tally user - this one fails w/o data
 		send({
			caller: "📟 Server.testSendFunction()",
			action: "updateTallyUser",
 			url: "/user/updateTallyUser",
 			method: "PUT",
 			data: {}
 		}).then(response => {
 			console.log("send() /user/updateTallyUser response =", response);
 		});
 	}
	// setTimeout(testSendFunction, 1500);

	//
	// /**
	//  *  Get latest T.tally_user data from API
	//  */
	// async function getTallyUser(auto = false) {
	// 	T.tally_meta = store("tally_meta");
	// 	let _startTimeMillis = new Date().getTime(),
	// 		_url = T.tally_meta.env.api + "/user/getTallyUser",
	// 		serverResponseMillis = -1,
	// 		userLoggedInResponse = false;
	//
	// 	// // update userOnline status
	// 	// T.tally_meta.userOnline = navigator.onLine;
	// 	//
	// 	// // 1. return early if user !online
	// 	// if (!T.tally_meta.userOnline) {
	// 	// 	if (DEBUG) console.warn("📟 Server.getTallyUser() [1.1] *** USER NOT ONLINE ***");
	// 	// 	// therefore we can't rely on any other connections either so let them be
	// 	// }
	// 	//
	// 	// // 2. return early if !server
	// 	// else if (!T.tally_meta.serverOnline) {
	// 	// 	if (DEBUG) console.warn("📟 Server.getTallyUser() [2.1] *** SERVER NOT ONLINE ***");
	// 	// }
	// 	//
	// 	// // 3. check if user logged in
	// 	// else {
	// 	// 	// get response
	// 	// 	userLoggedInResponse = await fetch(_url, {
	// 	// 			credentials: 'include'
	// 	// 		})
	// 			// .then((response) => {
	// 			// 	if (DEBUG) console.log("📟 Server.getTallyUser() [3.1] response.status =", response.status);
	// 			//
	// 			// 	// if response then server is online
	// 			// 	if (response) T.tally_meta.serverOnline = true;
	// 			//
	// 			// 	// go to next .then()
	// 			// 	if (response.status === 200) return response.json();
	// 			// 	else if (response.status === 401) return false;
	// 			//
	// 			// 	// go straight to .catch()
	// 			// 	else throw new Error('Something went wrong');
	// 			// // })
	// 			// .then(async (result) => {
	// 			//
	// 			// 	// make sure user was returned
	// 			// 	if (result && result.username) {
	// 			// 		if (DEBUG) console.log("📟 Server.getTallyUser() [3.2] SUCCESS result.username = %c" + JSON.stringify(result.username), Debug.styles.greenbg);
	// 			//
	// 			// 		// merge attack data from server with T.tally_user data properties
	// 			// 		result.attacks = Server.mergeAttackDataFromServer(result.attacks);
	// 			// 		T.tally_user = result;
	// 			// 		store("tally_user", T.tally_user);
	// 			// 		// serverResponseMillis = new Date().getTime() - _startTimeMillis;
	// 			// 		return true;
	// 			// 	} else {
	// 			// 		if (DEBUG) console.warn("📟 Server.getTallyUser() [3.3] FAIL result.username = %c" + JSON.stringify(result.username), Debug.styles.redbg);
	// 			// 		return false;
	// 			// 	}
	// 			// })
	// 			// .catch((error) => {
	// 			// 	// user (or server) is not online
	// 			// 	if (DEBUG) console.warn("📟 Server.getTallyUser() [3.4] FAIL", _url, "😢 USER NOT LOGGED-IN", JSON.stringify(error), Debug.getCurrentDateStr());
	// 			// 	return false;
	// 			// });
	// 	}
	// 	// if (DEBUG) console.log("📟 Server.getTallyUser() [4.1] SAVING data");
	//
	//
	//
	//
	//
	//
	// 	// // save tally_meta
	// 	// T.tally_meta.userLoggedIn = userLoggedInResponse;
	// 	// // if connection failed
	// 	// if (!userLoggedInResponse) {
	// 	// 	// track failed attempts
	// 	// 	T.tally_meta.userLoggedInFailedAttempts++;
	// 	// } else {
	// 	// 	// reset
	// 	// 	T.tally_meta.userLoggedInFailedAttempts = 0;
	// 	// }
	//
	// 	// // save server status
	// 	// updateStatusSaveMeta({
	// 	// 	serverOnline: userLoggedInResponse,
	// 	// 	serverSecondsSinceLastChecked: 0,
	// 	// 	serverResponseMillis: serverResponseMillis
	// 	// });
	//
	//
	// 	// return status
	// 	return userLoggedInResponse;
	// }
	//
	//


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
				if (DEBUG) console.warn("📟 Server.returnTopMonsters() [1.1] *** USER NOT ONLINE ***");
				return false;
			}
			// 2. return early if !server
			else if (!T.tally_meta.serverOnline) {
				if (DEBUG) console.warn("📟 Server.returnTopMonsters() [1.2] *** SERVER NOT ONLINE ***");
				return false;
			}
			// 3. return early if !username
			else if (FS_Object.prop(T.tally_user.username) && T.tally_user.username === "") {
				if (DEBUG) console.warn("📟 Server.returnTopMonsters() [1.3] *** NO USERNAME ***");
				return false;
			}

			// returns true if all is good
			return $.ajax({
				type: "GET",
				url: T.tally_meta.env.api + "/monsters/" + T.tally_user.username,
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
				console.error("📟 Server.returnTopMonsters() [3] ERROR =", JSON.stringify(error));
				return false;
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
		send: send,
		canSendUpdate: canSendUpdate,
		checkIfUserOnline: checkIfUserOnline,
		//		checkIfOnline: checkIfOnline,
		startServerTimedEvents: startServerTimedEvents,
		updateStatusSaveMeta: updateStatusSaveMeta,
		returnTopMonsters: returnTopMonsters,
		// getTallyUser: getTallyUser,
		mergeAttackDataFromServer: mergeAttackDataFromServer
	};
}());



//
// /**
//  *	Chrome web request error handling
//  */
//
// // ::net errors
// // potentially use filters to isolate specific errors for Tally
// // > https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/webRequest/onErrorOccurred
// // --> https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/webRequest/RequestFilter
// // ----> https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/webRequest/ResourceType
// chrome.webRequest.onErrorOccurred.addListener(function(details) {
// 	console.error(Debug.getCurrentDateStr(), "onErrorOccurred", details);
//
// 	// connection refused: tally server did not respond (offline or busy)
// 	if (details.error === "net::ERR_CONNECTION_REFUSED" && details.url === T.tally_meta.env.api) {
// 		console.error("onErrorOccurred", "TALLY CANNOT CONNECT");
// 	}
//
//
// }, {
// 	urls: ["http://*/*", "https://*/*"]
// });
//
// // check for HTTP errors
// chrome.webRequest.onHeadersReceived.addListener(function(details) {
// 	// console.error("onHeadersReceived", details);
//
// 	var status = extractStatus(details.statusLine);
// 	if (!status) return;
// 	// if error code is 4** or 5**
// 	if (status.code.charAt(0) == '5' || status.code.charAt(0) == '4')
// 		console.error("onHeadersReceived", details);
// }, {
// 	urls: ["http://*/*", "https://*/*"]
// });
//
// // function handleNetworkError(details) {
// // 	console.error(details);
// // 	// console.error(Debug.getCurrentDateStr());
// // }
//
// /**
//  *	Extract status code/message
//  * 	'HTTP/1.1 200 OK' => { "code": 200, "message": "ok"}
//  */
// function extractStatus(line) {
// 	var match = line.match(/[^ ]* (\d{3}) (.*)/);
// 	if (match)
// 		return {
// 			code: match[1],
// 			message: match[2]
// 		};
// 	else return undefined;
// }
