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
				'-webkit-transform': 'rotate(' + rot + 'deg)',
				'-moz-transform': 'rotate(' + rot + 'deg)',
				'-ms-transform': 'rotate(' + rot + 'deg)',
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


	/*  TALLY MENU
	 *****************************************************************************/

	function menu() {
		//console.log(tallyMenuOpen)
		if (tallyMenuOpen) {
			// open so close
			Thought.hide();
			tallyMenuOpen = false;
		} else {
			// closed so open

			var str = "<div class='tally' id='tally_menu'>" +
				// https://en.wikipedia.org/wiki/Glossary_of_video_game_terms
				"<button class='tally' id='tally_menu_profile'>View your profile</button>" +
				"<button class='tally' id='tally_menu_install'>View install page</button>" +
				//"<button class='tally' id='tally_menu_credits'>Experiments</button>"+
				"</div>";

			Thought.showString(str, false, true);

			tallyMenuOpen = true;
		}
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


		$(document).on('mouseenter mouseleave', '#tally_character_container', function() {
			// works but don't need it yet
			//Tally.menu();
		});

		$(document).on('dblclick', '#tally_character_container', function() {
			if (!Battle.active()) {
				Battle.start("scary");
				Skin.update("pattern-plaidRed");
			} else {
				BattleConsole.log("Some more stuff for the console " + pageData.time);
				var r = Math.random();
				if (r < 0.1)
					Skin.update("color-magenta");
				else if (r < 0.2)
					Skin.update("color-cyan");
				else if (r < 0.4)
					Skin.update("gradient-rainbow");
				else if (r < 0.6)
					Skin.update("gradient-gold");
				else if (r < 0.8)
					Skin.update("image-flowerRetro");
				// else if (r < .09)
				// 	Skin.update("pattern-plaidYellow");
				else if (r < 1)
					Skin.update("image-plaidRed");
			}
		});


		// add the tally_character click action
		$(document).on('click', '#tally_character_container', function() {
			return;
			// launch one of the nearby monsters
			//if (pageData.domain.indexOf("localhost") >= 0)
			Monster.test();
			return;

			// EXAMPLES

			// Thought.showThought(Thought.getThought(["monster", "launch", 0]),true);
			// return;


			let r = Math.random();
			if (r < 0.25)
				// show thought from data, [category/subcategory/0], play sound
				Thought.showThought(Thought.getThought(["random", "greeting", 0]), true);
			else if (r < 0.5)
				// show thought from data, [category/0/index], play sound
				Thought.showThought(Thought.getThought(["narrative", 0, "story3"]), true);
			else if (r < 0.75)
				// show thought from facts, trackers, play sound
				Thought.showFact(Thought.getFact("trackers"), "neutral");
			else
				// show thought <string>, play sound
				Thought.showString("this is just a string", "neutral");

		});


		// launch title page
		$(document).on('click', '#tally_menu_profile', function() {
			// use "on" because these elements are added dynamically)
			window.open(chrome.extension.getURL('assets/pages/profile/profile.html'));
		});
		$(document).on('click', '#tally_menu_install', function() {
			window.open(chrome.extension.getURL('assets/pages/install/install.html'));
		});
		$(document).on('click', '#tally_menu_sneakaway', function() {
			window.open('https://sneakaway.studio');
		});
		$(document).on('click', '#tally_menu_neotopia', function() {
			window.open('http://www.nabi.or.kr/english/project/coming_read.nab?idx=583');
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
		menu: menu,
		stare: stare,
		start: start

	};
})();
