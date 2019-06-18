"use strict";

/*  (BATTLE) MATH
 ******************************************************************************/

window.BattleMath = (function() {
	// PRIVATE VARS;

	let DEBUG = true;

	/**
	 * 	Examine attack, do math, return [] of outcomes
	 */
	function returnAttackOutcomes(attack, selfStr, oppStr) {
		try {
			if (DEBUG) console.log("🔢 BattleMath.returnAttackOutcomes()", attack, selfStr + " 💥 " + oppStr);
			if (DEBUG) console.log("🔢 BattleMath.returnAttackOutcomes()", tally_user.stats, Monster.current().stats);

			// get stats
			let self = Stats.getStat(selfStr),
				opp = Stats.getStat(oppStr);
			// track the outcome(s) of the attack to log them
			let attackOutcomes = [];
			// default outcome
			let outcome = {};


			// ************** HEALTH **************

			// INCREASE SELF HEALTH
			if (prop(attack.heal)) {
				outcome = {
					"val": FS_Number.round(self.health * attack.heal, 1),
					"str": "health",
					"type": "heal",
					"affects": "self"
				};
				self.health += outcome.val; // update stat
				attackOutcomes.push(outcome); // store outcome
				if (DEBUG) console.log("🔢 BattleMath.returnAttackOutcomes() attack.heal -> outcome=", JSON.stringify(outcome) +", self=", self);
			}
			// DAMAGE OPP HEALTH
			if (prop(attack.damage)) {
				outcome = {
					"val": -(FS_Number.round(self.health * damageCalc(attack, self, opp, selfStr, oppStr), 1)),
					"str": "health",
					"type": "damage",
					"affects": "opp"
				};
				opp.health += outcome.val; // update stat
				attackOutcomes.push(outcome); // store outcome
				if (DEBUG) console.log("🔢 BattleMath.returnAttackOutcomes() attack.damage -> outcome=", JSON.stringify(outcome) +", opp=", opp);
			}


			// ************** ATTACK **************

			// INCREASE SELF ATTACK
			if (prop(attack.selfAtk)) {
				outcome = {
					"val": FS_Number.round(self.attack * attack.selfAtk, 1),
					"str": "attack",
					"type": "selfAtk",
					"affects": "self"
				};
				self.attack += outcome.val; // update stat
				attackOutcomes.push(outcome); // store outcome
				if (DEBUG) console.log("🔢 BattleMath.returnAttackOutcomes() attack.selfAtk -> outcome=", JSON.stringify(outcome) +", self=", self);
			}
			// DAMAGE OPP ATTACK
			if (prop(attack.oppAtk)) {
				outcome = {
					"val": -(FS_Number.round(opp.attack * attack.oppAtk, 1)),
					"str": "attack",
					"type": "oppAtk",
					"affects": "opp"
				};
				opp.attack += outcome.val; // update stat
				attackOutcomes.push(outcome); // store outcome
				if (DEBUG) console.log("🔢 BattleMath.returnAttackOutcomes() attack.oppAtk -> outcome=", JSON.stringify(outcome) +", opp=", opp);
			}


			// ************** ACCURACY **************

			// INCREASE SELF ACCURACY
			if (prop(attack.selfAcc)) {
				outcome = {
					"val": FS_Number.round(self.accuracy * attack.selfAcc, 1),
					"str": "accuracy",
					"type": "selfAcc",
					"affects": "self"
				};
				self.accuracy += outcome.val; // update stat
				attackOutcomes.push(outcome); // store outcome
				if (DEBUG) console.log("🔢 BattleMath.returnAttackOutcomes() attack.selfAcc -> outcome=", JSON.stringify(outcome) +", self=", self);
			}
			// DAMAGE OPP ACCURACY
			if (prop(attack.oppAcc)) {
				outcome = {
					"val": -(FS_Number.round(opp.accuracy * attack.oppAcc, 1)),
					"str": "accuracy",
					"type": "oppAcc",
					"affects": "opp"
				};
				opp.accuracy = Stats.updateStatValue(oppStr, "accuracy", "+=", outcome.val); // update stat
				attackOutcomes.push(outcome); // store outcome
				if (DEBUG) console.log("🔢 BattleMath.returnAttackOutcomes() attack.oppAcc -> outcome=", JSON.stringify(outcome) +", opp=", opp);
			}


			// ************** EVASION **************

			// INCREASE SELF EVASION
			if (prop(attack.selfEva)) {
				outcome = {
					"val": FS_Number.round(self.evasion * attack.selfEva, 1),
					"str": "evasion",
					"type": "selfEva",
					"affects": "self"
				};
				self.evasion += outcome.val; // update stat
				attackOutcomes.push(outcome); // store outcome
				if (DEBUG) console.log("🔢 BattleMath.returnAttackOutcomes() attack.selfEva -> outcome=", JSON.stringify(outcome) +", self=", self);
			}
			// DAMAGE OPP EVASION
			if (prop(attack.oppEva)) {
				outcome = {
					"val": -(FS_Number.round(opp.evasion * attack.oppEva, 1)),
					"str": "evasion",
					"type": "oppEva",
					"affects": "opp"
				};
				opp.evasion += outcome.val; // update stat
				attackOutcomes.push(outcome); // store outcome
				if (DEBUG) console.log("🔢 BattleMath.returnAttackOutcomes() attack.oppEva -> outcome=", JSON.stringify(outcome) +", opp=", opp);
			}


			// ************** DEFENSE **************

			// INCREASE SELF DEFENSE
			if (prop(attack.selfDef)) {
				outcome = {
					"val": FS_Number.round(self.defense * attack.selfDef, 1),
					"str": "defense",
					"type": "selfDef",
					"affects": "self"
				};
				self.defense += outcome.val; // update stat
				attackOutcomes.push(outcome); // store outcome
				if (DEBUG) console.log("🔢 BattleMath.returnAttackOutcomes() attack.selfDef -> outcome=", JSON.stringify(outcome) +", self=", self);
			}
			// DAMAGE OPP DEFENSE
			if (prop(attack.oppDef)) {
				outcome = {
					"val": -(FS_Number.round(opp.defense * attack.selfDef, 1)),
					"str": "defense",
					"type": "oppDef",
					"affects": "opp"
				};
				opp.defense += outcome.val; // update stat
				attackOutcomes.push(outcome); // store outcome
				if (DEBUG) console.log("🔢 BattleMath.returnAttackOutcomes() attack.oppDef -> outcome=", JSON.stringify(outcome) +", opp=", opp);
			}


			// ************** FINALLY **************

			// COMPUTE STAMINA COST
			if (prop(attack.staminaCost)) {
				outcome = {
					// Daniel: stamina cost fix
					"val": FS_Number.round((attack.staminaCost * 0.1), 1),
					"str": "stamina",
					"type": "staminaCost",
					"affects": "self"
				};
				self.stamina -= outcome.val; // update stat
				//attackOutcomes.push(outcome); // don't log
				if (DEBUG) console.log("🔢 BattleMath.returnAttackOutcomes() attack.staminaCost -> outcome=", JSON.stringify(outcome) +", self=", self);
			}

			if (DEBUG) console.log("🔢 BattleMath.returnAttackOutcomes() final stats = ", tally_user.stats, Monster.current().stats);

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

			// get level
			let level = tally_user.score.level;
			if (selfStr == "monster")
				level = Monster.current().level;

			// making this math more manageble
			let levelMultiplier = (((2 * level) / 5) + 2);
			let attackMultiplier = ((levelMultiplier * attack.damage * (self.attack / opp.defense)) / 50);
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
			var hitChance = attack.accuracy * (self.accuracy / opp.evasion);
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
