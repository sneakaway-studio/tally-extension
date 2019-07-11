"use strict";

/*  CLICK LISTENER
 ******************************************************************************/

window.TallyListeners = (function() {
	// PRIVATE

	let DEBUG = false;

	// "shim" for clicking on SVGs
	SVGAnimatedString.prototype.indexOf = function() {
		return this.baseVal.indexOf.apply(this.baseVal, arguments);
	};



	/**
	 *	addMainClickEventListener() - adds click event listener for anything "mouse"
	 */
	function addMainClickEventListener() {
		try {
			if (!pageData.activeOnPage) return;
			// core mouseup listener
			document.addEventListener("mouseup", function(e) {
				// a bit of throttling: if mouseup was just fired ignore this click
				if (pageData.mouseupFired != true) {
					// set to true
					pageData.mouseupFired = true;
					// and reset timer
					setTimeout(function() {
						pageData.mouseupFired = false;
					}, 500);
					// update
					Debug.update();
					// get data about the event
					let eventData = {
						action: null,
						mouseX: e.clientX,
						mouseY: e.clientY,
						tag: (e.target || e.srcElement).tagName,
						text: (e.target || e.srcElement).textContent
					};
					// update pageData
					pageData.mouseX = eventData.mouseX;
					pageData.mouseY = eventData.mouseY;
					// include parent tags if they exist
					if (prop(e.target.parentElement)) {
						eventData.parentTag = (e.target.parentElement || e.srcElement.parentNode).tagName;
						// include grandparent tags...
						if (prop(e.target.parentElement.parentElement))
							eventData.gParentTag = (e.target.parentElement.parentElement || e.srcElement.parentNode.parentNode).tagName;
					}
					//console.log(eventData, "e",e, "e.target",e.target);
					// finally pass to handler
					clickEventHandler(eventData, e.target);
				} else return;
			});
		} catch (err) {
			console.error(err);
		}
	}





	/**
	 *	clickEventHandler() - determines what kind of click was received, sends data to background.js
	 * 	@param  {eventData}  Data about event
	 * 	@param  {target}  Target of click event
	 * 	@return {void}
	 */
	var clickEventHandler = function(eventData, target) {
		try {
			//if (!pageData.activeOnPage || tally_options.gameMode === "disabled") return;
			// console.log("clickEventHandler() > eventData",eventData,target);
			//console.log("clickEventHandler() > target",target,target.className);

			// for updating the background object later on
			let scoreData = {};

			/**
			 * 	1. Determine if this is a node we want to ignore (tally interface links, etc.)
			 */

			let exit = "";
			if (ignoreNode(target.id) || ignoreNode(target.className) || ignoreNode(eventData.tag))
				exit = " -> ignore [" + target.id + ", " + eventData.tag + "] node(s)";
			// else if ( pageData.url == pageData.previousUrl) // THIS BREAKS ON FB
			// 	exit = " -> url is not different";
			if (exit !== "") {
				if (DEBUG) console.log("\n///// event => mouseup" + exit);
				return;
			}

			/**
			 * 	2. Determine what kind of click or "action" it is and store in eventData.action
			 */

			// Check if click target is an Anchor or if target's parent element is an Anchor.
			if (eventData.tag == "A" || eventData.parentTag == "A" ||
				eventData.gParentTag == "A" || target.className == "_39n" /* FB */ ||
				target.className.indexOf("ProfileTweet-actionCountForPresentation") > -1
			) {
				eventData.action = "click";
			}
			// click target is a Button
			else if (eventData.tag == "BUTTON" || eventData.tag == "button") {
				eventData.action = "button";
			}
			// click target is an input
			else if (eventData.tag == "INPUT" || eventData.tag == "input") {
				if (target.className.indexOf("button") >= 0) eventData.action = "button"; /* amazon */
				else eventData.action = "textSelect";
			}
			// click target is a textarea
			else if (eventData.tag == "TEXTAREA" || eventData.tag == "textarea") {
				eventData.action = "textSelect";
			} else {
				exit = " -> ignore [" + target.id + ", " + eventData.tag + "] node(s)";
			}
			if (exit !== "") {
				if (DEBUG) console.log("\n///// event => mouseup" + exit);
				return;
			}

			/**
			 * 	3. We've made it this far, let's respond to the type of click
			 */

			// for all clicks, buttons
			if (eventData.action == "click" || eventData.action == "button") {
				//console.log("eventData: "+ JSON.stringify(eventData));
				if (DEBUG) console.log("\n///// event => mouseup -> [" + eventData.action + "]");

				// update
				Debug.update();

				// more checking...

				// check if it is a FB like
				if (eventData.text == "Like" || target.className == "_39n" /* FB */ ||
					target.className.indexOf("ProfileTweet-actionCountForPresentation") > -1 /* Twitter */
				) {
					eventData.action = "like";
					scoreData.likes++;
				}
				// check if it is a stackoverflow
				else if (target.className == "vote" || target.className == "vote-up-off") {
					eventData.action = "SO-vote";
				}
				// if there is no text
				else if (eventData.text == "") {
					// if it is an image
					if (eventData.tag == "IMG") {
						// update score
						eventData.action = "image";
						// also try to get alt tag
						if ($(target).attr("alt") != "")
							eventData.text = $(target).attr("alt");
						else eventData.text = "IMG";
					}
				}

				/**
				 * 	4. Store information about the click
				 */

				// if we are this far it is a click
				TallyStorage.addToBackgroundUpdate("scoreData", "clicks", 1);
				// store time
				TallyStorage.addToBackgroundUpdate("pageData", "time", pageData.time);
				// reset page time
				pageData.time = 0;
				// store event data
				TallyStorage.addToBackgroundUpdate("eventData", eventData);
				// add and update score
				TallyStorage.addToBackgroundUpdate("scoreData", "score", GameData.clickScore[eventData.action]);

				// only allow points for clicking the first time (FB Like, etc.)
				$(target).toggleClass("tally-clicked");



				/**
				 * 	5. Game responses
				 */

				// check progress
 				Progress.check();
				// play sound
				Sound.playCategory('user', 'click');
				// show click visual
				Effect.showClickVisualText(eventData, "+" + GameData.clickScore[eventData.action]);
				// update stats display
				// StatsDisplay.adjustStatsCircle("tally", tally_user.level);
				StatsDisplay.updateDisplay("tally");
			}
			// disable click action in case they are editing text
			else if (eventData.action == "textSelect") {
				//playSound("blip");
			}


		} catch (err) {
			console.error(err);
		}
	};


	const ignoreNodes = [
		"tally", "tyd", "body", "tally-clicked"
	];
	/**
	 *	Confirm target is not a Tally or Tally Debugger link (tyd)
	 */
	function ignoreNode(str) {
		try {
			str = String(str).trim().toLowerCase();
			if (str === "" || str == undefined) return false;
			for (var i = 0, l = ignoreNodes.length; i < l; i++) {
				if (str.indexOf(ignoreNodes[i]) >= 0) {
					//console.log(" -> ignoreNode()",ignoreNodes[i] +" === "+ str);
					return true;
				}
			}
			//console.log("ignoreNode()",str);
			return false;
		} catch (err) {
			console.error(err);
		}
	}


	// PUBLIC
	return {
		addMainClickEventListener: addMainClickEventListener,
	};
})();
