"use strict";

/*  FLAG
 ******************************************************************************/

window.Flag = (function() {
	// PRIVATE

	let DEBUG = Debug.ALL.Flag;




	/**
	 *	If on dashboard page then check for specific flags
	 */
	function check() {
		try {
			// only if user is on dashboard...
			if (Page.data.url.includes("dashboard")) {
				if (DEBUG) console.log("🚩 Flag.check() *** DASHBOARD *** ", Page.data.url);

				// is a token on the page?
				let tokenOnPage = false,
					tokenData = {};


				// TOKEN FLAG
				if ($("#token").length) {
					if (Page.data.tokenFound) return console.log("🚩 Flag.check() 🔑 ALREADY CHECKED");
					// so we don't check again
					Page.data.tokenFound = true;
					// for flag checking
					tokenOnPage = true;
					// grab the token data
					tokenData = {
						token: $("#token").val().trim(),
						tokenExpires: $("#tokenExpires").val().trim()
					};
					if (DEBUG) console.log("🚩 Flag.check() 🔑 FOUND");
					// save token (also saves progress, restarts game)
					TallyStorage.saveTokenFromDashboard(tokenData);
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
