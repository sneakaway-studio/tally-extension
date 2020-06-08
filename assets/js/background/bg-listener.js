"use strict";

window.Listener = (function() {
	// PRIVATE

	let DEBUG = true;

	/*  Listener for messages in order to receive/pass data to contentscript.js
	 ******************************************************************************/

	chrome.runtime.onMessage.addListener(
		function(request, sender, sendResponse) {
			try {
				// console.log("👂🏼 Listener.addListener() onMessage.request =", JSON.stringify(request), sender, sendResponse);



				/**
				 *	A generic server data grabber - currently in use for random urls only
				 */
				if (request.action == "getDataFromServer" && request.url) {
					console.log("👂🏼 Listener.addListener() < getData 1", request.name);

					// add token
					let _tally_meta = store("tally_meta"),
						_tally_secret = store("tally_secret");
					request.token = _tally_secret.token;

					// (attempt to) get data from server, response to callback
					$.ajax({
						type: "GET",
						url: _tally_meta.api + request.url,
						contentType: 'application/json',
						dataType: 'json',
						data: JSON.stringify(request.data)
					}).done(result => {
						console.log("👂🏼 Listener.getDataFromServer() > RESULT =", JSON.stringify(result));
						// reply to contentscript
						sendResponse({
							"action": request.action,
							"message": 1,
							"data": result
						});
					}).fail(err => {
						console.error("👂🏼 Listener.getDataFromServer() > RESULT =", JSON.stringify(err));
						// server might not be reachable
						Server.checkIfOnline();
						sendResponse({
							"action": request.action,
							"message": 0
						});
					});

					// required so chrome knows this is asynchronous
					return true;
				}





				/*  GENERIC "GETTER" / "SETTER"
				 ******************************************************************************/

				// get data from background
				else if (request.action == "getData" && request.name) {
					console.log("👂🏼 Listener.addListener() < getData 1", request.name);
					// build response
					let resp = {
						"action": request.action,
						"message": 1,
						"data": store(request.name)
					};
					console.log("👂🏼 Listener.addListener() > getData 2", request.name, resp);
					// send
					sendResponse(resp);
				}
				// save data in background
				if (request.action == "saveData" && request.name && request.data) {
					console.log("👂🏼 Listener.addListener() < saveData", request.name, request.data);
					// save data
					let success = 0;
					if (store(request.name, request.data))
						success = 1;
					else
						console.error("👂🏼 Listener.addListener() > Could not save data", request);
					// send response
					sendResponse({
						"action": request.action,
						"message": success
					});
				}




				/*  OPTIONS MANAGEMENT (FROM POPUP)
				 ******************************************************************************/

				// getOptions
				else if (request.action == "getOptions") {
					sendResponse({
						"action": request.action,
						"data": store("tally_options")
					});
				}
				// saveOptions
				else if (request.action == "saveOptions") {
					let options = Install.setOptions(request.data);
					store("tally_options", options); // store in localStorage
					sendResponse({
						"action": request.action,
						"message": 1
					}); // send success response
				}
				// resetOptions (same as creating new options)
				else if (request.action == "resetOptions") {
					store("tally_options", Install.createOptions());
					sendResponse({
						"action": request.action,
						"message": 1
					}); // send success response
				}


				/*  FOR PROMISES
				 ******************************************************************************/

				// getUser (also used by popup)
				else if (request.action == "getUser") {
					sendResponse({
						"action": request.action,
						"data": store("tally_user") || {}
					});
				}
				// getOptions
				else if (request.action == "getOptions") {
					sendResponse({
						"action": request.action,
						"data": store("tally_options") || {}
					});
				}
				// getMeta
				else if (request.action == "getMeta") {
					sendResponse({
						"action": request.action,
						"data": store("tally_meta") || {}
					});
				}
				// getNearbyMonsters
				else if (request.action == "getNearbyMonsters") {
					sendResponse({
						"action": request.action,
						"data": store("tally_nearby_monsters") || {}
					});
				}
				// getStats
				else if (request.action == "getStats") {
					sendResponse({
						"action": request.action,
						"data": store("tally_stats") || {}
					});
				}
				// getTopMonstersPromise
				else if (request.action == "getTopMonstersPromise") {
					sendResponse({
						"action": request.action,
						"data": store("tally_top_monsters") || {}
					});
				}





				/*  CUSTOM FUNCTIONS
				 ******************************************************************************/

				// // launchStartScreen
				// else if (request.action == "launchStartScreen") {
				// 	Install.launchStartScreen();
				// 	sendResponse({
				// 		"action": request.action,
				// 		"message": 1
				// 	});
				// }




				// receive and log debug messages from content
				else if (request.action == "sendBackgroundDebugMessage") {
					Background.dataReportHeader("🐞 " + request.caller, "<", "before");
					if (DEBUG) console.log("url =", request.str);
					Background.dataReportHeader("/ 🐞 " + request.caller, ">", "after");
					sendResponse({
						"action": request.action,
						"message": 1
					});
				}


				// setBadgeText
				else if (request.action == "setBadgeText") {
					setBadgeText(request.data);
					sendResponse({
						"action": request.action,
						"message": 1
					});
				}

				// openPage
				else if (request.action == "openPage") {
					if (request.url)
						chrome.tabs.create({
							url: request.url
						});
					sendResponse({
						"action": request.action,
						"data": {}
					});
				}



				/*  DATA MANAGEMENT
				 ******************************************************************************/

				// saveToken
				// - called from content script
				// - if token is new resets all game data
				else if (request.action == "saveToken") {

					// get current token data
					let _tally_secret = store("tally_secret"),
						_tally_meta = store("tally_meta");

					// if they don't match
					if (_tally_secret.token != request.data.token) {
						if (DEBUG) console.log("👂🏼 Listener.addListener() < saveToken 🔑 FOUND [1]", request.data);

						// save new token and tokenExpires
						_tally_secret.token = request.data.token;
						_tally_secret.tokenExpires = request.data.tokenExpires;
						store("tally_secret", _tally_secret);

						// (re)start app to pull in data
						Background.runStartChecks()
							.then(function(result) {
								if (DEBUG) console.log("👂🏼 Listener.addListener() > saveToken 🔑 NEW [2] ", result);
								console.log(store("tally_user"));
								if (DEBUG) console.log("👂🏼 Listener.addListener() > saveToken 🔑 NEW [3] ", result);
								// send response with latest
								sendResponse({
									"action": request.action,
									"tally_user": store("tally_user"),
									"tally_options": store("tally_options"),
									"tally_meta": store("tally_meta"),
									"message": "new"
								});
							});
					} else if (_tally_secret.token === request.data.token) {
						if (DEBUG) console.log("👂🏼 Listener.addListener() > saveToken 🔑 SAME", request.data);
						// they are the same
						sendResponse({
							"action": request.action,
							"message": "same"
						});
					}
					// required so chrome knows this is asynchronous
					return true;
				}


				// resetTallyUser
				// - get latest data from server; run start checks
				// - a.k.a. "resetUser", "resetGame"
				else if (request.action == "resetTallyUser") {
					if (DEBUG) console.log("👂🏼 Listener.addListener() < resetTallyUser [1] ");

					// (re)start app to pull in data
					Background.runStartChecks()
						.then(function(result) {
							if (DEBUG) console.log("👂🏼 Listener.addListener() > resetTallyUser [2] ", result);
							if (DEBUG) console.log(store("tally_user"));
							if (DEBUG) console.log("👂🏼 Listener.addListener() > resetTallyUser [3] ", result);
							// send response with latest
							sendResponse({
								"action": request.action,
								"tally_user": store("tally_user"),
								"tally_options": store("tally_options"),
								"tally_meta": store("tally_meta"),
								"message": "new"
							});
						});

					// required so chrome knows this is asynchronous
					return true;
				}





				// sendUpdateToBackground
				// - receive and save score, event, page, etc. data in background
				// - if server online and token good then send to server
				// - receive and reply to content with T.tally_user
				else if (request.action == "sendUpdateToBackground") {
					// if (DEBUG) console.log("👂🏼 Listener.addListener() < sendUpdateToBackground", JSON.stringify(request.data));

					let _tally_meta = store("tally_meta"),
						_tally_secret = store("tally_secret");

					// if there is no token or server is down then we are just saving in background
					if (!_tally_secret.token || !_tally_meta.server.online) {

						console.warn("👂🏼 Listener.addListener() ! sendUpdateToBackground - NO TOKEN OR SERVER OFFLINE", _tally_secret);

						// every once in a while check again
						if (Math.random() > 0.3) Server.checkIfOnline();

						// reply to contentscript with updated T.tally_user
						sendResponse({
							"action": request.action,
							"message": 1,
							"tally_user": store("tally_user")
						});
					}
					else {

					// otherwise add token
					request.data.token = _tally_secret.token;

					// and (attempt to) send data to server, response to callback
					$.ajax({
						type: "PUT",
						url: _tally_meta.api + "/user/extensionUpdate",
						contentType: 'application/json',
						dataType: 'json',
						data: JSON.stringify(request.data)
					}).done(result => {
						// result contains T.tally_user
						if (DEBUG) console.log("👂🏼 Listener.addListener() > sendUpdateToBackground - DONE =", result);

						// merge attack data from server with game data properties
						result.attacks = Server.mergeAttackDataFromServer(result.attacks);
						// store result
						store("tally_user", result);
						// reply to contentscript with updated T.tally_user
						sendResponse({
							"action": request.action,
							"message": 1,
							"tally_user": result
						});
					}).fail(err => {
						console.warn("👂🏼 Listener.addListener() > sendUpdateToBackground - FAIL =", JSON.stringify(err));
						// server might not be reachable
						Server.checkIfOnline();
						sendResponse({
							"action": request.action,
							"message": 0
						});
					});
					}

					// required so chrome knows this is asynchronous
					return true;
				}




				// default to resolve promise
				else {
					sendResponse({
						"action": request.action,
						"data": {}
					});
				}
			} catch (err) {
				console.error(err);
			}
		}
	);



	/**
	 *  Update badge text to show tracker number
	 */
	function setBadgeText(_text) {
		try {
			if (!_text || _text == '') return;
			// show tracker numbers in badge
			chrome.browserAction.setBadgeBackgroundColor({
				color: [255, 108, 0, 255]
			});
			chrome.browserAction.setBadgeText({
				text: "" + _text
			});
		} catch (err) {
			console.error(err);
		}
	}


	// PUBLIC
	return {

	};
}());
