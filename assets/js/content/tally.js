"use strict";

window.Tally = (function() {

	let DEBUG = false;

	// PRIVATE
	var followCursor = false, // is eye following currently active? on page load, no
		tallyMenuOpen = false;





	/*  TALLY EYES
	 ******************************************************************************/

	// update eye following state
	function setFollowCursor(state = true) {
		followCursor = state;
		if (state == true)
			$('.tally_eye_pupil').addClass("tally_eye_pupil_active");
		else
			$('.tally_eye_pupil').removeClass("tally_eye_pupil_active");
	}
	// move a single eye, call twice to move both
	function moveEye(which, how, event) {
		// return if game should not be active
		if (!prop(pageData) || !pageData.activeOnPage) return;
		if (!$(".tally")) return;
		if (!followCursor) return;
		if ($(which).length == 0) return;
		// store reference to which eye
		var eye = $(which);
		var x, y, rad, rot;
		if (how == "mouse") {
			x = (eye.offset().left) + (eye.width() / 2);
			y = (eye.offset().top) + (eye.height() / 2);
			rad = Math.atan2(event.pageX - x, event.pageY - y);
			rot = (rad * (180 / Math.PI) * -1) + 180;
			eye.css({
				// '-webkit-transform': 'rotate(' + rot + 'deg)',
				// '-moz-transform': 'rotate(' + rot + 'deg)',
				// '-ms-transform': 'rotate(' + rot + 'deg)',
				'transform': 'rotate(' + rot + 'deg)'
			});
		} else if (how == "stare") {
			setFollowCursor(false);
		}
	}
	// make tally stare at player
	function stare() {
		moveEye(".tally_eye_left", "stare");
		moveEye(".tally_eye_right", "stare");
		setTimeout(function() {
			followCursor = true;
		}, 400);
	}



	/*  TALLY CHARACTER
	 *****************************************************************************/



	/**
	 *	Start Tally
	 */
	function start() {

		// only show Tally if game mode == full
		if (prop(pageData) && !pageData.activeOnPage) return;
		if (!prop(tally_options) || !tally_options.showTally) return;

		// maybe temp...
		//Skin.preload(); // don't need now, replacing with svg

		$(document).mousemove(function(event) {
			if (Tally.getFollowCursor == false) return;
			Tally.setFollowCursor(true);
			Tally.moveEye(".tally_eye_left", "mouse", event);
			Tally.moveEye(".tally_eye_right", "mouse", event);
		});

		//console.log("startTally()", tally_game_status.skin, Skin.skins);

		let str =
			"<div class='tally draggable' id='tally_character'>" +// style='transform:translateY(-300px);'
				"<div class='tally tally_speech_bubble' id='tally_thought_bubble'>" +
					"<div class='tally' id='tally_thought'></div>" +
				"</div>" +
				"<div class='tally' id='tally_body'>" +
					Skin.returnBasicSVG() +
				"</div>" +
				"<div class='tally' id='tally_eyes'>" +
					"<span class='tally tally_lid'>" +
						"<span class='tally tally_eye tally_eye_left'>" +
							"<span class='tally tally_eye_pupil'></span></span></span>" +
					"<span class='tally tally_lid'>" +
						"<span class='tally tally_eye tally_eye_right'>" +
							"<span class='tally tally_eye_pupil'></span></span></span>" +
				"</div>" +
				"<div class='tally tally_stats'>" +
					BattleStats.returnDisplay("tally") +
				"</div>" +
			"</div>";
		$('#tally_wrapper').append(str);

		$("#tally_character").draggable({
			drag: function() {},
			stop: function() {}
		});






		// HOVER
		$(document).on('mouseenter mouseleave', '#tally_character', function() {
			// works but don't need it yet
			//tallyMenu();
		});
		// ONE CLICK
		$(document).on('click', '#tally_character', function() {
			//
		});
		// DOUBLE CLICK
		$(document).on('dblclick', '#tally_character', function() {
			// show testing menu
			tallyMenu();
		});








// Battle.test();
	}


	/*  TALLY MENU
	 *****************************************************************************/

	function tallyMenu() {
		//console.log(tallyMenuOpen)
		if (tallyMenuOpen) {
			// open so close
			Thought.hide();
			tallyMenuOpen = false;
		} else {
			// closed so open

			var str = "" +
				"<button class='tally' id='tallyMenu_profile'>`1+p View profile</button>" +
				"<button class='tally' id='tallyMenu_startScreen'>`1+s View start screen</button>" +
				"<button class='tally' id='tallyMenu_testNearbyMonster'>`1+m Test nearby monster</button>" +
				"<hr>"+
				"<button class='tally' id='tallyMenu_battleStart'>`1+b Start battle</button>" +
				"<button class='tally' id='tallyMenu_battleEnd'>`1+q End battle</button>" +
				"<button class='tally' id='tallyMenu_battleRumbleSmall'>`1+r+0 small battle rumble</button>" +
				"<button class='tally' id='tallyMenu_battleRumbleMedium'>`1+r+1 medium battle rumble</button>" +
				"<button class='tally' id='tallyMenu_battleRumbleLarge'>`1+r+2 large battle rumble</button>" +
				"<hr>"+
				"<button class='tally' id='tallyMenu_explodePage'>`1+e Explode Page</button>" +
				"<button class='tally' id='tallyMenu_randomThought'>`1+t Random thought</button>" +
				"<button class='tally' id='tallyMenu_randomSkin'>`1+w Random skin</button>" +
				"</div>";

			Thought.showString(str, false, true);

			tallyMenuOpen = true;
		}

		// launch title page
		$(document).on('click', '#tallyMenu_profile', function() {
			window.open('https://tallygame.net/profile/' + tally_user.username);
		});
		$(document).on('click', '#tallyMenu_startScreen', function() {
			chrome.runtime.sendMessage({ 'action': 'openPage', 'url': chrome.extension.getURL('assets/pages/startScreen/startScreen.html') });
		});
		$(document).on('click', '#tallyMenu_testNearbyMonster', function() {
			Monster.testLaunch(); // launch one of the nearby monsters
		});
		$(document).on('click', '#tallyMenu_battleStart', function() {
			Battle.test();
		});
		$(document).on('click', '#tallyMenu_battleRumbleSmall', function() {
			BattleEffect.rumble("small");
		});
		$(document).on('click', '#tallyMenu_battleRumbleMedium', function() {
			BattleEffect.rumble("medium");
		});
		$(document).on('click', '#tallyMenu_battleRumbleLarge', function() {
			BattleEffect.rumble("large");
		});
		$(document).on('click', '#tallyMenu_battleEnd', function() {
			Battle.end();
		});
		$(document).on('click', '#tallyMenu_explodePage', function() {
			Effect.explode();
		});
		$(document).on('click', '#tallyMenu_randomThought', function() {
			Thought.random();
		});
		$(document).on('click', '#tallyMenu_randomSkin', function() {
			Skin.random();
		});
	}


	var tallyResetStats = {
		"health":100,
		"attack":100,
		"stamina":100,
		"accuracy":100,
		"evasion":100,
		"defense":100,
	};

	var tallyStats = {
		"health":100,
		"attack":100,
		"stamina":100,
		"accuracy":100,
		"evasion":100,
		"defense":100,
	};

	function stats(_stats){
		if (_stats && _stats.health){
			// update stats
			tallyStats = _stats;
		}
		return tallyStats;
	}

	function resetStatsForBattle (){
		tallyStats = tallyResetStats;
	}

	function updateStats (data){
		tallyStats[data.affects] += data.val;
		Thought.show("Yay!");
	}

	// PUBLIC
	return {
		resetStatsForBattle: resetStatsForBattle,
		stats: function(data){
			return stats(data);
		},
		updateStats: function(data){
			updateStats(data);
		},
		moveEye: function(which, how, event) {
			moveEye(which, how, event);
		},
		setFollowCursor: function(state) {
			setFollowCursor(state);
		},
		getFollowCursor: function(state) {
			return followCursor;
		},
		stare: stare,
		start: start

	};
})();


