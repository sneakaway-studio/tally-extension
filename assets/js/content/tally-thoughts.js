"use strict";

var Thought = (function() {
	// PRIVATE

	let thoughtOpen = false,
	 	THOUGHT_DEBUG = true;


	/**
	 *	Get a random fact (by domain)
	 */
	function getFact(domain) {
		let r = Math.floor(Math.random() * ThoughtData.facts[domain].length);
		return ThoughtData.facts[domain][r];
	}
	/**
	 *	Show a fact
	 */
	function showFact(fact, sound) {
		console.log("showFact()",fact,sound);
		if (thoughtOpen) return; // if open, exit
		Sound.playMood(sound);
		show(fact.fact);
	}


	/**
	 *	Return a thought
	 */
	function getThought(arr) {
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
		else return false;
	}
	/**
	 *	Show the thought bubble [with text and sound]
	 */
	function showThought(thought,sound) {
		console.log("showThought()",thought,sound);
		if (thoughtOpen) return; // if open, exit
		if (sound) Sound.playMood(thought.mood);
		show(thought.text);
	}



	/**
	 *	Show the thought bubble [with text and sound]
	 */
	function showString(str,sound) {
		console.log("showString()",str,sound);
		if (thoughtOpen) return; // if open, exit
		if (sound) Sound.playMood(sound);
		show(str);
	}




	/**
	 *	Show a thought string
	 */
	function show(str) {
		if (THOUGHT_DEBUG) console.log("show()", str);
		thoughtOpen = true;

		if (str.indexOf("{{type}}") > -1)
			str = templating(str,"type",Monster.current());

		// set number of lines based on str.length
		let lines = 1;
		// 28 characters per line * 2
		if (str.length > 0)
			lines = Math.ceil(str.length / 32);
		// set duration based on number lines
		let duration = lines * 1800;
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
		// hide after appropriate reading period
		setTimeout(hide, duration);
	}

	function hide() {
		//return; //testing
		if (!thoughtOpen) return;
		$('#tally_thought_bubble').css({
			'left': '-500px',
			'display': 'none',
			'opacity': 0
		});
		thoughtOpen = false;
	}


	function templating(string, find, replace) {

		return string.replace(new RegExp('\{\{(?:\\s+)?(' + find + ')(?:\\s+)?\}\}'), replace);

	}


	// PUBLIC
	return {
		getThought: function(arr) {
			return getThought(arr);
		},
		showThought: function(thought, sound) {
			showThought(thought, sound);
		},
		getFact: function(domain) {
			return getFact(domain);
		},
		showFact: function(fact, sound) {
			showFact(fact, sound);
		},
		showString: function(str,sound){
			showString(str, sound);
		},
		show: function(str, sound) {
			show(str, sound);
		},
		hide: hide

	};
})();
