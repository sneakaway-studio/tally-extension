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
		try { return;
			currentDisguiseObj = FS_Object.randomObjProperty(DisguiseData.data);
			if (DEBUG) console.log("😎 Disguise.randomizer() [1] currentDisguiseObj =", currentDisguiseObj);
			display(playDialogue);
		} catch (err) {
			console.error(err);
		}
	}

	function returnHtmlStr() {
		try {
			if (DEBUG) console.log("😎 Disguise.returnHtmlStr() [1] currentDisguiseObj =", currentDisguiseObj);
			return "<img class='tally' src='" + chrome.extension.getURL('assets/img/tally-disguises/' + currentDisguiseObj.name + currentDisguiseObj.ext) + "'>";
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
		} catch (err) {
			console.error(err);
		}
	}



	/**
	 *	Check to see if we should reward Tally with a new disguise
	 */
	function reward() {
		try {
			if (DEBUG) console.log("😎 Disguise.reward() [1]");

			// if ()
			//
			//
			//
			// // get random attack
			// let attack = AttackData.returnAttack(name, type);
			//
			// // make sure tally doesn't already have that attack
			// let safety = 0;
			// while (prop(tally_user.attacks[attack.name])) {
			// 	// if so get a new one, passing name and type if set
			// 	attack = AttackData.returnAttack(name, type);
			// 	// exit if all attacks have been rewarded
			// 	if (++safety > 10) break;
			// }
			// if (DEBUG) console.log("💥 BattleAttack.rewardAttack() name=" + attack.name + ", type=" + attack.type);
			//
			//
			// // attack is selected by default
			// attack.selected = 1;
			// // unless # selected is already >= to limit
			// let selected = returnAttacksSelected();
			// if (selected >= 4) {
			// 	attack.selected = 0;
			// } else {
			// 	Progress.update("attacksSelected", selected + 1);
			// }
			//
			// // update progress
			// Progress.update("disguisesAwarded", FS_Object.objLength(tally_user.attacks));
			// // save in background (and on server)
			// TallyData.handle("itemData", "attacks", attack, "💥 BattleAttack.rewardAttack()");
			//
			// // tell user
			// Dialogue.showStr("You earned a " + disguise.name + " " + disguise.type + "!", "happy");
		} catch (err) {
			console.error(err);
		}
	}




	// PUBLIC
	return {
		randomizer: randomizer,
		returnHtmlStr: returnHtmlStr,
		reward: reward
	};
})();
