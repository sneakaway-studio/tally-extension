"use strict";

window.Dialogue = (function() {
	// PRIVATE

	let DEBUG = Debug.ALL.Dialogue,
		dialogueBubbleOpen = false, // whether or not dialogue bubble currently open
		_active,
		queueWaitTime = 0,
		hideTimeout = {},
		_queue = []; // array of objects




	// ********************* RANDOM / SPECIFIC DIALOGUE ********************* //

	function random() {
		try {
			// EXAMPLES

			// Dialogue.show(get(["monster", "launch", null]),true);
			// return;

			let r = Math.random();
			if (r < 0.25)
				// show dialogue from data, ["category", "subcategory", 0], play sound, always add
				show(get(["random", "greeting", null]), true, true);
			else if (r < 0.5)
				// show dialogue from data, [category/0/index], play sound
				show(get(["onboarding", null, "onboarding3"]), true);
			else if (r < 0.75)
				// show dialogue from facts, trackers, play sound
				show(getFact("trackers", false), "neutral", true);
			else
				// show dialogue <string>, play sound
				showStr("this is just a string", "neutral", true);
		} catch (err) {
			console.error(err);
		}
	}

	/**
	 *	Show a comment about trackers
	 */
	function showTrackerDialogue() {
		try {
			let subcategory = "none";
			if (pageData.trackers.length > 0) subcategory = "few";
			if (pageData.trackers.length > 3) subcategory = "lots";
			if (DEBUG) console.log("💭 Dialogue.showTrackerDialogue() subcategory=" + subcategory);
			show(get(["tracker", subcategory, null]), true);
		} catch (err) {
			console.error(err);
		}
	}



	// ************************** MAIN ROUTES ************************** //

	/**
	 *	Show dialogue bubble - send object to add()
	 */
	function show(dialogue, mood, addIfDialogueInProcess = true, instant = false) {
		try {
			if (DEBUG) console.log("💭 Dialogue.show()", dialogue, mood, addIfDialogueInProcess);
			// don't show if there is no text
			if (dialogue.text === "" || dialogue.text === undefined) return;
			// show instant
			if (instant) return showInstant(dialogue, mood);
			// don't add if marked false
			if (!addIfDialogueInProcess && _queue.length > 0) return;
			add(dialogue);
		} catch (err) {
			console.error(err);
		}
	}

	function emptyQueue(){
		try {
			// erase queue
			_queue = [];
			// reset active
			_active = false;
			// reset hide timer
			clearTimeout(hideTimeout);
		} catch (err) {
			console.error(err);
		}
	}

	function showInstant(dialogue, mood) {
		try {
			if (DEBUG) console.log("💭 Dialogue.showInstant()", dialogue, mood);
			emptyQueue();
			// add this dialogue to end of _queue
			_queue.push(dialogue);
			// start writing
			writeNextInQueue();
		} catch (err) {
			console.error(err);
		}
	}

	/**
	 *	Show dialogue bubble - pass an object to add() from string
	 */
	function showStr(str = "", mood = false, addIfDialogueInProcess = true, instant = false) {
		try {
			if (DEBUG) console.log("💭 Dialogue.showStr()", str, mood, addIfDialogueInProcess);
			// don't show if there is no text
			if (!prop(str) || str === "") return;
			// create dialogue obj
			let dialogue = {
				"text": str,
				"mood": mood
			};
			// show instant
			if (instant) return showInstant(dialogue, mood);
			// don't add if marked false
			if (!addIfDialogueInProcess && _queue.length > 0) return;
			// add to queue
			add(dialogue);
		} catch (err) {
			console.error(err);
		}
	}



	// ********************* LOGGING / QUEUE SYTEM ********************* //

	/**
	 *	add a dialogue object to the queue
	 */
	function add(dialogue) {
		try {
			if (DEBUG) console.log("💭 Dialogue.add()", dialogue);
			if (dialogue.text === "" || dialogue.text === undefined) return; // don't show if there is no text
			// add wait time for it to display
			dialogue.wait = stringDuration(dialogue.text);
			// add to end of _queue
			_queue.push(dialogue);
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
	 *	Check if there are objects to show
	 */
	function queueChecker() {
		try {
			//if (DEBUG) console.log("💭 Dialogue.queueChecker()", _queue, _active);
			// if no items in _queue then stop
			if (_queue.length < 1) return;
			// else, if not currently active then start a new one
			if (!_active) writeNextInQueue();
			// if currently active, check again in a bit in case there are more
			setTimeout(function() {
				queueChecker();
			}, 200);
		} catch (err) {
			console.error(err);
		}
	}
	/**
	 *	Show next dialogue in queue
	 */
	function writeNextInQueue(lineSpeed = 150) {
		try {
			if (DEBUG) console.log("💭 Dialogue.writeNextInQueue()", _queue, _active, queueWaitTime);

			// if currently active, stop
			if (_active) return;
			// set active state true
			active(true);
			// set open
			dialogueBubbleOpen = true;

			// remove first element in array
			var dialogue = _queue.shift();
			// make sure there is text in the element
			if (!prop(dialogue) || dialogue.text === null ||
				dialogue.text === undefined || dialogue.text === "") {
				console.warn("💭 Dialogue.writeNextInQueue() element was empty", _queue, dialogue);
				return;
			}

			// replace any template strings
			dialogue.text = searchReplaceTemplateStr(dialogue.text);
			// update queueWaitTime
			queueWaitTime = stringDuration(dialogue.text);

			if (DEBUG) console.log("💭 Dialogue.writeNextInQueue()", dialogue, _queue, _active);

			if (dialogue.callback) {
				Tutorial.dialogueCallback(dialogue.callback);
			}


			// add text
			$('#tally_dialogue').html(dialogue.text);
			// play sound (if exists)
			if (prop(dialogue.mood)) Sound.playMood(dialogue.mood);
			// adjust size of the box
			$('#tally_dialogue_bubble').css({
				'display': 'flex',
				'height': (stringLines(dialogue.text) * 15) + 28 + "px",
				'left': '10px',
				'opacity': 1 // make it visible
			});
			// make Tally look at user
			Tally.stare();
			// hide after appropriate reading period
			clearTimeout(hideTimeout);
			hideTimeout = setTimeout(hide, queueWaitTime);
		} catch (err) {
			console.error(err);
		}
	}



	/**
	 * 	Hide after player has time to read it
	 */
	function hide() {
		try {
			if (DEBUG) console.log("💭 Dialogue.hide()", queueWaitTime);
			$('#tally_dialogue_bubble').css({
				'left': '-500px',
				'display': 'none',
				'opacity': 0
			});
			dialogueBubbleOpen = false;
			// release active state
			active(false);
		} catch (err) {
			console.error(err);
		}
	}

	/**
	 * 	Estimate number of lines for a string
	 */
	function stringLines(str, measure = 26) {
		try {
			let lines = 1;
			// remove html from string count
			str = FS_String.removeHTML(str);
			// 28 characters per line * 2
			if (str.length > 0)
				// set number of lines based on length of text
				lines = Math.ceil(str.length / measure);
			if (DEBUG) console.log("💭 Dialogue.stringLines()", str, measure, lines);
			return lines;
		} catch (err) {
			console.error(err);
		}
	}

	/**
	 * 	Estimate number of milliseconds to display a string
	 */
	function stringDuration(str) {
		try {
			// set duration based on number lines
			let duration = stringLines(str) * 1950;
			if (DEBUG) console.log("💭 Dialogue.stringDuration() duration =", duration);
			return duration;
		} catch (err) {
			console.error(err);
		}
	}


	//testing
	// $("body").mousemove(function(event) {
	// 	var msg = ".mousemove() " + event.pageX + ", " + event.pageY;
	// 	let normalized = FS_Number.normalize(event.pageX, 0, $(window).width());
	// 	if (DEBUG) console.log(normalized);
	// 	showStr(msg);
	// });

	/**
	 *	Search and replace any template
	 */
	function searchReplaceTemplateStr(str = "") {
		try {
			// if (DEBUG) console.log("💭 Dialogue.searchReplaceTemplateStr()", str, Monster.current());
			if (str === "") return;
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
				str = str.replace(new RegExp('\{\{(?:\\s+)?(' + find + ')(?:\\s+)?\}\}'),
					"<span class='tally-replace'>" + replace + "</span>");
			// return string
			return str;
		} catch (err) {
			console.error(err);
		}
	}






	/**
	 *	Get a random fact (by domain)
	 */
	function getFact(domain, includeSource = true) {
		try {
			let fact = FS_Object.randomArrayIndex(Facts.data[domain]);
			// get fact
			let str = fact.fact;
			// should we include source?
			if (includeSource) {
				if (fact.url && fact.source)
					str += " Source: <a href='" + fact.url + "' target='_blank'>" + fact.source + "</a>";
				if (fact.year)
					str += " (" + fact.year + ")";
			}
			return str;
		} catch (err) {
			console.error(err);
		}
	}

	/**
	 *	Return a dialogue {"text":"","mood":""}, arr = ["category", "subcategory", "index"]
	 */
	function get(arr) {
		try {
			// make sure it is an array
			if (!Array.isArray(arr)) return;
			// category is required
			if (!prop(arr[0])) return;

			if (DEBUG) console.log("💭 Dialogue.get() arr=" + JSON.stringify(arr));

			// get category
			let category,
				categoryStr,
				subcategoryStr,
				result = false;

			// get top category
			categoryStr = arr[0];
			category = DialogueData.data[categoryStr];

			// if (DEBUG) console.log("💭 Dialogue.get()", "categoryStr=" + categoryStr + ", category=" + JSON.stringify(category));

			// if there is a subcategory, then select random
			if (prop(arr[1])) {
				subcategoryStr = arr[1];
				if (DEBUG) console.log("💭 Dialogue.get()", "subcategoryStr=" + subcategoryStr);
				// if prop doesn't exist in Dialogue then don't show anything
				if (!prop(category[subcategoryStr]) || category[subcategoryStr].length < 1) return;
				// otherwise get a random one
				let r = Math.floor(Math.random() * category[subcategoryStr].length);
				if (DEBUG) console.log("💭 Dialogue.get()", "subcategoryStr=" + subcategoryStr + ", category[subcategoryStr]=" + JSON.stringify(category[subcategoryStr]));
				result = category[subcategoryStr][r];
			}
			// if there is no subcategory, then get by index
			else if (arr[2]) {
				let index = arr[2];
				result = category[index];
			}

			return result;
		} catch (err) {
			console.error(err);
		}
	}


	// PUBLIC
	return {
		show: function(dialogue, playSound, addIfDialogueInProcess, instant) {
			show(dialogue, playSound, addIfDialogueInProcess, instant);
		},
		showStr: function(str, mood, addIfDialogueInProcess, instant) {
			showStr(str, mood, addIfDialogueInProcess, instant);
		},
		emptyQueue: emptyQueue,
		showTrackerDialogue: showTrackerDialogue,
		random: random,
		hide: hide,
		getFact: function(domain, includeSource) {
			return getFact(domain, includeSource);
		},
		get: function(arr) {
			return get(arr);
		},
		stringDuration: function(str) {
			return stringDuration(str);
		},

	};
})();
