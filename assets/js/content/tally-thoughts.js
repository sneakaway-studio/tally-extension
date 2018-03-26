"use strict";

var Thought = (function() {
	// PRIVATE

	var thoughtOpen = false;


	function show(str) {
		// set number of lines based on str.length
		let lines = 1;
		// 28 characters per line * 2
		if (str.length > 0)
			lines = Math.ceil(str.length / 32);
		// set duration based on number lines
		let duration = lines * 1800;

		console.log("showThought()", type, reference, _sound, str, duration, lines);

		// add text
		$('#tally_thought').html(str);

		// adjust size of the box
		$('#tally_thought_bubble').css({
			'display': 'flex',
			'height': lines * 32 + "px",
			'left': '10px',
			'opacity': 1 // make it visible
		});
		// make Tally look at user
		Tally.stare();
		//console.log("lines",lines)
		thoughtOpen = true;
		// hide after appropriate reading period
		setTimeout(hideThought, duration);
	}

	/**
	 *	Show the thought bubble [with text and sound]
	 */
	function showThought(type, reference, playSound = false, sound = "") {
		if (thoughtOpen) return; // if open, exit
		//console.log("showThought()", type, reference, _sound);

		let thought = {},
			str = "";

		if (type == "data") {
			thought = getFromData(reference);
			str = thought.text;
			sound = thought.mood;
		} else if (type == "facts") {
			thought = getFromFacts(reference);
			str = reference;
		} else if (type == "string") {
			str = reference;
		}

		if (playSound && sound) {
			//Sound.test("tally", "thought-basic-open");
			Sound.playMood(sound);
		}
		// otherwise just store it and move on
		else if (typeof reference === 'string') {
			str = reference;
			if (sound && typeof sound === 'string')
				Sound.playMood(sound);
		}


	}

	function hideThought(sound = false) {
		return; //testing
		if (!thoughtOpen) return;
		$('#tally_thought_bubble').css({
			'left': '-500px',
			'display': 'none',
			'opacity': 0
		});
		thoughtOpen = false;
	}

	function getFromFacts(arr) {
		console.log("getFromFacts()", arr);
		// make sure it is an array
		if (!Array.isArray(arr)) return;
		let domain = ThoughtData.facts[arr[0]];
		let r = Math.floor(Math.random() * domain);
		return domain[r];
	}

	// return thought text
	function getFromData(arr) {
		console.log("getFromData()", arr);
		// make sure it is an array
		if (!Array.isArray(arr)) return;

		// get category
		let category = ThoughtData.data[arr[0]];

		// if there is a subcategory then select random
		if (arr[1]) {
			let subcategory = arr[1];
			if (category[subcategory].length < 1) return;
			let r = Math.floor(Math.random() * category[subcategory].length);
			return category[subcategory][r];
		}
		// if there is no subcategory, then get by index
		else if (arr[2]) {
			let index = arr[2];
			return category[index];
		}
		// otherwise
		else return "";
	}

	// PUBLIC
	return {
		get: function(category, index) {
			return getThought(category, index);
		},
		show: function(type, str, sound) {
			showThought(type, str, sound);
		},
		getFromData: function(reference) {
			getFromData(reference);
		},
		getFromFacts: function(reference) {
			getFromFacts(reference);
		},
		hide: hideThought

	};
})();
