"use strict";

window.Progress = (function() {
	// PRIVATE
	let DEBUG = Debug.ALL.Progress;

	let defaults = {
		// authentication
		"tokenAdded": 0,
		"tokenAddedPlayWelcomeMessage": 0,
		// tutorials
		"mouseEnterTally": 0,
		"mouseLeaveTally": 0,
		"clickTally": 0,
		"doubleClickTally": 0,
		"dragTally": 0,
		"viewTutorialOne": false,
		"viewProfilePage": false,
		// attacks
		"attackLimit": 1,
		"attacksAwarded": 0,
		"attacksSelected": 0,
		// battles
		"battlesFought": 0,
		"battleWon": 0,
		"battleLost": 0,
		"battleEscaped": 0,
		"notifyToClickAfterBattle": 0
	};


	/**
	 *	Get value of an individual progress item
	 */
	function get(name) {
		try {
			if (DEBUG) console.log("🕹️ Progress.get() [1]", name);

			// console.log(tally_user, FS_Object.prop(tally_user));
			// console.log(tally_user.progress, FS_Object.prop(tally_user.progress));
			// console.log(tally_user.progress[name], FS_Object.prop(tally_user.progress[name]));

			// if value exists in tally_user && is true | >0 | !""
			if (tally_user.progress[name]) {
				if (DEBUG) console.log("🕹️ Progress.get() [2]", tally_user.progress[name]);
				return tally_user.progress[name].val;
			} else {
				if (DEBUG) console.log("🕹️ Progress.get() [3]" + name + " NOT FOUND");
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
			// only proceed if game active
			if (!Page.mode().active) return;

			// get current value
			let currentVal = get(name),
				newVal = 0;

			// set default if does not exist
			if (!currentVal) currentVal = defaults[name];

			if (DEBUG) console.log("🕹️ Progress.update() [1]", name, currentVal + " " + operator + " " + val);


			// instead of setting, we need to do an operation
			if (operator === "=") {
				// update value
				newVal = val;
			} else {
				// update value
				newVal = FS_Number.operation(currentVal, val, operator);
			}
			if (DEBUG) console.log("🕹️ Progress.update() [2]", name, currentVal + " " + operator + " " + val + " = " + newVal);

			// create progress object
			let obj = {
				"name": name,
				"val": newVal
			};
			// save in background (and on server)
			TallyData.handle("itemData", "progress", obj, "🕹️ Progress.update()");

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
			}
			// AWARD ATTACK - 3rd
			else if (get("attacksAwarded") <= 2 && get("battlesFought") > 0) {
				BattleAttack.rewardAttack("", "defense");
			}
			// AWARD ATTACK - 4th
			else if (get("attacksAwarded") <= 3 && tally_user.score.score > 100) {
				BattleAttack.rewardAttack("", "attack");
			}

			// if tally levels up her attack capacity increases
			let maxAttacksAllowed = 4;
			if (get("attackLimit") < GameData.attackLimits[FS_Number.clamp(tally_user.level, 0, maxAttacksAllowed)]) {
				update("attackLimit", GameData.attackLimits[FS_Number.clamp(tally_user.level, 0, maxAttacksAllowed)]);
				Dialogue.showStr("You can now use " + get("attackLimit") + " attacks in battle!", "happy");
				Dialogue.showStr("Manage your attacks with the button at the top right of browser window.", "happy");
			}

			// update the attacksAwarded count
			update("attacksAwarded", FS_Object.objLength(tally_user.attacks));

		} catch (err) {
			console.error(err);
		}
	}



	/**
	 *	The first time a user adds a token
	 */
	function tokenAdded() {
		try {


			// 1. if this is the first time user is saving a token
			if (update("mouseEnterTally", 1, "+") < 1) {
				if (DEBUG) console.log("💾 > TallyStorage.saveTokenFromDashboard() 1 -> NEW TOKEN WAS SAVED", data);
				// set page mode active
				Page.updateMode("active");
				// run game again
				TallyMain.contentStartChecks();
			}
			// 2. after the page has refreshed
			else if (update("tokenAddedPlayWelcomeMessage", 1, "+") < 1) {
				if (DEBUG) console.log("💾 > TallyStorage.saveTokenFromDashboard() 2 -> NEW TOKEN WAS SAVED", data);

				// introductions, then encourage them to explore
				Dialogue.showStr("Oh hi! I'm Tally!!!", "happy");
				Dialogue.showStr("Your account is now active and you are ready to play!", "happy");
				Dialogue.showStr("This is your dashboard.", "happy");
				Dialogue.showStr("You can edit your profile here.", "happy");
				Dialogue.showStr("Good to stay anonymous though, what with all the monsters around...", "cautious");
				Dialogue.showStr("Now, let's go find some trackers!", "happy");
				Dialogue.showStr("I have a <a target='_blank' href='https://" +
					FS_Object.randomArrayIndex(GameData.trackerDomains) + "'>good idea where there will be some</a>...", "happy");
			}
			// if user has been here before
			else {
				if (DEBUG) console.log("💾 > TallyStorage.saveTokenFromDashboard() 3 -> NEW TOKEN WAS SAVED", data);
				Dialogue.showStr("Your account has been updated!", "happy");
				Dialogue.showStr("Let's go get some <a target='_blank' href='https://" +
					FS_Object.randomArrayIndex(GameData.trackerDomains) + "'>trackers</a>!", "happy");
				// force a background update to confirm with API / background
				// MAYBE DON'T NEED BECAUSE THIS ALL HAPPENS ON UPDATE
				//sendUpdateToBackground(true);
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
