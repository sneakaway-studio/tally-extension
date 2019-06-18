"use strict";

/*  NUMBER FUNCTIONS
 ******************************************************************************/

window.FS_Number = (function() {

	// PUBLIC
	return {
		map: function(val, in_min, in_max, out_min, out_max) {
			try {
				return (val - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
			} catch (err) {
				console.error(err);
			}
		},
		round: function(val, precision) {
			try {
				var multiplier = Math.pow(10, precision || 0);
				return Math.round(val * multiplier) / multiplier;
			} catch (err) {
				console.error(err);
			}
		},
		clamp: function(val, min, max) {
			try {
				return Math.min(Math.max(val, min), max);
			} catch (err) {
				console.error(err);
			}
		},
		normalize: function(val, min = 0, max = 1) {
			try {
				return (val - min) / (max - min);
			} catch (err) {
				console.error(err);
			}
		},
		randomPosNeg: function(val) {
			try {
				// either 1 or -1
				let one = Math.round(Math.random()) * 2 - 1;
				// use val to get random * 1 or -1
				return (Math.random() * val) * one;
			} catch (err) {
				console.error(err);
			}
		}
	};
})();
