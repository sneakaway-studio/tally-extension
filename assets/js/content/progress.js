"use strict";

window.Progress = (function() {

	let DEBUG = true;

	/**
	 *	Checks to see if any progress events should be executed
	 */
	function check() {
		try {
			console.log("📎 Progress.check()", tally_progress);
			// return if done
			if (!tally_progress || tally_progress.progressComplete === true) return;



			// AWARD ATTACK - 1st
			if (!tally_progress.award1stAttack &&
				FS_Object.isEmpty(tally_user.attacks) &&
				tally_user.score.score > 3) {
				BattleAttack.rewardAttack("", "attack");
				tally_progress.award1stAttack = true;
			}
			// AWARD ATTACK - 2nd
			if (!tally_progress.award2ndAttack && tally_user.score.score > 15) {
				BattleAttack.rewardAttack("", "defense");
				tally_progress.award2ndAttack = true;
			}
			// AWARD ATTACK - 3rd
			if (!tally_progress.award3rdAttack && tally_progress.battle1stMonster) {
				BattleAttack.rewardAttack("", "attack");
				tally_progress.award3rdAttack = true;
			}
			// AWARD ATTACK - 4th
			if (!tally_progress.award4thAttack && tally_user.score.score > 100) {
				BattleAttack.rewardAttack("", "defense");
				tally_progress.award4thAttack = true;
			}


			// if tally levels up her capactity for using attacks in battle increases
			if (tally_progress.atackLimit < GameData.attackLimits[tally_user.score.level]) {
				tally_progress.atackLimit = GameData.attackLimits[tally_user.score.level];
				// tell user
				Thought.showString("You can now use " + tally_progress.atackLimit + " attacks in battle!", "happy");
			}

			checkLevel();

			// final check
			if (!tally_progress.progressComplete) {
				let allComplete = true;
				// check to see if all have been completed
				for (var prop in tally_progress) {
					if (tally_progress.hasOwnProperty(prop)) {
						// mark them if so
						if (tally_progress[prop] !== true) allComplete = false;
					}
				}
				if (allComplete) tally_progress.progressComplete = true;
			}

			// save after updates
			TallyStorage.saveData('tally_progress', tally_progress);

		} catch (err) {
			console.error(err);
		}

	}

	/**
	 *  Check to see if user leveled up
	 */
	function checkLevel() {
		try {
			if (DEBUG) console.log("📎 Progress.checkLevel()", tally_user.score);

			let newLevel = tally_user.score.level;

			// they may have just installed a new version but already have experience
			// start at current level to save loops
			for (let i = newLevel; i < GameData.levels.length; i++) {
				// if score is higher than or equal to
				if (tally_user.score.score >= GameData.levels[i].xp) {
					// increase  level
					newLevel = i;
				} else {
					break;
				}
			}

			if (DEBUG) console.log("📎 Progress.checkLevel()", "newLevel="+newLevel, "tally_user.score.level="+tally_user.score.level);


			// if they have leveled up
			if (newLevel > tally_user.score.level) {
				// save level
				tally_user.score.level = newLevel;

				// update stats
				Stats.reset("tally");
				// tell user
				Thought.showString("You just leveled up!", "happy");
				// save after updates
				TallyStorage.saveData('tally_user', tally_user);

				// create backgroundUpdate object
				var backgroundUpdate = TallyStorage.newBackgroundUpdate();
				// store the data
				backgroundUpdate.scoreData.level = newLevel;
				// then push to the server
				sendBackgroundUpdate(backgroundUpdate);

				return true;
			}

		} catch (err) {
			console.error(err);
		}
	}







	/**
	 *	Reset progress
	 */
	function reset() {
		try {
			for (var t in tally_progress) {
				if (tally_progress.hasOwnProperty(t)) {
					tally_progress[t] = false;
				}
			}
			// save
			TallyStorage.saveData('tally_progress', tally_progress);
		} catch (err) {
			console.error(err);
		}
	}



	// PUBLIC
	return {
		check: check,
		checkLevel: checkLevel,
		reset: reset
	};
}());
