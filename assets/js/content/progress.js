"use strict";

window.Progress = (function() {

	let DEBUG = false;

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
				BattleAttack.rewardAttack();
				tally_progress.award1stAttack = true;
			}
			// AWARD ATTACK - 2nd
			if (!tally_progress.award2ndAttack && tally_user.score.score > 15) {
				BattleAttack.rewardAttack();
				tally_progress.award2ndAttack = true;
			}
			// AWARD ATTACK - 3rd
			if (!tally_progress.award3rdAttack && tally_progress.battle1stMonster) {
				BattleAttack.rewardAttack();
				tally_progress.award3rdAttack = true;
			}
			// AWARD ATTACK - 4th
			if (!tally_progress.award4thAttack && tally_user.score.score > 100) {
				BattleAttack.rewardAttack();
				tally_progress.award4thAttack = true;
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



	/**
	 *	Skip progress - when user has finished everything
	 */
	function skip() {
		try {

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
		skip: skip,
		reset: reset
	};
}());
