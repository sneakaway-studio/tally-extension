"use strict";

/*  FLAG
 ******************************************************************************/

window.Flag = (function() {
	// PRIVATE

	let DEBUG = Debug.ALL.Flag;




	/**
	 *	If on dashboard page then check for specific flags
	 */
	async function check() {
		try {
			// allow offline
			if (Page.mode().notActive) return;
			// don't allow if mode disabled
			if (tally_options.gameMode === "disabled") return;

			// only if user is on dashboard...
			if (Page.data.url.includes("dashboard")) {
				if (DEBUG) console.log("🚩 Flag.check() *** DASHBOARD *** ", Page.data.url);

				let tokenData = {};

				// TOKEN FLAG
				if ($("#token").length) {
					// don't allow if serverOffline
					if (Page.mode().serverOffline) return;
					// if we already found one on this page
					if (Page.data.tokenFound) return console.log("🚩 Flag.check() 🔑 ALREADY CHECKED");
					// so we don't check again
					Page.data.tokenFound = true;

					// grab the token data
					tokenData = {
						token: $("#token").val().trim(),
						tokenExpires: $("#tokenExpires").val().trim()
					};
					if (DEBUG) console.log("🚩 Flag.check() 🔑 FOUND");
					// save token (also saves progress, restarts game)
					let newTokenFound = await TallyStorage.saveTokenFromDashboard(tokenData);
					// if we found a token stop main contentStartChecks()
					if (newTokenFound){
						if (DEBUG) console.log("🚩 Flag.check() 🔑 NEW");
						return true;
					} else {
						if (DEBUG) console.log("🚩 Flag.check() 🔑 SAME");
						return true;
					}
				}



 // save need to fix

				//
				// // OTHER FLAGS
				// if ($("#tallyFlags").length) {
				// 	if (DEBUG) console.log("🚩 Flag.check() FLAGS! 🚩🚩🚩", $("#tallyFlags").html().trim());
				//
				// 	let flags = JSON.parse($("#tallyFlags").html().trim());
				//
				// 	for (let i = 0; i < flags.length; i++) {
				// 		console.log("🚩 Flag.check() FLAG = " + JSON.stringify(flags[i]));
				//
				// 		// if resetUser
				// 		if (flags[i].name == "resetUser") {
				// 			// tell user
				// 			Dialogue.showStr("You have reset your account. One moment while the game resets...", "neutral");
				// 			// reset game
				// 			TallyStorage.resetUser(tokenOnPage, tokenData);
				// 		}
				// 	}
				// }
				//





			}
		} catch (err) {
			console.error(err);
		}
	}

	// PUBLIC
	return {
		check: check
	};
})();
