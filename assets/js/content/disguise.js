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

	function returnHtmlStr() {
		try {
			return "<img src='" + chrome.extension.getURL('assets/img/tally-disguises/glasses-sun-sunset.png') + "'>";
		} catch (err) {
			console.error(err);
		}
	}

	function display() {
		try {
			$(".tally_disguise").html(returnHtmlStr());
		} catch (err) {
			console.error(err);
		}
	}


	// PUBLIC
	return {
		randomizer: randomizer,
		returnHtmlStr: returnHtmlStr
	};
})();
