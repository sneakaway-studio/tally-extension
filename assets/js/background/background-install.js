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
		store("tally_nearby_monsters", createNearbyMonsters());
		store("tally_meta", createMeta());
		store("tally_secret", createSecret());
		store("tally_top_monsters", {});

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
	var obj = {
		"username": "",
		"score": createScore(),
		"achievements": createAchievements(),
		"monsters": createMonsters(),
		"skins": ["color-magenta"]
	};
	return obj;
}
// Create Score object (separate function so we can reset)
function createScore() {
	var obj = {
		"clicks": 0,
		"domains": 0,
		"level": 0,
		"likes": 0,
		"pages": 0,
		"score": 0,
		"time": 0,
	};
	return obj;
}
// Track status of current game
function createGameStatus() {
	var obj = {
		"skin": "color-magenta"
	};
	return obj;
}
// Keep track of monsters
function createNearbyMonsters() {
	var obj = {};
	return obj;
}

// Create Achievements object (separate function so we can reset)
function createAchievements() {
	var obj = {};
	return obj;
}

// Create Monsters object (separate function so we can reset)
function createMonsters() {
	var obj = {};
	return obj;
}

function createOptions() {
	var obj = {
		"showTally": true,
		"showClickVisuals": true,
		"playSounds": true,
		"showAnimations": true,
		"gameMode": "full",
		"skin": "color-magenta",
		"disabledDomains": [
			"drive.google.com",
			"docs.google.com",
		],
		"showDebugger": true,
		"debuggerPosition": [0, 300]
	};
	obj = setOptions(obj);
	return obj;
}

function setOptions(options) {
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
}

/**
 *  Create Meta object on installation
 */
function createMeta() {
	var obj = {
		"version": 0.1,
		"installedOn": returnDateISO(),
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
		"currentAPI": "production", // or "development";
		"api": Config.production.api, // default to production
		"website": Config.production.website,
		"browser": Environment.getBrowserName()
	};
	// testing installation
	// obj.currentAPI = "development";
	// obj.api = Config.development.api;
	// obj.website = Config.development.website;
	return obj;
}




/**
 *  Create Secret object on installation
 */
function createSecret() {
	var obj = {
		"token": "", 
		"tokenExpires": "",
	};
	return obj;
}
