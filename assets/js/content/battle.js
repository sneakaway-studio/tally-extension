"use strict";

/*  BATTLE
 ******************************************************************************/

window.Battle = (function() {
	// PRIVATE

	var _active = false,
		details = {
			"mid": null,
			"monsterName": "",
			"mostRecentAttack": {},
			"mostRecentDamage": ""
		};
	// control state
	function active(state) {
		try {
			if (state != undefined && (state === true || state === false))
				_active = state;
			if (false) end();
			return _active;
		} catch (err) {
			console.error(err);
		}
	}

	/**
	 *	Testing, generates its own mid and calls start()
	 */
	function test() {
		try {
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
			Monster.display(tally_nearby_monsters[mid]);
			start(63);
		} catch (err) {
			console.error(err);
		}
	}

	/**
	 *	Starts battle, moves into position *requires mid*
	 */
	function start(mid) {
		try {
			//console.log("💥 Battle.start()", mid);
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
				top: "20%",
				elasticity: 0,
				duration: 1000,
				easing: 'easeOutCubic'
			});
			// hide current thought
			Thought.hide();
			// change monster element back to fixed
			Core.setElementFixed('.tally_monster_sprite_container');
			// set monster details
			details.mid = mid;
			details.monsterName = MonsterData.dataById[mid].name + " monster";
			details.mostRecentAttack = {};
			details.mostRecentDamage = 0;
			// pick random attacks for monster
			details.attacks = BattleAttack.returnRandomAttacks(3);
			// move monster into position and rescale
			anime({
				targets: '.tally_monster_sprite_container',
				left: "58%",
				top: "14%",
				opacity: 1,
				scale: 1,
				elasticity: 0,
				duration: 1000,
				easing: 'easeOutCubic'
			});
			// display monster's stats
			$('.monster_stats').html(StatsDisplay.returnInitialSVG("monster"));
			// remove click, hover on monster
			$(document).off("click", ".tally_monster_sprite_container");
			$(document).off("mouseover", ".tally_monster_sprite_container");
			// show console
			BattleConsole.display();
			// log intro message
			setTimeout(function() {
				Thought.showThought(Thought.getThought(["battle", "start", 0]), true);
				// load stats for monster
				StatsDisplay.updateAllMonsterStatsDisplay();
				// log intro...
				BattleConsole.log("Battle started with " + details.monsterName + "!");
				// wait for tally to attack first ...
				BattleConsole.log("What will Tally do?", "showBattleOptions");
			}, 100);
		} catch (err) {
			console.error(err);
		}
	}


	// end battle
	function end() {
		try {
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
		} catch (err) {
			console.error(err);
		}	
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
		details: details
	};
})();
