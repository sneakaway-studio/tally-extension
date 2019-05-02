"use strict";

/*  (BATTLE) MATH
 ******************************************************************************/

var BattleMath = (function() {
	// PRIVATE VARS;

// DANIEL:
// I added a "change" object so each of these functions can return details about what changed for the console.
// Look in updateHealth for pseudocode.




	// random change values (temp)
	function tempRandomChangeVal(change){
		change.val = Math.ceil(Math.random()*10);
		return change;
	}

	function updateAllStats(attackObj, selfStats, oppStats){
		//I think this will work better
	}
	function updateHealth(attackObj, selfStats, oppStats) {
		// track changes
		let change = {"val":0,"str":"health"};
		// I don't understand this
		
		// do math and store in val
		selfStats.health = selfStats.health * (oppStats.str * attackObj.damage)
		// then apply value to stats
		
		// save stats

		// return what happened so we can log it
		return change.val +" "+ change.str;
	}

	function updateAttack(attackObj, selfStats, oppStats) {
		// track changes
		let change = {"val":0,"str":"attack"};
		tempRandomChangeVal(change); // Daniel, delete this once you get math working

		if (attackObj.selfAtk != NULL) {
			selfStats.Attack = selfStats.Attack * attackObj.selfAtk;
		}
		if (attackObj.oppAtk != NULL) {
			oppStats.Attack = oppStats.Attack * attackObj.oppAtk;
		}

		// return what happened so we can log it
		return change.val +" "+ change.str;
	}

	function updateStamina(attackObj, selfStats, oppStats) {
		// track changes
		let change = {"val":0,"str":"stamina"};
		tempRandomChangeVal(change); // Daniel, delete this once you get math working

		if (attackObj.staminaCost != NULL) {
			selfStats.Stamina = selfStats.Stamina - attackObj.staminaCost;
		}

		// return what happened so we can log it
		return change.val +" "+ change.str;
	}

	function updateAccuracy(attackObj, selfStats, oppStats) {
		// track changes
		let change = {"val":0,"str":"accuracy"};
		tempRandomChangeVal(change); // Daniel, delete this once you get math working

		if (attackObj.selfAcc != NULL) {
			selfStats.Accuracy = selfStats.Accuracy * attackObj.selfAcc;
		}
		if (attackObj.oppAcc != NULL) {
			oppStats.Accuracy = oppStats.Accuracy * attackObj.oppAcc;
		}

		// return what happened so we can log it
		return change.val +" "+ change.str;
	}

	function updateEvasion(attackObj, selfStats, oppStats) {
		// track changes
		let change = {"val":0,"str":"evasion"};
		tempRandomChangeVal(change); // Daniel, delete this once you get math working

		if (attackObj.selfEva != NULL) {
			charStats.Evasion = charStats.Evasion * attackObj.selfEva;
		}
		if (attackObj.oppEva != NULL) {
			selfStats.Evasion = selfStats.Evasion * attackObj.oppEva;
		}

		// return what happened so we can log it
		return change.val +" "+ change.str;
	}

	function updateDefense(attackObj, selfStats, oppStats) {
		// track changes
		let change = {"val":0,"str":"defense"};
		tempRandomChangeVal(change); // Daniel, delete this once you get math working

		if (attackObj.selfDef != NULL) {
			charStats.Defense = charStats.Defense * attackObj.selfDef;
		}
		if (attackObj.oppDef != NULL) {
			selfStats.Attack = selfStats.Attack * attackObj.selfDef;
		}

		// return what happened so we can log it
		return change.val +" "+ change.str;
	}



	// PUBLIC
	return {
		updateHealth: function(attackObj) {
			return updateHealth(attackObj);
		},
		updateAttack: function(attackObj) {
			return updateAttack(attackObj);
		},
		updateStamina: function(attackObj) {
			return updateStamina(attackObj);
		},
		updateAccuracy: function(attackObj) {
			return updateAccuracy(attackObj);
		},
		updateEvasion: function(attackObj) {
			return updateEvasion(attackObj);
		},
		updateDefense: function(attackObj) {
			return updateDefense(attackObj);
		},
	};
})();
