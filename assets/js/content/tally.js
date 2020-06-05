"use strict";

/*  TALLY
 ******************************************************************************/

window.Tally = (function() {
	// PRIVATE
	let DEBUG = Debug.ALL.Tally,
		followCursor = false, // is eye following currently active? on page load, no
		tallyMenuOpen = false,
		tallyConsoleIcon = 'font-size:12px; background:url("' +
		chrome.extension.getURL('assets/img/tally/tally-clear-20w.png') + '") no-repeat;';


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
			// allow offline
			if (Page.mode().notActive) return;
			// don't allow if mode disabled or stealth
			if (tally_options.gameMode === "disabled" || tally_options.gameMode === "stealth") return;

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
			// allow offline
			if (Page.mode().notActive) return;
			// don't allow if mode disabled or stealth
			if (tally_options.gameMode === "disabled" || tally_options.gameMode === "stealth") return;

			if (DEBUG) console.log("%c   Tally.addCharacter()", tallyConsoleIcon);

			// only show Tally if game mode == full
			if (!prop(tally_options) || !tally_options.showTally) return;

			// maybe temp...
			//Skin.preload(); // don't need now, replacing with svg

			$(document).on("mousemove", function(event) {
				Tally.setFollowCursor(true);
				Tally.moveEye(".tally_eye_left", "mouse", event);
				Tally.moveEye(".tally_eye_right", "mouse", event);
			});

			let str =
				"<div class='tally draggable' id='tally_character'>" + // style='transform:translateY(-350px);'
				"<div class='tally tally_speech_bubble' id='tally_dialogue_outer'>" +
				"<div class='tally' id='tally_dialogue_inner'></div>" +
				"</div>" +
				"<div class='tally' id='tally_item_manager'>" +
				"<div class='tally' id='tally_item_manager_menu'></div>" +
				"<div class='tally' id='tally_item_manager_inner'></div>" +
				"</div>" +
				"<div class='tally' id='tally_slide_show'>" +
				"<div class='tally' id='tally_slide_show_inner'></div>" +
				"</div>" +
				"<div class='tally' id='tally_character_inner'>" +
				"<div class='tally' id='tally_body'>" + Skin.returnTallySVG() + "</div>" +
				"<div class='tally' id='tally_eyes'>" +
				"<span class='tally tally_lid'>" +
				"<span class='tally tally_eye tally_eye_left'>" +
				"<span class='tally tally_eye_pupil'></span></span></span>" +
				"<span class='tally tally_lid'>" +
				"<span class='tally tally_eye tally_eye_right'>" +
				"<span class='tally tally_eye_pupil'></span></span></span>" +
				"</div>" +
				"</div>" +
				"<div class='tally tally_disguise'></div>" +
				"<div class='tally tally_stats'>" +
				"<div class='tally tally_stats_bars'></div>" +
				"<div class='tally tally_stats_table'></div>" +
				"</div>" +
				"</div>";
			$('#tally_wrapper').append(str);

			$("#tally_character").draggable({
				drag: function() {},
				stop: function() {}
			});

			// do not allow unless fully active
			if (!Page.data.mode.active) return;

			Disguise.displayIfTrackerBlocked();

			addStats();

			// for domains that rewrite body, add listener to add Tally back if removed
			if (Page.data.domain == "baidu.com") {
				onRemove(document.getElementById('tally_click_visual'), reloadIfRemoved);
			}
		} catch (err) {
			console.error(err);
		}
	}


	/**
	 *	Add Tally character
	 */
	function addStats() {
		try {
			if (DEBUG) console.log("%c   Tally.addStats()", tallyConsoleIcon);

			// insert SVG, stats table
			$('.tally_stats').css({
				"display": "block"
			});
			$('.tally_stats_bars').html(StatsDisplay.returnInitialSVG("tally"));
			$('.tally_stats_table').html(StatsDisplay.returnFullTable("tally"));

			// show / hide stats on click
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


		} catch (err) {
			console.error(err);
		}
	}

	/**
	 * 	listener to add Tally character if removed
	 */
	function onRemove(element, onDetachCallback) {
		try {
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
			// watch the dom
			observer.observe(document, {
				childList: true,
				subtree: true
			});
		} catch (err) {
			console.error(err);
		}
	}

	function reloadIfRemoved() {
		try {
			// load everything again
			Interface.addBaseHTML();
			// start tally again
			addCharacter();
		} catch (err) {
			console.error(err);
		}
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
	let dragging = false;
	$(document).on('dragstart', '#tally_character', function() {
		interactionHandler('dragstart');
	});
	$(document).on('drag', '#tally_character', function() {
		// interactionHandler('drag'); // fires too often
	});
	$(document).on('dragstop', '#tally_character', function() {
		interactionHandler('dragstop');
	});




	/**
	 *	Generic handler to route | stop | color all interaction
	 */
	function interactionHandler(interaction) {
		try {
			// allow offline
			if (Page.mode().notActive) return;
			// don't allow if mode disabled
			if (tally_options.gameMode === "disabled") return;

			// MOUSE ENTER
			if (interaction === 'mouseenter') {
				if (DEBUG) console.log("%c   Tally.interactionHandler()", tallyConsoleIcon, interaction);

				// the first time
				if (Progress.update("mouseEnterTally", 1, "+") < 1) {
					if (Progress.update("toldToDragTally", 1, "+") < 1) {
						// tell them more
						Dialogue.showData({
							"text": "Did you know that you can drag me around the screen?",
							"mood": "question"
						}, {
							instant: true
						});
					}
				} else {
					// show random greeting once per page load
					if (!FS_Object.prop(window.tallyFirstMouseEnterMessage)) return;
					window.tallyFirstMouseEnterMessage = true;

					// use random to determine what to do
					let r = Math.random(),
						// how often %
						often = 1,
						// sample dialogue
						dialogue = {
							"text": "Oh hi! I'm Tally!",
							"mood": "happy"
						};
					// check/update progress, after the first time then only show half the time
					if (Progress.get("mouseEnterTally") > 0) often = 0.5;
					// if random is > % show dialogue
					if (r > often)
						Dialogue.showData(Dialogue.getData({
							"category": "random",
							subcategory: "greeting"
						}), {
							addIfInProcess: false,
							instant: true
						});
				}

			} else if (interaction === 'mouseleave') {
				if (DEBUG) console.log("%c   Tally.interactionHandler()", tallyConsoleIcon, interaction);

				// update progress
				if (Progress.update("mouseLeaveTally", 1, "+") < 3) {
					if (Progress.get("clickTallyDouble") < 1)
						Dialogue.showStr("Double click me to see a menu!", "happy");
				}

			}

			// do allow dragging though
			else if (interaction === 'dragstart') {
				if (DEBUG) console.log("%c   Tally.interactionHandler()", tallyConsoleIcon, interaction);
				if (!dragging) {
					Dialogue.showData(Dialogue.getData({
						"category": "tally",
						subcategory: "drag"
					}), {
						addIfInProcess: false,
						instant: true
					});
					dragging = true;
				}
			} else if (interaction === 'drag') {
				// called repeately
			} else if (interaction === 'dragstop') {
				if (DEBUG) console.log("%c   Tally.interactionHandler()", tallyConsoleIcon, interaction);
				// reset flag
				dragging = false;
				// update progress
				Progress.update("dragTally", 1, "+");
				// tell them more
				if (Progress.update("toldToClickDouble", 1, "+") < 1)
					Dialogue.showStr("Double click me!", "happy");
				else if (Progress.get("clickTallyDouble") < 1)
					Dialogue.showStr("Double click me to see a menu!", "happy");
			}

		} catch (err) {
			console.error(err);
		}
	}








	/*  TALLY MULTI CLICK SYSTEM
	 *****************************************************************************/

	let clickTimer = 0,
		clickTimerMax = 220,
		clickCount = 0,
		clickCountMax = 5,
		clickInterval = null,
		clickIntervalTime = 10;
	// listener
	$(document).on('click', '#tally_body, .tally_disguise', function() {
		try {
			// allow offline
			if (Page.mode().notActive) return;
			// don't allow if mode disabled or stealth
			if (tally_options.gameMode === "disabled" || tally_options.gameMode === "stealth") return;

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
		} catch (err) {
			console.error(err);
		}
	});
	// multiclick count down
	function multiclickCountdown() {
		try {
			// console.log("multiclickCountdown() clickCount=" + clickCount + "/" + clickCountMax, clickTimer + "/" + clickTimerMax);
			// increase time
			clickTimer += clickIntervalTime;
			// time has run out so reset everything
			if (clickTimer >= clickTimerMax)
				multiclickReset();
		} catch (err) {
			console.error(err);
		}
	}
	// multiclick reset
	function multiclickReset() {
		try {
			multiclickAction();
			clickCount = 0;
			clickTimer = 0;
			clearInterval(clickInterval);
		} catch (err) {
			console.error(err);
		}
	}
	// multiclick action
	function multiclickAction() {
		try {
			if (clickCount <= 0) return;

			// if server online but no token then show prompt
			if (Page.mode().noToken && window.tallyTokenPrompt < 10) {
				window.tallyTokenPrompt++;
				Dialogue.showStr(Token.returnPrompt(), "sad");
				return;
			}

			// ONE CLICK
			if (clickCount === 1) {
				// if dialogue open let them click through it
				// Dialogue.skipToNext();


				// Item.showManager();

				// tests
				// Disguise.randomizer(false);

				Skin.random();
				Dialogue.test();
				// Dialogue.showData(Dialogue.getData({ "category": "random", subcategory: "greeting" }), {});
				//Dialogue.random();




				// update progress
				if (Progress.update("clickTallySingle", 1, "+") < 1)
					// tell them more
					if (Progress.update("toldToClickDouble", 1, "+") < 1)
						Dialogue.showStr("Double click me!", "happy");
					else
						Dialogue.showStr("Double click me to see a menu!", "happy");
			}
			// TWO CLICKS
			else if (clickCount === 2) {
				// update progress
				Progress.update("clickTallyDouble", 1, "+");
				// build string and show
				let str = "Want to hear <a class='tally tally_showStory1'>my story</a>,<br>" +
					" see a <a class='tally tally_showTutorial1'>game tutorial</a>,<br> " +
					"or view <a class='tally' id='tally_showMoreOptions'>options</a>?";
				Dialogue.showData({
					"text": str,
					"mood": "happy"
				}, {
					instant: true
				});
			}
			// THREE CLICKS
			else if (clickCount === 3) {
				// update progress
				Progress.update("clickTallyTriple", 1, "+");
				Dialogue.showData({
					"text": "A triple click!",
					"mood": "happy"
				}, {
					instant: true
				});
			}
			// FOUR CLICKS
			else if (clickCount === 4) {
				// update progress
				Progress.update("clickTallyQuadruple", 1, "+");
				// (if admin) show developer options
				showDevOptions();
			}
		} catch (err) {
			console.error(err);
		}
	}





	/*  TALLY OPTIONS MENU
	 *****************************************************************************/

	// MENU ITEM LISTENERS
	$(document).on('click', '.tally_showStory1', function() {
		Tutorial.play("story1");
	});
	$(document).on('click', '.tally_showTutorial1', function() {
		Tutorial.play("tutorial1");
	});
	$(document).on('click', '#tally_showMoreOptions', function() {
		showMoreOptions();
	});


	let moreOptionListenersAdded = false;

	function showMoreOptions() {
		try {
			if (tally_user.admin <= 0) return;

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
			Dialogue.showData({
				"text": str,
				"mood": "happy"
			}, {
				instant: true
			});

			if (moreOptionListenersAdded) return;
			moreOptionListenersAdded = true;


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
			$(document).on('click', '#tally_howToPlay', function() {
				window.open(tally_meta.website + "/how-to-play");
			});
			$(document).on('click', '#tally_gameTrailerBtn', function() {
				window.open("https://www.youtube.com/watch?v=xfsbm1cI2uo");
			});

			// nerd out
			$(document).on('click', '#tally_privacyPolicy', function() {
				window.open(tally_meta.website + "/privacy");
			});
			$(document).on('click', '#tally_betaTestSurvey', function() {
				window.open("https://docs.google.com/forms/d/e/1FAIpQLSeGx8zsF4aMQZH1eM0SzOvcpXijt8Bem1pzg4eni9eK8Jr-Lg/viewform");
			});

		} catch (err) {
			console.error(err);
		}
	}







	/*  DEV OPTIONS
	 *****************************************************************************/

	let devOptionListenersAdded = false;

	function showDevOptions() {
		try {
			if (tally_user.admin <= 0) return;

			let str = "Dev options: <br>" +
				"Monster: <a class='tally' id='tally_testNearbyMonster'>test</a>; " +
				"Battle: <a class='tally' id='tally_battleStart'>start</a>;<br>" +
				"Rumble: <a class='tally' id='tally_battleRumbleSmall'>sm</a>, " +
				"<a class='tally' id='tally_battleRumbleMedium'>md</a>, " +
				"<a class='tally' id='tally_battleRumbleLarge'>lg</a>, " +
				"<a class='tally' id='tally_explodePage'>explode</a>;<br>" +

				"Dialogue: <a class='tally' id='tally_randomDialogue'>random</a> " +
				"<a class='tally' id='tally_randomConversation'>conversation</a>; " +

				"Skin: <a class='tally' id='tally_randomSkin'>random</a>" +
				"";
			Dialogue.showData({
				"text": str,
				"mood": "happy"
			}, {
				instant: true
			});

			if (devOptionListenersAdded) return;
			devOptionListenersAdded = true;

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
			$(document).on('click', '#tally_explodePage', function() {
				Effect.explode();
			});

			$(document).on('click', '#tally_randomDialogue', function() {
				Dialogue.random();
			});
			$(document).on('click', '#tally_randomConversation', function() {
				Dialogue.test();
			});

			$(document).on('click', '#tally_randomSkin', function() {
				Skin.random();
			});

		} catch (err) {
			console.error(err);
		}
	}




	// PUBLIC
	return {
		moveEye: moveEye,
		setFollowCursor: setFollowCursor,
		stare: stare,
		addCharacter: addCharacter,
		tallyConsoleIcon: tallyConsoleIcon

	};

})();
