"use strict";

/*  (BATTLE) MATH
 ******************************************************************************/

var BattleMath = (function() {
	// PRIVATE VARS;



	function updateHealth(attackObj) {
		// get the latest stats
		var tallyStats = Tally.stats();
		// do stuff

		// if you pass a stats object it will update
		Tally.stats(tallyStats);
	}

	function updateAttack(attackObj) {

	}

	function updateStamina(attackObj) {

	}

	function updateAccuracy(attackObj) {

	}

	function updateEvasion(attackObj) {

	}

	function updateDefense(attackObj) {

	}



	// PUBLIC
	return {
		updateHealth: function(attackObj) {
			updateHealth(attackObj);
		},
		updateAttack: function(attackObj) {
			updateAttack(attackObj);
		},
		updateStamina: function(attackObj) {
			updateStamina(attackObj);
		},
		updateAccuracy: function(attackObj) {
			updateAccuracy(attackObj);
		},
		updateEvasion: function(attackObj) {
			updateEvasion(attackObj);
		},
		updateDefense: function(attackObj) {
			updateDefense(attackObj);
		},
	};
})();
