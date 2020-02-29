"use strict";

/*  TALLY
 ******************************************************************************/

window.Tally = (function() {
	// PRIVATE
	let DEBUG = Debug.ALL.Tally,
		followCursor = false, // is eye following currently active? on page load, no
		tallyMenuOpen = false,
		tallyConsoleIcon = 'font-size:12px; background:url("' +
		chrome.extension.getURL('assets/img/tally/tally-clear-20w.png') +
		'") no-repeat;';


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
	 *	Add Tally character
	 */
	function addCharacter() {
		try {
			//console.log("%c   Tally.addCharacter()", tallyConsoleIcon);

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

			let str =
				"<div class='tally draggable' id='tally_character'>" + // style='transform:translateY(-350px);'
				"<div class='tally tally_speech_bubble' id='tally_dialogue_bubble'>" +
				"<div class='tally' id='tally_dialogue'></div>" +
				"</div>" +
				"<div class='tally' id='tally_item_manager'>" +
				"<div class='tally' id='tally_item_manager_inner'></div>" +
				"</div>" +
				"<div class='tally' id='tally_slide_show'>" +
				"<div class='tally' id='tally_slide_show_inner'></div>" +
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

			$('.tally_stats').on("click", function(e) {
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

			// for domains that rewrite body, add listener to add Tally back if removed
			if (pageData.domain == "baidu.com") {
				onRemove(document.getElementById('tally_click_visual'), reloadIfRemoved);
			}
		} catch (err) {
			console.error(err);
		}
	}

	/**
	 * listener to add Tally character if removed
	 */
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
		addCharacter();
	}



	/*  TALLY LISTENERS
	 *****************************************************************************/


	/**
	 *	Listeners for Tally menu
	 *	- Placed outside of functions so they are only added once.
	 */

	// let mouseEnterMessage1 = false;
	// MOUSEENTER | MOUSELEAVE
	$(document).on('mouseenter', '#tally_character', function() {
		interactionHandler('mouseenter');
	});
	$(document).on('mouseleave', '#tally_character', function() {
		interactionHandler('mouseleave');
	});

	// ON DRAG START | DRAG | DRAG STOP
	$(document).on('dragstart', '#tally_character', function() {
		interactionHandler('dragstart');
	});
	let dragging = false;
	$(document).on('drag', '#tally_character', function() {
		interactionHandler('drag');
	});
	$(document).on('dragstop', '#tally_character', function() {
		interactionHandler('dragstop');
	});




	/**
	 *	Generic handler to route | stop | color all interaction
	 */
	function interactionHandler(interaction) {
		try {
			console.log("%c   Tally.interactionHandler()", tallyConsoleIcon, interaction);


			// default to prompt if not connected
			if (!FS_Object.prop(tally_user) || tally_meta.userTokenStatus != "ok") {
				Dialogue.showStr(TallyMain.userTokenPromptMessage(), "sad", true);
				return;
			}



			else if (interaction === 'mouseenter') {
				// only show one of these during each page
				if (!FS_Object.prop(window.tallyFirstMouseEnterMessage)) return;
				let r = Math.random(),
					often = 1,
					dialogue = {
						"text": "Oh hi! I'm Tally!",
						"mood": "happy"
					};
				// if not the first time then only show half the time
				if (Progress.get("mouseEnterTally")) often = 0.5;
				if (r > often) dialogue = {};
				// otherwise get a random message
				else dialogue = Dialogue.get(["random", "greeting", null]);
				Dialogue.show(dialogue, false, true); // show dialogue
				Progress.update("mouseEnterTally", true); // update progress
				window.tallyFirstMouseEnterMessage = true;

			} else if (interaction === 'mouseleave') {
				if (!Progress.update("mouseLeaveTally1", true))
					Dialogue.showStr("Did you know that you can drag me around the screen.", false, true);
			} else if (interaction === 'dragstart') {
				// Dialogue.showStr("Weeeeeeeee!", false, true);
			} else if (interaction === 'drag') {
				if (!dragging) {
					Dialogue.showStr("Weeeeeeeee!", "happy", true);
					dragging = true;
				}
			} else if (interaction === 'dragstop') {
				if (!Progress.update("dragTally", true))
					Dialogue.showStr("Double click me!", "happy", true);
				dragging = false;
			}


		} catch (err) {
			console.error(err);
		}
	}






	/**
	 *	Tally multiclick
	 */
	let clickTimer = 0,
		clickTimerMax = 220,
		clickCount = 0,
		clickCountMax = 5,
		clickInterval = null,
		clickIntervalTime = 10;
	// listener
	$(document).on('click', '#tally_character', function() {
		// if restarting or continuing
		if ((clickCount >= 0 && clickCount <= clickCountMax) || clickInterval) {
			// increment clicks
			++clickCount;
			// console.log("click #" + clickCount);
			// reset timer
			clickTimer = 0;
			// clear old and start new interval
			clearInterval(clickInterval);
			clickInterval = setInterval(multiclickCountdown, clickIntervalTime);
		} else multiclickReset();
	});
	// multiclick count down
	function multiclickCountdown() {
		// console.log("multiclickCountdown() clickCount=" + clickCount + "/" + clickCountMax, clickTimer + "/" + clickTimerMax);
		// increase time
		clickTimer += clickIntervalTime;
		// time has run out so reset everything
		if (clickTimer >= clickTimerMax)
			multiclickReset();
	}
	// multiclick reset
	function multiclickReset() {
		multiclickAction();
		clickCount = 0;
		clickTimer = 0;
		clearInterval(clickInterval);
	}
	// multiclick action
	function multiclickAction() {
		try {
			// default to prompt if not connected
			if (!FS_Object.prop(tally_user) || tally_meta.userTokenStatus != "ok") {
				Dialogue.showStr(TallyMain.userTokenPromptMessage(), "sad", true);
				return;
			}

			if (clickCount <= 0) return;
			// ONE CLICK
			if (clickCount === 1) {
				// Item.showManager();
				// Skin.random();
				// if (!Progress.update("clickTally", true))
				// 	return Dialogue.showStr("Did you know that you can drag me around the screen.", false, true);
			}
			// TWO CLICKS
			else if (clickCount === 2) {
				// update progress (even tho we'll always show this menu)
				Progress.update("doubleClickTally", true);
				// build string and show
				let str = "Would you like to view a " +
					"<a class='tally' id='tally_showTutorialOne'>tutorial</a> " +
					"or see more <a class='tally' id='tally_showMoreOptions'>options</a>?";
				Dialogue.showStr(str, false, true, true);
			}
			// THREE CLICKS
			else if (clickCount === 3) {
				Dialogue.showStr("A triple click!", false, true, true);
			}
			// FOUR CLICKS
			else if (clickCount === 4) {
				// alert("three!");
				showDevOptions();
			}
		} catch (err) {
			console.error(err);
		}
	}





	/*  TALLY MENU
	 *****************************************************************************/

	// MENU ITEM LISTENERS
	$(document).on('click', '#tally_showTutorialOne', function() {
		Tutorial.play("tutorial1");
	});
	$(document).on('click', '#tally_showMoreOptions', function() {
		let str = "" +
			// user-specific
			"View your <a class='tally tally_profile_link'>profile</a>, " +
			"<a class='tally' id='tally_dashboard'>dashboard</a>, " +
			"or <a class='tally' id='tally_leaderboard'>leaderboards</a>.<br>" +
			// promo material
			"Check out the <a class='tally' id='tally_startScreen'>start screen</a>, " +
			"the <a class='tally' id='tally_howToPlay'>how to play page</a>, " +
			"or the <a class='tally' id='tally_gameTrailerBtn'>game trailer</a>. " +
			// nerd out
			// "Read our <a class='tally' id='tally_privacyPolicy'>privacy policy</a> " +
			// "or take the <a class='tally' id='tally_gameTrailerBtn'>beta tester survey</a> " +
			"";
		Dialogue.showStr(str, false, true, true);
	});



	/**
	 *	Listeners for options menu
	 *	- Placed outside of functions so they are only added once.
	 */

	// launch profile
	$(document).on('click', '.tally_profile_link', function() {
		window.open(tally_meta.website + "/profile/" + tally_user.username);
	});
	$(document).on('click', '#tally_dashboard', function() {
		window.open(tally_meta.website + "/dashboard");
	});
	$(document).on('click', '#tally_leaderboard', function() {
		window.open(tally_meta.website + "/leaderboards");
	});

	// launch start screen
	$(document).on('click', '#tally_startScreen', function() {
		chrome.runtime.sendMessage({
			'action': 'openPage',
			'url': chrome.extension.getURL('assets/pages/startScreen/startScreen.html')
		});
	});
	$(document).on('click', '#tally_gameTrailerBtn', function() {
		window.open("https://www.youtube.com/watch?v=xfsbm1cI2uo");
	});

	$(document).on('click', '#tally_privacyPolicy', function() {
		window.open(tally_meta.website + "/privacy");
	});
	$(document).on('click', '#tally_howToPlay', function() {
		window.open(tally_meta.website + "/how-to-play");
	});
	$(document).on('click', '#tally_betaTestSurvey', function() {
		window.open("https://docs.google.com/forms/d/e/1FAIpQLSeGx8zsF4aMQZH1eM0SzOvcpXijt8Bem1pzg4eni9eK8Jr-Lg/viewform");
	});




	/*  TEST LISTENERS
	 *****************************************************************************/


	function showDevOptions() {
		let str = "Dev options: <br>" +
			"Monster: <a class='tally' id='tally_testNearbyMonster'>test</a>; " +
			"Battle: <a class='tally' id='tally_battleStart'>start</a>, " +
			"<a class='tally' id='tally_battleEnd'>end</a>;<br>" +
			"Rumble: <a class='tally' id='tally_battleRumbleSmall'>sm</a>, " +
			"<a class='tally' id='tally_battleRumbleMedium'>md</a>, " +
			"<a class='tally' id='tally_battleRumbleLarge'>lg</a>, " +
			"<a class='tally' id='tally_explodePage'>explode</a>;<br>" +
			"Dialogue: <a class='tally' id='tally_randomDialogue'>random</a>; " +
			"Skin: <a class='tally' id='tally_randomSkin'>random</a>" +
			"";
		Dialogue.showStr(str, false, true, true);
	}

	$(document).on('click', '#tally_testNearbyMonster', function() {
		Monster.test(); // launch one of the nearby monsters
	});
	$(document).on('click', '#tally_battleStart', function() {
		Battle.test();
	});
	$(document).on('click', '#tally_battleRumbleSmall', function() {
		BattleEffect.showRumble("small");
	});
	$(document).on('click', '#tally_battleRumbleMedium', function() {
		BattleEffect.showRumble("medium");
	});
	$(document).on('click', '#tally_battleRumbleLarge', function() {
		BattleEffect.showRumble("large");
	});
	$(document).on('click', '#tally_battleEnd', function() {
		Battle.end();
	});
	$(document).on('click', '#tally_explodePage', function() {
		Effect.explode();
	});
	$(document).on('click', '#tally_randomDialogue', function() {
		Dialogue.random();
	});
	$(document).on('click', '#tally_randomSkin', function() {
		Skin.random();
	});

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
		addCharacter: addCharacter,
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
	Sound.stopMusic();
	BattleAttack.tallyWins("The monster's health has been depleted. Tally wins!!!", "monster-health-gone");
	// BattleEffect.showCapturedMonster();
	// Monster.test();
});
Mousetrap.bind(k + ' b', function() {
	// Battle.test();
	Sound.playFile("explosions/explode.mp3", false, 0);
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
