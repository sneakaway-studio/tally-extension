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
			"outcomes": []
		};


	/**
	 * 	Get outcomeDetails
	 */
	function getOutcomeDetails() {
		try {
			return outcomeDetails;
		} catch (err) {
			console.error(err);
		}
	}

	/**
	 *	Perform the attack
	 */
	function doAttack(attack, selfStr, oppStr, extraDelay = 0) {
		try {
			if (DEBUG) console.log("\n\n💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥");
			if (DEBUG) console.log("💥💥💥💥💥 ", selfStr + " 🧨 " + oppStr, "💥💥💥💥💥");
			if (DEBUG) console.log("💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥");
			if (DEBUG) console.log("💥 Battle.doAttack()", attack, extraDelay);

			// is an attack already in progress?
			if (Battle.details.attackInProgress) {
				if (DEBUG) console.warn("💥 Battle.doAttack() AN ATTACK IS ALREADY IN PROGRESS", Battle.details);
				return;
			}
			// set attack in progress
			else Battle.details.attackInProgress = true;

			// save attack
			Battle.details.recentAttack = attack;
			// set details for logging
			outcomeDetails = {
				"selfName": "Tally",
				"oppName": Battle.details.monsterName,
				"outcomes": {} // reset
			};
			// unless self == monster
			if (selfStr === "monster") {
				outcomeDetails.selfName = Battle.details.monsterName;
				outcomeDetails.oppName = "Tally";
			}

			// 1. show lurch from launching attack
			if (selfStr == "tally")
				BattleEffect.showAttackLurch("#tally_character_inner", 1);
			else if (selfStr == "monster")
				BattleEffect.showAttackLurch(".tally_monster_sprite", -1);

			// 2. do battle math, return [] and save outcomes
			outcomeDetails.outcomes = BattleMath.returnAttackOutcomes(attack, selfStr, oppStr);

			// 3. update stats display for player who is did attack (really just stamina)
			StatsDisplay.updateDisplay(selfStr);

			// 4. log the attack
			BattleConsole.log(outcomeDetails.selfName + " used the " + attack.name + " " + attack.type + "!");

			// 5. start attack effects
			BattleEffect.startAttackEffects(attack, selfStr, oppStr, "small");

		} catch (err) {
			console.log(err);
		}
	}

	/**
	 *	Perform the attack
	 */
	function handleAttackOutcomes(attack, selfStr, oppStr) {
		try {
			if (DEBUG) console.log("💥 Battle.handleAttackOutcomes()", attack, outcomeDetails.outcomes, selfStr, oppStr);

			// is an attack not in progress ATM?
			if (!Battle.details.attackInProgress) return;

			let positiveOutcomeTally = null;


			// 1. what is the result of the attack?

			// ATTACK MISSED
			if (outcomeDetails.outcomes === "missed") {
				// go to next turn...
				nextAttackPrompt(selfStr, "The attack <span class='text-blue'>missed</span>!");
			}
			// ATTACK HAD NO EFFECT
			else if (outcomeDetails.outcomes === "noEffect") {
				// go to next turn...
				nextAttackPrompt(selfStr, "The attack <span class='text-blue'>had no effect</span>.");
			}
			// ATTACK RESULTED IN INCREASE OR DECREASE IN STATS
			else if (outcomeDetails.outcomes.length > 0) {

				// 2. get the name of the player to create attack outcome log

				let affectsStr = "tally",
					affectsName = "Tally",
					attackOutcomeLog = "",
					gainedLostString = "";
				// tally is default unless one of these are true
				if (selfStr == "tally") {
					if (outcomeDetails.outcomes[0].affects == "opp") {
						affectsStr = "monster";
						affectsName = Battle.details.monsterName;
					}
				} else if (selfStr == "monster") {
					if (outcomeDetails.outcomes[0].affects == "self") {
						affectsStr = "monster";
						affectsName = Battle.details.monsterName;
					}
				}

				// 3. loop through attack outcomes and add to attackOutcomeLog
				for (let i = 0; i < outcomeDetails.outcomes.length; i++) {
					/*jshint loopfunc: true */

					if (DEBUG) console.log("💥 Battle.handleAttackOutcomes() -> outcomeDetails.outcomes[i]=", outcomeDetails.outcomes[i]);

					// if number is 0 skip
					if (outcomeDetails.outcomes[i].change == 0) continue;

					let flipStat = 1;

					// was the stat decreased?
					if (outcomeDetails.outcomes[i].change < 0) {
						// if the first loop
						if (gainedLostString === "") gainedLostString = " lost ";
						// change to positive value
						flipStat = -1;
					}
					// or increased?
					else if (outcomeDetails.outcomes[i].change > 0) {
						// if the first loop
						if (gainedLostString === "") gainedLostString = " gained ";
						// mark positive outcome
						if (selfStr == "tally") positiveOutcomeTally = true;
						// show positive value
						flipStat = 1;
					}

					// if 2 outcomes and on 2nd outcome
					if (outcomeDetails.outcomes.length === 2 && i === 1) attackOutcomeLog += " and ";
					// if 3+ outcomes and on last outcome
					else if (outcomeDetails.outcomes.length >= 3 && i === outcomeDetails.outcomes.length - 1) attackOutcomeLog += " and ";
					// if 3+ outcomes and before last outcome but after first
					else if (outcomeDetails.outcomes.length >= 3 && i > 0 && i < outcomeDetails.outcomes.length - 1) attackOutcomeLog += ", ";

					// add to log, changing value for display
					attackOutcomeLog += "<span class='text-blue'>" + (outcomeDetails.outcomes[i].change *= flipStat);
					attackOutcomeLog += " " + outcomeDetails.outcomes[i].stat + "</span>";


					//if (DEBUG) console.log("attackOutcomeLog=", attackOutcomeLog);
				}

				// determine what tally says
				if (oppStr === "tally") {
					positiveOutcomeTally = false;
					// show lurch and damage from recieving attack
					if (attack.type !== "defense") {
						BattleEffect.showAttackLurch("#tally_character_inner", -1);
						BattleEffect.showDamage("#tally_character_inner", 500);
					}
				} else if (oppStr === "monster") {
					// show lurch and damage from recieving attack
					if (attack.type !== "defense") {
						BattleEffect.showAttackLurch(".tally_monster_sprite", 1);
						BattleEffect.showDamage(".tally_monster_sprite", 500);
					}
				}

				// put string together
				attackOutcomeLog = affectsName + " " + gainedLostString + " " + attackOutcomeLog + "!";

				// show log and change in stats after a moment
				setTimeout(function() {
					if (DEBUG) console.log("💥 Battle.handleAttackOutcomes() attackOutcomeLog=", attackOutcomeLog);
					// show log
					BattleConsole.log(attackOutcomeLog);
					// update stats display for player who is affected
					StatsDisplay.updateDisplay(affectsStr);

					// show thought from Tally commenting on the outcome of last attack
					let r = Math.random();
					if (r > 0.7) {
						// show log and change in stats after a moment
						setTimeout(function() {
							if (positiveOutcomeTally == true)
								Thought.showThought(Thought.getThought(["battle", "gained-stats", 0]), true);
							else if (positiveOutcomeTally == false)
								Thought.showThought(Thought.getThought(["battle", "lost-stats", 0]), true);
						}, _logDelay + 300);
					}
					// end check
					checkForEnd(selfStr, oppStr);
				}, _logDelay + 300);
			}
		} catch (err) {
			console.log(err);
		}
	}



	/**
	 * 	Did someone win?
	 */
	function checkForEnd(selfStr, oppStr) {
		try {
			if (DEBUG) console.log("💥 Battle.checkForEnd()");

			// is an attack not in progress ATM?
			if (!Battle.details.attackInProgress) return;

			let endBattle = false,
				endBattleMessage = "";






			// 2. check for winner

			// did tally lose?
			if (Stats.get("tally").health.val <= 0) {
				Sound.stopMusic();
				Thought.showString("Oh no, we are out of health...", "sad", true);
				endBattle = true;
				endBattleMessage = "We need to take a break from the internet and recharge!";
				BattleConsole.log("Tally's health has been depleted. Tally loses.");
				Sound.playFile("music/battle-defeat.wav", false, 0);
			} else if (Stats.get("tally").stamina.val <= 0) {
				Sound.stopMusic();
				Thought.showString("Oh no, our stamina is all gone...", "sad", true);
				endBattle = true;
				endBattleMessage = "We lost this time but we'll fight these trackers another day!";
				BattleConsole.log("Tally's stamina has been depleted. Tally loses.");
				Sound.playFile("music/battle-defeat.wav", false, 0);
			}
			// did tally win?
			else if (Stats.get("monster").health.val <= 0) {
				Sound.stopMusic();
				Thought.showString("Yay, the monster is out of health...", "happy", true);
				endBattle = true;
				endBattleMessage = "";
				BattleConsole.log("The monster's health has been depleted. Tally wins!!!");
				Sound.playFile("music/battle-victory.wav", false, 0);
			} else if (Stats.get("monster").stamina.val <= 0) {
				Sound.stopMusic();
				Thought.showString("Awesome! The monster has no stamina left...", "happy", true);
				endBattle = true;
				endBattleMessage = "";
				BattleConsole.log("The monster's stamina has been depleted. Tally wins!!!");
				Sound.playFile("music/battle-victory.wav", false, 0);
			} else {

				// or update battle progress

				// set Battle.details.progress == to lowest stat of tally | monster
				Battle.details.progress = Math.min(
					Stats.get("tally").health.normalized,
					Stats.get("tally").stamina.normalized,
					Stats.get("monster").health.normalized,
					Stats.get("monster").stamina.normalized
				);
				let progressMessage = "";

				if (Battle.details.progress > 0.9){
					progressMessage = "What kind of algorithms are guiding this monster!?";
				} else if (Battle.details.progress > 0.8){
					progressMessage = "Not too shabby";
				} else if (Battle.details.progress > 0.7){
					progressMessage = "This monster won't get away so easily";
				} else if (Battle.details.progress > 0.6){
					progressMessage = "Fight for your right to be let alone!";
				} else if (Battle.details.progress > 0.5){
					progressMessage = "Keep going!";
				} else if (Battle.details.progress > 0.4){
					progressMessage = "This monster is tough!";
				} else if (Battle.details.progress > 0.3){
					progressMessage = "Whoa, this is getting intense!";
				} else if (Battle.details.progress > 0.2){
					progressMessage = "The battle is almost over!";
				} else if (Battle.details.progress > 0.1){
					progressMessage = "One more hit...";
				} else {
					progressMessage = "Finally!";
				}
				if (Battle.active())
					Thought.showString(progressMessage, null, true);

			}


			// 3. check if battle over
			if (endBattle) {
				setTimeout(function() {
					// show final thought
					Thought.showString(endBattleMessage, "neutral", true);
					setTimeout(function() {
						Battle.end();
					}, _logDelay + 2000);
				}, _logDelay + 4000);
			}
			// else keep fighting!
			else {
				// go to next turn...
				nextAttackPrompt(selfStr);
			}
		} catch (err) {
			console.error(err);
		}

	}





	/**
	 * 	Determine and prompt who gets next attack
	 */
	function nextAttackPrompt(selfStr, message = "") {
		try {
			// allow a new attack to happen
			Battle.details.attackInProgress = false;

			// show log
			if (message !== "") BattleConsole.log(message);

			// decide who gets next turn...
			if (selfStr == "tally") {
				// monster will attack back in a moment
				setTimeout(function() {
					doAttack(FS_Object.randomObjProperty(Battle.details.monsterAttacks), "monster", "tally");
				}, _logDelay + 1000);
			} else {
				// prompt user to attack in a moment
				setTimeout(function() {
					// turn control back to player
					BattleConsole.log("What will Tally do?", "showBattleOptions");
				}, _logDelay + 200);
			}
		} catch (err) {
			console.error(err);
		}
	}



	/**
	 *	Reward Tally with a new attack
	 */
	function rewardAttack(name = "", type = "") {
		try {
			// get random attack
			let attack = AttackData.returnAttack(name, type);

			// make sure tally doesn't already have that attack
			while (prop(tally_user.attacks[attack.name]))
				// if so get a new one, passing name and type if set
				attack = AttackData.returnAttack(name, type);

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
		handleAttackOutcomes: function(attack, selfStr, oppStr) {
			handleAttackOutcomes(attack, selfStr, oppStr);
		},
		getOutcomeDetails: function() {
			return getOutcomeDetails();
		},
		rewardAttack: function(name, type) {
			return rewardAttack(name, type);
		},
	};
})();
