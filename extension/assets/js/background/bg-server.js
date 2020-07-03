"use strict";

window.Server = (function () {
	// PRIVATE
	let DEBUG = true;


	/**
	 *	Check if API Server is online, save status
	 */
	async function checkIfOnline() {
		let _tally_meta = store("tally_meta"),
			_startTime = new Date().getTime(),
			_server = {
				"lastChecked": 0,
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
				_server.responseMillis = new Date().getTime() - _startTime;
			}).fail(error => {
				// server is not online
				console.warn("📟 Server.checkIfOnline() FAIL", _tally_meta.api, "😢 NOT ONLINE", JSON.stringify(error));
				// save state
				_server.online = 0;
				_server.responseMillis = -1;
			}).always(() => {
				// console.log("📟 Server.checkIfOnline() ALWAYS store results");
				// save result
				_server.lastChecked = moment().format();
				_tally_meta.server = _server;
				store("tally_meta", _tally_meta);
			});
	}



	/**
	 *  Get latest T.tally_user data from API
	 */
	async function getTallyUser() {
		try {
			let _tally_meta = store("tally_meta");

			// return early if !server
			if (!_tally_meta.server.online) {
				console.error("📟 Server.getTallyUser() *** SERVER NOT ONLINE ***");
				return false;
			}
			// go to server to get latest T.tally_user data
			return $.ajax({
				type: "GET",
				url: _tally_meta.api + "/user/getTallyUser",
				contentType: 'application/json'
			}).done(result => {
				// make sure user was returned
				if (result && result.username && result.message !== 0){
					if (DEBUG) console.log("📟 Server.getTallyUser() DONE result.username = %c" + JSON.stringify(result.username), Debug.styles.greenbg);
					// merge attack data from server with T.tally_user data properties
					result.attacks = Server.mergeAttackDataFromServer(result.attacks);
					// update account status
					_tally_meta.userLoggedIn = 1;
				} else {
					if (DEBUG) console.log("📟 Server.getTallyUser() DONE result.username = %c" + JSON.stringify(result.username), Debug.styles.redbg);
					// update account status
					_tally_meta.userLoggedIn = 0;
				}
			}).fail(error => {
				if (DEBUG) console.error("📟 Server.getTallyUser() FAIL", JSON.stringify(error));
				// server might not be online
				checkIfOnline();
				// update account status
				_tally_meta.userLoggedIn = 0;
			}).always((result) => {
				// if (DEBUG) console.log("📟 Server.getTallyUser() ALWAYS", JSON.stringify(result.username));
				// store result
				store("tally_user", result);
				store("tally_meta", _tally_meta);
			});
		} catch (err) {
			console.error(err);
		}
	}


	//  MARK FOR DELETION
	//
	// function handleSync(result) {
	// 	try {
	// 		// get local objects to update them
	// 		let _tally_user = store("tally_user");
	//
	// 		// treat all server data as master, store in T.tally_user
	// 		if (result.username) _tally_user.username = result.username;
	// 		if (result.admin) _tally_user.admin = result.admin;
	// 		if (result.level) _tally_user.level = result.level;
	// 		//
	// 		if (result.clicks) _tally_user.score.clicks = result.clicks;
	// 		if (result.likes) _tally_user.score.likes = result.likes;
	// 		if (result.pages) _tally_user.score.pages = result.pages;
	// 		if (result.score) _tally_user.score.score = result.score;
	// 		if (result.time) _tally_user.score.time = result.time;
	// 		if (result.attacks) _tally_user.attacks = result.attacks;
	// 		if (result.consumables) _tally_user.consumables = result.consumables;
	// 		if (result.badges) _tally_user.badges = result.badges;
	// 		store("tally_user", _tally_user);
	// 		// store any flags from server
	// 		if (result.flags && result.flags.length > 0) {
	// 			console.log("🚩 Server.handleSync() FLAGS =", JSON.stringify(result.flags));
	// 			// store
	// 			// !!!! THIS SHOULD BE INSIDE backgroundUpdate now
	// 		}
	// 	} catch (err) {
	// 		console.error(err);
	// 	}
	// }
	//



	/**
	 *  Refresh T.tally_top_monsters from API server
	 */
	async function returnTopMonsters() {
		try {
			let _tally_meta = await store("tally_meta"),
				_tally_user = await store("tally_user"),
				_tally_top_monsters = {},
				username = "";

			// if (DEBUG) console.log("📟 Server.returnTopMonsters() [1]", _tally_meta, _tally_user);

			// return early if !server or no account
			if (!_tally_meta.server.online || !_tally_meta.userLoggedIn) return;
			// return early if no username
			if (prop(_tally_user.username) && _tally_user.username != "") username = _tally_user.username;
			else return;

			$.ajax({
				type: "GET",
				url: _tally_meta.api + "/monsters/" + username,
				contentType: 'application/json',
				dataType: 'json',
			}).done(result => {
				// treat all server data as master
				// if (DEBUG) console.log("📟 Server.returnTopMonsters() [1] RESULT =", JSON.stringify(result));
				_tally_top_monsters = convertArrayToObject(result.topMonsters, "mid");
				// if (DEBUG) console.log("📟 Server.returnTopMonsters() [2] RESULT =", JSON.stringify(_tally_top_monsters));
				// store top monsters
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
		try {
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
		} catch (err) {
			console.error(err);
		}
	}


	// PUBLIC
	return {
		checkIfOnline: checkIfOnline,
		returnTopMonsters: returnTopMonsters,
		getTallyUser: getTallyUser,
		mergeAttackDataFromServer: mergeAttackDataFromServer
	};
}());
