"use strict";

var Monster = (function() {

	let status = {};

	/**
	 *	Initial check function, refreshes status from back end continues to next
	 */
	function check() {
		// don't check if disabled
		if (tally_options.gameMode === "disabled") return;
		chrome.runtime.sendMessage({
			'action': 'getMonsterStatus'
		}, function(response) {
			console.log('>>>>> Monster.update()', JSON.stringify(response.data));
			status = response.data; // store data
			checkAfterUpdate();
		});
	}
	/**
	 *	Check the page for a monster
	 */
	function checkAfterUpdate() {
		console.log('>>>>> Monster.check()', pageData.tags);
		// loop through the tags on the page
		for (var i = 0, l = pageData.tags.length; i < l; i++) {
			// save reference
			let tag = pageData.tags[i];
			// if tag is in list
			if (MonsterData.idsByTag[tag]) {
				// save reference
				let arr = MonsterData.idsByTag[tag];
				let mid = 0;
				if (arr.length > 1) {
					// pick random monster-id from list, this will be the page monster
					mid = arr[Math.floor(Math.random() * arr.length)];
					//console.log('MATCH', tag, arr, mid, MonsterData.dataById[mid]);
					let stage = 1;
					// what stage are we at with this monster?
					if (status[mid])
						// it exists, increase the startGame
						console.log('MATCH', tag, arr, mid, MonsterData.dataById[mid], status[mid]);
					else
						// add it
						status[mid] = {"stage":stage}
					saveStatus();	
					handleMonster(mid);
				}
				// else no match
			}
		}
	}
	/**
	 *	Save the status
	 */
	function saveStatus() {
		chrome.runtime.sendMessage({'action':'saveMonsterStatus','data':tally_user}, function(response) {
				console.log('<<<<< > saveMonsterStatus()',JSON.stringify(response));
			}
		);
	}

	/**
	 *	A monster has been matched to page, handle it
	 */
	function handleMonster(mid) {

	}

	// PUBLIC
	return {
		check: check
	};
})();
