"use strict";

/*  (BATTLE) CONSOLE
 ******************************************************************************/

var BattleConsole = (function() {
	// PRIVATE

	var stream = "";

	// show the console
	function show(){
		reset();

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
		reset();
	}
	// reset everything
	function reset(){
		stream = "";
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
