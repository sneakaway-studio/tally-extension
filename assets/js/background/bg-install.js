"use strict";

window.Install = (function() {
	// PRIVATE

	let DEBUG = true;

	/**
	 *  Create all objects for game from scratch
	 */
	function init(fromReset = false, existingToken = {}) {
		try {
			if (DEBUG) console.log("🔧 Install.init() -> installing game!");

			// Create all game objects
			store("tally_user", createUser());
			store("tally_options", createOptions());
			store("tally_nearby_monsters", {});
			store("tally_meta", createMeta());
			store("tally_stats", {});
			store("tally_secret", createSecret());
			store("tally_top_monsters", {});
			store("tally_last_background_update", {});

			// get user's geolocation
			Install.saveLocation();

			// was this a reset?
			if (fromReset && existingToken !== {}) {
				if (DEBUG) console.log("🔧 Install.init() -> installing an existing token!");
				// save token and tokenExpires
				let _tally_secret = {
					"token": existingToken.token,
					"tokenExpires": existingToken.tokenExpires
				};
				store("tally_secret", _tally_secret);
			}

			// start app
			Background.startApp();
		} catch (err) {
			console.error("failed to create user", err);
		}
	}




	/**
	 *  Launch Start Screen - call after token 1) not found 2) not working
	 */
	function launchStartScreen() {
		try {
			if (DEBUG) console.log("🔧 Install.launchStartScreen() ...");
			console.trace();

			let _tally_meta = store("tally_meta");

			// get current page
			chrome.tabs.query({
				active: true,
				currentWindow: true
			}, function(tabs) {
				var tab = tabs[0];
				if (DEBUG) console.log("🔧 Install.launchStartScreen() current tab = " + JSON.stringify(tab));


				// 1. On install (first time) - from ?
				// 2. On re-install (* time) - from ?
				// 3. On token expire - from any page




				// are we in the process resetting user's data?
				if (tab.url !== undefined && tab.url.includes("dashboard")) {
					if (DEBUG) console.log("🔧 Install.launchStartScreen() *** NO *** WE ARE ON DASHBOARD");
					return;
				}

				//launch install page
				chrome.tabs.create({
					url: chrome.extension.getURL('assets/pages/startScreen/startScreen.html')
				}, function(tab) {
					// increment, check # prompts
					if (++_tally_meta.userTokenPrompts <= 3) {}
					store("tally_meta", _tally_meta);
					if (DEBUG) console.log("🔧 Install.launchStartScreen() -> launching start screen", tab.url);
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






	/*  BACKGROUND INIT FUNCTIONS
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
				"soundVolume": 0.3,
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
				"lastSyncedResult": 0,
				// "userAuthenticated": 0, mark for deletion, now handled with userTokenStatus
				"userTokenExpires": 0,
				"userTokenExpiresDiff": -1,
				"userTokenPrompts": 0,
				"userTokenStatus": "",
				"userOnline": navigator.onLine,
				"serverOnline": 1,
				"serverOnlineTime": 0,
				"currentAPI": "production", // "production" or "development";
				"api": Config.production.api, // default to production
				"website": Config.production.website,
				"browser": Environment.getBrowserName(),
				"location": {}
			};
			// testing installation
			obj.currentAPI = "development";
			obj.api = Config.development.api;
			obj.website = Config.development.website;
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
	function saveLocation() {
		try {
			let _tally_meta = store("tally_meta");
			$.getJSON('http://www.geoplugin.net/json.gp', function(data) {
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
		createOptions: createOptions,
		setOptions: function(obj) {
			return setOptions(obj);
		},
		saveLocation: saveLocation,
		launchStartScreen: launchStartScreen
	};
}());
