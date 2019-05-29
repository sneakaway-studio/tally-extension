"use strict";


/*  Listener for messages in order to receive/pass data to contentscript.js
 ******************************************************************************/

chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
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
			//console.log("💾 <<<<< saveData", request.name, request.data);
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






		/*  PAGE MANAGEMENT
		 ******************************************************************************/

		// openPage
 		else if (request.action == "openPage") {
			if (request.url)
				chrome.tabs.create({url: request.url });
			sendResponse({
				"action": request.action,
				"data": {}
			});
 		}


		/*  USER MANAGEMENT
		 ******************************************************************************/



		// resetUser (same as creating a new one)
		else if (request.action == "resetUser") {
			store("tally_user", createUser());
			sendResponse({
				"action": request.action,
				"message": 1
			}); // send success response
		}


		/*  GAME STATUS && MONSTER MANAGEMENT
		 ******************************************************************************/








		// saveTrackerBlockList
		else if (request.action == "saveTrackerBlockList") {
			//console.log("saveTrackerBlockList()",request.data);
			let data = store("tally_trackers") || {
				"blocked": []
			};
			data.blocked = request.data;
			store("tally_trackers", data);
			sendResponse({
				"action": request.action,
				"message": 1
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
				 "data": store("tally_user")
			 });
		 }
		 // getOptions
		 else if (request.action == "getOptions") {
			 sendResponse({
				 "action": request.action,
				 "data": store("tally_options")
			 });
		 }
		 // getMeta
		 else if (request.action == "getMeta") {
			 sendResponse({
				 "action": request.action,
				 "data": store("tally_meta")
			 });
		 }
		 // getNearbyMonsters
		 else if (request.action == "getNearbyMonsters") {
			 let data = store("tally_nearby_monsters") || {};
			 sendResponse({
				 "action": request.action,
				 "data": store("tally_nearby_monsters", data)
			 });
		 }
		 // getTrackerBlockList
		 else if (request.action == "getTrackerBlockList") {
			 let data = store("tally_trackers") || {};
			 sendResponse({
				 "action": request.action,
				 "data": data
			 });
		 }
		 // getGameStatus
		 else if (request.action == "getGameStatus") {
			 let data = store("tally_game_status") || {};
			 sendResponse({
				 "action": request.action,
				 "data": data
			 });
		 }

		/*  CUSTOM FUNCTIONS
		 ******************************************************************************/

		// setBadgeText
		else if (request.action == "setBadgeText") {
			setBadgeText(request.data);
			sendResponse({
				"action": request.action,
				"message": 1
			});
		}




		/*  DATA MANAGEMENT
		 ******************************************************************************/

		// saveToken
		else if (request.action == "saveToken") {
			let _tally_secret = store("tally_secret"),
				message = 0;
			if (_tally_secret.token != request.data.token) {
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

			// save score updates to user and store
			let _tally_user = store("tally_user");
			_tally_user.score = adjustScore(_tally_user.score, request.data.scoreData);
			store("tally_user", _tally_user);

			// create new serverUpdate
			var serverUpdate = createServerUpdate(request.data);
			// (attempt to) send data to server, response to callback
			sendServerUpdate(serverUpdate);

			// reply to contentscript with updated tally_user
			sendResponse({
				"action": request.action,
				"message": 1,
				"tally_user": _tally_user
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

	}
);


/**
 *  Create Server Update
 */
function createServerUpdate(data) {
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
}

/**
 *  Create Server *Monster* Update
 */
function createMonsterUpdate(data) {
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
}




/**
 *  Adjust local score from score obj, saves it locally
 */
function adjustScore(_score, scoreObj, n) {
	for (var key in scoreObj) {
		if (scoreObj.hasOwnProperty(key) && key != "meta") {
			//console.log("adjustScore() --> ", key + " -> " + scoreObj[key]);

			// adjust scores in user
			_score[key] += scoreObj[key];
		}
		// check to see if user level should be upgraded
		for (var level in gameRules.levels) {
			if (gameRules.hasOwnProperty(level)) {
				if (gameRules.levels[level].minScore) {

				}
			}
		}
	}
	return _score;
}

function setBadgeText(_text) {
	if (!_text || _text == '') return;
	// show tracker numbers in badge
	chrome.browserAction.setBadgeBackgroundColor({
		color: [255, 108, 0, 255]
	});
	chrome.browserAction.setBadgeText({
		text: "" + _text
	});
}
