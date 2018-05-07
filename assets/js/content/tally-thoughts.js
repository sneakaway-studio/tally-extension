"use strict";

var Thought = (function() {
	// PRIVATE

	let thoughtOpen = false,
		THOUGHT_DEBUG = false;


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
		if (THOUGHT_DEBUG) console.log("💬 💬 showFact()", fact, sound);
		if (thoughtOpen) return; // if open, exit
		Sound.playMood(sound);
		show(fact.fact);
	}

	function showTrackerThought(){
		let num = "none";
		if (pageData.trackers.length > 0) num = "few";
		if (pageData.trackers.length > 3) num = "lots";
		console.log("💬 💬 showTrackerThought()", num);
		showThought(getThought(["tracker", num, 0]), true);
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
	function showThought(thought, sound, ifOpen) {
		if (THOUGHT_DEBUG) console.log("💬 💬 Thought.showThought()", thought, sound, ifOpen);
		if (ifOpen) thoughtOpen = false; // override ifOpen = true
		if (thoughtOpen) return; // else if open, then exit
		if (sound) Sound.playMood(thought.mood);
		show(thought.text);
	}



	/**
	 *	Show the thought bubble [with text and sound]
	 */
	function showString(str, sound) {
		if (THOUGHT_DEBUG) console.log("💬 💬 Thought.showString()", str, sound);
		if (thoughtOpen) return; // if open, exit
		if (sound) Sound.playMood(sound);
		show(str);
	}




	/**
	 *	Show a thought string
	 */
	function show(str) {
		if (THOUGHT_DEBUG) console.log("💬 💬 Thought.show()", str);
		thoughtOpen = true;

		// replace any template strings
		str = searchReplaceTemplateStr(str);

		// set number of lines based on str.length
		let lines = 1;
		// 28 characters per line * 2
		if (str.length > 0)
			lines = Math.ceil(str.length / 28);
		// set duration based on number lines
		let duration = lines * 1800;
		// add text
		$('#tally_thought').html(str);
		// adjust size of the box
		$('#tally_thought_bubble').css({
			'display': 'flex',
			'height': (lines * 12) + 26 + "px",
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

	/**
	 *	Search and replace any template
	 */
	function searchReplaceTemplateStr(str) {
		let find = "",
			replace = "";
		// check for any template replacement matches
		if (str.indexOf("{{Monster.current}}") > -1) {
			find = "Monster.current";
			replace = MonsterData.dataById[Monster.current()].name;
		}
		if (str.indexOf("{{pageData.title}}") > -1) {
			find = "pageData.title";
			replace = pageData.title;
		}
		if (str.indexOf("{{pageData.browser.name}}") > -1) {
			find = "pageData.browser.name";
			replace = pageData.browser.name;
		}
		// perform replacement
		if (find != "" && replace != "")
			str = str.replace(new RegExp('\{\{(?:\\s+)?(' + find + ')(?:\\s+)?\}\}'), "<span class='tally-replace'>"+ replace +"</span>");
		// return string
		return str;
	}


	// PUBLIC
	return {
		getThought: function(arr) {
			return getThought(arr);
		},
		showThought: function(thought, sound, ifOpen) {
			showThought(thought, sound, ifOpen);
		},
		getFact: function(domain) {
			return getFact(domain);
		},
		showFact: function(fact, sound) {
			showFact(fact, sound);
		},
		showString: function(str, sound) {
			showString(str, sound);
		},
		show: function(str, sound) {
			show(str, sound);
		},
		showTrackerThought: showTrackerThought,
		hide: hide

	};
})();
