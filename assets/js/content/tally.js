/*jshint esversion: 6 */

var Tally = (function() {
	// PRIVATE
	var followCursor = false, // is eye following currently active? on page load, no
		blinking = true,
		tallyMenuOpen = false,
		skin = "";


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

	function showTallyThought(str, lines = -1, duration = 2000, sound = false) {
		// if (sound)
		// 	Sound.test("tally", "thought-basic-open");
		// adjust lines if not received
		if (lines === -1)
			lines = Math.ceil(str.length / 29);
		// make the size of the box dependent on str.length
		$('#tally_thought_bubble').css({
			'display': 'flex',
			'height': lines * 30 + "px", // normal height for 50 chars is: 80px;
			'left': '10px' // make it visible
		});
		$('#tally_thought').html(str);
		// show
		var cssProperties = anime({
			targets: '#tally_thought_bubble',
			opacity: 1,
			duration: 400
		});
		stare();
		//console.log("lines",lines)
		if (duration > -1)
			// hide after period based on string length
			setTimeout(hideTallyThought, duration*(str.length/22));
	}

	function hideTallyThought(sound = false) {
		// if (sound)
		// 	Sound.test("tally", "thought-basic-close");
		var cssProperties = anime({
			targets: '#tally_thought_bubble',
			opacity: 0,
			duration: 500
		});
		$('#tally_thought_bubble').css({
			'left': '-500px',
			'display': 'none'
		});
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

	let skins = [
		"skin-color-cyan.png",
		"skin-color-magenta.png",
		"skin-color-yellow.png",
		"skin-grad-rainbow.png",
		"skin-grad-yellow-orange.png",
		"skin-pattern-camo-grey.png",
		"skin-pattern-flower-retro.png",
		"skin-pattern-plaid-red.png"
	];

	function updateSkin() {
		// temp: random skins
		let r = Math.floor(Math.random()*skins.length);
		let skin = chrome.extension.getURL('assets/img/tally-skins/'+skins[r]);
		$("#tally_character_container").css("background-image", "url('"+skin+"')");
	}


	/*  PUBLIC
	 *****************************************************************************/

	return {
		thought: function(str, lines, duration, sound) {
			showTallyThought(str, lines, duration, sound);
		},
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
		stare: function() {
			stare();
		},
		menu: function() {
			if (tallyMenuOpen) {
				hideTallyThought(true);
			} else
				showTallyThought(tallyMenu(), 3, -1, true);
			tallyMenuOpen = !tallyMenuOpen;
		},
		updateSkin: function(){
			updateSkin();
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
		"<div id='tally_character_container'>" +
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

		"<div class='tyd_dropdown'>" +
		"<select class='reset-this tyd_dropdown_select' size=1>" +
		"<option value='tallyThoughtHello'>*</option>" +
		"<option value='showRandomProductMonsterFromAbove'>showRandomProductMonsterFromAbove</option>" +
		"<option value='showProductMonsterFromAbove'>showProductMonsterFromAbove</option>" +
		"<option value='showProductMonsterVideo'>showProductMonsterVideo</option>" +
		"<option value='stare'>stare</option>" +
		"<option value='tallyThoughtHello'>tallyThought</option>" +
		"<option value='tallyThoughtShowScore'>tallyThoughtShowScore</option>" +
		"<option value='explodeThePage'>explodeThePage</option>" +
		"<option value='transform-180-null'>transform-180-null</option>" +
		"<option value='transform-null-.5'>transform-null-.5</option>" +
		"<option value='mirrorPage'>mirrorPage</option>" +
		"<option value='resetDebuggerPosition'>resetDebuggerPosition</option>" +
		"<option value='returnAllNodes'>returnAllNodes</option>" +
		"</select>​" +
		"</div>" +
		"</div>" +
		"</div>";
	$('#tally').append(str);


	// add the tally_character click action
	document.getElementById('tally_character_container').onclick = function() {
//		Tally.menu();
//		Tally.thought(Thoughts.thought("random","hello"), -1, 2000, false);
	//	Tally.thought(Thoughts.thought("trackers","lots"), -1, 2000, true);

	Tally.thought(Thoughts.thought("random","funny"), -1, 2000, true);
		//Sound.test("tally", "tally-fun-fact.mp3");
		Sound.test("tally");
		Tally.updateSkin();
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



//	Tally.thought(Thoughts.random.hello, -1, 2000, false);

}
