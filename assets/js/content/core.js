"use strict";

/*  CORE
 ******************************************************************************/

window.Core = (function() {
	// PRIVATE


	// ele = string
	function showElement(ele) {
		$(ele).css({
			"display": "block",
			"opacity": 1
		});
	}
	// ele = string
	function hideElement(ele) {
		$(ele).css({
			"display": "none",
			"opacity": 0
		});
	}

	function setPosition(ele, pos) {
		$(ele).css({
			"left": pos.x + "px"
		});
		$(ele).css({
			"top": pos.y + "px"
		});
	}

	/**
	 *	Get center position of object
	 */
	function getCenterPosition(ele) {
		let pos = {
			"left": $(ele).offset().left + $(ele).width() / 2,
			"top": $(ele).offset().top + $(ele).height() / 2
		};
		console.log("⚙️ Core.getCenterPosition()", ele, $(ele).offset(), pos, $(document).scrollTop());
		return pos;
	}
	/**
	 *	Set center position of object to new pos
	 */
	function setCenterPosition(ele, newPos) {
		// set left/top, adjust by width/height
		let pos = {
			"x": newPos.left - ($(ele).width() / 2),
			"y": newPos.top - ($(ele).height() / 2)
		};
		setPosition(ele, pos);
		//console.log("⚙️ Core.setCenterPosition()", ele, $(ele).offset(), newPos);
	}




	function setRandomPosition(ele) {

	}

	function setRandomPositionFull(ele) {
		let pos = returnRandomPositionFull(ele);
		console.log("⚙️ Core.setRandomPositionFull()", ele, pos);
		setPosition(ele, pos);
	}

	/**
	 *	Recursive function to generate safe x,y for consumables, monsters, etc.
	 */
	function returnRandomPositionFull(ele) {
		let w = $(ele).width() || 100,
			h = $(ele).height() || 100;
		//console.log("⚙️ Core.returnRandomPositionFull()");
		function gen() {
			//console.log("⚙️ Core.returnRandomPositionFull() -> gen()");
			let pos = {
				"x": Math.ceil(Math.random() * (pageData.browser.width - w)) + (w / 2),
				"y": Math.ceil(Math.random() * (pageData.browser.fullHeight - h)) + (h / 2)
			};
			// check to make sure it isn't behind Tally
			if (pos.x < 200 && pos.y > (pageData.browser.fullHeight - 200))
				// or try again
				pos = gen();
			else
				return pos;
		}
		return gen();
	}


	// PUBLIC
	return {
		showElement: function(ele) {
			showElement(ele);
		},
		hideElement: function(ele) {
			hideElement(ele);
		},
		getCenterPosition: function(ele) {
			return getCenterPosition(ele);
		},
		setCenterPosition: function(ele, newPos) {
			setCenterPosition(ele, newPos);
		},
		setRandomPosition: function(ele) {
			setRandomPosition(ele);
		},
		setRandomPositionFull: function(ele) {
			setRandomPositionFull(ele);
		},
		returnRandomPositionFull: function() {
			return returnRandomPositionFull();
		},
		setElementAbsolute: function(ele) {
			$(ele).css({
				"position": "absolute"
			});
		},
		setElementFixed: function(ele) {
			$(ele).css({
				"position": "fixed"
			});
		}

	};
})();
