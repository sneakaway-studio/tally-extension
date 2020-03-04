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
			if (Page.mode().notActive) return;
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
				dialogue = Dialogue.get(["tutorial", null, which + "-" + step]);

				// testing
				if (DEBUG) console.log("📚 Tutorial.play() [2]", step, which, dialogue);

				// check to see if there is more dialogue
				if (dialogue !== undefined) {
					// if (DEBUG) console.log("📚 Tutorial.play() [3]", step, which, dialogue);

					// play first dialogue of tutorial, instantly
					if (step === 1) Dialogue.show(dialogue, true, true, true);
					// otherwise add next dialogue to queue
					else Dialogue.show(dialogue, true, true);

				} else {
					if (DEBUG) console.log("📚 Tutorial.play() [4] NO MORE DIALOGUE");

					// hide slide show and break loop
					dialogueCallbackVisible(false);
					break;
				}
				step++;
			}

			setTimeout(function() {
				active(false);
			}, 500);

			// mark as true and save
			Progress.update("play" + FS_String.ucFirst(which), true);

		} catch (err) {
			console.error(err);
		}
	}

	function dialogueCallback(callback = null) {
		try {
			// allow offline
			if (Page.mode().notActive) return;
			// don't allow if mode disabled or stealth
			if (tally_options.gameMode === "disabled" || tally_options.gameMode === "stealth") return;

			if (DEBUG) console.log("📚 Tutorial.dialogueCallback()", callback);

			let str = '';

			if (callback === "slideShowCatGifs") {
				str = '<img src="' + chrome.extension.getURL('assets/img/tutorial/funniest-cat-gifs-cat-sit-right-here.gif') + '">';

			} else if (callback === "slideShowKindleMonster") {
				str = '<img src="' + chrome.extension.getURL('assets/img/tutorial/monster-amazon-kindle.gif') + '">';

			} else if (callback === "slideShowPopUpAds") {
				str = '<img src="' + chrome.extension.getURL('assets/img/tutorial/popup-ads.gif') + '">';

			} else if (callback === "slideShowBrowserDetails") {
				str = '<span>' +
					JSON.stringify(tally_meta.location).replace(",", ", ") + ", " +
					JSON.stringify(Page.data.browser).replace(",", ", ") +
					'</span>';

			} else if (callback === "slideShowBattle") {
				str = '<img src="' + chrome.extension.getURL('assets/img/tutorial/monster-battle.gif') + '">';

			} else if (callback === "tutorial1WaitAtEnd") {
				str = "";
				dialogueCallbackVisible(false);

			} else {
				// do nothing
			}
			// add string and show
			if (str) {
				$('#tally_slide_show_inner').html(str);
				dialogueCallbackVisible(true);
			} else dialogueCallbackVisible(false);


		} catch (err) {
			console.error(err);
		}
	}
	/**
	 *	Slide show
	 */
	function dialogueCallbackVisible(state) {
		try {
			if (state) { // show it
				$('#tally_slide_show').css({
					"display": "block",
					"left": "300px",
					"opacity": 1
				});
			} else { // hide it
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
		dialogueCallback: dialogueCallback,
		skip: skip
	};
}());
