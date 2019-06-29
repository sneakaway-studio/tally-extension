"use strict";

/*  TALLY
 ******************************************************************************/

window.Tally = (function() {
	// PRIVATE

	let DEBUG = false,
		followCursor = false, // is eye following currently active? on page load, no
		tallyMenuOpen = false,
		tallyConsoleIcon = 'font-size:12px; background:url("'+ chrome.extension.getURL('assets/img/tally/tally-clear-20w.png') +'") no-repeat;';


	/*  TALLY EYES
	 ******************************************************************************/

	// update eye following state
	function setFollowCursor(state = true) {
		try {
			followCursor = state;
			if (state == true)
				$('.tally_eye_pupil').addClass("tally_eye_pupil_active");
			else
				$('.tally_eye_pupil').removeClass("tally_eye_pupil_active");
		} catch (err) {
			console.error(err);
		}
	}
	// move a single eye, call twice to move both
	function moveEye(which, how, event) {
		try {
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
		} catch (err) {
			console.error(err);
		}
	}
	// make tally stare at player
	function stare() {
		try {
			moveEye(".tally_eye_left", "stare");
			moveEye(".tally_eye_right", "stare");
			setTimeout(function() {
				followCursor = true;
			}, 400);
		} catch (err) {
			console.error(err);
		}
	}



	/*  TALLY CHARACTER
	 *****************************************************************************/


	/**
	 *	Start Tally
	 */
	function start() {
		try {
			//console.log("%c   Tally.start()", tallyConsoleIcon);

			// shouldn't need this now that it is handled by Storage / leveling up
			// Stats.reset("tally");


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

			//console.log("%c   Tally.start()", tallyConsoleIcon, tally_game_status.skin, Skin.skins);

			let str =
				"<div class='tally draggable' id='tally_character'>" +// style='transform:translateY(-350px);'
					"<div class='tally tally_speech_bubble' id='tally_dialogue_bubble'>" +
						"<div class='tally' id='tally_dialogue'></div>" +
					"</div>" +
					"<div class='tally' id='tally_character_inner'>" +
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
					"</div>" +
					"<div class='tally tally_stats'>" +
						"<div class='tally tally_stats_bars'></div>" +
						"<div class='tally tally_stats_table'></div>" +
					"</div>" +
				"</div>";
			$('#tally_wrapper').append(str);

			// insert SVG, stats table
			$('.tally_stats_bars').html(StatsDisplay.returnInitialSVG("tally"));
			$('.tally_stats_table').html(StatsDisplay.returnFullTable("tally"));

			$("#tally_character").draggable({
				drag: function() {},
				stop: function() {}
			});

			$('.tally_stats').on("mouseenter", function(e) {
				//console.log("hi",$('.tally_stats_table').css("display"));
				if ($('.tally_stats_table').css("display") == "none")
					$('.tally_stats_table').css({
						"display": "block"
					});
				else
					$('.tally_stats_table').css({
						"display": "none"
					});
			});



			// display stats
			StatsDisplay.updateDisplay("tally");


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



			// for domains that rewrite body, add listener to add Tally back if removed
			if (pageData.domain == "baidu.com") {
				onRemove(document.getElementById('tally_click_visual'), reloadIfRemoved);
			}





			// Battle.test();
		} catch (err) {
			console.error(err);
		}
	}



	// listener to
	function onRemove(element, onDetachCallback) {
		const observer = new MutationObserver(function() {
			function isDetached(el) {
				if (el.parentNode === document) {
					//console.log("false");
					return false;
				} else if (el.parentNode === null) {
					//console.log("true");
					return true;
				} else {
					//console.log("detached = " + isDetached(el.parentNode));
					return isDetached(el.parentNode);
				}
			}
			if (isDetached(element)) {
				observer.disconnect();
				onDetachCallback();
			}
		});

		observer.observe(document, {
			childList: true,
			subtree: true
		});
	}
	function reloadIfRemoved() {
		// load everything again
		Interface.addBaseHTML();
		// start tally again
		start();
	}



	/*  TALLY MENU
	 *****************************************************************************/

	function tallyMenu() {
		try {
			//console.log(tallyMenuOpen)
			if (tallyMenuOpen) {
				// open so close
				Dialogue.hide();
				tallyMenuOpen = false;
			} else {
				// closed so open

				var str = "" +
					"<button class='tally' id='tallyMenu_profile'>`1+p View profile</button>" +
					"<button class='tally' id='tallyMenu_startScreen'>`1+s View start screen</button>" +
					"<button class='tally' id='tallyMenu_testNearbyMonster'>`1+m Test nearby monster</button>" +
					"<hr>" +
					"<button class='tally' id='tallyMenu_battleStart'>`1+b Start battle</button>" +
					"<button class='tally' id='tallyMenu_battleEnd'>`1+q End battle</button>" +
					"<button class='tally' id='tallyMenu_battleRumbleSmall'>`1+r+0 small battle rumble</button>" +
					"<button class='tally' id='tallyMenu_battleRumbleMedium'>`1+r+1 medium battle rumble</button>" +
					"<button class='tally' id='tallyMenu_battleRumbleLarge'>`1+r+2 large battle rumble</button>" +
					"<hr>" +
					"<button class='tally' id='tallyMenu_explodePage'>`1+e Explode Page</button>" +
					"<button class='tally' id='tallyMenu_randomDialogue'>`1+t Random dialogue</button>" +
					"<button class='tally' id='tallyMenu_randomSkin'>`1+w Random skin</button>" +
					"</div>";

				Dialogue.showStr(str, false, true);

				tallyMenuOpen = true;
			}

			// launch title page
			$(document).on('click', '#tallyMenu_profile', function() {
				window.open('https://tallygame.net/profile/' + tally_user.username);
			});
			$(document).on('click', '#tallyMenu_startScreen', function() {
				chrome.runtime.sendMessage({
					'action': 'openPage',
					'url': chrome.extension.getURL('assets/pages/startScreen/startScreen.html')
				});
			});
			$(document).on('click', '#tallyMenu_testNearbyMonster', function() {
				Monster.test(); // launch one of the nearby monsters
			});
			$(document).on('click', '#tallyMenu_battleStart', function() {
				Battle.test();
			});
			$(document).on('click', '#tallyMenu_battleRumbleSmall', function() {
				BattleEffect.showRumble("small");
			});
			$(document).on('click', '#tallyMenu_battleRumbleMedium', function() {
				BattleEffect.showRumble("medium");
			});
			$(document).on('click', '#tallyMenu_battleRumbleLarge', function() {
				BattleEffect.showRumble("large");
			});
			$(document).on('click', '#tallyMenu_battleEnd', function() {
				Battle.end();
			});
			$(document).on('click', '#tallyMenu_explodePage', function() {
				Effect.explode();
			});
			$(document).on('click', '#tallyMenu_randomDialogue', function() {
				Dialogue.random();
			});
			$(document).on('click', '#tallyMenu_randomSkin', function() {
				Skin.random();
			});

		} catch (err) {
			console.error(err);
		}
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
		start: start,
		tallyConsoleIcon: tallyConsoleIcon

	};
})();