let k = "`+1";
Mousetrap.bind(k + ' p', function() { window.open('https://tallygame.net/profile/' + tally_user.username); });
Mousetrap.bind(k + ' s', function() {
	chrome.runtime.sendMessage({ 'action': 'openPage', 'url': chrome.extension.getURL('assets/pages/startScreen/startScreen.html') });
});
Mousetrap.bind(k + ' t', function() { Thought.random(); });
Mousetrap.bind(k + ' w', function() { Skin.random(); });
Mousetrap.bind(k + ' m', function() { Monster.testLaunch(); });
Mousetrap.bind(k + ' b', function() { Battle.test(); });
Mousetrap.bind(k + ' 0', function() { BattleEffect.rumble("small"); });
Mousetrap.bind(k + ' 1', function() { BattleEffect.rumble("medium"); });
Mousetrap.bind(k + ' 2', function() { BattleEffect.rumble("large"); });
Mousetrap.bind(k + ' 7', function() { Battle.monsterAttackTally(); });
Mousetrap.bind(k + ' 8', function() { BattleConsole.log("What will Tally do?","showBattleOptions"); });
Mousetrap.bind(k + ' 9', function() { Battle.tallyAttackMonster(); });
Mousetrap.bind(k + ' q', function() { Battle.end(); });
Mousetrap.bind('escape', function() { Battle.end(); });
Mousetrap.bind(k + ' e', function() { Effect.explode(); });


Mousetrap.bind(k + ' z', function() { BattleStats.adjustStatsBar("tally","hp",Math.random()); });
Mousetrap.bind(k + ' x', function() { BattleStats.adjustStatsBar("tally","xp",Math.random()); });
Mousetrap.bind(k + ' c', function() { BattleStats.adjustStatsBar("tally","mp",Math.random()); });
Mousetrap.bind(k + ' v', function() { BattleStats.adjustStatsCircle("tally",Math.random()); });


Mousetrap.bind(k + ' v', function() { BattleTest.test(); });


setInterval(function() {
	BattleStats.adjustStatsBar("tally", "hp", Math.random());
	BattleStats.adjustStatsBar("tally", "mp", Math.random());
	BattleStats.adjustStatsCircle("tally", Math.random());

	BattleStats.adjustStatsBar("monster", "hp", Math.random());
	BattleStats.adjustStatsBar("monster", "mp", Math.random());
	BattleStats.adjustStatsCircle("monster", Math.random());
}, 3000);
