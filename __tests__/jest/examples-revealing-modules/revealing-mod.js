"use strict";

// create a revealing module and test it with Jest

var Greeting = (function() {
	// PRIVATE

	let privateVar = 1;

	function sum(a, b) {
		return a + b;
	}

	function hello() {
		return "hello";
	}

	function goodbye() {
		return "goodbye";
	}

	// PUBLIC
	return {
		hello: hello,
		goodbye: goodbye,
		sum: sum,
		get privateVar() {
			return privateVar;
		},
		set privateVar(value) {
			privateVar = value;
		}
	};
})();



// if running in node, then export module
if (typeof process === 'object') module.exports = Greeting;
// otherwise add as "global" object window for browser / extension
else self.Greeting = Greeting;
