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
			if (!response) return;
			console.log('>>>>> Monster.update()', JSON.stringify(response.data));
			status = response.data; // store data
			checkStatusTimes();
			checkAfterUpdate();
		});
	}

	/**
	 *	Make sure all statuses are within n time ago
	 */
	function checkStatusTimes() {
		let now = Date.now();
		for (var mid in status) {
			// how long has it been since this monster was seen?
			console.log(mid + ". ", now - status[mid].updatedAt);

			// if longer than 5 mins (300 secs) then delete
			let seconds = ((now - status[mid].updatedAt) / 1000);
			if ((seconds) > 60) {
				console.log("DELETING, TOO LONG", "seconds", seconds);
				delete status[mid];
			}
		}
		// save after checking times
		saveStatus();
	}
	/**
	 *	Check the page for a monster
	 */
	function checkAfterUpdate() {
		//console.log('>>>>> Monster.check()', pageData.tags);
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
					// we have identified a match, let's handle the monster
					handleMonster(mid);
				}
				// else no match
			}
		}
	}

	/**
	 *	A monster has been matched to page tags, handle it
	 */
	function handleMonster(mid) {
		let now = Date.now();
		let stage = 1;
		// does the monster id exist in status?
		if (status[mid]) {
			// random control var
			let r = Math.random();
			// what stage are we at with this monster?
			if (status[mid].stage == 1) {
				// we should prompt stage 2
				if (r > 0.5) {
					status[mid].stage = 2;
					// tally warn
					Thought.show(["monster", "close", 0], true);
				} else {
					// tally warn
					Thought.show(["monster", "far", 0], true);
				}
			} else if (status[mid].stage == 2) {
				// we should prompt stage 3
				if (r > 0.5) {
					launch(mid);
				} else {
					// tally warn
					Thought.show(["monster", "close", 0], true);
				}
			}


			// the monster is in the status exists, increase the startGame
			console.log('MATCH', mid, MonsterData.dataById[mid], status[mid]);
		} else { // add it
			status[mid] = {
				"stage": stage,
				"updatedAt": now
			};
		}
		saveStatus();
	}

	/**
	 *	Launch a product monster
	 */
	function launch(mid, stage) {
		let m = MonsterData.dataById[mid];
		$.growl({
			title: "LAUNCHING MONSTER!!!",
			message: "MONSTER: " + m.name + " [" + m.mid + "] <br>STAGE: " + stage
		});

	}

	/**
	 *	Save the status
	 */
	function saveStatus() {
		chrome.runtime.sendMessage({
			'action': 'saveMonsterStatus',
			'data': status
		}, function(response) {
			//console.log('<<<<< > saveMonsterStatus()',JSON.stringify(response));
		});
	}

	// PUBLIC
	return {
		check: check
	};
})();
