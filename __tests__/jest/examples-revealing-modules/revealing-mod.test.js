"use strict";

const rootDir = `../../../`;


// TEST revealing module pattern "modules" in a chrome "mock" using jest

// requires jest.config.js and chrome setup in jest.setup.js

// - to test this specific file run
// 		node /usr/local/bin/jest -i revealing-mod.test.js


// 1. import revealing module pattern file
const Greeting = require('./revealing-mod.js');
// run tests
test('adds 1 + 2 to equal 3', () => {
	expect(Greeting.sum(1, 2)).toBe(3);
});
test('test a setter', () => {
	Greeting.privateVar = 2;
	expect(Greeting.privateVar).toBe(2);
});







// example async test structure
//
// (async () => {
//
//
// 	var T = await require(`${rootDir}extension/assets/js/background/t.js`);
//
// 	test('Get a new badge', async () => {
//
// 		var Badge = await require(`${rootDir}extension/assets/js/content/badge.js`);
// 		var obj = Badge.get("fomo");
// 		console.log(obj);
// 		expect(obj).toBe(3);
// 	});
//
// })().catch(err => {
//     console.error(err);
// });
