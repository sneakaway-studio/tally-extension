"use strict";

window.Server = (function() {
	// PRIVATE

	let DEBUG = true;

	/*  AJAX FUNCTIONS
	 ******************************************************************************/


	/**
	 *	(New async) Check if API Server is online, save status
	 */
	async function checkIfOnline() {
		let _tally_meta = store("tally_meta"),
			_startTime = new Date().getTime(),
			_server = {
				"lastSyncedDate": 0,
				"online": 1,
				"responseMillis": -1
			};
		// return result of ajax call
		return $.ajax({
				type: "GET",
				timeout: 10000,
				url: _tally_meta.api,
				contentType: 'application/json', // type of data you are sending
				dataType: 'json', // type of data you expect to receive
			})
			.done(result => {
				console.log("📟 Server.checkIfOnline() SUCCESS", JSON.stringify(result));
				// save state
				_server.online = 1;
				_tally_meta.userOnline = 1;
				_tally_meta.server.responseMillis = new Date().getTime() - _startTime;
			}).fail(error => {
				// server is not online
				console.warn("📟 Server.checkIfOnline() FAIL", _tally_meta.api,
					"😢 NOT ONLINE", JSON.stringify(error));
				// save state
				_server.online = 0;
				_tally_meta.userOnline = 0;
				_tally_meta.server.responseMillis = -1;
			}).always(() => {
				// console.log("📟 Server.checkIfOnline() ALWAYS store results");
				// save result
				_tally_meta.server = _server;
				store("tally_meta", _tally_meta);
			});
	}



	/**
	 *  (New async) Verify token is ok, not expired
	 */
	async function verifyToken() {

		let _tally_secret = store("tally_secret"),
			_tally_meta = store("tally_meta"),
			_token = {
				"expiresDate": 0,
				"expiresInMillis": -1,
				"prompts": 0,
				"status": ""
			};

		// return early if !server
		if (!_tally_meta.server.online) return false;

		// if a token does not exist
		if (!_tally_secret.token || _tally_secret.token == "") {
			console.log("📟 Server.verifyToken() 🔑 -> NO TOKEN", JSON.stringify(_tally_secret), _tally_meta);
			_tally_meta.token = _token;
			await store("tally_meta", _tally_meta);
			return false;
		}

		// we have a token so validate with server
		return $.ajax({
			url: _tally_meta.api + "/user/verifyToken",
			type: "POST",
			timeout: 15000, // set timeout to 15 secs to catch ERR_CONNECTION_REFUSED
			contentType: 'application/json',
			dataType: 'json',
			data: JSON.stringify({
				"token": _tally_secret.token
			})
		}).done(result => {
			console.log("📟 Server.verifyToken() DONE 🔑 -> result", result);

			// check and save milliseconds until expires
			if (result.tokenExpires) {
				_token.expiresDate = moment().format(result.tokenExpires);
				_token.expiresInMillis = FS_Date.difference(result.tokenExpires, "now");
			} else {
				// token is expired
				_token.status = "expired";
				console.log("📟 Server.verifyToken() DONE 🔑 -> EXPIRED", _token);
			}

			// if not expired = _token.expiresInMillis is > 0 (in the future)
			if (_token.expiresInMillis && _token.expiresInMillis > 0) {
				// token is ok
				_token.status = "ok";
				// console.log("📟 Server.verifyToken() NOT EXPIRED 🔑 -> OK", _token);
			} else {
				// token is expired
				_token.status = "expired";
				// console.log("📟 Server.verifyToken() DONE 🔑 -> EXPIRED", _token);
			}
			return true;
		}).fail(function(jqXHR, textStatus, errorThrown) {
			_token.status = "fail";
			console.error("📟 Server.verifyToken() FAIL 🔑 -> result =", jqXHR, textStatus, errorThrown, _token);
			return false;
		}).always(() => {
			console.log("📟 Server.verifyToken() ALWAYS 🔑 -> STORE", _token);
			// save token
			_tally_meta.token = _token;
			store("tally_meta", _tally_meta);
		});
	}

	/**
	 *  Handle token status - OLD BUT NEED SOME OF THESE THINGS
	 */
	function saveTokenStatus(_expires, _expiresInMillis, _status) {
		try {


			// // 1. token == ok
			// if (_tally_meta.token.status == "ok") {
			// 	if (DEBUG) console.log("📟 Server.saveTokenStatus() 🔑 -> everything is cool, start game");
			// 	// getTallyUser();
			// 	// content script takes over
			// }
			// // 2. token == expired
			// else if (_tally_meta.token.status == "expired") {
			// 	if (DEBUG) console.log("📟 Server.saveTokenStatus() 🔑 -> TOKEN EXPIRED");
			// 	// prompts handled by content script
			// }
			// // 3. tally_meta exists but there is no token or there is an error
			// else {
			// 	// launch signin / registration
			// 	if (DEBUG) console.log("📟 Server.saveTokenStatus() 🔑 -> NO TOKEN FOUND");
			// 	// Install.launchStartScreen();
			// }


		} catch (err) {
			console.error(err);
		}
	}

	/**
	 *  Get latest tally_user data from API
	 */
	async function getTallyUser() {
		try {
			let _tally_meta = store("tally_meta"),
				_tally_secret = store("tally_secret");

			// return early if !server || !token
			if (!_tally_meta.server.online) {
				console.error("📟 Server.getTallyUser() *** SERVER NOT ONLINE ***");
				return false;
			} else if (_tally_meta.token.status !== "ok") {
				console.error("📟 Server.getTallyUser() *** TOKEN NOT OK ***");
				return false;
			}

			// send token to server to get latest tally_user data
			return $.ajax({
				type: "POST",
				url: _tally_meta.api + "/user/returnTallyUser",
				contentType: 'application/json',
				dataType: 'json',
				data: JSON.stringify({
					"token": _tally_secret.token
				})
			}).done(result => {
				if (DEBUG) console.log("📟 Server.getTallyUser() DONE %c" + JSON.stringify(result.username), Debug.styles.green );
				// merge attack data from server with tally_user data properties
				result.attacks = Server.mergeAttackDataFromServer(result.attacks);

			}).fail(error => {
				if (DEBUG) console.error("📟 Server.getTallyUser() FAIL", JSON.stringify(error));
				// server might not be online
				checkIfOnline();
			}).always((result) => {
				if (DEBUG) console.log("📟 Server.getTallyUser() ALWAYS", JSON.stringify(result.username));
				// store result
				store("tally_user", result);
			});
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
	 *  Refresh tally_top_monsters from API server
	 */
	async function returnTopMonsters() {
		try {
			let _tally_meta = await store("tally_meta"),
				_tally_user = await store("tally_user"),
				_tally_top_monsters = {},
				username = "";

			if (DEBUG) console.log("📟 Server.returnTopMonsters() [1]", _tally_meta, _tally_user);

			// return early if !server or !token
			if (!_tally_meta.server.online || _tally_meta.token.status != "ok") return;

			if (prop(_tally_user.username) && _tally_user.username != "") username = _tally_user.username;
			$.ajax({
				type: "GET",
				url: _tally_meta.api + "/monsters/" + username,
				contentType: 'application/json',
				dataType: 'json',
			}).done(result => {
				//console.log("📟 Server.returnTopMonsters() RESULT =", JSON.stringify(result));

				// MARK FOR DELETION (NOW IN tally_user)
				// _tally_user.monsters = convertArrayToObject(result.userMonsters, "mid");

				// treat all server data as master
				_tally_top_monsters = convertArrayToObject(result.topMonsters, "mid");

				// if (DEBUG) console.log("📟 Server.returnTopMonsters() [2] RESULT =", JSON.stringify(_tally_top_monsters));

				store("tally_user", _tally_user);
				store("tally_top_monsters", _tally_top_monsters);
			}).fail(error => {
				console.error("📟 Server.returnTopMonsters() [3] RESULT =", JSON.stringify(error));
				// server might not be online
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
				// add AttackData properties to obj from server
				//console.log("📟 Server.mergeAttackDataFromServer()", key, attacks[key], name);
				// make sure it exists
				let attackData = AttackData.data[name];
				//console.log("📟 Server.mergeAttackDataFromServer()", key, attacks[key], name, attackData);
				if (attackData) {
					// loop through AttackData properties add
					for (var p in attackData) {
						if (attackData.hasOwnProperty(p)) {
							//console.log("📟 Server.mergeAttackDataFromServer()", p, attackData[p]);
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
		verifyToken: verifyToken,
		returnTopMonsters: returnTopMonsters,
		getTallyUser: getTallyUser,
		mergeAttackDataFromServer: mergeAttackDataFromServer
	};
}());
