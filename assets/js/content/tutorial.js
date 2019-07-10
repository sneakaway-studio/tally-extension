"use strict";

window.Tutorial = (function() {

	let DEBUG = false;

	/**
	 *	Checks to see if any tutorial events should be executed
	 */
	function check() {
		try {
			console.log("📎 Tutorial.check()");


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

	/**
	 *	Reset tutorial
	 */
	function reset() {
		try {
			for (var t in tally_progress) {
				if (tally_progress.hasOwnProperty(t)) {
					tally_progress[t] = false;
				}
			}
			// save
			TallyStorage.saveData('tally_progress', tally_progress, "Tutorial.reset()");
		} catch (err) {
			console.error(err);
		}
	}



	// PUBLIC
	return {
		check: check,
		skip: skip,
		reset: reset
	};
}());
