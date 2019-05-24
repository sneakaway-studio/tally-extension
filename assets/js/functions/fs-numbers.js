"use strict";

/*  NUMBER FUNCTIONS
 ******************************************************************************/

window.FS_Number = (function() {

	// PUBLIC
	return {
		map: function(val, in_min, in_max, out_min, out_max) {
			return (val - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
		},
		round: function(val, precision) {
			var multiplier = Math.pow(10, precision || 0);
			return Math.round(val * multiplier) / multiplier;
		},
		clamp: function(val, min, max) {
			return Math.min(Math.max(val, min), max);
		},
		normalize: function(val, min=0, max=1) {
			return (val - min) / (max - min);
		},
		randomPosNeg: function(val){
			// either 1 or -1
			let one = Math.round(Math.random()) * 2 - 1;
			// use val to get random * 1 or -1
			return (Math.random()*val) * one;
		}
	};
})();
