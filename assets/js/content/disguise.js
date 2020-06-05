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
	function randomizer(playDialogue = true) {
		try {
			currentDisguiseObj = FS_Object.randomObjProperty(DisguiseData.data);
			if (DEBUG) console.log("😎 Disguise.randomizer() [1] currentDisguiseObj =", currentDisguiseObj);
			display(playDialogue);
		} catch (err) {
			console.error(err);
		}
	}

	/**
	 * 	Display a disguise if tracker is blocked
	 */
	function displayIfTrackerBlocked(playDialogue = true) {
		try {

			if (DEBUG) console.log("😎 Disguise.displayIfTrackerBlocked() [1]",
				"tally_user.trackers =", tally_user.trackers,
					"Page.data.trackers =", Page.data.trackers
			);



			// if there are trackers blocked and this page has a tracker
			if (!tally_user.trackers || Page.data.trackers.length < 1) return;
			// if there are trackers blocked
			// if (FS_Object.prop(tally_user.trackers) && FS_Object.prop(tally_user.trackers[]))
			currentDisguiseObj = FS_Object.randomObjProperty(tally_user.disguises);
			if (DEBUG) console.log("😎 Disguise.displayIfTrackerBlocked() [1] currentDisguiseObj =", currentDisguiseObj);
			display(playDialogue);
		} catch (err) {
			console.error(err);
		}
	}

	function returnHtmlStr() {
		try {
			// if (DEBUG) console.log("😎 Disguise.returnHtmlStr() [1] currentDisguiseObj =", currentDisguiseObj);
			return "<img class='tally' src='" + chrome.extension.getURL('assets/img/tally-disguises/' +
				currentDisguiseObj.name + DisguiseData.data[currentDisguiseObj.name].ext) + "'>";
		} catch (err) {
			console.error(err);
		}
	}

	function display(playDialogue = true) {
		try {
			$(".tally_disguise").html(returnHtmlStr());
			// should we play dialogue that comes with it?
			if (playDialogue) includeDialogue();
		} catch (err) {
			console.error(err);
		}
	}
	// should dialogue be included? default = true
	function includeDialogue() {
		try {
			// if there is dialogue for this disguise
			if (Dialogue.getData({
					category: "disguise",
					subcategory: currentDisguiseObj.name,
				})) {
				Dialogue.showData(Dialogue.getData({
					category: "disguise",
					subcategory: currentDisguiseObj.name
				}), {
					addIfInProcess: false
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
					addIfInProcess: false
				});
			}
		} catch (err) {
			console.error(err);
		}
	}



	/**
	 *	Check to see if we should reward Tally with a new disguise
	 */
	function checkAndReward() {
		try {
			if (DEBUG) console.log("😎 Disguise.checkAndReward() [1]");

			let disguise = {};

			// count down from current level ...
			for (let i = parseInt(tally_user.level); i < 100; i--) {
				// until we get to a disguise that has a leve that matches
				if (FS_Object.prop(DisguiseData.dataByLevel[i])) {
					console.log("😎 Disguise.checkAndReward() [2]", DisguiseData.dataByLevel[i]);
					disguise = DisguiseData.dataByLevel[i];
					break;
				}
			}
			// if they DO NOT currently have that disguise then award it
			if (!FS_Object.prop(tally_user.disguises[disguise.name])) {
				console.log("😎 Disguise.checkAndReward() [3] - Disguise has not be received before", tally_user.disguises);

				// save in background (and on server)
				TallyData.handle("itemData", "disguises", disguise, "😎 Disguise.checkAndReward()");
				// update progress
				Progress.update("disguisesAwarded", FS_Object.objLength(tally_user.disguises));
				// tell user
				Dialogue.showStr("You earned a " + disguise.title + " disguise!", "happy");
			}
		} catch (err) {
			console.error(err);
		}
	}




	// PUBLIC
	return {
		randomizer: randomizer,
		returnHtmlStr: returnHtmlStr,
		checkAndReward: checkAndReward,
		displayIfTrackerBlocked: displayIfTrackerBlocked
	};
})();
