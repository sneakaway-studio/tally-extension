"use strict";

/*  TALLY
 ******************************************************************************/

window.Tally = (function () {
	// PRIVATE
	let DEBUG = Debug.ALL.Tally,
		followCursor = false, // is eye following currently active? on page load, no
		tallyMenuOpen = false,
		draggedOnce = false; // have we dragged once on this page load?


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
			if (Page.data.mode.notActive) return;
			// don't allow if mode disabled or stealth
			if (T.tally_options.gameMode === "disabled" || T.tally_options.gameMode === "stealth") return;

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
			setTimeout(function () {
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
			if (Page.data.mode.notActive) return;
			// don't allow if mode disabled or stealth
			if (T.tally_options.gameMode === "disabled" || T.tally_options.gameMode === "stealth") return;

			if (DEBUG) console.log("%c   Tally.addCharacter()", Debug.tallyConsoleIcon);

			// only show Tally if game mode == full
			if (!prop(T.tally_options) || !T.tally_options.showTally) return;

			// maybe temp...
			//Skin.preload(); // don't need now, replacing with svg

			$(document).on("mousemove", function (event) {
				Tally.setFollowCursor(true);
				Tally.moveEye(".tally_eye_left", "mouse", event);
				Tally.moveEye(".tally_eye_right", "mouse", event);
			});

			let str =
				"<div class='tally draggable' id='tally_character'>" + // style='transform:translateY(-350px);'
				"<div class='tally tally_speech_bubble' id='tally_dialogue_outer'>" +
				"<div class='tally tally_dialogue_skipToNext'></div>" +
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
				drag: function () {},
				stop: function () {}
			});

			$(document).on("click", ".tally_dialogue_skipToNext", function () {
				// if dialogue open let them click through it
				Dialogue.skipToNext();
			});

			if (DEBUG) console.log("%c   Tally.addCharacter()", Debug.tallyConsoleIcon, T.tally_user, T.tally_options, Page.data.mode);

			// do not allow unless fully active
			if (!Page.data.mode.active) return;

			// for domains that rewrite body, add listener to add Tally back if removed
			if (Page.data.domain == "baidu.com") {
				onRemove(document.getElementById('tally_click_visual'), reloadIfRemoved);
			}
		} catch (err) {
			console.error(err);
		}
	}


	/**
	 *	Add Tally's stats'
	 */
	function addStats() {
		try {
			if (DEBUG) console.log("%c   Tally.addStats()", Debug.tallyConsoleIcon, "T.tally_stats =", T.tally_stats);

			// if stats is empty (game just installed)
			if (FS_Object.isEmpty(T.tally_stats)) {
				if (DEBUG) console.warn("%c   Tally.addStats() T.tally_stats EMPTY");
				Stats.reset("tally");
			} else Stats.set("tally", T.tally_stats); // store data


			// insert SVG, stats table
			$('.tally_stats').css({
				"display": "block"
			});
			$('.tally_stats_bars').html(StatsDisplay.returnInitialSVG("tally"));
			$('.tally_stats_table').html(StatsDisplay.returnFullTable("tally"));

			// show / hide stats on click
			$('.tally_stats').on("click", function (e) {
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
			const observer = new MutationObserver(function () {
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

	// MOUSEENTER | MOUSELEAVE
	$(document).on('mouseenter', '#tally_character_inner', function () {
		interactionHandler('mouseenter');
	});
	$(document).on('mouseleave', '#tally_character_inner', function () {
		interactionHandler('mouseleave');
	});

	// ON DRAG START | DRAG | DRAG STOP
	let dragging = false;
	$(document).on('dragstart', '#tally_character', function () {
		interactionHandler('dragstart');
	});
	$(document).on('drag', '#tally_character', function () {
		// interactionHandler('drag'); // fires too often
	});
	$(document).on('dragstop', '#tally_character', function () {
		interactionHandler('dragstop');
	});




	/**
	 *	Generic handler to route | stop | color all interaction
	 */
	function interactionHandler(interaction) {
		try {
			// allow offline
			if (Page.data.mode.notActive) return;
			// don't allow if mode disabled
			if (T.tally_options.gameMode === "disabled") return;

			// MOUSE ENTER ( NOT LOGGED-IN VERSION )
			// if mode !== active - AND - server online - AND - they aren't logged in then show prompt
			if (!Page.data.mode.active && Page.data.mode.serverOnline && !Page.data.mode.loggedIn) {
				if (interaction === 'mouseenter') {
					Account.playLoginPrompt();
				}
				return;
			}
			// ELSE CONTINUE...


			if (DEBUG) console.log("%c   Tally.interactionHandler()", Debug.tallyConsoleIcon,
				"interaction =", interaction,
				"Tutorial.sequenceActive =", Tutorial.sequenceActive);

			// don't allow tally interactions to happen when global tutorial sequence running
			if (Tutorial.sequenceActive) return;


			// MOUSE ENTER
			if (interaction === 'mouseenter') {
				if (DEBUG) console.log("%c   Tally.interactionHandler()", Debug.tallyConsoleIcon, interaction);

				// the first time
				if (Progress.update("mouseEnterTally", 1, "+") < 20 || Math.random() > 0.9) {
					// tell them a tip
					Dialogue.showData(Dialogue.getData({
						category: "random",
						subcategory: "tip"
					}), {
						addIfInProcess: false,
						instant: true
					});
				} else {

					let // % chance any dialog will show
						chance = Math.random(),
						// which dialogue will show
						which = Math.random();

					// check/update progress, after the first time then only show half the time
					if (Progress.get("mouseEnterTally") > 0) {
						if (which < 0.5) chance = true;
						else chance = false;
					}

					// if wearing a disguise then say something about it
					if (chance && which < 0.25 && FS_Object.objLength(T.tally_user.disguises)) {
						Dialogue.showData(Dialogue.getData({
							"category": "disguise",
							subcategory: Disguise.currentDisguiseObj.name
						}), {
							addIfInProcess: false,
							instant: true
						});
					} else if (chance && which < 0.5) {
						Dialogue.showData(Dialogue.getData({
							"category": "random",
							subcategory: "conversation"
						}), {
							addIfInProcess: false,
							instant: true
						});
					}

				}

			} else if (interaction === 'mouseleave') {
				if (DEBUG) console.log("%c   Tally.interactionHandler()", Debug.tallyConsoleIcon, interaction);

				// update progress
				if (Progress.update("mouseLeaveTally", 1, "+") < 3) {
					if (Progress.get("clickTallyDouble") < 1)
						Dialogue.showStr("Double click me to see a menu!", "happy");
				}

			}

			// do allow dragging though
			else if (interaction === 'dragstart') {
				if (DEBUG) console.log("%c   Tally.interactionHandler()", Debug.tallyConsoleIcon, interaction);
				if (!dragging) {
					if (!draggedOnce) {
						Dialogue.showData(Dialogue.getData({
							"category": "tally",
							subcategory: "drag"
						}), {
							addIfInProcess: false,
							instant: true
						});
						draggedOnce = true;
					}
					dragging = true;
				}
			} else if (interaction === 'drag') {
				// called repeately
			} else if (interaction === 'dragstop') {
				if (DEBUG) console.log("%c   Tally.interactionHandler()", Debug.tallyConsoleIcon, interaction);
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
	$(document).on('click', '#tally_body, .tally_disguise', function () {
		try {
			// allow offline
			if (Page.data.mode.notActive) return;
			// don't allow if mode disabled or stealth
			if (T.tally_options.gameMode === "disabled" || T.tally_options.gameMode === "stealth") return;

			// if mode !== active - AND - server online - AND - they aren't logged in then show prompt
			if (!Page.data.mode.active && Page.data.mode.serverOnline && !Page.data.mode.loggedIn) {
				Account.playLoginPrompt();
				return;
			}

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

			// ONE CLICK
			if (clickCount === 1) {

				// initiate a disguise
				let disguiseCount = FS_Object.objLength(T.tally_user.disguises);

				if (disguiseCount < 1) {
					Dialogue.showStr("We need to beat monsters to earn disguises.", "sad");
				} else if (disguiseCount === 1) {
					Dialogue.showStr("We only have one disguise.", "sad");
					Disguise.selector(false);
				} else if (disguiseCount === 2) {
					if (Progress.update("toldToBeatMonstersForDisguises", 1, "+") < 1)
						Dialogue.showStr("Beat monsters to earn more disguises!", "neutral");
					Disguise.selector(true);
				} else if (disguiseCount >= 3) {
					if (Progress.update("toldToBeatMonstersForDisguises", 1, "+") < 2)
						Dialogue.showStr("Like my new disguise?", "question");
					Disguise.selector(true);
				}



				// in-progress
				// Item.showManager();

				// tests
				// Skin.random();
				// Dialogue.test();
				// Dialogue.random();


				// don't allow when global tutorial sequence running
				if (!Tutorial.sequenceActive)
					Dialogue.showData(Dialogue.getData({
						"category": "random",
						subcategory: "conversation"
					}), {
						addIfInProcess: false,
						instant: true
					});


				// update progress
				if (Progress.update("clickTallySingle", 1, "+") < 5 && Math.random() > 0.8) {
					// tell them more
					if (Progress.update("toldToClickDouble", 1, "+") < 1)
						Dialogue.showStr("Double click me!", "happy");
					else
						Dialogue.showStr("Double click me to see a menu!", "happy");
				}
			}
			// TWO CLICKS - ALWAYS SHOW MENU
			else if (clickCount === 2) {
				// always reset any sequence
				Tutorial.sequenceActive = false;
				// update progress
				Progress.update("clickTallyDouble", 1, "+");
				// build string and show
				let str = "Want to hear <a class='tally tally_showStory1'>my story</a>,<br>" +
					" see a <a class='tally' href='https://youtu.be/RKvw50V02hs' target='_blank'>tutorial</a>,<br>" +
					"or <a class='tally tally_showMoreOptions'>something else</a>?";
				Dialogue.showData({
					"text": str,
					"mood": "happy"
				}, {
					instant: true
				});
			}
			// THREE CLICKS - JOKING TIME
			else if (clickCount === 3) {
				// update progress
				Progress.update("clickTallyTriple", 1, "+");
				Dialogue.showData(Dialogue.getData({
					category: "tally",
					subcategory: "triple-click"
				}), {
					instant: true
				});
				// pick a random joke
				Dialogue.showData(Dialogue.getData({
					category: "joke",
					subcategory: "jokePrompt"
				}), {
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
	$(document).on('click', '.tally_showStory1', function () {
		Tutorial.play("tutorial", "story1");
	});
	$(document).on('click', '.tally_showTutorial1', function () {
		Tutorial.play("tutorial", "tutorial1");
	});
	$(document).on('click', '.tally_showMoreOptions', function () {
		// disabled - troubled getting this to work
		// TallyMain.openPopup();
		showMoreOptions();
	});


	let moreOptionListenersAdded = false;

	function showMoreOptions() {
		try {
			if (T.tally_user.admin <= 0) return;

			let str = "" +
				// user-specific
				"Do you want to view your <a class='tally tally_profile_link'>profile</a> or " +
				"<a class='tally' id='tally_dashboard'>dashboard</a>, " +
				"or see the <a class='tally' id='tally_leaderboard'>leaderboards</a>? " +
				"";
			Dialogue.showData({
				"text": str,
				"mood": "question"
			}, {
				instant: true
			});

			str = "Check out the <a class='tally' id='tally_howToPlay'>How to Play</a>, " +
				"or <a class='tally' id='tally_faq'>FAQ</a> pages, " +
				"or watch the <a class='tally' id='tally_gameTrailerBtn'>game trailer</a>? ";
			Dialogue.showData({
				"text": str,
				"mood": "question"
			}, {
				instant: false
			});

			str = 'Have <a target="_blank" href="https://docs.google.com/forms/d/e/1FAIpQLSdhftpXZHrnU1RXZ-yQ0LZovCp84ShZEicZpy__mOt621-Q2w/viewform">feedback</a> or ' +
				'<a target="_blank" href="https://docs.google.com/forms/d/e/1FAIpQLScUG923UhVtFWzLaV5gOsd0e1grdS9iKeNLjdwPixKEJkn4bQ/viewform">find an issue</a>?';
			Dialogue.showData({
				"text": str,
				"mood": "question"
			}, {
				instant: false
			});

			if (moreOptionListenersAdded) return;
			moreOptionListenersAdded = true;


			/**
			 *	Listeners for options menu
			 *	- Placed outside of functions so they are only added once.
			 */

			// launch profile
			$(document).on('click', '.tally_profile_link', function () {
				window.open(T.tally_meta.website + "/profile/" + T.tally_user.username);
			});
			$(document).on('click', '#tally_dashboard', function () {
				window.open(T.tally_meta.website + "/dashboard");
			});
			$(document).on('click', '#tally_leaderboard', function () {
				window.open(T.tally_meta.website + "/leaderboards");
			});

			// web pages
			$(document).on('click', '#tally_howToPlay', function () {
				window.open(T.tally_meta.website + "/how-to-play");
			});
			$(document).on('click', '#tally_faq', function () {
				window.open(T.tally_meta.website + "/faq");
			});
			$(document).on('click', '#tally_gameTrailerBtn', function () {
				window.open("https://www.youtube.com/watch?v=hBfq8TNHbCE");
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
			if (T.tally_user.admin <= 0) return;

			let str = "Dev options: <br>" +
				"Monster: <a class='tally' id='tally_testNearbyMonster'>test</a>; " +
				"Battle: <a class='tally' id='tally_battleStart'>start</a>;<br>" +
				"Rumble: <a class='tally' id='tally_battleRumbleSmall'>sm</a>, " +
				"<a class='tally' id='tally_battleRumbleMedium'>md</a>, " +
				"<a class='tally' id='tally_battleRumbleLarge'>lg</a>, " +
				"<a class='tally' id='tally_explodePage'>explode</a>;<br>" +

				"Dialogue: <a class='tally' id='tally_randomDialogue'>random</a> " +
				"<a class='tally' id='tally_random'>greeting</a>; " +

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

			$(document).on('click', '#tally_testNearbyMonster', function () {
				Monster.test(); // launch one of the nearby monsters
			});
			$(document).on('click', '#tally_battleStart', function () {
				Battle.test();
			});
			$(document).on('click', '#tally_battleRumbleSmall', function () {
				BattleEffect.showRumble("small");
			});
			$(document).on('click', '#tally_battleRumbleMedium', function () {
				BattleEffect.showRumble("medium");
			});
			$(document).on('click', '#tally_battleRumbleLarge', function () {
				BattleEffect.showRumble("large");
			});
			$(document).on('click', '#tally_explodePage', function () {
				Effect.explode();
			});

			$(document).on('click', '#tally_randomDialogue', function () {
				Dialogue.random();
			});
			$(document).on('click', '#tally_random', function () {
				Dialogue.test();
			});

			$(document).on('click', '#tally_randomSkin', function () {
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
		addStats: addStats
	};

})();
