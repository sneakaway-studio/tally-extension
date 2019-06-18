"use strict";

window.Thought = (function() {
	// PRIVATE

	let thoughtOpen = false,
		DEBUG = false;


	/**
	 *	Get a random fact (by domain)
	 */
	function getFact(domain) {
		try {
			let r = Math.floor(Math.random() * ThoughtData.facts[domain].length);
			return ThoughtData.facts[domain][r];
		} catch(err){
			console.error(err);
		}
	}
	/**
	 *	Show a fact
	 */
	function showFact(fact, sound, ifOpenUpdate) {
		try {
			if (DEBUG) console.log("💭 showFact()", fact, sound, ifOpenUpdate);
			if (ifOpenUpdate) thoughtOpen = false; // override ifOpenUpdate = true
			if (thoughtOpen) return; // if open, exit
			Sound.playMood(sound);
			show(fact.fact);
		} catch(err){
			console.error(err);
		}
	}

	function showTrackerThought() {
		try {
			let num = "none";
			if (pageData.trackers.length > 0) num = "few";
			if (pageData.trackers.length > 3) num = "lots";
			if (DEBUG) console.log("💭 showTrackerThought()", num);
			showThought(getThought(["tracker", num, 0]), true);
		} catch(err){
			console.error(err);
		}
	}

	/**
	 *	Return a thought
	 */
	function getThought(arr) {
		try {
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
		} catch(err){
			console.error(err);
		}
	}
	/**
	 *	Show the thought bubble [with text and sound]
	 */
	function showThought(thought, sound, ifOpenUpdate) {
		try {
			if (DEBUG) console.log("💭 Thought.showThought()", thought, sound, ifOpenUpdate);
			if (ifOpenUpdate) thoughtOpen = false; // override ifOpenUpdate = true
			if (thoughtOpen) return; // else if open, then exit
			if (sound) Sound.playMood(thought.mood);
			show(thought.text);
		} catch(err){
			console.error(err);
		}
	}



	/**
	 *	Show the thought bubble [with text and sound]
	 */
	function showString(str, sound, ifOpenUpdate) {
		try {
			if (DEBUG) console.log("💭 Thought.showString()", str, sound, ifOpenUpdate);
			if (ifOpenUpdate) thoughtOpen = false; // true = update even if open
			if (thoughtOpen) return; // if open, exit
			if (sound) Sound.playMood(sound);
			show(str);
		} catch(err){
			console.error(err);
		}
	}

	function random() {
		try {
			// EXAMPLES

			// Thought.showThought(Thought.getThought(["monster", "launch", 0]),true);
			// return;


			let r = Math.random();
			if (r < 0.25)
				// show thought from data, [category/subcategory/0], play sound
				showThought(getThought(["random", "greeting", 0]), true);
			else if (r < 0.5)
				// show thought from data, [category/0/index], play sound
				showThought(getThought(["onboarding", 0, "onboarding3"]), true);
			else if (r < 0.75)
				// show thought from facts, trackers, play sound
				showFact(getFact("trackers"), "neutral", true);
			else
				// show thought <string>, play sound
				showString("this is just a string", "neutral", true);
		} catch(err){
			console.error(err);
		}
	}


	/**
	 *	Show a thought string
	 */
	function show(str) {
		try {
			if (DEBUG) console.log("💭 Thought.show()", str);
			thoughtOpen = true;

			// replace any template strings
			str = searchReplaceTemplateStr(str);

			// set number of lines based on str.length
			let lines = 1;
			// 28 characters per line * 2
			if (str.length > 0)
				lines = Math.ceil(str.length / 28);
			// set duration based on number lines
			let duration = lines * 1950;
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
		} catch(err){
			console.error(err);
		}
	}

	function hide() {
		try {
			//return; //testing
			if (!thoughtOpen) return;
			$('#tally_thought_bubble').css({
				'left': '-500px',
				'display': 'none',
				'opacity': 0
			});
			thoughtOpen = false;
		} catch(err){
			console.error(err);
		}
	}

	/**
	 *	Search and replace any template
	 */
	function searchReplaceTemplateStr(str) {
		try {
			if (DEBUG) console.log("💭 Thought.searchReplaceTemplateStr()", str, Monster.current());
			let find = "",
				replace = "";
			// check for any template replacement matches
			if (str.indexOf("{{Monster.current}}") > -1) {
				find = "Monster.current";
				replace = MonsterData.dataById[Monster.current().mid].name;
				if (FS_String.isVowel(replace[0])) replace = "n "+replace;
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
				str = str.replace(new RegExp('\{\{(?:\\s+)?(' + find + ')(?:\\s+)?\}\}'), "<span class='tally-replace'>" + replace + "</span>");
			// return string
			return str;
		} catch(err){
			console.error(err);
		}
	}


	// PUBLIC
	return {
		getThought: function(arr) {
			return getThought(arr);
		},
		showThought: function(thought, sound, ifOpenUpdate) {
			showThought(thought, sound, ifOpenUpdate);
		},
		getFact: function(domain) {
			return getFact(domain);
		},
		showFact: function(fact, sound, ifOpenUpdate) {
			showFact(fact, sound, ifOpenUpdate);
		},
		showString: function(str, sound, ifOpenUpdate) {
			showString(str, sound, ifOpenUpdate);
		},
		show: function(str, sound) {
			show(str, sound);
		},
		showTrackerThought: showTrackerThought,
		random: random,
		hide: hide

	};
})();
