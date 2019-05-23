"use strict";

/*  STATS DISPLAY
 ******************************************************************************/

window.StatsDisplay = (function() {
	// PRIVATE






	/**
	 * Starting point for stats svg coordinates
	 */
	let tallyStatsPoints = {
		"healthbg": {
			"val": 0,
			"x": 0,
			"y": 0,
			"w": 200,
			"h": 20
		},
		"health": {
			"val": 0,
			"x": 0,
			"y": 0,
			"w": 0,
			"h": 20
		}, // start @ zero
		"staminabg": {
			"val": 0,
			"x": 0,
			"y": 20,
			"w": 150,
			"h": 12
		},
		"stamina": {
			"val": 0,
			"x": 0,
			"y": 20,
			"w": 0,
			"h": 12
		}, // start @ zero
		"circle": {
			"val": 0,
			"cx": 26,
			"cy": 34,
			"r": 22,
			"text": 0
		},
	};
	let monsterStatsPoints = tallyStatsPoints;

	/**
	 * 	Combine stat bar polygon points
	 */
	function combinePoints({
		x = 0,
		y = 0,
		w = 0,
		h = 0
	} = {}) {
		let p1 = x + "," + y,
			p2 = w + "," + y,
			p3 = Math.ceil(w - (h / 3)) + "," + (h + y),
			p4 = Math.ceil(x - (h / 3)) + "," + (h + y);
		return p1 + " " + p2 + " " + p3 + " " + p4;
	}
	// starting stats bar for tally or monster
	function returnDisplay(who) {
		// get player's stats display coordinates
		let statsDisplay = playerStatsDisplayCoords(who),
			str = '';

		str += '<svg height="65" width="230" class="stats-display">';
		str += '<g class="stat-bars">';
		str += '<polygon points="' + combinePoints(statsDisplay.healthbg) + '" class="stat-bar-health-bg" />';
		str += '<polygon points="' + combinePoints(statsDisplay.health) + '" data-value="0" class="stat-bar-health" />';
		str += '<polygon points="' + combinePoints(statsDisplay.staminabg) + '" class="stat-bar-stamina-bg" />';
		str += '<polygon points="' + combinePoints(statsDisplay.stamina) + '" data-value="0" class="stat-bar-stamina" />';
		str += '</g>';
		str += '<circle cx="' + statsDisplay.circle.cx + '" cy="' + statsDisplay.circle.cy;
		str += '" r="' + statsDisplay.circle.r + '" data-value="0" class="stat-bar-circle" />';
		str += '<text x="' + statsDisplay.circle.cx + '" y="' + statsDisplay.circle.cy;
		str += '" dominant-baseline="middle" text-anchor="middle" class="stat-bar-circle-text">0</text>';
		str += '</svg>';
		return str;
	}






	/**
	 * 	Adjust stats bars for Tally
	 *	*values are normalized
	 */
	function adjustStatsBar(who, bar, val) {
		console.log("adjustStatsBar()", who, bar, val);
		// clean value
		val = FS_Number.round(val, 2);
		// get player's stats display coordinates
		let statsDisplay = playerStatsDisplayCoords(who);
		// save old bar
		let oldBar = statsDisplay[bar];
		// save data-value
		$('.' + who + '_stats .stat-bar-' + bar).attr("data-value", val);
		// set new width
		statsDisplay[bar].w = val * statsDisplay[bar + "bg"].w;
		// set new value
		statsDisplay[bar].val = val;
		// log
		console.log("adjustStatsBar()", who, bar, val, oldBar, statsDisplay[bar]);
		// animation
		anime({
			targets: '.' + who + '_stats .stat-bar-' + bar,
			points: [{
					value: combinePoints(oldBar)
				},
				{
					value: combinePoints(statsDisplay[bar])
				},
			],
			easing: 'easeOutQuad',
			duration: 1000,
			begin: function() {
				//if (oldBar)
				// play sound
				Sound.playRandomJump();
			},
			complete: function() {
				// save stats
				playerStatsDisplayCoords(who, statsDisplay);
			}
		});
	}
	// testing
	// $( "body" ).mousemove(function( event ) {
	//   var msg = "Handler for .mousemove() called at " + event.pageX + ", " + event.pageY;
	//   let normalized = FS_Number.normalize(event.pageX,0,$(window).width());
	//   console.log(normalized);
	//  // adjustStatsBar("tally","stamina",normalized);
	//  adjustStatsCircle(normalized);
	// });


	/**
	 * 	Adjust stats circle for Tally
	 *	*circle circumference is normalized so xp needs to be 0–1
	 */
	function adjustStatsCircle(who, level) {
		// clean value
		level = FS_Number.round(level, 2);
		// xp required to advance to next level
		let xpGoal = gameRules.levels[tally_user.score.level+1].xp;
		// normalize
		let xpNormalized = (xpGoal - tally_user.score.score) / xpGoal;

		//console.log("adjustStatsCircle() --> level =", level, "xpGoal =", xpGoal, tally_user.score.score, xpNormalized);

		// get player's stats display coordinates
		let statsDisplay = playerStatsDisplayCoords(who);
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
		//console.log("adjustStatsCircle()", who, level, circumference);
		adjustStatsCircleText(who, level);
	}
	// test circle (set xpGoal = screen width)
	// $(document).mousemove(function(event) {
	// 	console.log(event.pageX, event.pageY);
	// 	adjustStatsCircle("tally", event.pageX * 0.01);
	// });

	function adjustStatsCircleText(who, val) {
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
				//playerStatsDisplayCoords(who, statsDisplay);
			}
		});
	}



	/**
	 * 	(save and) return player's stats display coordinates
	 */
	function playerStatsDisplayCoords(who, statsDisplay = null) {
		if (who == "tally") {
			if (statsDisplay !== null)
				tallyStatsPoints = statsDisplay;
			return tallyStatsPoints;
		} else if (who == "monster") {
			if (statsDisplay !== null)
				monsterStatsPoints = statsDisplay;
			return monsterStatsPoints;
		}
	}




	// PUBLIC
	return {
		returnDisplay: function(who) {
			return returnDisplay(who);
		},
		adjustStatsBar: function(who, bar, val) {
			adjustStatsBar(who, bar, val);
		},
		adjustStatsCircle: function(who, val) {
			adjustStatsCircle(who, val);
		},
		adjustStatsCircleText: function(who, val) {
			adjustStatsCircleText(who, val);
		},
	};
})();
