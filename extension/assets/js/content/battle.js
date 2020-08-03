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
			"attackInProgress": false,
			"mid": null,
			"monsterAttacks": {},
			"monsterLevel": 1,
			"monsterLostTurns": 0,
			"monsterName": "",
			"monsterTracker": "",
			"oppName": "",
			"oppStr": "",
			"progress": 1, // cues for progress for this battle only, normalized 1=start, 0=end
			"recentAttack": {},
			"selfName": "",
			"selfStr": "",
			"tallyLostTurns": 0,
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
			if (FS_Object.objLength(T.tally_nearby_monsters) < 1) return;
			// use random ...
			let mid = randomObjKey(T.tally_nearby_monsters);
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
			Monster.display(T.tally_nearby_monsters[mid]);
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
			// set current
			Monster.currentMID = mid;
			// update progress
			if (Progress.update("battlesFought", 1, "+") < 1) {
				// if this is first battle inform them about RPG battling
				Dialogue.showStr("This game is like a classic RPG.", "neutral");
				Dialogue.showStr("You and the monster must battle by taking turns lauching attacks or defenses.", "neutral");
				Dialogue.showStr("You go first!", "happy");
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
			// empty the dialogue queue
			Dialogue.emptyTheQueue();

			// change monster element back to fixed
			Core.setElementFixed('.tally_monster_sprite_container');
			// set monster details
			details.mid = mid;
			details.monsterLevel = Monster.current().level;
			details.monsterName = MonsterData.dataById[mid].name + " monster";
			details.monsterAttacks = AttackData.returnRandomAttacks(4);
			details.monsterTracker = T.tally_nearby_monsters[mid].tracker.domain;
			console.log("💥 Battle.start()", "details=", details, mid, T.tally_nearby_monsters[mid]);
			// rescale
			let matrix = $('.tally_monster_sprite_flip').css('transform')
				.replace('matrix(', "").replace(')', "").replace(' ', "").split(',');
			// console.log("T.tally_nearby_monsters[mid]",T.tally_nearby_monsters[mid]);
			// console.log("matrix",matrix);
			$('.tally_monster_sprite_flip').css({
				"transform": 'scale(' + matrix[0] * 2 + ',1)'
			});
			// move monster into position
			anime({
				targets: '.tally_monster_sprite_container',
				left: "58%",
				top: "14%",
				opacity: 1,
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
			// add stats display / hide action
			$('.monster_stats').on("click", function(e) {
				//console.log("hi",$('.monster_stats_table').css("display"));
				if ($('.monster_stats_table').css("display") == "none")
					$('.monster_stats_table').css({
						"display": "block"
					});
				else
					$('.monster_stats_table').css({
						"display": "none"
					});
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
				Dialogue.showData(Dialogue.getData({
					category: "battle", subcategory: "start"
				}));
				// display stats
				StatsDisplay.updateDisplay("monster");
				// log intro...
				BattleConsole.log("t:/game/battle/start...");
				BattleConsole.log("Running Tally "+ T.tally_meta.version + " BattleConsole 0.1");
				BattleConsole.log("#########################################");
				BattleConsole.log("Battle started with <span class='tally text-green'>" + MonsterData.dataById[mid].tier1 + " &gt; " + details.monsterName + "</span>!");
				// wait for tally to attack first ...
				BattleConsole.log("What will Tally do?", "showBattleOptions");
			}, 100);
		} catch (err) {
			console.error(err);
		}
	}

	Mousetrap.bind('escape', function() {
		Battle.end(true);
	});

	/**
	 *	Run all the battle finish scripts
	 */
	function end(quit=false) {
		try {
			if (!_active) return;
			let log = "💥 Battle.end()";
			console.log(log);

			// create monster update object
			let monsterUpdate = {
				"mid": details.mid,
				"level": details.monsterLevel,
				"tracker": details.monsterTracker,
				"captured": 0,
				"missed": 0,
			};

			// create tracker update object
			let trackerUpdate = {
				"name": details.monsterTracker,
				"mid": details.mid,
				"blocked": 0 // false be default
			};


			// set winner
			if (Battle.details.winner === "tally") {
				monsterUpdate.captured = 1;
				trackerUpdate.blocked = 1;
				Progress.update("battlesWon", 1, "+");
			} else if (Battle.details.winner === "monster") {
				monsterUpdate.missed = 1;
				trackerUpdate.blocked = 0;
				Progress.update("battlesLost", 1, "+");
			}
			// if no winner then player ended early
			else {
				monsterUpdate.missed = 1;
				trackerUpdate.blocked = 0;
				// tally must have run
				Progress.update("battleEscaped", 1, "+");
			}

			// add monster to update
			TallyData.queue("itemData", "monsters", monsterUpdate);
			// add tracker to update
			TallyData.queue("itemData", "trackers", trackerUpdate);
			// update server immediately
			TallyData.pushUpdate(log);

			if (quit) Battle.quit();
		} catch (err) {
			console.error(err);
		}
	}


	/**
	 *	Actually exit the battle in the interface
	 */
	function quit() {
		try {
			if (!_active) return;
			let log = "💥 Battle.quit()";
			console.log(log);
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

			// say something (also clears any leftover battle dialogue that exists)
			let r = Math.random();
			if (r < 0.5) {
				Dialogue.showData({
					"text": "There are likely other trackers nearby",
					"mood": "cautious"
				}, { instant: true });
			} else {
				Dialogue.showData({
					"text": "The battle is over!",
					"mood": "happy"
				}, { instant: true });
			}

			// hide monster
			anime({
				targets: '.tally_monster_sprite_container',
				top: "-500px",
				opacity: 0,
				elasticity: 0,
				duration: 1000,
			});
			// hide captured animation
			BattleEffect.hideCapturedMonster();
			$('.monster_stats').css({
				"display": "none"
			});
			// set monster back
			Monster.onPage(false);
			// stop music
			Sound.stopMusic();

			// remove monster from T.tally_nearby_monsters and save
			if (FS_Object.objLength(T.tally_nearby_monsters) && FS_Object.prop(T.tally_nearby_monsters[details.mid])) {
				delete T.tally_nearby_monsters[details.mid];
				TallyStorage.saveData("tally_nearby_monsters", T.tally_nearby_monsters, "💥 Battle.end()");
			}
			// then check/reset skin
			Skin.updateFromHighestMonsterStage();

			// reload page if tally won (because it was exploded)
			if (Battle.details.winner === "tally") {
				// reset page after a moment
				setTimeout(function() {
					location.reload();
				}, 800);
			}

		} catch (err) {
			console.error(err);
		}
	}

	// PUBLIC
	return {
		start: start,
		end: end,
		quit: quit,
		test: test,
		active: function(state) {
			return active(state);
		},
		details: details
	};
})();
