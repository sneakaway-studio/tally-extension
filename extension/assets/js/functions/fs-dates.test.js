"use strict";

/**
 *	Import revealing module pattern as ES6 module and test using jest
 * 	run: npm test
 */

// import module
const Mod = require('./fs-dates.js');

//1.

// get current time
test('gets current time', () => {
  const currentTime = Mod.time()
	expect(currentTime).toContain(":");
});
