"use strict";

var Thought = (function() {
	// PRIVATE

	var thoughtOpen = false;



	/**
	 *	Show the thought bubble [with text and sound]
	 */
	function showThought(reference, sound=false) {
		if (thoughtOpen) return; // if open, exit
		console.log("showThought()", reference, sound);

		// for holding the text
		let thought = {}, str = "";

		// if Array then getThought()
		if (Array.isArray(reference)) {
			thought = getThought(reference);
			str = thought.text;
			if (sound && thought.mood)
				//Sound.test("tally", "thought-basic-open");
				Sound.playMood(thought.mood);
		}
		// otherwise just store it and move on
		else if (typeof reference === 'string') {
			str = reference;
			if (sound && typeof sound === 'string')
				Sound.playMood(sound);
		}

		// set number of lines based on str.length
		let lines = 1;
		// 28 characters per line * 2
		if (str.length > 0)
			lines = Math.ceil(str.length / 32);
		// set duration based on number lines
		let duration = lines * 1800;

		console.log("showThought", str, duration, lines);

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

	function hideThought(sound = false) {
		return;
		if (!thoughtOpen) return;
		$('#tally_thought_bubble').css({
			'left': '-500px',
			'display': 'none',
			'opacity': 0
		});
		thoughtOpen = false;
	}

	// return thought text
	function getThought(arr) {
		console.log("getThought()", arr);
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
		show: function(str, lines, duration, sound) {
			showThought(str, lines, duration, sound);
		},
		hide: hideThought

	};
})();
