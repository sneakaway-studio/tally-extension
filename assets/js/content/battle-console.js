"use strict";

/*  (BATTLE) CONSOLE
 ******************************************************************************/

window.BattleConsole = (function() {
	// PRIVATE
	var stream, logId, _active, _queue, _next;

	// reset all vars
	function reset() {
		_next = "";
		stream = "";
		logId = 0;
		_active = false;
		_queue = [];
	}


	// display the console
	function display() {
		try {
			reset();
			var str = "<div id='battle-console-inner' class='tally shadow-box-inner'>" +
				"<div class='tally' id='battle-console-stream'></div>" +
				"</div>";
			$("#battle-console").html(str);
			$("#battle-console").css({
				"display": "block",
				"top": window.innerHeight + "px"
			});
			// move it into position
			anime({
				targets: '#battle-console',
				top: "75%",
				elasticity: 0,
				duration: 1000,
				easing: 'easeOutCubic'
			});
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
		} catch (err) {
			console.error(err);
		}
	}
	// control state
	function active(state) {
		try {
			if (state != undefined && (state === true || state === false))
				_active = state;
			return _active;
		} catch (err) {
			console.error(err);
		}
	}
	// log to the console
	function log(_str, next = "") {
		try {
			if (!Battle.active) return;
			// add a "next" function
			if (next) _next = next;
			// add to end of _queue
			_queue.push(_str);
			// start/make sure queueChecker is running
			queueChecker();
		} catch (err) {
			console.error(err);
		}
	}

	function queueChecker() {
		try {
			//console.log("queueChecker()", _queue, _active);
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
			//if(DEBUG) console.log("writeNextInQueue()", _queue, _active);
			// if currently active, stop
			if (_active) return;
			// set active state
			active(true);
			// remove first element in array
			var str = _queue.shift();
			//if(DEBUG) console.log("writeNextInQueue()", str, _queue, _active);
			// insert placeholder
			var ele = "<div class='tally tally_log_line'>" +
				"<span id='tally_log" + (++logId) + "' class='tally_log_cursor'></span>" +
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
				typeWriter("tally_log" + logId, str, 0);
			}, lineSpeed);
			//console.log(stream);
		} catch (err) {
			console.error(err);
		}
	}

	function showBattleOptions(lineSpeed = 150) {
		try {
			//console.log("showBattleOptions() step 1", _active);
			// if currently active, stop
			if (_active) return;
			// set active state
			active(true);
			// get list of attacks
			var _attacks = {};
			if (!FS_Object.isEmpty(tally_user.attacks))
				_attacks = tally_user.attacks;
			else {
				return;
			}

			var str = "<div class='battle-options-row'>";
			for (var key in _attacks) {
				if (_attacks.hasOwnProperty(key)) {
				//console.log(_attacks[key]);
				str += "<span data-attack='" + _attacks[key].name +
					"' class='battle-options attack-" + _attacks[key].name + "'>" +
					_attacks[key].name + "</span>";
				}
			}
			str += "<span class='battle-options-esc'>run [esc]</span></div>";


			//console.log("🖥️ BattleConsole.showBattleOptions() step 2", str, _queue,_active);

			// insert placeholder
			var ele = "<div class='tally tally_log_line'>" +
				"<span id='tally_log" + (++logId) + "' class='tally_log_cursor'>" + str + "</span>" + "</div>";
			$("#battle-console-stream").append(ele);

			// add hover, click listeners
			for (var i in _attacks) {
				/*jshint loopfunc: true */
				if (_attacks.hasOwnProperty(i)) {
					let ref = ".attack-" + _attacks[i].name;
					console.log("🖥️ BattleConsole.showBattleOptions()", i, ref, _attacks[i]);
					$(document).on("mouseenter", ref, function() {
						let attackName = $(this).attr("data-attack");
						//console.log(attackName);
					});
					$(document).on("click", ref, function() {
						let attackName = $(this).attr("data-attack");
						//console.log(attackName);

						BattleAttack.tallyAttackMonster(tally_user.attacks[attackName]);
					});
				}
			}
			// make sure it exists first
			if (!$('#battle-console-stream')[0]) return;
			// scroll to new placeholder
			$('#battle-console-stream').stop().animate({
				scrollTop: $('#battle-console-stream')[0].scrollHeight
			}, 800);
			// release active state
			active(false);
		} catch (err) {
			console.error(err);
		}
	}

	/**
	 *	Typewriter effect
	 */
	function typeWriter(ele, str, i) {
		try {
			//console.log(ele, str, i);
			if (!document.getElementById(ele)) return;
			if (i < str.length) {
				document.getElementById(ele).innerHTML += str.charAt(i);
				setTimeout(function() {
					typeWriter(ele, str, ++i);
				}, 30);
			} else {
				BattleConsole.lineComplete(ele);
			}
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
				active(false);
				// text is done writing so color it
				colorText(ele);
				// if queue is empty and there is a next string
				if (_queue.length < 1 && _next != "") {
					if (_next == "showBattleOptions") {
						//console.log(_next);
						showBattleOptions();
					}
					_next = "";
				}
			}, 250);
		} catch (err) {
			console.error(err);
		}
	}

	function colorText(ele) {
		try {
			var str = $("#" + ele).html();
			if (str == undefined) return;
			//console.log(str);
			str = str.replace("Tally", "<span class='text-tally'>Tally</span>");
			str = str.replace(Battle.details.monsterName, "<span class='text-green'>" + Battle.details.monsterName + "</span>");
			str = str.replace(Battle.details.mostRecentAttack.name, "<span class='text-yellow'>" + Battle.details.mostRecentAttack.name + "</span>");
			str = str.replace(Battle.details.mostRecentDamage, "<span class='text-blue'>" + Battle.details.mostRecentDamage + "</span>");
			$("#" + ele).html(str);
		} catch (err) {
			console.error(err);
		}	
	}







	// PUBLIC
	return {
		display: display,
		hide: hide,
		log: function(str, next) {
			log(str, next);
		},
		active: function(state) {
			return active(state);
		},
		lineComplete: function(ele) {
			lineComplete(ele);
		},
		colorText: function(ele) {
			colorText(ele);
		}
	};
})();
