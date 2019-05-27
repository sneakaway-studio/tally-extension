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
		saveUser();
		Sound.playRandomJump();
		StatsDisplay.updateAllTallyStatsDisplay();
	}
	function resetMonsterStats(mid) {
		// tally_nearby_monsters[mid].stats = resetStats;
		// Monster.saveNearbyMonsters();
		// Sound.playRandomJump();
		// StatsDisplay.updateAllTallyMonsterDisplay();
		return resetStats;
	}


	function randomize() {
		for (var stat in tally_user.stats)
			tally_user.stats[stat] = FS_Number.round(Math.random(),2);
		saveUser();
		Monster.current().stats = resetStats;
		StatsDisplay.updateAllTallyStatsDisplay();
	}

	function update(statData) {
		//console.log("Stats.update()",statData);
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
				setTimeout(function(){
					// reset tally stats
					resetTallyStats();
					// tell them
					Thought.showString("You took a break from the internet to recharge!", "happy");
				},700);
			}
			// update last active
			tally_user.lastActive = moment().format();
			saveUser();
			console.log("checkLastActive()", moment().diff(moment(lastActive)));
		} catch (err) {
			console.error(error);
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
		checkLastActive: checkLastActive,

	};
})();
