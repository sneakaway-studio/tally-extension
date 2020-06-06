"use strict";

window.Tutorial = (function() {
	// PRIVATE
	let DEBUG = Debug.ALL.Tutorial,
		_active = false;


	/**
	 *	Control Tutorial state
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
	 *	Add tutorial to Dialogue and play
	 */
	function play(which) {
		try {
			// allow offline
			if (Page.data.mode.notActive) return;
			// don't allow if mode disabled or stealth
			if (tally_options.gameMode === "disabled" || tally_options.gameMode === "stealth") return;

			if (DEBUG) console.log("📚 Tutorial.play() [1]", which);

			// set tutorial mode active
			if (_active) return;
			active(true);

			let dialogue = {},
				step = 1;

			// loop through all the dialogue objects for this tutorial and add them
			while (step > -1) {
				// store each dialogue obj
				dialogue = Dialogue.getData({"category": "tutorial", "index": which + "-" + step});

				// testing
				if (DEBUG) console.log("📚 Tutorial.play() [2]", step, which, dialogue);

				// check to see if there is more dialogue
				if (dialogue !== undefined) {
					// if (DEBUG) console.log("📚 Tutorial.play() [3]", step, which, dialogue);

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


				} else {
					if (DEBUG) console.log("📚 Tutorial.play() [4] NO MORE DIALOGUE");

					// hide slide show and break loop
					slideshowVisible(false);
					break;
				}
				step++;

				if (step > 100) {
					console.error("📚 Tutorial.play() ONLY 100 STEPS ALLOWED");
					break;
				}
			}

			setTimeout(function() {
				active(false);
			}, 500);

			// mark as true and save
			Progress.update("play" + FS_String.ucFirst(which), 1, "+");

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
			if (tally_options.gameMode === "disabled" || tally_options.gameMode === "stealth") return;

			if (DEBUG) console.log("📚 Tutorial.slideshowCallback() [1]", callback);

			// string to hold the frame HTML
			let frameStr = '';
			if (callback === "closeSlideshow") {
				slideshowVisible(false);
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
				if (tally_meta.location.ip) {
					frameStr += '<div><i>Your location:</i></div> ';
					if (tally_meta.location.ip) frameStr += "<div><b>IP address</b>: " + tally_meta.location.ip + "</div> ";
					if (tally_meta.location.city) frameStr += "<div><b>City</b>: " + tally_meta.location.city + "</div> ";
					if (tally_meta.location.region) frameStr += "<div><b>Region</b>: " + tally_meta.location.region + "</div> ";
					if (tally_meta.location.country) frameStr += "<div><b>Country</b>: " + tally_meta.location.country + "</div> ";
					if (tally_meta.location.continent) frameStr += "<div><b>Continent</b>: " + tally_meta.location.continent + "</div> ";
					if (tally_meta.location.lat)
						frameStr += "<div><b>Geolocation</b>: " + tally_meta.location.lat + "," + tally_meta.location.lng + "</div> ";
					if (tally_meta.location.timezone) frameStr += "<div><b>timezone</b>: " + tally_meta.location.timezone + "</div> ";
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
			else slideshowVisible(false);


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
		active: function(state) {
			return active(state);
		},
		play: play,
		slideshowCallback: slideshowCallback,
		skip: skip
	};
}());
