"use strict";

/*  BATTLE STATS
 ******************************************************************************/

window.BattleStats = (function() {
	// PRIVATE






	/**
	 * Starting point for stats svg coordinates
	 */
	let tallyStatsPoints = {
		"hpbg": { "x":0, "y":0, "w":200, "h":20 },
		"hp":   { "x":0, "y":0, "w":180, "h":20 },
		"mpbg": { "x":0, "y":20, "w":150, "h":12 },
		"mp":   { "x":0, "y":20, "w":130, "h":12 },
		// "xpbg": { "x":0, "y":32, "w":130, "h":12 },
		// "xp":   { "x":0, "y":32, "w":110, "h":12 },
		"circle":{ "cx":26, "cy":34, "r":22, "text":0 },
	};
	let monsterStatsPoints = tallyStatsPoints;

	/**
	 * 	Combine stat bar polygon points
	 */
	function combinePoints({ x = 0, y = 0, w = 0, h = 0 } = {}) {
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
		// hp
		str += '<polygon points="' + combinePoints(statsDisplay.hpbg) + '" class="stat-bar-hp-bg" />' +
			'<polygon points="' + combinePoints(statsDisplay.hp) + '" data-value="0" class="stat-bar-hp" />';
		// mp
		str += '<polygon points="' + combinePoints(statsDisplay.mpbg) + '" class="stat-bar-mp-bg" />' +
			'<polygon points="' + combinePoints(statsDisplay.mp) + '" data-value="0" class="stat-bar-mp" />';
		// // xp (only for tally)
		// if (who == "tally") {
		// 	str += '<polygon points="' + combinePoints(statsDisplay.xpbg) + '" class="stat-bar-xp-bg" />';
		// 	str += '<polygon points="' + combinePoints(statsDisplay.xp) + '" data-value="0" class="stat-bar-xp" />';
		// }
		str += '</g>';

		// circle
		str += '<circle cx="' + statsDisplay.circle.cx + '" cy="' + statsDisplay.circle.cy +
			'" r="' + statsDisplay.circle.r + '" data-value="0" class="stat-bar-circle" />';
		str += '<text x="' + statsDisplay.circle.cx + '" y="' + statsDisplay.circle.cy +
			'" dominant-baseline="middle" text-anchor="middle" class="stat-bar-circle-text">0</text>';
		str += '</svg>';
		return str;
	}






	/**
	 * 	Adjust stats bars for Tally
	 */
	function adjustStatsBar(who, bar, val) {
		// clean value
		val = NumberFunctions.round(val, 2);
		// get player's stats display coordinates
		let statsDisplay = playerStatsDisplayCoords(who);
		// save old bar
		let oldBar = statsDisplay[bar];
		// save data-value
		$('.' + who + '_stats .stat-bar-' + bar).attr("data-value", val);
		// set new width
		statsDisplay[bar].w = val * statsDisplay[bar + "bg"].w;
		// log
		//console.log("adjustStatsBar()",who,bar,val);
		// animation
		anime({
			targets: '.' + who + '_stats .stat-bar-' + bar,
			points: [
				{ value: combinePoints(oldBar) },
				{ value: combinePoints(statsDisplay[bar]) },
			],
			easing: 'easeOutQuad',
			duration: 1000,
			complete: function() {
				// save stats
				playerStatsDisplayCoords(who, statsDisplay);
			}
		});
	}
	// testing
	// $( "body" ).mousemove(function( event ) {
	//   var msg = "Handler for .mousemove() called at " + event.pageX + ", " + event.pageY;
	//   let normalized = NumberFunctions.normalize(event.pageX,0,$(window).width());
	//   console.log(normalized);
	//  // adjustStatsBar("tally","mp",normalized);
	//  adjustStatsCircle(normalized);
	// });

	/**
	 * 	Adjust stats circle for Tally
	 */
	function adjustStatsCircle(who, val) {
		// clean value
		val = NumberFunctions.round(val, 2);
		// get player's stats display coordinates
		let statsDisplay = playerStatsDisplayCoords(who);
		// save old value
		let oldCircle = statsDisplay.circle;
		// save data-value
		$('.' + who + '_stats .stat-bar-circle').attr("data-value", val);
		// get circumference value
		let circumference = NumberFunctions.map(val, 0, 1, 138, 0);
		// Set the Offset
		$('.' + who + '_stats .stat-bar-circle').css({
			"strokeDashoffset": circumference
		});
		// log
		//console.log("adjustStatsCircle()", who, val, circumference);
		adjustStatsCircleText(who, val * 30);
	}

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
		}
	};
})();
