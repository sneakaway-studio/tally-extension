"use strict";

/*  STATS DISPLAY
 ******************************************************************************/

window.StatsDisplay = (function() {
	// PRIVATE
	let DEBUG = Debug.ALL.StatsDisplay;

	/**
	 * Starting point for stats svg coordinates
	 */
	let defaultStatsSVGPoints = {
		"healthbg": { "val": 1, "x":0, "y":0, "w":200, "h":20 },
		"health": { "val": 0, "x":0, "y":0, "w":0, "h":20 }, // start @ zero
		"staminabg": { "val": 1, "x":0, "y":20, "w":170, "h":12 },
		"stamina": { "val": 0, "x":0, "y":20, "w":0, "h":12 }, // start @ zero
		"circle": { "val": 0, "cx": 26, "cy": 24, "r": 22, "text": 0 },
	};
	// player stats SVG points
	let statsPoints = {
		// assign by value, not reference
		"tally": JSON.parse(JSON.stringify(defaultStatsSVGPoints)),
		"monster": JSON.parse(JSON.stringify(defaultStatsSVGPoints)),
	};


	/**
	 * 	Combine stat bar polygon points
	 */
	function combineSVGPoints({
		x = 0,
		y = 0,
		w = 0,
		h = 0
	} = {}) {
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
	function returnInitialSVG(who = "") {
		try {
			// who is required
			if (who === "") return console.error("📈 StatsDisplay.returnInitialSVG() --> who is required!!", who);

			// get player's stats SVG coordinates
			let str = '',
				level = Stats.getLevel(who);

			if (DEBUG) console.log("📈 StatsDisplay.returnInitialSVG()", who, statsPoints[who],
				"health=" + statsPoints[who].health.val, "stamina=" + statsPoints[who].stamina.val
			);

			str += '<svg height="49" width="230" class="tally stats-display">';
			str += '<g class="tally stat-bars">';
			str += '<polygon points="' + combineSVGPoints(statsPoints[who].healthbg) + '" class="tally stat-bar-health-bg" />';
			str += '<polygon points="' + combineSVGPoints(statsPoints[who].health) + '" class="tally stat-bar-health" data-value="' + statsPoints[who].health.val + '" />';
			str += '<polygon points="' + combineSVGPoints(statsPoints[who].staminabg) + '" class="tally stat-bar-stamina-bg" />';
			str += '<polygon points="' + combineSVGPoints(statsPoints[who].stamina) + '" class="tally stat-bar-stamina" data-value="' + statsPoints[who].stamina.val + '" />';
			str += '</g>';
			str += '<circle cx="' + statsPoints[who].circle.cx + '" cy="' + statsPoints[who].circle.cy;
			str += '" r="' + statsPoints[who].circle.r + '" data-value="0" class="tally stat-bar-circle" />';
			str += '<text x="' + statsPoints[who].circle.cx + '" y="' + statsPoints[who].circle.cy;
			str += '" dominant-baseline="middle" text-anchor="middle" class="tally stat-bar-circle-text ' + who + '-circle-text">' + level + '</text>';
			str += '</svg>';
			return str;
		} catch (err) {
			console.error(err);
		}
	}
	/**
	 * 	Return the full stats table that appears under the stats SVG
	 */
	function returnFullTable(who, changeArr = []) {
		try {
			let stats = Stats.get(who),
				str = "",
				statClass = "",
				statChangedBlinkClass = "",
				preferredStatOrder = {
					health: "How long you can withstand a monster's attacks.",
					stamina: "Stamina enables you to launch attacks and depletes as you do.",
					accuracy: "Determines the accuracy of the attacks you launch at the monster. High accuracy means you won't miss.",
					attack: "How powerful your attacks will be against the monster.",
					defense: "How well you can withstand a monster's attacks. The lower your defense, the more health you will lose.",
					evasion: "Your ability to evade a monster's attacks. They will miss if your evasion is high.",
				};

			console.log("📈 StatsDisplay.returnFullTable() [1]", who, changeArr, str, statChangedBlinkClass);

			str += "<div class='tally'><table class='tally stats-table'><tbody class='tally'>";

			// loop through stats in perferred order
			for (var key in preferredStatOrder) {
				if (preferredStatOrder.hasOwnProperty(key)) {

					// whether or not to blink if changed
					if (changeArr.length > 0 && changeArr.includes(key)) {
						statChangedBlinkClass = " stat-blink";
					} else {
						statChangedBlinkClass = "";
					}

					console.log("📈 StatsDisplay.returnFullTable() [2]", key + ": " + JSON.stringify(stats[key]));

					// defense and attack have the same colors, a bit confusing but easier to fix with this logic than create new palette
					if (key === "defense" || key === "attack") statClass = "";
					// else use key name
					else statClass = "text-" + key;

					str += `

				<tr class='tally ${statChangedBlinkClass}' title="${preferredStatOrder[key]}">
					<td class='tally ${statClass}'>${key}</td>
					<td class='tally stats-number-column'>
						<span class='tally ${statClass}'>` +
						// format numbers
						numeral(stats[key].val).format('0a') +
						`</span>/<span class='tally ${statClass}'>` +
						// format numbers
						numeral(stats[key].max).format('0a') +
						`</span>
					</td>
				</tr>

				`;
				}
			}

			str += "</tbody></table></div>";

			// console.log("📈 StatsDisplay.returnFullTable() [3]", who, changeArr, str, statChangedBlinkClass);

			return str;
		} catch (err) {
			console.error(err);
		}
	}

	/**
	 * 	Update display for *who*
	 */
	function updateDisplay(who, changeArr) {
		try {
			// allow offline
			if (Page.data.mode.notActive) return;
			// don't allow if mode disabled or stealth
			if (T.tally_options.gameMode === "disabled" || T.tally_options.gameMode === "stealth") return;

			// get stats and level
			let stats = Stats.get(who),
				level = Stats.getLevel(who);

			// if any problems return
			if (level < 1)
				return console.log("📈 StatsDisplay.updateDisplay() ERROR -> level < 1");
			if (stats === {})
				return console.log("📈 StatsDisplay.updateDisplay() ERROR -> stats === {}");
			if (!FS_Object.prop(T.tally_user))
				return console.log("📈 StatsDisplay.updateDisplay() ERROR -> NO T.tally_user");
			if (!FS_Object.prop(T.tally_user.score))
				return console.log("📈 StatsDisplay.updateDisplay() ERROR -> NO T.tally_user.score", T.tally_user);

			if (DEBUG) console.log("📈 StatsDisplay.updateDisplay() level =", level, who, "=>", JSON.stringify(stats));
			// bars, circle, table
			adjustStatsBar(who, "health");
			adjustStatsBar(who, "stamina");
			adjustStatsCircle(who, level);
			// update stats table
			$('.' + who + '_stats_table_wrapper').html(returnFullTable(who, changeArr));
		} catch (err) {
			console.error(err);
		}
	}




	/**
	 * 	Adjust stats bars for Tally *values are normalized*
	 */
	function adjustStatsBar(who = "", bar = "", val = null) {
		try {
			// who is required
			if (who === "" || bar === "") return console.warn("📈 StatsDisplay.adjustStatsBar() --> who and bar required!!", who, bar);
			// only update health | stamina bars
			if (bar !== "health" && bar !== "stamina") return;

			if (DEBUG) console.log("📈 StatsDisplay.adjustStatsBar()0", "who=" + who, "bar=" + bar, "val=" + val, "statsPoints[who][bar]=" + JSON.stringify(statsPoints[who][bar]));

			// clean value
			let oldVal = FS_Number.normalize(statsPoints[who][bar].val, 0, 1);

			// if (DEBUG) console.log("📈 StatsDisplay.adjustStatsBar()1", "who="+ who, "bar="+ bar, "oldVal="+ oldVal, "Stats.get(who)[bar]="+JSON.stringify(Stats.get(who)[bar]));

			// save current bar coordinates (assign object by value not reference)
			let oldBar = JSON.parse(JSON.stringify(statsPoints[who][bar]));
			// get new (normalized) value
			let newVal = Stats.get(who)[bar].normalized;
			// for testing
			if (val !== null && val > 0) newVal = val;
			// get max value (pixels)
			let valMax = statsPoints[who][bar + "bg"].w;

			// if (DEBUG) console.log("📈 StatsDisplay.adjustStatsBar()2", "who="+ who, "bar="+ bar, "oldVal="+ oldVal, "newVal="+ newVal, "valMax="+ valMax, "oldBar="+ JSON.stringify(oldBar));

			// set new width
			statsPoints[who][bar].w = FS_Number.round(newVal * valMax, 2);

			// if (DEBUG) console.log("📈 StatsDisplay.adjustStatsBar()3", "who="+ who, "bar="+ bar, "oldVal="+ oldVal, "statsPoints[who][bar].w="+ statsPoints[who][bar].w);

			// set new value
			statsPoints[who][bar].val = newVal;


			// if (DEBUG) console.log("📈 StatsDisplay.adjustStatsBar()5", "who="+ who, "bar="+ bar, "oldVal="+ oldVal, "oldBar="+ JSON.stringify(oldBar), "statsPoints[who][bar]="+ JSON.stringify(statsPoints[who][bar]));

			// save new data-value
			$('.' + who + '_stats .stat-bar-' + bar).attr("data-value", newVal);


			// if (DEBUG) console.log("📈 StatsDisplay.adjustStatsBar()5", "combineSVGPoints(oldBar)"+ JSON.stringify(combineSVGPoints(oldBar)), "combineSVGPoints(statsPoints[who][bar])="+ JSON.stringify(combineSVGPoints(statsPoints[who][bar])));



			// animation
			anime({
				targets: '.' + who + '_stats .stat-bar-' + bar,
				points: [{
					value: [combineSVGPoints(oldBar)]
				}, {
					value: [combineSVGPoints(statsPoints[who][bar])]
				}],
				easing: 'easeOutQuad',
				duration: 1000,
				// update: function(anim) {
				// 	for (let i=0; i<anim.animations.length; i++){
				// 		if (who === "monster" && bar === "health")
				// 			if (DEBUG) console.log("📈 StatsDisplay.adjustStatsBar()5",i, "anim="+ JSON.stringify(anim.animations[i].tweens) );
				// 	}
				//
				// },
				// complete: function(){
				// 	// save
				//
				// }
			});
		} catch (err) {
			console.error(err);
		}
	}
	// //testing
	// $("body").mousemove(function(event) {
	// 	var msg = "Handler for .mousemove() called at " + event.pageX + ", " + event.pageY;
	// 	let normalized = FS_Number.normalize(event.pageX, 0, $(window).width());
	// 	if (DEBUG) console.log(normalized);
	// 	adjustStatsBar("tally","health",normalized);
	// 	adjustStatsBar("tally","stamina",normalized);
	// 	// let level = FS_Number.round(FS_Number.map(event.pageX, 0, $(window).width(), 0, FS_Object.lastKeyValue(GameData.levels).level),0);
	// 	// adjustStatsCircle("tally", level, normalized);
	// });


	/**
	 * 	Adjust stats circle for Tally
	 *	*circle circumference is normalized so xp needs to be 0–1
	 */
	function adjustStatsCircle(who, level, xpFactor = 0) {
		if (DEBUG) console.log("📈 StatsDisplay.adjustStatsCircle() [1] who=" + who, "level=" + level, "xpFactor=" + xpFactor);
		try {
			// who is required
			if (who === "") return console.warn("📈 StatsDisplay.adjustStatsCircle() [1.2] who is required!!", who);
			// show text
			adjustStatsCircleText(who, level);
			// don't show xp, just text for monster
			if (who == "monster") return;

			if (DEBUG) console.log("📈 StatsDisplay.adjustStatsCircle() [2] level=" + level);


			let currentXP = T.tally_user.score.score;
			//let currentXP = GameData.levels[level].xp * xpFactor; // testing


			// xp required to reach current level
			let xpPrevious = GameData.levels[level].xp;

			// xp required to advance to next level : highest level
			let xpGoal = GameData.levels[level + 1].xp ? GameData.levels[level + 1].xp : FS_Object.lastKeyValue(GameData.levels).level;

			// xp
			let xpRange = xpGoal - xpPrevious;
			let xpDiff = xpPrevious - currentXP;

			// normalize
			//let xpNormalized = FS_Number.normalize((xpGoal - currentXP) / xpGoal,0,1);
			let xpNormalized = -FS_Number.normalize((xpDiff / xpRange), 0, 1);

			// xpPrevious=24389 currentXP=25382 xpGoal=27000 xpNormalized=0.059925925925925924

			// 27000 - 24389 = 2611 (range)
			// 27000 - 25382 = 1618 (what is left)
			// 1618/2611



			if (DEBUG) console.log("📈 StatsDisplay.adjustStatsCircle() [3] level=" + level, "xpPrevious=" + xpPrevious,
				"currentXP=" + currentXP, "xpGoal=" + xpGoal, "xpNormalized=" + xpNormalized);

			// save old values
			let oldCircle = statsPoints[who].circle;
			// save data-value
			$('.' + who + '_stats .stat-bar-circle').attr("data-value", xpNormalized);
			// get circumference value
			let circumference = FS_Number.map(xpNormalized, 0, 1, 138, 0);
			// Set the Offset
			$('.' + who + '_stats .stat-bar-circle').css({
				"strokeDashoffset": circumference
			});
			// log
			if (DEBUG) console.log("📈 StatsDisplay.adjustStatsCircle()", who, level, circumference);

		} catch (err) {
			console.error(err);
		}
	}
	// test circle (set xpGoal = screen width)
	// $(document).mousemove(function(event) {
	// 	if (DEBUG) console.log(event.pageX, event.pageY);
	// 	adjustStatsCircle("tally", event.pageX * 0.01);
	// });

	function adjustStatsCircleText(who, val) {
		try {
			if (DEBUG) console.log("📈 StatsDisplay.adjustStatsCircleText()", who, val);
			$('.' + who + '-circle-text').text(val);


			// the below wil count a number up, saving in case I need it.

			// // get old value
			// let oldText = $('.' + who + '_stats .stat-bar-circle-text').text();
			// // create object to manipulate
			// var d = {
			// 	val: oldText
			// };
			// anime({
			// 	targets: d,
			// 	val: val,
			// 	duration: 1000,
			// 	round: 1,
			// 	easing: 'linear',
			// 	update: function() {
			// 		if (DEBUG) console.log(oldText, d, val);
			// 		$('.' + who + '_stats .stat-bar-circle-text').text(d.val);
			// 	},
			// 	complete: function() {
			// 		// save stats
			// 		//playerStatsSVGPoints(who, statsDisplay);
			// 	}
			// });
		} catch (err) {
			console.error(err);
		}
	}





	// PUBLIC
	return {
		returnInitialSVG: function(who) {
			return returnInitialSVG(who);
		},
		returnFullTable: function(who, changeArr) {
			return returnFullTable(who, changeArr);
		},
		// showStatsFull: function(who){
		// 	showStatsFull(who);
		// },
		adjustStatsBar: adjustStatsBar,
		adjustStatsCircle: adjustStatsCircle,
		updateDisplay: updateDisplay,

	};
})();
