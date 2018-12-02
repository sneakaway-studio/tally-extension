"use strict";

/*  BATTLE
 ******************************************************************************/

var Battle = (function() {
	// PRIVATE

	var _active = false,
		_logDelay = 1000,
		details = {
			"mid":null,
			"monsterName":"",
			"mostRecentAttack":"",
			"mostRecentDamage":""
		}
		;

	function getDetails(){
		return details;
	}

	// control state
	function active(state) {
		if (state != undefined && (state === true || state === false))
			_active = state;
		if (false) end();

		return _active;
	}
	// start battle
	function start(mid) {
		if (_active) return;
		active(true);

		// get monster name
		details.monsterName = MonsterData.dataById[mid].name +" monster";


		// move tally into position



		// add monster and move into position

		// show console
		BattleConsole.show();
		setTimeout(function() {
			BattleConsole.log("Battle started with " + details.monsterName + "!");
			monsterTakeTurn();
		}, 100);

	}

	function monsterTakeTurn() {

		details.mostRecentAttack = "spambash attack";
		details.mostRecentDamage = "24 health";
		// save as most recent attack

		setTimeout(function() {
			BattleConsole.log(details.monsterName + " used the " + details.mostRecentAttack + "!");
			setTimeout(function() {
				BattleConsole.log("Tally lost " + details.mostRecentDamage + ".");
				setTimeout(function() {
					BattleConsole.log("What will Tally do?");
				}, _logDelay);
			}, _logDelay);
		}, _logDelay);
	}

	function tallyTakeTurn() {
		// show buttons
		setTimeout(function() {
			BattleConsole.log("Tally used the _____ attack!");
			setTimeout(function() {
				BattleConsole.log(_monster + " monster received ______ in damages.");
				monsterTakeTurn();
			}, _logDelay);
		}, _logDelay);
	}


	function test() {
		if (!_active) {
			start(681);
			Skin.update("pattern", "plaidRed");
		} else {
			BattleConsole.log("Some more stuff for the console " + pageData.time);
			Skin.random();
		}
	}

	function rumble(degree) {
		Sound.playFile("explosions/explode.mp3");

		// all possible html5 nodes
		let nodes = ['a', 'a[href]', 'b', 'blockquote', 'br', 'button', 'canvas', 'code', 'dd', 'dl', 'dt',
			'em', 'embed', 'footer', 'frame', 'form', 'header', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'hr',
			'iframe', 'img', 'input', 'label', 'nav', 'ol', 'ul', 'li', 'option', 'p', 'pre', 'section', 'span',
			'strong', 'sup', 'svg', 'table', 'tr', 'td', 'th', 'tbody', 'thead', 'textarea', 'text', 'u', 'video'
		];
		// add any exclusions
		for (let i = 0, l = nodes.length; i < l; i++) {
			nodes[i] = nodes[i] + ':not(.tally)';
		}





		// run animation
		anime({
			targets: document.querySelectorAll(nodes.toString()),
			rotate: [
				{
					value: 2,
					duration: 100,
					easing: 'easeInOutSine'
				},
				{
					value: -2,
					duration: 100,
					easing: 'easeInOutSine'
				},
				{
					value: 1,
					duration: 100,
					easing: 'easeInOutSine'
				},
				{
					value: -0.5,
					duration: 200,
					easing: 'easeInOutSine'
				}
			],
			translateY: [
				{
					value: 2,
					duration: 100,
					easing: 'easeInOutSine'
				},
				{
					value: -2,
					duration: 100,
					easing: 'easeInOutSine'
				}
			],
			duration: 500,
			// direction: 'alternate'
		});
	}

	// end battle
	function end() {
		_active = false;
		BattleConsole.hide();
	}





	// PUBLIC
	return {
		start: function(mid) {
			start(mid);
		},
		end: end,
		test: test,
		active: function(state) {
			return active(state);
		},
		rumble: function(degree) {
			rumble(degree);
		},
		details: details
	};
})();
