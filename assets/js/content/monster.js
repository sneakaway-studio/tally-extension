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
					Thought.show(["monster", "close", 0], true);
					Skin.set("color-orange");
				} else {
					Thought.show(["monster", "far", 0], true);
					Skin.set("color-yellow");
				}
			} else if (status[mid].stage == 2) {
				// we should prompt stage 3
				if (r > 0.5) {
					launch(mid);
				} else {
					Thought.show(["monster", "close", 0], true);
					Skin.set("color-orange");
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
		let monster = MonsterData.dataById[mid],
			duration = 4500,
			top = 600;

		Thought.show(["monster", "launch", 0], true);
		Skin.set("color-red");


		// insert monster

		// reference to image file
		var url = chrome.extension.getURL('assets/img/monsters/' + monster.mid + '-anim-sheet.png');
		// set content
		$('.tally_monster_sprite').css('background-image', 'url( ' + url + ')');

		// hide outside page
		$('.tally_monster_sprite').css({
			'top': pageData.browser.height + 100 + "px", // hide it up
			'left': (pageData.browser.width / 2) - 250 + "px", // center
			'display': 'block',
			'opacity': 1
		});
		// animate up
		var anim = anime({
			targets: '.tally_monster_sprite',
			translateY: {
				delay: 500, // wait for page to load
				value: -top,
				duration: duration
			},
			begin: function() { // play sound n milliseconds after animation begins
				//playSound('powerup',0,10);
			}
		});




		// // animate monster
		// anime({
		// 	targets: '#tally_monster',
		// 	translateY: -30,
		// 	duration: 600,
		// 	opacity: 0,
		// 	easing: 'easeInOutQuad',
		// 	complete: function() {
		// 		// reset
		// 		$('#tally_click_visual').css({
		// 			'transform': 'none'
		// 		});
		// 	}
		// });


		$.growl({
			title: "LAUNCHING MONSTER!!!",
			message: "MONSTER: " + monster.name + " [" + monster.mid + "] <br>STAGE: " + stage
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
