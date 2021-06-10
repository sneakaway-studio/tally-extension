"use strict";

/**
 *	Import revealing module pattern as ES6 module and test using jest
 * 	run: npm test
 */

// import module
const Mod = require('./fs-objects.js');

/*************************** OBJECT *******************************/

//1.

// prop
test('prop function', () => {
  var fruit = {type:"grape", color:"green"};
	expect(Mod.prop(fruit)).toBe(true);
});

//2.

// is empty
test('obj is empty', () => {
  var fruit = {};
	expect(Mod.isEmpty(fruit)).toBe(true);
});
// is not empty
test('obj is not empty', () => {
  var fruit = {type:"grape", color:"green"};
	expect(Mod.isEmpty(fruit)).toBe(false);
});

//3.

// lastKeyValue -> "green"
test('last key value of obj', () => {
  var fruit = {type:"grape", color:"green"};
	expect(Mod.lastKeyValue(fruit)).toBe("green");
});
// lastKeyValue -> "big"
test('last key value of obj', () => {
  var fruit = {type:"grape", color:"green", size:"big"};
	expect(Mod.lastKeyValue(fruit)).toBe("big");
});

//4.

// countKeysRegex -> 1
test('countKeysRegex of object with 2 unique keys', () => {
  var fruit = {type:"grape", color:"green"};
	expect(Mod.countKeysRegex(fruit,"olor")).toBe(1);
});
// countKeysRegex -> 3
test('countKeysRegex of object with 3 keys that all contain ock', () => {
  var fruit = {rock:"grape", sock:"grape", mock:"grape"};
	expect(Mod.countKeysRegex(fruit,"ock")).toBe(3);
});

//5.

// objLength -> 2
test('length of unique keys in object', () => {
  var fruit = {type:"grape", color:"green red"};
	expect(Mod.objLength(fruit)).toBe(2);
});
// objLength -> 1
test('length of unique keys in object', () => {
  var fruit = {type:"grape", type:"green red", type: "blue", type:"orange"};
	expect(Mod.objLength(fruit)).toBe(1);
});

//6.

// randomObjKey
test('random key in object', () => {
  var fruit = {type:"grape", color:"green red"};
  const randKey = Mod.randomObjKey(fruit)
  var bool = false
  if(randKey in fruit){
    bool = true
  }
	expect(bool).toEqual(true);
});
// randomObjKey
test('random key in object', () => {
  var rainbow = {red:"color", orange:"color", yellow: "color", green:"color", blue:"color", purple:"color"};
  const randKey = Mod.randomObjKey(rainbow)
  var bool = false
  if(randKey in rainbow){
    bool = true
  }
	expect(bool).toEqual(true);
});

//7.

// randomObjProperty
test('random property in object', () => {
  var fruit = {type:"grape", color:"green red"};
  const randProp = Mod.randomObjProperty(fruit)
  var bool = false
  Object.keys(fruit).forEach(function(key){
    if(fruit[key] == randProp){
      bool = true
    }
  })
	expect(bool).toEqual(true);
});
// randomObjProperty
test('random property in object', () => {
  var car = {type:"suv", color:"red", brand: "honda"};
  const randProp = Mod.randomObjProperty(car)
  var bool = false
  Object.keys(car).forEach(function(key){
    if(car[key] == randProp){
      bool = true
    }
  })
	expect(bool).toEqual(true);
});


/*************************** ARRAY *******************************/

//1.

// rand index
test('random index of array', () => {
  var fruits = ["apple","orange","banana","grapes","watermelon"];
  const index = Mod.randomArrayIndex(fruits);
	expect(fruits).toContain(index);
});

//2.

// rand index from subsection of array
test('random index from a segment of the array', () => {
  var fruits = ["apple","orange","banana","grapes","watermelon"];
  const index = Mod.randomArrayIndexFromRange(fruits,0,2)
	expect(fruits.slice(0,2)).toContain(index);
});

// rand index from subsection of array
test('random index from a segment of the array', () => {
  var fruits = ["apple","orange","banana","grapes","watermelon"];
  const index = Mod.randomArrayIndexFromRange(fruits,2,4)
	expect(fruits.slice(2,4)).toContain(index);
});

//3.

// sort array by occurance and remove duplicates
test('sort array by occurance and remove duplicates', () => {
  var fruits = ["apple","orange","apple"];
  const sorted = Mod.sortArrayByOccuranceRemoveDuplicates(fruits)
	expect(sorted).toEqual(["apple","orange"]);
});

// sort array by occurance and remove duplicates
test('sort array by occurance and remove duplicates', () => {
  var fruits = ["apple","orange","apple","grape","orange","apple","banana"];
  const sorted = Mod.sortArrayByOccuranceRemoveDuplicates(fruits)
	expect(sorted).toEqual(["apple","orange","grape","banana"]);
});

//4.

// shuffle array
test('shuffle array', () => {
  var fruits = ["apple","orange"];
  const shuffled = Mod.shuffleArray(fruits)
	expect(fruits).toEqual(
    expect.arrayContaining(shuffled),
  );
});

// shuffle array
test('shuffle array', () => {
  var fruits = ["apple","orange","banana","grapes","watermelon"];
  const shuffled = Mod.shuffleArray(fruits)
  expect(fruits).toEqual(
    expect.arrayContaining(shuffled),
  );
});

//5.

// convert array to an object
test('convert an array to an object', () => {
  var food = [{fruit: "apple", vegetable: "carrot"},{fruit: "orange", vegetable: "celery"}];
  const object = Mod.convertArrayToObject(food,"fruit")
	expect(object).toMatchObject({apple: {fruit: "apple", vegetable: "carrot"}, orange: {fruit: "orange", vegetable: "celery"}})
});

// convert array to an object
test('convert an array to an object', () => {
  var food = [{fruit: "apple", vegetable: "carrot"},{fruit: "orange", vegetable: "celery"}];
  const object = Mod.convertArrayToObject(food,"vegetable")
	expect(object).toMatchObject({carrot: {fruit: "apple", vegetable: "carrot"}, celery: {fruit: "orange", vegetable: "celery"}})
});

//6.

// remove duplicates from array
test('remove duplicate elements from array', () => {
  var fruits = ["apple","apple","orange","orange","banana","banana"];
  const removedDuplicates = Mod.removeArrayDuplicates(fruits)
	expect(removedDuplicates).toHaveLength(3)
});

// remove duplicates from array
test('remove duplicate elements from array', () => {
  var fruits = ["apple","orange","apple","grape","orange","apple","banana"];
  const removedDuplicates = Mod.removeArrayDuplicates(fruits)
	expect(removedDuplicates).toHaveLength(4)
});
