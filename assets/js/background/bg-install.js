"use strict";

window.Install = (function() {
	// PRIVATE

	let DEBUG = true;

	/**
	 *  Create all objects for game from scratch
	 */
	async function init(fromReset = false, existingToken = {}) {
		try {
			// does tally_meta exists, or is this the first install?
			if (prop(store("tally_meta"))) {
				if (DEBUG) console.log("🔧 Install.init() -> tally_meta exists, need to check token");
				return false;
			}

			if (DEBUG) console.log("🔧 Install.init() -> no tally_meta found, creating app");
			// Create all game objects
			store("tally_user", createUser());
			store("tally_options", createOptions());
			store("tally_nearby_monsters", {});
			store("tally_meta", createMeta());
			store("tally_stats", {});
			store("tally_secret", createSecret());
			store("tally_top_monsters", {});

			// get user's geolocation
			await saveLocation();

			if (DEBUG) console.log("🔧 Install.init() -> game installed!");
			return true;
		} catch (err) {
			console.error("failed to create user", err);
		}
	}



	/**
	 * 	Check if it is a new version
	 */
	async function setVersion() {
		try {
			let _tally_meta = store("tally_meta"),
				manifestData = chrome.runtime.getManifest();
			if (_tally_meta.version == manifestData.version) {
				if (DEBUG) console.log("🔧 Install.setVersion()", _tally_meta.version + "==" + manifestData.version, "..... SAME VERSION");
				return false;
			} else {
				if (DEBUG) console.log("🔧 Install.setVersion()", _tally_meta.version + "!=" + manifestData.version, "!!!!! NEW VERSION");
				// update version
				_tally_meta.version = manifestData.version;
				store("tally_meta", _tally_meta);
				return true;
			}
		} catch (err) {
			console.error(err);
		}
	}


	/**
	 *  Set development or production server
	 */
	async function setCurrentAPI() {
		try {
			let _tally_meta = store("tally_meta");
			_tally_meta.api = Config[_tally_meta.currentAPI].api;
			_tally_meta.website = Config[_tally_meta.currentAPI].website;
			if (DEBUG) console.log("🔧 Install.setCurrentAPI() currentAPI=%c" + _tally_meta.currentAPI, Debug.styles.green,
				"api=" + _tally_meta.api, "website=" + _tally_meta.website);
			store("tally_meta", _tally_meta);
			return true;
		} catch (err) {
			console.error(err);
		}
	}


	/**
	 *  Set options for development
	 */
	async function setDevelopmentOptions() {
		try {
			let _tally_meta = store("tally_meta");
			if (Config.options.localhost){
				if (DEBUG) console.log("🔧 Install.setDevelopmentOptions() Config.options=%c" +
					JSON.stringify(Config.options), Debug.styles.green, "USING LOCALHOST");
				// testing installation
				_tally_meta.currentAPI = "development";
				_tally_meta.api = Config.development.api;
				_tally_meta.website = Config.development.website;
			} else {
				if (DEBUG) console.log("🔧 Install.setDevelopmentOptions() Config.options=%c" +
					JSON.stringify(Config.options), Debug.styles.green, "USING tallygame.net");
				// testing installation
				_tally_meta.currentAPI = "production";
				_tally_meta.api = Config.production.api;
				_tally_meta.website = Config.production.website;
			}
			store("tally_meta", _tally_meta);
			return true;
		} catch (err) {
			console.error(err);
		}
	}



	/**
	 *  Launch Start Screen - call after token 1) not found 2) not working
	 */
	async function launchStartScreen() {
		try {
			// console.trace();
			let _tally_meta = await store("tally_meta");

			// don't launch if !server
			if (!_tally_meta.server.online)
				return console.log("🔧 Install.launchStartScreen() 🛑 SERVER OFFLINE");

			// don't launch if !token
			if (_tally_meta.token.status === "ok")
				return console.log("🔧 Install.launchStartScreen() 🛑 NO TOKEN");

			// get current page
			chrome.tabs.query({
				active: true,
				currentWindow: true
			}, function(tabs) {
				var tab = tabs[0];
				if (DEBUG) console.log("🔧 Install.launchStartScreen() current tab =", tab);

				// are we in the process resetting user's data?
				if (tab.url !== undefined && (tab.url.includes("dashboard") || tab.url.includes("tallygame.net"))) {
					return console.log("🔧 Install.launchStartScreen() 🛑 ON DASHBOARD");
				}
				//launch install page
				chrome.tabs.create({
					url: chrome.extension.getURL('assets/pages/startScreen/startScreen.html')
				}, function(newTab) {
					// increment, check # prompts
					if (++_tally_meta.token.prompts <= 3) {}
					store("tally_meta", _tally_meta);
					if (DEBUG) console.log("🔧 Install.launchStartScreen() 👍 launching", newTab);
					return true;
				});
			});
		} catch (err) {
			console.error(err);
		}
	}

	/**
	 *  Launch registration page
	 */
	// function launchRegistrationPage() {
	// 	chrome.tabs.create({
	// 		url: _tally_meta.website + "/signin"
	// 	}, function(tab) {
	// 		if (DEBUG) console.log("🔧 Install.launchRegistrationPage() -> launching registration page", tab.url);
	// 	});
	// }






	/*  INIT FUNCTIONS
	 ******************************************************************************/

	/**
	 *  Create user
	 */
	function createUser() {
		try {
			var obj = {
				"achievements": {},
				"admin": 0,
				"attacks": {},
				"badges": {},
				"consumables": {},
				"flags": {},
				"confirmFlags": {},
				"lastActive": moment().format(),
				"level": 1,
				"monsters": {},
				"progress": {},
				"score": {
					"clicks": 0,
					"domains": 0,
					"likes": 0,
					"pages": 0,
					"score": 0,
					"time": 0,
				},
				"skins": ["magenta"],
				"timezone": "",
				"trackers": {},
				"username": "",
			};
			return obj;
		} catch (err) {
			console.error(err);
		}
	}

	function createOptions() {
		try {
			var obj = {
				"showTally": true,
				"showClickVisuals": true,
				"playSounds": true,
				"soundVolume": 0.2,
				"showAnimations": true,
				"gameMode": "full", // "demo" | "testing" | "full" | "stealth" | "disabled"
				"disabledDomains": [
					"drive.google.com",
					"docs.google.com",
					"gmail.com",
					"mail.google.com",
					"moodle.davidson.edu",
				],
				"showDebugger": false,
				"debuggerPosition": [0, 300]
			};
			obj = setOptions(obj);
			return obj;
		} catch (err) {
			console.error(err);
		}
	}

	function setOptions(options) {
		try {
			if (options.gameMode == "stealth" || options.gameMode == "disabled") {
				options.showTally = false;
				options.showClickVisuals = false;
				options.playSounds = false;
				options.showAnimations = false;
			} else {
				options.showTally = true;
				options.showClickVisuals = true;
				options.playSounds = true;
				options.showAnimations = true;
			}
			return options;
		} catch (err) {
			console.error(err);
		}
	}

	/**
	 *  Create Meta object on installation
	 */
	function createMeta() {
		try {
			var manifestData = chrome.runtime.getManifest();
			var obj = {
				"version": manifestData.version, // set in manifest
				"installedOn": moment().format(),
				"lastSyncedToServer": 0,
				"token": {
					"expiresDate": 0, // date expires
					"expiresInMillis": -1, // milliseconds until expires
					"prompts": 0, // number prompts given to user
					"status": "", // status = ok | expired
				},
				"server": {
					"lastSyncedDate": 0,
					"online": 1,
					"responseMillis": -1
				},
				"userOnline": navigator.onLine,
				"currentAPI": "production", // "production" or "development";
				"api": Config.production.api, // default to production
				"website": Config.production.website,
				"browser": Environment.getBrowserName(),
				"location": {}
			};

			return obj;
		} catch (err) {
			console.error(err);
		}
	}

	/**
	 *  Create Secret object on installation
	 */
	function createSecret() {
		try {
			var obj = {
				"token": "",
				"tokenExpires": "",
			};
			return obj;
		} catch (err) {
			console.error(err);
		}
	}

	/**
	 *  Get location
	 */
	async function saveLocation() {
		try {
			let _tally_meta = store("tally_meta");
			return $.getJSON('http://www.geoplugin.net/json.gp', function(data) {
				// console.log(JSON.stringify(data, null, 2));
				_tally_meta.location = {
					"ip": data.geoplugin_request,
					"city": data.geoplugin_city,
					"region": data.geoplugin_region,
					"country": data.geoplugin_countryName,
					"continent": data.geoplugin_continentName,
					"lat": data.geoplugin_latitude,
					"lng": data.geoplugin_longitude,
					"timezone": data.geoplugin_timezone
				};
				store("tally_meta", _tally_meta);
			});
		} catch (err) {
			console.error(err);
		}
	}


	// PUBLIC
	return {
		init: init,
		setVersion: setVersion,
		setCurrentAPI: setCurrentAPI,
		setDevelopmentOptions: setDevelopmentOptions,
		createOptions: createOptions,
		setOptions: function(obj) {
			return setOptions(obj);
		},
		saveLocation: saveLocation,
		launchStartScreen: launchStartScreen
	};
}());
