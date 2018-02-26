/*jshint esversion: 6 */

var Tally = (function() {
	// private

	var followCursor = false;

	// update eye following state
	function setFollowCursor(state = true) {
		followCursor = state;
		if (state == true)
			$('.tally_eye_pupil').addClass("tally_eye_pupil_active");
		else
			$('.tally_eye_pupil').removeClass("tally_eye_pupil_active");
	}

	// public
	return {
		// BLINK
		blinking: true,
		blink: function() {
			if (this.blinking == true) console.log("blink");
		},
		// is eye following currently active? on page load, no
		//followCursor: false,
		moveEye: function(which, how, event) {
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
			} else if (how == "lookAtUser") {
				setFollowCursor(false);
			}
		},
		callSetFollowCursor: function(state) {
			setFollowCursor(state);
		},
		getFollowCursor: function(state) {
			return followCursor;
		},

		// make tally stare at user
		lookAtUser: function() {
			moveEye(".tally_eye_left", "lookAtUser");
			moveEye(".tally_eye_right", "lookAtUser");
			setTimeout(function() {
				followCursor = true;
			}, 400);
		}


	};
})();

Tally.blink();
// Tally.moveEyes();







/*  TALLY EYES
 ******************************************************************************/

$(function() {

	$(document).mousemove(function(event) {
		if (!pageData.activeOnPage) return;
		if (prop(tally_options) && !tally_options.showTally) return;
		if (Tally.getFollowCursor == false) return;
		Tally.callSetFollowCursor(true);
		Tally.moveEye(".tally_eye_left", "mouse", event);
		Tally.moveEye(".tally_eye_right", "mouse", event);
	});

	function addTallyHTML() {
		if (tally_options.showTally) {
			let str =
				"<div id='tally_character_container'>" +
				"<div id='tally_thought_bubble' class='tally_speech-bubble'>" +
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
				"<option value='lookAtUser'>lookAtUser</option>" +
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
		}
	}
	addTallyHTML();

	/**
	 *	Start Tally
	 */
	function startTally() {
		if (!pageData.activeOnPage) return;
		if (prop(tally_options) && !tally_options.showTally) return;

		// add the tally_character click action
		document.getElementById('tally_character_container').onclick = function() {
			// tallyThought(tallyMenu(),5,-1);
			// playSound("shoot");
		};
		Tally.lookAtUser();
	}

});
