"use strict";

/*  (BATTLE) CONSOLE
 ******************************************************************************/

window.BattleConsole = (function() {
	// PRIVATE
	let DEBUG = Debug.ALL.BattleConsole,
		logId, _active, _queue, _next,
		randomAttackDefense = "";

	// reset all vars
	function reset() {
		_next = "";
		logId = 0;
		_active = false;
		_queue = [];
	}


	// display the console
	function display() {
		try {
			reset();

			// display console
			var str = "<div class='tally shadow-box-inner' id='battle-console-inner'>" +
				"<div class='tally' id='battle-console-stream'></div>" +
				"</div>";
			$("#battle-console").html(str);
			$("#battle-console").css({
				"display": "block",
				"top": window.innerHeight + "px" // hide it just below
			});
			// display ground
			$('#battle-ground').html(FS_Object.randomArrayIndex(battleGrounds));
			Core.showElement('#battle-ground');
			$("#battle-ground").css({
				"display": "block",
				"top": window.innerHeight + "px" // hide it just below
			});
			// move them into position
			var timeline = anime.timeline({
				easing: 'easeOutCubic',
				duration: 750,
				elasticity: 0,
			});
			timeline.add({
				targets: '#battle-ground',
				top: "65%",
			}).add({
				targets: '#battle-console',
				top: "73%",
			}, '-=600'); // after .6 seconds
		} catch (err) {
			console.error(err);
		}
	}
	// hide the console
	function hide() {
		try {
			anime({
				targets: '#battle-console',
				top: "130%",
				elasticity: 0,
				duration: 1000,
				easing: 'easeOutCubic'
			});
			anime({
				targets: '#battle-ground',
				top: "130%",
				elasticity: 0,
				duration: 1000,
				easing: 'easeOutCubic'
			});
		} catch (err) {
			console.error(err);
		}
	}

	// log to the console
	function log(_str, next = "") {
		try {
			// if (DEBUG) console.log("🖥️ BattleConsole.log() [1]",
			// 	"_str =", _str, "next =", next,
			// 	"_active =", _active,
			// 	"Battle.active =", Battle.active
			// );
			if (!Battle.active) return;
			// add a "next" function
			if (next) _next = next;
			// add to end of _queue
			_queue.push(_str);
			// start/make sure queueChecker is running
			queueChecker();
			if (DEBUG) console.log("🖥️ BattleConsole.log() [2]", "_str =", _str, "next =", next, "_active =", _active);
		} catch (err) {
			console.error(err);
		}
	}

	function queueChecker() {
		try {
			// if (DEBUG) console.log("🖥️ BattleConsole.queueChecker() [1]", _queue, _active);
			// if no items in _queue then stop
			if (_queue.length < 1) {
				// start animating cursor
				$("#battle-console-stream:last-child:after").removeClass("noanimation");
				return;
			}
			// else, if not currently active then start a new one
			if (!_active) {
				writeNextInQueue();
				// stop animating cursor
				$("#battle-console-stream:last-child:after").addClass("noanimation");
			}
			// check again in a bit in case there are more
			setTimeout(function() {
				queueChecker();
			}, 200);
		} catch (err) {
			console.error(err);
		}
	}

	function writeNextInQueue(lineSpeed = 150) {
		try {
			// if currently active, stop
			if (_active) return;
			// else set active
			_active = true;
			// remove first element in array
			var str = _queue.shift();
			if (DEBUG) console.log("🖥️ BattleConsole.writeNextInQueue() [1] str =", str, "_queue =", _queue);
			// insert placeholder
			var ele = "<div class='tally tally_log_line'>" +
				"<span id='tally_log" + (++logId) + "' class='tally tally_log_cursor'></span>" +
				"</div>";
			$("#battle-console-stream").append(ele);
			// make sure it exists first
			if (!$('#battle-console-stream')[0]) return;
			// scroll to new placeholder
			$('#battle-console-stream').stop().animate({
				scrollTop: $('#battle-console-stream')[0].scrollHeight
			}, 800);
			// insert text
			setTimeout(function() {
				// log to console
				typeWriter("tally_log" + logId, str, 0);
			}, lineSpeed);
			if (DEBUG) console.log("🖥️ BattleConsole.writeNextInQueue() [2] str =", str, "_queue =", _queue);
		} catch (err) {
			console.error(err);
		}
	}
	// remove cursor
	function removeCursor() {
		$('#battle-console-prompt').remove();
	}

	function addCursor() {
		let str = "" +
			"<div class='tally' id='battle-console-prompt'>" +
			"<span class='tally' id='battle-console-cursor'></span>" +
			"<span class='tally' id='battle-console-prompt-content'></span>" +
			"</div>";
		$('#battle-console-stream').append(str);
	}

	function showBattleOptions(lineSpeed = 150) {
		try {
			if (DEBUG) console.log("🖥️ BattleConsole.showBattleOptions()", "[1] _active =", _active);

			// if currently active, stop
			if (_active) return;
			// set active
			_active = true;
			// get list of attacks
			var _attacks = {},
				ele = "";

			// reset tally's dialogue queue
			Dialogue.emptyTheQueue();

			if (DEBUG) console.log("🖥️ BattleConsole.showBattleOptions()", "[1.1]", "T.tally_user.attacks =", T.tally_user.attacks);
			// if no attacks are available
			// - error in game?
			// - player not logged-in?
			if (FS_Object.isEmpty(T.tally_user.attacks)) {
				if (DEBUG) console.log("🖥️ BattleConsole.showBattleOptions()", "[1.2]", "T.tally_user.attacks =", T.tally_user.attacks);
				// release active state
				_active = false;

				removeCursor();
				ele = "<div class='tally tally_log_line'><span id='tally_log" + (++logId) + "' class='tally tally_log_cursor'>" +
					"..." +
					"</span></div>";
				$("#battle-console-stream").append(ele);

				ele = "<div class='tally tally_log_line'><span id='tally_log" + (++logId) + "' class='tally tally_log_cursor'>" +
					"<span class='tally text-red'>ERROR: No attacks found in player data.</span>" +
					"</span></div>";
				$("#battle-console-stream").append(ele);

				ele = "<div class='tally tally_log_line'><span id='tally_log" + (++logId) + "' class='tally tally_log_cursor'>" +
					"<a href='https://tallysavestheinternet.com/get-tally'>Update your game version</a> (currently " + T.tally_meta.install.version +
					") and <a href='https://tallysavestheinternet.com/dashboard'>login to your dashboard</a> to make sure your game is connected." +
					"</span></div>";
				$("#battle-console-stream").append(ele);

				ele = "<div class='tally tally_log_line'><span id='tally_log" + (++logId) + "' class='tally tally_log_cursor'>" +
					"Press the [esc] button your keyboard to exit.";
				$("#battle-console-stream").append(ele);
				addCursor();

				return;
			} else {
				_attacks = T.tally_user.attacks;
			}
			if (DEBUG) console.log("🖥️ BattleConsole.showBattleOptions()", "[1.3]", "T.tally_user.attacks =", T.tally_user.attacks);


			// build options
			var str = "<div class='tally battle-options-row'>";
			for (var key in _attacks) {
				if (_attacks.hasOwnProperty(key)) {
					if (DEBUG) console.log("🖥️ BattleConsole.showBattleOptions()", "[2.1] key =", _attacks[key]);
					// only show selected ones
					if (!_attacks[key].selected) continue;

					let defenseOption = "";
					// if defense
					if (_attacks[key].type === "defense") {
						defenseOption = "battle-options-defense";
					}

					let title = _attacks[key].name + " [" + _attacks[key].category + " " + _attacks[key].type + "] ";
					if (_attacks[key].description) title += _attacks[key].description;

					str += "<span " +
						// " title='" + title + "' " +
						" data-attack='" + _attacks[key].name + "' " +
						" class='tally battle-options battle-options-fire " + defenseOption + " attack-" + _attacks[key].name + "'>" +
						"<span class='tally attack-icon attack-icon-" + _attacks[key].type + "' ></span>" +
						_attacks[key].name + "</span>";
				}
			}

			// should we display a random attack or defense?
			if (Math.random() > 0.5) randomAttackDefense = "attack";
			else randomAttackDefense = "defense";

			str += "<span class='tally battle-options battle-options-random battle-options-random-" + randomAttackDefense + "'>[?]</span>";

			str += "<span class='tally battle-options battle-options-esc'>[esc]</span>";
			str += "</div>";
			if (DEBUG) console.log("🖥️ BattleConsole.showBattleOptions()", "[2.2]", str, _queue, _active);

			// insert button
			ele = "<div class='tally tally_log_line'>" +
				"<span id='tally_log" + (++logId) + "' class='tally tally_log_cursor'>" + str + "</span>" + "</div>";
			removeCursor();
			$("#battle-console-stream").append(ele);
			addCursor();
			// add icons
			$(".attack-icon-attack").css({
				"background-image": 'url(' + chrome.extension.getURL('assets/img/battles/sword-pixel-13sq.png') + ')'
			});
			$(".attack-icon-defense").css({
				"background-image": 'url(' + chrome.extension.getURL('assets/img/battles/shield-pixel-13sq.png') + ')'
			});

			// first, remove listeners (from all)
			$(document).off("mouseenter mouseleave click", '.battle-options-fire');
			$(document).off("mouseenter mouseleave click", '.battle-options-random');
			$(document).off("mouseenter mouseleave click", '.battle-options-random-' + randomAttackDefense);
			$(document).off("mouseenter mouseleave click", '.battle-options-esc');


			// display attack description
			$(document).on("mouseenter", '.battle-options-fire', function() {
				let attackName = $(this).attr("data-attack");
				let str = attackName + " " + T.tally_user.attacks[attackName].type + "... ";
				// if description field contains string
				if (T.tally_user.attacks[attackName].description)
					str = T.tally_user.attacks[attackName].description;
				// if (DEBUG) console.log("🖥️ BattleConsole.showBattleOptions()", attackName, T.tally_user.attacks[attackName], str);
				setPromptText(str);
			});
			// add only one listener
			$(document).on("click", '.battle-options-fire', function() {
				if (DEBUG) console.log("🖥️ BattleConsole.showBattleOptions()", "CLICK CALLED, attack =", $(this).attr("data-attack"), Battle.details);
				// if user can't do attack yet but they clicked anyway
				if (Battle.details.attackInProgress) {
					showInfoAboutTurnBasedStrategy();
					return;
				} else {
					// disable battle options
					setBattleOptionsEnabled(false);
					// get attack name
					let attackName = $(this).attr("data-attack");
					if (DEBUG) console.log("🖥️ BattleConsole.showBattleOptions()", "attackName =", attackName, T.tally_user.attacks);
					BattleAttack.doAttack(T.tally_user.attacks[attackName], "tally", "monster");
				}
			});

			// RANDOM ATTACK / DEFENSE
			$(document)
				.on("click", '.battle-options-random', function() {
					if (DEBUG) console.log("🖥️ BattleConsole.showBattleOptions()", "CLICK CALLED, RANDOM ATTACK");
					// if user can't do attack yet but they clicked anyway
					if (Battle.details.attackInProgress) {
						showInfoAboutTurnBasedStrategy();
						return;
					} else {
						// disable battle options
						setBattleOptionsEnabled(false);
						// get random attack/defense each time
						let attacks = AttackData.returnRandomAttacks(1, [randomAttackDefense]);
						let attack = FS_Object.randomObjProperty(attacks);
						if (DEBUG) console.log("🖥️ BattleConsole.showBattleOptions() attack =", attack, "attackName =", attack.name, T.tally_user.attacks);
						BattleAttack.doAttack(attack, "tally", "monster");
					}
				})
				.on('mouseenter', '.battle-options-random', function() {
					setPromptText("Choose a random " + randomAttackDefense + "?");
				});

			// add "run" / "escape" listeners
			$(document)
				.on("click", '.battle-options-esc', function() {
					// empty queue of any leftover dialogue
					Dialogue.emptyTheQueue();
					// end battle
					Battle.end(true);
				})
				.on('mouseenter', '.battle-options-esc', function() {
					setPromptText("Run from this battle?");
				});

			// hide description for all
			$(document).on('mouseleave', '.battle-options-fire, .battle-options-esc, .battle-options-random', function() {
				setPromptText("");
			});

			// make sure console exists first
			if (!$('#battle-console-stream')[0]) return;
			// scroll to new placeholder
			$('#battle-console-stream').stop().animate({
				scrollTop: $('#battle-console-stream')[0].scrollHeight
			}, 700);
			// release active state
			_active = false;
		} catch (err) {
			console.error(err);
		}
	}




	function setBattleOptionsEnabled(state = false) {
		try {
			if (!state) {
				// remove listener (from all)
				$(document)
					.off("click", '.battle-options-fire')
					.off("click", '.battle-options-random')
					.off("click", '.battle-options-esc');
				// show .battle-options-fire disabled
				$('.battle-options-row').addClass("disabled");
			}
		} catch (err) {
			console.error(err);
		}
	}

	function setPromptText(str = "") {
		try {
			$("#battle-console-prompt-content").html(str);
		} catch (err) {
			console.error(err);
		}
	}

	function showInfoAboutTurnBasedStrategy() {
		try {
			let r = Math.random();
			if (r < 0.2)
				Dialogue.showStr("Hey, this is a turn based game. It's not your turn.", "neutral");
			else if (r < 0.4)
				Dialogue.showStr("Slow down speed racer.", "neutral");
			else if (r < 0.6)
				Dialogue.showStr("Wait your turn 😀", "neutral");
		} catch (err) {
			console.error(err);
		}
	}


	/**
	 *	Typewriter text effect for BattleConsole
	 */
	function typeWriter(ele, str = "", i = 0) {
		try {
			// allow offline
			if (Page.data.mode.notActive) return;
			// don't allow if mode disabled or stealth
			if (T.tally_options.gameMode === "disabled" || T.tally_options.gameMode === "stealth") return;
			// don't allow if ele doesn't exist or str or arr is empty
			if (!document.getElementById(ele) || str == "") return;

			let htmlOut = "",
				arr = returnTagsAsArray(str),
				arrLoop, // use function assignment instead of a function declaration
				strLoop; // so that functions are not hoisted to the top of scope

			if (DEBUG) console.log("🖥️ BattleConsole.typeWriter() [1]", ele, "str =", str,
				// "arr =",arr
			);

			// loop through arr element
			arrLoop = function(i, j, arr) {
				// if (DEBUG) console.log("typeWriter() -> arrLoop()", i, arr[i]);

				// if we haven't reached the end of the arr
				if (i < arr.length) {

					// loop through txt in arr element
					strLoop = function(i, j, arr) {
						let char = arr[i].charAt(j);
						// if (DEBUG) console.log("typeWriter() -> strLoop()", i, arr[i], j, char);

						// if character is not html
						if (char != "<") {
							// add it
							htmlOut += char;
							// if (DEBUG) console.log("a", i, j, htmlOut);
						} else {
							// otherwise add whole html ele
							htmlOut += arr[i];
							// if (DEBUG) console.log("b", i, j, htmlOut);
							// move to end
							j = 1000;
						}
						removeCursor();
						// update html
						$("#" + ele).html(htmlOut);
						addCursor();
						// if there is more left in string
						if (j < arr[i].length) {
							setTimeout(function() {
								// work on next character with slight pause
								strLoop(i, ++j, arr);
							}, 15);
						} else {
							setTimeout(function() {
								// work on next array with slight pause
								arrLoop(++i, 0, arr);
							}, 15);
							return;
						}
						// safety
						if (i > 300 || j > 300) return;
					};
					// call function, reset j
					strLoop(i, 0, arr);

					// another safety
					if (i > 300) return;
				} else {
					// if (DEBUG) console.log("typeWriter() -> END OF ARRAY");
					// color text
					lineComplete(ele);
					return;
				}
			};
			// call function, reset j
			arrLoop(i, 0, arr);



			// OLD METHOD, DOESN'T SUPPORT MULTIPLE ELEMENTS, FOR REFERENCE

			// // handle html in string
			// if (str.charAt(i) === "<") {
			// 	// capture it all
			// 	let code = str.match(/<span(.*?)<\/span>/g);
			// 	// remove from str
			// 	str = str.replace(/<span(.*?)<\/span>/g, '');
			// 	// display it all at once in page
			// 	$("#" + ele).html($("#" + ele).html() + code[0]);
			// }

		} catch (err) {
			console.error(err);
		}
	}


	// let str = "Model Toys monster lost <span class='text-blue'>16.2 health</span> and <span class='text-blue'>10.6 accuracy</span>!";
	// let arr = returnTagsAsArray(str);
	// console.log(arr)
	// let htmlOut = "";


	// // loop through array
	// for (let i = 0; i < arr.length; i++) {
	// 	// loop through txt in arr element
	// 	for (let j = 0; j < arr[i].length; j++) {
	// 		// if not html
	// 		if (arr[i].charAt(j) != "<") {
	// 			// add character
	// 			htmlOut += arr[i].charAt(j);
	// 			console.log("a", i, j, htmlOut)
	// 		} else {
	// 			// whole html ele
	// 			htmlOut += arr[i];
	// 			console.log("b", i, j, htmlOut)
	// 			break;
	// 		}
	// 	}
	// 	if (i > 300) break;
	// }



	function returnTagsAsArray(str) {
		try {
			// add a delimiter
			str = str
				.replace(/<span/g, '^<span')
				.replace(/\/span>/g, '\/span>^');
			// if (DEBUG) console.log("🖥️ BattleConsole.returnTagsAsArray()", "#####", str);
			// split on delimeter
			return str.split("^");
		} catch (err) {
			console.error(err);
		}
	}




	/**
	 *	Called after each line is complete
	 */
	function lineComplete(ele) {
		try {
			// add a little time at the end of each line
			setTimeout(function() {
				_active = false;
				// text is done writing so color it
				colorText(ele);
				if (DEBUG) console.log("🖥️ BattleConsole.lineComplete() [1]", ele, "setTimeout()");
				// if queue is empty and there is a next string
				if (_queue.length < 1 && _next != "") {
					if (DEBUG) console.log("🖥️ BattleConsole.lineComplete() [2]", ele, "_queue.length =", _queue.length);
					if (_next == "showBattleOptions") {
						if (DEBUG) console.log("🖥️ BattleConsole.lineComplete() [3]", ele, "_next =", _next);
						//if (DEBUG) console.log(_next);
						showBattleOptions();
					}
					_next = "";
				}
			}, 100);
		} catch (err) {
			console.error(err);
		}
	}

	function colorText(ele) {
		try {
			var str = $("#" + ele).html();
			if (str == undefined) return;
			//if (DEBUG) console.log(str);
			str = str.replace("Tally", "<span class='tally text-tally'>Tally</span>");
			str = str.replace(Battle.details.monsterName, "<span class='tally text-green'>" + Battle.details.monsterName + "</span>");
			// str = str.replace(Battle.details.recentAttack.name, "<span class='tally text-yellow'>" + Battle.details.recentAttack.name + "</span>");
			$("#" + ele).html(str);
		} catch (err) {
			console.error(err);
		}
	}



	let battleGrounds = [
		'<svg class="tally" id="shapes" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3200 726"><defs><style>.cls-3{fill:#6a6a6a}.cls-10,.cls-11,.cls-12,.cls-3,.cls-4,.cls-6,.cls-7,.cls-8{fill-rule:evenodd}.cls-4{fill:#565656}.cls-6{fill:#919191}.cls-7{fill:#868686}.cls-8{fill:#a0a0a0}.cls-10{fill:silver}.cls-11{fill:#a7a7a7}.cls-12{fill:#969696}</style><clipPath id="clip-path" transform="translate(0 -1074)"><path fill="none" d="M3234 1216l-184 107-208-8-263-104-205-8-194 41-168-12-129 62-105-87-199-24-59 128-169-84-229-14-242 65-131-51-286-10-264 85-56-45-184-38-146 754 1860 39 1669-114-108-682z"/></clipPath></defs><g clip-path="url(#clip-path)"><path class="cls-3" d="M3200 698.46L2867 565 1429 432H906L132 187 0 143.62V726h3200v-27.54z" id="Shape_23" data-name="Shape 23"/><path class="cls-4" d="M2688 478L1554 343h-291l-39 105-93 76 111 62 385 44 278 47 884-83-101-116z" id="Shape_19" data-name="Shape 19"/><path fill="#838383" fill-rule="evenodd" d="M2692 470l-1195-82-129 28-202 52 461 147 421-19 752-1-108-125z" id="Shape_21" data-name="Shape 21"/><path class="cls-6" d="M1558 392l-78 64 561 118 553-25-1036-157z" id="Shape_22" data-name="Shape 22"/><path class="cls-7" d="M947 229l-749 82 48 115 232 114 617-32 291-95-439-184z" id="Shape_20" data-name="Shape 20"/><path class="cls-4" d="M3053 635l-187-5 7.56 96h197.01L3053 635z" id="Shape_18" data-name="Shape 18"/><path class="cls-8" d="M2707.25 726h172.38l37.37-66-98-83-111.75 149z" id="Shape_17" data-name="Shape 17"/><path class="cls-3" d="M3200 639.27L3098.25 726H3200v-86.73z" id="Shape_16" data-name="Shape 16"/><path fill="#7f7f7f" fill-rule="evenodd" d="M3200 132.36L3087 194l113 354.32V132.36z" id="Shape_15" data-name="Shape 15"/><path class="cls-8" d="M3200 669.18V565.55L2633 102l-19 26-15 58 201 184 139 306 116.67 50h60.84l83.49-56.82z" id="Shape_13" data-name="Shape 13"/><path class="cls-10" d="M3200 537.37L3125 177l-504-52-10 16 589 424.95v-28.58z" id="Shape_14" data-name="Shape 14"/><path class="cls-11" d="M2840 403l-262-301L2071 0l-378 165-96 286 306 74 778 40 259 111-100-273z" id="Shape_12" data-name="Shape 12"/><path class="cls-10" d="M1792 38l-278 16-602 189 289 121 38 38 199 64 161-14 112-198 156-57-75-159z" id="Shape_11" data-name="Shape 11"/><path class="cls-11" d="M136 84L59 341l332 88 587-112 262 86 212-168 7-204L136 84z" id="Shape_9" data-name="Shape 9"/><path class="cls-10" d="M481 39l-57 67-16 271 145 7 464-116 349-169-885-60z" id="Shape_10" data-name="Shape 10"/><path class="cls-7" d="M30 664l64.27 62H347.1L400 571l-216 91-154 2z" id="Shape_8" data-name="Shape 8"/><path class="cls-6" d="M1163 556l87.18 170h256.44L1163 556z" id="Shape_7" data-name="Shape 7"/><path class="cls-10" d="M2408 250l-646 177 654-45 61-27-69-105z" id="Shape_6" data-name="Shape 6"/><path class="cls-12" d="M2558 279l-231 125 58 100 194-204h118l-139-21z" id="Shape_5" data-name="Shape 5"/><path class="cls-10" d="M2159 135l-183 6 88 56 108 4 67 46-80-112z" id="Shape_4" data-name="Shape 4"/><path class="cls-12" d="M1403 110l7 107-239 70 281-53 64-102-113-22z" id="Shape_3" data-name="Shape 3"/><path fill="#a4a4a4" fill-rule="evenodd" d="M448 91l39 178 299-140-338-38z" id="Shape_2" data-name="Shape 2"/><path fill="#434343" fill-rule="evenodd" d="M172 137L41 117l80 114-3 41 54-135z" id="Shape_1" data-name="Shape 1"/></g></svg>',

		'<svg class="tally" id="shapes" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3200 863"><defs><style>.cls-19,.cls-23,.cls-6,.cls-9{fill-rule:evenodd}.cls-6{fill:#616161}.cls-9{fill:#8b8b8b}.cls-19{fill:#a4a4a4}.cls-23{fill:#b7b7b7}</style><clipPath id="clip-path" transform="translate(0 -937)"><path fill="none" d="M3268 1199l-426 21-100 18-225-46-241-6-75 62-79-8-259.15 30.86-156.02-21.01L1547 1253l-97.9-109.42-76.5 21-110.99-14.5L1216 1196l-184.24-6.15-156.01 45-114.01-57L621 1178l-167-119-118 42-73 2-187 42-100-11-82 872 3467-11-93-796z"/></clipPath></defs><g clip-path="url(#clip-path)"><path fill-rule="evenodd" fill="#888" d="M3200 336.52L2853 380l-796 221-555-16-650-145 47 134 237.26 289H3200V336.52z" id="Shape_28" data-name="Shape 28"/><path fill="#767676" fill-rule="evenodd" d="M2571 442l-525-125-614-14 515 308v45l-319 83 207 3 768-181-32-119z" id="Shape_27" data-name="Shape 27"/><path fill="#909090" fill-rule="evenodd" d="M1599 624l-244 123 124 3 163-11 85-26-128-89z" id="Shape_26" data-name="Shape 26"/><path class="cls-6" d="M2235 405l173 189 214-147-387-42z" id="Shape_25" data-name="Shape 25"/><path fill="#4e4e4e" fill-rule="evenodd" d="M3200 228.73L2770 227l-105 116 264 35 271-119.46v-29.81z" id="Shape_24" data-name="Shape 24"/><path fill="#5d5d5d" fill-rule="evenodd" d="M2649 180l-341-20 102 175 360 4-121-159z" id="Shape_23" data-name="Shape 23"/><path class="cls-9" d="M2101 270l-239 191 331-61-92-130z" id="Shape_21" data-name="Shape 21"/><path class="cls-9" d="M2345 179l-221 103 47 82 250-60-76-125z" id="Shape_22" data-name="Shape 22"/><path class="cls-6" d="M2231 411l185 181 164-119-349-62z" id="Shape_20" data-name="Shape 20"/><path class="cls-9" d="M1761 1417l87-18s-147.26-222.48-316-323c-125.14-74.54-285-35-285-35l-107 174-30 63 209 127 407 246 220-51 20-52z" transform="translate(0 -937)" id="Shape_14" data-name="Shape 14"/><path fill="#6d6d6d" fill-rule="evenodd" d="M3200 243.02L2927 357l178 30 79 177-475 125 186-98-532 156 433 54 404-39.25V243.02z" id="Shape_19" data-name="Shape 19"/><path fill="#9e9e9e" fill-rule="evenodd" d="M1094 541l37 111 196 98 127-9 167-56 27-36-554-108z" id="Shape_17" data-name="Shape 17"/><path fill="#989898" fill-rule="evenodd" d="M2183 344l-69-85-1 23 45 135 381 78-648.08 368h36.66L2491 617l340-77 306-171-717-71-237 46z" id="Shape_18" data-name="Shape 18"/><path fill="#696969" fill-rule="evenodd" d="M1546 234l-68-20 58 185 87-119-77-46z" id="Shape_16" data-name="Shape 16"/><path fill="#b1b1b1" fill-rule="evenodd" d="M1279 159l56 88 11-135-67 47z" id="Shape_15" data-name="Shape 15"/><path fill="#bebebe" fill-rule="evenodd" d="M661 549l-5 6 143 140 107-66 33-75-278-5z" id="Shape_13" data-name="Shape 13"/><path fill="#9a9a9a" fill-rule="evenodd" d="M965 499L830 641l-167 30L0 648.54V863h1363.31L1084 663l182-291-301 127z" id="Shape_12" data-name="Shape 12"/><path fill="#818181" fill-rule="evenodd" d="M981 764l-538-14-177-43-18-77-146-3-54 130-48 37.28V863h1045.4L981 764z" id="Shape_11" data-name="Shape 11"/><path fill="#777" fill-rule="evenodd" d="M961 786l-283 67-251-53-208-111 23.41 174h805.5L961 786z" id="Shape_10" data-name="Shape 10"/><path class="cls-19" d="M359 458l-199-67L0 476.89v202.2L178 712l324-16 255 22 14-67-63-84-349-109z" id="Shape_9" data-name="Shape 9"/><path fill="#a1a1a1" fill-rule="evenodd" d="M176 449l-40 33 462 140 307-56-729-117z" id="Shape_8" data-name="Shape 8"/><path fill="#969696" fill-rule="evenodd" d="M0 359.78v119.91L137 412l84-70-162-20-59 37.78z" id="Shape_7" data-name="Shape 7"/><path class="cls-19" d="M1422 359l-27-90-350-72L451 0l-38 23-78 534 555 9 214 44 428-143-110-108z" id="Shape_4" data-name="Shape 4"/><path fill="#acacac" fill-rule="evenodd" d="M1726 714l-50-155-471-311 59 121-181 296 408 168-352-235 587 116z" id="Shape_5" data-name="Shape 5"/><path class="cls-23" d="M1392 326l-123 101 175 216-52-317z" id="Shape_6" data-name="Shape 6"/><path fill="#8d8d8d" fill-rule="evenodd" d="M442 35L0 264.15v112.12L61 327l126 20-25 45 313 142-71-123 38-376z" id="Shape_3" data-name="Shape 3"/><path fill="#bababa" fill-rule="evenodd" d="M0 299.83L190 191l8-97L0 139.83v160z" id="Shape_1" data-name="Shape 1"/><path fill="#b3b3b3" fill-rule="evenodd" d="M494 107l-26 241 147-64 14-168-135-9z" id="Shape_2" data-name="Shape 2"/><path class="cls-23" d="M2870 488l-213 16 178 37 265-152-230 99z" id="Shape_30" data-name="Shape 30"/></g></svg>',

		'<svg class="tally" id="shapes" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3200 943"><defs><style>.cls-12,.cls-13,.cls-14,.cls-15,.cls-16,.cls-23,.cls-7,.cls-9{fill-rule:evenodd}.cls-7{fill:#525252}.cls-9{fill:#696969}.cls-12{fill:gray}.cls-13{fill:#5c5c5c}.cls-14{fill:#a9a9a9}.cls-15{fill:#9e9e9e}.cls-16{fill:#797979}.cls-23{fill:#b3b3b3}</style><clipPath id="clip-path" transform="translate(0 -857)"><path fill="none" d="M3254 1267l-212-63-264.06 36.85-240.03 27.01L2366 1334l-164.12-3.14L2050 1276l-156 16-218-40-176 44-268-68-368-16-164-68-332 28-248 84-168 4-208 55-607 943 1598 27 2915-145-396-873z"/></clipPath></defs><g clip-path="url(#clip-path)"><path fill-rule="evenodd" fill="#666" d="M327 248l70 490 45.26 205h1380.95L1992 685l-915-292-750-145z" id="Shape_30" data-name="Shape 30"/><path fill="#858585" fill-rule="evenodd" d="M0 836.04V943h467.67L497 845l-94-57L0 836.04z" id="Shape_29" data-name="Shape 29"/><path fill="#929292" fill-rule="evenodd" d="M433 288L0 492.82v424.89L168 837l384 13-23-256-96-306z" id="Shape_28" data-name="Shape 28"/><path fill="#909090" fill-rule="evenodd" d="M0 768.53v145.19L168 836l223 1-248-76-143 7.53z" id="Shape_27" data-name="Shape 27"/><path class="cls-7" d="M1644 742l-68 113-307 87 6.54 1h110.8L1575 873l-8 35 94-79 207-160-123-64-101 137z" id="Shape_25" data-name="Shape 25"/><path class="cls-7" d="M733 483l247 299 153-16-400-283z" id="Shape_26" data-name="Shape 26"/><path fill="#878787" fill-rule="evenodd" d="M323 0l73 286 672 411 540 155 155-188 133 54-50 73 19 94 18.99 58h448.29L2409 431l71-191L1260 22 323 0z" id="Shape_24" data-name="Shape 24"/><path class="cls-9" d="M2328 925l-19.37 18h408.39L2842 475l-165-16-349 466z" id="Shape_22" data-name="Shape 22"/><path fill="#636363" fill-rule="evenodd" d="M2377 345l-54 112 5 238-7 238 307-290 30-281-281-17z" id="Shape_21" data-name="Shape 21"/><path fill="#5b5b5b" fill-rule="evenodd" d="M2765 591l-30-97-42-35-203 80-164 155 274-94-281 334 446-343z" id="Shape_20" data-name="Shape 20"/><path class="cls-9" d="M3200 943V769.54L3158 782l-339-52-316.67 213H3200z" id="Shape_19" data-name="Shape 19"/><path class="cls-12" d="M2728 875l9-72 428-453-148-121-287 65-174 55 65 148 169 30-232 378 483-7 69-48-81 35-301-10z" id="Shape_18" data-name="Shape 18"/><path class="cls-13" d="M3200 943v-90.12L3168 870l-116 48-263.37 25H3200z" id="Shape_17" data-name="Shape 17"/><path class="cls-13" d="M3200 313.96L3099 247l39 187 62 33.26v-153.3z" id="Shape_16" data-name="Shape 16"/><path class="cls-14" d="M3200 455.07L3083 330l-234 282-122 203 281-42 133 23 59-17.86V455.07z" id="Shape_15" data-name="Shape 15"/><path class="cls-15" d="M831 344l-97 112 271 94 256 177 167 46 155-122 331-137 21-174-1104 4z" id="Shape_14" data-name="Shape 14"/><path class="cls-16" d="M0 692.25V778l53-6 203-89-194 31-62-21.75z" id="Shape_13" data-name="Shape 13"/><path fill="#a0a0a0" fill-rule="evenodd" d="M0 342.57v378.79L29 653l65-55-1-270-93 14.57z" id="Shape_12" data-name="Shape 12"/><path class="cls-12" d="M797.33 943h65.6L1075 851 709 538l88.33 405z" id="Shape_11" data-name="Shape 11"/><path class="cls-16" d="M1376 432l-63 185 81-93 141-103-159 11z" id="Shape_10" data-name="Shape 10"/><path fill="#a7a7a7" fill-rule="evenodd" d="M2328 409l-258-26-3 228-102 306 97-167 257 44-197-115 206-270z" id="Shape_9" data-name="Shape 9"/><path fill="#959595" fill-rule="evenodd" d="M1913.81 943L1887 826l-43-34-296.88 151h366.69z" id="Shape_8" data-name="Shape 8"/><path fill="#999" fill-rule="evenodd" d="M208 889l-82.03 54h167.88L208 889z" id="Shape_7" data-name="Shape 7"/><path fill="#9b9b9b" fill-rule="evenodd" d="M0 761.77v19.61L572 884l-84-303-48-28L0 761.77z" id="Shape_6" data-name="Shape 6"/><path class="cls-15" d="M1113 863L816 703l104.66 240h301.95L1113 863z" id="Shape_5" data-name="Shape 5"/><path fill="#adadad" fill-rule="evenodd" d="M3200 758.48L2929 730l-279 103 381-39 133 35 36-23.51v-47.01z" id="Shape_4" data-name="Shape 4"/><path class="cls-14" d="M2621 284l16 195 173-227-189 32z" id="Shape_3" data-name="Shape 3"/><path class="cls-23" d="M622 2L133 240l-85 99-35 167 566-248 3-54 111-75L622 2z" id="Shape_1" data-name="Shape 1"/><path class="cls-23" d="M1097 325L987 470l115-11 102 26-107-160z" id="Shape_2" data-name="Shape 2"/></g></svg>',

		'<svg class="tally" id="shapes" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3200 817"><defs><style>.cls-13,.cls-17,.cls-21,.cls-8{fill-rule:evenodd}.cls-8{fill:#7d7d7d}.cls-13{fill:#565656}.cls-17{fill:#818181}.cls-21{fill:#b2b2b2}</style><clipPath id="clip-path" transform="translate(0 -983)"><path fill="none" d="M3304 1172h-300l-136 32h-140l-180 12-92-84-160 16-104 76-204-28-137 46-299-34-308 40-208-28-187 8-141-8-144 28-140-24-172 36-168-44-176-92-996 772 1386 996 3915-235-909-1485z"/></clipPath></defs><g clip-path="url(#clip-path)"><path fill-rule="evenodd" fill="#a0a0a0" d="M827 111l-145 43-47 201 59 46 362 194 507 188 150-164 10-253-896-255z" id="Shape_33" data-name="Shape 33"/><path d="M1572 1245l-189 70-17 83 260 57s10.45 33.12 14 61c8.24 64.71 14 159 14 159l52-2 157-266 9-171z" transform="translate(0 -983)" fill="#858585" fill-rule="evenodd" id="Shape_32" data-name="Shape 32"/><path fill="#b7b7b7" fill-rule="evenodd" d="M1691 298l-21 73-70 115 28 34 123-143-60-79z" id="Shape_31" data-name="Shape 31"/><path fill="#575757" fill-rule="evenodd" d="M1819 246l-43 99-40 54-83 82 165 35 84-298-83 28z" id="Shape_30" data-name="Shape 30"/><path fill="#a5a5a5" fill-rule="evenodd" d="M1600 480l-149 55 188-3 139-176 1-20-179 144z" id="Shape_29" data-name="Shape 29"/><path class="cls-8" d="M3200 360.77L2520 143l-137-84-221 54-94-33-129 47-73 106-76 251 244-137 501 305 665 14.44V360.77z" id="Shape_28" data-name="Shape 28"/><path fill="#888" fill-rule="evenodd" d="M2611 481l-307-224-113-55 31 183 403 184 199-15-213-73z" id="Shape_27" data-name="Shape 27"/><path fill="#a3a3a3" fill-rule="evenodd" d="M2060 96l-195 235-195 357 58 45 40-70 188-305 243-162-139-100z" id="Shape_26" data-name="Shape 26"/><path fill="#a8a8a8" fill-rule="evenodd" d="M3200 817V633.99L3091 606l-370-69-120-48-342-221-71-92-355 215-139 327-6.12 99H3200z" id="Shape_24" data-name="Shape 24"/><path fill="#b8b8b8" fill-rule="evenodd" d="M2377 502l-331-42 60-113-280 289-66 116-31.41 65h368.1L2264 672l437 15-242-107-82-78z" id="Shape_23" data-name="Shape 23"/><path class="cls-13" d="M2085.8 817h547.73L2462 805l-103-58-56-111-217.2 181z" id="Shape_25" data-name="Shape 25"/><path fill="#787878" fill-rule="evenodd" d="M1280 497l-46-63-61-30 119 172 129 24-141-103z" id="Shape_22" data-name="Shape 22"/><path fill="#b5b5b5" fill-rule="evenodd" d="M1030 402l-99 10 265 98-166-108z" id="Shape_21" data-name="Shape 21"/><path class="cls-8" d="M1039 587l-523-98L0 429.15v77.9L423 644l648 158 208-16-5-107-235-92z" id="Shape_20" data-name="Shape 20"/><path fill="#a9a9a9" fill-rule="evenodd" d="M952 406l-45-5 21 59-245-94-13-104 39-52 4-84-83-69L0 119.34v322.47L336 552l566 130 132-14-5 45 244-28 42 34 226 12 89-167-151 54-527-212z" id="Shape_19" data-name="Shape 19"/><path class="cls-17" d="M482 613L0 479.7V817h1195.72l55.28-44-383-27-386-133z" id="Shape_18" data-name="Shape 18"/><path fill="#5f5f5f" fill-rule="evenodd" d="M166 632L0 511.57V817h1000.25L166 632z" id="Shape_17" data-name="Shape 17"/><path fill="#b4b4b4" fill-rule="evenodd" d="M1826.77 817L1800 761l-140-114-19-113-119 140-90 11-258-87 100 103-181.57 116h734.34z" id="Shape_16" data-name="Shape 16"/><path fill="#b3b3b3" fill-rule="evenodd" d="M623 495l-30-64-32 114 132 5-70-55z" id="Shape_15" data-name="Shape 15"/><path class="cls-21" d="M0 333.45v80.64L130 372l-53-20-38-34-39 15.45z" id="Shape_14" data-name="Shape 14"/><path class="cls-17" d="M0 355.52L42 319 0 283.63v71.89z" id="Shape_13" data-name="Shape 13"/><path fill="#3d3d3d" fill-rule="evenodd" d="M584 799L84 668l75.41 149h714.3L584 799z" id="Shape_12" data-name="Shape 12"/><path fill="#6d6d6d" fill-rule="evenodd" d="M3067 365l-312-103-215 5 7 45 65 40 512 90-57-77z" id="Shape_11" data-name="Shape 11"/><path fill="#696969" fill-rule="evenodd" d="M2630 0l-186 57 14 193 89 62 87 6 369-6 89-185L2630 0z" id="Shape_10" data-name="Shape 10"/><path fill="#4f4f4f" fill-rule="evenodd" d="M3200 89.25L3036 172l-32 60 196 10.43V89.25z" id="Shape_9" data-name="Shape 9"/><path d="M2714 1518l486 184.86v-147.92zm201.63 282H3200v-57.23L2892 1755z" transform="translate(0 -983)" fill="#9b9b9b" fill-rule="evenodd" id="Shape_8" data-name="Shape 8"/><path class="cls-8" d="M2890 763l-95.33 54h251.16L2890 763z" id="Shape_7" data-name="Shape 7"/><path class="cls-13" d="M3200 153.03L2993 205l-33 54-1-48-357 105 404 70 116 61 78-9.67v-284.3z" id="Shape_6" data-name="Shape 6"/><path fill="#3c3c3c" fill-rule="evenodd" d="M1745 235l21 75 3 66 46-65 38-100-108 24z" id="Shape_5" data-name="Shape 5"/><path class="cls-21" d="M1298 263l-294-80 187 180-5-35 29 39 83-104z" id="Shape_4" data-name="Shape 4"/><path fill="#656565" fill-rule="evenodd" d="M890 147l-133-23v150l80 89-42-90 95-126z" id="Shape_3" data-name="Shape 3"/><path class="cls-8" d="M313 233l180-127-264 58-68 86 267 133-95-99-20-51z" id="Shape_2" data-name="Shape 2"/><path class="cls-17" d="M0 181.41L81 128l5-51L0 52.52v128.89z" id="Shape_1" data-name="Shape 1"/></g></svg>'

	];




	// PUBLIC
	return {
		set active(value) {
			_active = value;
		},
		get active() {
			return _active;
		},

		display: display,
		hide: hide,
		log: log,
		lineComplete: lineComplete,
		colorText: colorText
	};
})();
