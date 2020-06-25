"use strict";

window.Listener = (function () {
	// PRIVATE

	let DEBUG = true;

	/*  Listener for messages in order to receive/pass data to contentscript.js
	 ******************************************************************************/

	chrome.runtime.onMessage.addListener(
		function (request, sender, sendResponse) {
			try {
				// console.log("👂🏼 Listener.addListener() onMessage.request =", JSON.stringify(request), sender, sendResponse);

				// needed for several conditions below
				let _tally_meta = store("tally_meta");


				/**
				 *	A generic server data grabber - currently in use for random urls only
				 */
				if (request.action == "getDataFromServer" && request.url) {
					console.log("👂🏼 Listener.addListener() < getData 1", request.name);

					// (attempt to) get data from server, response to callback
					$.ajax({
						type: "GET",
						url: _tally_meta.api + request.url,
						dataType: 'json'
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
					// console.log("👂🏼 Listener.addListener() < getData [1]", request.name);
					// build response
					let resp = {
						"action": request.action,
						"message": 1,
						"data": store(request.name)
					};
					console.log("👂🏼 Listener.addListener() > getData [2]", request.name, resp);
					// send
					sendResponse(resp);
				}
				// save data in background
				if (request.action == "saveData" && request.name && request.data) {
					console.log("👂🏼 Listener.addListener() < saveData [1]", request.name, request.data);
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

				// receive and log debug messages from content
				else if (request.action == "sendBackgroundDebugMessage") {
					Background.dataReportHeader("🗜️ " + request.caller, "<", "before");
					if (DEBUG) console.log("url =", request.str);
					Background.dataReportHeader("/ 🗜️ " + request.caller, ">", "after");
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
 

				// resetTallyUserFromServer
				// - called when user is logging in
				// - get latest data from server; run start checks
				// - a.k.a. "resetUser", "resetGame"
				else if (request.action == "resetTallyUserFromServer") {
					if (DEBUG) console.log("👂🏼 Listener.addListener() < resetTallyUserFromServer [1] ");

					// (re)start app to pull in data, run checks, and return control back to content
					Background.runStartChecks()
						.then(function (result) {
							if (DEBUG) console.log("👂🏼 Listener.addListener() > resetTallyUserFromServer [2.1] ", result);
							if (DEBUG) console.log(store("tally_user"));
							if (DEBUG) console.log("👂🏼 Listener.addListener() > resetTallyUserFromServer [2.2] ", result);

							// force reset
							_tally_meta.userLoggedIn = 1;
							store("tally_meta", _tally_meta);

							// send response with latest
							sendResponse({
								"action": request.action,
								"tally_user": store("tally_user"),
								"tally_options": store("tally_options"),
								"tally_meta": store("tally_meta"),
								"tally_nearby_monsters": store("tally_nearby_monsters"),
								"tally_top_monsters": store("tally_top_monsters"),
								"tally_stats": store("tally_stats"),
								"message": 1
							});
						}).catch(function (err) {
							if (DEBUG) console.log("👂🏼 Listener.addListener() > resetTallyUserFromServer [3.1] ", result);

						});

					// required so chrome knows this is asynchronous
					return true;
				}





				// sendUpdateToBackground
				// - receive and save score, event, page, etc. data in background
				// - if server online and account good then send to server
				// - receive and reply to content with T.tally_user only
				else if (request.action == "sendUpdateToBackground") {
					// if (DEBUG) console.log("👂🏼 Listener.addListener() < sendUpdateToBackground", JSON.stringify(request.data));

					// if user is not logged-in or server is down then we are just saving in background
					if (!_tally_meta.userLoggedIn || !_tally_meta.server.online) {

						console.warn("👂🏼 Listener.addListener() ! sendUpdateToBackground - NO ACCOUNT OR SERVER OFFLINE");

						// every once in a while check again
						if (Math.random() > 0.5) Server.checkIfOnline();

						// reply to contentscript with updated T.tally_user
						sendResponse({
							"action": request.action,
							"message": 1,
							"tally_user": store("tally_user")
						});
					} else {

						// and (attempt to) send data to server, response to callback
						$.ajax({
							type: "PUT",
							url: _tally_meta.api + "/user/updateTallyUser",
							contentType: 'application/json', // content we are sending
							dataType: 'json',
							data: JSON.stringify(request.data)
						}).done(result => {
							// result contains T.tally_user
							if (DEBUG) console.log("👂🏼 Listener.addListener() > sendUpdateToBackground - DONE =", result);

							// if tally_user returned
							if (result.username) {
								// merge attack data from server with game data properties
								result.attacks = Server.mergeAttackDataFromServer(result.attacks);
								// store result
								store("tally_user", result);
							} else {
								// else update tally_meta
								_tally_meta.userLoggedIn = 0;
								store("tally_meta", _tally_meta);
							}

							// reply to contentscript with updated T.tally_user
							sendResponse({
								"action": request.action,
								"message": _tally_meta.userLoggedIn,
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
