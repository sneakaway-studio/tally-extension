"use strict";

window.Dialogue = (function () {
	// PRIVATE

	let DEBUG = Debug.ALL.Dialogue,
		dialogueBubbleOpen = false, // whether or not dialogue bubble currently open
		_active = false, // is text currently being shown in the speech bubble
		queueWaitTime = 0,
		hideTimeout = {},
		_queue = []; // array of objects









	// ************************** MAIN ROUTES ************************** //



	/**
	 *	getData() - Retrieves dialogue data (text, mood, and callback) from DialogueData.data
	 */
	function getData(dataReq) {
		try {
			if (DEBUG) console.log("💬 Dialogue.getData() dataReq = " + JSON.stringify(dataReq));

			//  ** example ** dialogue data REQUEST
			let exampleDataReq = {
				category: "", // e.g. "random"
				subcategory: "", // e.g. "greeting"
				index: "", // e.g. "story1-1"
			};
			//  to store the dialogue data RESPONSE
			let dialogueObj = {
				text: "",
				mood: "",
				callback: ""
			};

			// if a category and it exists
			if (dataReq.category && FS_Object.prop(DialogueData.data[dataReq.category])) {

				// if a category && subcategory (and the combination exists)
				if (dataReq.subcategory &&
					FS_Object.prop(DialogueData.data[dataReq.category][dataReq.subcategory])) {
					// get random cat + subcat
					dialogueObj = FS_Object.randomObjProperty(DialogueData.data[dataReq.category][dataReq.subcategory]);
				}
				// else if a category and index (and the combination exists)
				else if (dataReq.index &&
					FS_Object.prop(DialogueData.data[dataReq.category][dataReq.index])) {
					// get the specific cat + index
					dialogueObj = DialogueData.data[dataReq.category][dataReq.index];
				}
				// else if a category only
				else {
					// get random cat + subcat
					dialogueObj = FS_Object.randomObjProperty(DialogueData.data[dataReq.category]);
				}
			} else {
				console.error("No dialogue found");
				dialogueObj = {
					text: "No dialogue found",
					mood: "sad",
				};
			}
			return dialogueObj;
		} catch (err) {
			console.error(err);
		}
	}

	/**
	 *	Dialogue *Show* Request - Shows dialogue data (text, mood, and callback)
	 */
	function showData(dialogueObj, showReq = {}) {
		try {
			if (DEBUG) console.log("💬 Dialogue.addData() [1] dialogueObj =",
				// JSON.stringify(dialogueObj),
				", showReq = " + JSON.stringify(showReq));

			//  default show request (defines how the dialogue is displayed)
			let showReqDefaults = {
				addIfInProcess: true,
				instant: false
			};
			// don't show if there is no text
			if (dialogueObj.text === "" || dialogueObj.text === undefined) return;
			// if defined and true, show instantly
			if (FS_Object.prop(showReq.instant) && showReq.instant) return showInstant(dialogueObj);
			// if defined and false, show regardless if Dialogue is already in progress
			if (FS_Object.prop(showReq.addIfInProcess) && !showReq.addIfInProcess && _queue.length > 0) return;
			// else add dialogueObj to queue
			add(dialogueObj);

		} catch (err) {
			console.error(err);
		}
	}
	/**
	 *	Show dialogue bubble - create and pass an object to showData() from string
	 */
	function showStr(str = "", mood = false, addIfInProcess = true, instant = false) {
		try {
			if (DEBUG) console.log("💬 Dialogue.showStr()", str, mood, addIfInProcess, instant);

			// don't show if there is no text
			if (!prop(str) || str === "") return;
			let dialogueObj = {
					text: str,
					mood: mood
				},
				showReq = {
					addIfInProcess: addIfInProcess,
					instant: instant
				};
			// pass to new funciton
			showData(dialogueObj, showReq);
		} catch (err) {
			console.error(err);
		}
	}







	// OLD - MARKED FOR DELETION
	/**
	 *	Return a dialogue {"text":"","mood":""}, arr = ["category", subcategory, "index"]
	 */
	// function get(arr) {
	// 	try {
	// 		// make sure it is an array
	// 		if (!Array.isArray(arr)) return;
	// 		// category is required
	// 		if (!prop(arr[0])) return;
	//
	// 		if (DEBUG) console.log("💬 Dialogue.get() arr=" + JSON.stringify(arr));
	//
	// 		// get category
	// 		let category,
	// 			categoryStr,
	// 			subcategoryStr,
	// 			result = false;
	//
	// 		// get top category
	// 		categoryStr = arr[0];
	// 		category = DialogueData.data[categoryStr];
	//
	// 		// if (DEBUG) console.log("💬 Dialogue.get()", "categoryStr=" + categoryStr + ", category=" + JSON.stringify(category));
	//
	// 		// if there is a subcategory, then select random
	// 		if (prop(arr[1])) {
	// 			subcategoryStr = arr[1];
	// 			if (DEBUG) console.log("💬 Dialogue.get()", "subcategoryStr=" + subcategoryStr);
	// 			// if prop doesn't exist in Dialogue then don't show anything
	// 			if (!prop(category[subcategoryStr]) || category[subcategoryStr].length < 1) return;
	// 			// otherwise get a random one
	// 			let r = Math.floor(Math.random() * category[subcategoryStr].length);
	// 			if (DEBUG) console.log("💬 Dialogue.get()", "subcategoryStr=" + subcategoryStr + ", category[subcategoryStr]=" + JSON.stringify(category[subcategoryStr]));
	// 			result = category[subcategoryStr][r];
	// 		}
	// 		// if there is no subcategory, then get by index
	// 		if (prop(arr[2])) {
	// 			let index = arr[2];
	// 			result = category[index];
	// 		}
	// 		// if neither subcategory or index then get random from category
	// 		else {
	// 			if (category)
	// 				result = FS_Object.randomObjProperty(category);
	// 		}
	//
	// 		return result;
	// 	} catch (err) {
	// 		console.error(err);
	// 	}
	// }

	/**
	 *	Show dialogue bubble - send object to add()
	 */
	// OLD - MARKED FOR DELETION
	// function show(dialogue, mood, addIfInProcess = true, instant = false) {
	// 	try {
	// 		if (DEBUG) console.log("💬 Dialogue.show()", dialogue, mood, addIfInProcess);
	//
	// 		// don't show if there is no text
	// 		if (dialogue.text === "" || dialogue.text === undefined) return;
	// 		// show instant
	// 		if (instant) return showInstant(dialogue, mood);
	// 		// don't add if marked false
	// 		if (!addIfInProcess && _queue.length > 0) return;
	// 		// else add dialogueObj to queue
	// 		add(dialogue);
	// 	} catch (err) {
	// 		console.error(err);
	// 	}
	// }

	/**
	 *	Show dialogue instantly (delete everything already queued)
	 */
	function showInstant(dialogue) {
		try {
			if (DEBUG) console.log("💬 Dialogue.showInstant()", dialogue);
			// empty queue first...
			emptyTheQueue();
			// then add this dialogue to end of _queue
			_queue.push(dialogue);
			// start writing
			writeNextInQueue();
		} catch (err) {
			console.error(err);
		}
	}







	// ********************* LOGGING / QUEUE SYTEM ********************* //

	/**
	 *	Add a dialogue object to the queue
	 */
	function add(dialogue) {
		try {
			if (DEBUG) console.log("💬 Dialogue.add() [1]", dialogue);
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
			//if (DEBUG) console.log("💬 Dialogue.queueChecker()", _queue, _active);
			// if no items in _queue then stop
			if (_queue.length < 1) return;
			// else, if not currently active then start a new one
			if (!_active) writeNextInQueue();
			// if currently active, check again in a bit in case there are more
			setTimeout(function () {
				queueChecker();
			}, 200);
		} catch (err) {
			console.error(err);
		}
	}
	/**
	 *	Show next dialogue in queue
	 */
	function writeNextInQueue(lineSpeed = 150, skipToNext = false) {
		try {
			if (_queue.length < 1) return console.log("💬 Dialogue.writeNextInQueue() [0] (no dialogue in _queue)");

			// if (DEBUG) console.log("💬 Dialogue.writeNextInQueue() [1]", JSON.stringify(_queue), _active, queueWaitTime);

			// if currently active, stop (unless we want to skip to next)
			if (_active && !skipToNext) return;
			// set active state true
			active(true);
			// set open
			dialogueBubbleOpen = true;

			// remove first element in array
			var dialogue = _queue.shift();
			// make sure there is text in the element
			if (!prop(dialogue) || dialogue.text === null ||
				dialogue.text === undefined || dialogue.text === "") {
				console.warn("💬 Dialogue.writeNextInQueue() element was empty", _queue, dialogue);
				return;
			}

			// replace any template strings
			dialogue.text = searchReplaceTemplateStr(dialogue.text);
			// update queueWaitTime
			queueWaitTime = stringDuration(dialogue.text);

			if (DEBUG) console.log("💬 Dialogue.writeNextInQueue() [2]", dialogue, _queue, _active);

			// is there a callback in the dialogue object?
			if (dialogue.callback) {
				// if so pass it to the Tutorial
				Tutorial.slideshowCallback(dialogue.callback);
			}

			// add text
			$('#tally_dialogue_inner').html(dialogue.text);
			// play sound (if exists)
			if (prop(dialogue.mood)) Sound.playTallyVoice(dialogue);


			// if there is an image
			if (dialogue.text.search("img") > -1) {
				// if (DEBUG) console.log("💬 Dialogue.writeNextInQueue() [3] IMG found");

				// wait until images load
				$('#tally_dialogue_inner img').on('load', function () {
					// if (DEBUG) console.log("💬 Dialogue.setDialoguBoxSize() imgHeight =", $('#tally_dialogue_inner img').height());
					// adjust size of the box
					setDialoguBoxSize(dialogue.text, $('#tally_dialogue_inner').outerHeight());
				});
				$('.monster_sprite_dialogue_loader').on('load', function () {
					// if (DEBUG) console.log("💬 Dialogue.setDialoguBoxSize() imgHeight =", $('.monster_sprite_outer_dialogue').height());
					// adjust size of the box
					setDialoguBoxSize(dialogue.text, $('#tally_dialogue_inner').outerHeight());
				});
			} else {
				// update dialogue box size
				setDialoguBoxSize(dialogue.text, 0);
			}


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
	 * 	Set size of dialogue box
	 */
	function setDialoguBoxSize(text, imgHeight = 0) {
		try {

			let inner = $('#tally_dialogue_inner').outerHeight(),
				outer = $('#tally_dialogue_outer').outerHeight(),
				// default size of box with text only
				boxHeight = (stringLines(text) * 15) + 28;

			// if image exists then increase size
			if (imgHeight > 0) {
				boxHeight = imgHeight;
				if (DEBUG) console.log("💬 Dialogue.setDialoguBoxSize() [1]", "imgHeight =", imgHeight, "inner =", inner, "outer =", outer);
			}

			// adjust size of the box
			$('#tally_dialogue_outer').css({
				'left': '10px',
				'display': 'flex',
				'opacity': 1,
				'height': boxHeight + "px",
			});
			// now show image
			$('.tally-dialogue-with-img').css({
				'display': 'flex',
				'left': 0
			});

			// if (DEBUG) console.log("💬 Dialogue.setDialoguBoxSize()", inner,outer);
			// if (DEBUG) console.log("💬 Dialogue.setDialoguBoxSize()", inner,outer);
		} catch (err) {
			console.error(err);
		}
	}
	/**
	 * 	Erase the queue
	 */
	function emptyTheQueue() {
		try {
			// erase queue
			_queue = [];
			// reset active
			_active = false;
			// reset timer
			clearTimeout(hideTimeout);
		} catch (err) {
			console.error(err);
		}
	}
	/**
	 * 	Skip to next item in queue (called from clicks on Tally)
	 */
	function skipToNext() {
		try {
			if (DEBUG) console.log("💬 Dialogue.skipToNext()", _queue);

			// if queue contains dialogue then skip
			if (_queue.length > 0) writeNextInQueue(150, true);
			// or remove
			else hide();

		} catch (err) {
			console.error(err);
		}
	}





	// ********************* VISUAL ELEMENTS ********************* //

	/**
	 * 	Hide  Dialogue bubble after player has time to read it
	 */
	function hide() {
		try {
			// return;
			if (DEBUG) console.log("💬 Dialogue.hide()", queueWaitTime);
			$('#tally_dialogue_outer').css({
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
	function stringLines(str = "", measure = 27) {
		try {
			// if (DEBUG) console.log("💬 Dialogue.stringLines() [1]", str, measure);
			let lines = 1;
			// remove html from string count
			str = FS_String.removeHTML(str);
			// 28 characters per line * 2
			if (str.length > 0)
				// set number of lines based on length of text
				lines = Math.ceil(str.length / measure);
			// if (DEBUG) console.log("💬 Dialogue.stringLines() [2]", str, measure, lines);
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
			let duration = stringLines(str) * 1900;
			// increase if new player
			if (T.tally_user.level < 10) duration = duration * 1.2;
			// if (DEBUG) console.log("💬 Dialogue.stringDuration() duration =", duration);
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
			// if (DEBUG) console.log("💬 Dialogue.searchReplaceTemplateStr()", str, Monster.current());
			if (str === "") return;
			let find = "",
				replace = "";
			// check for any template replacement matches
			if (str.indexOf("a {{Monster.current}}") > -1) {
				find = "Monster.current";
				replace = MonsterData.dataById[Monster.current().mid].name;
				if (FS_String.isVowel(replace[0])) replace = "n " + replace;
			}
			if (str.indexOf("{{Monster.current}}") > -1) {
				find = "Monster.current";
				replace = MonsterData.dataById[Monster.current().mid].name;
			}
			if (str.indexOf("{{Page.data.title}}") > -1) {
				find = "Page.data.title";
				replace = Page.data.title;
			}
			if (str.indexOf("{{Page.data.browser.name}}") > -1) {
				find = "Page.data.browser.name";
				replace = Page.data.browser.name;
			}
			// perform replacement
			if (find != "" && replace != "")
				str = str.replace(new RegExp('\{\{(?:\\s+)?(' + find + ')(?:\\s+)?\}\}'),
					"<span class='tally tally-replace'>" + replace + "</span>");
			// return string
			return str;
		} catch (err) {
			console.error(err);
		}
	}









	// ********************* RANDOM / SPECIFIC DIALOGUE ********************* //

	/**
	 *	Show random example
	 */
	function random() {
		try {
			let r = Math.random();
			if (r < 0.2) {
				// show dialogue from data
				// - pull from random category + subcategory
				Dialogue.showData(Dialogue.getData({
					category: "random",
					subcategory: "greeting"
				}));
			} else if (r < 0.4) {
				// show dialogue from data
				// - pull from random category + subcategory
				// - don't add to queue if in progress
				// - play instantly
				Dialogue.showData(Dialogue.getData({
					category: "random",
					subcategory: "conversation"
				}), {
					addIfInProcess: false,
					instant: true
				});
			} else if (r < 0.6) {
				// show dialogue from string
				Dialogue.showStr("Double click me!", "happy");
			} else if (r < 0.8) {
				// show dialogue from string
				// - pull from random fact
				Dialogue.showStr(Dialogue.getFact("trackers", false), "neutral");
			} else {
				// show dialogue from string
				// - play instantly
				Dialogue.showData({
					"text": "Congratulations on completing your first battle!",
					"mood": "happy"
				}, {
					instant: true
				});
			}


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
	 *	Show a prompt for survey
	 */
	function showSurveyPrompt() {
		try {
			if (DEBUG) console.log("💬 Dialogue.showSurveyPrompt() subcategory=" + subcategory);
			Dialogue.showStr("Want to give feedback? Click the survey button in the top-right menu.", "question");
		} catch (err) {
			console.error(err);
		}
	}



	// to test different sounds
	function test() {
		try {
			// console.log("💬 Dialogue.test()");

			// example moods to choose
			var moods = [
				"neutral",
				"happy",
				"question",
				"cautious",
				"excited",
				"sad"
			];
			// select a mood
			let mood = FS_Object.randomArrayIndex(moods);
			// assemble the dialogue request
			let dialogueReq = {
				category: "sound-test",
				subcategory: mood
			};
			// // test image
			// dialogueReq = {
			// 	category: "image-test",
			// 	subcategory: mood
			// };
			let dialogue = getData(dialogueReq);

			// console.log("💬 Dialogue.test()", dialogue);

			// show
			Dialogue.showData(dialogue);

		} catch (err) {
			console.error(err);
		}
	}




	// PUBLIC
	return {
		getData: getData,
		showData: showData,
		showStr: showStr,
		random: random,
		test: test,
		showSurveyPrompt: showSurveyPrompt,

		emptyTheQueue: emptyTheQueue,
		hide: hide,
		getFact: function (domain, includeSource) {
			return getFact(domain, includeSource);
		},

		active: function () {
			return _active;
		},
		skipToNext: skipToNext,



		// // mark for deletion
		// show: show,
		// get: function(arr) {
		// 	return get(arr);
		// },

	};
})();
