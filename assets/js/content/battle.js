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
			"mostRecentAttack": "",
			"mostRecentDamage": ""
		};
		function getDetails() {
			return details;
		}
		// control state
		function active(state) {
			if (state != undefined && (state === true || state === false))
				_active = state;
			if (false) end();
			return _active;
		}



// initiate battle
// wait for user


	function test() {
		if (_active) return;
		if (tally_nearby_monsters.length < 1) return;
		let mid = randomObjKey(tally_nearby_monsters);
		//start(mid);
		var r = Math.random();
		if (r < .1)
			start(6);
		else if (r < .2)
			start(63);
		else if (r < .25)
			start(86);
		else if (r < .3)
			start(89);
		else if (r < .35)
			start(110);
		else if (r < .4)
			start(224);
		else if (r < .5)
			start(283);
		else if (r < .6)
			start(594);
		else if (r < .7)
			start(632);
		else if (r < .8)
			start(637);
		else if (r < .85)
			start(653);
		else if (r < 1)
			start(681);
	}



	// start battle
	function start(mid) {
		console.log("Battle.start()", mid);
		if (_active) return;
		active(true);
		// intro sound
		Sound.playCategory('powerups', 'powerup1');
		// setup page for effects
		BattleEffect.setup();

		// move tally into position
		anime({
			targets: '#tally_character',
			left: "25%",
			top: "25%",
			elasticity: 0,
			duration: 1000,
			easing: 'easeOutCubic'
		});
		Thought.showString("Let's keep this tracker from getting our data!", "danger");

		// set monster details
		details.mid = mid;
		details.monsterName = MonsterData.dataById[mid].name + " monster";
		details.mostRecentAttack = "";
		details.mostRecentDamage = "";
		details.attacks = BattleAttack.returnRandomAttacks(3);

		// move monster into position
		Monster.display(mid);
		anime({
			targets: '.tally_monster_sprite_container',
			left: "55%",
			top: "8%",
			opacity:1,
			elasticity: 0,
			duration: 1000,
			easing: 'easeOutCubic'
		});

		// show console
		BattleConsole.show();
		setTimeout(function() {
			BattleConsole.log("Battle started with " + details.monsterName + "!");
			// owen change to tally attack option first
			monsterAttackTally();
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


	function monsterAttackTally(extraDelay=0) {

		let attackType = "attack";
		let r = Math.random();
		// if (r > 0.5)
		// 	attackType = "defense";

		details.mostRecentAttack = randomObjKey(AttackData.data[attackType]); //"spambash attack";
		details.mostRecentDamage = randomArrayIndex(randomDamageOutcomes);

		setTimeout(function() {

			// fire projectile at tally
			if (attackType == "attack"){
				BattleEffect.fireProjectile("tally",true);
			} else if (attackType == "defense"){
				// show explosion on monster
				BattleEffect.showExplosion(BattleEffect.getCenterPosition(".tally_monster_sprite"),false);
			}

			BattleConsole.log(details.monsterName + " used the " + details.mostRecentAttack + " " + attackType + "!");
			setTimeout(function() {
				BattleConsole.log("Tally lost " + details.mostRecentDamage + ".");
				setTimeout(function() {
					BattleConsole.log("What will Tally do?","showBattleOptions");
				}, _logDelay);
			}, _logDelay);
		}, _logDelay + extraDelay);
	}

	function tallyAttackMonster(extraDelay=0) {

		let attackType = "attack";
		let r = Math.random();
		// if (r > 0.5)
		// 	attackType = "defense";

		details.mostRecentAttack = randomObjKey(AttackData.data[attackType]); //"spambash attack";
		details.mostRecentDamage = randomArrayIndex(randomDamageOutcomes);

		// show buttons
		setTimeout(function() {
			// fire projectile at monster
			if (attackType == "attack"){
				BattleEffect.fireProjectile("monster",true);
			} else if (attackType == "defense"){
				// show explosion on Tally
				BattleEffect.showExplosion(BattleEffect.getCenterPosition("#tally_character"),false);
			}

			BattleConsole.log("Tally used the " + details.mostRecentAttack + " " + attackType + "!");
			setTimeout(function() {
				BattleConsole.log(details.monsterName + " lost " + randomArrayIndex(randomDamageOutcomes)  );
				monsterAttackTally(2000);
			}, _logDelay);
		}, _logDelay + extraDelay);
	}







	// end battle
	function end() {
		BattleConsole.hide();
		_active = false;

		// move tally back
		anime({
			targets: '#tally_character',
			left: "0px",
			top: "90%",
			elasticity: 0,
			duration: 1000,
		});
		Thought.hide();
		anime({
			targets: '.tally_monster_sprite_container',
			top: "-500px",
			opacity:1,
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
