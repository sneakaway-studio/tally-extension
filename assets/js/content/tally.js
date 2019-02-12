"use strict";

window.Tally = (function() {

	let TALLY_DEBUG = false;

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
			"<div class='tally draggable' id='tally_character_container'>" +
			"<div class='tally tally_speech_bubble' id='tally_thought_bubble'>" +
			"<div class='tally' id='tally_thought'></div>" +
			"</div>" +
			"<div class='tally' id='tally_character'>" +

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
			"</div>";
		$('#tally').append(str);

		$("#tally_character_container").draggable({
			drag: function() {},
			stop: function() {}
		});



		// TESTING
		//Monster.test();




		// HOVER
		$(document).on('mouseenter mouseleave', '#tally_character_container', function() {
			// works but don't need it yet
			//tallyMenu();
		});
		// ONE CLICK
		$(document).on('click', '#tally_character_container', function() {
			//
		});
		// DOUBLE CLICK
		$(document).on('dblclick', '#tally_character_container', function() {
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

			var str = "<div class='tally' id='tally_menu'>Testing menu<br>" +
				"<button class='tally' id='tallyMenu_profile'>View profile</button>" +
				"<button class='tally' id='tallyMenu_startScreen'>View start screen</button>" +
				"<button class='tally' id='tallyMenu_testNearbyMonster'>Test nearby monster</button>" +
				"<hr>"+
				"<button class='tally' id='tallyMenu_battleStart'>Start battle</button>" +
				"<button class='tally' id='tallyMenu_battleEnd'>End battle</button>" +
				"<button class='tally' id='tallyMenu_battleRumbleSmall'>small battle rumble</button>" +
				"<button class='tally' id='tallyMenu_battleRumbleMedium'>medium battle rumble</button>" +
				"<button class='tally' id='tallyMenu_battleRumbleLarge'>large battle rumble</button>" +
				"<hr>"+
				"<button class='tally' id='tallyMenu_explodePage'>Explode Page</button>" +
				"<button class='tally' id='tallyMenu_randomThought'>Random thought</button>" +
				"<button class='tally' id='tallyMenu_randomSkin'>Random skin</button>" +
				"</div>";

			Thought.showString(str, false, true);

			tallyMenuOpen = true;
		}

		// launch title page
		$(document).on('click', '#tallyMenu_profile', function() {
			window.open('https://tallygame.net/profile/' + tally_user.username);
		});
		$(document).on('click', '#tallyMenu_startScreen', function() {
			window.open(chrome.extension.getURL('assets/pages/startScreen/startScreen.html'));
		});
		$(document).on('click', '#tallyMenu_testNearbyMonster', function() {
			// launch one of the nearby monsters
			Monster.test();
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




	// PUBLIC
	return {
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
