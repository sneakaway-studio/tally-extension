"use strict";

/*  OBJECT FUNCTIONS
 ******************************************************************************/


window.FS_Object = (function() {

	function prop(obj){
		if (typeof obj !== 'undefined' && obj && obj !== null) return true;
		else return false;
	}

	/**
	 *	Return the value of the last key of an object
	 *  use like FS_Object.lastKeyValue(GameData.levels).level;
	 */
	function lastKeyValue(obj) {
		return obj[Object.keys(obj)[Object.keys(obj).length - 1]];
	}

	/**
	 *	Return random property from an object
	 */
	function randomObjProperty(obj) {
		var keys = Object.keys(obj);
		return obj[keys[keys.length * Math.random() << 0]];
	}

	/**
	 *	Return random index from array
	 */
	var randomArrayIndex = function(arr) {
		return arr[Math.floor(Math.random() * arr.length)];
	};

	/**
	 *	Is an object empty?
	 */
	function isEmpty(obj) {
		for (var x in obj) { return false; }
		return true;
	}


	// PUBLIC
	return {
		prop: function(obj) {
			return prop(obj);
		},
		randomObjProperty: function(obj) {
			return randomObjProperty(obj);
		},
		randomArrayIndex: function(arr) {
			return randomArrayIndex(arr);
		},
		lastKeyValue: function(obj) {
			return lastKeyValue(obj);
		},
		isEmpty: function(obj){
			return isEmpty(obj);
		}
	};
})();








/**
 *	Make sure a property or method is:
 *	1. declared
 *	2. is !== null, undefined, NaN, empty string (""), 0, false
 *	* like PHP isset()
 */
function prop(val) {
	if (typeof val !== 'undefined' && val && val !== null) {
		return true;
	} else {
		return false;
	}
}



/**
 *	Return random key from an object
 */
var randomObjKey = function(obj) {
	var keys = Object.keys(obj);
	return keys[keys.length * Math.random() << 0];
};

/**
 *	Return number of properties in an object
 */
var objLength = function(obj) {
	return Object.keys(obj).length;
};



/**
 *	Convert an array to an object with <key> as key
 */
function convertArrayToObject(arr, key) {
	var obj = arr.reduce(function(result, item, i) {
		result[item[key]] = item;
		return result;
	}, {});
	return obj;
}

/**
 *	Remove duplicates from an array
 */
function removeDuplicates(array_) {
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
