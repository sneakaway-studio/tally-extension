"use strict";

window.Server = (function() {
	// PRIVATE

	let DEBUG = true;

	/*  AJAX FUNCTIONS
	 ******************************************************************************/

	/**
	 *  Check if API Server is online, save status
	 */
	function checkIfOnline() {
		try {
			let _tally_meta = store("tally_meta"),
				// time it
				startTime = new Date().getTime();
			$.ajax({
				type: "GET",
				timeout: 10000,
				url: _tally_meta.api,
				contentType: 'application/json', // type of data you are sending
				dataType: 'json', // type of data you expect to receive
			}).done(result => {
				console.log("📟 Server.checkIfOnline() ONLINE", JSON.stringify(result));
				// save state
				let endTime = new Date().getTime();
				_tally_meta.serverOnline = 1;
				_tally_meta.userOnline = 1;
				_tally_meta.serverOnlineTime = endTime - startTime;
				// since server is online check token
				verifyToken();
			}).fail(error => {
				// server is not online, do not start game
				console.error("📟 Server.checkIfOnline() " + _tally_meta.api +
					" 😢 NOT ONLINE, DO NOT START GAME", JSON.stringify(error));
				// save state
				_tally_meta.serverOnline = 0;
				_tally_meta.userOnline = 0;
				_tally_meta.serverOnlineTime = -1;
			}).always(() => {
				//console.log("📟 Server.checkIfOnline() ALWAYS");
				// save result
				store("tally_meta", _tally_meta);
			});
		} catch (err) {
			console.error(err);
		}
	}

	/**
	 *  Verify token is ok, not expired
	 */
	function verifyToken(callback) {
		try {
			let _tally_secret = store("tally_secret"),
				_tally_meta = store("tally_meta");

			// return early if !server
			if (!_tally_meta.serverOnline) return;

			// if a token does not exist
			if (!_tally_secret.token || _tally_secret.token == "") {
				handleTokenStatus(0, 0, "", 0);
				return;
			}

			// check with server
			$.ajax({
				url: _tally_meta.api + "/user/verifyToken",
				type: "POST",
				timeout: 15000, // set timeout to 15 secs to catch ERR_CONNECTION_REFUSED
				contentType: 'application/json',
				dataType: 'json',
				data: JSON.stringify({
					"token": _tally_secret.token
				})
			}).done(result => {
				if (DEBUG) console.log("📟 Server.verifyToken() 🔑 ->", JSON.stringify(result));
				let diff = null;
				//console.log("📟 Server.verifyToken() 🔑 -> result.tokenExpires",result.tokenExpires,moment().format(result.tokenExpires));
				// check date on token
				if (result.tokenExpires) {
					//diff = returnDateDifferenceMinutes(result.tokenExpires);
					// console.log("📟 Server.verifyToken() 🔑 -> diff",diff,moment(result.tokenExpires).diff(moment()));
					diff = FS_Date.difference(result.tokenExpires, "now");
				}
				// if diff is > 0 (in the future)
				if (diff && diff > 0) {
					console.log("📟 Server.verifyToken() 🔑 -> OK", diff, result.tokenExpires);
					handleTokenStatus(result.tokenExpires, diff, "ok");
				} else {
					console.log("📟 Server.verifyToken() 🔑 -> EXPIRED", result.tokenExpires);
					handleTokenStatus(result.tokenExpires, diff, "expired");
				}
			}).fail(function(jqXHR, textStatus, errorThrown) {
				console.error("📟 Server.verifyToken() 🔑 -> result =", jqXHR, textStatus, errorThrown);
				handleTokenStatus(0, 0, "error", 0);
			});
		} catch (err) {
			console.error(err);
		}
	}

	/**
	 *  Handle token status
	 */
	function handleTokenStatus(_expires, _expiresDiff, _status) {
		try {
			if (DEBUG) console.log("📟 Server.handleTokenStatus()", _expires, _expiresDiff, _status);

			// save result
			let _tally_meta = store("tally_meta");
			_tally_meta.userTokenExpires = moment().format(_expires);
			_tally_meta.userTokenExpiresDiff = _expiresDiff;
			_tally_meta.userTokenStatus = _status;
			store("tally_meta", _tally_meta);

			Background.dataReport();

			// 1. token == ok
			if (_tally_meta.userTokenStatus == "ok") {
				if (DEBUG) console.log("📟 Server.handleTokenStatus() 🔑 -> everything is cool, start game");
				resetGameDataFromServer();
				// content script takes over
			}
			// 2. token == expired
			else if (_tally_meta.userTokenStatus == "expired") {
				if (DEBUG) console.log("📟 Server.handleTokenStatus() 🔑 -> TOKEN EXPIRED");
				// prompts handled by content script
			}
			// 3. tally_meta exists but there is no token or there is an error
			else {
				// launch signin / registration
				if (DEBUG) console.log("📟 Server.handleTokenStatus() 🔑 -> NO TOKEN FOUND");
				Install.launchStartScreen();
			}
		} catch (err) {
			console.error(err);
		}
	}

	/**
	 *  Handle token status
	 */
	function resetGameDataFromServer(callback = null) {
		try {
			let _tally_meta = store("tally_meta"),
				_tally_secret = store("tally_secret");

			console.log("📟 Server.resetGameDataFromServer()", {
				"token": _tally_secret.token
			});

			// return early if !server
			if (!_tally_meta.serverOnline) {
				console.error("📟 Server.resetGameDataFromServer() *** SERVER NOT ONLINE ***");
				return;
			}
			else if (_tally_meta.userTokenStatus != "ok") {
				console.error("📟 Server.resetGameDataFromServer() *** TOKEN NOT OK ***");
				return;
			}

			// populate monsters
			getMonsters();

			$.ajax({
				type: "POST",
				url: _tally_meta.api + "/user/returnAllGameData",
				contentType: 'application/json',
				dataType: 'json',
				data: JSON.stringify({
					"token": _tally_secret.token
				})
			}).done(result => {
				console.log("📟 Server.resetGameDataFromServer() RESULT =", JSON.stringify(result));
				// merge attack data from server with game data properties
				result.attacks = Server.mergeAttackDataFromServer(result.attacks);
				// store result
				store("tally_user", result);
				if (callback)
					callback(result);
			}).fail(error => {
				console.error("📟 Server.resetGameDataFromServer() RESULT =", JSON.stringify(error));
				// server might not be reachable
				checkIfOnline();
				if (callback)
					callback(0);
			});







			//
			//
			// console.log("📟 Server.resetGameDataFromServer()", _tally_meta, _tally_user);
			// if (!_tally_meta.serverOnline || _tally_meta.userTokenStatus != "ok") return;
			// if (prop(_tally_user.username) && _tally_user.username != "") username = _tally_user.username;
			// $.ajax({
			// 	type: "GET",
			// 	url: _tally_meta.api + "/user/returnAllGameData" + username,
			// 	contentType: 'application/json',
			// 	dataType: 'json',
			// }).done(result => {
			// 	//console.log("📟 Server.resetGameDataFromServer() RESULT =", JSON.stringify(result));
			// 	//
			// 	// // treat all server data as master
			// 	// _tally_user.monsters = convertArrayToObject(result.userMonsters, "mid");
			// 	// _tally_top_monsters = convertArrayToObject(result.topMonsters, "mid");
			//
			//
			// 	store("tally_user", _tally_user);
			//
			// }).fail(error => {
			// 	console.error("📟 Server.resetGameDataFromServer() RESULT =", JSON.stringify(error));
			// 	// server might not be reachable
			// 	checkIfOnline();
			// });
			//





			// do callback
			if (callback)
				callback();
		} catch (err) {
			console.error(err);
		}
	}



	function handleSync(result) {
		try {
			// get local objects to update them
			let _tally_user = store("tally_user");

			// treat all server data as master, store in tally_user
			if (result.username) _tally_user.username = result.username;
			if (result.admin) _tally_user.admin = result.admin;
			if (result.level) _tally_user.level = result.level;
			//
			if (result.clicks) _tally_user.score.clicks = result.clicks;
			if (result.likes) _tally_user.score.likes = result.likes;
			if (result.pages) _tally_user.score.pages = result.pages;
			if (result.score) _tally_user.score.score = result.score;
			if (result.time) _tally_user.score.time = result.time;
			if (result.attacks) _tally_user.attacks = result.attacks;
			if (result.consumables) _tally_user.consumables = result.consumables;
			if (result.badges) _tally_user.badges = result.badges;
			store("tally_user", _tally_user);
			// store any flags from server
			if (result.flags && result.flags.length > 0) {
				console.log("🚩 Server.handleSync() FLAGS =", JSON.stringify(result.flags));
				// store
				// !!!! THIS SHOULD BE INSIDE backgroundUpdate now
			}
		} catch (err) {
			console.error(err);
		}
	}


	/**
	 *  Send monster update to API server
	 */
	function sendMonsterUpdate(data) {
		try {
			console.log("📟 Server.sendMonsterUpdate()", data);
			let _tally_meta = store("tally_meta"),
				_tally_user = store("tally_user"),
				_tally_top_monsters = store("tally_top_monsters");

			// return early if !server or !token
			if (!_tally_meta.serverOnline || _tally_meta.userTokenStatus != "ok") return;

			$.ajax({
				type: "PUT",
				url: _tally_meta.api + "/user/extensionMonsterUpdate",
				contentType: 'application/json',
				dataType: 'json',
				data: JSON.stringify(data)
			}).done(result => {
				//console.log("📟 Server.sendMonsterUpdate() RESULT =", JSON.stringify(result));

				// treat all server data as master
				_tally_user.monsters = convertArrayToObject(result.userMonsters, "mid");
				_tally_top_monsters = convertArrayToObject(result.topMonsters, "mid");

				//console.log("📟 Server.sendMonsterUpdate() RESULT =", JSON.stringify(_tally_user.monsters));
				//console.log("📟 Server.sendMonsterUpdate() RESULT =", JSON.stringify(_tally_top_monsters));

				store("tally_user", _tally_user);
				store("tally_top_monsters", _tally_top_monsters);
			}).fail(error => {
				console.error("📟 Server.sendMonsterUpdate() RESULT =", JSON.stringify(error));
				// server might not be reachable
				checkIfOnline();
			});
		} catch (err) {
			console.error(err);
		}
	}
	/**
	 *  Refresh monsters from API server
	 */
	function getMonsters() {
		try {
			//console.log("📟 Server.getMonsters()");
			let _tally_meta = store("tally_meta"),
				_tally_user = store("tally_user"),
				_tally_top_monsters = store("tally_top_monsters"),
				username = "";

			console.log("📟 Server.getMonsters()", _tally_meta, _tally_user);

			// return early if !server or !token
			if (!_tally_meta.serverOnline || _tally_meta.userTokenStatus != "ok") return;

			if (prop(_tally_user.username) && _tally_user.username != "") username = _tally_user.username;
			$.ajax({
				type: "GET",
				url: _tally_meta.api + "/monsters/" + username,
				contentType: 'application/json',
				dataType: 'json',
			}).done(result => {
				//console.log("📟 Server.getMonsters() RESULT =", JSON.stringify(result));

				// treat all server data as master
				_tally_user.monsters = convertArrayToObject(result.userMonsters, "mid");
				_tally_top_monsters = convertArrayToObject(result.topMonsters, "mid");

				//console.log("📟 Server.getMonsters() RESULT =", JSON.stringify(_tally_user.monsters));
				//console.log("📟 Server.getMonsters() RESULT =", JSON.stringify(_tally_top_monsters));

				store("tally_user", _tally_user);
				store("tally_top_monsters", _tally_top_monsters);
			}).fail(error => {
				console.error("📟 Server.getMonsters() RESULT =", JSON.stringify(error));
				// server might not be reachable
				checkIfOnline();
			});
		} catch (err) {
			console.error(err);
		}
	}


	/**
	 *	Merge attack data from server with game data properties
	 */
	function mergeAttackDataFromServer(attacks) {
		// loop through attacks from server
		for (var key in attacks) {
			if (attacks.hasOwnProperty(key)) {
				// get name
				let name = attacks[key].name;
				// add GameData properties to obj from server
				//console.log("👂🏼 Listener.sendBackgroundUpdate()", key, attacks[key], name);
				// make sure it exists
				let attackData = AttackData.data[name];
				//console.log("👂🏼 Listener.sendBackgroundUpdate()", key, attacks[key], name, attackData);
				if (attackData) {
					// loop through GameData properites add
					for (var p in attackData) {
						if (attackData.hasOwnProperty(p)) {
							//console.log("👂🏼 Listener.sendBackgroundUpdate()", p, attackData[p]);
							attacks[key][p] = attackData[p];
						}
					}
				}
			}
		}
		return attacks;
	}


	// PUBLIC
	return {
		checkIfOnline: checkIfOnline,
		verifyToken: function(callback) {
			verifyToken(callback);
		},
		sendUpdate: function(data) {
			sendUpdate(data);
		},
		sendMonsterUpdate: function(data) {
			sendMonsterUpdate(data);
		},
		getMonsters: getMonsters,
		resetGameDataFromServer: resetGameDataFromServer,
		mergeAttackDataFromServer: function(attacks) {
			return mergeAttackDataFromServer(attacks);
		}
	};
}());
