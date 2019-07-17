"use strict";

window.Tutorial = (function() {
	// PRIVATE
	let DEBUG = Debug.ALL.Tutorial;

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



	// PUBLIC
	return {
		check: check,
		skip: skip
	};
}());
