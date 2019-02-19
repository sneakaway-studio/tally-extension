"use strict";

/*  COOKIE
 ******************************************************************************/

var Cookie = (function() {
	// PRIVATE

	var types = [
		"health", "manna"
	];

	function createNew() {
		var obj = {
			type: types[Math.floor(Math.random() * types.length)], //
			duration: -1, // -1, 0, 2000
			value: 0, // power of cookie,
			effects: "", // what does it affect
			icon: ""
		};
		if (obj.type == "health") {
			obj.value = Math.random();
			obj.effect = "hp";
		} else if (obj.type == "manna") {
			obj.value = Math.random();
			obj.effect = "xp";
		}

		return obj;
	}




	// add cookie to a page
	function generate() {
		var cookie = createNew();
		// position

	}

	// user has clicked a cookie
	function pickup() {

	}

	// use the cookie
	function use() {

	}







	// PUBLIC
	return {

	};
})();
