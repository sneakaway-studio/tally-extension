"use strict";


/*  Listener for messages in order to receive/pass data to contentscript.js
 ******************************************************************************/

chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		//console.log(">>>>> BACKGROUND LISTENER: onMessage.request =",JSON.stringify(request));

		if (request.action == "getData" && request.obj) {
			sendResponse({
				"action": request.action,
				"message": 1,
				"_data": _data
			});
		}


		/*  USER MANAGEMENT
		 ******************************************************************************/

		// getUser
		else if (request.action == "getUser") {
			sendResponse({
				"action": request.action,
				"data": store("tally_user")
			});
		}
		// saveUser
		else if (request.action == "saveUser") {
			store("tally_user", request.data);
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


		/*  GAME STATUS && MONSTER MANAGEMENT
		 ******************************************************************************/

		// getGameStatus
		else if (request.action == "getGameStatus") {
			let data = store("tally_game_status") || {};
			sendResponse({
				"action": request.action,
				"data": store("tally_game_status", data)
			});
		}
		// saveGameStatus
		else if (request.action == "saveGameStatus") {
			console.log("saveGameStatus", request.data);
			store("tally_game_status", request.data);
			sendResponse({
				"action": request.action,
				"message": 1
			});
		}

		// getTopMonsters
		else if (request.action == "getTopMonsters") {
			sendResponse({
				"action": request.action,
				"data": store("tally_top_monsters") || {}
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
		// saveNearbyMonsters
		else if (request.action == "saveNearbyMonsters") {
			//console.log("saveNearbyMonsters()",request.data);
			store("tally_nearby_monsters", request.data);
			sendResponse({
				"action": request.action,
				"message": 1
			});
		}

		/*  OPTIONS MANAGEMENT
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

		/*  META MANAGEMENT
		 ******************************************************************************/

		// getMeta
		else if (request.action == "getMeta") {
			sendResponse({
				"action": request.action,
				"data": store("tally_meta")
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
	//console.log("createServerUpdate()", obj);
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
			if (gameRules.levels[level].minScore) {}
		}
	}
	return _score;
}
