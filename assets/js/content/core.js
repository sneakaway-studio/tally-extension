"use strict";

/*  CORE
 ******************************************************************************/

window.Core = (function() {
	// PRIVATE

	let DEBUG = false;

	// ele = string
	function showElement(ele) {
		try {
			$(ele).css({
				"display": "block",
				"opacity": 1
			});
		} catch (err) {
			console.error(err);
		}
	}
	// ele = string
	function hideElement(ele) {
		try {
			$(ele).css({
				"display": "none",
				"opacity": 0
			});
		} catch (err) {
			console.error(err);
		}
	}

	function setPosition(ele, pos) {
		try {
			$(ele).css({
				"left": pos.x + "px"
			});
			$(ele).css({
				"top": pos.y + "px"
			});
		} catch (err) {
			console.error(err);
		}
	}

	/**
	 *	Get center position of object
	 */
	function getCenterPosition(ele) {
		try {
			let pos = {
				"left": $(ele).offset().left + $(ele).width() / 2,
				// old, didn't work if page was scrolled
				// "top": $(ele).offset().top + $(ele).height() / 2
				// new, takes scrolling into effect
				"top": ($(ele).offset().top - $(window).scrollTop()) + ($(ele).height() / 2)
			};
			if (DEBUG) console.log("⚙️ Core.getCenterPosition()", ele, $(ele).offset(), pos, $(document).scrollTop());
			return pos;
		} catch (err) {
			console.error(err);
		}
	}
	/**
	 *	Set center position of object to new pos
	 */
	function setCenterPosition(ele, newPos) {
		try {
			// set left/top, adjust by width/height
			let pos = {
				"x": newPos.left - ($(ele).width() / 2),
				"y": newPos.top - ($(ele).height() / 2)
			};
			setPosition(ele, pos);
			//if (DEBUG) console.log("⚙️ Core.setCenterPosition()", ele, $(ele).offset(), newPos);
		} catch (err) {
			console.error(err);
		}
	}




	function setRandomPosition(ele) {
		try {

		} catch (err) {
			console.error(err);
		}
	}

	function setRandomPositionFull(ele) {
		try {
			let pos = returnRandomPositionFull(ele);
			if (DEBUG) console.log("⚙️ Core.setRandomPositionFull()", ele, pos);
			setPosition(ele, pos);
		} catch (err) {
			console.error(err);
		}
	}

	/**
	 *	Recursive function to generate safe x,y for consumables, badges, monsters, etc.
	 */
	function returnRandomPositionFull(ele, h, w, preference = "") {
		try {
			// get dimensions of element if not zero
			if ($(ele).width() !== 0) {
				w = $(ele).width() || 200;
				h = $(ele).height() || 200;
			}
			if (DEBUG) console.log("⚙️ Core.returnRandomPositionFull()", ele, w + "," + h, pageData.browser.width, pageData.browser.fullHeight);
			// position
			let pos = {
				"x": Math.ceil(Math.random() * (pageData.browser.width - w)),
				"y": Math.ceil(Math.random() * (pageData.browser.fullHeight - h))
			};
			// include preferences for objects
			if (preference === "above-the-fold")
				pos.y = FS_Number.randomIntBetween(0, pageData.browser.fullHeight / 2);
			if (preference === "below-the-fold")
				pos.y = FS_Number.randomIntBetween(pageData.browser.fullHeight / 2, pageData.browser.fullHeight);

			if (DEBUG) console.log("⚙️ Core.returnRandomPositionFull()", w +","+ h, pos);
			return pos;
		} catch (err) {
			console.error(err);
		}
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
		returnRandomPositionFull: function(ele, h, w, preference) {
			return returnRandomPositionFull(ele, h, w, preference);
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
