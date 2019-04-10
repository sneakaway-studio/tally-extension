"use strict";

/*  CORE
 ******************************************************************************/

window.Core = (function() {
	// PRIVATE

	function showElement(ele) {
		$(ele).css({
			"display": "block",
			"opacity": 1
		});
	}

	function hideElement(ele) {
		$(ele).css({
			"display": "none",
			"opacity": 0
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
		console.log("Core.getCenterPosition()", ele, $(ele).offset(), pos, $(document).scrollTop());
		return pos;
	}
	/**
	 *	Set center position of object to new pos
	 */
	function setCenterPosition(ele, newPos) {
		// set left/top, adjust by width/height
		$(ele).offset({
			"left": newPos.left - ($(ele).width() / 2)
		});
		$(ele).offset({
			"top": newPos.top - ($(ele).height() / 2)
		});
		console.log("Core.setCenterPosition()", ele, $(ele).offset(), newPos);
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
	};
})();
