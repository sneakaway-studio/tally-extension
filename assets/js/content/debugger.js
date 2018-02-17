/*jshint esversion: 6 */



/*  DEBUGGER
******************************************************************************/


var debug = {
	// add the debugger
	add: function(){
		let str = "<div id='tyd' class='draggable data-field grabbable'>"+"</div>";
		$('#tally').append(str);
		// make it draggable
		$("#tyd").draggable({
			axis: "y",
			drag: function(){
				//console.log("draggable:drag");
				// var offset = $(this).offset();
				// var xPos = offset.left;
				// var yPos = offset.top - $(window).scrollTop();
				// tally_options.debuggerPosition = [xPos,yPos];
			},
			stop: function(){
				//console.log("draggable:stop");
				//saveOptions("tyd.drag.stop");
			}
		});
	},
	update: function(){
		if (!$("#tyd").length) return;
	    var str =   "<b>tally_user</b>: " + JSON.stringify(tally_user) +"<br>"+
	                //"tally_options: " + JSON.stringify(tally_options) +"<br>"+
	                //"<b>pageData</b>: " + JSON.stringify(pageData) +"<br>"+
	                "<b>pageData.tags ("+ pageData.tags.length +")</b>: " + JSON.stringify(pageData.tags) +"<br>"+
	                "<b>pageData.trackers ("+ pageData.trackers.length +")</b>: " + JSON.stringify(pageData.trackers) +"<br>"+
					"";
	    $('#tyd').html(str);
	}
};
