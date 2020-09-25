"use strict";

/*  (BATTLE) MATH
 ******************************************************************************/

window.BattleMath = (function () {
	// PRIVATE VARS;

	let DEBUG = Debug.ALL.BattleMath,
		tallyMisses = 0, // track # of misses in battle
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
			},
			"opp-loses-1-turn": {
				"change": 1,
				"affects": "opp",
				"special": "opp-loses-1-turn"
			},
			"opp-loses-2-turns": {
				"change": 2,
				"affects": "opp",
				"special": "opp-loses-2-turns"
			}
		};

	function logOutcome(which, outcome, who = "", stat = 0) {
		if (!which || !outcome) return;
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
			if (!FS_Object.prop(attack)) {
				console.error("🔢 BattleMath.returnAttackOutcomes() attack is required!");
				return;
			}
			// get stats
			let self = Stats.get(selfStr),
				opp = Stats.get(oppStr),
				selfLevel = 1,
				oppLevel = 1,
				noEffect = true,
				stat = "",
				affectsStat = "",
				attackOutcomes = [], // track the outcome(s) of the attack to log them
				outcome = {}; // default outcome

			if (selfStr == "monster"){
				selfLevel = Monster.current().level;
				oppLevel = T.tally_user.level;
			} else if (selfStr == "tally"){
				selfLevel = T.tally_user.level;
				oppLevel = Monster.current().level;
			}


			// ************** STAMINA FIRST **************

			// COMPUTE STAMINA COST FIRST
			if (FS_Object.prop(attack.staminaCost)) {
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
				// two tally misses total
				if (self == "tally" && ++tallyMisses < 2)
					return "missed";
				else
					return "missed";
			}
			// was it a special attack?
			else if (FS_Object.prop(attack.special)) {
				if (DEBUG) console.log("🔢 BattleMath.returnAttackOutcomes() SPECIAL ATTACK !", attack.special);
				outcome = outcomeData[attack.special]; // get data
				// make sure its defined
				if (outcome) {
					attackOutcomes.push(outcome); // store outcome
					logOutcome(attack.special, outcome); // log
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
			if (FS_Object.prop(attack.selfHealth)) {
				stat = "health";
				affectsStat = "selfHealth";
				outcome = outcomeData[affectsStat]; // get data
				outcome.change = FS_Number.round(self[stat].max * attack[affectsStat], 1); // get change
				self[stat].val = Stats.setVal(selfStr, outcome.stat, self[stat].val + outcome.change); // set new val
				attackOutcomes.push(outcome); // store outcome
				logOutcome(affectsStat, outcome, "self", self); // log
			}
			// OPP -HEALTH
			if (FS_Object.prop(attack.oppHealth)) {
				stat = "health";
				affectsStat = "oppHealth";
				outcome = outcomeData[affectsStat];
				// change = (max opp stat * the normalized attack stat) + (self level * the normalized attack stat)
				// e.g. tally (lvl 40) vs. monster (level 5) gives the advantage to tally
				// e.g. monster (lvl 40) vs. tally (level 5) gives the advantage to monster
				// I just changed this to be based on ATK and DEF values rather than as a proportion of level
				outcome.change = -(FS_Number.round((1+attack[affectsStat])*Math.max((self["attack"]-opp["defense"]), 2.0), 3));
				if (DEBUG) console.log(
					"outcome.change [" + outcome.change + "] = -(FS_Number.round(" +
					"opp[stat].max [" + opp[stat].max + "] *", "attack[affectsStat] [" + attack[affectsStat] + "] + " +
					"selfLevel [" + selfLevel + "] * attack[affectsStat] [" + attack[affectsStat] + "] , 3))"
				);
				if (DEBUG) console.log("opp[stat].val [" + opp[stat].val + "] + outcome.change [" + outcome.change + "] = " +
					(opp[stat].val + outcome.change));

				opp[stat].val = Stats.setVal(oppStr, outcome.stat, opp[stat].val + outcome.change);
				attackOutcomes.push(outcome);
				logOutcome(affectsStat, outcome, "opp", opp);
			}



			// ************** ATTACK **************

			// INCREASE SELF ATTACK
			if (FS_Object.prop(attack.selfAtk)) {
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
			if (FS_Object.prop(attack.oppAtk)) {
				stat = "attack";
				affectsStat = "oppAtk";
				outcome = outcomeData[affectsStat];
				outcome.change = -(FS_Number.round((opp[stat].max * attack[affectsStat]), 3));
				opp[stat].val = Stats.setVal(oppStr, outcome.stat, opp[stat].val + outcome.change);
				attackOutcomes.push(outcome);
				logOutcome(affectsStat, outcome, "opp", opp);
			}


			// ************** ACCURACY **************

			// INCREASE SELF ACCURACY
			if (FS_Object.prop(attack.selfAcc)) {
				stat = "accuracy";
				affectsStat = "selfAcc";
				outcome = outcomeData[affectsStat];
				outcome.change = FS_Number.round(self[stat].max * attack[affectsStat], 1);
				self[stat].val = Stats.setVal(selfStr, outcome.stat, self[stat].val + outcome.change);
				attackOutcomes.push(outcome);
				logOutcome(affectsStat, outcome, "self", self);
			}
			// DAMAGE OPP ACCURACY
			if (FS_Object.prop(attack.oppAcc)) {
				stat = "accuracy";
				affectsStat = "oppAcc";
				outcome = outcomeData[affectsStat];
				outcome.change = -(FS_Number.round((opp[stat].max * attack[affectsStat]), 3));
				opp[stat].val = Stats.setVal(oppStr, outcome.stat, opp[stat].val + outcome.change);
				attackOutcomes.push(outcome);
				logOutcome(affectsStat, outcome, "opp", opp);
			}


			// ************** EVASION **************

			// INCREASE SELF EVASION
			if (FS_Object.prop(attack.selfEva)) {
				stat = "evasion";
				affectsStat = "selfEva";
				outcome = outcomeData[affectsStat];
				outcome.change = FS_Number.round(self[stat].max * attack[affectsStat], 1);
				self[stat].val = Stats.setVal(selfStr, outcome.stat, self[stat].val + outcome.change);
				attackOutcomes.push(outcome);
				logOutcome(affectsStat, outcome, "self", self);
			}
			// DAMAGE OPP EVASION
			if (FS_Object.prop(attack.oppEva)) {
				stat = "evasion";
				affectsStat = "oppEva";
				outcome = outcomeData[affectsStat];
				outcome.change = -(FS_Number.round((opp[stat].max * attack[affectsStat]), 3));
				opp[stat].val = Stats.setVal(oppStr, outcome.stat, opp[stat].val + outcome.change);
				attackOutcomes.push(outcome);
				logOutcome(affectsStat, outcome, "opp", opp);
			}


			// ************** DEFENSE **************

			// INCREASE SELF DEFENSE
			if (FS_Object.prop(attack.selfDef)) {
				stat = "defense";
				affectsStat = "selfDef";
				outcome = outcomeData[affectsStat];
				outcome.change = FS_Number.round(self[stat].max * attack[affectsStat], 1);
				self[stat].val = Stats.setVal(selfStr, outcome.stat, self[stat].val + outcome.change);
				attackOutcomes.push(outcome);
				logOutcome(affectsStat, outcome, "self", self);
			}
			// DAMAGE OPP DEFENSE
			if (FS_Object.prop(attack.oppDef)) {
				stat = "defense";
				affectsStat = "oppDef";
				outcome = outcomeData[affectsStat];
				outcome.change = -(FS_Number.round((opp[stat].max * attack[affectsStat]), 3));
				opp[stat].val = Stats.setVal(oppStr, outcome.stat, opp[stat].val + outcome.change);
				attackOutcomes.push(outcome);
				logOutcome(affectsStat, outcome, "opp", opp);
			}


			if (DEBUG) console.log("🔢 BattleMath.returnAttackOutcomes() final stats = ",
				selfStr + " 🧨 " + oppStr, attack
				// ,"\n --> self=", JSON.stringify(self),
				// "\n --> opp=", JSON.stringify(opp)
			);

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
			if (DEBUG) console.log("🔢 BattleMath.didHit() [1]", "attack =", attack, "self =", self, "opp =", opp);
			if (!attack.accuracy) attack.accuracy = 1; // in case problem saving attack data
			let hitChance = attack.accuracy * (self.accuracy.val / opp.evasion.val);
			let r = Math.random();
			if (isNaN(hitChance)) hitChance = 0.9; // default to hit

			if (DEBUG) console.log("🔢 BattleMath.didHit() [2]",
				"hitChance [" + hitChance + "] = attack.accuracy [" + attack.accuracy + "] * ",
				"(self.accuracy.val [" + self.accuracy.val + "] / opp.evasion.val [" + opp.evasion.val + "]) r=", r,
				"didHit ===", (hitChance > r)
			);

			// return (hitChance > 0.6);
			// make sure chance is actually represented
			return (hitChance > r);
		} catch (err) {
			console.error(err);
		}
	}


	// PUBLIC
	return {
		returnAttackOutcomes: function (attack, selfStr, oppStr) {
			return returnAttackOutcomes(attack, selfStr, oppStr);
		}
	};
})();
