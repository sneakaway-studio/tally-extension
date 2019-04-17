"use strict";

/*  BATTLE STATS
 ******************************************************************************/

window.BattleStats = (function() {
	// PRIVATE







	let tallyStatsBars = {
		"hpbg": { "x":0, "y":0, "w":220, "h":20 },
		"hp":   { "x":0, "y":0, "w":200, "h":20 },
		"mpbg": { "x":0, "y":20, "w":170, "h":12 },
		"mp":   { "x":0, "y":20, "w":150, "h":12 },
		"xpbg": { "x":0, "y":32, "w":150, "h":12 },
		"xp":   { "x":0, "y":32, "w":130, "h":12 },
		"circle":{ "cx":26, "cy":34, "r":22, "text":0 },
	};

	// combine polygon points
	function combinePoints({x = 0, y = 0, w = 0, h = 0} = {}) {
		let p1 = x + "," + y,
			p2 = w + "," + y,
			p3 = Math.ceil(w - (h / 3)) + "," + (h + y),
			p4 = Math.ceil(x - (h / 3)) + "," + (h + y);
		return p1 + " " + p2 + " " + p3 + " " + p4;
	}
	// starting stats bar for tally or monster
	function initBars(who, stats) {
		let statsBars, str = '';

		// which stats to init
		if (who == "tally")
			statsBars = tallyStatsBars;
		else if (who == "monster")
			statsBars = monsterStatsBarPoints;

		str += '<svg height="210" width="500" class="tally-stats">';
		str += '<g class="stat-bars">';
		// hp
		str += '<polygon points="' + combinePoints(statsBars.hpbg) + '" class="stat-bar-hp-bg" />' +
			'<polygon points="' + combinePoints(statsBars.hp) + '" data-value="0" class="stat-bar-hp" />';
		// mp
		str += '<polygon points="' + combinePoints(statsBars.mpbg) + '" class="stat-bar-mp-bg" />' +
			'<polygon points="' + combinePoints(statsBars.mp) + '" data-value="0" class="stat-bar-mp" />';
		// xp (only for tally)
		if (who == "tally") {
			str += '<polygon points="' + combinePoints(statsBars.xpbg) + '" class="stat-bar-xp-bg" />';
			str += '<polygon points="' + combinePoints(statsBars.xp) + '" data-value="0" class="stat-bar-xp" />';
		}
		str += '</g>';

		// circle
		str += '<circle cx="' + statsBars.circle.cx + '" cy="' + statsBars.circle.cy +
			'" r="' + statsBars.circle.r + '" data-value="0" class="stat-bar-circle" />';
		str += '<text x="' + statsBars.circle.cx + '" y="' + statsBars.circle.cy +
			'" dominant-baseline="middle" text-anchor="middle" class="stat-bar-circle-text">17</text>';
		str += '</svg>';
		return str;
	}

	function adjustTallyBar(bar,val) {
		// clean value
		val = NumberFunctions.round(val,2);
		// save old bar
		let oldBar = tallyStatsBars[bar];
		// save data-value
		$('.stat-bar-'+bar).attr("data-value",val);
		// set new width
		tallyStatsBars[bar].w = val * tallyStatsBars[bar+"bg"].w;
		// log
		//console.log("adjustTallyBar()",bar,val);
		// animation
		anime({
			targets: '.stat-bar-'+bar,
			points: [
				{ value: combinePoints(oldBar) },
				{ value: combinePoints(tallyStatsBars[bar]) },
			],
			easing: 'easeOutQuad',
			duration: 1000
		});
	}
	// testing
	// $( "body" ).mousemove(function( event ) {
	//   var msg = "Handler for .mousemove() called at " + event.pageX + ", " + event.pageY;
	//   let normalized = NumberFunctions.normalize(event.pageX,0,$(window).width());
	//   console.log(normalized);
	//  // adjustTallyBar("mp",normalized);
	//  adjustTallyCircle(normalized);
	// });









	function adjustTallyCircle(val) {
		// clean value
		val = NumberFunctions.round(val,2);
		// save old value
		let oldCircle = tallyStatsBars.circle;
		// save data-value
		$('.stat-bar-circle').attr("data-value",val);
		// get circumference value
		let circumference = NumberFunctions.map(val,0,1,138,0);
		// Set the Offset
		$('.stat-bar-circle').css({"strokeDashoffset": circumference });
		// log
		console.log("adjustTallyCircle()",val,circumference);
	}
	function adjustTallyCircleText(val){
		// save old value
		let oldText = tallyStatsBars.circle.text;

		var d = { val: oldText };
		anime({
			targets: d,
			val: Math.ceil(val),
			duration: 1000,
			round: 1,
			easing: 'linear',
			update: function() {
				//console.log(d);
				$('.stat-bar-circle-text').html(d.val);
			}
		});
	}



	// PUBLIC
	return {
		initBars: function(who, stats) {
			return initBars(who, stats);
		},
		adjustTallyBar: function(bar,val){
			adjustTallyBar(bar,val);
		},
		adjustTallyCircle: function(val){
			adjustTallyCircle(val);
		},
		adjustTallyCircleText: function(val){
			adjustTallyCircleText(val);
		},
		tallyStatsBar: function(){
			return tallyStatsBar;
		}
	};
})();
