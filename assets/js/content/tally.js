"use strict";

var Tally = (function() {

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
		moveEye: function(which, how, event) {
			moveEye(which, how, event);
		},
		setFollowCursor: function(state) {
			setFollowCursor(state);
		},
		getFollowCursor: function(state) {
			return followCursor;
		},
		stare: stare

	};
})();




/**
 *	Start Tally
 */
function startTally() {

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
		"<div id='tally_character_container' class='draggable'>" +
		"<div id='tally_thought_bubble' class='tally_speech_bubble'>" +
		"<div id='tally_thought'></div>" +
		"</div>" +
		"<div id='tally_character'>" +

		// bitmap method
		//"<img class='tally-svg' src='" + chrome.extension.getURL('assets/img/tally/tally.svg') + "'>" +

		// add svg
		'<svg version="1.1" id="tally-svg" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" ' +
		'x="0px" y="0px" viewBox="0 0 914 814" style="enable-background:new 0 0 914 814;" xml:space="preserve">' +
		'<style type="text/css"> .st0{fill:'+ Skin.skins[tally_game_status.skin].back +';}'+
		' .st1{fill:'+ Skin.skins[tally_game_status.skin].front +';} </style>' +
		'<path id="tally-back" class="st0" d="M652.5,793.8l255.5-281L565.2,127.6l-307.3,35L5,366l88.5,346.8L652.5,793.8z"/>' +
		'<path id="tally-front" class="st1" d="M199.8,809l419.9-139.2l126.5,10.1l161.9-319L690.5,14.1L509.8,36.2L450.2,'+
		'4L258.3,66.9l-190,23.2 l-17.7,443L199.8,809z"/>' +
		'</svg>' +

		"</div>" +
		"<div id='tally_eyes'>" +
		"<span class='tally_lid'>" +
		"<span class='tally_eye tally_eye_left'>" +
		"<span class='tally_eye_pupil'></span></span></span>" +
		"<span class='tally_lid'>" +
		"<span class='tally_eye tally_eye_right'>" +
		"<span class='tally_eye_pupil'></span></span></span>" +
		"</div>" +
		"</div>";
	$('#tally').append(str);

	$("#tally_character_container").draggable({
		drag: function() {},
		stop: function() {}
	});


	// add the tally_character click action
	$(document).on('click', '#tally_character_container', function() {




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
