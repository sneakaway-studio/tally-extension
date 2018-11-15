"use strict";

/*  (BATTLE) CONSOLE
 ******************************************************************************/

var BattleConsole = (function() {
	// PRIVATE

	var stream = "",
		logId = 0,
		_active = false,
		_queue = [];


	// control state
	function active(state) {
		if (state != undefined && (state === true || state === false))
			_active = state;
		return _active;
	}

	// show the console
	function show() {
		stream = "";
		var str = "<div id='battle-console-inner'>" +
			"<div id='battle-console-stream'>" + "</div>" +
			"</div>";
		$("#battle-console").html(str);
		$("#battle-console").css({
			"display": "block",
			"top": window.innerHeight + "px"
		});
		// move it into position
		anime({
			targets: '#battle-console',
			translateY: -250,
			elasticity: 100
		});
	}
	// log to the console
	function log(str) {
		// add to end of _queue
		_queue.push(str);
		// start/make sure queueChecker is running
		queueChecker();
	}

	function queueChecker(){
		//console.log("queueChecker()", _queue, _active);
		// if no items in _queue then stop
		if (_queue.length < 1) {
			// start animating cursor
			$("#battle-console-stream:last-child:after").removeClass("noanimation");
			return;
		}
		// else, if not currently active then start a new one
		if (!_active){
			writeNextInQueue();
			// stop animating cursor
			$("#battle-console-stream:last-child:after").addClass("noanimation");
		}
		// check again in a bit in case there are more
		setTimeout(function() {
			queueChecker();
		}, 200);
	}

	function writeNextInQueue(){
		//console.log("writeNextInQueue() 1", str, _queue,_active);
		// if currently active, stop
		if (_active) return;
		// set active
		_active = true;
		// remove first element in array
		var str = _queue.shift();
		//console.log("writeNextInQueue() 2", str, _queue,_active);
		// insert placeholder
		logId ++;
		var ele = "<div class='tally_log_line'><span id='tally_log"+ logId +"' class='tally_log_cursor'></span></div>";
		$("#battle-console-stream").append(ele);
		// scroll to new placeholder
		$('#battle-console-stream').stop().animate({
			scrollTop: $('#battle-console-stream')[0].scrollHeight
		}, 800);
		// insert text
		setTimeout(function() {
			typeWriter("tally_log"+ logId, str, 0, "BattleConsole");
		}, 200);
		//console.log(stream);
	}


	// show the console
	function hide() {
		anime({
			targets: '#battle-console',
			translateY: 250
		});
		$("#battle-console").css({
			"display": "none"
		});
		$("#battle-console").html("");
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
		}
	};
})();
