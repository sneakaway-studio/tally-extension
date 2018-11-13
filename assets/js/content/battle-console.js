"use strict";

/*  (BATTLE) CONSOLE
 ******************************************************************************/

var BattleConsole = (function() {
	// PRIVATE

	var stream = "";

	// show the console
	function show(){
		stream = "";
		var str = "<div id='battle-console-inner'>This is the BattleConsole"+
				"<div id='battle-console-stream'>"+"</div>"+
				"</div>";
		$("#battle-console").html(str);
		$("#battle-console").css({"display":"block"});
	}
	// log to the console
	function log(str){
		if (!Battle.state) {
			Battle.state = true;
			console.log(112,Battle.state);
			return;
		}
		stream = stream + "<div>" + str + "</div>";
		console.log(stream);
	}
	// show the console
	function hide(){
		$("#battle-console").html("");
		$("#battle-console").css({"display":"none"});
	}




	// PUBLIC
	return {
		show:show,
		log:function(str){
			log(str);
		},
		hide:hide
	};
})();
