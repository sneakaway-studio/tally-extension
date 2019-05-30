"use strict";

/*  STATS DISPLAY
 ******************************************************************************/

window.StatsDisplay = (function() {
	// PRIVATE


	/**
	 * Starting point for stats svg coordinates
	 */
	let tallyStatsSVGPoints = {
		"healthbg": { "val": 0, "x":0, "y":0, "w":200, "h":20 },
		"health": { "val": 0, "x":0, "y":0, "w":0, "h":20 }, // start @ zero
		"staminabg": { "val": 0, "x":0, "y":20, "w":170, "h":12 },
		"stamina": { "val": 0, "x":0, "y":20, "w":0, "h":12 }, // start @ zero
		"circle":{ "val": 0,"cx":26, "cy":34, "r":22, "text":0 },
	};
	// assign by value, not reference
	let monsterStatsSVGPoints = Object.assign({}, tallyStatsSVGPoints);

	/**
	 * 	Combine stat bar polygon points
	 */
	function combineSVGPoints({ x = 0, y = 0, w = 0, h = 0 } = {}) {
		try {
			let p1 = x + "," + y,
				p2 = w + "," + y,
				p3 = Math.ceil(w - (h / 3)) + "," + (h + y),
				p4 = Math.ceil(x - (h / 3)) + "," + (h + y);
			return p1 + " " + p2 + " " + p3 + " " + p4;
		} catch (err) {
			console.error(err);
		}
	}
	// initial stats bar for tally or monster
	function returnInitialSVG(who) {
		try {
			// get player's stats SVG coordinates
			let svgPoints = playerStatsSVGPoints(who),
				str = '';
			console.log("📈 StatsDisplay.returnInitialSVG()",who, svgPoints, "health="+svgPoints.health.val, "stamina="+svgPoints.stamina.val);

			str += '<svg height="65" width="230" class="stats-display">';
			str += '<g class="stat-bars">';
			str += '<polygon points="' + combineSVGPoints(svgPoints.healthbg) + '" class="stat-bar-health-bg" />';
			str += '<polygon points="' + combineSVGPoints(svgPoints.health) + '" data-value="'+ svgPoints.health.val +'" class="stat-bar-health" />';
			str += '<polygon points="' + combineSVGPoints(svgPoints.staminabg) + '" class="stat-bar-stamina-bg" />';
			str += '<polygon points="' + combineSVGPoints(svgPoints.stamina) + '" data-value="'+ svgPoints.stamina.val +'" class="stat-bar-stamina" />';
			str += '</g>';
			str += '<circle cx="' + svgPoints.circle.cx + '" cy="' + svgPoints.circle.cy;
			str += '" r="' + svgPoints.circle.r + '" data-value="0" class="stat-bar-circle" />';
			str += '<text x="' + svgPoints.circle.cx + '" y="' + svgPoints.circle.cy;
			str += '" dominant-baseline="middle" text-anchor="middle" class="stat-bar-circle-text">0</text>';
			str += '</svg>';
			return str;
		} catch (err) {
			console.error(err);
		}
	}
	/**
	 * 	Return the full stats table that appears under the stats SVG
	 */
	function returnFullTable(who, changed = "") {
		try {
			let stats = playerStats(who),
				str = "",
				blink = "";
			str += "<div><table>";
			for (var key in stats) {
				if (stats.hasOwnProperty(key)) {
					blink = "";
					if (changed == key) blink = " stat-blink";
					str += "<tr class='text-" + key + blink + "'><td>" + key + "</td><td>" + JSON.stringify(stats[key]) + "</td></tr>";
				}
			}
			str += "</table></div>";
			return str;
		} catch (err) {
			console.error(err);
		}
	}

	function updateAllTallyStatsDisplay() {
		try {
			//console.log("📈 StatsDisplay.updateAllTallyStatsDisplay()", tally_user.stats);
			// bars, circle, table
			adjustStatsBar("tally", "health", tally_user.stats.health);
			adjustStatsBar("tally", "stamina", tally_user.stats.stamina);
			adjustStatsCircle("tally", tally_user.score.level);
			$('.tally_stats_table').html(returnFullTable("tally"));
		} catch (err) {
			console.error(err);
		}
	}

	function updateAllMonsterStatsDisplay() {
		try {
			// get current monster
			let monster = Monster.current();
			console.log("📈 StatsDisplay.updateAllMonsterStatsDisplay()", monster);
			// bars, circle, table
			adjustStatsBar("monster", "health", monster.stats.health);
			adjustStatsBar("monster", "stamina", monster.stats.stamina);
			adjustStatsCircle("monster", monster.level);
			$('.monster_stats_full').html(returnFullTable("monster"));
		} catch (err) {
			console.error(err);
		}
	}

	/**
	 * 	Adjust stats bars for Tally *values are normalized*
	 */
	function adjustStatsBar(who, bar, val) {
		try {
			//console.log("📈 StatsDisplay.adjustStatsBar()1", who, bar, val);
			if (bar != "health" && bar != "stamina") return;
			// clean value
			val = FS_Number.round(val, 2);
			// get player's stats display coordinates
			let statsDisplay = playerStatsSVGPoints(who);
			// save current bar coordinates (assign object by value (not reference))
			let oldBar = Object.assign({}, statsDisplay[bar]);
			// set new width
			statsDisplay[bar].w = val * statsDisplay[bar + "bg"].w;
			// set new value
			statsDisplay[bar].val = val;
			// save data-value
			$('.' + who + '_stats .stat-bar-' + bar).attr("data-value", val);
			// log
			//console.log("📈 StatsDisplay.adjustStatsBar()2", who, bar, val, oldBar, statsDisplay[bar]);
			// animation
			anime({
				targets: '.' + who + '_stats .stat-bar-' + bar,
				points: [{
					value: combineSVGPoints(oldBar)
				}, {
					value: combineSVGPoints(statsDisplay[bar])
				}],
				easing: 'easeOutQuad',
				duration: 1000,
				complete: function() {
					// save stats
					playerStatsSVGPoints(who, statsDisplay);
				}
			});
		} catch (err) {
			console.error(err);
		}
	}
	// //testing
	// $("body").mousemove(function(event) {
	// 	var msg = "Handler for .mousemove() called at " + event.pageX + ", " + event.pageY;
	// 	let normalized = FS_Number.normalize(event.pageX, 0, $(window).width());
	// 	console.log(normalized);
	// 	adjustStatsBar("tally","stamina",normalized);
	// 	// adjustStatsCircle(normalized);
	// });


	/**
	 * 	Adjust stats circle for Tally
	 *	*circle circumference is normalized so xp needs to be 0–1
	 */
	function adjustStatsCircle(who, level) {
		try {
			// clean value
			level = FS_Number.round(level, 2);
			// xp required to advance to next level
			let xpGoal = gameRules.levels[tally_user.score.level + 1].xp;
			// normalize
			let xpNormalized = (xpGoal - tally_user.score.score) / xpGoal;

			//console.log("📈 StatsDisplay.adjustStatsCircle() --> level =", level, "xpGoal =", xpGoal, tally_user.score.score, xpNormalized);

			// get player's stats display coordinates
			let statsDisplay = playerStatsSVGPoints(who);
			// save old values
			let oldCircle = statsDisplay.circle;
			// save data-value
			$('.' + who + '_stats .stat-bar-circle').attr("data-value", xpNormalized);
			// get circumference value
			let circumference = FS_Number.map(xpNormalized, 0, 1, 138, 0);
			// Set the Offset
			$('.' + who + '_stats .stat-bar-circle').css({
				"strokeDashoffset": circumference
			});
			// log
			//console.log("📈 StatsDisplay.adjustStatsCircle()", who, level, circumference);
			adjustStatsCircleText(who, level);
		} catch (err) {
			console.error(err);
		}
	}
	// test circle (set xpGoal = screen width)
	// $(document).mousemove(function(event) {
	// 	console.log(event.pageX, event.pageY);
	// 	adjustStatsCircle("tally", event.pageX * 0.01);
	// });

	function adjustStatsCircleText(who, val) {
		try {
			// get old value
			let oldText = $('.' + who + '_stats .stat-bar-circle-text').html();
			// create object to manipulate
			var d = {
				val: oldText
			};
			anime({
				targets: d,
				val: Math.ceil(val),
				duration: 1000,
				round: 1,
				easing: 'linear',
				update: function() {
					//console.log(d);
					$('.' + who + '_stats .stat-bar-circle-text').html(d.val);
				},
				complete: function() {
					// save stats
					//playerStatsSVGPoints(who, statsDisplay);
				}
			});
		} catch (err) {
			console.error(err);
		}
	}

	/**
	 * 	(save and) return player's stats display coordinates
	 */
	function playerStatsSVGPoints(who, statsDisplay = null) {
		try {
			//console.log("📈 StatsDisplay.playerStatsSVGPoints()",who, statsDisplay);
			if (who == "tally") {
				if (statsDisplay !== null)
					tallyStatsSVGPoints = statsDisplay;
				return tallyStatsSVGPoints;
			} else if (who == "monster") {
				if (statsDisplay !== null)
					monsterStatsSVGPoints = statsDisplay;
				return monsterStatsSVGPoints;
			}
		} catch (err) {
			console.error(err);
		}
	}

	/**
	 * 	(save and) return player's stats display coordinates
	 */
	function playerStats(who) {
		try {
			let stats = null;
			if (who == "tally") {
				stats = tally_user.stats;
			} else if (who == "monster") {
				stats = Monster.stats;
			}
			return stats;
		} catch (err) {
			console.error(err);
		}	
	}


	// PUBLIC
	return {
		returnInitialSVG: function(who) {
			return returnInitialSVG(who);
		},
		returnFullTable: function(who,changed) {
			return returnFullTable(who,changed);
		},
		// showStatsFull: function(who){
		// 	showStatsFull(who);
		// },
		adjustStatsBar: function(who, bar, val) {
			adjustStatsBar(who, bar, val);
		},
		adjustStatsCircle: function(who, val) {
			adjustStatsCircle(who, val);
		},
		updateAllTallyStatsDisplay: updateAllTallyStatsDisplay,
		updateAllMonsterStatsDisplay: updateAllMonsterStatsDisplay

	};
})();
