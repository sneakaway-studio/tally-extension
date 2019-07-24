"use strict";

/*  STATS
 ******************************************************************************/

window.Stats = (function() {
	// PRIVATE
	let DEBUG = Debug.ALL.Stats,
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
					allStats[who][stat] = JSON.parse(JSON.stringify(resetStatsSingle));
					// compute max
					if (who == "monster") {
						// if monster then compute max using random
						allStats[who][stat].max = FS_Number.round((Math.random() * (level * (levelMultiplier * -0.25))) + (level * levelMultiplier), 0);
					} else if (who == "tally") {
						// stats values are based on player level * levelMultiplier * resetStatsAll values
						allStats[who][stat].max = FS_Number.round((level * levelMultiplier * resetStatsAll[stat]), 0);
					}
					// set default value now based on max
					allStats[who][stat].val = allStats[who][stat].max;
				}
			}
			// save if Tally
			if (who == "tally") {
				save('tally');
				// update display
				StatsDisplay.updateDisplay('tally');
			}
			// only update monster if battle going on
			else if (Battle.active())
				// update display
				StatsDisplay.updateDisplay('monster');
			console.log("📋 Stats.reset()", who, level, JSON.stringify(allStats[who]));
		} catch (err) {
			console.error(err);
		}
	}

	/**
	 * 	Save stats in background, saving tally only
	 */
	function save(who) {
		try {
			//if (DEBUG) console.log("📋 Stats.save()", who);
			TallyStorage.saveData('tally_stats', allStats.tally, "📋 Stats.save()");
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
	function setVal(who, stat = "", change = null) {
		try {
			let newVal = 0,
				normalized = 0;
			// should we update the stat by value?
			if (stat != "" && change !== 0) {
				if (DEBUG) console.log("📋 Stats.setVal() #1", who, stat, change, allStats[who][stat]);

				// update value, clamp, and round
				allStats[who][stat].val = FS_Number.clamp(FS_Number.round(change, 1), 0, allStats[who][stat].max);
				// make sure we end up w/ a number
				if (isNaN(allStats[who][stat].val)) allStats[who][stat].val = 0;

				// then update normalized
				allStats[who][stat].normalized = FS_Number.normalize(allStats[who][stat].val, 0, allStats[who][stat].max);
				// make sure we end up w/ a number
				if (isNaN(allStats[who][stat].normalized)) allStats[who][stat].normalized = 0;

				if (DEBUG) console.log("📋 Stats.setVal() #2", who, stat, change, allStats[who][stat]);
			} else {
				console.warn("📋 Stats.setVal() stat (string) and change (value) required!");
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
	 *	Return the level of the player or monster
	 */
	function getLevel(who) {
		let level = 0;
		if (who == "tally") level = tally_user.level;
		else if (Monster.currentMID !== 0) level = Monster.current().level;
		else level = Monster.returnNewMonsterLevel(); // temp
		//if (DEBUG) console.log("📋 Stats.getLevel()", who + " => " + level);
		return level;
	}

	/**
	 *	Update stats when user clicks on consumable
	 */
	function updateFromConsumable(consumable) {
		try {
			let who = "tally";
			console.log("📋 Stats.updateFromConsumable() 1", consumable);
			// save original so we can make up or down sound
			let originalStatVal = allStats[who][consumable.stat].val;
			// if stat is already full
			if (consumable.val > 0 && allStats[who][consumable.stat].val >= allStats[who][consumable.stat].max) {
				Dialogue.showStr("Your " + consumable.stat + " is full!", "happy", true);
				return;
			}
			// else, add new stat
			let change = allStats[who][consumable.stat].val * consumable.val;
			setVal(who, consumable.stat, allStats[who][consumable.stat].val + change);
			// save stats in background
			save('tally');

			// update stat display
			//		$('.tally_stats_table').html(StatsDisplay.returnFullTable("tally", consumable.stat));

			StatsDisplay.updateDisplay('tally');

			// adjust stat bars
			//		StatsDisplay.adjustStatsBar("tally", consumable.stat, allStats[who][consumable.stat]);
			// test
			console.log("📋 Stats.updateFromConsumable()", consumable, consumable.stat, allStats[who]);
			// if stat is full
			if (allStats[who][consumable.stat].val >= allStats[who][consumable.stat].max) {
				Dialogue.showStr("Your " + consumable.stat + " is full!", "happy", true);
			} else {
				setTimeout(function() {
					// play sound
					if (originalStatVal < allStats[who][consumable.stat].val) {
						Sound.playRandomJump();
						Dialogue.showStr("Yay! You increased your " + consumable.stat + "!", "happy", true);
					} else if (originalStatVal > allStats[who][consumable.stat].val) {
						Sound.playRandomJumpReverse();
						Dialogue.showStr("Dang, you lost some " + consumable.stat + "!", "sad", true);
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
