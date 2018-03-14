/*jshint esversion: 6 */

var Tally = (function() {
	"use strict";

	// PRIVATE
	var followCursor = false, // is eye following currently active? on page load, no
		blinking = true,
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
		if (!followCursor) return;
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

	function tallyMenu() {
		var str = "<div id='tally_menu'>" +
			// https://en.wikipedia.org/wiki/Glossary_of_video_game_terms
			"<button id='tally_menu_profile'>View your profile</button>" +
			"<button id='tally_menu_install'>View install page</button>" +
			//"<button id='tally_menu_credits'>Experiments</button>"+
			"</div>";
		return str;
	}


	/*  TALLY CHARACTER
	 *****************************************************************************/




	// PUBLIC
	return {
		blink: function() {
			if (blinking == true) console.log("blink");
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
		menu: function() {
			if (tallyMenuOpen) {
				Thought.hide(true);
			} else
				Thought.show(tallyMenu(), 3, -1, true);
			tallyMenuOpen = !tallyMenuOpen;
		}


	};
})();




/**
 *	Start Tally
 */
function startTally() {

	// only show Tally if game mode == full
	if (prop(pageData) && !pageData.activeOnPage) return;
	if (!prop(tally_options) || !tally_options.showTally) return;

	//Tally.blink();


	$(document).mousemove(function(event) {
		if (Tally.getFollowCursor == false) return;
		Tally.setFollowCursor(true);
		Tally.moveEye(".tally_eye_left", "mouse", event);
		Tally.moveEye(".tally_eye_right", "mouse", event);
	});

	let str =
		"<div id='tally_character_container' class='draggable'>" +
		"<div id='tally_thought_bubble' class='tally_speech_bubble'>" +
		"<div id='tally_thought'></div>" +
		"</div>" +
		"<div id='tally_eyes'>" +
		"<span class='tally_lid'>" +
		"<span class='tally_eye tally_eye_left'>" +
		"<span class='tally_eye_pupil'></span></span></span>" +
		"<span class='tally_lid'>" +
		"<span class='tally_eye tally_eye_right'>" +
		"<span class='tally_eye_pupil'></span></span></span>" +
		"</div>" +
		"<div id='tally_character'>" +
		"<div class='tally_score_score'></div>" +
		"<div class='tally_score_clicks'></div>" +
		"<div class='tally_score_likes'></div>" +
		"<div class='tally_score_pages'></div>" +
		"<div class='tally_score_domains'></div>" +

		// "<div class='tyd_dropdown'>" +
		// "<select class='reset-this tyd_dropdown_select' size=1>" +
		// "<option value='tallyThoughtHello'>*</option>" +
		// "<option value='showRandomProductMonsterFromAbove'>showRandomProductMonsterFromAbove</option>" +
		// "<option value='showProductMonsterFromAbove'>showProductMonsterFromAbove</option>" +
		// "<option value='showProductMonsterVideo'>showProductMonsterVideo</option>" +
		// "<option value='stare'>stare</option>" +
		// "<option value='tallyThoughtHello'>tallyThought</option>" +
		// "<option value='tallyThoughtShowScore'>tallyThoughtShowScore</option>" +
		// "<option value='explodeThePage'>explodeThePage</option>" +
		// "<option value='transform-180-null'>transform-180-null</option>" +
		// "<option value='transform-null-.5'>transform-null-.5</option>" +
		// "<option value='mirrorPage'>mirrorPage</option>" +
		// "<option value='resetDebuggerPosition'>resetDebuggerPosition</option>" +
		// "<option value='returnAllNodes'>returnAllNodes</option>" +
		// "</select>​" +
		// "</div>" +
		"</div>" +
		"</div>";
	$('#tally').append(str);

	$("#tally_character_container").draggable({
		drag: function(){
		},
		stop: function(){
		}
	});

	// maybe temp...
	Skin.preload();

	// add the tally_character click action
	document.getElementById('tally_character_container').onclick = function() {
//		Tally.menu();
//		Tally.show(Thought.get("random","hello"), false);
	//	Tally.show(Thought.get("trackers","lots"), true);

	Thought.show(Thought.get("trackers","general"), true);
		//Sound.test("tally", "tally-fun-fact.mp3");
		Sound.test("tally");

	};


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



//	Tally.showThought(Thoughts.random.hello, false);

}
