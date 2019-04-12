"use strict";

/*  (BATTLE) MATH
 ******************************************************************************/

var BattleMath = (function() {
	// PRIVATE VARS;



	function updateHealth(attackObj, selfStats, oppStats) {
		// do stuff

		// if you pass a stats object it will update
		Tally.stats(tallyStats);
	}

	function updateAttack(attackObj, selfStats, oppStats) {
		if (attackObj.selfAtk != NULL) {
			charStats.Attack = charStats.Attack * attackObj.selfAtk;
		}
		if (attackObj.oppAtk != NULL) {
			selfStats.Attack = selfStats.Attack * attackObj.selfAtk;
		}
	}

	function updateStamina(attackObj, selfStats, oppStats) {
		if (attackObj.staminaCost != NULL) {
			charStats.Stamina = charStats.Stamina - attackObj.staminaCost;
		}
	}

	function updateAccuracy(attackObj, selfStats, oppStats) {
		if (attackObj.selfAcc != NULL) {
			charStats.Accuracy = charStats.Accuracy * attackObj.selfAcc;
		}
		if (attackObj.oppAcc != NULL) {
			selfStats.Accuracy = selfStats.Accuracy * attackObj.oppAcc;
		}
	}

	function updateEvasion(attackObj, selfStats, oppStats) {
		if (attackObj.selfEva != NULL) {
			charStats.Evasion = charStats.Evasion * attackObj.selfEva;
		}
		if (attackObj.oppEva != NULL) {
			selfStats.Evasion = selfStats.Evasion * attackObj.oppEva;
		}
	}

	function updateDefense(attackObj, selfStats, oppStats) {
		if (attackObj.selfDef != NULL) {
			charStats.Defense = charStats.Defense * attackObj.selfDef;
		}
		if (attackObj.oppDef != NULL) {
			selfStats.Attack = selfStats.Attack * attackObj.selfDef;
		}
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
