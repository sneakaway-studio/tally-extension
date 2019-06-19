"use strict";

/*  (BATTLE) MATH
 ******************************************************************************/

window.BattleMath = (function() {
	// PRIVATE VARS;

	let DEBUG = false;

	/**
	 * 	Examine attack, do math, return [] of outcomes
	 */
	function returnAttackOutcomes(attack, selfStr, oppStr) {
		try {
			// get stats
			let self = Stats.get(selfStr),
				opp = Stats.get(oppStr);
			// track the outcome(s) of the attack to log them
			let attackOutcomes = [];
			// default outcome
			let outcome = {};

			if (DEBUG) console.log("🔢 BattleMath.returnAttackOutcomes()", attack, selfStr + " 💥 " + oppStr, self, opp);

			// ************** HEALTH **************

			// INCREASE SELF HEALTH
			if (prop(attack.heal)) {
				outcome = {
					"val": FS_Number.round(self.health.val * attack.heal, 1),
					"str": "health",
					"type": "heal",
					"affects": "self"
				};
				self.health.val = Stats.setVal(selfStr, outcome.str, self.health.val + outcome.val); // update stat value
				attackOutcomes.push(outcome); // store outcome
				if (DEBUG) console.log("🔢 BattleMath.returnAttackOutcomes() attack.heal -> outcome=", JSON.stringify(outcome) + ", self=", self);
			}
			// DAMAGE OPP HEALTH
			if (prop(attack.damage)) {
				outcome = {
					"val": -(FS_Number.round((opp.health.max * 0.2) * damageCalc(attack, self, opp, selfStr, oppStr), 1)),
					"str": "health",
					"type": "damage",
					"affects": "opp"
				};
				opp.health.val = Stats.setVal(oppStr, outcome.str, opp.health.val + outcome.val); // update stat value
				attackOutcomes.push(outcome); // store outcome
				if (DEBUG) console.log("🔢 BattleMath.returnAttackOutcomes() attack.damage -> outcome=", JSON.stringify(outcome) + ", opp=", opp);
			}


			// ************** ATTACK **************

			// INCREASE SELF ATTACK
			if (prop(attack.selfAtk)) {
				outcome = {
					"val": FS_Number.round(self.attack.val * attack.selfAtk, 1),
					"str": "attack",
					"type": "selfAtk",
					"affects": "self"
				};
				self.attack.val = Stats.setVal(selfStr, outcome.str, self.attack.val + outcome.val); // update stat value
				attackOutcomes.push(outcome); // store outcome
				if (DEBUG) console.log("🔢 BattleMath.returnAttackOutcomes() attack.selfAtk -> outcome=", JSON.stringify(outcome) + ", self=", self);
			}
			// DAMAGE OPP ATTACK
			if (prop(attack.oppAtk)) {
				outcome = {
					"val": -(FS_Number.round(opp.attack.val * attack.oppAtk, 1)),
					"str": "attack",
					"type": "oppAtk",
					"affects": "opp"
				};
				opp.attack.val = Stats.setVal(oppStr, outcome.str, opp.attack.val + outcome.val); // update stat value
				attackOutcomes.push(outcome); // store outcome
				if (DEBUG) console.log("🔢 BattleMath.returnAttackOutcomes() attack.oppAtk -> outcome=", JSON.stringify(outcome) + ", opp=", opp);
			}


			// ************** ACCURACY **************

			// INCREASE SELF ACCURACY
			if (prop(attack.selfAcc)) {
				outcome = {
					"val": FS_Number.round(self.accuracy.val * attack.selfAcc, 1),
					"str": "accuracy",
					"type": "selfAcc",
					"affects": "self"
				};
				self.accuracy.val = Stats.setVal(selfStr, outcome.str, self.accuracy.val + outcome.val); // update stat value
				attackOutcomes.push(outcome); // store outcome
				if (DEBUG) console.log("🔢 BattleMath.returnAttackOutcomes() attack.selfAcc -> outcome=", JSON.stringify(outcome) + ", self=", self);
			}
			// DAMAGE OPP ACCURACY
			if (prop(attack.oppAcc)) {
				outcome = {
					"val": -(FS_Number.round(opp.accuracy.val * attack.oppAcc, 1)),
					"str": "accuracy",
					"type": "oppAcc",
					"affects": "opp"
				};
				opp.accuracy.val = Stats.setVal(oppStr, outcome.str, opp.accuracy.val + outcome.val); // update stat value
				attackOutcomes.push(outcome); // store outcome
				if (DEBUG) console.log("🔢 BattleMath.returnAttackOutcomes() attack.oppAcc -> outcome=", JSON.stringify(outcome) + ", opp=", opp);
			}


			// ************** EVASION **************

			// INCREASE SELF EVASION
			if (prop(attack.selfEva)) {
				outcome = {
					"val": FS_Number.round(self.evasion.val * attack.selfEva, 1),
					"str": "evasion",
					"type": "selfEva",
					"affects": "self"
				};
				self.evasion.val = Stats.setVal(selfStr, outcome.str, self.evasion.val + outcome.val); // update stat value
				attackOutcomes.push(outcome); // store outcome
				if (DEBUG) console.log("🔢 BattleMath.returnAttackOutcomes() attack.selfEva -> outcome=", JSON.stringify(outcome) + ", self=", self);
			}
			// DAMAGE OPP EVASION
			if (prop(attack.oppEva)) {
				outcome = {
					"val": -(FS_Number.round(opp.evasion.val * attack.oppEva, 1)),
					"str": "evasion",
					"type": "oppEva",
					"affects": "opp"
				};
				opp.evasion.val = Stats.setVal(oppStr, outcome.str, opp.evasion.val + outcome.val); // update stat value
				attackOutcomes.push(outcome); // store outcome
				if (DEBUG) console.log("🔢 BattleMath.returnAttackOutcomes() attack.oppEva -> outcome=", JSON.stringify(outcome) + ", opp=", opp);
			}


			// ************** DEFENSE **************

			// INCREASE SELF DEFENSE
			if (prop(attack.selfDef)) {
				outcome = {
					"val": FS_Number.round(self.defense.val * attack.selfDef, 1),
					"str": "defense",
					"type": "selfDef",
					"affects": "self"
				};
				self.defense.val = Stats.setVal(selfStr, outcome.str, self.defense.val + outcome.val); // update stat value
				attackOutcomes.push(outcome); // store outcome
				if (DEBUG) console.log("🔢 BattleMath.returnAttackOutcomes() attack.selfDef -> outcome=", JSON.stringify(outcome) + ", self=", self);
			}
			// DAMAGE OPP DEFENSE
			if (prop(attack.oppDef)) {
				outcome = {
					"val": -(FS_Number.round(opp.defense.val * attack.selfDef, 1)),
					"str": "defense",
					"type": "oppDef",
					"affects": "opp"
				};
				opp.defense.val = Stats.setVal(oppStr, outcome.str, opp.defense.val + outcome.val); // update stat value
				attackOutcomes.push(outcome); // store outcome
				if (DEBUG) console.log("🔢 BattleMath.returnAttackOutcomes() attack.oppDef -> outcome=", JSON.stringify(outcome) + ", opp=", opp);
			}


			// ************** FINALLY **************

			// COMPUTE STAMINA COST
			if (prop(attack.staminaCost)) {
				outcome = {
					// Daniel: stamina cost fix
					"val": -(attack.staminaCost),
					"str": "stamina",
					"type": "staminaCost",
					"affects": "self"
				};
				self.stamina.val = Stats.setVal(selfStr, outcome.str, self.stamina.val + outcome.val); // update stat value
				//attackOutcomes.push(outcome); // don't log
				if (DEBUG) console.log("🔢 BattleMath.returnAttackOutcomes() attack.staminaCost -> outcome=", JSON.stringify(outcome) + ", self=", self);
			}

			if (DEBUG) console.log("🔢 BattleMath.returnAttackOutcomes() final stats = " + self, opp);
			// return data
			return attackOutcomes;
		} catch (err) {
			console.error(err);
		}
	}


	function computeExp(self, opp) {
		try {
			// Only once monster has been defeated
			// Compute experience based on level
		} catch (err) {
			console.error(err);
		}
	}

	function damageCalc(attack, self, opp, selfStr, oppStr) {
		try {
			// if (DEBUG) console.log("🔢 BattleMath.damageCalc()", attack, self, opp, selfStr, oppStr);
			var critical = 1;
			// randomize critical chance
			if (Math.random < attack.crtChance)
				critical = 2;

			let level = Stats.getLevel(oppStr);

			// making this math more manageble
			let levelMultiplier = (((2 * level) / 5) + 2);
			let attackMultiplier = ((levelMultiplier * attack.damage * (self.attack.val / opp.defense.val)) / 50);
			//if (DEBUG) console.log("🔢 BattleMath.damageCalc()", attack, selfStr + " 💥 " + oppStr, level, levelMultiplier, attackMultiplier);
			let result = attackMultiplier * critical;

			return result;
		} catch (err) {
			console.error(err);
		}
	}

	// presumably if we want attacks to ocassionally miss
	function willHit(attack, self, opp) {
		try {
			var hitChance = attack.accuracy * (self.accuracy.val / opp.evasion.val);
		} catch (err) {
			console.error(err);
		}
	}


	// PUBLIC
	return {
		returnAttackOutcomes: function(attack, selfStr, oppStr) {
			return returnAttackOutcomes(attack, selfStr, oppStr);
		}
	};
})();
