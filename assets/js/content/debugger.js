/*jshint esversion: 6 */



/*  DEBUGGER
******************************************************************************/

$( function() {


	function addDebuggerHTML(){
		let str =   "<div id='tyd' class='draggable data-field grabbable'>"+
					"</div>";
		$('body').append(str);
	}
	addDebuggerHTML();

	$("#tyd").draggable({
		axis: "y",
		drag: function(){
			//console.log("draggable:drag");
			// var offset = $(this).offset();
			// var xPos = offset.left;
			// var yPos = offset.top - $(window).scrollTop();
//			tally_options.debuggerPosition = [xPos,yPos];
		},
		stop: function(){
			//console.log("draggable:stop");
//			saveOptions("tyd.drag.stop");
		}
	});




});


function updateDebugger(){
	if (!$("#tyd").length) return;
    var str =   "tally_user: " + JSON.stringify(tally_user) +"<br>"+
                "tally_options: " + JSON.stringify(tally_options) +"<br>"+
                "pageData: " + JSON.stringify(pageData) +"<br>";
    $('#tyd').html(str);
}
