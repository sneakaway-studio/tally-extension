/*jshint esversion: 6 */

var Thoughts = (function() {
	// PRIVATE

	// all the thoughts go in "data"
	// it is an object, a hierarchical data type
	var data = {
		// For monsters, Tally Could say something like
		// 		"You found a <monster-name-from-monster-spreadsheet> !!"
		// but she could also say something special about each one
		"monsters": {
			"006-suv":"Say something special about this monster?"
		},
		// the first level in the hierarchy is the "category"
		"narrative": {
			// the next level in the hierarchy could either be a single index, like this one
			"story1":"My story is ...",
			"story2":"Long ago I ..."
		},
		// things related to the page
		"page": {

		},
		"player": {
			// or if the index is an array "[]", the app would pick a random one from the list
			"complements":[
				"Nice clicking!!",
				"I would totally click that"
			]
		},
		// these are random remarks
		"random": {
			"hello": "hello world! 😀",
			"funny":[
				"Haha!",
				"Fun fact ...",
				"Hello?",
				"How are you?",
				"Leaving so soon?",
				"Pay attention",
				"Sad",
				"Watch out!"
			]
		},
		"trackers":{
			"lots":[
				"There are a lot of trackers on this page.",
				"Careful, there are trackers nearby.",
				"No, but seriously it's getting kind of creepy around here.",
				"I think I saw a product monster.",
				"This place makes me nervous."
			],
			"few":[
				"There are only a few trackers on this page"
			],
			"none":[
				"There are no trackers on this page"
			],
		}
	};


	function getThought (category,index){
		let d = data[category][index];
		if (Array.isArray(d)){
			let r = Math.floor(Math.random()*d.length);
			return data[category][index][r];
		}
		// else its a string
		else if (typeof d === 'string')
			return data[category][index];
	}

	// PUBLIC
	return {
		thought: function(category,index) {
			return getThought(category,index);
		}

	};
})();
