"use strict";

/*  (BATTLE) CONSOLE
 ******************************************************************************/

var BattleConsole = (function() {
	// PRIVATE

	var stream = "";

	// show the console
	function show() {
		stream = "";
		var str = "<div id='battle-console-inner'>" +
			"<div id='battle-console-stream'>" + "</div>" +
			"</div>";
		$("#battle-console").html(str);
		$("#battle-console").css({
			"display": "block"
		});
	}
	// log to the console
	function log(str) {
		if (!Battle.getActive()) return;

		stream = stream + "<div>" + str + "</div>";
		$("#battle-console-stream").html(stream);
		//console.log(stream);

		// scroll
		$('#battle-console-stream').stop().animate({
			scrollTop: $('#battle-console-stream')[0].scrollHeight
		}, 800);
	}
	// show the console
	function hide() {
		$("#battle-console").html("");
		$("#battle-console").css({
			"display": "none"
		});
	}




	// PUBLIC
	return {
		show: show,
		log: function(str) {
			log(str);
		},
		hide: hide
	};
})();
