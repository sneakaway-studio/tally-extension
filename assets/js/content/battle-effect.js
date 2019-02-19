"use strict";

/*  BATTLE EFFECT
 ******************************************************************************/

var BattleEffect = (function() {
	// PRIVATE
	let source, // page source for rumbles
		nodes,  // node string for rumbles
		n = "*"; // node elements for rumbles


	function setup(){
		setupRumble();
	}

	/**
	 *	Store the nodes, source code, for the battle rumble
	 */
	function setupRumble() {
		return;
		// display source code of web page in background
		if (source == null) {
			source = $("body").html();
			source.replace(/[^<]/gi, '&lt;').replace(/[^>]/gi, '&gt;');
			//console.log(source);
		}
		if (nodes == null) {
			// all possible html5 nodes
			nodes = ['a', 'b', 'blockquote', 'br', 'button', 'canvas', 'code', 'dd', 'div', 'dl', 'dt',
				'em', 'embed', 'footer', 'frame', 'form', 'header', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'hr',
				'iframe', 'img', 'input', 'label', 'nav', 'ol', 'ul', 'li', 'option', 'p', 'pre', 'section', 'span',
				'strong', 'sup', 'svg', 'table', 'tr', 'td', 'th', 'tbody', 'thead', 'template', 'textarea', 'text', 'u', 'video'
			];
			//console.log(nodes.join(", "));
			// add any exclusions
			for (let i = 0, l = nodes.length; i < l; i++) {
				//console.log(nodes.length, nodes[i], $(nodes[i]).height(), $(nodes[i]).length);
				// remove large divs
				if ($(nodes[i]).length == 0 || $(nodes[i]).height() > 2000 || $(nodes[i]).height() == undefined) {
					//console.log(" --> removed ");
					delete nodes[i];
				} else {
					nodes[i] = nodes[i] + ':not(.tally)';
				}
			}
			// clean empty nodes from array
			nodes = nodes.filter(function(el) {
				return el != null;
			});
			console.log("final node count: " + nodes.length);
			// format for selection
			n = nodes.join(', ');
			//console.log(n);
		}
	}
	function rumble(degree = "medium") {
		// make sure we are ready to rumble!
		if (source == null || nodes == null)
			setupRumble();

		// add div
		if ($("#battle-background").length == 0)
			$("body").append("<blockquote id='battle-background'></blockquote>");

		// extend rumble and sound time based on degree
		let soundDegrees = [-0.2, 0, 0.2],
			rumbleDegrees = [500, 1200, 1800],
			degreeIndex = 0;
		if (degree == "medium") degreeIndex = 1;
		if (degree == "large") degreeIndex = 2;

		// play sound
		Sound.playFile("explosions/explode.mp3", 0, soundDegrees[degreeIndex]);
		// display background
		//$("#battle-background").text(source).removeClass("battle-background-clear");
		// rumble page elements
		$(n).addClass(degree + '-rumble');
		// after delay set back to normal
		setTimeout(function() {
			$(n).removeClass(degree + '-rumble');
			$("#battle-background").text("").addClass("battle-background-clear");
		}, rumbleDegrees[degreeIndex]);
	}






	// PUBLIC
	return {
        setup: setup,
		rumble: function(degree) {
			rumble(degree);
		},
	};
})();
