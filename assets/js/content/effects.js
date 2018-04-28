"use strict";


/*  DEBUGGER
 ******************************************************************************/

var Effects = (function() {


	function explode(){}


	/**
	 * 	Click Animation: Show rising TEXT +1, +2, etc. from click
	 */
	function showClickVisualText(eventData, str) {
		if (!tally_options.showClickVisuals) return;
		//console.log("showClickVisualText()", eventData, str);
		// add the string
		$('#tally_click_visual').html(str);
		// make it visible
		$('#tally_click_visual').css({
			'top': eventData.mouseY - (20 * 1.5) + "px",
			'left': eventData.mouseX - (20 / 2) + "px",
			'display': 'block',
			'opacity': 1
		});
		// animation
		anime({
			targets: '#tally_click_visual',
			translateY: -30,
			duration: 600,
			opacity: 0,
			easing: 'easeInOutQuad',
			complete: function() {
				// reset
				$('#tally_click_visual').css({
					'transform': 'none'
				});
			}
		});
		// hide element after play
		setTimeout(hideClickVisual, 400);
	}
	// hide click visual
	function hideClickVisual() {
		$('#tally_click_visual').css({
			'top': "-500px",
			'left': "-500px",
			'display': 'none'
		});
	}


	// PUBLIC
	return {
		showClickVisualText: function(eventData, str) {
			showClickVisualText(eventData, str);
		},
		explode:explode
	};
})();
