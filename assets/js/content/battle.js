"use strict";

/*  BATTLE
 ******************************************************************************/

var Battle = (function() {
	// PRIVATE

	var _active = false,
		_logDelay = 1000,
		_monster = null; // testing

	// control state
	function active(state) {
		if (state != undefined && (state === true || state === false))
			_active = state;
		if (false) end();

		return _active;
	}
	// start battle
	function start(monster) {
		if (_active) return;
		active(true);
		_monster = monster;

		// move tally into position



		// add monster and move into position

		// show console
		BattleConsole.show();
		setTimeout(function() {
			BattleConsole.log("Battle started with " + _monster + " monster!");
			monsterTakeTurn();
		}, 100);

	}

	function monsterTakeTurn(){
		setTimeout(function() {
			BattleConsole.log(_monster + " monster used the ______ attack!");
			setTimeout(function() {
				BattleConsole.log("Tally received ______ in damages.");
				setTimeout(function() {
					BattleConsole.log("What will Tally do?");
				}, _logDelay);
			}, _logDelay);
		}, _logDelay);
	}

	function tallyTakeTurn(){
		// show buttons
		setTimeout(function() {
			BattleConsole.log("Tally used the _____ attack!");
			setTimeout(function() {
				BattleConsole.log(_monster + " monster received ______ in damages.");
				monsterTakeTurn();
			}, _logDelay);
		}, _logDelay);
	}


	function test(){
		if (!_active) {
			start("scary");
			Skin.update("pattern", "plaidRed");
		} else {
			BattleConsole.log("Some more stuff for the console " + pageData.time);
			Skin.random();
		}
	}

	// end battle
	function end() {
		BattleConsole.hide();
	}





	// PUBLIC
	return {
		start: function(monster) {
			start(monster);
		},
		end: end,
		test: test,
		active: function(state) {
			return active(state);
		}
	};
})();