let k = "`+1";
Mousetrap.bind(k + ' p', function() {
	window.open('https://tallygame.net/profile/' + tally_user.username);
});
Mousetrap.bind(k + ' s', function() {
	chrome.runtime.sendMessage({
		'action': 'openPage',
		'url': chrome.extension.getURL('assets/pages/startScreen/startScreen.html')
	});
});
Mousetrap.bind(k + ' t', function() {
	Dialogue.random();
});
Mousetrap.bind(k + ' w', function() {
	Skin.random();
});
Mousetrap.bind(k + ' m', function() {
	Monster.test();
});
Mousetrap.bind(k + ' b', function() {
	Battle.test();
});
Mousetrap.bind(k + ' 0', function() {
	BattleEffect.showRumble("small");
});
Mousetrap.bind(k + ' 1', function() {
	BattleEffect.showRumble("medium");
});
Mousetrap.bind(k + ' 2', function() {
	BattleEffect.showRumble("large");
});
Mousetrap.bind(k + ' 7', function() {

});
Mousetrap.bind(k + ' 8', function() {
	BattleConsole.log("What will Tally do?", "showBattleOptions");
});
Mousetrap.bind(k + ' 9', function() {

});
Mousetrap.bind(k + ' q', function() {
	Battle.end();
});
Mousetrap.bind('escape', function() {
	Battle.end();
});
Mousetrap.bind(k + ' e', function() {
	Effect.explode();
});


Mousetrap.bind(k + ' z', function() {
	StatsDisplay.adjustStatsBar("tally", "health", Math.random());
});
Mousetrap.bind(k + ' x', function() {
	StatsDisplay.adjustStatsBar("tally", "stamina", Math.random());
});
Mousetrap.bind(k + ' v', function() {
	StatsDisplay.adjustStatsCircle("tally", Math.random());
});
Mousetrap.bind(k + ' r', function() {

});




Mousetrap.bind(k + ' v', function() {
	BattleTest.test();
});


// setInterval(function() {
// 	StatsDisplay.adjustStatsBar("tally", "health", Math.random());
// 	StatsDisplay.adjustStatsBar("tally", "stamina", Math.random());
// 	StatsDisplay.adjustStatsCircle("tally", Math.random());
//
// 	StatsDisplay.adjustStatsBar("monster", "health", Math.random());
// 	StatsDisplay.adjustStatsBar("monster", "stamina", Math.random());
// 	StatsDisplay.adjustStatsCircle("monster", Math.random());
// }, 3000);
