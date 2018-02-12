/*jshint esversion: 6 */



/*  DEBUGGER
******************************************************************************/

$( function() {
	$("#tyd").draggable({
		axis: "y",
		drag: function(){
			console.log("draggable:drag");
			// var offset = $(this).offset();
			// var xPos = offset.left;
			// var yPos = offset.top - $(window).scrollTop();
//			tally_options.debuggerPosition = [xPos,yPos];
			//console.log(tally_options);
		},
		stop: function(){
			console.log("draggable:stop");
	//		console.log(tally_options);
//			saveOptions("tyd.drag.stop");
		}
	});
} );
