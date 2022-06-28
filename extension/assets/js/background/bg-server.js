self.Server = (function() {
	// PRIVATE
	let DEBUG = Debug.ALL.BackgroundServer;


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
			const log = "📟 Server.send()";
			if (DEBUG) console.log(log, "[1.0] params =", params);


			// S.log();

			// 1. create request from params

			let _url = T.tally_meta.env.api + params.url,
				_startTimeMillis = new Date().getTime(),
				_serverResponseMillis = -1,
				responseSuccess = false,
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
				if (DEBUG) console.warn(log, "[1.1] ❌ USER NOT ONLINE ");
			}

			// 2.2 if userOnline, proceed
			else {
				if (DEBUG) console.log(log, "[1.2] request =", request);

				responseSuccess = await fetch(_url, request)
					.then((response) => {
						if (DEBUG) console.log(log, "[2.0] response =", response);
						if (DEBUG) console.log(log, "[2.1] response.status =", response.status);

						// if response received then we know server online
						if (response || response.status > 0) {
							T.tally_meta.serverOnline = true;
							T.tally_meta.serverOnlineFailedAttempts = 0;
						}

						// 200–299 = success, parse json response and go to next .then()
						if (response.ok) {
							return response.json();
						}
						// 401 = unauthorized (not logged in)
						else if (response.status === 401) {
							// save status
							T.tally_meta.userLoggedIn = false;
							T.tally_meta.userLoggedInFailedAttempts++;
							if (DEBUG) console.log(log, "[2.2] T.tally_meta =", T.tally_meta);
							return false;
						}
						// go straight to .catch()
						else throw new Error('Something went wrong');
					})
					.then(async (result) => {
						if (DEBUG) console.log(log, "[3.0] result =", result);
						// if result then connection to server was successful
						if (result) {
							if (DEBUG) console.log(log, "[3.1] SUCCESS result =", result);

							// if username present it is a tallyUser object and user is also loggedIn
							if (result.username) {
								if (DEBUG) console.log(`${log} [3.2] SUCCESS result.username=%c${result.username}`, Debug.styles.greenbg);

								// if a username is present then reset
								T.tally_meta.userLoggedIn = true;
								T.tally_meta.userLoggedInFailedAttempts = 0;

								// merge attack data from server with T.tally_user data properties
								result.attacks = Server.mergeAttackDataFromServer(result.attacks);
								T.tally_user = result;
								// store tally_user from response
								await S.getSet("tally_user", T.tally_user);
								return true;
							}
							// if no username while trying an endpoint that required authentication then server failed silently
							else if (params.action === "getTallyUser" || params.action === "updateTallyUser") {
								if (DEBUG) console.log(`${log} [3.3] ❌ %cresult.username`, Debug.styles.redbg);

								// track failed attempts
								T.tally_meta.userLoggedIn = false;
								T.tally_meta.userLoggedInFailedAttempts++;
								return false;
							}
						} else {
							if (DEBUG) console.log(`${log} [4.3] ❌ %cresult.username`, Debug.styles.redbg);
							// if connected to server but no result then something must be wrong with server
							throw new Error('Something went wrong');
						}
					})
					.catch((err) => {
						if (DEBUG) console.error(log, "[4.0] ❌ NO RESPONSE FROM SERVER 😢", _url, "err = ", JSON.stringify(err), Debug.getCurrentDateStr());

						// if no response from server then it is not online, and therefore not loggedIn
						// T.tally_meta.serverOnline = false;
						// T.tally_meta.serverOnlineFailedAttempts++;
						T.tally_meta.userLoggedIn = false;
						return false;
					});

				// reset time since last checked server
				T.tally_meta.serverSecondsSinceLastChecked = 0;
				// update last time checked
				T.tally_meta.serverTimestampFromLastCheck = new Date().getTime();
				// update server response time
				T.tally_meta.serverResponseMillis = T.tally_meta.serverTimestampFromLastCheck - _startTimeMillis;
			}

			if (DEBUG) console.log(log, "[5] RETURN responseSuccess =", responseSuccess, "AFTER send()",
				"\n    T.tally_meta.userOnline =", T.tally_meta.userOnline,
				"\n    T.tally_meta.serverOnline =", T.tally_meta.serverOnline,
				"\n    T.tally_meta.userLoggedIn =", T.tally_meta.userLoggedIn,
				"\n    T.tally_meta.install.loginPrompts.startScreen =", T.tally_meta.install.loginPrompts.startScreen,
				"\n    T.tally_meta.install.loginPrompts.dialogue =", T.tally_meta.install.loginPrompts.dialogue,
				"\n    T.tally_meta.serverOnlineFailedAttempts =", T.tally_meta.serverOnlineFailedAttempts,
				"\n    T.tally_meta.userLoggedInFailedAttempts =", T.tally_meta.userLoggedInFailedAttempts,
				"\n    T.tally_meta.serverSecondsSinceLastChecked =", T.tally_meta.serverSecondsSinceLastChecked,
				"\n    T.tally_meta.serverResponseMillis =", T.tally_meta.serverResponseMillis,
				"");

			// store object
			await S.getSet("tally_meta", T.tally_meta);
			// return to calling function
			return responseSuccess;
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
		}).then(responseSuccess => {
			console.log("send() / responseSuccess =", responseSuccess);
		});

		// get tally user
		send({
			caller: "📟 Server.testSendFunction()",
			action: "getTallyUser",
			url: "/user/getTallyUser",
			method: "GET",
			data: {}
		}).then(responseSuccess => {
			console.log("send() /user/getTallyUser responseSuccess =", responseSuccess);
		});

		// update tally user - this one fails w/o data
		send({
			caller: "📟 Server.testSendFunction()",
			action: "updateTallyUser",
			url: "/user/updateTallyUser",
			method: "PUT",
			data: {}
		}).then(responseSuccess => {
			console.log("send() /user/updateTallyUser responseSuccess =", responseSuccess);
		});
	}
	// setTimeout(testSendFunction, 1500);




	/**
	 *  Refresh T.tally_top_monsters from API server
	 */
	async function saveTopMonstersFromApi() {
		try {

			// if (DEBUG) console.log("📟 Server.saveTopMonstersFromApi() [1]", T.tally_meta, T.tally_user);

			// 1. return early if user !online
			if (!T.tally_meta.userOnline) {
				if (DEBUG) console.warn("📟 Server.saveTopMonstersFromApi() [1.1] *** USER NOT ONLINE ***");
				return false;
			}
			// 2. return early if !server
			else if (!T.tally_meta.serverOnline) {
				if (DEBUG) console.warn("📟 Server.saveTopMonstersFromApi() [1.2] *** SERVER NOT ONLINE ***");
				return false;
			}
			// 3. return early if !username
			else if (FS_Object.prop(T.tally_user.username) && T.tally_user.username === "") {
				if (DEBUG) console.warn("📟 Server.saveTopMonstersFromApi() [1.3] *** NO USERNAME ***");
				return false;
			}

			// returns true if all is good
			fetch(T.tally_meta.env.api + "/monsters/" + T.tally_user.username)
				.then(handleFetchErrors)
				.then(response => response.json())
				.then(result => {
					console.log(result);

					// treat all server data as master
					// if (DEBUG) console.log("📟 Server.saveTopMonstersFromApi() [1] RESULT =", JSON.stringify(result));
					T.tally_top_monsters = FS_Object.convertArrayToObject(result.topMonsters, "mid");
					// if (DEBUG) console.log("📟 Server.saveTopMonstersFromApi() [2] RESULT =", JSON.stringify(T.tally_top_monsters));
					// store top monsters
					S.getSet("tally_top_monsters", T.tally_top_monsters);
					return true;
				}).catch(error => {
					console.error("📟 Server.saveTopMonstersFromApi() [3] ERROR =", JSON.stringify(error));
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
					// remove fields
					delete attackData.artist;
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
		saveTopMonstersFromApi: saveTopMonstersFromApi,
		mergeAttackDataFromServer: mergeAttackDataFromServer
	};
}());

// https://www.tjvantoll.com/2015/09/13/fetch-and-errors/
function handleFetchErrors(response) {
	if (!response.ok) {
		throw Error(response.statusText);
	}
	return response;
}





/**
 *	Chrome web request error handling - good for testing server connection
 *  1. enable "webRequest", in manifest.permission
 * 	2. uncomment
 */

// ::net errors
// potentially use filters to isolate specific errors for Tally
// > https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/webRequest/onErrorOccurred
// --> https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/webRequest/RequestFilter
// ----> https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/webRequest/ResourceType
// chrome.webRequest.onErrorOccurred.addListener(function(details) {
// 	console.error(Debug.getCurrentDateStr(), "onErrorOccurred", details);
//
// 	// connection refused: tally server did not respond (offline or busy)
// 	if (details.error === "net::ERR_CONNECTION_REFUSED" && details.url === T.tally_meta.env.api) {
// 		console.error("onErrorOccurred", "TALLY CANNOT CONNECT");
// 	}
// }, {
// 	urls: ["http://*/*", "https://*/*"]
// });
//
// // check for HTTP errors
// chrome.webRequest.onHeadersReceived.addListener(function(details) {
// 	// console.error(Debug.getCurrentDateStr(), "onHeadersReceived", details);
//
// 	var status = extractStatus(details.statusLine);
// 	if (!status) return;
// 	// if error code is 4** or 5**
// 	if (status.code.charAt(0) == '5' || status.code.charAt(0) == '4')
// 		console.error(Debug.getCurrentDateStr(), "onHeadersReceived", details);
// }, {
// 	urls: ["http://*/*", "https://*/*"]
// });

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
