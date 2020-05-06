"use strict";

/*  DISGUISE
 ******************************************************************************/

window.Disguise = (function() {
	// PRIVATE

	let DEBUG = Debug.ALL.Disguise,
		currentDisguiseName = "glasses-3d",
		currentDisguiseObj = DisguiseData.data[currentDisguiseName];


/**
 * 	Display a random disguise
 */
	function randomizer() {
		try {
			currentDisguiseObj = FS_Object.randomObjProperty(DisguiseData.data);
			if (DEBUG) console.log("😎 Disguise.randomizer() [1] currentDisguiseObj =", currentDisguiseObj);
			display();
		} catch (err) {
			console.error(err);
		}
	}

	function returnHtmlStr() {
		try {
			if (DEBUG) console.log("😎 Disguise.returnHtmlStr() [1] currentDisguiseObj =", currentDisguiseObj);
			// if there is dialogue for this disguise
			if (Dialogue.getData({
					category: "disguise",
					subcategory: currentDisguiseObj.name,
				})) {
				Dialogue.showData(Dialogue.getData({
					category: "disguise",
					subcategory: currentDisguiseObj.name
				}), {
					addIfInProcess: false,
					instant: true
				});
			}
			// otherwise play a random one
			else if (Dialogue.getData({
				category: "disguise",
				subcategory: "random"
			})) {
				Dialogue.showData(Dialogue.getData({
					category: "disguise",
					subcategory: "random"
				}), {
					addIfInProcess: false,
					instant: true
				});
			}
			return "<img class='tally' src='" + chrome.extension.getURL('assets/img/tally-disguises/' + currentDisguiseObj.name + currentDisguiseObj.ext) + "'>";
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
