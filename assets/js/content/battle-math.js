"use strict";

/*  (BATTLE) MATH
 ******************************************************************************/

window.BattleMath = (function() {
	// PRIVATE VARS;

	let DEBUG = true,
		outcomeData = {
			"heal": {
				"change": 0,
				"stat": "health",
				"type": "heal",
				"affects": "self"
			},
			"damage": {
				"change": 0,
				"stat": "health",
				"type": "damage",
				"affects": "opp"
			},
			"selfAtt": {
				"change": 0,
				"stat": "attack",
				"type": "selfAtk",
				"affects": "self"
			},
			"oppAtk": {
				"change": 0,
				"stat": "attack",
				"type": "oppAtk",
				"affects": "opp"
			},
			"selfAcc": {
				"change": 0,
				"stat": "accuracy",
				"type": "selfAcc",
				"affects": "self"
			},
			"oppAcc": {
				"change": 0,
				"stat": "accuracy",
				"type": "oppAcc",
				"affects": "opp"
			},
			"selfEva": {
				"change": 0,
				"stat": "evasion",
				"type": "selfEva",
				"affects": "self"
			},
			"oppEva": {
				"change": 0,
				"stat": "evasion",
				"type": "oppEva",
				"affects": "opp"
			},
			"selfDef": {
				"change": 0,
				"stat": "defense",
				"type": "selfDef",
				"affects": "self"
			},
			"oppDef": {
				"change": 0,
				"stat": "defense",
				"type": "oppDef",
				"affects": "opp"
			},
			"staminaCost": {
				"change": 0,
				"stat": "stamina",
				"type": "staminaCost",
				"affects": "self"
			}
		};

	function logOutcome(which, outcome, who, stat) {
		if (!DEBUG) return;
		console.log("🔢 BattleMath.logOutcome() attack." + which,
			"\n ----> outcome=", JSON.stringify(outcome) +
			"\n ----> " + who + "=", JSON.stringify(stat));
	}


	/**
	 * 	Examine attack, do math, return [] of outcomes
	 * 	- attack = attack object
	 *  - selfStr = "tally" | "monster"
	 */
	function returnAttackOutcomes(attack, selfStr, oppStr) {
		try {
			// get stats
			let self = Stats.get(selfStr),
				opp = Stats.get(oppStr),
				noEffect = true,
				changeStat = "",
				attackOutcomes = [], // track the outcome(s) of the attack to log them
				outcome = {}; // default outcome

			if (DEBUG) console.log("🔢 BattleMath.returnAttackOutcomes()", attack, selfStr + " 💥 " + oppStr,
				", \n --> self=", JSON.stringify(self), ", \n --> opp=", JSON.stringify(opp));

			if (didHit(attack, self, opp)) {
				return "missed";
			}


			// ************** HEALTH **************

			// INCREASE SELF HEALTH
			if (prop(attack.heal)) {
				changeStat = "heal";
				outcome = outcomeData[changeStat]; // get data
				outcome.change = FS_Number.round(self.health.val * attack.heal, 1); // get change
				self.health.val = Stats.setVal(selfStr, outcome.stat, self.health.val + outcome.change); // set new val
				attackOutcomes.push(outcome); // store outcome
				logOutcome(changeStat, outcome, "self", self); // log
			}
			// DAMAGE OPP HEALTH
			if (prop(attack.damage)) {
				changeStat = "damage";
				outcome = outcomeData[changeStat];
				outcome.change = opp.health.max - (opp.health.max * attack[changeStat]);
			console.log("outcome.change="+outcome.change,"opp.health.val + outcome.change=",(opp.health.val + outcome.change))
				opp.health.val = Stats.setVal(oppStr, outcome.stat, opp.health.val + outcome.change);
				attackOutcomes.push(outcome);
				logOutcome(changeStat, outcome, "opp", opp);
			}



			// ************** ATTACK **************

			// INCREASE SELF ATTACK
			if (prop(attack.selfAtk)) {
				changeStat = "selfAtk";
				outcome = outcomeData[changeStat];
				outcome.change = FS_Number.round(self.attack.val * attack[changeStat], 1);
				//if (outcome.change != 0)
				self.attack.val = Stats.setVal(selfStr, outcome.stat, self.attack.val + outcome.change);
				attackOutcomes.push(outcome);
				logOutcome(changeStat, outcome, "self", self);
			}
			// DAMAGE OPP ATTACK
			if (prop(attack.oppAtk)) {
				changeStat = "oppAtk";
				outcome = outcomeData[changeStat];
				outcome.change = -(FS_Number.round(opp.attack.val * attack[changeStat], 1));
				opp.attack.val = Stats.setVal(oppStr, outcome.stat, opp.attack.val + outcome.change);
				attackOutcomes.push(outcome);
				logOutcome(changeStat, outcome, "opp", opp);
			}


			// ************** ACCURACY **************

			// INCREASE SELF ACCURACY
			if (prop(attack.selfAcc)) {
				changeStat = "selfAcc";
				outcome = outcomeData[changeStat];
				outcome.change = FS_Number.round(self.accuracy.val * attack[changeStat], 1);
				self.accuracy.val = Stats.setVal(selfStr, outcome.stat, self.accuracy.val + outcome.change);
				attackOutcomes.push(outcome);
				logOutcome(changeStat, outcome, "self", self);
			}
			// DAMAGE OPP ACCURACY
			if (prop(attack.oppAcc)) {
				changeStat = "oppAcc";
				outcome = outcomeData[changeStat];
				outcome.change = -(FS_Number.round(opp.accuracy.val * attack[changeStat], 1));
				opp.accuracy.val = Stats.setVal(oppStr, outcome.stat, opp.accuracy.val + outcome.change);
				attackOutcomes.push(outcome);
				logOutcome(changeStat, outcome, "opp", opp);
			}


			// ************** EVASION **************

			// INCREASE SELF EVASION
			if (prop(attack.selfEva)) {
				changeStat = "selfEva";
				outcome = outcomeData[changeStat];
				outcome.change = FS_Number.round(self.evasion.val * attack[changeStat], 1);
				self.evasion.val = Stats.setVal(selfStr, outcome.stat, self.evasion.val + outcome.change);
				attackOutcomes.push(outcome);
				logOutcome(changeStat, outcome, "self", self);
			}
			// DAMAGE OPP EVASION
			if (prop(attack.oppEva)) {
				changeStat = "oppEva";
				outcome = outcomeData[changeStat];
				outcome.change = -(FS_Number.round(opp.evasion.val * attack[changeStat], 1));
				opp.evasion.val = Stats.setVal(oppStr, outcome.stat, opp.evasion.val + outcome.change);
				attackOutcomes.push(outcome);
				logOutcome(changeStat, outcome, "opp", opp);
			}


			// ************** DEFENSE **************

			// INCREASE SELF DEFENSE
			if (prop(attack.selfDef)) {
				changeStat = "selfDef";
				outcome = outcomeData[changeStat];
				outcome.change = FS_Number.round(self.defense.val * attack[changeStat], 1);
				self.defense.val = Stats.setVal(selfStr, outcome.stat, self.defense.val + outcome.change);
				attackOutcomes.push(outcome);
				logOutcome(changeStat, outcome, "self", self);
			}
			// DAMAGE OPP DEFENSE
			if (prop(attack.oppDef)) {
				changeStat = "oppDef";
				outcome = outcomeData[changeStat];
				outcome.change = -(FS_Number.round(opp.defense.val * attack[changeStat], 1));
				opp.defense.val = Stats.setVal(oppStr, outcome.stat, opp.defense.val + outcome.change);
				attackOutcomes.push(outcome);
				logOutcome(changeStat, outcome, "opp", opp);
			}


			// ************** FINALLY **************

			// COMPUTE STAMINA COST
			if (prop(attack.staminaCost)) {
				changeStat = "staminaCost";
				outcome = outcomeData[changeStat];
				outcome.change = -(FS_Number.round(opp.stamina.val * attack[changeStat], 1));
				self.stamina.val = Stats.setVal(selfStr, outcome.stat, self.stamina.val + outcome.change);
				//attackOutcomes.push(outcome); // don't log
				logOutcome(changeStat, outcome, "self", self);
			}

			if (DEBUG) console.log("🔢 BattleMath.returnAttackOutcomes() final stats = " + JSON.stringify(self), opp);

			// check to make sure there was an effect
			for (let i = 0; i < attackOutcomes.length; i++) {
				// if change is not zero then there was an effect
				if (outcome.change !== 0) {
					noEffect = false;
					break;
				}
			}

			if (noEffect === true)
				return "noEffect";
			else
				return attackOutcomes; // return data
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

	// if we want attacks to ocassionally miss
	function didHit(attack, self, opp) {
		try {
			let hitChance = attack.accuracy * (self.accuracy.val / opp.evasion.val);
			if (DEBUG) console.log("🔢 BattleMath.didHit()", "hitChance=" + hitChance);
			return (hitChance > 1);
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
