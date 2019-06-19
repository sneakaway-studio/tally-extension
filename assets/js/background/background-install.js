"use strict";

/**
 *  Create user, options, meta, etc.
 */
function createApp() {
	console.log("!!!!! createApp() -> first install: creating tally_user");
	try {
		// Create objects
		store("tally_user", createUser());
		store("tally_options", createOptions());
		store("tally_game_status", createGameStatus());
		store("tally_nearby_monsters", {});
		store("tally_meta", createMeta());
		store("tally_stats", {});
		store("tally_secret", createSecret());
		store("tally_top_monsters", {});
		store("tally_trackers", {
			"blocked": {}
		});
		store("tally_tutorial_history", createTutorialHistory());

		// these are empty the first time
		// store("tally_domains", {});
		// store("tally_urls", {});

		// start app
		startApp();
	} catch (ex) {
		console.log("failed to create user");
	}
}

/**
 *  Launch registration page
 */
function launchStartScreen() {
	try {
		let _tally_meta = store("tally_meta");
		// if we haven't prompted them too many times
		if (_tally_meta.userTokenPrompts <= 1) {
			//launch install page
			chrome.tabs.create({
				url: chrome.extension.getURL('assets/pages/startScreen/startScreen.html')
			}, function(tab) {
				// increment prompts
				_tally_meta.userTokenPrompts++;
				store("tally_meta", _tally_meta);
				console.log(">>>>> launchStartScreen() -> launching start screen", tab.url);
			});
		} else {
			// do nothing, content script will prompt them
		}
	} catch (err) {
		console.error(err);
	}
}

/**
 *  Launch registration page
 */
// function launchRegistrationPage() {
// 	chrome.tabs.create({
// 		url: _tally_meta.website + "/signup"
// 	}, function(tab) {
// 		console.log(">>>>> launchRegistrationPage() -> launching registration page", tab.url);
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
			"username": "",
			"lastActive": moment().format(),
			"score": createScore(),
			"achievements": {},
			"monsters": {},
			"skins": ["color-magenta"],
			"consumables": {},
			"attacks": {}
		};
		return obj;
	} catch (err) {
		console.error(err);
	}
}
// Create Score object (separate function so we can reset)
function createScore() {
	try {
		var obj = {
			"clicks": 0,
			"domains": 0,
			"level": 1,
			"likes": 0,
			"pages": 0,
			"score": 0,
			"time": 0,
		};
		return obj;
	} catch (err) {
		console.error(err);
	}
}
// Track status of current game
function createGameStatus() {
	try {
		var obj = {
			"skin": "color-magenta"
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
			"gameMode": "full",
			"disabledDomains": [
				"drive.google.com",
				"docs.google.com",
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
		if (options.gameMode == "full") {
			options.showTally = true;
			options.showClickVisuals = true;
			options.playSounds = true;
			options.showAnimations = true;
		} else if (options.gameMode == "stealth" || options.gameMode == "disabled") {
			options.showTally = false;
			options.showClickVisuals = false;
			options.playSounds = false;
			options.showAnimations = false;
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
			"userAuthenticated": 0,
			"userTokenExpires": 0,
			"userTokenExpiresDiff": -1,
			"userTokenPrompts": 0,
			"userTokenStatus": "",
			"userTokenValid": 0,
			"userOnline": navigator.onLine,
			"serverOnline": 0,
			"serverOnlineTime": 0,
			"currentAPI": "development", // "production" or "development";
			"api": Config.production.api, // default to production
			"website": Config.production.website,
			"browser": Environment.getBrowserName()
		};
		// testing installation
		// obj.currentAPI = "development";
		// obj.api = Config.development.api;
		// obj.website = Config.development.website;
		return obj;
	} catch (err) {
		console.error(err);
	}
}

function createTutorialHistory() {
	try {
		return {
			"award1stAttack": false,
			"award2ndAttack": false,
			"award3rdAttack": false,
			"award4thAttack": false,
			"battle1stMonster": false,
			"battle2ndMonster": false,
			"battle3rdMonster": false,
			"viewProfilePage": false,
			"tutorialComplete": false
		};
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
