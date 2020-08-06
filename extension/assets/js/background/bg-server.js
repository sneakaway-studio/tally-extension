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
			_url = _tally_meta.api,
			_server = {
				"lastChecked": 0,
				"online": 0, // default is not online
				"responseMillis": -1
			};

		// get response
		var serverOnline = await fetch(_url)
			.then((response) => {
				if (DEBUG) console.log("📟 Server.checkIfOnline() response.status =", response.status);
				// go to next .then()
				if (response.status === 200) return response.json();
				// go straight to .catch()
				else throw new Error('Something went wrong');
			})
			.then((data) => {
				if (DEBUG) console.log("📟 Server.checkIfOnline() SUCCESS", JSON.stringify(data));
				// update state
				_server.online = 1;
				_server.responseMillis = new Date().getTime() - _startTime;
				return true;
			})
			.catch((error) => {
				// server is not online
				if (DEBUG) console.warn("📟 Server.checkIfOnline() FAIL", _tally_meta.api, "😢 NOT ONLINE", JSON.stringify(error));
				return false;
			});

		// save result
		_server.lastChecked = moment().format();
		_tally_meta.server = _server;
		store("tally_meta", _tally_meta);
		// return
		return serverOnline;
	}



	/**
	 *  Get latest T.tally_user data from API
	 */
	async function getTallyUser() {
		let _tally_meta = store("tally_meta"),
			_startTime = new Date().getTime(),
			_url = _tally_meta.api + "/user/getTallyUser";

		// return early if !server
		if (!_tally_meta.server.online) {
			console.error("📟 Server.getTallyUser() *** SERVER NOT ONLINE ***");
			return false;
		}

		// get response
		var userOnline = await fetch(_url, {
				credentials: 'include'
			})
			.then((response) => {
				if (DEBUG) console.log("📟 Server.getTallyUser() response.status =", response.status);
				// go to next .then()
				if (response.status === 200) return response.json();
				// go straight to .catch()
				else throw new Error('Something went wrong');
			})
			.then(async (result) => {
				// user is online
				// if (DEBUG) console.log("📟 Server.getTallyUser() SUCCESS", JSON.stringify(result));

				// make sure user was returned
				if (result && result.username) {
					if (DEBUG) console.log("📟 Server.getTallyUser() SUCCESS result.username = %c" + JSON.stringify(result.username), Debug.styles.greenbg);
					// merge attack data from server with T.tally_user data properties
					result.attacks = Server.mergeAttackDataFromServer(result.attacks);
					store("tally_user", result);
					return true;
				} else {
					if (DEBUG) console.log("📟 Server.getTallyUser() FAIL result.username = %c" + JSON.stringify(result.username), Debug.styles.redbg);
					return false;
				}
			})
			.catch((error) => {
				// user (or server) is not online
				if (DEBUG) console.warn("📟 Server.getTallyUser() FAIL", _tally_meta.api, "😢 USER NOT LOGGED-IN", JSON.stringify(error));
				return false;
			});
		// save tally_meta
		_tally_meta.userLoggedIn = userOnline;
		store("tally_meta", _tally_meta);
		// return status
		return userOnline;
	}




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
					// add AttackData properties to obj from server
					// console.log("📟 Server.mergeAttackDataFromServer()", key, attacks[key]);
					// save the data
					let attackData = AttackData.data[key];
					// save selected prop
					attackData.selected = attacks[key].selected;
					// set it back in attacks 
					attacks[key] = attackData;
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
