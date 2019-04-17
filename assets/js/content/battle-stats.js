"use strict";

/*  CORE
 ******************************************************************************/

window.BattleStats = (function() {
	// PRIVATE


	let tallyStatsBar = {
		"hpbg": { "x":20, "y":0, "w":220, "h":20 },
		"hp":   { "x":20, "y":0, "w":200, "h":20 },
		"mpbg": { "x":20, "y":20, "w":170, "h":12 },
		"mp":   { "x":20, "y":20, "w":150, "h":12 },
		"xpbg": { "x":20, "y":32, "w":150, "h":12 },
		"xp":   { "x":20, "y":32, "w":130, "h":12 },
		"circle":{ "cx":22, "cy":34, "r":22 },
	};

	// combine polygon points
	function polygonPoints({x = 0, y = 0, w = 0, h = 20} = {}) {
		let p1 = x + (h / 3) + "," + y,
			p2 = w + "," + y,
			p3 = w - (h / 3) + "," + (h + y),
			p4 = x + "," + (h + y);
		return p1 + " " + p2 + " " + p3 + " " + p4;
	}

	// starting stats bar for tally or monster
	function initBars(who, stats) {
		let statsBar;
		if (who == "tally")
			statsBar = tallyStatsBar;

		let str = '<svg height="210" width="500">' +
			// hp
			'<polygon points="' + polygonPoints(statsBar.hpbg) + '" style="" class="stat-bar-hp-bg" />' +
			'<polygon points="' + polygonPoints(statsBar.hp) + '" style="" class="stat-bar-hp" />' +
			// mp
			'<polygon points="' + polygonPoints(statsBar.mpbg)  + '" style="" class="stat-bar-mp-bg" />' +
			'<polygon points="' + polygonPoints(statsBar.mp)  + '" style="" class="stat-bar-mp" />';
		if (who == "tally") { // xp
			str += '<polygon points="' + polygonPoints(statsBar.xpbg)  + '" style="" class="stat-bar-xp-bg" />';
			str += '<polygon points="' + polygonPoints(statsBar.xp) + '" style="" class="stat-bar-xp" />';
		}

		str += '<circle cx="'+ statsBar.circle.cx +'" cy="'+ statsBar.circle.cy +'" r="'+ statsBar.circle.r +'" style="" class="" />';
		str += '<text x="'+ statsBar.circle.cx +'" y="'+ statsBar.circle.cy +'" dominant-baseline="middle" text-anchor="middle" class="stat-circle-text">17</text>';
		str += '</svg>';
		return str;
	}

	function adjustStatsBar(who,bar) {
		let statsBar;
		if (who == "tally")
			statsBar = tallyStatsBar;
		console.log("adjustStatsBar()",statsBar,bar);

		// copy stats
		let newStats = statsBar[bar];
		// pick random width
		newStats.w = Math.random() * newStats.w;



		anime({
			targets: '.stat-bar-hp',
			points: [
				{ value: polygonPoints(statsBar[bar]) },
				{ value: polygonPoints(newStats) },
			],
			easing: 'easeOutQuad',
			duration: 2000,
			loop: true
		});

	}




	// PUBLIC
	return {
		initBars: function(who, stats) {
			return initBars(who, stats);
		},
		adjustBar: function(who,bar){
			adjustBar(who,bar);
		},
		tallyStatsBar: function(){
			return tallyStatsBar;
		}
	};
})();
