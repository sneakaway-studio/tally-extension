"use strict";

/*  BATTLE
 ******************************************************************************/

window.BattleAttack = (function() {
	// PRIVATE

	let DEBUG = Debug.ALL.BattleAttack,
		_logDelay = 1000,
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
			if (DEBUG) console.log("💥 BattleAttack.doAttack()", attack, extraDelay);

			if (!prop(attack)) {
				console.error("🔢 BattleAttack.doAttack() attack is required!");
				return;
			}

			// is an attack already in progress?
			if (Battle.details.attackInProgress) {
				if (DEBUG) console.warn("💥 BattleAttack.doAttack() AN ATTACK IS ALREADY IN PROGRESS", Battle.details);
				return;
			}
			// set attack in progress
			else Battle.details.attackInProgress = true;
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

			// save attack details
			Battle.details.recentAttack = attack;
			Battle.details.selfName = outcomeDetails.selfName;
			Battle.details.selfStr = selfStr;
			Battle.details.oppName = outcomeDetails.oppName;
			Battle.details.oppStr = oppStr;

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
			BattleConsole.log(outcomeDetails.selfName + " used the <span class='text-" + attack.type + "'>" + attack.name + " " + attack.type + "</span>!");

			// 5. start attack effects
			BattleEffect.startAttackEffects(attack, selfStr, oppStr, "small");

		} catch (err) {
			console.log(err);
		}
	}

	/**
	 *	Handle attack outcomes
	 */
	function handleAttackOutcomes(attack, selfStr, oppStr) {
		try {
			if (DEBUG) console.log("💥 BattleAttack.handleAttackOutcomes()", attack, outcomeDetails.outcomes, selfStr, oppStr);

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
			// SPECIAL ATTACK: opp-loses-1-turn
			else if (outcomeDetails.outcomes === "opp-loses-1-turn") {
				if (DEBUG) console.log("💥 BattleAttack.handleAttackOutcomes()", outcomeDetails.outcomes, selfStr, oppStr);
				// take away turns
				takeAwayTurns(oppStr, 1);
				// tell user
				BattleConsole.log(outcomeDetails.oppName + " lost a turn!");
				// let nextAttackPrompt() skip to opponents next turn...
				nextAttackPrompt(selfStr, "");
				return;
			}
			// SPECIAL ATTACK: opp-loses-2-turns
			else if (outcomeDetails.outcomes === "opp-loses-2-turns") {
				if (DEBUG) console.log("💥 BattleAttack.handleAttackOutcomes()", outcomeDetails.outcomes, selfStr, oppStr);
				// take away turns
				takeAwayTurns(oppStr, 2);
				// tell user
				BattleConsole.log(outcomeDetails.oppName + " lost two turns!");
				// let nextAttackPrompt() skip to opponents next turn...
				nextAttackPrompt(selfStr, "");
				return;
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

					if (DEBUG) console.log("💥 BattleAttack.handleAttackOutcomes() -> outcomeDetails.outcomes[i]=", outcomeDetails.outcomes[i]);

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
					if (DEBUG) console.log("💥 BattleAttack.handleAttackOutcomes() attackOutcomeLog=", attackOutcomeLog);
					// show log
					BattleConsole.log(attackOutcomeLog);
					// update stats display for player who is affected
					StatsDisplay.updateDisplay(affectsStr);

					// show dialogue from Tally commenting on the outcome of last attack
					let r = Math.random();
					if (r > 0.7) {
						// show log and change in stats after a moment
						setTimeout(function() {
							if (positiveOutcomeTally == true)
								Dialogue.show(Dialogue.get(["battle", "gained-stats", null]), true);
							else if (positiveOutcomeTally == false)
								Dialogue.show(Dialogue.get(["battle", "lost-stats", null]), true);
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
			if (DEBUG) console.log("💥 BattleAttack.checkForEnd()");

			// is an attack not in progress ATM?
			if (!Battle.details.attackInProgress) return;

			let endBattle = false,
				endBattleMessage = "";


			// 2. check for winner

			// did tally lose?
			if (Stats.get("tally").health.val <= 0) {
				endBattle = true;
				endBattleMessage = "We need to take a break from the internet and recharge!";
				monsterWins("Tally's health has been depleted. Tally loses.", "tally-health-gone");
			} else if (Stats.get("tally").stamina.val <= 0) {
				endBattle = true;
				endBattleMessage = "We lost this time but we'll fight these trackers another day!";
				monsterWins("Tally's stamina has been depleted. Tally loses.", "tally-stamina-gone");
			}
			// did tally win?
			else if (Stats.get("monster").health.val <= 0) {
				endBattle = true;
				endBattleMessage = "";
				tallyWins("The monster's health has been depleted. Tally wins!!!", "monster-health-gone");
			} else if (Stats.get("monster").stamina.val <= 0) {
				endBattle = true;
				endBattleMessage = "";
				tallyWins("The monster's stamina has been depleted. Tally wins!!!", "monster-stamina-gone");
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

				if (Battle.details.progress > 0.9) {
					progressMessage = Dialogue.get(["battle", "progress9", null]);
				} else if (Battle.details.progress > 0.8) {
					progressMessage = Dialogue.get(["battle", "progress8", null]);
				} else if (Battle.details.progress > 0.7) {
					progressMessage = Dialogue.get(["battle", "progress7", null]);
				} else if (Battle.details.progress > 0.6) {
					progressMessage = Dialogue.get(["battle", "progress6", null]);
				} else if (Battle.details.progress > 0.5) {
					progressMessage = Dialogue.get(["battle", "progress5", null]);
				} else if (Battle.details.progress > 0.4) {
					progressMessage = Dialogue.get(["battle", "progress4", null]);
				} else if (Battle.details.progress > 0.3) {
					progressMessage = Dialogue.get(["battle", "progress3", null]);
				} else if (Battle.details.progress > 0.2) {
					progressMessage = Dialogue.get(["battle", "progress2", null]);
				} else if (Battle.details.progress > 0.1) {
					progressMessage = Dialogue.get(["battle", "progress1", null]);
				} else {
					progressMessage = Dialogue.get(["battle", "progress0", null]);
				}
				// n% of the time show a thought
				if (Battle.active() && Math.random() > 0.5)
					Dialogue.show(progressMessage, null, true);
			}

			// 3. check if battle over
			if (endBattle) {
				// stop music
				Sound.stopMusic();
				setTimeout(function() {
					// show final dialogue
					Dialogue.showStr(endBattleMessage, "neutral", true);
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

	function tallyWins(message,dialogue) {
		// explode page
		Effect.explode();
		// save winner
		Battle.details.winner = "tally";
		// log winning message
		BattleConsole.log(message);
		// show tally excited
		Dialogue.show(Dialogue.get(["battle", dialogue, null]), "happy", true);
		// calculate and show award for beating the monster
		let increase = FS_Number.round(Battle.details.monsterLevel * 10);
		TallyStorage.addToBackgroundUpdate("scoreData", "score", increase);
		BattleConsole.log("You earned "+ increase +" XP for beating this monster!!!");
		// tell player they blocked tracker
		BattleConsole.log("You now have blocked the "+ Battle.details.monsterTracker +" tracker from grabbing your data!!!");
		// potentially award a new attack
		if (Progress.get("award4thAttack")) randomRewardAttack();
		// play win sound
		Sound.playFile("music/tally-battle-7-25/victory.mp3", false, 0);
	}

	function monsterWins(message,dialogue) {
		// save winner
		Battle.details.winner = "monster";
		// log losing message
		BattleConsole.log(message);
		// show tally sad
		Dialogue.show(Dialogue.get(["battle", dialogue, null]), "sad", true);
		// play lose sound
		Sound.playFile("music/tally-battle-7-25/defeat.mp3", false, 0);
	}




	function resetTurns(who) {
		if (DEBUG) console.log("💥 BattleAttack.resetTurns()", who, JSON.stringify(Battle.details));
		// take away a turn
		Battle.details[who + "LostTurns"] = 0;
	}

	function takeAwayTurns(who, turns) {
		// take away a turn
		if (who === "tally") Battle.details.tallyLostTurns -= turns;
		else if (who === "monster") Battle.details.monsterLostTurns -= turns;
		if (DEBUG) console.log("💥 BattleAttack.takeAwayTurns()", who, turns,
			"Battle.details.tallyLostTurns=" + Battle.details.tallyLostTurns,
			"Battle.details.monsterLostTurns=" + Battle.details.monsterLostTurns
		);
	}


	function updatePlayerDetails(selfStr) {
		if (selfStr !== "tally" && selfStr !== "monster") return console.warn("selfStr should be either tally or monster!");
		// set all the details
		Battle.details.selfStr = selfStr;
		if (selfStr === "tally") {
			Battle.details.oppName = Battle.details.monsterName;
			Battle.details.oppStr = "monster";
			Battle.details.selfName = "Tally";
		} else if (selfStr === "monster") {
			Battle.details.oppName = "Tally";
			Battle.details.oppStr = "tally";
			Battle.details.selfName = Battle.details.monsterName;
		}
	}


	/**
	 * 	Determine and prompt who gets next attack
	 * 	selfStr == the player that just had a turn
	 */
	function nextAttackPrompt(selfStr, message = "") {
		try {
			updatePlayerDetails(selfStr);

			// if the player about to receive the turn doesn't get a turn
			if (Battle.details[Battle.details.oppStr + "LostTurns"] < 0) {
				if (DEBUG) console.log("💥 " + Battle.details.oppStr + " DOESN'T GET A TURN!!!", selfStr, message,
					"Battle.details.tallyLostTurns=" + Battle.details.tallyLostTurns,
					"Battle.details.monsterLostTurns=" + Battle.details.monsterLostTurns
				);
				// increment their lost turns
				Battle.details[Battle.details.oppStr + "LostTurns"]++;
				// advance to next turn

				nextAttackPrompt(Battle.details.oppStr, Battle.details.selfName + " will take another turn!");

			} else {
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
						// give control back to player
						BattleConsole.log("What will Tally do?", "showBattleOptions");
					}, _logDelay + 200);
				}
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

			if (DEBUG) console.log("💥 BattleAttack.rewardAttack() name=" + name + ", type=" + type);

			// if they haven't reached their attackLimit
			if (tally_user.progress.attacksSelected.val < tally_user.progress.attackLimit.val)
				// then mark it as selected
				attack.selected = 1;

			// save in background and on server
			TallyStorage.saveTallyUser("attacks", attack, "💥 BattleAttack.rewardAttack()");
			TallyStorage.addToBackgroundUpdate("itemData", "attacks", attack, "💥 BattleAttack.rewardAttack()");

			// tell user
			Dialogue.showStr("You earned the " + attack.name + " " + attack.type + "!", "happy");
		} catch (err) {
			console.error(err);
		}
	}
	/**
	 *	(Possibly) reward Tally with a new attack
	 */
	function randomRewardAttack() {
		try {
			if (Math.random() > 0.2) {
				if (DEBUG) console.log("💥 BattleAttack.randomRewardAttack()");
				rewardAttack();
			}
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
