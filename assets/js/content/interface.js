"use strict";

$(function() {

	function addBaseHTML() {
		let str = "<div id='tally_wrapper' class='tally reset-this-root reset-this no-print'>" +
						"<div class='tally' id='tally_click_visual'></div>" +
						"<div class='tally tally_monster_sprite_container shake-vertical shake-constant'>" +
						"<div class='tally tally_monster_sprite shake-slow '>" +
						"<div class='tally tally_monster_sprite_inner'></div>" +
					"</div>" +
					"</div>" +
					"<div class='tally tally_award_text_wrapper'>" +

							"<div class='tally tally_award_text award_title'></div>" +
							"<div class='tally tally_award_text award_subtitle'></div>" +
							"<div class='tally tally_award_text award_did_you_know'></div>" +
							"<div class='tally tally_award_text award_fact'></div>" +

					"</div>" +
					"<div class='tally tally_award_background'></div>" +
					"<div class='tally_award_explode_background-1'></div>"+
          			"<div class='tally_award_explode_background-2'></div>"+

					"<div class='tally' id='tally'></div>" +

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
