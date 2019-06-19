"use strict";

/*  STATS
 ******************************************************************************/

window.Stats = (function() {
	// PRIVATE

	let DEBUG = true,
		levelMultiplier = 9.5,
		resetStatsAll = {
			"accuracy": 0.91,
			"attack": 0.71,
			"defense": 0.82,
			"evasion": 0.69,
			"health": 1.0,
			"stamina": 0.64,
		},
		resetStatsSingle = {
			"max": 0,
			"normalized": 1.0,
			"val": 0,
		},
		// all stats are stored here
		allStats = {
			"monster": {},
			"tally": {},
		};

	/**
	 * 	Reset a player's stats - called when player levels up and for each new monster
	 */
	function reset(who) {
		try {
			// get level
			let level = getLevel(who);
			// for each resetStat
			for (var stat in resetStatsAll) {
				// if valid prop
				if (resetStatsAll.hasOwnProperty(stat)) {
					// copy single reset
					allStats[who][stat] = Object.assign({}, resetStatsSingle);
					// compute max
					if (who == "monster") {
						// if monster then compute max using random
						allStats[who][stat].max = FS_Number.round((Math.random() * (level * (levelMultiplier * 0.35))) + (level * levelMultiplier), 0);
					} else if (who == "tally") {
						// stats values are based on player level * levelMultiplier * resetStatsAll values
						allStats[who][stat].max = FS_Number.round((level * levelMultiplier * resetStatsAll[stat]), 0);
					}
					// set default value now based on max
					allStats[who][stat].val = allStats[who][stat].max;
				}
			}
			// save if Tally
			if (who == "tally") TallyStorage.saveData('tally_stats', allStats.tally);
			// update display
			StatsDisplay.updateDisplay(who);
			//console.log("📋 Stats.reset()", who, level, JSON.stringify(allStats[who]));
		} catch (err) {
			console.error(err);
		}
	}

	/**
	 * 	Get stats of self or opponent
	 */
	function get(who, stat = "") {
		try {
			//if (DEBUG) console.log("📋 Stats.get()", who, stat, allStats[who]);
			if (stat != "")
				return allStats[who][stat];
			return allStats[who];
		} catch (err) {
			console.error(err);
		}
	}


	/**
	 * 	Update individual stat value, clamp, and return
	 */
	function setVal(who, stat = "", val = null) {
		try {
			if (DEBUG) console.log("📋 Stats.setVal() #1", who, stat, val);
			// should we update the stat by value?
			if (stat != "" && val != null && val != 0) {
				if (DEBUG) console.log("📋 Stats.setVal() #2", allStats[who][stat]);
				// update value, clamp, and round
				allStats[who][stat].val = FS_Number.clamp(FS_Number.round(val, 1), 0, allStats[who][stat].max);
				if (DEBUG) console.log("📋 Stats.setVal() #3", allStats[who][stat]);
				// then update normalized
				allStats[who][stat].normalized = FS_Number.normalize(val, 0, allStats[who][stat].max);
				if (DEBUG) console.log("📋 Stats.setVal() #4", allStats[who][stat]);
			} else {
				console.warn("📋 Stats.setVal() stat and val required!");
			}
			// return that value
			return allStats[who][stat].val;
		} catch (err) {
			console.error(err);
		}
	}

	/**
	 *	For getting Tally stats from Storage
	 */
	function overwrite(who, stats) {
		//if (DEBUG) console.log("📋 Stats.overwrite()", who, stats);
		allStats[who] = stats;
	}
	/**
	 *	Return the level of the player
	 */
	function getLevel(who) {
		let level = 0;
		if (who == "tally") level = tally_user.score.level;
		else if (Monster.currentMID != 0) level = Monster.current().level;
		else level = Monster.returnNewMonsterLevel(); // temp
		//if (DEBUG) console.log("📋 Stats.getLevel()", who + " => " + level);
		return level;
	}

	/**
	 *	Update stats when user clicks on consumable
	 */
	function updateFromConsumable(statData) {
		try {
			let who = "tally";
			//console.log("📋 Stats.updateFromConsumable()",statData);
			let upOrDown = 0;
			// if stat is already full
			if (statData.val > 0 && allStats[who][statData.stat].normalized >= 1) {
				Thought.show("Your " + statData.stat + " is full!", "happy", true);
				return;
			}
			// else, add new stat
			let newStat = FS_Number.round(allStats[who][statData.stat] + statData.val, 2);
			newStat = FS_Number.clamp(newStat, 0, 1);
			if (newStat > allStats[who][statData.stat])
				upOrDown = 1;
			else
				upOrDown = -1;
			// update stat
			allStats[who][statData.stat] = newStat;
			// save user
			TallyStorage.saveData('tally_user', tally_user);
			// update stat display
			$('.tally_stats_table').html(StatsDisplay.returnFullTable("tally", statData.stat));
			// adjust stat bars
			StatsDisplay.adjustStatsBar("tally", statData.stat, allStats[who][statData.stat]);
			// test
			//console.log("📋 Stats.updateFromConsumable()", statData, statData.stat, allStats[who]);
			// if stat is full
			if (allStats[who][statData.stat] >= 1) {
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




	// PUBLIC
	return {
		resetStatsAll: resetStatsAll,
		reset: function(who, level) {
			reset(who, level);
		},
		overwrite: function(who, stats) {
			overwrite(who, stats);
		},
		get: function(who, stat) {
			return get(who, stat);
		},
		setVal: function(who, stat, val) {
			return setVal(who, stat, val);
		},
		getLevel: function(who) {
			return getLevel(who);
		},
		updateFromConsumable: function(data) {
			updateFromConsumable(data);
		}
	};
})();
