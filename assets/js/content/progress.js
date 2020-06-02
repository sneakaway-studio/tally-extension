"use strict";

window.Progress = (function() {
	// PRIVATE
	let DEBUG = Debug.ALL.Progress;

	let defaults = {
		// attacks
		"attacksAwarded": 0,
		"attacksSelected": 0,
		// battles
		"battlesFought": 0,
		"battlesWon": 0,
		"battlesLost": 0,
		"battleEscaped": 0,
		"notifyToClickAfterBattle": 0,
		//
		"consumables": 0,
		"cookies": 0,
		// interaction
		"clickTallySingle": 0,
		"clickTallyDouble": 0,
		"clickTallyTriple": 0,
		"clickTallyQuadruple": 0,
		"dragTally": 0,
		"mouseEnterTally": 0,
		"mouseLeaveTally": 0,
		// disguises
		"disguisesAwarded": 0,
		// things to tell the player
		"toldToDragTally": 0,
		"toldToClickDouble": 0,
		// tutorials
		"viewTutorial1": 0,
		"viewProfilePage": 0,
		"viewDashboardPage": 0,
		// authentication
		"tokenAdded": 0,
		"tokenAddedWelcomeMessage": 0,
	};


	/**
	 *	Get value of an individual progress item
	 */
	function get(name) {
		try {
			// if (DEBUG) console.log("🕹️ Progress.get() [1]", name);

			// console.log(tally_user, FS_Object.prop(tally_user));
			// console.log(tally_user.progress, FS_Object.prop(tally_user.progress));
			// console.log(tally_user.progress[name], FS_Object.prop(tally_user.progress[name]));

			// if value exists in tally_user && is true | >0 | !""
			if (FS_Object.prop(tally_user.progress[name])) {
				// if (DEBUG) console.log("🕹️ Progress.get() [2]", tally_user.progress[name]);
				return parseInt(tally_user.progress[name].val);
			} else {
				// if (DEBUG) console.log("🕹️ Progress.get() [3]" + name + " NOT FOUND");
				return false;
			}
		} catch (err) {
			console.error(err);
		}
	}


	/**
	 *	Update progress in background and on server, return original value
	 */
	function update(name, val, operator = "=") {
		try {
			// allow offline
			if (Page.mode().notActive) return;
			// don't allow if mode disabled or stealth
			if (tally_options.gameMode === "disabled") return;

			// get current value
			let currentVal = get(name),
				newVal = 0;

			// set default if does not exist
			if (!currentVal) currentVal = defaults[name];

			// instead of setting, we need to do an operation
			if (operator === "=") {
				// update value
				newVal = val;
			} else {
				// update value
				newVal = FS_Number.operation(currentVal, val, operator);
			}
			if (DEBUG) console.log("🕹️ Progress.update()", name, currentVal + " " + operator + " " + val + " = " + newVal);

			// create progress object
			let obj = {
				"name": name,
				"val": newVal
			};

			// if an update happened
			if (newVal !== currentVal) {
				// save in background (and on server)
				TallyData.handle("itemData", "progress", obj, "🕹️ Progress.update()");
			}

			// return current value so we can use it in game logic too
			return currentVal;

		} catch (err) {
			console.error(err);
		}
	}

	/**
	 *	Checks to see if any progress events should be executed
	 */
	function check(caller = "Progress") {
		try {
			if (DEBUG) console.log("🕹️ Progress.check() caller =", caller, tally_user.progress);
			// return if not found
			if (!tally_user.progress) return;



			// AWARD ATTACK - 1st
			if (get("attacksAwarded") <= 0 && tally_user.score.score > 1) {
				BattleAttack.rewardAttack("", "attack");
			}
			// AWARD ATTACK - 2nd
			else if (get("attacksAwarded") <= 1 && tally_user.score.score > 10) {
				BattleAttack.rewardAttack("", "attack");
				Dialogue.showStr("Manage your attacks with the button at the top right of browser window.", "happy");
			}
			// AWARD ATTACK - 3rd
			else if (get("attacksAwarded") <= 2 && get("battlesFought") > 0) {
				BattleAttack.rewardAttack("", "defense");
			}
			// AWARD ATTACK - 4th
			else if (get("attacksAwarded") <= 3 && tally_user.score.score > 100) {
				BattleAttack.rewardAttack("", "attack");
			}


			if (DEBUG) console.log("🕹️ Progress.check()", typeof get("attacksAwarded"), typeof FS_Object.objLength(tally_user.attacks));

			if (get("attacksAwarded") !== FS_Object.objLength(tally_user.attacks)) {
				// update the attacksAwarded count
				update("attacksAwarded", FS_Object.objLength(tally_user.attacks));
			}

		} catch (err) {
			console.error(err);
		}
	}



	/**
	 *	User adds or updates token
	 */
	function tokenAdded() {
		try {
			if (DEBUG) console.log("🕹️ Progress.tokenAdded() [1] -> 🔑 SAVED");

			// increment counter
			let tokenCount = update("tokenAdded", 1, "+");

			// 1. if this is the first time user is saving a token
			if (update("tokenAddedWelcomeMessage", 1, "+") < 1 && tokenCount < 1) {
				if (DEBUG) console.log("🕹️ Progress.tokenAdded() [2] -> 🔑 FIRST");
				playIntroduction();
				playTokenUpdated();
				playDashboardIntro();
				playLetsGetTrackers();
			}
			// if user has been here before
			else {
				if (DEBUG) console.log("🕹️ Progress.tokenAdded() [3] -> 🔑 RENEW");
				playTokenUpdated();
				playLetsGetTrackers();
			}

		} catch (err) {
			console.error(err);
		}
	}


	function playIntroduction() {
		try {
			let r = Math.random();
			if (r < 0.33) {
				Dialogue.showStr("Oh hi! I'm Tally!!!", "happy");
			} else if (r < 0.66) {
				Dialogue.showStr("Hello!", "happy");
				Dialogue.showStr("I'm Tally!!!", "happy");
			} else {
				Dialogue.showStr("My name is Tally!!!", "happy");
			}
		} catch (err) {
			console.error(err);
		}
	}

	function playTokenUpdated() {
		try {
			let r = Math.random();
			if (r < 0.33) {
				Dialogue.showStr("Your account has been updated!", "happy");
			} else if (r < 0.66) {
				Dialogue.showStr("Your account is now active and you are ready to play!", "happy");
			} else {
				Dialogue.showStr("Your account is active!", "happy");
			}
		} catch (err) {
			console.error(err);
		}
	}

	function playDashboardIntro() {
		try {
			Dialogue.showStr("This is your dashboard.", "happy");
			Dialogue.showStr("You can edit your profile here.", "happy");
			Dialogue.showStr("Good to stay anonymous though, what with all the monsters around...", "cautious");
		} catch (err) {
			console.error(err);
		}
	}

	function playLetsGetTrackers() {
		try {
			let r = Math.random();
			if (r < 0.33) {
				Dialogue.showStr("Now, let's go find some trackers!", "happy");
				Dialogue.showStr("I have a <a target='_blank' href='https://" +
					FS_Object.randomArrayIndex(GameData.trackerDomains) + "'>good idea where there will be some</a>...", "happy");
			} else if (r < 0.66) {
				Dialogue.showStr("Let's go get some <a target='_blank' href='https://" +
					FS_Object.randomArrayIndex(GameData.trackerDomains) + "'>trackers</a>!", "happy");
			} else {
				Dialogue.showStr("Want to find some <a target='_blank' href='https://" +
					FS_Object.randomArrayIndex(GameData.trackerDomains) + "'>trackers</a> with me?", "happy");
			}
		} catch (err) {
			console.error(err);
		}
	}




	// PUBLIC
	return {
		get: get,
		update: update,
		check: check,
		tokenAdded: tokenAdded
	};
}());
