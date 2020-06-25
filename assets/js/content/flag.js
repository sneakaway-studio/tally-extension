"use strict";

/*  FLAG
 ******************************************************************************/

window.Flag = (function () {
	// PRIVATE

	let DEBUG = Debug.ALL.Flag;





		/**
		 *	Check for new login / dashboard activity
		 */
		async function checkForNewLogin(what = "all") {
			try {
				// allow offline
				if (Page.data.mode.notActive) return;
				// don't allow if mode disabled
				if (T.tally_options.gameMode === "disabled") return;

				// only if user is on dashboard...
				if (!Page.data.url.includes("/dashboard")) return;
				if (DEBUG) console.log("🚩 Flag.checkForNewLogin() *** DASHBOARD *** ", Page.data.url);

				// not sure if we need this anymore

			} catch (err) {
				console.error(err);
			}
		}




	/**
	 *	Check data reset on dashboard
	 */
	async function checkForDataReset(what = "all") {
		try {
			// allow offline
			if (Page.data.mode.notActive) return;
			// don't allow if mode disabled
			if (T.tally_options.gameMode === "disabled") return;

			// only if user is on dashboard...
			if (!Page.data.url.includes("dashboard")) return;
			if (DEBUG) console.log("🚩 Flag.checkForDataReset() *** DASHBOARD *** ", Page.data.url);



			if ($("#tallyFlags").length && $("#resetTallyUser").length) {
				// don't allow if serverOffline
				if (Page.data.mode.serverOffline) return;

				if (DEBUG) console.log("🚩 Flag.checkForDataReset() resetTallyUser FLAG FOUND");

				// tell user
				Dialogue.showStr("You have reset your account. One moment while the game resets...", "neutral");
				// reset game
				TallyStorage.resetTallyUser();
			}

		} catch (err) {
			console.error(err);
		}
	}







	/**
	 *	Check for flags from server
	 */
	function checkFromServer() {
		try {
			// are there flags?
			if (!FS_Object.prop(T.tally_user.flags) || FS_Object.isEmpty(T.tally_user.flags)) return;
			if (DEBUG) console.log("🧰 TallyMain.checkForServerFlags() 🚩", T.tally_user.flags);
			// address individual flags...

			// SERVER SAYS: we have leveled up!
			if (FS_Object.prop(T.tally_user.flags.levelUp)) {
				// make sure we have this flag in GameData
				if (!FS_Object.prop(GameData.flags.levelUp))
					return console.warn("Flag does not exist in GameData.");
				// // update stats
				// Stats.reset("tally");
				// tell user
				setTimeout(function () {
					Dialogue.showStr(GameData.flags.levelUp.dialogue, GameData.flags.levelUp.mood);
					// remove flag once handled
					remove("levelUp");
				}, 300);
			}
			// SERVER SAYS: we have received a new attack
			// might do this locally instead
			if (FS_Object.prop(T.tally_user.flags.newAttack)) {
				// remove flag once handled
			}

		} catch (err) {
			console.error(err);
		}
	}


	function removeFlag(name) {
		try {
			// confirm it exists
			if (FS_Object.prop(T.tally_user.flags[name])) {
				// get flag
				let flag = T.tally_user.flags[name];
				// mark as deleted
				flag.status = "delete";
				// remove it from T.tally_user
				delete T.tally_user.flags[name];
				// save in background
				TallyStorage.saveData("tally_user", T.tally_user, "🧰 TallyMain.removeFlag()");
				// save in background (and on server)
				TallyData.queue("itemData", "flags", flag, "🧰 TallyMain.removeFlag()");
			}

		} catch (err) {
			console.error(err);
		}
	}



	// PUBLIC
	return {
		checkForNewLogin: checkForNewLogin,
		checkForDataReset: checkForDataReset,
		checkFromServer: checkFromServer
	};
})();
