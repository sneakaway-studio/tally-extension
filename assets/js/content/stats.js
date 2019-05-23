"use strict";

/*  STATS
 ******************************************************************************/

window.Stats = (function() {
	// PRIVATE

	var monsterStats = {
		"health": 1.0,
		"attack": 1.0,
		"stamina": 1.0,
		"accuracy": 1.0,
		"evasion": 1.0,
		"defense": 1.0,
	};

	var tallyResetStats = {
		"health": 1.0,
		"attack": 1.0,
		"stamina": 1.0,
		"accuracy": 1.0,
		"evasion": 1.0,
		"defense": 1.0,
	};

	// var tallyStats = {
	// 	"health": 1.0,
	// 	"attack": 1.0,
	// 	"stamina": 1.0,
	// 	"accuracy": 1.0,
	// 	"evasion": 1.0,
	// 	"defense": 1.0,
	// };


	function startTally() {
		// adjust stats display
		StatsDisplay.adjustStatsBar("tally", "health", tally_user.stats.health);
		StatsDisplay.adjustStatsBar("tally", "stamina", tally_user.stats.stamina);
		StatsDisplay.adjustStatsCircle("tally", tally_user.score.level);
	}

	// function tally(_stats) {
	// 	if (_stats && _stats.health) {
	// 		// update stats
	// 		tallyStats = _stats;
	// 	}
	// 	return tallyStats;
	// }

	function monster(_stats) {
		if (_stats && _stats.health) {
			// update stats
			monsterStats = _stats;
		}
		return monsterStats;
	}

	function reset() {
		tally_user.stats = tallyResetStats;
		monsterStats = tallyResetStats;
	}

	function update(data) {
		console.log("Stats.update()", data);
		tally_user.stats[data.stat] += data.val;
		// move tally up
		anime({
			targets: '#tally_character',
			translateY: "-230px",
			elasticity: 0,
			duration: 500,
			easing: 'easeOutCubic',
			complete: function(anim) {
				// adjust stats display
				StatsDisplay.adjustStatsBar("tally", data.stat, Math.random());
				setTimeout(function() {
					// tell them
					Thought.show("Yay! You increased your " + data.stat + "!", "happy", true);
				}, 500);
				// move tally down
				setTimeout(function() {
					moveTallyBack();
				}, 2000);
			}
		});
	}


	function moveTallyBack() {
		anime({
			targets: '#tally_character',
			translateY: 0,
			elasticity: 0,
			duration: 400,
			easing: 'easeOutCubic',
		});
	}









	function checkLastActive() {
		let lastActive = tally_user.lastActive;
		// console.log(moment(tally_user.lastActive).format());
		// console.log("now", moment().format());
		// console.log(FS_Date.moreThan("now", tally_user.lastActive, 10, "minutes"));
		// console.log(FS_Date.moreThanOneHourAgo(tally_user.lastActive));

		// if player hasn't been online for 1 hour then recharge
		if (FS_Date.moreThanOneHourAgo(lastActive)) {
			// update stats

			// show them

			// tell them
			Thought.showString("You took a break from the internet to recharge!", "happy");
		}
		// update last active
		tally_user.lastActive = moment().format();
		saveUser();
		console.log("checkLastActive()", moment().diff(moment(lastActive)));
	}








	// PUBLIC
	return {
		startTally: startTally,
		tally: function(data) {
			return tally(data);
		},
		monster: function(data) {
			return monster(data);
		},
		reset: reset,
		update: function(data) {
			update(data);
		},



		checkLastActive: checkLastActive,

	};
})();
