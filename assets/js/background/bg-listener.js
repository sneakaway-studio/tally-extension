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




				/*  GENERIC "GETTER" / "SETTER"
				 ******************************************************************************/

				if (request.action == "getData" && request.name) {
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






				/*  MARKED FOR DELETION
				 ******************************************************************************/

				// // saveTrackerBlockList
				// else if (request.action == "saveTrackerBlockList") {
				// 	//console.log("saveTrackerBlockList()",request.data);
				// 	let data = store("tally_trackers") || {
				// 		"blocked": []
				// 	};
				// 	data.blocked = request.data;
				// 	store("tally_trackers", data);
				// 	sendResponse({
				// 		"action": request.action,
				// 		"message": 1
				// 	});
				// }



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
					let options = setOptions(request.data);
					store("tally_options", options); // store in localStorage
					sendResponse({
						"action": request.action,
						"message": 1
					}); // send success response
				}
				// resetOptions (same as creating new options)
				else if (request.action == "resetOptions") {
					store("tally_options", createOptions());
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
				// getGameStatus
				else if (request.action == "getGameStatus") {
					sendResponse({
						"action": request.action,
						"data": store("tally_game_status") || {}
					});
				}
				// getTrackerBlockList
				else if (request.action == "getTrackerBlockList") {
					sendResponse({
						"action": request.action,
						"data": store("tally_trackers") || {}
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
				// getProgressPromise
				else if (request.action == "getProgressPromise") {
					sendResponse({
						"action": request.action,
						"data": store("tally_progress") || {}
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
					let _tally_secret = store("tally_secret"),
						message = 0;
					if (_tally_secret.token != request.data.token) {
						// save token and tokenExpires
						_tally_secret.token = request.data.token;
						_tally_secret.tokenExpires = request.data.tokenExpires;
						store("tally_secret", _tally_secret);
						// (re)start app
						Background.startApp();
						message = 1;
					}
					sendResponse({
						"action": request.action,
						"message": message
					});
				}




				// sendBackgroundUpdate - receive and send score, event, page data to server
				else if (request.action == "sendBackgroundUpdate") {
					if (DEBUG) console.log("👂🏼 Listener.sendBackgroundUpdate", JSON.stringify(request.data));

					// store backgroundUpdate object
					store("tally_last_background_update", request.data);
					// save score updates to user
					let _tally_user = store("tally_user");
					// store score updates
					_tally_user.score = adjustScore(_tally_user.score, request.data.scoreData);
					// store user
					store("tally_user", _tally_user);

					// create new serverUpdate
					var serverUpdate = createServerUpdate(request.data);
					// (attempt to) send data to server, response to callback
					Server.sendUpdate(serverUpdate);

					// reply to contentscript with updated tally_user
					sendResponse({
						"action": request.action,
						"message": 1,
						"tally_user": _tally_user
					});
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

					// store backgroundUpdate object
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
	 *  Create Server Update
	 */
	function createServerUpdate(data) {
		try {
			let _tally_secret = store("tally_secret"),
				_tally_user = store("tally_user");
			var obj = {
				"clicks": data.scoreData.clicks || 0,
				"level": _tally_user.score.level,
				"likes": data.scoreData.likes || 0,
				"pages": data.scoreData.pages || 0,
				"score": data.scoreData.score || 0,
				"time": data.pageData.time || 0,
				"tags": data.pageData.tags || "",
				"token": _tally_secret.token,
				"url": data.pageData.url || "",
				"domain": data.pageData.domain || "",
			};
			if (data.attack != null) obj.attack = data.attack;
			if (data.consumable != null) obj.consumable = data.consumable;
			if (data.badge != null) obj.badge = data.badge;
			if (DEBUG) console.log("👂🏼 Listener.createServerUpdate()", obj);
			return obj;
		} catch (err) {
			console.error(err);
		}
	}

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
	 *  Adjust local score from score obj, saves it locally
	 */
	function adjustScore(_score, scoreObj, n) {
		try {
			for (var key in scoreObj) {
				if (scoreObj.hasOwnProperty(key) && key != "meta") {
					//console.log("adjustScore() --> ", key + " -> " + scoreObj[key]);
					// if not level
					if (key !== "level")
						// adjust scores in user
						_score[key] += scoreObj[key];
				}
			}
			return _score;
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
