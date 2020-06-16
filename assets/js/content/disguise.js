"use strict";

/*  DISGUISE
 ******************************************************************************/

window.Disguise = (function() {
	// PRIVATE

	let DEBUG = Debug.ALL.Disguise,
		disguiseKeysToIndex = [],
		disguiseCount = 0,
		currentDisguiseIndex = -1,
		currentDisguiseName = "", // currentDisguiseName
		currentDisguiseObj = {}; //DisguiseData.data[currentDisguiseName];







	/**
	 * 	Display a random disguise
	 */
	function selector(playDialogue = true) {
		try {
			disguiseCount = FS_Object.objLength(T.tally_user.disguises);
			if (disguiseCount > 0) {
				if (DEBUG) console.log("😎 Disguise.selector() [1] currentDisguiseObj =", currentDisguiseObj);

				// running at page load
				if (currentDisguiseIndex < 0) {
					// pick a random one
					currentDisguiseObj = FS_Object.randomObjProperty(T.tally_user.disguises);
					currentDisguiseName = currentDisguiseObj.name;
					// get index
					Object.keys(T.tally_user.disguises).forEach(function(key, index) {
						// if (DEBUG) console.log("😎 Disguise.selector() [1.1] key =", key, ", index =", index, T.tally_user.disguises[index]);
						// save index of randomly selected disguise
						if (key === currentDisguiseName) {
							currentDisguiseIndex = index;
						}
						// save all indexes
						disguiseKeysToIndex.push(key);
					});
					// if (DEBUG) console.log("😎 Disguise.selector() [1.2] disguiseKeysToIndex =", disguiseKeysToIndex);
				}
				// else they clicked
				else {
					// if (DEBUG) console.log("😎 Disguise.selector() [2.1] currentDisguiseIndex =", currentDisguiseIndex,
					// 	", currentDisguiseObj =", currentDisguiseObj);
					currentDisguiseIndex++;
					// start index at zero if needed
					if (currentDisguiseIndex >= disguiseCount) currentDisguiseIndex = 0;
					currentDisguiseName = disguiseKeysToIndex[currentDisguiseIndex];
					currentDisguiseObj = T.tally_user.disguises[currentDisguiseName];
					// if (DEBUG) console.log("😎 Disguise.selector() [2.2] currentDisguiseIndex =", currentDisguiseIndex,
					// 	", currentDisguiseObj =", currentDisguiseObj);
				}


				if (DEBUG) console.log("😎 Disguise.selector() [2] currentDisguiseObj =", currentDisguiseObj);
				// then display the chosen one
				display(playDialogue);
			}
			// use the count to do something
			return disguiseCount;
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
				"T.tally_user.trackers =", T.tally_user.trackers,
				"Page.data.trackers =", Page.data.trackers
			);
			// return early if there are no disguises, trackers caught, or no trackers blocked
			if (FS_Object.objLength(T.tally_user.disguises < 1) ||
				!FS_Object.prop(T.tally_user.trackers) ||
				FS_Object.objLength(Page.data.trackers.found) < 1 ||
				FS_Object.objLength(Page.data.trackers.blocked) < 1) return;

			// currently picks a random one
			//  ?? need to come back to this if we let players select their own
			// currentDisguiseObj = FS_Object.randomObjProperty(T.tally_user.disguises);

			// selects a random one
			selector(false);

			// if (DEBUG) console.log("😎 Disguise.displayIfTrackerBlocked() [1] currentDisguiseObj =", currentDisguiseObj);
			// display(playDialogue);
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
			for (let i = parseInt(T.tally_user.level); i < 100; i--) {
				// until we get to a disguise that has a leve that matches
				if (FS_Object.prop(DisguiseData.dataByLevel[i])) {
					console.log("😎 Disguise.checkAndReward() [2]", DisguiseData.dataByLevel[i]);
					disguise = DisguiseData.dataByLevel[i];
					break;
				}
			}
			// if they DO NOT currently have that disguise then award it
			if (!FS_Object.prop(T.tally_user.disguises[disguise.name])) {
				console.log("😎 Disguise.checkAndReward() [3] - Disguise has not be received before", T.tally_user.disguises);

				// save in background (and on server)
				TallyData.queue("itemData", "disguises", disguise, "😎 Disguise.checkAndReward()");
				// update progress
				Progress.update("disguisesAwarded", FS_Object.objLength(T.tally_user.disguises));
				// tell user
				Dialogue.showStr("You earned a " + disguise.title + " disguise!", "happy");
			}
		} catch (err) {
			console.error(err);
		}
	}




	// PUBLIC
	return {
		get currentDisguiseObj() {
			return currentDisguiseObj;
		},
		selector: selector,
		returnHtmlStr: returnHtmlStr,
		checkAndReward: checkAndReward,
		displayIfTrackerBlocked: displayIfTrackerBlocked
	};
})();
