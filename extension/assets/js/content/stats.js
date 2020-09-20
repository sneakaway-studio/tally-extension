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
		// all stats are stored here, but then T.tally_stats is updated after
		allStats = {
			"monster": {},
			"tally": {},
		},
		allLevels = {
			"monster": 0,
			"tally": T.tally_user.level, // pass this by value
		};



	/**
	 * 	Get stats of self or opponent
	 */
	function get(who) {
		try {
			if (DEBUG) console.log("📋 Stats.get() [1]", who, "allStats =", allStats, "allStats[who] =", allStats[who]);
			// if (DEBUG) console.log("📋 Stats.get()", who, "T.tally_stats =", T.tally_stats);
			// console.trace();

			// if no stats found then initialize before returning
			if (FS_Object.isEmpty(allStats[who])) init(who);

			if (DEBUG) console.log("📋 Stats.get() [2]", who, "allStats =", allStats, "allStats[who] =", allStats[who]);
			return allStats[who];
		} catch (err) {
			console.error(err);
		}
	}
	/**
	 *	Set
	 */
	function set(who, stats) {
		try {
			//if (DEBUG) console.log("📋 Stats.set()", who, stats);
			allStats[who] = stats;
		} catch (err) {
			console.error(err);
		}
	}

	/**
	 *	Initialize and save a stats object for a player | monster
	 */
	function init(who) {
		try {
			if (DEBUG) console.log("📋 Stats.init() [1]", who);

			// update levels
			if (who == "tally") {
				allLevels.tally = T.tally_user.level || 1;
			} else if (who == "monster") {
				allLevels.monster = Monster.current().level || 1;
			}

			// get level
			let level = allLevels[who];
			if (!level) {
				if (DEBUG) console.log("📋 Stats.reset()", who, level, "NO LEVEL");
				return;
			}
			if (DEBUG) console.log("📋 Stats.init() [2]", who, "level =", level);

			// for each resetStat
			for (var stat in resetStatsAll) {
				// if valid prop
				if (resetStatsAll.hasOwnProperty(stat)) {
					// if (DEBUG) console.log("📋 Stats.init() [3.1]", who, "stat =",stat);
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
					// if (DEBUG) console.log("📋 Stats.init() [3.2]", who, "stat =",stat);
				}
			}
			if (DEBUG) console.log("📋 Stats.init() [4]", "allStats =", allStats);
			if (DEBUG) console.log("📋 Stats.init() [4] same as above??", "T.tally_stats =", T.tally_stats); // same as above?

			if (who === "tally") save(who);

		} catch (err) {
			console.error(err);
		}
	}


	/**
	 * 	Reset a player's stats - called when player levels up and for each new monster
	 */
	function reset(who) {
		try {
			// allow offline
			if (Page.data.mode.notActive) return;
			// don't allow if mode disabled
			if (T.tally_options.gameMode === "disabled") return;

			if (DEBUG) console.log("📋 Stats.reset()", who, JSON.stringify(allStats[who]), JSON.stringify(T.tally_stats));

			init(who);

			// save if Tally
			if (who == "tally") {
				save('tally');
				// update display
				StatsDisplay.updateDisplay('tally');
			}
			// only update monster if battle going on
			else if (Battle.active)
				// update display
				StatsDisplay.updateDisplay('monster');

			if (DEBUG) console.log("📋 Stats.reset()", who, JSON.stringify(allStats[who]));
		} catch (err) {
			console.error(err);
		}
	}

	/**
	 * 	Save stats in background, saving tally only
	 */
	function save(who) {
		try {
			// allow offline
			if (Page.data.mode.notActive) return;
			// don't allow if mode disabled
			if (T.tally_options.gameMode === "disabled") return;

			if (DEBUG) console.log("📋 Stats.save()", who);
			if (who === "tally") {
				T.tally_stats = allStats.tally;
			}
			TallyStorage.saveData("tally_stats", allStats.tally, "📋 Stats.save()");
		} catch (err) {
			console.error(err);
		}
	}


	/**
	 * 	Update individual stat value, clamp, and return
	 */
	function setVal(who, stat = "", change = null) {
		try {
			if (DEBUG) console.log("📋 Stats.setVal() [1]", who, stat, change);
			let newVal = 0,
				normalized = 0;
			// should we update the stat by value?
			if (stat != "") { // && change !== 0) {
				if (DEBUG) console.log("📋 Stats.setVal() [2]", who, stat, change, "current =", allStats[who][stat]);

				// update value, clamp, and round
				allStats[who][stat].val = FS_Number.clamp(FS_Number.round(change, 1), 0, allStats[who][stat].max);
				// make sure we end up w/ a number
				if (isNaN(allStats[who][stat].val)) allStats[who][stat].val = 0;

				// then update normalized
				allStats[who][stat].normalized = FS_Number.normalize(allStats[who][stat].val, 0, allStats[who][stat].max);
				// make sure we end up w/ a number
				if (isNaN(allStats[who][stat].normalized)) allStats[who][stat].normalized = 0;

				if (DEBUG) console.log("📋 Stats.setVal() [3]", who, stat, change, "current =", allStats[who][stat]);
			} else {
				console.warn("📋 Stats.setVal() stat (string) and change (value) required!", who, stat, change);
			}
			// return that value
			return allStats[who][stat].val;
		} catch (err) {
			console.error(err);
		}
	}


	/**
	 *	Return the level of the player or monster
	 */
	function getLevel(who) {
		try {
			if (DEBUG) console.log("📋 Stats.getLevel()", who, "T.tally_user.level =", T.tally_user.level);

			// allow offline
			if (Page.data.mode.notActive) return;
			// don't allow if mode disabled
			if (T.tally_options.gameMode === "disabled") return;

			// error checking
			if (!FS_Object.prop(T.tally_user)) return console.warn("📋 Stats.getLevel()", " no T.tally_user.level");

			// default
			let level = 0;

			if (who == "tally") {
				level = T.tally_user.level;
				if (DEBUG) console.log("📋 Stats.getLevel()", who + " => " + level);
			} else if (Monster.currentMID > 0 || Monster.current().level > 0) {
				level = Monster.current().level;
				if (DEBUG) console.log("📋 Stats.getLevel()", who + " => " + level, Monster.current());
			}
			return level;
		} catch (err) {
			console.error(err);
		}
	}

	/**
	 *	Update stats when user clicks on consumable
	 */
	function updateFromConsumable(consumable) {
		try {
			// allow offline
			if (Page.data.mode.notActive) return;
			// don't allow if mode disabled
			if (T.tally_options.gameMode === "disabled") return;

			let who = "tally",
				gainedLost = 0;

			// make sure everything is a number
			consumable.max = Number(consumable.max);
			consumable.min = Number(consumable.min);
			consumable.val = Number(consumable.val);

			if (DEBUG) console.log("📋 Stats.updateFromConsumable() [1] consumable =", consumable,
				"val =", allStats[who][consumable.stat].val,
				"max =", allStats[who][consumable.stat].max,
				"allStats[who] = ", allStats[who]
			);

			// EXAMPLE
			// {
			// 	category: "error"
			// 	ext: ".gif"
			// 	max: "0"
			// 	min: "-0.2"
			// 	name: "runtime"
			// 	ref: "a"
			// 	slug: "runtime-bug"
			// 	sound: "cautious"
			// 	stat: "evasion"
			// 	type: "bug"
			// 	val: -0.1765
			// }



			// save original value so we can make up or down sound
			let originalStatVal = allStats[who][consumable.stat].val;


			// if consumable has positive val, and stat is already full
			if (consumable.val > 0 && allStats[who][consumable.stat].val >= allStats[who][consumable.stat].max) {
				Dialogue.showData({
					"text": `Your <span class='text-${consumable.stat}'>${consumable.stat}</span> is already full!`,
					"mood": "happy"
				}, {
					instant: true
				});
				return;
			}

			// else, add new stat
			let change = allStats[who][consumable.stat].val * consumable.val;
			setVal(who, consumable.stat, allStats[who][consumable.stat].val + change);
			// save stats in background
			save('tally');

			// update bars, table
			StatsDisplay.updateDisplay('tally',[consumable.stat]);

			// adjust stat bars
			//		StatsDisplay.adjustStatsBar("tally", consumable.stat, allStats[who][consumable.stat]);
			// test
			if (DEBUG) console.log("📋 Stats.updateFromConsumable() [2]", consumable, consumable.stat, allStats[who]);
			// if stat is full
			if (allStats[who][consumable.stat].val >= allStats[who][consumable.stat].max) {
				Dialogue.showStr(`Your <span class='text-${consumable.stat}'>${consumable.stat}</span> is now full!`, "happy");
			} else {
				setTimeout(function() {
					// play sound
					if (originalStatVal < allStats[who][consumable.stat].val) {
						Sound.playRandomJump();
						Dialogue.showStr(`Yay! You gained <span class='text-${consumable.stat}'>` +
							numeral(change).format('0a') + ` ${consumable.stat}</span>!`, "happy");
					} else if (originalStatVal > allStats[who][consumable.stat].val) {
						Sound.playRandomJumpReverse();
						Dialogue.showStr(`Dang, you lost <span class='text-${consumable.stat}'>` +
							(-1 * numeral(change).format('0a')) + ` ${consumable.stat}</span>!`, "sad");
					}
				}, 200);

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
		reset: reset,
		set: set,
		get: function(who) {
			return get(who);
		},
		setVal: function(who, stat, change) {
			return setVal(who, stat, change);
		},
		getLevel: function(who) {
			return getLevel(who);
		},
		updateFromConsumable: updateFromConsumable,

	};
})();
