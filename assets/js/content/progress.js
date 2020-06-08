"use strict";

window.Progress = (function() {
	// PRIVATE
	let DEBUG = Debug.ALL.Progress;

	let defaults = {
		// attacks
		attacksAwarded: 0,
		attacksSelected: 0,
		// battles
		battlesFought: 0,
		battlesWon: 0,
		battlesLost: 0,
		battleEscaped: 0,
		notifyToClickAfterBattle: 0,

		// items
		consumables: 0,
		cookies: 0,
		// interaction
		clickTallySingle: 0,
		clickTallyDouble: 0,
		clickTallyTriple: 0,
		clickTallyQuadruple: 0,
		dragTally: 0,
		mouseEnterTally: 0,
		mouseLeaveTally: 0,
		// disguises
		disguisesAwarded: 0,

		// page tags
		pageTagsCats: 0,
		pageTagsErrors: 0,
		pageTagsEncryption: 0,
		pageTagsLegal: 0,
		pageTagsNetworks: 0,
		pageTagsNews: 0,
		pageTagsPhotos: 0,
		pageTagsProfanity: 0,

		// things to tell the player
		toldToDragTally: 0,
		toldToClickDouble: 0,

		// trackers
		trackersSeen: 0,
		trackersSeenMostOnePage: 0,
		trackersBlocked: 0,

		// authentication
		tokenAdded: 0,
		tokenAddedWelcomeMessage: 0,

		// tutorials
		viewTutorial1: 0,
		viewProfilePage: 0,
		viewDashboardPage: 0,
	};

	let pageTagsProgressMatches = 0 // whether or not page tags match progress items
	;


	/**
	 *	Get value of an individual progress item   ** INTEGERS ONLY ? **
	 */
	function get(name) {
		try {
			// if (DEBUG) console.log("🕹️ Progress.get() [1]", name);
			// if (DEBUG) console.log("🕹️ Progress.get()", name, T.tally_user, FS_Object.prop(T.tally_user));
			// if (DEBUG) console.log("🕹️ Progress.get()", name, T.tally_user.progress, FS_Object.prop(T.tally_user.progress));
			if (DEBUG) console.log("🕹️ Progress.get()", name, T.tally_user.progress[name], FS_Object.prop(T.tally_user.progress[name]));
			// console.trace();

			// if value exists in T.tally_user && is true | >0 | !""
			if (FS_Object.prop(T.tally_user.progress[name])) {
				// if (DEBUG) console.log("🕹️ Progress.get() [2]", T.tally_user.progress[name]);
				return parseInt(T.tally_user.progress[name].val);
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
			if (Page.data.mode.notActive) return;
			// don't allow if mode disabled or stealth
			if (T.tally_options.gameMode === "disabled") return;

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
			// if (DEBUG) console.log("🕹️ Progress.update()", name, currentVal + " " + operator + " " + val + " = " + newVal);

			// create progress object
			let obj = {
				"name": name,
				"val": newVal
			};

			// if an update happened
			if (newVal !== currentVal) {
				// save in background (and on server)
				TallyData.queue("itemData", "progress", obj, "🕹️ Progress.update()");
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
			if (DEBUG) console.log("🕹️ Progress.check() [1] caller =", caller, T.tally_user.progress);
			// return if not found
			if (!T.tally_user.progress) return;


			// count any relevant tags on the page
			pageTagsProgressMatches = countPageTags();
			// console.log("🕹️ Progress.check() [2]", Page.data.tags.length, pageTagsProgressMatches);


			////////////////////////////// ATTACKS //////////////////////////////

			let attacksAwarded = get("attacksAwarded");

			// AWARD ATTACK - 1st
			if (attacksAwarded <= 0 && T.tally_user.score.score > 1) {
				BattleAttack.rewardAttack("", "attack");
			}
			// AWARD ATTACK - 2nd
			else if (attacksAwarded <= 1 && T.tally_user.score.score > 10) {
				BattleAttack.rewardAttack("", "attack");
				Dialogue.showStr("Manage your attacks with the button at the top right of browser window.", "happy");
			}
			// AWARD ATTACK - 3rd
			else if (attacksAwarded <= 2 && get("battlesFought") > 0) {
				BattleAttack.rewardAttack("", "defense");
			}
			// AWARD ATTACK - 4th
			else if (attacksAwarded <= 3 && T.tally_user.score.score > 100) {
				BattleAttack.rewardAttack("", "attack");
			}
			// ALWAYS UPDATE COUNT
			if (attacksAwarded !== FS_Object.objLength(T.tally_user.attacks)) {
				// update the attacksAwarded count
				update("attacksAwarded", FS_Object.objLength(T.tally_user.attacks));
			}

		} catch (err) {
			console.error(err);
		}
	}


	/**
	 *	Count tags on the page
	 */
	function countPageTags() {
		try {
			if (DEBUG) console.log("🕹️ Progress.countPageTags() [1]", Page.data.tags);

			let result = [], // an array of indexes of matching tags
				matches = 0;
			// loop through all badges that have tags...
			for (var badgeName in Badges.data) {
				// if tags
				if (!Badges.data[badgeName].tags) continue;
				// compare Page.data.tags to badges' tags and perform any Progress.updates
				result = Page.data.tags.filter(value => Badges.data[badgeName].tags.includes(value));
				if (result.length) {
					if (DEBUG) console.log("🕹️ Progress.countPageTags() [2]", badgeName, /* Badges.data[badgeName], */ result);
					// update their progress (adding *total* of all found tags on the page)
					Progress.update(Badges.data[badgeName].progress, result.length, "+");
					// update matches
					matches += 1;
				}
			}
			if (DEBUG) console.log("🕹️ Progress.countPageTags() [3] matches =", matches);
			return matches;

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
					FS_Object.randomArrayIndex(GameData.dataDealerDomains) + "'>good idea where there will be some</a>...", "happy");
			} else if (r < 0.66) {
				Dialogue.showStr("Let's go get some <a target='_blank' href='https://" +
					FS_Object.randomArrayIndex(GameData.dataDealerDomains) + "'>trackers</a>!", "happy");
			} else {
				Dialogue.showStr("Want to find some <a target='_blank' href='https://" +
					FS_Object.randomArrayIndex(GameData.dataDealerDomains) + "'>trackers</a> with me?", "happy");
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
		tokenAdded: tokenAdded,
		get pageTagsProgressMatches() {
			return pageTagsProgressMatches;
		}
	};
}());
