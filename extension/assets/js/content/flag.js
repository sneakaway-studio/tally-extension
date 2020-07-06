"use strict";

/*  FLAG
 ******************************************************************************/

window.Flag = (function () {
	// PRIVATE

	let DEBUG = Debug.ALL.Flag;





	/**
	 *	Check for new login / dashboard activity - to start (or continue) syncing to server
	 */
	async function checkForDashboardLogin() {
		try {
			// always allow unless mode disabled
			if (T.tally_options.gameMode === "disabled") return;

			// if they are already loggedin then return
			if (T.tally_meta.userLoggedIn) return;

			// only continue if user is on dashboard
			if (!Page.data.actions.onDashboard) return;

			console.log("🚩 Flag.checkForDashboardLogin() -> ON DASHBOARD");

			// update tally_meta in content and background - !IMPORTANT OR BACKGROUND WON'T CONTACT SERVER
			T.tally_meta.userLoggedIn = true;
			TallyStorage.saveData("tally_meta", T.tally_meta);

			// user just connected their account
			if (!Page.data.actions.checkForDashboardLoginCalled) {
				// so return true to interrupt startup flow
				Page.data.actions.checkForDashboardLoginCalled = true;
				return true;
			}
			// extension just reloaded data so let Progress show game events
			else Progress.dashboardLogin();

		} catch (err) {
			console.error(err);
		}
	}


	/**
	 *	Check for data reset on dashboard
	 */
	async function checkForAccountReset(what = "all") {
		try {
			// only allow if serverOnline
			if (!Page.data.mode.serverOnline) return;
			// don't allow if mode disabled
			if (T.tally_options.gameMode === "disabled") return;

			// only proceed if user is on dashboard and account reset flag elements exist
			if (!Page.data.actions.onDashboard || $(".tallyFlags").length < 1 && $("#resetUserAccountSuccess").length < 1) return;
			if (DEBUG) console.log("🚩 Flag.checkForAccountReset() resetUserAccountSuccess FLAG FOUND");

			// user just reset their account data
			if (!Page.data.actions.checkForAccountResetCalled) {
				// so return true to interrupt startup flow
				Page.data.actions.checkForAccountResetCalled = true;
				return true;
			}
			// extension just reloaded data so let Progress show game events
			else Progress.resetUserAccount();

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
		checkForDashboardLogin: checkForDashboardLogin,
		checkForAccountReset: checkForAccountReset,
		checkFromServer: checkFromServer
	};
})();
