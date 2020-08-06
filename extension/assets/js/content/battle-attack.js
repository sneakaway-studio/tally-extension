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
	 *	Receive attack and self and opp stats and handle attack outcomes
	 */
	function handleAttackOutcomes(attack, selfStr, oppStr) {
		try {
			if (DEBUG) console.log("💥 BattleAttack.handleAttackOutcomes()", attack, outcomeDetails.outcomes, selfStr, oppStr);

			// is an attack not in progress ATM?
			if (!Battle.details.attackInProgress) return;

			let positiveOutcomeTally = null,
				specialSkipTurn = false;


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


				// 2. check for and handle any special attacks

				for (let i = 0; i < outcomeDetails.outcomes.length; i++) {
					// if outcome defined
					if (FS_Object.prop(outcomeDetails.outcomes[i]) && FS_Object.prop(outcomeDetails.outcomes[i].special)) {
						if (DEBUG) console.log("💥 BattleAttack.handleAttackOutcomes()", outcomeDetails.outcomes, selfStr, oppStr);

						// SPECIAL ATTACK: opp-loses-1-turn
						if (outcomeDetails.outcomes[i].special === "opp-loses-1-turn") {
							// take away turns
							takeAwayTurns(oppStr, 1);
							// remove from array
							outcomeDetails.outcomes.splice(i, 1);
							// tell user
							BattleConsole.log(outcomeDetails.oppName + " lost <span class='text-blue'>a turn</span>!");
							// set flag to skip turn at end
							specialSkipTurn = true;
						}
						// SPECIAL ATTACK: opp-loses-2-turns
						else if (outcomeDetails.outcomes[i].special === "opp-loses-2-turns") {
							// take away turns
							takeAwayTurns(oppStr, 2);
							// remove from array
							outcomeDetails.outcomes.splice(i, 1);
							// tell user
							BattleConsole.log(outcomeDetails.oppName + " lost <span class='text-blue'>two turns</span>!");
							// set flag to skip turn at end
							specialSkipTurn = true;
						}
						// TO ADD: SPECIAL ATTACK: qte (quick time event)
					}
				}

				// 3. get the name of the player to create attack outcome log

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

				// track how many outcomes affected the player
				let statAffectingOutcomes = 0;

				// 4. loop through attack outcomes and add to attackOutcomeLog
				for (let i = 0; i < outcomeDetails.outcomes.length; i++) {
					/*jshint loopfunc: true */

					if (DEBUG) console.log("💥 BattleAttack.handleAttackOutcomes() -> outcomeDetails.outcomes[i]=", outcomeDetails.outcomes[i]);

					// if number is 0 skip
					if (outcomeDetails.outcomes[i].change == 0) continue;

					let flipStat = 1;

					// skip special attacks in this loop
					if (FS_Object.prop(outcomeDetails.outcomes[i].special)) {
						continue;
					}

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
					if (++statAffectingOutcomes === 2 && i === 1) attackOutcomeLog += " and ";
					// if 3+ outcomes and on last outcome
					else if (statAffectingOutcomes >= 3 && i === statAffectingOutcomes - 1) attackOutcomeLog += " and ";
					// if 3+ outcomes and before last outcome but after first
					else if (statAffectingOutcomes >= 3 && i > 0 && i < statAffectingOutcomes - 1) attackOutcomeLog += ", ";

					// add to log, changing value for display
					attackOutcomeLog += "<span class='text-blue'>" + (outcomeDetails.outcomes[i].change *= flipStat);
					attackOutcomeLog += " " + outcomeDetails.outcomes[i].stat + "</span>";


					if (DEBUG) console.log("💥 BattleAttack.handleAttackOutcomes() i=", i, " attackOutcomeLog=", attackOutcomeLog);
				}


				// 5. determine visuals
				if (oppStr === "tally") {
					// what tally says
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

				// 6. show log and change in stats after a moment
				setTimeout(function() {
					// assemble attack outcome string
					attackOutcomeLog = affectsName + " " + gainedLostString + " " + attackOutcomeLog + "!";
					if (DEBUG) console.log("💥 BattleAttack.handleAttackOutcomes() attackOutcomeLog=", attackOutcomeLog);
					// show log with stat changes
					BattleConsole.log(attackOutcomeLog);
					// update stats display for player who is affected
					StatsDisplay.updateDisplay(affectsStr);
					// potentially let Tally comment
					tallyCommentOnAttack(positiveOutcomeTally);
					// else end check
					checkForEnd(selfStr, oppStr);
				}, _logDelay + 300);
			}
		} catch (err) {
			console.log(err);
		}
	}

	/**
	 * 	potentially show dialogue from Tally commenting on the outcome of last attack
	 */
	function tallyCommentOnAttack(positiveOutcomeTally) {
		try {
			let r = Math.random();
			if (r > 0.7) {
				// show log and change in stats after a moment
				setTimeout(function() {
					if (positiveOutcomeTally == true)
						Dialogue.showData(Dialogue.getData({
							category: "battle",
							subcategory: "gained-stats"
						}));
					else if (positiveOutcomeTally == false)
						Dialogue.showData(Dialogue.getData({
							category: "battle",
							subcategory: "lost-stats"
						}));
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

			let winner = "",
				endBattleMessage = {};


			// 2. check for winner

			// did tally lose?
			if (Stats.get("tally").health.val <= 0) {
				winner = "monster";
				endBattleMessage = Dialogue.getData({ category: "battle", subcategory: "tally-health-gone"});
				monsterWins("Tally's health has been depleted. Tally loses.", "tally-health-gone");
			} else if (Stats.get("tally").stamina.val <= 0) {
				winner = "monster";
				endBattleMessage = Dialogue.getData({ category: "battle", subcategory: "tally-stamina-gone"});
				monsterWins("Tally's stamina has been depleted. Tally loses.", "tally-stamina-gone");
			}
			// did tally win?
			else if (Stats.get("monster").health.val <= 0) {
				winner = "tally";
				endBattleMessage = Dialogue.getData({ category: "battle", subcategory: "monster-health-gone"});
				tallyWins("The <span class='tally text-green'>monster's</span> health has been depleted. Tally wins!!!", "monster-health-gone");
			} else if (Stats.get("monster").stamina.val <= 0) {
				winner = "tally";
				endBattleMessage = Dialogue.getData({ category: "battle", subcategory: "monster-stamina-gone"});
				tallyWins("The <span class='tally text-green'>monster's</span> stamina has been depleted. Tally wins!!!", "monster-stamina-gone");
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
					progressMessage = Dialogue.getData({
						category: "battle",
						subcategory: "progress9"
					});
				} else if (Battle.details.progress > 0.8) {
					progressMessage = Dialogue.getData({
						category: "battle",
						subcategory: "progress8"
					});
				} else if (Battle.details.progress > 0.7) {
					progressMessage = Dialogue.getData({
						category: "battle",
						subcategory: "progress7"
					});
				} else if (Battle.details.progress > 0.6) {
					progressMessage = Dialogue.getData({
						category: "battle",
						subcategory: "progress6"
					});
				} else if (Battle.details.progress > 0.5) {
					progressMessage = Dialogue.getData({
						category: "battle",
						subcategory: "progress5"
					});
				} else if (Battle.details.progress > 0.4) {
					progressMessage = Dialogue.getData({
						category: "battle",
						subcategory: "progress4"
					});
				} else if (Battle.details.progress > 0.3) {
					progressMessage = Dialogue.getData({
						category: "battle",
						subcategory: "progress3"
					});
				} else if (Battle.details.progress > 0.2) {
					progressMessage = Dialogue.getData({
						category: "battle",
						subcategory: "progress2"
					});
				} else if (Battle.details.progress > 0.1) {
					progressMessage = Dialogue.getData({
						category: "battle",
						subcategory: "progress1"
					});
				} else {
					progressMessage = Dialogue.getData({
						category: "battle",
						subcategory: "progress0"
					});
				}
				// n% of the time show dialogue
				if (Battle.active && Math.random() > 0.5)
					Dialogue.showData(progressMessage, {
						instant: true
					});
			}

			// 3. check if battle over
			if (winner === "monster" || winner === "tally") {
				// stop music
				Sound.stopMusic();
				setTimeout(function() {
					// show final dialogue
					console.log("endBattleMessage", endBattleMessage);
					Dialogue.showStr(endBattleMessage.text, endBattleMessage.mood);
					setTimeout(function() {
						// if in demo then quit after a moment
						if (T.tally_options.gameMode === "demo") {
							setTimeout(function() {
								Battle.end(true);
							}, 500);
						} else {
							if (Progress.get("notifyToClickAfterBattle") < 1) {
								Dialogue.showStr("Congratulations on completing your first battle!", "happy");
								if (winner === "tally") Dialogue.showStr("You blocked a tracker!", "happy");
								Dialogue.showStr("Click anywhere to continue!", "happy");
								Progress.update("notifyToClickAfterBattle", 1);
							} else if (Progress.get("notifyToClickAfterBattle") < 2) {
								Dialogue.showStr("You finished your second battle!", "happy");
								if (winner === "tally") Dialogue.showStr("You blocked another tracker!", "happy");
								Dialogue.showStr("Share a screenshot!", "happy");
								Dialogue.showStr("Click anywhere to reset the page!", "happy");
								Progress.update("notifyToClickAfterBattle", 2);
							}
							// clean up all battle data
							Battle.end();
							// add click event so user quits the visual part themselves
							$(document).on("click", function() {
								Battle.quit();
							});
						}
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



	function tallyWins(message, dialogue) {
		try {
			// save winner
			Battle.details.winner = "tally";
			// explode page
			Effect.explode();
			// log winning message
			BattleConsole.log(message);
			// show tally excited
			Dialogue.showData(Dialogue.getData({
				category: "battle",
				subcategory: dialogue
			}));
			// calculate and show award for beating the monster
			let increase = 100;
			// save in background (and on server)
			TallyData.queue("scoreData", "score", increase);
			// show in log and tell player they blocked tracker
			BattleConsole.log("You earned " + increase + " XP " + "and blocked the <span class='tally text-green'>" +
				Battle.details.monsterTracker + " tracker</span> from grabbing your data!");
			// potentially award a new attack
			if (Progress.get("attacksAwarded") >= 4) randomRewardAttack();
			// potentially award a new disguise
			Disguise.checkAndReward();
			// after a moment ...
			setTimeout(function() {
				// show captured monster
				BattleEffect.showCapturedMonster();
				// play win sound
				Sound.playFile("music/tally-battle-7-25/victory.mp3", false, 0);
			}, 400);
			// notify to reset page
			resetPageNotification();
		} catch (err) {
			console.error(err);
		}

	}

	function monsterWins(message, dialogue) {
		try {
			// save winner
			Battle.details.winner = "monster";
			// log losing message
			BattleConsole.log(message);
			// show tally sad
			Dialogue.showData(Dialogue.getData({
				category: "battle",
				subcategory: dialogue
			}), {});
			// play lose sound
			Sound.playFile("music/tally-battle-7-25/defeat.mp3", false, 0);
			// notify to reset page
			resetPageNotification();
		} catch (err) {
			console.error(err);
		}
	}

	function resetPageNotification() {
		setTimeout(function() {
			// reset page notification
			BattleConsole.log("Click anywhere to reset the page.");
		}, 8000);
	}

	function resetTurns(who) {
		try {
			if (DEBUG) console.log("💥 BattleAttack.resetTurns()", who, JSON.stringify(Battle.details));
			// take away a turn
			Battle.details[who + "LostTurns"] = 0;
		} catch (err) {
			console.error(err);
		}
	}

	function takeAwayTurns(who, turns) {
		try {
			// take away a turn
			if (who === "tally") Battle.details.tallyLostTurns -= turns;
			else if (who === "monster") Battle.details.monsterLostTurns -= turns;
			if (DEBUG) console.log("💥 BattleAttack.takeAwayTurns()", who, turns,
				"Battle.details.tallyLostTurns=" + Battle.details.tallyLostTurns,
				"Battle.details.monsterLostTurns=" + Battle.details.monsterLostTurns
			);
		} catch (err) {
			console.error(err);
		}
	}

	function updatePlayerDetails(selfStr) {
		try {
			if (selfStr !== "tally" && selfStr !== "monster")
				return console.warn("selfStr should be either tally or monster!");
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
		} catch (err) {
			console.error(err);
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
			let safety = 0;
			while (prop(T.tally_user.attacks[attack.name])) {
				// if so get a new one, passing name and type if set
				attack = AttackData.returnAttack(name, type);
				// exit if all attacks have been rewarded
				if (++safety > 10) break;
			}
			if (DEBUG) console.log("💥 BattleAttack.rewardAttack() name=" + attack.name + ", type=" + attack.type);


			// attack is selected by default
			attack.selected = 1;
			// unless # selected is already >= to limit
			let selected = returnAttacksSelected();
			if (selected >= 4) {
				attack.selected = 0;
			} else {
				Progress.update("attacksSelected", selected + 1);
			}

			// update progress
			Progress.update("attacksAwarded", FS_Object.objLength(T.tally_user.attacks));
			// save in background (and on server)
			TallyData.queue("itemData", "attacks", attack, "💥 BattleAttack.rewardAttack()");

			// tell user
			Dialogue.showStr("You earned the " + attack.name + " " + attack.type + "!", "happy");
			if (Progress.update("attacksChooserNotify", 1, "+") < 20 && Math.random() > 0.5)
				Dialogue.showData(Dialogue.getData({
					category: "attack",
					subcategory: "reward"
				}));
		} catch (err) {
			console.error(err);
		}
	}


	/**
	 *	Return Attacks Selected
	 */
	function returnAttacksSelected() {
		try {
			let selected = 0;
			// count currently selected
			for (let attackName in T.tally_user.attacks) {
				console.log(T.tally_user.attacks[attackName]);
				if (T.tally_user.attacks[attackName].selected == 1)
					selected++;
			}
			return selected;
		} catch (err) {
			console.error(err);
		}
	}





	/**
	 *	(Possibly) reward Tally with a new attack
	 */
	function randomRewardAttack() {
		try {
			// 20%
			if (Math.random() > 0.8) {
				if (DEBUG) console.log("💥 BattleAttack.randomRewardAttack()");
				rewardAttack();
			}
		} catch (err) {
			console.error(err);
		}
	}


	// PUBLIC
	return {
		doAttack: doAttack,
		handleAttackOutcomes: handleAttackOutcomes,

		set outcomeDetails (value) { outcomeDetails = value; },
		get outcomeDetails () { return outcomeDetails; },

		rewardAttack: function(name, type) {
			return rewardAttack(name, type);
		},
		tallyWins: tallyWins

	};
})();
