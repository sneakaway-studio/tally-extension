"use strict";

$(function() {

	function addBaseHTML() {
		let str = "<div id='tally_wrapper' class='tally reset-this-root reset-this no-print'>" +
						"<div class='tally' id='tally_click_visual'></div>" +
						"<div class='tally tally_monster_sprite_container'>" +
							"<div class='tally tally_monster_sprite'>" +
								"<div class='tally tally_monster_sprite_inner'></div>" +
							"</div>" +
						"</div>" +
						"<div class='tally tally_award_wrapper'></div>" +
						"<div class='tally' id='tally'></div>" +
						"<audio class='tally' id='tally_audio' muted='muted'>"+
							"<source class='tally' id='tally_audio_source' type='audio/mp3'>"+
						"</audio>" +

						"<div class='tally shadow-box-outer' id='battle-console'></div>" +
				"</div>";
		$('body').append(str);
	}
	addBaseHTML();


    // show/hide Tally in fullscreen mode
	this.fullScreenMode = document.fullScreen || document.mozFullScreen || document.webkitIsFullScreen;
	$(document).on('mozfullscreenchange webkitfullscreenchange fullscreenchange', function() {
		this.fullScreenMode = !this.fullScreenMode;
		console.log("this.fullScreenMode",this.fullScreenMode);

        if (this.fullScreenMode == true){
            $("#tally").hide();
        } else {
            $("#tally").show();
        }
	});


});
