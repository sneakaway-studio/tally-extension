"use strict";

window.Progress = (function() {

	let DEBUG = true;

	/**
	 *	Get value of an individual progress item
	 */
	function get(prop) {
		console.log("🕹️ Progress.get()", tally_user.progress);
		try {
			if (FS_Object.prop(tally_user.progress) &&
				FS_Object.prop(tally_user.progress[prop]) &&
				FS_Object.prop(tally_user.progress[prop].val))
				return tally_user.progress[prop].val;
			else
				return false;
		} catch (err) {
			console.error(err);
		}
	}


	/**
	 *	Checks to see if any progress events should be executed
	 */
	function check() {
		try {
			console.log("🕹️ Progress.check()", tally_user.progress);
			// return if not found
			if (!tally_user.progress) return;

			// "tokenAdded": false,
			// "tokenAddedMessage": false,
			// "attackLimit": 1,
			// "award1stAttack": false,
			// "award2ndAttack": false,
			// "award3rdAttack": false,
			// "award4thAttack": false,
			// "battle1stMonster": false,
			// "battle2ndMonster": false,
			// "battle3rdMonster": false,
			// "viewProfilePage": false,
			// "progressComplete": false

			// AWARD ATTACK - 1st
			if (!get("award1stAttack") && tally_user.score.score > 3) {
				BattleAttack.rewardAttack("", "attack");
				update("award1stAttack", true);
			}
			// AWARD ATTACK - 2nd
			if (!get("award2ndAttack") && tally_user.score.score > 15) {
				BattleAttack.rewardAttack("", "defense");
				update("award2ndAttack", true);
			}
			// AWARD ATTACK - 3rd
			if (!get("award3rdAttack") && get("battle1stMonster")) {
				BattleAttack.rewardAttack("", "attack");
				update("award3rdAttack", true);
			}
			// AWARD ATTACK - 4th
			if (!get("award4thAttack") && tally_user.score.score > 100) {
				BattleAttack.rewardAttack("", "defense");
				update("award4thAttack", true);
			}


			// if tally levels up her attack capacity increases
			if (get("attackLimit") < GameData.attackLimits[tally_user.level]) {
				update("attackLimit", GameData.attackLimits[tally_user.level]);
				Dialogue.showStr("You can now use " + get("attackLimit") + " attacks in battle!", "happy");
			}






		} catch (err) {
			console.error(err);
		}
	}





	/**
	 *	Update progress on server
	 */
	function update(name, val) {
		try {
			if (!prop(tally_user.progress[name]) || tally_user.progress[name] !== val) {
				TallyStorage.addToBackgroundUpdate("itemData", "progress", {
					"name": name,
					"val": val
				});
			}
		} catch (err) {
			console.error(err);
		}
	}


	// PUBLIC
	return {
		get: function(prop) {
			get(prop);
		},
		check: check,
		update: function(name, val) {
			update(name, val);
		},
	};
}());
