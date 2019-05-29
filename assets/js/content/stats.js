"use strict";

/*  STATS
 ******************************************************************************/

window.Stats = (function() {
	// PRIVATE

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
		TallyStorage.saveData('tally_user',tally_user);
		Sound.playRandomJump();
		StatsDisplay.updateAllTallyStatsDisplay();
	}
	function resetMonsterStats(mid) {
		// tally_nearby_monsters[mid].stats = resetStats;
		// TallyStorage.saveData("tally_nearby_monsters",tally_nearby_monsters);
		// Sound.playRandomJump();
		// StatsDisplay.updateAllTallyMonsterDisplay();
		return resetStats;
	}


	function randomize() {
		for (var stat in tally_user.stats){
			if (tally_user.stats.hasOwnProperty(stat)) {
				tally_user.stats[stat] = FS_Number.round(Math.random(),2);
			}
		}
		TallyStorage.saveData('tally_user',tally_user);
		Monster.current().stats = resetStats;
		StatsDisplay.updateAllTallyStatsDisplay();
	}

	function update(statData) {
		//console.log("📈 Stats.update()",statData);
		let upOrDown = 0;
		// if stat is already full
		if (statData.val > 0 && tally_user.stats[statData.stat] >= 1) {
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
		TallyStorage.saveData('tally_user',tally_user);
		// update stat display
		$('.tally_stats_table').html(StatsDisplay.returnFullTable("tally",statData.stat));
		// adjust stat bars
		StatsDisplay.adjustStatsBar("tally", statData.stat, tally_user.stats[statData.stat]);
		// test
		//console.log("📈 Stats.update()", statData, statData.stat, tally_user.stats);
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











	// PUBLIC
	return {
		startTally: startTally,
		resetTallyStats: resetTallyStats,
		resetMonsterStats: function(){
			return resetMonsterStats();
		},
		randomize: randomize,
		update: function(data) {
			update(data);
		},
		resetStats: resetStats,

	};
})();
