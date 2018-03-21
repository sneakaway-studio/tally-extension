"use strict";


/*  DEBUGGER
 ******************************************************************************/

var Effects = (function() {


	var files = {
		"bubbles": "click-bubbles.gif",
		"coin": "click-coin.gif",
		"jaggylines": "click-jaggylines.gif",
		"plusOne": "click-plusOne.gif"
	}

	function getFile(img) {
		return "clickAnimations/" + this.files[img];
	}

	/**
	 *	Insert a click animation or product monster image in an element
	 */
	function insertImageFile(el, img) {
		console.log("insertImageFile", el, img);
		// file reference
		//var img = img +"?r="+Math.random(); // testing
		//img = randomObjProperty(clickAnimations) +"?r="+Math.random(); // random image
		var file = chrome.extension.getURL("assets/img/" + img);
		// insert img element
		$(el).html('<img alt="tally image" src="' + file + '" />');
	}


	/**
	 * 	Click Animation: IMAGE of rising +1, +2, etc. from click
	 */
	function showClickVisualUp(eventData, id) {
		if (!tally_options.showClickVisuals) return;

		insertImageFile('#tally_click_visual', getFile(id));


		$('#tally_click_visual').css({
			'top': eventData.mouseY - (20 * 1) + "px",
			'left': eventData.mouseX - (20 / 2) + "px",
			'display': 'block',
			'height': '20px',
			'width': '20px',
			'opacity': 1
		});
		var cssProperties = anime({
			targets: '#tally_click_visual',
			translateY: -20,
			duration: 400,
			opacity: 0,
			easing: 'easeInOutQuad',
			complete: function(anim) {
				$('#tally_click_visual').css({
					'transform': 'none'
				}); // reset
			}
		});
		// hide element after play
		setTimeout(hideClickVisual, 400);
	}


	/**
	 * 	Click Animation: Show rising TEXT +1, +2, etc. from click
	 */
	function showClickVisualText(eventData, str) {
		if (!tally_options.showClickVisuals) return;
        console.log("showClickVisualText()",eventData,str);

        // add the string
		$('#tally_click_visual').html(str);

        // make it visible
		$('#tally_click_visual').css({
			'top': eventData.mouseY - (20 * 1.5) + "px",
			'left': eventData.mouseX - (20 / 2) + "px",
			'display': 'block',
			'opacity': 1
		});
        // animate it
		var cssProperties = anime({
			targets: '#tally_click_visual',
			translateY: -30,
			duration: 600,
			opacity: 0,
			easing: 'easeInOutQuad',
			complete: function(anim) {
				$('#tally_click_visual').css({
					'transform': 'none'
				}); // reset
			}
		});
		// hide element after play
		setTimeout(hideClickVisual, 400);
	}
	/**
	 *	Hide click visual
	 */
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
		}
	};
})();
