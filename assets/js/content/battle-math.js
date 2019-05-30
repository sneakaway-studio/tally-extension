"use strict";

/*  (BATTLE) MATH
 ******************************************************************************/

window.BattleMath = (function() {
	// PRIVATE VARS;





// my old ones, need to combine or remove in place of daniel's below.

		/**
		 * 	Generic Function for updating all stats
		 */
		function attackOutcomes(attack, self, opp) {
			try {

				// track the outcome(s) of the attack
				let attackOutcomes = [];

				// look for specific properties in attack to determine which function is called
				if (prop(attack.selfDef)) {
					// store string that is returned to be able to log it later
					attackOutcomes.push(
						BattleMath.updateDefense(attack, getStat(self), getStat(opp))
					);
				}
				if (prop(attack.oppEva)) {
					attackOutcomes.push(
						BattleMath.updateEvasion(attack, getStat(self), getStat(opp))
					);
				}
				// Daniel, add more conditions...


				return attackOutcomes;

			} catch (err) {
				console.error(err);
			}
		}
		/**
		 * 	Get stats of self or opponent
		 */
		function getStat(who) {
			try {
				console.log("💥 BattleAttack.getStat()",who);
				let stats = {};
				if (who == "tally")
					stats = tally_user.stats; //Stats.tally();
				else
					stats = Stats.monster();
				console.log("💥 BattleAttack.getStat()",who,stats);
				return stats;
			} catch (err) {
				console.error(err);
			}
		}






// DANIEL:
// I added a "change" object so each of these functions can return details about what changed for the console.
// Look in updateHealth for pseudocode.




	// random change values (temp)
	function tempRandomChangeVal(change){
		try {
			change.val = Math.ceil(Math.random()*10);
			return change;
		} catch (err) {
			console.error(err);
		}
	}

	function computeExp(selfStats, oppStats){
		try {
			//Only once moster has been defeated
			//Compute experience based on level
		} catch (err) {
			console.error(err);
		}
	}

	function damageCalc(attackObj, selfStats, oppStats){
		try {
			var critical = 1;
			if(Math.random < attackObj.crtChance){
				critical = 2;
			}
			return (((((2*selfStats.level)/5)+2)*attackObj.damage*(selfStats.Attack/oppStats.Defense))/50)*critical;
		} catch (err) {
			console.error(err);
		}
	}

	function willHit(attackObj, selfStats, oppStats){
		try {
			var hitChance = attackObj.accuracy * (selfStats.Accuracy/oppStats.Evasion);
		} catch (err) {
			console.error(err);
		}
	}

	function updateAllStats(attackObj, selfStats, oppStats){
		try {
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

		} catch (err) {
			console.error(err);
		}
	}



	// PUBLIC
	return {
		// me
		attackOutcomes: function (attack, self, opp){
			return attackOutcomes(attack, self, opp);
		},
		// daniel
		updateAllStats: function(attackObj, selfStats, oppStats) {
			return updateAllStats(attackObj, selfStats, oppStats);
		},
		damageCalc: function(attackObj, selfStats, oppStats) {
			return damageCalc(attackObj, selfStats, oppStats);
		}
	};
})();
