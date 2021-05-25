"use strict";

/**
 *	Import revealing module pattern as ES6 module and test using jest
 * 	run: npm test
 */

// import module
const Mod = require('./fs-numbers.js');


// map
test('map 0.5/1 to 50/100', () => {
	expect(Mod.map(0.5, 0, 1, 0, 100)).toBe(50);
});
// map
test('map 5/10 to 50/100', () => {
	expect(Mod.map(5, 0, 10, 0, 100)).toBe(50);
});
// map
test('map -.5/-1-1 to 25/100', () => {
	expect(Mod.map(-0.5, -1, 1, 0, 100)).toBe(25);
});


// round
test('round to 10', () => {
	expect(Mod.round(10.4999)).toBe(10);
});
// round with precision
test('round to 10.50', () => {
	expect(Mod.round(10.4999, 2)).toBe(10.50);
});
