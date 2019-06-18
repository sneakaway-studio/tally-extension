"use strict";

/*  STATS
 ******************************************************************************/

window.Stats = (function() {
	// PRIVATE

	let DEBUG = true,
		resetStatsAll = {
			"health": 1.0,
			"stamina": 0.89,
			"accuracy": 0.88,
			"attack": 0.83,
			"defense": 0.81,
			"evasion": 0.80,
		},
		resetStatsSingle = {
			"value": 0,
			"max": 0,
			"normalized": 1.0
		},
		allStats = {
			"tally": {},
			"monster": {}
		};


	// stats values are based on player level * 9.5
	function reset(who, level) {
		// for each resetStat
		for (var stat in resetStatsAll) {
			// if valid prop
			if (resetStatsAll.hasOwnProperty(stat)) {
				// copy single reset
				allStats[who][stat] = Object.assign({}, resetStatsSingle);
				// if monster then compute max using random

				// compute max
				allStats[who][stat].max = Math.random() * resetStatsAll[stat];
			}
		}
		console.log("Stats.reset()",who,level,allStats[who]);
	}

	function resetTally() {
		allStats.tally = Object.assign({}, resetStats);
	}

	function resetMonster() {
		allStats.tally = Object.assign({}, resetStats);
	}





	function startTally() {
		try {
			// // adjust stats display
			// StatsDisplay.adjustStatsBar("tally", "health", tally_user.stats.health);
			// StatsDisplay.adjustStatsBar("tally", "stamina", tally_user.stats.stamina);
			// StatsDisplay.adjustStatsCircle("tally", tally_user.score.level);

			StatsDisplay.updateAllTallyStatsDisplay();
		} catch (err) {
			console.error(err);
		}
	}




	function resetTallyStats() {
		try {
			tally_user.stats = resetStats;
			TallyStorage.saveData('tally_user', tally_user);
			Sound.playRandomJump();
			StatsDisplay.updateAllTallyStatsDisplay();
		} catch (err) {
			console.error(err);
		}
	}

	function resetMonsterStats(mid) {
		try {
			// tally_nearby_monsters[mid].stats = resetStats;
			// TallyStorage.saveData("tally_nearby_monsters",tally_nearby_monsters);
			// Sound.playRandomJump();
			// StatsDisplay.updateAllTallyMonsterDisplay();
			return resetStats;
		} catch (err) {
			console.error(err);
		}
	}


	function randomize() {
		try {
			for (var stat in tally_user.stats) {
				if (tally_user.stats.hasOwnProperty(stat)) {
					tally_user.stats[stat] = FS_Number.round(Math.random(), 2);
				}
			}
			TallyStorage.saveData('tally_user', tally_user);
			Monster.current().stats = resetStats;
			StatsDisplay.updateAllTallyStatsDisplay();
		} catch (err) {
			console.error(err);
		}
	}

	function updateFromConsumable(statData) {
		try {
			//console.log("📋 Stats.updateFromConsumable()",statData);
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
			TallyStorage.saveData('tally_user', tally_user);
			// update stat display
			$('.tally_stats_table').html(StatsDisplay.returnFullTable("tally", statData.stat));
			// adjust stat bars
			StatsDisplay.adjustStatsBar("tally", statData.stat, tally_user.stats[statData.stat]);
			// test
			//console.log("📋 Stats.updateFromConsumable()", statData, statData.stat, tally_user.stats);
			// if stat is full
			if (tally_user.stats[statData.stat] >= 1) {
				Thought.show("Your " + statData.stat + " is full!", "happy", true);
			} else {
				setTimeout(function() {
					// play sound
					if (upOrDown > 0) {
						Sound.playRandomJump();
						Thought.show("Yay! You increased your " + statData.stat + "!", "happy", true);
					} else if (upOrDown < 0) {
						Sound.playRandomJumpReverse();
						Thought.show("Dang, you lost some " + statData.stat + "!", "sad", true);
					}
				}, 500);

				setTimeout(function() {
					$(".stat-blink").removeClass("stat-blink");
				}, 2000);
			}
		} catch (err) {
			console.error(err);
		}
	}


	/**
	 * 	Get stats of self or opponent
	 */
	function getStat(who) {
		try {
			// reference to stats objects
			let stats = {};
			if (who == "tally")
				stats = tally_user.stats;
			else
				stats = Monster.current().stats;
			//if (DEBUG) console.log("📋 Stats.getStat()", who, stats);
			return stats;
		} catch (err) {
			console.error(err);
		}
	}


	function updateStat(who, statObj) {

		try {} catch (err) {
			console.error(err);
		}
	}
	// update individual stat value, clamp, and return
	function updateStatValue(who, stat, operator, val) {
		try {
			if (DEBUG) console.log("📋 Stats.updateStatValue()", who, stat, operator, val);
			let stats = getStat(who);
			if (operator == "-=")
				stats[stat] -= val;
			else
				stats[stat] += val;
			// clamp and round
			if (DEBUG) console.log("📋 Stats.updateStatValue()", stats[stat]);
			stats[stat] = FS_Number.clamp(FS_Number.round(stats[stat], 2));
			if (DEBUG) console.log("📋 Stats.updateStatValue()", stats[stat]);
			return stats[stat];
		} catch (err) {
			console.error(err);
		}
	}




	// PUBLIC
	return {

		reset: function(who, level){
			reset(who, level);
		},



		startTally: startTally,
		resetTallyStats: resetTallyStats,
		resetMonsterStats: function() {
			return resetMonsterStats();
		},
		randomize: randomize,
		updateFromConsumable: function(data) {
			updateFromConsumable(data);
		},

		getStat: function(who) {
			return getStat(who);
		},
		updateStat: function(who, statObj) {
			updateStat(who, statObj);
		},
		updateStatValue: function(who, stat, operator, val) {
			return updateStatValue(who, stat, operator, val);
		},
		resetStats: resetStats,

	};
})();
