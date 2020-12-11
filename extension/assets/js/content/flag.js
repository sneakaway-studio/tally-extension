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
			// if (T.tally_meta.userLoggedIn) return;

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
			// are there serverFlags?
			if (!FS_Object.prop(T.tally_user.serverFlags) || FS_Object.isEmpty(T.tally_user.serverFlags)) return;
			if (DEBUG) console.log("🚩 Flag.checkFromServer()", T.tally_user.serverFlags);
			// address individual serverFlags...

			// do we show notifications?
			if (!T.tally_options.showNotifications) return;

			// SERVER SAYS: we have leveled up!
			if (FS_Object.prop(T.tally_user.serverFlags.levelUp)) {
				// make sure we have this flag in GameData
				if (!FS_Object.prop(GameData.serverFlags.levelUp))
					return console.warn("Flag does not exist in GameData.");
				// // update stats
				// Stats.reset("tally");
				// tell user
				setTimeout(function () {
					// Dialogue.showStr(GameData.serverFlags.levelUp.dialogue, GameData.serverFlags.levelUp.mood);
					Dialogue.showData(Dialogue.getData({
						category: "level",
						subcategory: "up"
					}), {
						addIfInProcess: true,
						instant: false
					});
					// remove flag once handled
					delete T.tally_user.serverFlags.levelUp;
				}, 300);
			}





			// SERVER SAYS: new version notification
			if (FS_Object.prop(T.tally_user.serverFlags.versionNotification)) {
				// if current version isn't the same or higher
				let versionCompare = FS_Number.compareVersionStrings(T.tally_meta.install.version,
					T.tally_user.serverFlags.versionNotification.latestVersion);
				if (DEBUG) console.log("🚩 Flag.checkFromServer()", "compareVersionStrings()", versionCompare);
				if (versionCompare < 0) {
					let r = Math.random();
					// tell user every third page
					if (r > 0.66) {
						setTimeout(function () {
							Dialogue.showStr(T.tally_user.serverFlags.versionNotification.message, "excited");
						}, 2000);
						setTimeout(function () {
							Dialogue.showStr("Your extension (" + T.tally_meta.install.version + ") is " +
								(0 - versionCompare) + " behind the latest. <a href='" + T.tally_meta.env.website +
								"/get-tally'>Please update soon</a>.", "excited");
						}, 2100);
					}
				}
			}

			// SERVER SAYS: special alert
			if (FS_Object.prop(T.tally_user.serverFlags.alert)) {
				if (DEBUG) console.log("🚩 Flag.checkFromServer()", "alert()", alert);

				let r = Math.random(),
					chance = T.tally_user.serverFlags.alert.chance;
				// tell user every third page
				if (r > chance) {
					setTimeout(function () {
						Dialogue.showStr(T.tally_user.serverFlags.alert.message, "excited");
					}, 2000);
				}
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
