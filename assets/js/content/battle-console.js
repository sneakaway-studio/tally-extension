"use strict";

/*  (BATTLE) CONSOLE
 ******************************************************************************/

var BattleConsole = (function() {
	// PRIVATE
	var stream, logId, _active, _queue;

	// reset all vars
	function reset() {
		stream = "";
		logId = 0;
		_active = false;
		_queue = [];
	}


	// show the console
	function show() {
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
			top: "70%",
			elasticity: 0,
			duration: 1000,
			easing: 'easeOutCubic'
		});
	}
	// show the console
	function hide() {
		//reset();
		anime({
			targets: '#battle-console',
			top: "130%",
			elasticity: 0,
			duration: 1000,
			easing: 'easeOutCubic'
		});

	}




	// control state
	function active(state) {
		if (state != undefined && (state === true || state === false))
			_active = state;
		return _active;
	}
	// log to the console
	function log(str) {
		if (!Battle.active) return;
		// add to end of _queue
		_queue.push(str);
		// start/make sure queueChecker is running
		queueChecker();
	}

	function queueChecker() {
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
	}

	function writeNextInQueue(lineSpeed = 150) {
		//console.log("writeNextInQueue() 1", str, _queue,_active);
		// if currently active, stop
		if (_active) return;
		// set active
		_active = true;
		// remove first element in array
		var str = _queue.shift();
		//console.log("writeNextInQueue() 2", str, _queue,_active);
		// insert placeholder
		logId++;
		var ele = "<div class='tally tally_log_line'><span id='tally_log" + logId + "' class='tally_log_cursor'></span></div>";
		$("#battle-console-stream").append(ele);
		// make sure it exists first
		if (!$('#battle-console-stream')[0]) return;
		// scroll to new placeholder
		$('#battle-console-stream').stop().animate({
			scrollTop: $('#battle-console-stream')[0].scrollHeight
		}, 800);
		// insert text
		setTimeout(function() {
			typeWriter("tally_log" + logId, str, 0, "BattleConsole");
		}, lineSpeed);
		//console.log(stream);
	}

	function colorText(ele) {
		var str = $("#" + ele).html();
		if (str == undefined) return;
		//console.log(str);
		str = str.replace("Tally", "<span class='text-tally'>Tally</span>");
		str = str.replace(Battle.details.monsterName, "<span class='text-xp'>" + Battle.details.monsterName + "</span>");
		str = str.replace(Battle.details.mostRecentAttack, "<span class='text-mp'>" + Battle.details.mostRecentAttack + "</span>");
		str = str.replace(Battle.details.mostRecentDamage, "<span class='text-hp'>" + Battle.details.mostRecentDamage + "</span>");
		$("#" + ele).html(str);
	}







	// PUBLIC
	return {
		show: show,
		log: function(str) {
			log(str);
		},
		hide: hide,
		active: function(state) {
			return active(state);
		},
		colorText: function(ele) {
			colorText(ele);
		}
	};
})();
