self.TallyListeners = (function() {
	// PRIVATE
	let DEBUG = Debug.ALL.TallyListeners;

	// "shim" for clicking on SVGs
	SVGAnimatedString.prototype.indexOf = function() {
		return this.baseVal.indexOf.apply(this.baseVal, arguments);
	};



	/**
	 *	addMainClickEventListener() - adds click event listener for anything "mouse"
	 */
	function addMainClickEventListener() {
		try {
			// do not allow offline
			if (!Page.data.mode.loggedIn) return;
			// don't allow if mode disabled
			if (T.tally_options.gameMode === "disabled") return;

			// core mouseup listener
			document.addEventListener("mouseup", function(e) {
				// a bit of throttling: if mouseup was just fired ignore this click
				if (Page.data.actions.mouseupFired != true) {
					// set to true
					Page.data.actions.mouseupFired = true;
					// and reset timer
					setTimeout(function() {
						Page.data.actions.mouseupFired = false;
					}, 500);
					// get data about the event
					let eventData = {
						action: null,
						mouseX: e.clientX,
						mouseY: e.clientY,
						tag: (e.target || e.srcElement).tagName,
						text: (e.target || e.srcElement).textContent.trim()
					};
					// update Page.data
					Page.data.mouseX = eventData.mouseX;
					Page.data.mouseY = eventData.mouseY;
					// include parent tags if they exist
					if (FS_Object.prop(e.target.parentElement)) {
						eventData.parentTag = (e.target.parentElement || e.srcElement.parentNode).tagName;
						// include grandparent tags...
						if (FS_Object.prop(e.target.parentElement.parentElement))
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
			// allow offline
			if (Page.data.mode.notActive) return;
			// don't allow if mode disabled
			if (T.tally_options.gameMode === "disabled") return;


			let caller = "👂 TallyListeners.clickEventHandler()";

			// if (DEBUG) console.log(caller + " > eventData", eventData);
			// if (DEBUG) console.log(caller + " > target", target, target.className);

			// for updating the background object later on
			let scoreData = {};

			/**
			 * 	1. Determine if this is a node we want to ignore (tally interface links, etc.)
			 */

			let exit = "";
			if (ignoreNode(target.id) || ignoreNode(target.className) || ignoreNode(eventData.tag))
				exit = " -> ignore [" + target.id + ", " + eventData.tag + "] node(s)";
			// else if ( Page.data.url == Page.data.previousUrl) // THIS BREAKS ON FB
			// 	exit = " -> url is not different";
			if (exit !== "") {
				if (DEBUG) console.log(caller + " > event => mouseup" + exit);
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
				// if (DEBUG) console.log(caller + " > event => mouseup" + exit);
				return;
			}

			/**
			 * 	3. We've made it this far, let's respond to the type of click
			 */

			// for all clicks, buttons
			if (eventData.action == "click" || eventData.action == "button") {
				if (DEBUG) console.log(caller + " => mouseup -> [" + eventData + "]");

				// more checking...

				// check if it is a FB like
				if ( /* FB */
					eventData.text == "Like" || target.className == "_39n" ||
					eventData.text == "Love" || target.className == "_39n" ||
					eventData.text == "Haha" || target.className == "_39n" ||
					eventData.text == "Wow" || target.className == "_39n" ||
					eventData.text == "Sad" || target.className == "_39n" ||
					eventData.text == "Angry" || target.className == "_39n" ||
					/* Twitter */
					target.className.indexOf("ProfileTweet-actionCountForPresentation") > -1
				) {
					eventData.action = "like";
					scoreData.likes++;
					// add to likes
					TallyData.queue("scoreData", "likes", 1, caller);
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
				TallyData.queue("scoreData", "clicks", 1, caller);
				// add and update score
				TallyData.queue("scoreData", "score", GameData.clickScore[eventData.action], caller);

				// when a user clicks one of the following happens
				// 1) dynamic page (react, etc.) and the url didn't changed
				// 2) dynamic page and url DID change
				// 3) static page and they are using form elements, etc.
				// 4) we are headed to a new page
				// in any case, check, send, and reset update for every click
				// update server immediately
				TallyData.pushUpdate(caller);


				/**
				 * 	5. Game responses
				 */

				// only allow points for clicking the first time (FB Like, etc.)
				$(target).toggleClass("tally-clicked");
				// play sound
				Sound.playCategory('user', 'click');
				// show click visual
				Effect.showClickVisualText(eventData, "+" + GameData.clickScore[eventData.action]);
				// update stats display
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
		"tally", "body", "tally-clicked"
	];
	/**
	 *	Confirm target is not a Tally link
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
