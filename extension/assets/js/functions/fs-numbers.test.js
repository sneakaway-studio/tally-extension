"use strict";

/**
 *	Import revealing module pattern as ES6 module and test using jest
 * 	run: npm test
 */

// import module
const Mod = require('./fs-numbers.js');




// isNumber() -> 0
test('isNumber() -> 0', () => {
	expect(Mod.isNumber(0)).toBe(true);
});
// isNumber() -> 1.23
test('isNumber() -> 1.23', () => {
	expect(Mod.isNumber(1.23)).toBe(true);
});
// isNumber() -> ""
test('isNumber() -> ""', () => {
	expect(Mod.isNumber("")).toBe(false);
});



// isOdd() -> 0
test('isOdd() -> 0', () => {
	expect(Mod.isOdd(0)).toBe(false);
});
// isOdd() -> 1
test('isOdd() -> 1', () => {
	expect(Mod.isOdd(1)).toBe(true);
});
// isOdd() -> 2
test('isOdd() -> 2', () => {
	expect(Mod.isOdd(2)).toBe(false);
});
// isOdd() -> ""
test('isOdd() -> ""', () => {
	expect(Mod.isOdd("")).toBe(false);
});


// isEven() -> 0
test('isEven() -> 0', () => {
	expect(Mod.isEven(0)).toBe(true);
});
// isEven() -> 1
test('isEven() -> 1', () => {
	expect(Mod.isEven(1)).toBe(false);
});
// isEven() -> 2
test('isEven() -> 2', () => {
	expect(Mod.isEven(2)).toBe(true);
});
// isEven() -> ""
test('isEven() -> ""', () => {
	expect(Mod.isEven("")).toBe(false);
});



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
// map results in undefined
test('map -.5/-1-1 to 25/100', () => {
	expect(Mod.map(-0.5, -1, 1, 0, 100)).toBe(25);
});


//2.

// round
test('round to 10', () => {
	expect(Mod.round(10.4999)).toBe(10);
});
// round with precision
test('round to 10.50', () => {
	expect(Mod.round(10.4999, 2)).toBe(10.50);
});

//3.

// clamp lower bound
test('clamp to 0', () => {
	expect(Mod.clamp(-1,0,1)).toBe(0);
});
// clamp upper bound
test('clamp to 1', () => {
	expect(Mod.clamp(2,0,1)).toBe(1);
});
// clamp in between
test('clamp to .5', () => {
	expect(Mod.clamp(0.5,0,1)).toBe(0.5);
});

//4.

// normalize positives
test('normalize 5', () => {
	expect(Mod.normalize(5,0,1)).toBe(5);
});
// normalize negatives
test('normalize -5', () => {
	expect(Mod.normalize(-5,-1,3)).toBe(-1);
});

//5.

// randomFloatBetween positives
test('random float between 5 10', () => {
  const num = Mod.randomFloatBetween(5.0,10.0);
	expect(num).toBeLessThanOrEqual(10.0);
  expect(num).toBeGreaterThanOrEqual(5.0);
});
// randomFloatBetween negatives
test('random integer between -5 -10', () => {
  const num = Mod.randomFloatBetween(-5.0,-10.0);
	expect(num).toBeLessThanOrEqual(-5.0);
  expect(num).toBeGreaterThanOrEqual(-10.0);
});

//6.

// randomIntBetween positives
test('random integer between 5 10', () => {
  const num = Mod.randomIntBetween(5,10);
	expect(num).toBeLessThanOrEqual(10);
  expect(num).toBeGreaterThanOrEqual(5);
});
// randomIntBetween negatives
test('random integer between -5 -10', () => {
  const num = Mod.randomIntBetween(-5,-10);
	expect(num).toBeLessThanOrEqual(-5);
  expect(num).toBeGreaterThanOrEqual(-10);
});

//7.

// randomPosNeg between -5 and 5
test('random positive or negative number', () => {
  const num = Mod.randomPosNeg(5);
	expect(num).toBeLessThanOrEqual(5);
  expect(num).toBeGreaterThanOrEqual(-5);
});

//8.

// operation '+'
test('addition operation', () => {
  expect(Mod.operation(1,1,"+")).toBe(2);
});
// operation '-'
test('subtraction operation', () => {
  expect(Mod.operation(1,1,"-")).toBe(0);
});
// operation '*'
test('multiplication operation', () => {
  expect(Mod.operation(1,1,"*")).toBe(1);
});
// operation '/'
test('division operation', () => {
  expect(Mod.operation(1,1,"/")).toBe(1);
});

//9.

// compareVersionStrings outdated
test('outdated version', () => {
  expect(Mod.compareVersionStrings("1.2","1.2.3")).toBe(-1);
});
// compareVersionStrings up to date
test('up to date version', () => {
  expect(Mod.compareVersionStrings("1.2.3","1.2.3")).toBe(0);
});
// compareVersionStrings is ahead
test('ahead of version', () => {
  expect(Mod.compareVersionStrings("1.2.3","1.2.2")).toBe(1);
});
