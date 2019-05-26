"use strict";

/*  STATS
 ******************************************************************************/

window.Stats = (function() {
	// PRIVATE

	var monsterStats = {
		"health": 1.0,
		"stamina": 1.0,
		"accuracy": 1.0,
		"attack": 1.0,
		"defense": 1.0,
		"evasion": 1.0,
	};

	var resetStats = {
		"health": 1.0,
		"stamina": 1.0,
		"accuracy": 1.0,
		"attack": 1.0,
		"defense": 1.0,
		"evasion": 1.0,
	};




	function startTally() {
		// // adjust stats display
		// StatsDisplay.adjustStatsBar("tally", "health", tally_user.stats.health);
		// StatsDisplay.adjustStatsBar("tally", "stamina", tally_user.stats.stamina);
		// StatsDisplay.adjustStatsCircle("tally", tally_user.score.level);

		StatsDisplay.updateAllTallyStatsDisplay();
	}




	function resetTallyStats() {
		tally_user.stats = resetStats;
		saveUser();
		StatsDisplay.updateAllTallyStatsDisplay();
	}
	function resetMonsterStats() {
		Monster.stats = resetStats;
		StatsDisplay.updateAllTallyMonsterDisplay();
	}


	function randomize() {
		for (var stat in tally_user.stats)
			tally_user.stats[stat] = FS_Number.round(Math.random(),2);
		saveUser();
		Monster.stats = resetStats;
		StatsDisplay.updateAllTallyStatsDisplay();
	}

	function update(statData) {
		//console.log("Stats.update()",statData);
		let upOrDown = 0;
		// if stat is already full
		if (tally_user.stats[statData.stat] >= 1) {
			Thought.show("Your " + statData.stat + " is full!", "happy", true);
			return;
		}
		// else, add new stat
		let newStat = FS_Number.round(tally_user.stats[statData.stat] + statData.val, 2);
		newStat = FS_Number.clamp(newStat, 0, 1);
		if (newStat > tally_user.stats[statData.stat])
			upOrDown = 1;
		else
			upOrDown = -1;
		// update stat
		tally_user.stats[statData.stat] = newStat;
		// save user
		saveUser();
		// update stat display
		$('.tally_stats_table').html(StatsDisplay.returnFullTable("tally",statData.stat));
		// adjust stat bars
		StatsDisplay.adjustStatsBar("tally", statData.stat, tally_user.stats[statData.stat]);
		// test
		//console.log("Stats.update()", statData, statData.stat, tally_user.stats);
		// if stat is full
		if (tally_user.stats[statData.stat] >= 1) {
			Thought.show("Your " + statData.stat + " is full!", "happy", true);
		} else {
			setTimeout(function() {
				// play sound
				if (upOrDown > 0){
					Sound.playRandomJump();
					Thought.show("Yay! You increased your " + statData.stat + "!", "happy", true);
				}
				else if (upOrDown < 0){
					Sound.playRandomJumpReverse();
					Thought.show("Dang, you lost some " + statData.stat + "!", "sad", true);
				}
			}, 500);

			setTimeout(function() {
				$(".stat-blink").removeClass("stat-blink");
			}, 2000);
		}
	}







	function checkLastActive() {
		try {
			console.log("Stats.checkLastActive()", "00:00:00",
				FS_String.pad(FS_Date.diffHours("now",tally_user.lastActive),2) +":"+
				FS_String.pad(FS_Date.diffMinutes("now",tally_user.lastActive),2) +":"+
				FS_String.pad(FS_Date.diffSeconds("now",tally_user.lastActive),2)
			);

			// if player hasn't been online for n minutes then recharge
			if (FS_Date.diffMinutes("now",tally_user.lastActive) > 0) {
				// reset tally stats
				resetTally();
				// tell them
				Thought.showString("You took a break from the internet to recharge!", "happy");
			}
			// update last active
			tally_user.lastActive = moment().format();
			saveUser();
			console.log("checkLastActive()", moment().diff(moment(lastActive)));
		} catch (err) {
			console.error(error);
		}
	}





		function monster(_stats) {
			if (_stats && _stats.health) {
				// update stats
				monsterStats = _stats;
			}
			return monsterStats;
		}







	// PUBLIC
	return {
		startTally: startTally,
		resetTallyStats: resetTallyStats,
		resetMonsterStats: resetMonsterStats,
		monster: function(data) {
			return monster(data);
		},
		randomize: randomize,
		update: function(data) {
			update(data);
		},
		resetStats: resetStats,


		checkLastActive: checkLastActive,

	};
})();
