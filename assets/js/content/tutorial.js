"use strict";

window.Tutorial = (function() {
	// PRIVATE
	let DEBUG = Debug.ALL.Tutorial,
		_active = false;


	// control state
	function active(state) {
		try {
			if (state != undefined && (state === true || state === false))
				_active = state;
			return _active;
		} catch (err) {
			console.error(err);
		}
	}


	function show(str) {
		console.log("📚 Tutorial.show()", str);
	}


	/**
	 *	Play tutorial
	 */
	function play(which) {
		try {
			// set tutorial mode active
			if (_active) return;
			active(true);

			let dialogue = {},
				step = 1;

			while (step > -1) {
				// store dialogue obj
				dialogue = Dialogue.get(["tutorial", null, which + "-" + step]);


				// testing
				console.log("📚 Tutorial.play()", step, which, dialogue);


				// check to see if there is more dialogue
				if (dialogue === undefined) {
					console.log("📚 Tutorial.play()", step, which, dialogue);
					// hide slide show
					dialogueCallbackVisible(false);
					break;
				} else {

					console.log("📚 Tutorial.play()", step, which, dialogue);

					// execute a callback if exists
					// if (dialogue.callback) show(dialogue.callback);

					if (step === 1)
						// first dialogue of tutorial, instantly
						Dialogue.show(dialogue, true, true, true);
					else
						// show next dialogue
						Dialogue.show(dialogue, true, true);
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
		play: function(which) {
			play(which);
		},
		dialogueCallback: function(callback) {
			dialogueCallback(callback);
		},
		skip: skip
	};
}());
