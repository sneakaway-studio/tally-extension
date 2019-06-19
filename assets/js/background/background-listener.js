"use strict";


/*  Listener for messages in order to receive/pass data to contentscript.js
 ******************************************************************************/

chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		try {
			//console.log(">>>>> BACKGROUND LISTENER: onMessage.request =",JSON.stringify(request), sender, sendResponse);
			//console.log("💾 <<!>> chrome.runtime.onMessage.addListener",request);


			/*  GENERIC "GETTER" / "SETTER"
			 ******************************************************************************/

			if (request.action == "getData" && request.name) {
				console.log("💾 >>>>> getData", request.name);
				// build response
				let resp = {
					"action": request.action,
					"message": 1,
					"data": store(request.name)
				};
				console.log("💾 >>>>> getData", request.name,resp);
				// send
				sendResponse(resp);
			}
			if (request.action == "saveData" && request.name && request.data) {
				console.log("💾 <<<<< saveData", request.name, request.data);
				// save data
				let success = 0;
				if (store(request.name,request.data))
					success = 1;
				else
					console.error("Could not save data", request);
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

			 // getUser
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
			 // getTutorialHistoryPromise
			 else if (request.action == "getTutorialHistoryPromise") {
				 sendResponse({
					 "action": request.action,
					 "data": store("tally_tutorial_history") || {}
				 });
			 }




			/*  CUSTOM FUNCTIONS
			 ******************************************************************************/

			 // launchStartScreen
			 else if (request.action == "launchStartScreen") {
				 launchStartScreen();
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

			// resetUser (same as creating a new one)
			else if (request.action == "resetUser") {
				store("tally_user", createUser());
				sendResponse({
					"action": request.action,
					"message": 1
				}); // send success response
			}

			// openPage
	 		else if (request.action == "openPage") {
				if (request.url)
					chrome.tabs.create({url: request.url });
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
					// (re)start app and verifyToken
					startApp();
					message = 1;
				}
				sendResponse({
					"action": request.action,
					"message": message
				});
			}




			// sendBackgroundUpdate - receive and send score, event, page data to server
			else if (request.action == "sendBackgroundUpdate") {
				console.log(">>>>> BACKGROUND LISTENER: sendBackgroundUpdate", JSON.stringify(request.data));

				// store backgroundUpdate object
				store("tally_last_background_update", request.data);
				// save score updates to user
				let _tally_user = store("tally_user");
				// store score updates
				_tally_user.score = adjustScore(_tally_user.score, request.data.scoreData);
				// check for level up
				let levelUpdated = checkLevel(_tally_user);
				if (levelUpdated == true){
					_tally_user.score.level ++;
				}
				// store user
				store("tally_user", _tally_user);

				// create new serverUpdate
				var serverUpdate = createServerUpdate(request.data);
				// (attempt to) send data to server, response to callback
				sendServerUpdate(serverUpdate);

				// reply to contentscript with updated tally_user
				sendResponse({
					"action": request.action,
					"message": 1,
					"tally_user": _tally_user,
					"levelUpdated": levelUpdated
				});
			}
			// getLastBackgroundUpdate
			else if (request.action == "getLastBackgroundUpdate") {
				sendResponse({
					"action": request.action,
					"data": store("tally_last_background_update")
				});
			}


			// sendBackgroundMonsterUpdate - receive and send Monster, page data to server
			else if (request.action == "sendBackgroundMonsterUpdate") {
				console.log(">>>>> BACKGROUND LISTENER: sendBackgroundMonsterUpdate", JSON.stringify(request.data));

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
		let _tally_secret = store("tally_secret");
		var obj = {
			"clicks": data.scoreData.clicks || 0,
			"likes": data.scoreData.likes || 0,
			"pages": data.scoreData.pages || 0,
			"score": data.scoreData.score || 0,
			"time": data.pageData.time || 0,
			"tags": data.pageData.tags || "",
			"token": _tally_secret.token,
			"url": data.pageData.url || "",
			"domain": data.pageData.domain || "",
		};
		if (data.consumable != null)
			obj.consumable = data.consumable;
		console.log("createServerUpdate()", obj);
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
		//console.log("createMonsterUpdate()", obj);
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
 *  Check to see if user leveled up
 */
function checkLevel(_tally_user) {
	try {
		//console.log("checkLevel()",_tally_user);
		let nextLevel = gameRules.levels[_tally_user.score.level+1];
		if (_tally_user.score >= nextLevel.xp){
			return true;
		}
		return false;
	} catch (err) {
		console.error(err);
	}
}



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
