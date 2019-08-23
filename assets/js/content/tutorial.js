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


				// check to see if there is dialogue
				if (dialogue === undefined) {
				console.log("📚 Tutorial.play()", step, which, dialogue);
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

	// function playSingle(dialogue)


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
		skip: skip
	};
}());
