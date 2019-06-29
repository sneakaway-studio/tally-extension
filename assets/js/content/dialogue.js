"use strict";

window.Dialogue = (function() {
	// PRIVATE

	let DEBUG = true,
		dialogueOpen = false,
		_active,
		_queue = [];

	/**
	 *	Get a random fact (by domain)
	 */
	function getFact(domain) {
		try {
			let r = Math.floor(Math.random() * DialogueData.facts[domain].length);
			return DialogueData.facts[domain][r];
		} catch (err) {
			console.error(err);
		}
	}
	/**
	 *	Show a fact
	 */
	function showFact(fact, sound, ifOpenUpdate) {
		try {
			if (DEBUG) console.log("💭 showFact()", fact, sound, ifOpenUpdate);
			if (ifOpenUpdate) dialogueOpen = false; // override ifOpenUpdate = true
			if (dialogueOpen) return; // if open, exit
			Sound.playMood(sound);
			show(fact.fact);
		} catch (err) {
			console.error(err);
		}
	}

	function showTrackerDialogue() {
		try {
			let num = "none";
			if (pageData.trackers.length > 0) num = "few";
			if (pageData.trackers.length > 3) num = "lots";
			if (DEBUG) console.log("💭 showTrackerDialogue()", num);
			showDialogue(getDialogue(["tracker", num, 0]), true);
		} catch (err) {
			console.error(err);
		}
	}

	/**
	 *	Return a dialogue
	 */
	function getDialogue(arr) {
		try {
			// make sure it is an array
			if (!Array.isArray(arr)) return;

			// get category
			let category = DialogueData.data[arr[0]];

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
		} catch (err) {
			console.error(err);
		}
	}
	/**
	 *	Show the dialogue bubble [with text and sound]
	 */
	function showDialogue(dialogue, sound, ifOpenUpdate) {
		try {
			if (DEBUG) console.log("💭 Dialogue.showDialogue()", dialogue, sound, ifOpenUpdate);
			if (ifOpenUpdate) dialogueOpen = false; // override ifOpenUpdate = true
			if (dialogueOpen) return; // else if open, then exit
			if (sound) Sound.playMood(dialogue.mood);
			show(dialogue.text);
		} catch (err) {
			console.error(err);
		}
	}



	/**
	 *	Show the dialogue bubble [with text and sound]
	 */
	function showString(str, sound, ifOpenUpdate = true) {
		try {
			if (DEBUG) console.log("💭 Dialogue.showString()", str, sound, ifOpenUpdate);
			if (ifOpenUpdate) dialogueOpen = false; // true = update even if open
			if (dialogueOpen) return; // if open, exit
			if (sound) Sound.playMood(sound);
			show(str);
		} catch (err) {
			console.error(err);
		}
	}

	function random() {
		try {
			// EXAMPLES

			// Dialogue.showDialogue(Dialogue.getDialogue(["monster", "launch", 0]),true);
			// return;

			let r = Math.random();
			if (r < 0.25)
				// show dialogue from data, [category/subcategory/0], play sound
				showDialogue(getDialogue(["random", "greeting", 0]), true);
			else if (r < 0.5)
				// show dialogue from data, [category/0/index], play sound
				showDialogue(getDialogue(["onboarding", 0, "onboarding3"]), true);
			else if (r < 0.75)
				// show dialogue from facts, trackers, play sound
				showFact(getFact("trackers"), "neutral", true);
			else
				// show dialogue <string>, play sound
				showString("this is just a string", "neutral", true);
		} catch (err) {
			console.error(err);
		}
	}


	// ********************* LOGGING / QUEUE SYTEM ********************* //

	/**
	 *	add a string to the queue
	 */
	function show(str) {
		try {
			if (DEBUG) console.log("💭 Dialogue.show()", str);
			// add to end of _queue
			_queue.push(str);
			// start/make sure queueChecker is running
			queueChecker();
		} catch (err) {
			console.error(err);
		}
	}
	/**
	 *	control state
	 */
	function active(state) {
		try {
			if (state != undefined && (state === true || state === false))
				_active = state;
			return _active;
		} catch (err) {
			console.error(err);
		}
	}
	/**
	 *	Check if there strings to show
	 */
	function queueChecker() {
		try {
			if (DEBUG) console.log("💭 Dialogue.queueChecker()", _queue, _active);
			// if no items in _queue then stop
			if (_queue.length < 1) return;
			// else, if not currently active then start a new one
			if (!_active)
				writeNextInQueue();
			// if currently active, check again in a bit in case there are more
			setTimeout(function() {
				queueChecker();
			}, 200);
		} catch (err) {
			console.error(err);
		}
	}
	/**
	 *	Show a dialogue string
	 */
	function writeNextInQueue(lineSpeed = 150) {
		try {
			if (DEBUG) console.log("💭 Dialogue.writeNextInQueue()", _queue, _active);
			// if currently active, stop
			if (_active) return;
			// set active state true
			active(true);
			// set open
			dialogueOpen = true;

			// remove first element in array
			var str = _queue.shift();
			// make sure there is text in the element
			if (str === null || str === undefined || str === "") {
				console.warn("💭 Dialogue.writeNextInQueue() element was empty", _queue);
				return;
			}


			// replace any template strings
			str = searchReplaceTemplateStr(str);

			if (DEBUG) console.log("💭 Dialogue.writeNextInQueue()", str, _queue, _active);

			// set number of lines based on str.length
			let lines = 1;
			// 28 characters per line * 2
			if (str.length > 0)
				lines = Math.ceil(str.length / 28);
			// set duration based on number lines
			let duration = lines * 1950;
			// add text
			$('#tally_dialogue').html(str);
			// adjust size of the box
			$('#tally_dialogue_bubble').css({
				'display': 'flex',
				'height': (lines * 12) + 26 + "px",
				'left': '10px',
				'opacity': 1 // make it visible
			});
			// make Tally look at user
			Tally.stare();
			// hide after appropriate reading period
			setTimeout(hide, duration);
		} catch (err) {
			console.error(err);
		}
	}

	/**
	 * 	Hide after player has time to read it
	 */
	function hide() {
		try {
			//return; //testing
			// if (!dialogueOpen) return;
			$('#tally_dialogue_bubble').css({
				'left': '-500px',
				'display': 'none',
				'opacity': 0
			});
			dialogueOpen = false;
			// release active state
			active(false);
		} catch (err) {
			console.error(err);
		}
	}


	//testing
	// $("body").mousemove(function(event) {
	// 	var msg = ".mousemove() " + event.pageX + ", " + event.pageY;
	// 	let normalized = FS_Number.normalize(event.pageX, 0, $(window).width());
	// 	if (DEBUG) console.log(normalized);
	// 	showString(msg);
	// });

	/**
	 *	Search and replace any template
	 */
	function searchReplaceTemplateStr(str) {
		try {
			if (DEBUG) console.log("💭 Dialogue.searchReplaceTemplateStr()", str, Monster.current());
			let find = "",
				replace = "";
			// check for any template replacement matches
			if (str.indexOf("{{Monster.current}}") > -1) {
				find = "Monster.current";
				replace = MonsterData.dataById[Monster.current().mid].name;
				if (FS_String.isVowel(replace[0])) replace = "n " + replace;
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
		} catch (err) {
			console.error(err);
		}
	}


	// PUBLIC
	return {
		getDialogue: function(arr) {
			return getDialogue(arr);
		},
		showDialogue: function(dialogue, sound, ifOpenUpdate) {
			showDialogue(dialogue, sound, ifOpenUpdate);
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
		showTrackerDialogue: showTrackerDialogue,
		random: random,
		hide: hide

	};
})();
