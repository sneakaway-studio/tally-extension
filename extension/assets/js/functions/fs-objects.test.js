"use strict";

/**
 *	Import revealing module pattern as ES6 module and test using jest
 * 	run: npm test
 */

// import module
const Mod = require('./fs-objects.js');

/*************************** OBJECT *******************************/

// false
test('prop() -> undefined === false', () => {
	var fruit;
	expect(Mod.prop(fruit)).toBe(false);
});
test('prop() -> NaN === false', () => {
	var fruit = NaN;
	expect(Mod.prop(fruit)).toBe(false);
});
test('prop() -> "" === false', () => {
	var fruit = "";
	expect(Mod.prop(fruit)).toBe(false);
});
test('prop() -> null === false', () => {
	var fruit = null;
	expect(Mod.prop(fruit)).toBe(false);
});
// true
test('prop() -> true === true', () => {
	var fruit = true;
	expect(Mod.prop(fruit)).toBe(true);
});
test('prop() -> 1 === true', () => {
	var fruit = 1;
	expect(Mod.prop(fruit)).toBe(true);
});
test('prop() -> {} === true', () => {
	var fruit = {};
	expect(Mod.prop(fruit)).toBe(true);
});
test('prop() -> { ... } === true', () => {
	var fruit = {
		type: "grape",
		color: "green"
	};
	expect(Mod.prop(fruit)).toBe(true);
});



// checkGetProp() -> false
test('checkGetProp() -> undefined === false', () => {
	var fruit;
	expect(Mod.checkGetProp(fruit)).toBe(false);
});
// checkGetProp() -> 123
test('checkGetProp() -> undefined === false', () => {
	var fruit = 123;
	expect(Mod.checkGetProp(fruit)).toEqual(123);
});



// isEmpty() -> is empty
test('obj is empty', () => {
	var fruit = {};
	expect(Mod.isEmpty(fruit)).toBe(true);
});
// isEmpty() -> is not empty
test('obj is not empty', () => {
	var fruit = {
		type: "grape",
		color: "green"
	};
	expect(Mod.isEmpty(fruit)).toBe(false);
});



// lastKeyValue() -> "green"
test('last key value of obj', () => {
	var fruit = {
		type: "grape",
		color: "green"
	};
	expect(Mod.lastKeyValue(fruit)).toBe("green");
});
// lastKeyValue() -> "big"
test('last key value of obj', () => {
	var fruit = {
		type: "grape",
		color: "green",
		size: "big"
	};
	expect(Mod.lastKeyValue(fruit)).toBe("big");
});



// countKeysRegex() -> 1 === 1
test('countKeysRegex of object with 2 unique keys', () => {
	var fruit = {
		type: "grape",
		color: "green"
	};
	expect(Mod.countKeysRegex(fruit, "olor")).toBe(1);
});
// countKeysRegex() -> 3 === 3
test('countKeysRegex of object with 3 keys that all contain ock', () => {
	var fruit = {
		rock: "grape",
		sock: "grape",
		mock: "grape"
	};
	expect(Mod.countKeysRegex(fruit, "ock")).toBe(3);
});



// objLength() -> 2 === 2
test('length of unique keys in object', () => {
	var fruit = {
		type: "grape",
		color: "green red"
	};
	expect(Mod.objLength(fruit)).toBe(2);
});
// objLength() -> 1 === 1
test('length of unique keys in object', () => {
	var fruit = {
		type: "grape"
	};
	expect(Mod.objLength(fruit)).toBe(1);
});
// objLength() -> 4 === 4
test('length of unique keys in object', () => {
	var fruit = {
		type1: "grape",
		type2: "green red",
		type3: "blue",
		type4: "orange"
	};
	expect(Mod.objLength(fruit)).toBe(4);
});



// randomObjKey()
test('random key in object', () => {
	var fruit = {
		type: "grape",
		color: "green red"
	};
	const randKey = Mod.randomObjKey(fruit);
	var bool = false;
	if (randKey in fruit)
		bool = true;
	expect(bool).toEqual(true);
});
// randomObjKey()
test('random key in object', () => {
	var rainbow = {
		red: "color",
		orange: "color",
		yellow: "color",
		green: "color",
		blue: "color",
		purple: "color"
	};
	const randKey = Mod.randomObjKey(rainbow);
	var bool = false;
	if (randKey in rainbow)
		bool = true;
	expect(bool).toEqual(true);
});



// randomObjProperty()
test('random property in object', () => {
	var fruit = {
		type: "grape",
		color: "green red"
	};
	const randProp = Mod.randomObjProperty(fruit);
	var bool = false;
	Object.keys(fruit).forEach(function(key) {
		if (fruit[key] == randProp) {
			bool = true;
		}
	});
	expect(bool).toEqual(true);
});
// randomObjProperty()
test('random property in object', () => {
	var car = {
		type: "suv",
		color: "red",
		brand: "honda"
	};
	const randProp = Mod.randomObjProperty(car);
	var bool = false;
	Object.keys(car).forEach(function(key) {
		if (car[key] == randProp) {
			bool = true;
		}
	});
	expect(bool).toEqual(true);
});


