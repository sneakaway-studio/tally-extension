"use strict";

/*  BATTLE
 ******************************************************************************/

var Battle = (function() {
	// PRIVATE

	var _active = false;

	// start battle
	function start(monster) {
		setActive(true);

		// move tally into position
		// add monster and move into position

		// show console
		BattleConsole.show();
		setTimeout(function() {
			BattleConsole.log("Battle started with " + monster + " monster!");
		}, 100);

	}




	// end battle
	function end() {
		BattleConsole.hide();
	}


	function getActive() {
		return _active;
	}

	function setActive(state) {
		_active = state;
	}

	// PUBLIC
	return {
		start: function(monster) {
			start(monster);
		},
		end: end,
		getActive: getActive,
		setActive: function(state) {
			setActive(state);
		}
	};
})();
