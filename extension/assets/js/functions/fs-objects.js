"use strict";

/*  OBJECT FUNCTIONS
 ******************************************************************************/


var FS_Object = (function() {


	/*************************** OBJECT *******************************/

	/**
	 *	Make sure a property or method is:
	 *	1. declared
	 *	2. is !== null, undefined, NaN, empty string (""), 0, false
	 *	* like PHP isset()
	 */
	function prop(obj) {
		// console.log("FS_Object.prop()", obj);
		// console.trace();
		if (typeof obj !== 'undefined' && obj && obj !== null) return true;
		else return false;
	}
	/**
	 *	Uses prop() but returns value if true
	 */
	function checkGetProp(obj) {
		// console.log("FS_Object.checkGetProp()", obj);
		// console.trace();
		if (typeof obj !== 'undefined' && obj && obj !== null) return obj;
		else return false;
	}

	/**
	 *	Is an object empty?
	 */
	function isEmpty(obj) {
		for (var x in obj) {
			return false;
		}
		return true;
	}

	/**
	 *	Return the value of the last key of an object
	 *  use like FS_Object.lastKeyValue(GameData.levels).level;
	 */
	function lastKeyValue(obj) {
		return obj[Object.keys(obj)[Object.keys(obj).length - 1]];
	}

	/**
	 *	Count occurances of string in keys
	 */
	function countKeysRegex(obj, str) {
		// return Object.keys(obj).filter((key) => /${str}/.test(key)).length;
		return Object.keys(obj).filter((key) => key.match(new RegExp(str, 'g'))).length;
	}

	/**
	 *	Return number of properties in an object
	 */
	function objLength(obj) {
		return Object.keys(obj).length;
	}

	/**
	 *	Return random key from an object
	 */
	function randomObjKey(obj) {
		var keys = Object.keys(obj);
		return keys[keys.length * Math.random() << 0];
	}

	/**
	 *	Return random property from an object
	 */
	function randomObjProperty(obj) {
		var keys = Object.keys(obj);
		return obj[keys[keys.length * Math.random() << 0]];
	}



	/*************************** ARRAY *******************************/

	/**
	 *	Return random index from array
	 */
	function randomArrayIndex(arr) {
		return arr[Math.floor(Math.random() * arr.length)];
	}

	/**
	 *	Return random index from a segment of array
	 */
	function randomArrayIndexFromRange(arr, min = 0, max = 1) {
		if (max > arr.length) max = arr.length;
		return randomArrayIndex(arr.slice(min, max));
	}
	
	/**
	 *	Return items found in both arrays
	 */
	function returnArrayMatches(arr1, arr2) {
		if (!Array.isArray(arr1) || !Array.isArray(arr2)) return [];
		return arr1.filter(element => arr2.includes(element));
	}

	/**
	 *	Sort an array by occurance of index
	 */
	function sortArrayByOccuranceRemoveDuplicates(arr) {
		var frequency = {};
		// store frequency
		arr.forEach(function(value) {
			frequency[value] = 0;
		});
		var uniques = arr.filter(function(value) {
			return ++frequency[value] == 1;
		});
		return uniques.sort(function(a, b) {
			return frequency[b] - frequency[a];
		});
	}

	/**
	 *	Shuffle and return array
	 */
	function shuffleArray(arr) {
		for (let i = arr.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[arr[i], arr[j]] = [arr[j], arr[i]];
		}
		return arr;
	}

	/**
	 *	Convert an array to an object with <key> as key
	 */
	function convertArrayToObject(arr, key) {
		if (!Array.isArray(arr)) return {};
		var obj = arr.reduce(function(result, item, i) {
			result[item[key]] = item;
			return result;
		}, {});
		return obj;
	}

	/**
	 *	Remove duplicates from an array
	 */
	function removeArrayDuplicates(array_) {
		var ret_array = [];
		for (var a = array_.length - 1; a >= 0; a--) {
			for (var b = array_.length - 1; b >= 0; b--) {
				if (array_[a] == array_[b] && a != b) {
					delete array_[b];
				}
			}
			if (array_[a] != undefined)
				ret_array.push(array_[a]);
		}
		return ret_array;
	}


	// PUBLIC
	return {
		prop: prop,
		checkGetProp: checkGetProp,
		isEmpty: isEmpty,
		objLength: objLength,
		randomObjKey: randomObjKey,
		randomObjProperty: randomObjProperty,
		countKeysRegex: countKeysRegex,
		lastKeyValue: lastKeyValue,

		randomArrayIndex: randomArrayIndex,
		randomArrayIndexFromRange: randomArrayIndexFromRange,
		returnArrayMatches: returnArrayMatches,
		convertArrayToObject: convertArrayToObject,
		sortArrayByOccuranceRemoveDuplicates: sortArrayByOccuranceRemoveDuplicates,
		shuffleArray: shuffleArray,
		removeArrayDuplicates: removeArrayDuplicates,
	};
})();

// if running in node, then export module
if (typeof process === 'object') module.exports = FS_Object;
// otherwise add as "global" object window for browser / extension
else window.FS_Object = FS_Object;
