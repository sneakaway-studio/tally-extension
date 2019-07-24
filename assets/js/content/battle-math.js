"use strict";

/*  (BATTLE) MATH
 ******************************************************************************/

window.BattleMath = (function() {
	// PRIVATE VARS;

	let DEBUG = Debug.ALL.BattleMath,
		outcomeData = {
			"selfHealth": {
				"change": 0,
				"affects": "self",
				"stat": "health",
				"affectsStat": "selfHealth"
			},
			"oppHealth": {
				"change": 0,
				"affects": "opp",
				"stat": "health",
				"affectsStat": "oppHealth"
			},
			"selfAtk": {
				"change": 0,
				"affects": "self",
				"stat": "attack",
				"affectsStat": "selfAtk"
			},
			"oppAtk": {
				"change": 0,
				"affects": "opp",
				"stat": "attack",
				"affectsStat": "oppAtk"
			},
			"selfAcc": {
				"change": 0,
				"affects": "self",
				"stat": "accuracy",
				"affectsStat": "selfAcc"
			},
			"oppAcc": {
				"change": 0,
				"affects": "opp",
				"stat": "accuracy",
				"affectsStat": "oppAcc"
			},
			"selfEva": {
				"change": 0,
				"affects": "self",
				"stat": "evasion",
				"affectsStat": "selfEva"
			},
			"oppEva": {
				"change": 0,
				"affects": "opp",
				"stat": "evasion",
				"affectsStat": "oppEva"
			},
			"selfDef": {
				"change": 0,
				"affects": "self",
				"stat": "defense",
				"affectsStat": "selfDef"
			},
			"oppDef": {
				"change": 0,
				"affects": "opp",
				"stat": "defense",
				"affectsStat": "oppDef"
			},
			"staminaCost": {
				"change": 0,
				"affects": "self",
				"stat": "stamina",
				"affectsStat": "staminaCost"
			}
		};

	function logOutcome(which, outcome, who, stat) {
		if (!DEBUG) return;
		console.log("🔢 BattleMath.logOutcome() attack." + which,
			"\n --> outcome=", JSON.stringify(outcome) +
			"\n --> " + who + "=", JSON.stringify(stat));
	}


	/**
	 * 	Examine attack, do math, return [] of outcomes
	 * 	- attack = attack object
	 *  - selfStr = "tally" | "monster"
	 */
	function returnAttackOutcomes(attack, selfStr, oppStr) {
		try {
			if (!prop(attack)) {
				console.error("🔢 BattleMath.returnAttackOutcomes() attack is required!");
				return;
			}
			// get stats
			let self = Stats.get(selfStr),
				opp = Stats.get(oppStr),
				noEffect = true,
				stat = "",
				affectsStat = "",
				attackOutcomes = [], // track the outcome(s) of the attack to log them
				outcome = {}; // default outcome



			// ************** STAMINA FIRST **************

			// COMPUTE STAMINA COST FIRST
			if (prop(attack.staminaCost)) {
				stat = "stamina";
				affectsStat = "staminaCost";
				outcome = outcomeData[affectsStat];
				outcome.change = -(FS_Number.round(self[stat].max * attack[affectsStat], 1));
				self[stat].val = Stats.setVal(selfStr, outcome.stat, self[stat].val + outcome.change);
				//attackOutcomes.push(outcome); // don't log stamina
				// if (!DEBUG) console.log("self[stat].val=" + self[stat].val, "attack[affectsStat]=" + attack[affectsStat],
				// 	"self[stat].max * attack[affectsStat]=", (self[stat].max * attack[affectsStat]));
				// logOutcome(affectsStat, outcome, "self", self);
			}

			// if not a defense, check to see if there is a miss
			if (attack.type !== "defense" && !didHit(attack, self, opp)) {
				return "missed";
			}
			// was it a special attack?
			else if (prop(attack.special)) {
				console.log("🔢 BattleMath.returnAttackOutcomes() SPECIAL ATTACK !", attack.special);

				// types...
				if (attack.special === "opp-loses-1-turn") {
					return "opp-loses-1-turn";
				} else if (attack.special === "opp-loses-2-turns") {
					return "opp-loses-2-turns";
				} else if (attack.special === "opp-loses-3-turns") {
					return "opp-loses-3-turns";
				}

			}

			if (DEBUG) console.log("🔢 BattleMath.returnAttackOutcomes()", selfStr + " 🧨 " + oppStr, attack,
				"\n --> self=", self,
				"\n --> self=", JSON.stringify(self),
				"\n --> opp=", opp,
				"\n --> opp=", JSON.stringify(opp)
			);



			// ************** HEALTH **************

			// SELF +HEALTH
			if (prop(attack.selfHealth)) {
				stat = "health";
				affectsStat = "selfHealth";
				outcome = outcomeData[affectsStat]; // get data
				outcome.change = FS_Number.round(self[stat].max * attack[affectsStat], 1); // get change
				self[stat].val = Stats.setVal(selfStr, outcome.stat, self[stat].val + outcome.change); // set new val
				attackOutcomes.push(outcome); // store outcome
				logOutcome(affectsStat, outcome, "self", self); // log
			}
			// OPP -HEALTH
			if (prop(attack.oppHealth)) {
				stat = "health";
				affectsStat = "oppHealth";
				outcome = outcomeData[affectsStat];
				outcome.change = -(FS_Number.round(opp[stat].max * attack[affectsStat], 1));
				// console.log("outcome.change="+outcome.change,"opp[stat].val + outcome.change=",(opp[stat].val + outcome.change))
				opp[stat].val = Stats.setVal(oppStr, outcome.stat, opp[stat].val + outcome.change);
				attackOutcomes.push(outcome);
				logOutcome(affectsStat, outcome, "opp", opp);
			}



			// ************** ATTACK **************

			// INCREASE SELF ATTACK
			if (prop(attack.selfAtk)) {
				stat = "attack";
				affectsStat = "selfAtk";
				outcome = outcomeData[affectsStat];
				outcome.change = FS_Number.round(self[stat].max * attack[affectsStat], 1);
				//if (outcome.change != 0)
				self[stat].val = Stats.setVal(selfStr, outcome.stat, self[stat].val + outcome.change);
				attackOutcomes.push(outcome);
				logOutcome(affectsStat, outcome, "self", self);
			}
			// DAMAGE OPP ATTACK
			if (prop(attack.oppAtk)) {
				stat = "attack";
				affectsStat = "oppAtk";
				outcome = outcomeData[affectsStat];
				outcome.change = -(FS_Number.round(opp[stat].max * attack[affectsStat], 1));
				opp[stat].val = Stats.setVal(oppStr, outcome.stat, opp[stat].val + outcome.change);
				attackOutcomes.push(outcome);
				logOutcome(affectsStat, outcome, "opp", opp);
			}


			// ************** ACCURACY **************

			// INCREASE SELF ACCURACY
			if (prop(attack.selfAcc)) {
				stat = "accuracy";
				affectsStat = "selfAcc";
				outcome = outcomeData[affectsStat];
				outcome.change = FS_Number.round(self[stat].max * attack[affectsStat], 1);
				self[stat].val = Stats.setVal(selfStr, outcome.stat, self[stat].val + outcome.change);
				attackOutcomes.push(outcome);
				logOutcome(affectsStat, outcome, "self", self);
			}
			// DAMAGE OPP ACCURACY
			if (prop(attack.oppAcc)) {
				stat = "accuracy";
				affectsStat = "oppAcc";
				outcome = outcomeData[affectsStat];
				outcome.change = -(FS_Number.round(opp[stat].max * attack[affectsStat], 1));
				opp[stat].val = Stats.setVal(oppStr, outcome.stat, opp[stat].val + outcome.change);
				attackOutcomes.push(outcome);
				logOutcome(affectsStat, outcome, "opp", opp);
			}


			// ************** EVASION **************

			// INCREASE SELF EVASION
			if (prop(attack.selfEva)) {
				stat = "evasion";
				affectsStat = "selfEva";
				outcome = outcomeData[affectsStat];
				outcome.change = FS_Number.round(self[stat].max * attack[affectsStat], 1);
				self[stat].val = Stats.setVal(selfStr, outcome.stat, self[stat].val + outcome.change);
				attackOutcomes.push(outcome);
				logOutcome(affectsStat, outcome, "self", self);
			}
			// DAMAGE OPP EVASION
			if (prop(attack.oppEva)) {
				stat = "evasion";
				affectsStat = "oppEva";
				outcome = outcomeData[affectsStat];
				outcome.change = -(FS_Number.round(opp[stat].max * attack[affectsStat], 1));
				opp[stat].val = Stats.setVal(oppStr, outcome.stat, opp[stat].val + outcome.change);
				attackOutcomes.push(outcome);
				logOutcome(affectsStat, outcome, "opp", opp);
			}


			// ************** DEFENSE **************

			// INCREASE SELF DEFENSE
			if (prop(attack.selfDef)) {
				stat = "defense";
				affectsStat = "selfDef";
				outcome = outcomeData[affectsStat];
				outcome.change = FS_Number.round(self[stat].max * attack[affectsStat], 1);
				self[stat].val = Stats.setVal(selfStr, outcome.stat, self[stat].val + outcome.change);
				attackOutcomes.push(outcome);
				logOutcome(affectsStat, outcome, "self", self);
			}
			// DAMAGE OPP DEFENSE
			if (prop(attack.oppDef)) {
				stat = "defense";
				affectsStat = "oppDef";
				outcome = outcomeData[affectsStat];
				outcome.change = -(FS_Number.round(opp[stat].max * attack[affectsStat], 1));
				opp[stat].val = Stats.setVal(oppStr, outcome.stat, opp[stat].val + outcome.change);
				attackOutcomes.push(outcome);
				logOutcome(affectsStat, outcome, "opp", opp);
			}


			if (DEBUG) console.log("🔢 BattleMath.returnAttackOutcomes() final stats = ", selfStr + " 🧨 " + oppStr, attack,
				"\n --> self=", JSON.stringify(self),
				"\n --> opp=", JSON.stringify(opp));

			// check to make sure there was an effect
			for (let i = 0; i < attackOutcomes.length; i++) {
				//console.log("outcome", outcome);
				// if change is not zero then there was an effect
				if (outcome.change > 0 || outcome.change < 0) {
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
			if (DEBUG) console.log("🔢 BattleMath.didHit()", "attack =", attack, "self =", self, "opp =", opp);
			let hitChance = attack.accuracy * (self.accuracy.val / opp.evasion.val);
			if (DEBUG) console.log("🔢 BattleMath.didHit()",
				"hitChance [" + hitChance + "] = attack.accuracy [" + attack.accuracy + "] * ",
				"(self.accuracy.val [" + self.accuracy.val + "] / opp.evasion.val [" + opp.evasion.val + "])");
			return (hitChance > 0.7);
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
