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
	
	function damageCalc(attackObj, selfStats, oppStats){
		//Calculation
	}
	
	function willHit(attackObj, selfStats, oppStats){
		var hitChance = attackObj.accuracy * (selfStats.Accuracy/oppStats.Evasion);
	}

	function updateAllStats(attackObj, selfStats, oppStats){
		let change = [{"val":0, "str":""}];
		
		//HEALTH: FROM DAMAGE
		if (attackObj.damage != NULL) {
			selfStats.Health = selfStats.Health * damageCalc(attackObj, selfStats, oppStats);
		}
		//ATTACK STAT
		if (attackObj.selfAtk != NULL) {
			selfStats.Attack = selfStats.Attack * attackObj.selfAtk;
		}
		if (attackObj.oppAtk != NULL) {
			oppStats.Attack = oppStats.Attack * attackObj.oppAtk;
		}
		//STAMINA COST
		if (attackObj.staminaCost != NULL) {
			selfStats.Stamina = selfStats.Stamina - attackObj.staminaCost;
		}
		//ACCURACY STAT
		if (attackObj.selfAcc != NULL) {
			selfStats.Accuracy = selfStats.Accuracy * attackObj.selfAcc;
		}
		if (attackObj.oppAcc != NULL) {
			oppStats.Accuracy = oppStats.Accuracy * attackObj.oppAcc;
		}
		//EVASION STAT
		if (attackObj.selfEva != NULL) {
			selfStats.Evasion = selfStats.Evasion * attackObj.selfEva;
		}
		if (attackObj.oppEva != NULL) {
			oppStats.Evasion = oppStats.Evasion * attackObj.oppEva;
		}
		//DEFENSE STAT
		if (attackObj.selfDef != NULL) {
			selfStats.Defense = selfStats.Defense * attackObj.selfDef;
		}
		if (attackObj.oppDef != NULL) {
			oppStats.Attack = oppStats.Attack * attackObj.selfDef;
		}
		//HEAL
		if (attackObj.heal != NULL) {
			selfStats.Health = selfStats.Health * attackObj.heal;
		}
		

	}



	// PUBLIC
	return {
		updateAllStats: function(attackObj, selfStats, oppStats) {
			return updateAllStats(attackObj, selfStats, oppStats);
		}
		damageCalc: function(attackObj, selfStats, oppStats) {
			return damageCalc(attackObj, selfStats, oppStats);
		}
	};
})();
