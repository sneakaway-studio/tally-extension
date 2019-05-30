"use strict";

/*  EFFECTS
 ******************************************************************************/

window.Effect = (function() {


	/**
	 * 	Explode the page
	 */
	function explode() {
		try {
			Sound.playFile("explosions/explode.mp3");

			// all possible html5 nodes
			let nodes = ['a', 'a[href]', 'b', 'blockquote', 'br', 'button', 'canvas', 'code', 'dd', 'dl', 'dt',
				'em', 'embed', 'footer', 'frame', 'form', 'header', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'hr',
				'iframe', 'img', 'input', 'label', 'nav', 'ol', 'ul', 'li', 'option', 'p', 'pre', 'section', 'span',
				'strong', 'sup', 'svg', 'table', 'tr', 'td', 'th', 'tbody', 'thead', 'textarea', 'text', 'u', 'video'
			];
			// add any exclusions
			for (let i = 0, l = nodes.length; i < l; i++) {
				nodes[i] = nodes[i] + ':not(.tally)';
			}
			// run animation
			anime({
				targets: document.querySelectorAll(nodes.toString()),
				rotate: function() {
					return Math.random() * 360;
				},
				translateX: function() {
					return Math.random() * 100;
				},
				translateY: function() {
					return Math.random() * 100;
				},
				scale: function() {
					return Math.random() * 2;
				}
			});
			// explode main nodes just a little
			anime({
				targets: document.querySelectorAll('div:not(.tally)'),
				rotate: function() {
					return Math.random() * 2;
				},
				translateX: function() {
					return Math.random() * 40;
				},
				translateY: function() {
					return Math.random() * 40;
				}
			});
		} catch (err) {
			console.error(err);
		}
	}


	/**
	 * 	Click Animation: Show rising TEXT +1, +2, etc. from click
	 */
	function showClickVisualText(eventData, str) {
		try {
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
		} catch (err) {
			console.error(err);
		}
	}
	// hide click visual
	function hideClickVisual() {
		try {
			$('#tally_click_visual').css({
				'top': "-500px",
				'left': "-500px",
				'display': 'none'
			});
		} catch (err) {
			console.error(err);
		}	
	}


	// PUBLIC
	return {
		showClickVisualText: function(eventData, str) {
			showClickVisualText(eventData, str);
		},
		explode:explode
	};
})();
