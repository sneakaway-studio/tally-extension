"use strict";

/*  BATTLE
 ******************************************************************************/

var Battle = (function() {
	// PRIVATE

	var state = false;

	// start battle
	function start(monster) {
		state = true;

		// move tally into position
		// add monster and move into position

		// show console
		BattleConsole.show();
		BattleConsole.log("Battle started with " + monster + " monster!");
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
		state: state
	};
})();
