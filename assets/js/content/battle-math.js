"use strict";

/*  (BATTLE) MATH
 ******************************************************************************/

var BattleMath = (function() {
	// PRIVATE VARS;



	function updateHealth(attackObj,/*characterObj*/,/*otherCharaterObj*/) {
		// get the latest stats
		var enemStats = otherCharacterObj.stats();
		var charStats = characterObj.stats();
		// do stuff

		// if you pass a stats object it will update
		Tally.stats(tallyStats);
	}
	function updateAttack(attackObj,/*characterObj*/,/*otherCharaterObj*/) {
		var enemStats = otherCharacterObj.stats();
		var charStats = characterObj.stats();
		if(attackObj.selfAtk != NULL){
			charStats.Attack = charStats.Attack * attackObj.selfAtk;
		}
		if(attackObj.oppAtk != NULL){
			enemStats.Attack = enemStats.Attack * attackObj.selfAtk;
		}
	}
	function updateStamina(attackObj,/*characterObj*/,/*otherCharacterObj*/) {
		var enemStats = otherCharacterObj.stats();
		var charStats = characterObj.stats();
		if(attackObj.staminaCost != NULL){
			charStats.Stamina = charStats.Stamina - attackObj.staminaCost;
		}
	}
	function updateAccuracy(attackObj,/*characterObj*/,/*otherCharacterObj*/) {
		var enemStats = otherCharacterObj.stats();
		var charStats = characterObj.stats();
		if(attackObj.selfAcc != NULL){
			charStats.Accuracy = charStats.Accuracy * attackObj.selfAcc;
		}
		if(attackObj.oppAcc != NULL){
			enemStats.Accuracy = enemStats.Accuracy * attackObj.oppAcc;
		}
	}
	function updateEvasion(attackObj,/*characterObj*/,/*otherCharacterObj*/) {
		var enemStats = otherCharacterObj.stats();
		var charStats = characterObj.stats();
		if(attackObj.selfEva != NULL){
			charStats.Evasion = charStats.Evasion * attackObj.selfEva;
		}
		if(attackObj.oppEva != NULL){
			enemStats.Evasion = enemStats.Evasion * attackObj.oppEva;
		}
	}
	function updateDefense(attackObj,/*characterObj*/,/*otherCharacterObj*/) {
		var enemStats = otherCharacterObj.stats();
		var charStats = characterObj.stats();
		if(attackObj.selfDef != NULL){
			charStats.Defense = charStats.Defense * attackObj.selfDef;
		}
		if(attackObj.oppDef != NULL){
			enemStats.Attack = enemStats.Attack * attackObj.selfDef;
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