/*************************** ARRAY *******************************/



// randomArrayIndex()
test('random index of array', () => {
	var fruits = ["apple", "orange", "banana", "grapes", "watermelon"];
	const index = Mod.randomArrayIndex(fruits);
	expect(fruits).toContain(index);
});


// randomArrayIndexFromRange() in 0-2
test('random index from a segment of the array', () => {
	var fruits = ["apple", "orange", "banana", "grapes", "watermelon"];
	const index = Mod.randomArrayIndexFromRange(fruits, 0, 2);
	expect(fruits.slice(0, 2)).toContain(index);
});
// randomArrayIndexFromRange() in 2-4
test('random index from a segment of the array', () => {
	var fruits = ["apple", "orange", "banana", "grapes", "watermelon"];
	const index = Mod.randomArrayIndexFromRange(fruits, 2, 4);
	expect(fruits.slice(2, 4)).toContain(index);
});


// returnArrayMatches() -> find match
test('random index from a segment of the array', () => {
	var fruits1 = ["apple", "banana", "grapes", "orange", "watermelon"];
	var fruits2 = ["apple", "pears", "watermelon"];
	const matches = Mod.returnArrayMatches(fruits1, fruits2);
	expect(matches).toEqual(["apple", "watermelon"]);
});
// returnArrayMatches() -> return empty []
test('random index from a segment of the array', () => {
	var fruits1 = ["apple", "banana", "grapes", "orange", "watermelon"];
	var fruits2 = ["pears"];
	const matches = Mod.returnArrayMatches(fruits1, fruits2);
	expect(matches).toEqual([]);
});
// returnArrayMatches() -> return empty []
test('random index from a segment of the array', () => {
	var fruits1 = ["apple", "banana", "grapes", "orange", "watermelon"];
	var fruits2 = null;
	const matches = Mod.returnArrayMatches(fruits1, fruits2);
	expect(matches).toEqual([]);
});




// sortArrayByOccuranceRemoveDuplicates()
test('sort array by occurance and remove duplicates', () => {
	var fruits = ["apple", "orange", "apple"];
	const sorted = Mod.sortArrayByOccuranceRemoveDuplicates(fruits);
	expect(sorted).toEqual(["apple", "orange"]);
});
// sortArrayByOccuranceRemoveDuplicates()
test('sort array by occurance and remove duplicates', () => {
	var fruits = ["apple", "orange", "apple", "grape", "orange", "apple", "banana"];
	const sorted = Mod.sortArrayByOccuranceRemoveDuplicates(fruits);
	expect(sorted).toEqual(["apple", "orange", "grape", "banana"]);
});



// shuffleArray()
test('shuffle array', () => {
	var fruits = ["apple", "orange"];
	const shuffled = Mod.shuffleArray(fruits);
	expect(fruits).toEqual(
		expect.arrayContaining(shuffled),
	);
});
// shuffleArray()
test('shuffle array', () => {
	var fruits = ["apple", "orange", "banana", "grapes", "watermelon"];
	const shuffled = Mod.shuffleArray(fruits);
	expect(fruits).toEqual(
		expect.arrayContaining(shuffled),
	);
});



// convertArrayToObject()
test('convert an array to an object', () => {
	var food = [{
		fruit: "apple",
		vegetable: "carrot"
	}, {
		fruit: "orange",
		vegetable: "celery"
	}];
	const object = Mod.convertArrayToObject(food, "fruit");
	expect(object).toMatchObject({
		apple: {
			fruit: "apple",
			vegetable: "carrot"
		},
		orange: {
			fruit: "orange",
			vegetable: "celery"
		}
	});
});
// convertArrayToObject()
test('convert an array to an object', () => {
	var food = [{
		fruit: "apple",
		vegetable: "carrot"
	}, {
		fruit: "orange",
		vegetable: "celery"
	}];
	const object = Mod.convertArrayToObject(food, "vegetable");
	expect(object).toMatchObject({
		carrot: {
			fruit: "apple",
			vegetable: "carrot"
		},
		celery: {
			fruit: "orange",
			vegetable: "celery"
		}
	});
});



// removeArrayDuplicates()
test('remove duplicate elements from array', () => {
	var fruits = ["apple", "apple", "orange", "orange", "banana", "banana"];
	const removedDuplicates = Mod.removeArrayDuplicates(fruits);
	expect(removedDuplicates).toHaveLength(3);
});
// removeArrayDuplicates()
test('remove duplicate elements from array', () => {
	var fruits = ["apple", "orange", "apple", "grape", "orange", "apple", "banana"];
	const removedDuplicates = Mod.removeArrayDuplicates(fruits);
	expect(removedDuplicates).toHaveLength(4);
});
