"use strict";



/*  BACKGROUND STORAGE
 ******************************************************************************/

// USER
const getUserPromise = new Promise(
	(resolve, reject) => {
		//if (!pageData.activeOnPage) return;
		chrome.runtime.sendMessage({
			'action': 'getUser'
		}, function(response) {
			//console.log('>>>>> getUserPromise()',JSON.stringify(response.data));
			tally_user = response.data; // store data
			resolve(response.data); // resolve promise
		});
	}
);

function saveUser() {
	chrome.runtime.sendMessage({
		'action': 'saveUser',
		'data': tally_user
	}, function(response) {
		console.log("<<<<< ", calledFrom, '> saveUser()', JSON.stringify(response));
	});
}

// OPTIONS
const getOptionsPromise = new Promise(
	(resolve, reject) => {
		//if (!pageData.activeOnPage) return;
		chrome.runtime.sendMessage({
			'action': 'getOptions'
		}, function(response) {
			//console.log('>>>>> getOptionsPromise()',response.data);
			tally_options = response.data; // store data
			resolve(response.data); // resolve promise
		});
	}
);

function saveOptions(calledFrom) {
	chrome.runtime.sendMessage({
		'action': 'saveOptions',
		'data': tally_options
	}, function(response) {
		//console.log("<<<<< ",calledFrom,'> saveOptions()',JSON.stringify(response));
	});
}

// GET TALLY_META
const getMetaPromise = new Promise(
	(resolve, reject) => {
		//if (!pageData.activeOnPage) return;
		chrome.runtime.sendMessage({
			'action': 'getMeta'
		}, function(response) {
			//console.log('>>>>> getMetaPromise()',response.data);
			tally_meta = response.data; // store data
			resolve(response.data); // resolve promise
		});
	}
);
// GET RECENT MONSTERS
const getRecentMonstersPromise = new Promise(
	(resolve, reject) => {
		//if (!pageData.activeOnPage) return;
		chrome.runtime.sendMessage({
			'action': 'getRecentMonsters'
		}, function(response) {
			//console.log('>>>>> getRecentMonsters()',response.data);
			tally_recent_monsters = response.data; // store data
			resolve(response.data); // resolve promise
		});
	}
);


// SAVE TOKEN FROM DASHBOARD
function saveToken(data) {
	chrome.runtime.sendMessage({
		'action': 'saveToken',
		'data': data
	}, function(response) {
		console.log('<{!}> saveToken()', response);
		if (response.message == 1) {
			console.log("grab it", data);
			$.growl({
				title: "TOKEN SAVED!",
				message: "User token updated!"
			});
		}
	});
}

// SEND DATA TO BACKGROUND
function sendBackgroundUpdate(data) {
	//if (!pageData.activeOnPage) return;
	chrome.runtime.sendMessage({
		'action': 'sendBackgroundUpdate',
		'data': data
	}, function(response) {
		console.log('<{!}> sendBackgroundUpdate()', response);
		tally_user = response.tally_user;
		Debug.update();
	});
}



// GET LAST BACKGROUND UPDATE
const getLastBackgroundUpdatePromise = new Promise(
	(resolve, reject) => {
		//if (!pageData.activeOnPage) return;
		chrome.runtime.sendMessage({
			'action': 'getLastBackgroundUpdate'
		}, function(response) {
			//console.log('>>>>> getLastBackgroundUpdatePromise()',response.data);
			let _lastBackgroundUpdate = {};
			if (prop(response.data)) {
				_lastBackgroundUpdate = response.data; // store data
				pageData.previousUrl = _lastBackgroundUpdate.pageData.url;
			}
			resolve(_lastBackgroundUpdate); // resolve promise
		});
	}
);


function getGameStatus() {
	chrome.runtime.sendMessage({
		'action': 'getGameStatus'
	}, function(response) {
		//console.log("<<<<< ",'> getGameStatus()',JSON.stringify(response));
		tally_game_status = response.data;
	});
}

function saveGameStatus(data) {
	tally_game_status = data;
	chrome.runtime.sendMessage({
		'action': 'saveGameStatus',
		'data': tally_game_status
	}, function(response) {
		//console.log("<<<<< ",'> saveGameStatus()',JSON.stringify(response));
	});
}
