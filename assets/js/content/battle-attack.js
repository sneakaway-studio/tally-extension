"use strict";

/*  BATTLE
 ******************************************************************************/

window.BattleAttack = (function() {
	// PRIVATE

	let _logDelay = 1000;

	function returnRandomAttacks(count) {
		try {
			console.log("💥 BattleAttack.returnRandomAttacks() --> count="+ count, AttackData.data);
			let attack, attacks;
			if (!count || count <= 1) {
				attacks = FS_Object.randomObjProperty(AttackData.data);
			} else {
				let attacks = {};
				for (let i = 0; i < count; i++) {
					attack = FS_Object.randomObjProperty(AttackData.data);
					attacks[attack.name] = FS_Object.randomObjProperty(AttackData.data);
				}
			}
			console.log("💥 BattleAttack.returnRandomAttacks() --> count="+ count, attacks);
			return attacks;
		} catch (err) {
			console.error(err);
		}
	}




	var randomDamageOutcomes = [
		"24 health",
		"17 health",
		"5 health",
	];
	var randomDefenseOutcomes = [
		"24 health",
		"17 health",
		"5 health",
		"6 accuracy",
		"18 accuracy",
	];




	function monsterAttackTally(extraDelay = 0) {
		try {
			let self = "monster",
				opp = "tally";

			// save attack
			Battle.details.mostRecentAttack = FS_Object.randomObjProperty(Monster.current().attacks);
			// TEMP: Get random damage
			Battle.details.mostRecentDamage = FS_Object.randomArrayIndex(randomDamageOutcomes);
			//console.log("💥 Battle.monsterAttackTally() -> Battle.details=",Battle.details);

			// start timed events
			setTimeout(function() {
				// show effects
				showAttackEffects(Battle.details.mostRecentAttack, self, opp);
				// do battle math
				let attackOutcomes = BattleMath.attackOutcomes("monster", "tally");
				console.log("💥 Battle.monsterAttackTally() -> Battle.details=", Battle.details);
				console.log("💥 Battle.monsterAttackTally() -> attackOutcomes=", attackOutcomes);
				// log the attack
				BattleConsole.log(Battle.details.monsterName + " used the " + Battle.details.mostRecentAttack.name + " " + Battle.details.mostRecentAttack.type + "!");
				// wait
				setTimeout(function() {
					// then log the attack outcomes
					for (var i = 0; i < attackOutcomes.length; i++) {
						Battle.details.mostRecentDamage = attackOutcomes[i];
						//if (Battle.details.mostRecentDamage){
							BattleConsole.log("Tally lost " + Battle.details.mostRecentDamage + ".");
							Thought.showThought(Thought.getThought(["battle", "start", 0]), true);
						//}

						// lost-stats

					}
					// wait
					setTimeout(function() {
						// turn control back to player
						BattleConsole.log("What will Tally do?", "showBattleOptions");
					}, _logDelay);
				}, _logDelay);
			}, _logDelay + extraDelay);
		} catch (err) {
			console.error(err);
		}
	}

	function tallyAttackMonster(attack,extraDelay = 0) {
		try {
			let self = "tally",
				opp = "monster";

			// Battle.details.mostRecentAttack = FS_Object.randomObjProperty(Battle.details.tallyAttacks);
			Battle.details.mostRecentAttack = attack;
			Battle.details.mostRecentDamage = FS_Object.randomArrayIndex(randomDamageOutcomes);

			// show buttons
			setTimeout(function() {
				// fire projectile at monster
				if (Battle.details.mostRecentAttack.type == "attack") {
					BattleEffect.fireProjectile("monster", "small");
				} else if (Battle.details.mostRecentAttack.type == "defense") {
					// show explosion on Tally
					BattleEffect.showExplosion(Core.getCenterPosition("#tally_character"), false);
				}
				// do all battle math
				BattleMath.attackOutcomes("monster", "tally");

				BattleConsole.log("Tally used the " + Battle.details.mostRecentAttack.name + " " + Battle.details.mostRecentAttack.type + "!");
				setTimeout(function() {
					BattleConsole.log(Battle.details.monsterName + " lost " + FS_Object.randomArrayIndex(randomDamageOutcomes));
					monsterAttackTally(2000);
				}, _logDelay);
			}, _logDelay + extraDelay);
		} catch (err) {
			console.error(err);
		}
	}


	function showAttackEffects(attack, self, opp) {
		try {
			// fire projectile at tally
			if (Battle.details.mostRecentAttack.type == "attack") {
				BattleEffect.fireProjectile("tally", "small");
			} else if (Battle.details.mostRecentAttack.type == "defense") {
				// show explosion on monster
				BattleEffect.showExplosion(Core.getCenterPosition(".tally_monster_sprite"), false);
			}
		} catch (err) {
			console.error(err);
		}
	}




	/**
	 *	Reward Tally with a new attack
	 */
	function rewardWithAttack(attack){
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
		returnRandomAttacks: function(count) {
			return returnRandomAttacks(count);
		},
		monsterAttackTally: function(extraDelay) {
			monsterAttackTally(extraDelay);
		},
		tallyAttackMonster: function(attack,extraDelay) {
			tallyAttackMonster(attack,extraDelay);
		}
	};
})();
