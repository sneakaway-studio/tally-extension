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
		round: function(val, precision = 0) {
			try {
				if (val == null || precision == null)
					console.error("more numbers required!", val, precision);
				var multiplier = Math.pow(10, precision || 0);
				return Math.round(val * multiplier) / multiplier;
			} catch (err) {
				console.error(err);
			}
		},
		clamp: function(val = 0, min = 0, max = 1) {
			try {
				if (val === null || min === null || max === null)
					console.error("more numbers required!", val, min, max);
				// console.log(val,min,max)
				return Math.min(Math.max(val, min), max);
				// return Math.max(min, Math.min(val, max));
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
		randomIntBetween: function(min, max) {
			return Math.floor(Math.random() * (max - min + 1) + min);
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
		},
		operation: function(operand1, operand2, operator) {
			// make sure they are ints
			operand1 = parseInt(operand1);
			operand2 = parseInt(operand2);
			// console.log("FS_Number.operation()", operand1, operator, operand2);
			try {
				if (operator === "+") {
					return operand1 + operand2;
				} else if (operator === "-") {
					return operand1 - operand2;
				} else if (operator === "*") {
					return operand1 * operand2;
				} else if (operator === "/") {
					return operand1 / operand2;
				}
			} catch (err) {
				console.error(err);
			}
		}
	};
})();
