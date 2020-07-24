"use strict";

/*  NUMBER FUNCTIONS
 ******************************************************************************/

window.FS_Number = (function () {

	// PUBLIC
	return {
		map: function (val, in_min, in_max, out_min, out_max) {
			try {
				return (val - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
			} catch (err) {
				console.error(err);
			}
		},
		round: function (val, precision = 0) {
			try {
				if (val == null || precision == null)
					console.error("more numbers required!", val, precision);
				var multiplier = Math.pow(10, precision || 0);
				return Math.round(val * multiplier) / multiplier;
			} catch (err) {
				console.error(err);
			}
		},
		clamp: function (val = 0, min = 0, max = 1) {
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
		normalize: function (val, min = 0, max = 1) {
			try {
				return (val - min) / (max - min);
			} catch (err) {
				console.error(err);
			}
		},
		randomFloatBetween: function (min = 0, max = 0) {
			try {
				return Math.random() * (Number(max) - Number(min)) + Number(min);
			} catch (err) {
				console.error(err);
			}
		},
		randomIntBetween: function (min, max) {
			return Math.floor(Math.random() * (max - min + 1) + min);
		},
		randomPosNeg: function (val) {
			try {
				// either 1 or -1
				let one = Math.round(Math.random()) * 2 - 1;
				// use val to get random * 1 or -1
				return (Math.random() * val) * one;
			} catch (err) {
				console.error(err);
			}
		},
		operation: function (operand1, operand2, operator) {
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
		},
		// is 0.3.3 higher than 0.3.2 ? reference: https://semver.org/
		// current is behind: -1
		// current is same: 0
		// current is ahead: 1
		compareVersionStrings: function (str1 = "", str2 = "") {
			try {
				let current = str1.split("."),
					latest = str2.split(".");
				if (current.length < 3 || latest.length < 3)
					return -1;

				// MAJOR VERSION
				if (Number(current[0]) !== Number(latest[0]))
					return current[0] - latest[0];
				// MINOR VERSION
				if (Number(current[1]) !== Number(latest[1]))
					return current[1] - latest[1];
				// PATCH VERSION
				if (Number(current[2]) !== Number(latest[2]))
					return current[2] - latest[2];

				// catch all
				return 0;
			} catch (err) {
				console.error(err);
			}
		}
	};
})();
