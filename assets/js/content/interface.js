"use strict";

$(function() {

	function addBaseHTML() {
		let str = "<div id='tally_wrapper' class='tally reset-this-root reset-this no-print'>" +

						// effects
						"<div class='tally' id='tally_click_visual'></div>" +
						"<audio class='tally' id='tally_audio' muted='muted'>"+
							"<source class='tally' id='tally_audio_source' type='audio/mp3'>"+
						"</audio>" +

						// monster
						"<div class='tally tally_monster_sprite_container'>" +
							"<div class='tally tally_monster_sprite'>" +
								"<div class='tally tally_monster_sprite_inner'></div>" +
							"</div>" +
							"<div class='tally monster_stats'></div>" +
						"</div>" +

						// award
						"<div class='tally tally_award_wrapper'></div>" +
						// cokie
						"<div class='tally tally_cookie_wrapper'></div>" +

						// battle
						"<div class='tally shadow-box-outer' id='battle-console'></div>" +
						"<div class='tally' id='battle_projectile'></div>" +
						"<div class='tally' id='explosion_sprite_container'>"+
							"<div class='tally' id='explosion_sprite'>" +
								"<div class='tally' id='explosion_sprite_inner'></div>" +
							"</div>" +
						"</div>" +

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
            $("#tally_wrapper").hide();
        } else {
            $("#tally_wrapper").show();
        }
	});


});
