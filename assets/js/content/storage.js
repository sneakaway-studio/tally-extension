"use strict";



/*  BACKGROUND STORAGE
******************************************************************************/

// USER
const getUserPromise = new Promise(
	(resolve,reject) => {
		//if (!pageData.activeOnPage) return;
		chrome.runtime.sendMessage({'action':'getUser'}, function(response) {
				//console.log('>>>>> getUserPromise()',JSON.stringify(response.data));
				tally_user = response.data; // store data
				resolve(response.data); // resolve promise
			}
		);
	}
);
function saveUser() {
	chrome.runtime.sendMessage({'action':'saveUser','data':tally_user}, function(response) {
			console.log("<<<<< ",calledFrom,'> saveUser()',JSON.stringify(response));
		}
	);
}

// OPTIONS
const getOptionsPromise = new Promise(
	(resolve,reject) => {
		//if (!pageData.activeOnPage) return;
		chrome.runtime.sendMessage({'action':'getOptions'}, function(response) {
				//console.log('>>>>> getOptionsPromise()',response.data);
				tally_options = response.data; // store data
				resolve(response.data); // resolve promise
			}
		);
	}
);
function saveOptions(calledFrom) {
	chrome.runtime.sendMessage({'action':'saveOptions','data':tally_options}, function(response) {
			//console.log("<<<<< ",calledFrom,'> saveOptions()',JSON.stringify(response));
		}
	);
}

// GET TALLY_META
const getMetaPromise = new Promise(
	(resolve,reject) => {
		//if (!pageData.activeOnPage) return;
		chrome.runtime.sendMessage({'action':'getMeta'}, function(response) {
				//console.log('>>>>> getMetaPromise()',response.data);
				tally_meta = response.data; // store data
				resolve(response.data); // resolve promise
			}
		);
	}
);
// GET RECENT MONSTERS
const getRecentMonstersPromise = new Promise(
	(resolve,reject) => {
		//if (!pageData.activeOnPage) return;
		chrome.runtime.sendMessage({'action':'getRecentMonsters'}, function(response) {
				//console.log('>>>>> getRecentMonsters()',response.data);
				tally_recent_monsters = response.data; // store data
				resolve(response.data); // resolve promise
			}
		);
	}
);


// SAVE TOKEN FROM DASHBOARD
function saveToken(data){
	chrome.runtime.sendMessage({'action':'saveToken','data':data}, function(response) {
			console.log('<{!}> saveToken()',response);
			if (response.message == 1){
				console.log("grab it", data);


				$.growl({ title: "Growl", message: "The kitten is awake!" });
				$.growl.notice({ message: "User token updated!" });
			}
		}
	);
}

// SEND DATA TO BACKEND / SERVER
function syncToServer(data) {
	//if (!pageData.activeOnPage) return;
	chrome.runtime.sendMessage({'action':'syncToServer','data':data}, function(response) {
			console.log('<{!}> syncToServer()',response);
			tally_user = response.data;
			//updateDisplay();
		}
	);
}
// GET LAST SERVER UPDATE
const getLastServerUpdatePromise = new Promise(
	(resolve,reject) => {
		//if (!pageData.activeOnPage) return;
		chrome.runtime.sendMessage({'action':'getLastServerUpdate'}, function(response) {
				//console.log('>>>>> getLastServerUpdatePromise()',response.data);
				let tally_lastServerUpdate = {};
				if (prop(response.data)){
					let tally_lastServerUpdate = response.data; // store data
					pageData.previousUrl = tally_lastServerUpdate.pageData.url;
				}
				resolve(tally_lastServerUpdate); // resolve promise
			}
		);
	}
);


function getGameStatus() {
	chrome.runtime.sendMessage({'action':'getGameStatus'}, function(response) {
			//console.log("<<<<< ",'> getGameStatus()',JSON.stringify(response));
			tally_game_status = response.data;
		}
	);
}
function saveGameStatus(data) {
	tally_game_status = data;
	chrome.runtime.sendMessage({'action':'saveGameStatus','data':tally_game_status}, function(response) {
			//console.log("<<<<< ",'> saveGameStatus()',JSON.stringify(response));
		}
	);
}
