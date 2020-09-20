"use strict";

window.Tutorial = (function () {
	// PRIVATE
	let DEBUG = Debug.ALL.Tutorial,
		// the internal state of the Tutorial - are we playing a tutorial?
		_active = false,
		// the global state of all tutorials
		//  - are we playing some other sequence that should stop all interactions?
		_sequenceActive = false;


	/**
	 *	Control Tutorial state
	 */
	function active(state) {
		try {
			if (state != undefined && (state === true || state === false))
				_active = state;
			// also account for global state
			if (_active === true) _sequenceActive = true;
			return _active;
		} catch (err) {
			console.error(err);
		}
	}
	/**
	 *	Reset tutorial - to start a new one
	 */
	function reset() {
		try {
			_active = false;
			_sequenceActive = false;
		} catch (err) {
			console.error(err);
		}
	}



	/**
	 *	Add tutorial to Dialogue and play, then save progress
	 */
	function play(category, index) {
		try {
			// allow offline
			if (Page.data.mode.notActive) return;
			// don't allow if mode disabled or stealth
			if (T.tally_options.gameMode === "disabled" || T.tally_options.gameMode === "stealth") return;


			if (DEBUG) console.log("📚 Tutorial.play() [1]", index);

			// allow any tutorial or tutorial sequence to stop current one and start new?

			// reset Tutorial
			reset();
			// empty the queue
			Dialogue.emptyTheQueue();
			// set tutorial mode active
			if (_active) return;
			active(true);



			let dialogue = {},
				step = 1, // start @ step 1
				count = FS_Object.countKeysRegex(DialogueData.data[category], index);


			// loop through all the dialogue objects for this tutorial and add them
			while (step > -1) {
				// store each dialogue obj
				dialogue = Dialogue.getData({
					"category": category,
					"index": index + "-" + step // e.g. "story1" + "-" + 1
				});
				if (!dialogue) {
					if (DEBUG) console.log("📚 Tutorial.play() [2] NO DIALOGUE RETURNED", index, step, "/", count, dialogue);
					step = -1;
					break;
				}

				// add 1/3, 2/3, 3/3 ... to text so players know how long it is
				dialogue.before = "<span class='tally tally-tutorial-step tally-dialogue-next'>" + step + "/" + count + "</span> ";
				if (DEBUG) console.log("📚 Tutorial.play() [2]", index, step, "/", count, dialogue);


				// if (DEBUG) console.log("📚 Tutorial.play() [3]", index, step, "of", count, dialogue);

				// play first dialogue of tutorial, instantly
				if (step === 1)
					Dialogue.showData(dialogue, {
						instant: true
					});
				// otherwise add next dialogue to queue
				else
					Dialogue.showData(dialogue, {
						instant: false
					});

				// SAFETY FIRST!
				if (++step > 100) {
					console.warn("📚 Tutorial.play() SAFETY FIRST!");
					break;
				}
			}

			setTimeout(function () {
				active(false);
			}, 500);

			// mark as true and save
			Progress.update("view" + FS_String.ucFirst(index), 1, "+");

		} catch (err) {
			console.error(err);
		}
	}

	/**
	 *	Show a frame of the "slideshow" using a Dialogue.callback
	 */
	function slideshowCallback(callback = null) {
		try {
			// allow offline
			if (Page.data.mode.notActive) return;
			// don't allow if mode disabled or stealth
			if (T.tally_options.gameMode === "disabled" || T.tally_options.gameMode === "stealth") return;

			if (DEBUG) console.log("📚 Tutorial.slideshowCallback() [1]", callback);

			// string to hold the frame HTML
			let frameStr = '';
			if (callback === "closeSlideshow") {
				slideshowVisible(false);
			}


			else if (callback === "changeModeToChill") {
				// save chill mode
				T.tally_options.gameMode = "chill";
				T.tally_options = T.returnGameModeOptions(T.tally_options);
				TallyStorage.saveData("tally_options", T.tally_options);
			}



			/*  story1
			 ******************************************************************************/
			else if (callback === "slideShowCatGifs") {
				frameStr = '<img src="' + chrome.extension.getURL('assets/img/tutorial/funniest-cat-gifs-cat-sit-right-here.gif') + '">';
			} else if (callback === "slideShowKindleMonster") {
				frameStr = '<img src="' + chrome.extension.getURL('assets/img/tutorial/monster-amazon-kindle.gif') + '">';
			} else if (callback === "slideShowPopUpAds") {
				frameStr = '<img src="' + chrome.extension.getURL('assets/img/tutorial/popup-ads.gif') + '">';
			} else if (callback === "slideShowBrowserDetails") {
				frameStr = '';
				if (T.tally_meta.location.ip) {
					frameStr += '<div><i>Your location:</i></div> ';
					if (T.tally_meta.location.ip) frameStr += "<div><b>IP address</b>: " + T.tally_meta.location.ip + "</div> ";
					if (T.tally_meta.location.city) frameStr += "<div><b>City</b>: " + T.tally_meta.location.city + "</div> ";
					if (T.tally_meta.location.region) frameStr += "<div><b>Region</b>: " + T.tally_meta.location.region + "</div> ";
					if (T.tally_meta.location.country) frameStr += "<div><b>Country</b>: " + T.tally_meta.location.country + "</div> ";
					if (T.tally_meta.location.continent) frameStr += "<div><b>Continent</b>: " + T.tally_meta.location.continent + "</div> ";
					if (T.tally_meta.location.lat)
						frameStr += "<div><b>Geolocation</b>: " + T.tally_meta.location.lat + "," + T.tally_meta.location.lng + "</div> ";
					if (T.tally_meta.location.timezone) frameStr += "<div><b>timezone</b>: " + T.tally_meta.location.timezone + "</div> ";
				}
				if (Page.data.browser.platform) {
					frameStr += '<div><i>Your computer</i></div> ';
					if (Page.data.browser.name) frameStr += "<div><b>Browser</b>: " + Page.data.browser.name + "</div> ";
					if (Page.data.browser.cookieEnabled) frameStr += "<div><b>Cookies</b>: " + Page.data.browser.cookieEnabled + "</div> ";
					if (Page.data.browser.language) frameStr += "<div><b>Language</b>: " + Page.data.browser.language + "</div> ";
					if (Page.data.browser.platform) frameStr += "<div><b>Platform</b>: " + Page.data.browser.platform + "</div> ";
				}
			} else if (callback === "slideShowBattle") {
				frameStr = '<img src="' + chrome.extension.getURL('assets/img/tutorial/monster-battle.gif') + '">';
			}



			/*  gameTutorial1
			 ******************************************************************************/

			// if string isn't empty then show it
			if (frameStr) {
				// add to HTML
				$('#tally_slide_show_inner').html(frameStr);
				// make sure slideshow is visible
				slideshowVisible(true);
			}
			// otherwise hide the slideshow
			else {
				// set sequence back to false
				setTimeout(function () {
					// set tutorial sequence inactive
					_sequenceActive = false;
				}, 1000);
				slideshowVisible(false);
			}


		} catch (err) {
			console.error(err);
		}
	}
	/**
	 *	Show or hide the slide show element
	 */
	function slideshowVisible(state) {
		try {
			if (state) {
				$('#tally_slide_show').css({
					"display": "block",
					"left": "300px",
					"opacity": 1
				});
			} else {
				$('#tally_slide_show').css({
					"display": "none",
					"left": "-1500px",
					"opacity": 0
				});
			}
		} catch (err) {
			console.error(err);
		}
	}



	/**
	 *	Skip tutorial - when user has finished everything
	 */
	function skip() {
		try {

		} catch (err) {
			console.error(err);
		}
	}






	// PUBLIC
	return {
		set active(value) {
			active(value); // call internal method to set both true
		},
		get active() {
			return _active;
		},
		set sequenceActive(value) {
			_sequenceActive = value;
		},
		get sequenceActive() {
			return _sequenceActive;
		},

		play: play,
		slideshowCallback: slideshowCallback,
		slideshowVisible: slideshowVisible,
		skip: skip,
		reset: reset
	};
}());
