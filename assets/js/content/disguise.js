"use strict";

/*  DISGUISE
 ******************************************************************************/

window.Disguise = (function() {
	// PRIVATE

	let DEBUG = Debug.ALL.Disguise,
	currentDisguiseName = "glasses-3d",
	currentDisguiseObj = {};


	function randomizer() {
		try {
			let disguise = DisguiseData.data[currentDisguiseName];
				if (DEBUG) console.log("😎 Disguise.randomizer() [1] disguise =", disguise);
		} catch (err) {
			console.error(err);
		}
	}

	function display() {
		try {

		} catch (err) {
			console.error(err);
		}
	}


	// PUBLIC
	return {
		randomizer: randomizer,

	};
})();
