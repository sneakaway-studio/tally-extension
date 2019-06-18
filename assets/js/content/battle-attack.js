"use strict";

/*  BATTLE
 ******************************************************************************/

window.BattleAttack = (function() {
	// PRIVATE

	let _logDelay = 1000,
		DEBUG = true,
		outcomeDetails = {
			"selfName": "",
			"oppName": "",
		};

	/**
	 *	Perform the attack
	 */
	function doAttack(attack, selfStr, oppStr, extraDelay = 0) {
		try {
			if (DEBUG) console.log("\n💥💥💥💥💥 ", selfStr + " 💥 " + oppStr);

			// set details for logging
			outcomeDetails.selfName = "Tally";
			outcomeDetails.oppName = Battle.details.monsterName;
			if (selfStr != "tally") {
				outcomeDetails.selfName = Battle.details.monsterName;
				outcomeDetails.oppName = "Tally";
			}

			// save attack, do battle math, return [] and save outcomes
			Battle.details.recentAttack = attack;
			let attackOutcomes = BattleMath.returnAttackOutcomes(attack, selfStr, oppStr);
			Battle.details.recentOutcomes = attackOutcomes;

			// report
			if (DEBUG) console.log("💥 Battle.doAttack() ", attack, selfStr + " 💥 " + oppStr, extraDelay, outcomeDetails);
			if (DEBUG) console.log("💥 Battle.doAttack() -> outcomeDetails=", outcomeDetails);
			if (DEBUG) console.log("💥 Battle.doAttack() -> Battle.details=", Battle.details);

			// log the attack
			BattleConsole.log(outcomeDetails.selfName + " used the " + attack.name + " " + attack.type + "!");

			// loop through attack outcomes and log, show explosion, etc.
			for (let i = 0; i < attackOutcomes.length; i++) {
				// if number is 0 skip this one
				if (attackOutcomes[i].val == 0) continue;

				// show effects
				showAttackEffects(attack, attackOutcomes[i], selfStr, oppStr);

				if (DEBUG) console.log("💥 Battle.doAttack() -> attackOutcomes[i]=", attackOutcomes[i]);

				// add name to log text
				let str = "Tally";
				attackOutcomes[i].affectsName = "tally";
				// tally is default unless one of these are true
				if (selfStr == "tally") {
					if (attackOutcomes[i].affects == "opp") {
						attackOutcomes[i].affectsName = "monster";
						str = Battle.details.monsterName;
					}
				} else if (selfStr == "monster") {
					if (attackOutcomes[i].affects == "self") {
						str = Battle.details.monsterName;
						attackOutcomes[i].affectsName = "monster";
					}
				}

				// add what happened to log text
				if (attackOutcomes[i].val < 0) {
					str += " lost ";
					// change value for log
					attackOutcomes[i].val *= -1;
				} else str += " gained ";

				// add stat detail to log text
				str += "<span class='text-blue'>" + attackOutcomes[i].val + " " + attackOutcomes[i].str + "</span>.";

				// show log and change in stats after a moment
				setTimeout(function() {
					// show log
					BattleConsole.log(str);
					// update stats displays
					if (attackOutcomes[i].affectsName == "tally")
						StatsDisplay.updateAllTallyStatsDisplay();
					else
						StatsDisplay.updateAllMonsterStatsDisplay();
				}, _logDelay + 300);

			}


			// show thought?
			//Thought.showThought(Thought.getThought(["battle", "start", 0]), true);

			// if battle not over
			if (!Battle.active) return;
			// decide who gets next turn...
			if (selfStr == "tally") {
				// monster will attack back in a moment
				setTimeout(function() {
					doAttack(FS_Object.randomObjProperty(Battle.details.monsterAttacks), "monster", "tally");
				}, _logDelay + 3000);
			} else {
				// prompt user to attack in a moment
				setTimeout(function() {
					// turn control back to player
					BattleConsole.log("What will Tally do?", "showBattleOptions");
				}, _logDelay + 500);
			}
		} catch (err) {
			console.log(err);
		}
	}





	function showAttackEffects(attack, attackOutcome, selfStr, oppStr) {
		try {
			// make the effect dependent upon the attackOutcome???

			// if self is Tally
			if (selfStr == "tally") {
				if (attack.type == "attack") {
					// fire projectile at monster
					BattleEffect.fireProjectile("monster", "small");
				} else if (attack.type == "defense") {
					// or show explosion on Tally
					BattleEffect.showExplosion(Core.getCenterPosition("#tally_character"), false);
				}
			}
			// if self is monster
			else {
				if (attack.type == "attack") {
					// fire projectile at tally
					BattleEffect.fireProjectile("tally", "small");
				} else if (attack.type == "defense") {
					// show explosion on monster
					BattleEffect.showExplosion(Core.getCenterPosition(".tally_monster_sprite"), false);
				}
			}
		} catch (err) {
			console.error(err);
		}
	}


	/**
	 *	Reward Tally with a new attack
	 */
	function rewardWithAttack(attack) {
		try {
			// make sure tally doesn't already have that attack

			// tell user

			// save tally_user
		} catch (err) {
			console.error(err);
		}
	}


	// PUBLIC
	return {
		doAttack: function(attack, self, opp, extraDelay) {
			doAttack(attack, self, opp, extraDelay);
		}
	};
})();
