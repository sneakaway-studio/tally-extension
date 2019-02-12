"use strict";

/*  BATTLE
 ******************************************************************************/

var Battle = (function() {
	// PRIVATE

	var _active = false,
		_logDelay = 1000,
		details = {
			"mid": null,
			"monsterName": "",
			"mostRecentAttack": "",
			"mostRecentDamage": ""
		};

	function getDetails() {
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
		details.monsterName = MonsterData.dataById[mid].name + " monster";

		// setup page for effects
		BattleEffect.setup();


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




	// end battle
	function end() {
		BattleConsole.hide();
		_active = false;
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
		details: details
	};
})();
