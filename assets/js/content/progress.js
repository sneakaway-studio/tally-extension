"use strict";

window.Progress = (function() {
	// PRIVATE
	let DEBUG = Debug.ALL.Progress;

	let defaults = {
		"tokenAdded": false,
		"tokenAddedPlayWelcomeMessage": false,
		"attackLimit": 1,
		"award1stAttack": false,
		"award2ndAttack": false,
		"award3rdAttack": false,
		"award4thAttack": false,
		"battle1stMonster": false,
		"battle2ndMonster": false,
		"battle3rdMonster": false,
		"viewProfilePage": false,
		"progressComplete": false
	};


	/**
	 *	Get value of an individual progress item
	 */
	function get(name) {
		try {
			// if value exists in tally_user && is true | >0 | !""
			if (FS_Object.prop(tally_user.progress) &&
				FS_Object.prop(tally_user.progress[name]) &&
				FS_Object.prop(tally_user.progress[name].val)) {

				console.log("🕹️ Progress.get()", tally_user.progress[name]);
				return tally_user.progress[name].val;
			} else {
				console.log("🕹️ Progress.get() NOT FOUND");
				return false;
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
			console.log("🕹️ Progress.update()", name, val);

			// create progress object
			let obj = {
				"name": name,
				"val": val
			};
			// save in background and on server
			TallyStorage.saveTallyUser("progress", obj, "🕹️ Progress.update()");
			TallyStorage.addToBackgroundUpdate("itemData", "progress", obj, "🕹️ Progress.update()");
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



	// PUBLIC
	return {
		get: function(prop) {
			return get(prop);
		},
		update: function(name, val) {
			update(name, val);
		},
		check: check,
	};
}());
