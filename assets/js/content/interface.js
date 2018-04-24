"use strict";

$(function() {

	function addBaseHTML() {
		let str = "<div id='tally_wrapper' class='reset-this-root reset-this no-print'>" +
						"<div id='tally_click_visual'></div>" +
						"<div class='tally_monster_sprite_container shake-vertical shake-constant'>" +
						"<div class='tally_monster_sprite shake-slow '>" +
						"<div class='tally_monster_sprite_inner'></div>" +
					"</div>" +
					"</div>" +
					"<div class='tally_award_text_wrapper'>" +
						"<div class='tally_award_text'>" +
							"<div class='award_title'></div>" +
							"<div class='award_subtitle'></div>" +
							"<div class='award_did_you_know'></div>" +
							"<div class='award_fact'></div>" +
						"</div>" +
					"</div>" +
					"<div class='tally_award_background'></div>" +

					"<div id='tally'></div>" +
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
