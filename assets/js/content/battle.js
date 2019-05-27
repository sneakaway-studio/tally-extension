"use strict";

/*  BATTLE
 ******************************************************************************/

window.Battle = (function() {
	// PRIVATE

	var _active = false,
		_logDelay = 1000,
		details = {
			"mid": null,
			"monsterName": "",
			"tallyAttacks": getRandomAttacks(3),
			"monsterAttacks": getRandomAttacks(4),
			"mostRecentAttack": "",
			"mostRecentDamage": ""
		};
	// control state
	function active(state) {
		if (state != undefined && (state === true || state === false))
			_active = state;
		if (false) end();
		return _active;
	}

	/**
	 *	Testing, generates its own mid and calls start()
	 */
	function test() {
		if (_active) return;
		if (tally_nearby_monsters.length < 1) return;
		// use random ...
		let mid = randomObjKey(tally_nearby_monsters);
		// or pick from some favorites...
		var r = Math.random();
		if (r < 0.1) mid = 6;
		else if (r < 0.2) mid = 63;
		else if (r < 0.25) mid = 86;
		else if (r < 0.3) mid = 89;
		else if (r < 0.35) mid = 110;
		else if (r < 0.4) mid = 224;
		else if (r < 0.5) mid = 283;
		else if (r < 0.6) mid = 594;
		else if (r < 0.7) mid = 632;
		else if (r < 0.8) mid = 637;
		else if (r < 0.85) mid = 653;
		else if (r < 1) mid = 681;
		// move monster into position
		Monster.display(mid);
		start(63);
	}

	/**
	 *	Starts battle, moves into position *requires mid*
	 */
	function start(mid) {
		//console.log("Battle.start()", mid);
		if (_active) return;
		active(true);
		// intro sound
		Sound.playCategory('powerups', 'powerup1');
		// setup page for effects
		BattleEffect.setup();
		// move tally into position
		anime({
			targets: '#tally_character',
			left: "22%",
			top: "21%",
			elasticity: 0,
			duration: 1000,
			easing: 'easeOutCubic'
		});
		Thought.showThought(Thought.getThought(["battle", "start", 0]), true);

		// set monster details
		details.mid = mid;
		details.monsterName = MonsterData.dataById[mid].name + " monster";
		details.mostRecentAttack = "";
		details.mostRecentDamage = "";
		details.attacks = BattleAttack.returnRandomAttacks(3);
		// move monster into position and rescale
		anime({
			targets: '.tally_monster_sprite_container',
			left: "58%",
			top: "25%",
			opacity: 1,
			scale: 1,
			elasticity: 0,
			duration: 1000,
			easing: 'easeOutCubic'
		});
		// remove click, hover on monster
		$(document).off("click", ".tally_monster_sprite_container");
		$(document).off("mouseover", ".tally_monster_sprite_container");
		// show console
		BattleConsole.display();
		// log intro message
		setTimeout(function() {
			BattleConsole.log("Battle started with " + details.monsterName + "!");
			// wait for tally to attack first ...
			BattleConsole.log("What will Tally do?", "showBattleOptions");
		}, 100);
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

	function getRandomAttacks(num) {
		var attack, attacks = {};
		for (var i = 0; i < num; i++) {
			attack = FS_Object.randomObjProperty(AttackData.data);
			attacks[attack.name] = attack;
		}
		return attacks;
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
		if (who == "tally")
			return tally_user.stats; //Stats.tally();
		else
			return Stats.monster();
	}


	function showAttackEffects(attack, self, opp) {
		// fire projectile at tally
		if (details.mostRecentAttack.type == "attack") {
			BattleEffect.fireProjectile("tally", "small");
		} else if (details.mostRecentAttack.type == "defense") {
			// show explosion on monster
			BattleEffect.showExplosion(Core.getCenterPosition(".tally_monster_sprite"), false);
		}
	}





	function monsterAttackTally(extraDelay = 0) {
		let self = "monster",
			opp = "tally";

		// choose random attack
		details.mostRecentAttack = FS_Object.randomObjProperty(details.monsterAttacks);
		details.mostRecentDamage = randomArrayIndex(randomDamageOutcomes);
		//console.log("details",details);

		// start timed events
		setTimeout(function() {
			// show effects
			showAttackEffects(details.mostRecentAttack, self, opp);
			// do battle math
			let attackOutcomes = updateStats("monster", "tally");
			console.log("attackOutcomes", attackOutcomes);
			// log the attack
			BattleConsole.log(details.monsterName + " used the " + details.mostRecentAttack.name + " " + details.mostRecentAttack.type + "!");
			// wait
			setTimeout(function() {
				// then log the attack outcomes
				for (var i = 0; i < attackOutcomes.length; i++) {
					details.mostRecentDamage = attackOutcomes[i];
					BattleConsole.log("Tally lost " + details.mostRecentDamage + ".");
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

	function tallyAttackMonster(extraDelay = 0) {
		let self = "tally",
			opp = "monster";

		details.mostRecentAttack = FS_Object.randomObjProperty(details.tallyAttacks);
		details.mostRecentDamage = randomArrayIndex(randomDamageOutcomes);

		// show buttons
		setTimeout(function() {
			// fire projectile at monster
			if (details.mostRecentAttack.type == "attack") {
				BattleEffect.fireProjectile("monster", "small");
			} else if (details.mostRecentAttack.type == "defense") {
				// show explosion on Tally
				BattleEffect.showExplosion(Core.getCenterPosition("#tally_character"), false);
			}
			// do all battle math
			updateStats("monster", "tally");

			BattleConsole.log("Tally used the " + details.mostRecentAttack.name + " " + details.mostRecentAttack.type + "!");
			setTimeout(function() {
				BattleConsole.log(details.monsterName + " lost " + randomArrayIndex(randomDamageOutcomes));
				monsterAttackTally(2000);
			}, _logDelay);
		}, _logDelay + extraDelay);
	}







	// end battle
	function end() {
		if (!_active) return;
		_active = false;
		// hide console
		BattleConsole.hide();
		// put tally back
		anime({
			targets: '#tally_character',
			left: "0px",
			top: "90%",
			elasticity: 0,
			duration: 1000,
		});
		Thought.hide();
		// hide monster
		anime({
			targets: '.tally_monster_sprite_container',
			top: "-500px",
			opacity: 0,
			elasticity: 0,
			duration: 1000,
		});
	}





	// PUBLIC
	return {
		start: function(mid) {
			start(mid);
		},
		end: end,
		test: test,
		active: function(state) {
			return active(state);
		},
		monsterAttackTally: function(extraDelay) {
			monsterAttackTally(extraDelay);
		},
		tallyAttackMonster: function(extraDelay) {
			tallyAttackMonster(extraDelay);
		},
		details: details
	};
})();
