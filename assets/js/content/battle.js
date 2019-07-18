"use strict";

/*  BATTLE
 ******************************************************************************/

window.Battle = (function() {
	// PRIVATE

	let DEBUG = Debug.ALL.Battle,
		_active = false,
		tallyBattleFloatingAnim = null,
		monsterBattleFloatingAnim = null,
		details = createNewBattleDetails();

	function createNewBattleDetails() {
		return {
			"mid": null,
			"level": 1,
			"monsterName": "",
			"monsterAttacks": {},
			"progress": 1, // cues for battle progress, normalized 1=start, 0=end
			"recentAttack": {},
			"attackInProgress": false,
			"winner": null
		};
	}

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
			if (!Progress.get("battle1stMonster")) {
				// update progress
				Progress.update("battle1stMonster", true);
				// inform them about RPG battling
				Dialogue.showStr("This game is like a classic RPG.", "neutral", true);
				Dialogue.showStr("You and the monster must battle by taking turns lauching attacks or defenses.", "neutral", true);
				Dialogue.showStr("You go first!", "happy", true);
			}
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
			// add floating animation
			tallyBattleFloatingAnim = anime({
				targets: "#tally_character_inner",
				translateY: 5,
				direction: 'alternate',
				loop: true,
				easing: 'easeInOutSine'
			});
			monsterBattleFloatingAnim = anime({
				targets: ".tally_monster_sprite",
				translateY: -5,
				direction: 'alternate',
				loop: true,
				easing: 'easeInOutSine'
			});
			// hide current dialogue
			Dialogue.hide();
			// change monster element back to fixed
			Core.setElementFixed('.tally_monster_sprite_container');
			// set monster details
			details.mid = mid;
			details.level = Monster.current().level; //Stats.getLevel("monster");
			details.monsterName = MonsterData.dataById[mid].name + " monster";
			details.monsterAttacks = AttackData.returnRandomAttacks(3);
			console.log("💥 Battle.start()", "details=", details, mid, tally_nearby_monsters[mid]);
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
			// insert SVG, stats table
			$('.monster_stats_bars').html(StatsDisplay.returnInitialSVG("monster"));
			$('.monster_stats_table').html(StatsDisplay.returnFullTable("monster"));
			// display stats
			$('.monster_stats').css({
				"display": "block"
			});

			// play music (intro, then loop)
			Sound.playBattleMusic();

			// remove click, hover on monster
			$(document).off("click", ".tally_monster_sprite_container");
			$(document).off("mouseover", ".tally_monster_sprite_container");
			// show console
			BattleConsole.display();
			// log intro message
			setTimeout(function() {
				Dialogue.show(DialogueData.get(["battle", "start", null]), true);
				// display stats
				StatsDisplay.updateDisplay("monster");
				// log intro...
				BattleConsole.log("Battle started with " + details.monsterName + "!");
				// wait for tally to attack first ...
				BattleConsole.log("What will Tally do?", "showBattleOptions");
			}, 100);
		} catch (err) {
			console.error(err);
		}
	}


	function final() {

		// show battle completion message

		// block tracker if they won

		// save blocked list


		end();
	}

	// end battle
	function end() {
		try {
			if (!_active) return;
			console.log("💥 Battle.end()");
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
			// remove floating animations
			anime.remove("#tally_character_inner");
			anime.remove('.tally_monster_sprite_container');
			// change skin back to magenta and hide dialogue if open
			Skin.setStage(0);
			Dialogue.hide();
			// hide monster
			anime({
				targets: '.tally_monster_sprite_container',
				top: "-500px",
				opacity: 0,
				elasticity: 0,
				duration: 1000,
			});
			$('.monster_stats').css({
				"display": "none"
			});
			// stop music
			Sound.stopMusic();
			// create monster update object
			let monsterUpdate = {
				"mid": details.mid,
				"level": details.level,
				"captured": 0,
				"missed": 0,
			};
			// set winner
			if (Battle.details.winner === "tally") {
				monsterUpdate.captured = 1;
			} else if (Battle.details.winner === "monster") {
				monsterUpdate.missed = 1;
			}
			// update server
			TallyStorage.addToBackgroundUpdate("itemData", "monsters", monsterUpdate);
			TallyStorage.checkSendBackgroundUpdate();
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
