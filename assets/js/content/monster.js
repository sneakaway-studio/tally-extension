"use strict";

var Monster = (function() {

	/**
	 *	Initial check function, refreshes recent monsters from back end continues to next
	 */
	function check() {
		// don't check if disabled
		if (tally_options.gameMode === "disabled") return;
		checkRecentTimes();
		checkAfterUpdate();
	}

	/**
	 *	Make sure all monster are recent
	 */
	function checkRecentTimes() {
		let now = Date.now();
		for (var mid in tally_recent_monsters) {
			// how long has it been since this monster was seen?
			//console.log(mid + ". ", now - tally_recent_monsters[mid].updatedAt);

			// if longer than 5 mins (300 secs) then delete
			let seconds = ((now - tally_recent_monsters[mid].updatedAt) / 1000);
			if ((seconds) > 60) {
				console.log("DELETING", MonsterData.dataById[mid].slug, "seconds", seconds);
				delete tally_recent_monsters[mid];
			}
		}
		// save after checking times
		saveRecent();
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
					// pick random monster id from list, this will be the page monster
					mid = arr[Math.floor(Math.random() * arr.length)];
					//console.log('MATCH', tag, arr, mid, MonsterData.dataById[mid]);
					// we have identified a match, let's handle the monster
					handleMonster(mid);
				}
				// else no match
			}
		}
		console.log('>>>>> Monster.checkAfterUpdate()', JSON.stringify(tally_recent_monsters));
	}

	/**
	 *	A monster has been matched to page tags, handle it
	 */
	function handleMonster(mid) {
		let now = Date.now();
		let stage = 1;
		// does the monster id exist in recent?
		if (tally_recent_monsters[mid]) {
			// random control var
			let r = Math.random();
			// what stage are we at with this monster?
			if (tally_recent_monsters[mid].stage == 1) {
				// we should prompt stage 2
				if (r > 0.5) {
					tally_recent_monsters[mid].stage = 2;
					Thought.show(["monster", "close", 0], true);
					Skin.set("color-orange");
				} else {
					Thought.show(["monster", "far", 0], true);
					Skin.set("color-yellow");
				}
			} else if (tally_recent_monsters[mid].stage == 2) {
				// we should prompt stage 3
				if (r > 0.5) {
					launch(mid);
				} else {
					Thought.show(["monster", "close", 0], true);
					Skin.set("color-orange");
				}
			}
			// the monster is recent, increase the startGame
			console.log('MATCH', mid, MonsterData.dataById[mid], tally_recent_monsters[mid]);
		} else { // add it
			tally_recent_monsters[mid] = {
				"stage": stage,
				"slug": MonsterData.dataById[mid].slug,
				"updatedAt": now
			};
		}
		saveRecent();
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

		// update stage
		tally_recent_monsters[mid].stage = 3;
		saveRecent();


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
	 *	Save the recent
	 */
	function saveRecent() {
		chrome.runtime.sendMessage({
			'action': 'saveRecentMonsters',
			'data': tally_recent_monsters
		}, function(response) {
			//console.log('<<<<< > saveRecentMonsters()',JSON.stringify(response));
		});
		Debug.update();
	}

	// PUBLIC
	return {
		check: check
	};
}());
