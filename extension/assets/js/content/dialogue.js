self.Dialogue = (function() {
	// PRIVATE

	let DEBUG = Debug.ALL.Dialogue,
		dialogueBubbleOpen = false, // whether or not dialogue bubble currently open
		_active = false, // text currently being shown in the speech bubble, and has not timed out
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
				id: "", // e.g. [cat+subcat+index+number] "random_greeting_story1-1_345"
			};
			//  to store the dialogue data RESPONSE
			let dialogueObj = {
				text: "",
				mood: "",
				before: "", // show string before text
				after: "", // show string after text
				callback: ""
			};

			// id of dialogueObj in dialogues.js
			let dialogueId;

			// if an id, then skip to end
			if (dataReq.id)
				dialogueId = dataReq.id;

			// if a category + subcategory (and the combination exists)
			else if (dataReq.category && dataReq.subcategory &&
				FS_Object.prop(DialogueIdsByCatSubcat.data[dataReq.category]) && FS_Object.prop(DialogueIdsByCatSubcat.data[dataReq.category][dataReq.subcategory])
			) {
				// get random cat + subcat
				dialogueId = FS_Object.randomObjProperty(DialogueIdsByCatSubcat.data[dataReq.category][dataReq.subcategory]);
			}
			// else if the category + index combination exists
			else if (dataReq.category && dataReq.index &&
				FS_Object.prop(DialogueIdsByCatIndex.data[dataReq.category]) && FS_Object.prop(DialogueIdsByCatIndex.data[dataReq.category][dataReq.index])
			) {
				// get the specific category + index
				dialogueId = DialogueIdsByCatIndex.data[dataReq.category][dataReq.index];
			}
			// else if a category only
			else if (dataReq.category &&
				FS_Object.prop(DialogueIdsByCatSubcat.data[dataReq.category])
			) {
				// get random cat
				dialogueId = FS_Object.randomObjProperty(DialogueIdsByCatSubcat.data[dataReq.category]);
			}


			// get the obj from id
			if (dialogueId) {
				dialogueObj = DialogueData.data[dialogueId];
			} else {
				if (DEBUG) console.warn("No dialogue found dialogueId =", dialogueId, " dialogueObj =", dialogueObj);
				dialogueObj = false;
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
			let log = "💬 Dialogue.showData()";
			// don't allow if mode disabled or stealth
			if (T.tally_options.gameMode === "disabled" || T.tally_options.gameMode === "stealth") return;

			if (DEBUG) console.log(log, "[1]",
				"dialogueObj =", JSON.stringify(dialogueObj),
				", showReq = " + JSON.stringify(showReq)
			);
			// return early if no dialogue was returned
			if (!dialogueObj) {
				if (DEBUG) console.log(log, "[2] dialogueObj =", dialogueObj,
					", showReq = " + JSON.stringify(showReq));
				return false;
			}

			//  default show request (defines how the dialogue is displayed)
			let showReqDefaults = {
				addIfInProcess: true,
				instant: false
			};
			// don't show if there is no text
			if (dialogueObj.text === "" || dialogueObj.text === undefined) return false;
			// if defined and instant=true, show instantly
			if (FS_Object.prop(showReq.instant) && showReq.instant) return showInstant(dialogueObj);
			// if defined and true, show regardless if Dialogue is already in progress
			// if false and queue has dialogue then return
			if (FS_Object.prop(showReq.addIfInProcess) && !showReq.addIfInProcess && _queue.length > 0) return false;
			// else add dialogueObj to queue, let caller know
			return addToQueue(dialogueObj);

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
			if (!FS_Object.prop(str) || str === "") return;

			// don't allow if mode disabled or stealth,
			if (T.tally_options.gameMode === "disabled" || T.tally_options.gameMode === "stealth") return;

			let dialogueObj = {
					text: str,
					mood: mood
				},
				showReq = {
					addIfInProcess: addIfInProcess,
					instant: instant
				};
			// pass to new funciton
			return showData(dialogueObj, showReq);
		} catch (err) {
			console.error(err);
		}
	}

	/**
	 *	Show dialogue instantly (delete everything already queued)
	 */
	function showInstant(dialogue) {
		try {
			// if (DEBUG) console.log("💬 Dialogue.showInstant()", dialogue);
			// empty queue first...
			emptyTheQueue();
			// then add this dialogue to end of _queue
			_queue.push(dialogue);
			// start writing, and let caller know it worked
			return writeNextInQueue();
		} catch (err) {
			console.error(err);
		}
	}







	// ********************* LOGGING / QUEUE SYTEM ********************* //

	/**
	 *	Add a dialogue object to the queue
	 */
	function addToQueue(dialogue) {
		try {
			if (DEBUG) console.log("💬 Dialogue.addToQueue() [1]", dialogue);
			if (dialogue.text === "" || dialogue.text === undefined) return; // don't show if there is no text
			// add wait time for it to display
			dialogue.wait = stringDuration(dialogue.text);
			// add to end of _queue
			_queue.push(dialogue);
			// start/make sure queueChecker is running
			queueChecker();
			// let caller know it was queued
			return true;
		} catch (err) {
			console.error(err);
			return false;
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
			// else, if not active then start a new one
			if (!_active) writeNextInQueue();
			// if active, check again in a bit in case there are more
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
	function writeNextInQueue(lineSpeed = 150, skipToNext = false) {
		try {
			const log = "💬 Dialogue.writeNextInQueue()";
			if (_queue.length < 1) return console.log(log, "[0] (no dialogue in _queue)");

			// if (DEBUG) console.log(log, "[1]", JSON.stringify(_queue), _active, queueWaitTime);

			// if active, stop (unless we want to skip to next)
			if (_active && !skipToNext) return;
			// set active
			_active = true;
			// set open
			dialogueBubbleOpen = true;

			// remove first element in array
			var dialogue = _queue.shift();
			// make sure there is text in the element
			if (!FS_Object.prop(dialogue) || dialogue.text === null ||
				dialogue.text === undefined || dialogue.text === "") {
				console.warn(log, "element was empty", _queue, dialogue);
				return;
			}

			// replace any template strings {{}}
			dialogue.text = searchReplaceTemplateStr(dialogue.text);

			// replace any branching links {}
			dialogue.text = searchAddBranchLinks(dialogue.text);

			// update queueWaitTime
			queueWaitTime = stringDuration(dialogue.text);

			if (DEBUG) console.log(log, "[2]", dialogue,
				// _queue, _active
			);

			// is there a callback in the dialogue object?
			if (dialogue.callback) {
				// if so pass it to the Tutorial
				Tutorial.slideshowCallback(dialogue.callback);
			}

			// in case before and after text aren't included
			if (!dialogue.before) dialogue.before = "";
			if (!dialogue.after) dialogue.after = "";
			// add next link to after
			dialogue.after = "<span class='tally tally-tutorial-step tally-dialogue-next'>...</span> ";

			// show text
			$('#tally_dialogue_inner').html(dialogue.before + " " + dialogue.text + " " + dialogue.after);
			// play sound (if exists)
			if (FS_Object.prop(dialogue.mood))
				// don't allow dialogue sounds in chill mode
				if (T.tally_options.gameMode !== "chill" || Page.data.actions.userInteractingWithGame)
					Sound.playTallyVoice(dialogue);


			// if there is an image
			if (dialogue.text.search("img") > -1) {
				// if (DEBUG) console.log(log, "[3] IMG found");

				// wait until images load
				$('#tally_dialogue_inner img').on('load', function() {
					// if (DEBUG) console.log("💬 Dialogue.setDialoguBoxSize() imgHeight =", $('#tally_dialogue_inner img').height());
					// adjust size of the box
					setDialoguBoxSize(dialogue.text, $('#tally_dialogue_inner').outerHeight());
				});
				$('.monster_sprite_dialogue_loader').on('load', function() {
					// if (DEBUG) console.log("💬 Dialogue.setDialoguBoxSize() imgHeight =", $('.monster_sprite_outer_dialogue').height());
					// adjust size of the box
					setDialoguBoxSize(dialogue.text, $('#tally_dialogue_inner').outerHeight());
				});
			} else {
				// update dialogue box size
				setDialoguBoxSize(dialogue.before + dialogue.text + dialogue.after, 0);
			}

			// make Tally look at user
			Tally.stare();

			// clear previous timeout
			clearTimeout(hideTimeout);
			// and create a new one to hide after appropriate reading period
			hideTimeout = setTimeout(hide, queueWaitTime);
			// we made it this far
			return true;
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
				if (DEBUG)
					console.log("💬 Dialogue.setDialoguBoxSize() [1]", "imgHeight =", imgHeight, "inner =", inner, "outer =", outer);
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
			// hide slide show too in case it was left open
			Tutorial.slideshowVisible(false);
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
	// the ... in the dialogue button
	$(document).on('click', '.tally-dialogue-next', function() {
		skipToNext();
	});




	// ********************* VISUAL ELEMENTS ********************* //

	/**
	 * 	Hide  Dialogue bubble after player has time to read it
	 */
	function hide() {
		try {
			// return;
			if (DEBUG) console.log("💬 Dialogue.hide()", queueWaitTime);
			// only hide bubble if queue is empty
			if (_queue.length < 1) {
				$('#tally_dialogue_outer').css({
					'left': '-500px',
					'display': 'none',
					'opacity': 0
				});
				dialogueBubbleOpen = false;
				// hide slide show too in case it was left open
				Tutorial.slideshowVisible(false);
			}
			// release active state
			_active = false;
		} catch (err) {
			console.error(err);
		}
	}

	/**
	 * 	Estimate number of lines for a string
	 */
	function stringLines(str = "", measure = 26) {
		try {
			if (!str) return console.warn("💬 Dialogue.stringLines() str == undefined");
			// if (DEBUG) console.log("💬 Dialogue.stringLines() [1]", str, measure);
			let lines = 1;
			// remove html from string count
			str = FS_String.removeHTML(str);
			// n characters per line * 2
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
			if (str.indexOf("{{a Monster.current}}") > -1) {
				// search for name with "a"
				find = "a Monster.current";
				// get only monster name first
				replace = MonsterData.dataById[Monster.current().mid].name + " monster";
				// append an
				if (FS_String.containsVowel(replace[0])) replace = "an " + replace;
				// else append "a"
				else replace = "a " + replace;
			}
			if (str.indexOf("{{Monster.current}}") > -1) {
				find = "Monster.current";
				replace = MonsterData.dataById[Monster.current().mid].name + " monster";
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


	/**
	 *	Search and add any links to branching stories - looks for dialogue {linkText,category,index}
	 * 	Can transform an of the following
	 * 	- text: "Want to hear a {joke,joke,joke2}?",
	 *	- text: "Want to hear a joke? {yes,joke,joke1} or {no,branch,answerNo}",
	 */
	function searchAddBranchLinks(str = "") {
		try {
			// if it doesn't include two brackets then return
			if (str === "" || !str.includes('{')) return str;
			if (DEBUG) console.log("💬 Dialogue.searchAddBranchLinks() [1] str =", str);

			// get matching text in an array
			let replaceArr = str.match(/{[\w,!?.;# -]+}/g);
			if (!replaceArr || replaceArr.length < 1) return str; // required
			if (DEBUG) console.log("💬 Dialogue.searchAddBranchLinks() [2] replaceArr =", replaceArr);

			// loop through the all the strings to replace
			for (let i = 0; i < replaceArr.length; i++) {

				// remove brackets and create array from results
				let linkArr = replaceArr[i].replace(/[{}]/g, '').split(",");
				if (DEBUG) console.log("💬 Dialogue.searchAddBranchLinks() [3]",
					"replaceArr[i] =", replaceArr[i],
					"linkArr =", linkArr
				);

				// get vars
				let linkText = linkArr[0].trim(),
					category = linkArr[1].trim(),
					index = linkArr[2].trim();
				if (DEBUG) console.log("💬 Dialogue.searchAddBranchLinks() [4]",
					"linkText =", linkText,
					"category =", category,
					"index =", index
				);

				// wrap it in a link
				let link = `<a class='tally-dialogue-branch' data-category='${category}' data-index='${index}' href='#'>${linkText}</a>`;
				if (DEBUG) console.log("💬 Dialogue.searchAddBranchLinks() [5]",
					"link =", link,
					"replaceArr[i] =", replaceArr[i]
				);

				// replace and store in string
				str = str.replace(replaceArr[i], link);

				// remove listener
				$(document).off("click", '.tally-dialogue-branch');

				// add new listener
				$(document).on('click', '.tally-dialogue-branch', function() {
					// log
					console.log("hello", $(this).data('category'), $(this).data('index'));

					// if a tutorial
					if ($(this).data('category') === "tutorial") {
						// empty queue and play
						Tutorial.reset();
						Dialogue.emptyTheQueue();
						Tutorial.play("tutorial", $(this).data('index'));
					} else if ($(this).data('category') === "joke") {
						// empty queue and play
						Tutorial.reset();
						Dialogue.emptyTheQueue();
						Tutorial.play("joke", $(this).data('index'));
					} else if ($(this).data('category') === "branch" && $(this).data('index') === "answerNo") {
						// empty queue and play
						Tutorial.reset();
						Dialogue.emptyTheQueue();
						Dialogue.showData(Dialogue.getData({
							category: "branch",
							subcategory: "answerNo"
						}), {
							addIfInProcess: false,
							instant: true
						});
					}

				});

			}

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
	 *	Get a random fact (by category)
	 */
	function getFact(category = "", includeSource = true) {
		try {
			// if category
			if (category === "") category = FS_Object.randomObjKey(Facts.data);
			// get fact
			let fact = FS_Object.randomArrayIndex(Facts.data[category]);
			let str = "Random fact: " + fact.fact;
			// should we include source?
			if (includeSource) {
				if (fact.url && fact.source)
					str += " Source: <a href='" + fact.url + "' target='_blank'>" + fact.source + "</a>";
				if (fact.year)
					str += " (" + fact.year + ")";
			} else {
				str += " <a href='" + fact.url + "' target='_blank'>source</a>";
			}
			return str;
		} catch (err) {
			console.error(err);
		}
	}




	/**
	 *	Check to see whether Tally has something to say about this url / domain using a tag, domain, url
	 */
	function checkAddPageSpecificDialogue() {
		try {
			const log = "💬 Dialogue.checkAddPageSpecificDialogue()";

			// dialogue to match a tag, the domain or page
			let matchedDialogueTags = [],
				pageTagsToMatch = [Page.data.domain, Page.data.sld];

			// create array of dialogue tags
			const dialogueTagsArr = Object.keys(DialogueIdsByTag.data);
			if (DEBUG) console.log(log, "[1.1] Page.data.tags =", Page.data.tags);
			if (DEBUG) console.log(log, "[1.2] dialogueTagsArr =", dialogueTagsArr);

			// match dialogue tags with page tags
			matchedDialogueTags = FS_Object.returnArrayMatches(Page.data.tags, dialogueTagsArr);
			if (DEBUG) console.log(log, "[1.3] matchedDialogueTags =", matchedDialogueTags);

			// if there are matchedDialogueTags
			if (matchedDialogueTags.length > 0) {
				// pick one
				let tagMatch = FS_Object.randomArrayIndex(matchedDialogueTags);
				if (DEBUG) console.log(log, "[3.1] tagMatch =", tagMatch);
				// get a random dialogueId
				let dialogueId = FS_Object.randomArrayIndex(DialogueIdsByTag.data[tagMatch]);
				if (DEBUG) console.log(log, "[3.2] dialogueId =", dialogueId);
				// get the dialogueObj
				let dialogueObj = getData({
					id: dialogueId
				});
				if (DEBUG) console.log(log, "[3.3] dialogueObj =", dialogueObj);
				// and show
				if (dialogueObj) Dialogue.showData(dialogueObj);
			}

		} catch (err) {
			console.error(err);
		}
	}





	// to test different sounds
	function test() {
		try {
			// console.log("💬 Dialogue.test()");

			// don't allow if mode disabled or stealth,
			if (T.tally_options.gameMode === "disabled" || T.tally_options.gameMode === "stealth") return;

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

			console.log("💬 Dialogue.test()", dialogue);

			// show
			Dialogue.showData(dialogue);

		} catch (err) {
			console.error(err);
		}
	}




	// PUBLIC
	return {
		set active(value) {
			_active = value;
		},
		get active() {
			return _active;
		},

		getData: getData,
		showData: showData,
		showStr: showStr,
		random: random,
		test: test,
		emptyTheQueue: emptyTheQueue,
		hide: hide,
		getFact: getFact,
		checkAddPageSpecificDialogue: checkAddPageSpecificDialogue,
		skipToNext: skipToNext,

	};
})();
