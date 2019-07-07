"use strict";

window.Progress = (function() {

	let DEBUG = true;

	/**
	 *	Checks to see if any progress events should be executed
	 */
	function check() {
		try {
			//console.log("🕹️ Progress.check()", tally_progress);
			// return if done
			if (!tally_progress || tally_progress.progressComplete === true) return;


			// check for flags from server
			checkFlags();


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
				Dialogue.showStr("You can now use " + tally_progress.atackLimit + " attacks in battle!", "happy");
			}



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


	function checkFlags(){
		//if (DEBUG) console.log("🕹️ Progress.checkFlags() 🚩", tally_game_status.flags);
		// check game status for flags
		if (FS_Object.prop(tally_game_status) && tally_game_status.flags.length > 0) {
			for (let i = 0; i < tally_game_status.flags.length; i++) {
				if (DEBUG) console.log("🕹️ Progress.checkFlags() 🚩", tally_game_status.flags[i]);
				// address individual flags
				if (tally_game_status.flags[i] === "levelUp"){
					Stats.reset("tally"); // update stats, tell user
					Dialogue.showStr("You just leveled up!", "happy");
					tally_game_status.flags.splice(i, 1); // remove flag once handled
				}
			}
			// save after update
			store('tally_game_status',tally_game_status);
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
		checkFlags: checkFlags,
		reset: reset
	};
}());
