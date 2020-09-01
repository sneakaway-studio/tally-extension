"use strict";

window.Listener = (function () {
	// PRIVATE

	let DEBUG = Debug.ALL.BackgroundListener;

	/*  Listener for messages in order to receive/pass data to contentscript.js
	 ******************************************************************************/

	chrome.runtime.onMessage.addListener(
		function (request, sender, sendResponse) {
			try {
				// if (DEBUG) console.log("👂🏼 Listener.addListener() onMessage.request =", JSON.stringify(request), sender, sendResponse);

				// needed for several conditions below
				let _tally_user = store("tally_user"),
					_tally_meta = store("tally_meta");


				/**
				 *	A generic server data grabber - currently in use for random urls only
				 */
				if (request.action == "getDataFromServer" && request.url) {
					// only connect if logged in
					if (!_tally_meta || !_tally_meta.userLoggedIn) {
						sendResponse({
							"action": request.action,
							"message": false
						});
						return false;
					}
					if (DEBUG) console.log("👂🏼 Listener.addListener() < getData [1]", request.name);

					// (attempt to) get data from server, response to callback
					$.ajax({
						type: "GET",
						url: _tally_meta.api + request.url,
						dataType: 'json'
					}).done(result => {
						if (DEBUG) console.log("👂🏼 Listener.getDataFromServer() > RESULT =", JSON.stringify(result));
						// reply to contentscript
						sendResponse({
							"action": request.action,
							"message": 1,
							"data": result
						});
					}).fail(err => {
						if (DEBUG) console.error("👂🏼 Listener.getDataFromServer() > RESULT =", JSON.stringify(err));
						// server might not be reachable
						Server.checkIfOnline();
						sendResponse({
							"action": request.action,
							"message": false
						});
					});

					// required so chrome knows this is asynchronous
					return true;
				}





				/*  GENERIC "GETTER" / "SETTER"
				 ******************************************************************************/

				// get data from background
				else if (request.action == "getData" && request.name) {
					// if (DEBUG) console.log("👂🏼 Listener.addListener() < getData [1]", request.name);
					// build response
					let resp = {
						"action": request.action,
						"message": 1,
						"data": store(request.name)
					};
					// if (DEBUG) console.log("👂🏼 Listener.addListener() > getData [2]", request.name, resp);
					// send
					sendResponse(resp);
				}
				// save data in background - used by popup, etc.
				if (request.action == "saveData" && request.name && request.data) {
					if (DEBUG) console.log("👂🏼 Listener.addListener() < saveData [1]", request.name);
					// save data
					let success = 0;
					if (store(request.name, request.data))
						success = 1;
					else
					if (DEBUG) console.error("👂🏼 Listener.addListener() > Could not save data", request);
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
				// saveOptions - called from popup
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


				// receive and log debug messages from content
				else if (request.action == "reportToAnalytics") {

					reportToAnalytics(request.report);

					sendResponse({
						"action": request.action,
						"message": 1
					});

					// required so chrome knows this is asynchronous
					return true;
				}





				// setBadgeText
				else if (request.action == "setBadgeText") {
					setBadgeText(request.data);
					sendResponse({
						"action": request.action,
						"message": 1
					});
				}


				// setBadgeText
				else if (request.action == "openPopup") {
					if (DEBUG) console.log("👂🏼 Listener.addListener() openPopup",
						"sender =", sender,
						"sender.tab =", sender.tab,
						"sender.tab.id =", sender.tab.id
					);
					openPopup(sender.tab.id);
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
					Background.runInstallChecks()
						.then(function (result) {
							if (DEBUG) console.log("👂🏼 Listener.addListener() > resetTallyUserFromServer [2.1] ", result);
							if (DEBUG) console.log(store("tally_user"));
							if (DEBUG) console.log("👂🏼 Listener.addListener() > resetTallyUserFromServer [2.2] ", result);

							// force reset
							_tally_meta.userLoggedIn = true;
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
				// - receive and reply to content with tally_user and tally_meta
				else if (request.action == "sendUpdateToBackground") {

					// default response
					let responseToContentScript = {
							"action": request.action,
							"message": false,
							"tally_user": _tally_user,
							"tally_meta": _tally_meta
						},
						_startTime = new Date().getTime(),
						serverResponseMillis = -1;


					// one day add logic to save data in bg here
					// ...


					if (!_tally_meta.userOnline) {
						console.warn("👂🏼 Listener.addListener() ! sendUpdateToBackground - USER OFFLINE");
						// reply to contentscript
						sendResponse(responseToContentScript);
					} else if (!_tally_meta.serverOnline) {
						console.warn("👂🏼 Listener.addListener() ! sendUpdateToBackground - SERVER OFFLINE");
						// reply to contentscript
						sendResponse(responseToContentScript);
					} else if (!_tally_meta.userLoggedIn) {
						console.warn("👂🏼 Listener.addListener() ! sendUpdateToBackground - USER NOT LOGGED-IN");
						// reply to contentscript
						sendResponse(responseToContentScript);
					} else {
						if (DEBUG) console.log("👂🏼 Listener.addListener() < sendUpdateToBackground", request.data);

						// (attempt to) send data to server, response to callback
						$.ajax({
							type: "PUT",
							url: _tally_meta.api + "/user/updateTallyUser",
							contentType: 'application/json', // content we are sending
							dataType: 'json',
							data: JSON.stringify(request.data)
						}).done(result => {
							// if tally_user returned
							if (result.username) {
								// result contains tally_user
								if (DEBUG) console.log("👂🏼 Listener.addListener() > sendUpdateToBackground, result.username = %c" +
									JSON.stringify(result.username), Debug.styles.greenbg);

								// merge attack data from server with game data properties
								result.attacks = Server.mergeAttackDataFromServer(result.attacks);
								// then send to .a
								_tally_meta.userLoggedIn = true;
								// response time
								serverResponseMillis = new Date().getTime() - _startTime;
								return true;
							} else {
								if (DEBUG) console.log("👂🏼 Listener.addListener() > sendUpdateToBackground, %cresult.username", Debug.styles.redbg);
								// else update tally_meta
								_tally_meta.userLoggedIn = false;
								return false;
							}
						}).fail(err => {
							if (DEBUG) console.warn("👂🏼 Listener.addListener() > sendUpdateToBackground - FAIL result.username = %c", Debug.styles.redbg);
							_tally_meta.userLoggedIn = false;
						}).always(result => {
							if (DEBUG) console.log("👂🏼 Listener.addListener() > sendUpdateToBackground - ALWAYS - result =", result);
							// save result
							store("tally_user", result);
							store("tally_meta", _tally_meta);

							// reset time since last checked server
							_tally_meta.serverTimeSinceLastCheck = 0;
							// update last time checked
							_tally_meta.serverTimeOfLastCheckMillis = new Date().getTime();
							// update server response time
							_tally_meta.serverResponseMillis = serverResponseMillis;
							// save
							store('tally_meta', _tally_meta);

							responseToContentScript.message = _tally_meta.userLoggedIn;
							responseToContentScript.tally_meta = _tally_meta;
							responseToContentScript.tally_user = result;

							// reply to contentscript with updated tally_user
							sendResponse(responseToContentScript);
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

				// for whole function?
				// required so chrome knows this is asynchronous
				return true;

			} catch (err) {
				console.error(err);
			}
		}
	);






	/**
	 *  Send event to Google Analytics
	 * 	https://blog.mozilla.org/addons/2016/05/31/using-google-analytics-in-extensions/
	 * 	https://developers.google.com/analytics/devguides/collection/protocol/v1/devguide
	 */
	function reportToAnalytics(obj) {
		try {
			// don't run if not online
			if (!navigator.onLine) return;

			let request = new XMLHttpRequest();
			let message =
				// required
				"v=1" + // version
				"&tid=" + "UA-102267502-5" + // Tracking ID / Property ID
				"&cid= " + "tally-extension" + // Anonymous Client ID
				"&aip=1" + // anonymize the sender IP
				"&ds=extension"; // data source

			if (obj.type == "pageview") {
				message += "&t=pageview" + // Hit Type (required)
					"&dl=" + obj.url + // Document url.
					"&dt=" + obj.title; // e.g. Home
			}
			if (obj.type == "event") {
				message += "&t=event" + // Event hit type (required)
					"&ec=" + obj.cat + // Event Category. Required. e.g. video
					"&ea=" + obj.action + // Event Action. Required. e.g. play
					"&el=" + obj.label + // Event label e.g. holiday
					"&ev=300" + obj.val; // Event value.
			}



			request.open("POST", "https://www.google-analytics.com/collect", true);
			request.send(message);


		} catch (err) {
			console.error(err);
		}
	}



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

	// attempt to open options
	// disabled - troubled getting this to work
	function openPopup(tabId) {
		try {
			let tab = null;

			// if (DEBUG) console.log("👂🏼 Listener.openPopup() [1] tabId =", tabId);
			//
			// // get current page
			// chrome.tabs.query({
			// 	active: true,
			// 	currentWindow: true
			// }, function (tabs) {
			// 	tab = tabs[0];
			// 	if (DEBUG) console.log("👂🏼 Listener.openPopup() [1] tab =", tab);
			//
			// 	chrome.browserAction.setPopup({
			// 		tabId: tab.id,
			// 		popup: "assets/pages/popup/popup.html"
			// 	});
			// });

			chrome.browserAction.getPopup({}, function (result) {
				if (DEBUG) console.log("👂🏼 Listener.getPopup() [1] result =", result);
				chrome.browserAction.setPopup({
					popup: result
				});
			});

		} catch (err) {
			console.error(err);
		}
	}


	// PUBLIC
	return {

	};
}());
