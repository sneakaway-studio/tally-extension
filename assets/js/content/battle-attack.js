"use strict";

/*  BATTLE
 ******************************************************************************/

window.BattleAttack = (function() {
	// PRIVATE

	let _logDelay = 1000;

	function returnRandomAttacks(count) {
		let attack = {},
			attacks = {};
		if (!count || count <= 1) {
			attack = FS_Object.randomObjProperty(AttackData.data);
			console.log("💥 BattleAttack.returnRandomAttacks() --> count="+ count, attack);
			return attack;
		} else {
			let attacks = {};
			for (let i = 0; i < count; i++) {
				attack = FS_Object.randomObjProperty(AttackData.data);
				attacks[attack.name] = attack;
			}
			console.log("💥 BattleAttack.returnRandomAttacks() --> count="+ count, attacks);
			return attacks;
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
		let self = "monster",
			opp = "tally";

		// choose random attack
		Battle.details.mostRecentAttack = FS_Object.randomObjProperty(Monster.current().attacks);
		Battle.details.mostRecentDamage = FS_Object.randomArrayIndex(randomDamageOutcomes);
		console.log("💥 Battle.monsterAttackTally() -> Battle.details",Battle.details);

		// start timed events
		setTimeout(function() {
			// show effects
			showAttackEffects(Battle.details.mostRecentAttack, self, opp);
			// do battle math
			let attackOutcomes = updateStats("monster", "tally");
			console.log("💥 Battle.monsterAttackTally() -> attackOutcomes", attackOutcomes);
			// log the attack
			BattleConsole.log(Battle.details.monsterName + " used the " + Battle.details.mostRecentAttack.name + " " + Battle.details.mostRecentAttack.type + "!");
			// wait
			setTimeout(function() {
				// then log the attack outcomes
				for (var i = 0; i < attackOutcomes.length; i++) {
					Battle.details.mostRecentDamage = attackOutcomes[i];
					BattleConsole.log("Tally lost " + Battle.details.mostRecentDamage + ".");
					Thought.showThought(Thought.getThought(["battle", "start", 0]), true);
				}
				// wait
				setTimeout(function() {
					// turn control back to player
					BattleConsole.log("What will Tally do?", "showBattleOptions");
				}, _logDelay);
			}, _logDelay);
		}, _logDelay + extraDelay);
	}

	function tallyAttackMonster(attack,extraDelay = 0) {
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
			updateStats("monster", "tally");

			BattleConsole.log("Tally used the " + Battle.details.mostRecentAttack.name + " " + Battle.details.mostRecentAttack.type + "!");
			setTimeout(function() {
				BattleConsole.log(Battle.details.monsterName + " lost " + FS_Object.randomArrayIndex(randomDamageOutcomes));
				monsterAttackTally(2000);
			}, _logDelay);
		}, _logDelay + extraDelay);
	}


	function showAttackEffects(attack, self, opp) {
		// fire projectile at tally
		if (Battle.details.mostRecentAttack.type == "attack") {
			BattleEffect.fireProjectile("tally", "small");
		} else if (Battle.details.mostRecentAttack.type == "defense") {
			// show explosion on monster
			BattleEffect.showExplosion(Core.getCenterPosition(".tally_monster_sprite"), false);
		}
	}




	/**
	 * 	Generic Function for updating all stats
	 */
	function updateStats(attack, self, opp) {

		// track the outcome(s) of the attack
		let attackOutcomes = [];

		// look for specific properties in attack to determine which function is called
		if (prop(attack.selfDef)) {
			// store string that is returned to be able to log it later
			attackOutcomes.push(
				BattleMath.updateDefense(attack, getStat(self), getStat(opp))
			);
		}
		if (prop(attack.oppEva)) {
			attackOutcomes.push(
				BattleMath.updateEvasion(attack, getStat(self), getStat(opp))
			);
		}
		// Daniel, add more conditions...


		return attackOutcomes;
	}
	/**
	 * 	Get stats of self or opponent
	 */
	function getStat(who) {
		console.log("💥 BattleAttack.getStat()",who);
		let stats = {};
		if (who == "tally")
			stats = tally_user.stats; //Stats.tally();
		else
			stats = Stats.monster();
		console.log("💥 BattleAttack.getStat()",who,stats);
		return stats;
	}



	/**
	 *	Reward Tally with a new attack
	 */
	function rewardWithAttack(attack){
		// make sure tally doesn't already have that attack

		// tell user

		// save tally_user
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
