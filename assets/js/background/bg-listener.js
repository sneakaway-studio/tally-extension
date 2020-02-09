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
					// console.log("👂🏼 Listener.addListener() getData 1", request.name);

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
						// console.log("👂🏼 Listener.getDataFromServer() RESULT =", JSON.stringify(result));
						// reply to contentscript
						sendResponse({
							"action": request.action,
							"message": 1,
							"data": result
						});
					}).fail(error => {
						console.error("👂🏼 Listener.getDataFromServer() RESULT =", JSON.stringify(error));
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

				/**
				 *	Resets all local tally_user data from server
				 */
				else if (request.action == "resetGameDataFromServer") {
					let result = Server.resetGameDataFromServer(sendResponse);
					sendResponse({
						"action": request.action,
						"data": result,
						"message": 1
					});
					// required so chrome knows this is asynchronous
					return true;
				}




				/*  GENERIC "GETTER" / "SETTER"
				 ******************************************************************************/

				else if (request.action == "getData" && request.name) {
					// console.log("👂🏼 Listener.addListener() getData 1", request.name);
					// build response
					let resp = {
						"action": request.action,
						"message": 1,
						"data": store(request.name)
					};
					// console.log("👂🏼 Listener.addListener() getData 2", request.name, resp);
					// send
					sendResponse(resp);
				}
				if (request.action == "saveData" && request.name && request.data) {
					// console.log("👂🏼 Listener.addListener() saveData", request.name, request.data);
					// save data
					let success = 0;
					if (store(request.name, request.data))
						success = 1;
					else
						console.error("👂🏼 Listener.addListener() -> Could not save data", request);
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

				// launchStartScreen
				else if (request.action == "launchStartScreen") {
					Install.launchStartScreen();
					sendResponse({
						"action": request.action,
						"message": 1
					});
				}








				// resetUser (a.k.a. "resetGame" resets everything in the game, called from API)
				else if (request.action == "resetUser") {
					let tokenOnPage = false,
						tokenData = {};
					// if token on page
					if (prop(request.tokenOnPage)) tokenOnPage = request.tokenOnPage;
					if (prop(request.tokenData)) tokenData = request.tokenData;
					// delete all game data and restart
					Install.init(tokenOnPage, tokenData);
					// send response
					sendResponse({
						"action": request.action,
						"message": 1
					}); // send success response
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
				else if (request.action == "saveToken") {
					console.log("saveToken",request.data);
					// get current token data
					let _tally_secret = store("tally_secret"),
					// default return type is fail
						message = 0;
					// if they don't match
					if (_tally_secret.token != request.data.token) {
						// save new token and tokenExpires
						_tally_secret.token = request.data.token;
						_tally_secret.tokenExpires = request.data.tokenExpires;
						store("tally_secret", _tally_secret);
						// (re)start app
						Background.startApp();
						// set response to success
						message = 1;
					}
					sendResponse({
						"action": request.action,
						"message": message
					});
				}




				// sendBackgroundUpdate
				// - receive and send score, event, page, etc. data to server
				else if (request.action == "sendBackgroundUpdate") {
					// if (DEBUG) console.log("👂🏼 Listener.sendBackgroundUpdate", JSON.stringify(request.data));

					// store update object
					store("tally_last_background_update", request.data);

					// add token
					let _tally_meta = store("tally_meta"),
						_tally_secret = store("tally_secret");
					request.data.token = _tally_secret.token;

					// (attempt to) send data to server, response to callback
					$.ajax({
						type: "PUT",
						url: _tally_meta.api + "/user/extensionUpdate",
						contentType: 'application/json',
						dataType: 'json',
						data: JSON.stringify(request.data)
					}).done(result => {
						//console.log("👂🏼 Listener.sendBackgroundUpdate() RESULT =", JSON.stringify(result));

						// merge attack data from server with game data properties
						result.attacks = Server.mergeAttackDataFromServer(result.attacks);
						// store result
						store("tally_user",result);
						// reply to contentscript with updated tally_user
						sendResponse({
							"action": request.action,
							"message": 1,
							"tally_user": result
						});
					}).fail(error => {
						console.error("👂🏼 Listener.sendBackgroundUpdate() RESULT =", JSON.stringify(error));
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
				// getLastBackgroundUpdate
				else if (request.action == "getLastBackgroundUpdate") {
					let message = 0,
						tally_last_background_update = store("tally_last_background_update");
					if (prop(tally_last_background_update) && prop(tally_last_background_update.pageData))
						message = 1;
					sendResponse({
						"action": request.action,
						"message": message,
						"data": tally_last_background_update
					});
				}


				// sendBackgroundMonsterUpdate - receive and send Monster, page data to server
				else if (request.action == "sendBackgroundMonsterUpdate") {
					if (DEBUG) console.log("👂🏼 Listener.sendBackgroundMonsterUpdate", JSON.stringify(request.data));

					// store update object
					store("tally_last_monster_update", request.data);

					// create new serverUpdate
					var serverMonsterUpdate = createMonsterUpdate(request.data);
					// (attempt to) send data to server, response to callback
					sendMonsterUpdate(serverMonsterUpdate);

					// reply to contentscript with updated tally_user
					sendResponse({
						"action": request.action,
						"message": 1,
						//"tally_user": _tally_user
					});
				}
				// getLastBackgroundUpdate
				else if (request.action == "getLastBackgroundMonsterUpdate") {
					sendResponse({
						"action": request.action,
						"data": store("tally_last_monster_update")
					});
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
	 *  Create Server *Monster* Update
	 */
	function createMonsterUpdate(data) {
		try {
			let _tally_secret = store("tally_secret");
			var obj = {
				"monster": {
					"level": data.monsterData.level,
					"mid": data.monsterData.mid,
					"captured": data.monsterData.captured,
					"missed": data.monsterData.missed
				},
				"token": _tally_secret.token,
				"time": data.pageData.time || 0,
				"tags": data.pageData.tags || "",
				"url": data.pageData.url || "",
				"domain": data.pageData.domain || "",
			};
			if (DEBUG) console.log("👂🏼 Listener.createMonsterUpdate()", obj);
			return obj;
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


	// PUBLIC
	return {

	};
}());
