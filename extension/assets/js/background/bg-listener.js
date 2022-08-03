self.Listener = (function() {
	// PRIVATE

	let DEBUG = Debug.ALL.BackgroundListener;
	// DEBUG = true;

	/*  Listener for messages in order to receive/pass data to contentscript.js
	 ******************************************************************************/

	chrome.runtime.onMessage.addListener(
		function(request, sender, sendResponse) {
			try {
				// if (DEBUG) console.log("👂🏼 Listener.onMessage() [1.0] request =", JSON.stringify(request), sender, sendResponse);
				// if (DEBUG) console.log("👂🏼 Listener.onMessage() [1.1]", request.action, request.name);



				// async IIFE wrapper to be able to delay response to ...
				// - process data
				// - communicate with server
				// - get / set local storage
				// - all of the above
				// - see also: https://developer.mozilla.org/en-US/docs/Glossary/IIFE
				(async () => {

					// needed for several conditions below, but I think it's already been updated
					T.tally_user = await S.getSet("tally_user");
					T.tally_meta = await S.getSet("tally_meta");
					// console.log("👂🏼 Listener.onMessage() T.tally_user [2.0]", T.tally_user);
					// console.log("👂🏼 Listener.onMessage() T.tally_meta [2.1]", T.tally_meta);

					// test
					// T.tally_options = await S.getSet("tally_options");
					// console.log("👂🏼 Listener.onMessage() T.tally_options [2.2]", T.tally_options);




					/*  GENERIC "GETTER" / "SETTER"
					 ******************************************************************************/

					// get data from background
					if (request.action == "getData" && request.name) {
						if (DEBUG) console.log("👂🏼 Listener.onMessage() < getData [1]", request.name);

						// build response
						let resp = {
							"action": request.action,
							"message": 1,
							"data": T[request.name]
						};
						if (DEBUG) console.log("👂🏼 Listener.onMessage() > getData [2]", request.name, resp);
						// send
						sendResponse(resp);
					}

					// save data in background - used by popup, etc.
					if (request.action == "saveData" && request.name && request.data) {
						if (DEBUG) console.log("👂🏼 Listener.onMessage() < saveData [1]", request.name);
						// save data
						let success = 0;
						let result = await S.getSet(request.name, request.data);
						console.log("👂🏼 Listener.onMessage() > result", result);
						if (result)
							success = 1;
						else {
							console.error("👂🏼 Listener.onMessage() > Could not save data", request);
						}
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
							"data": await S.getSet("tally_options")
						});
					}
					// saveOptions - called from popup
					else if (request.action == "saveOptions") {
						let options = T.updateOptionsFromGameMode(request.data);
						await S.getSet("tally_options", options); // store in localStorage
						sendResponse({
							"action": request.action,
							"message": 1
						}); // send success response
					}
					// resetOptions (same as creating new options)
					else if (request.action == "resetOptions") {
						await S.getSet("tally_options", Install.createOptions());
						sendResponse({
							"action": request.action,
							"data": await S.getSet("tally_options"),
							"message": 1
						}); // send success response
					}


					/*  FOR PROMISES
					 ******************************************************************************/

					// getUser (also used by popup)
					else if (request.action == "getUser") {
						sendResponse({
							"action": request.action,
							"data": await S.getSet("tally_user") || {}
						});
					}
					// getOptions
					else if (request.action == "getOptions") {
						sendResponse({
							"action": request.action,
							"data": await S.getSet("tally_options") || {}
						});
					}
					// getMeta
					else if (request.action == "getMeta") {
						sendResponse({
							"action": request.action,
							"data": await S.getSet("tally_meta") || {}
						});
					}
					// getNearbyMonsters
					else if (request.action == "getNearbyMonsters") {
						sendResponse({
							"action": request.action,
							"data": await S.getSet("tally_nearby_monsters") || {}
						});
					}
					// getTagMatches
					else if (request.action == "getTagMatches") {
						sendResponse({
							"action": request.action,
							"data": await S.getSet("tally_tag_matches") || {}
						});
					}
					// getStats
					else if (request.action == "getStats") {
						sendResponse({
							"action": request.action,
							"data": await S.getSet("tally_stats") || {}
						});
					}
					// getTopMonstersPromise
					else if (request.action == "getTopMonstersPromise") {
						sendResponse({
							"action": request.action,
							"data": await S.getSet("tally_top_monsters") || {}
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
						if (DEBUG) console.log("👂🏼 Listener.onMessage() < resetTallyUserFromServer [1] ");

						// (re)start app to pull in data, run checks, and return control back to content
						Background.runInstallChecks()
							.then(async function(result) {
								if (DEBUG) console.log("👂🏼 Listener.onMessage() > resetTallyUserFromServer [2.1] ", result);
								// if (DEBUG) console.log(await S.getSet("tally_user"));
								if (DEBUG) console.log("👂🏼 Listener.onMessage() > resetTallyUserFromServer [2.2] ", result);

								// force reset
								T.tally_meta.userLoggedIn = true;
								await S.getSet("tally_meta", T.tally_meta);

								// send response with latest
								sendResponse({
									"action": request.action,
									"tally_user": await S.getSet("tally_user"),
									"tally_options": await S.getSet("tally_options"),
									"tally_meta": await S.getSet("tally_meta"),
									"tally_nearby_monsters": await S.getSet("tally_nearby_monsters"),
									"tally_tag_matches": await S.getSet("tally_tag_matches"),
									"tally_top_monsters": await S.getSet("tally_top_monsters"),
									"tally_stats": await S.getSet("tally_stats"),
									"message": 1
								});
							}).catch(function(err) {
								if (DEBUG) console.error("👂🏼 Listener.onMessage() > resetTallyUserFromServer [3.1] ", err);
							});

						// required so chrome knows this is asynchronous
						return true;
					}





					/**
					 *	A generic server data grabber. Used for:
					 * 	- getting random urls for "gallery mode"
					 */
					else if (request.action == "getDataFromServer" && request.url) {
						// only connect if logged in
						if (!T.tally_meta || !T.tally_meta.userLoggedIn) {
							sendResponse({
								"action": request.action,
								"message": false
							});
							return false;
						}
						// if (DEBUG) console.log("👂🏼 Listener.onMessage() < getData [1]", request.name);




						let serverRequest = {
							credentials: "include",
							method: "GET",
							headers: {
								'Content-Type': 'application/json'
							}
						};
						await fetch(T.tally_meta.env.api + request.url, serverRequest)
							.then(response => response.json())
							.then(result => {
								// if (DEBUG) console.log("👂🏼 Listener.getDataFromServer() > RESULT =", JSON.stringify(result));
								// reply to contentscript
								sendResponse({
									"action": request.action,
									"message": 1,
									"data": result
								});
							}).catch(err => {
								console.error("👂🏼 Listener.getDataFromServer() > RESULT =", JSON.stringify(err));
								sendResponse({
									"action": request.action,
									"message": false
								});
							});


						// // (attempt to) get data from server, response to callback
						// $.ajax({
						// 	type: "GET",
						// 	url: T.tally_meta.env.api + request.url,
						// 	dataType: 'json'
						// }).done(result => {
						// 	// if (DEBUG) console.log("👂🏼 Listener.getDataFromServer() > RESULT =", JSON.stringify(result));
						// 	// reply to contentscript
						// 	sendResponse({
						// 		"action": request.action,
						// 		"message": 1,
						// 		"data": result
						// 	});
						// }).fail(err => {
						// 	console.error("👂🏼 Listener.getDataFromServer() > RESULT =", JSON.stringify(err));
						// 	sendResponse({
						// 		"action": request.action,
						// 		"message": false
						// 	});
						// });

						// required so chrome knows this is asynchronous
						return true;
					}



					/**
					 *	updateTallyUser
					 * 	- receive and save score, event, page, etc. data in background
					 * 	Always
					 * 	- attempts to send to server, saves newest tally_user if successful
					 * 	- replies to content with tally_user and tally_meta
					 */
					else if (request.action == "updateTallyUser") {

						let _startTimeMillis = new Date().getTime(),
							responseToContentScript = {
								"action": request.action,
								"message": false, // default to fail
								"tally_user": await S.getSet("tally_user"),
								"tally_meta": await S.getSet("tally_meta")
							};

						// one day add logic to save data in bg here ...

						// params for send()
						let params = {
							caller: "👂🏼 Listener.updateTallyUser()",
							action: "updateTallyUser",
							method: "PUT",
							url: "/user/updateTallyUser",
							data: request.data
						};
						if (DEBUG) console.log("👂🏼 Listener.onMessage() [1] updateTallyUser params =", params);

						Server.send(params).then(responseSuccess => {
							if (DEBUG) console.log("👂🏼 Listener.onMessage() [2] updateTallyUser responseSuccess =", responseSuccess);
							// reply to contentscript with updated tally_user
							responseToContentScript.message = responseSuccess;
							sendResponse(responseToContentScript);
						}).catch(err => {
							if (DEBUG) console.error("👂🏼 Listener.onMessage() err =", err);
							sendResponse(responseToContentScript);
						});
						if (DEBUG) console.log("👂🏼 Listener.onMessage() [3] updateTallyUser");

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


				})(); // end IIFE

				// required so chrome knows this is asynchronous
				return true;

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
			chrome.action.setBadgeBackgroundColor({
				color: [255, 108, 0, 255]
			});
			chrome.action.setBadgeText({
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
