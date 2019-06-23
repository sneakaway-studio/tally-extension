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
			if (DEBUG) console.log("\n💥💥💥💥💥 ");
			if (DEBUG) console.log("💥 Battle.doAttack() ", attack, selfStr + " 💥 " + oppStr, extraDelay);

			let positiveOutcome = null,
				endBattle = false,
				endBattleMessage = "";

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

			// report
			if (DEBUG) console.log("💥 Battle.doAttack() -> outcomeDetails=", outcomeDetails);
			if (DEBUG) console.log("💥 Battle.doAttack() -> Battle.details=", Battle.details);

			// log the attack
			BattleConsole.log(outcomeDetails.selfName + " used the " + attack.name + " " + attack.type + "!");

			if (attackOutcomes === "missed") {
				// show log
				BattleConsole.log("The attack <span class='text-blue'>missed</span>!");
				// go to next turn...
				nextAttackPrompt(selfStr);
			} else if (attackOutcomes === "noEffect") {
				// show log
				BattleConsole.log("The attack <span class='text-blue'>had no effect</span>.");
				// show effects
				showAttackEffects(attack, selfStr, oppStr);
				// go to next turn...
				nextAttackPrompt(selfStr);
			} else {
				// store outcomes
				Battle.details.recentOutcomes = attackOutcomes;

				// loop through attack outcomes and log, show explosion, etc.
				for (let i = 0; i < attackOutcomes.length; i++) {
					/*jshint loopfunc: true */

					// if number is 0 skip this one
					if (attackOutcomes[i].val == 0) continue;

					// show effects
					showAttackEffects(attack, selfStr, oppStr);

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
						// change value for log
						str += " lost <span class='text-blue'>" + (attackOutcomes[i].val *= -1) + " " + attackOutcomes[i].stat + "</span>.";
						// determine what tally says
						if (selfStr == "tally") positiveOutcome = false;
					} else if (attackOutcomes[i].val > 0) {
						str += " gained <span class='text-blue'>" + attackOutcomes[i].val + " " + attackOutcomes[i].stat + "</span>.";
						if (selfStr == "tally") positiveOutcome = true;
					} else {
						// no change, continue to next outcome
					}

					// show log and change in stats after a moment
					setTimeout(function() {
						// show log
						BattleConsole.log(str);
						// update stats display
						StatsDisplay.updateDisplay(attackOutcomes[i].affectsName);
					}, _logDelay + 300);

				}
				// show thought from Tally commenting on the outcome of last attack
				let r = Math.random();
				if (r > 0.7) {
					// show log and change in stats after a moment
					setTimeout(function() {
						if (positiveOutcome == true)
							Thought.showThought(Thought.getThought(["battle", "gained-stats", 0]), true);
						else if (positiveOutcome == false)
							Thought.showThought(Thought.getThought(["battle", "lost-stats", 0]), true);
					}, _logDelay + 300);
				}


				// ********** BATTLE PROGRESS ********** //

				// is battle close to being over?
				if (Stats.get("tally").health.val <= (Stats.get("tally").health.max / 2) ||
					Stats.get("monster").health.val <= (Stats.get("monster").health.max / 2)
				) {
					Battle.progress = 2;
				}
				if (Battle.progress == 2) {
					//Sound.changeMusic('battle1-c-sharp.wav');
					Thought.showString("Whoa, this is getting intense!", null, true);
				}

				// did tally lose?
				if (Stats.get("tally").health.val <= 0) {
					endBattle = true;
					Thought.showString("Oh no, we are out of health...", "sad", true);
					endBattleMessage = "We need to take a break from the internet and recharge!";
				} else if (Stats.get("tally").stamina.val <= 0) {
					endBattle = true;
					Thought.showString("Oh no, our stamina is depleted...", "sad", true);
					endBattleMessage = "We lost this time but we'll fight these trackers another day!";
				}
				// did tally win?
				else if (Stats.get("monster").health.val <= 0) {
					endBattle = true;
					Thought.showString("Yay, the monster is out of health...", "happy", true);
					endBattleMessage = "";
				} else if (Stats.get("monster").stamina.val <= 0) {
					endBattle = true;
					Thought.showString("Awesome! The monster has no stamina left...", "happy", true);
					endBattleMessage = "";
				}


				// is battle over?
				if (endBattle) {
					setTimeout(function() {
						Thought.showString(endBattleMessage, "neutral", true);
						setTimeout(function() {
							Battle.end();
						}, _logDelay + 2000);
					}, _logDelay + 2000);
				}
				// else keep fighting!
				else {
					// go to next turn...
					nextAttackPrompt(selfStr);
				}
			}
		} catch (err) {
			console.log(err);
		}
	}

	/**
	 * 	Determine and prompt who gets next attack
	 */
	function nextAttackPrompt(selfStr) {
		// decide who gets next turn...
		if (selfStr == "tally") {
			// monster will attack back in a moment
			setTimeout(function() {
				doAttack(FS_Object.randomObjProperty(Battle.details.monsterAttacks), "monster", "tally");
			}, _logDelay + 3500);
		} else {
			// prompt user to attack in a moment
			setTimeout(function() {
				// turn control back to player
				BattleConsole.log("What will Tally do?", "showBattleOptions");
			}, _logDelay + 500);
		}
	}

	function showAttackEffects(attack, selfStr, oppStr) {
		try {

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
	function rewardAttack() {
		try {
			// get random attack
			let attack = AttackData.returnAttack();
			console.log("🕗 TallyEvents.checkTutorialEvents() --> awardFirstAttack", attack);

			// make sure tally doesn't already have that attack
			while (prop(tally_user.attacks[attack.name]))
				// if so get a new one
				attack = AttackData.returnAttack();

			// store and save
			tally_user.attacks[attack.name] = attack;
			TallyStorage.saveData('tally_user', tally_user);

			// tell user
			Thought.showString("You earned the " + attack.name + " " + attack.type + "!", "happy");
		} catch (err) {
			console.error(err);
		}
	}


	// PUBLIC
	return {
		doAttack: function(attack, self, opp, extraDelay) {
			doAttack(attack, self, opp, extraDelay);
		},
		rewardAttack: rewardAttack
	};
})();
