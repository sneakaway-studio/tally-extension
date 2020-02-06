"use strict";

/*  FLAG
 ******************************************************************************/

window.Flag = (function() {
	// PRIVATE

	let DEBUG = Debug.ALL.Flag;




	/**
	 *	If on dashboard page then check for specific flags
	 */
	function checkDashboard() {
		try {
			// only if user is on dashboard...
			if (pageData.url !== tally_meta.website + "/dashboard") return;

			if (DEBUG) console.log("🗒️ PageData.checkDashboardForFlags()", pageData.url, tally_meta.website + "/dashboard");
			// was a token found on the page?
			let tokenOnPage = false,
				tokenData = {};

			// if there is a token
			if ($("#token").length) {
				// for flag checking
				tokenOnPage = true;
				// grab the token data
				tokenData = {
					token: $("#token").val(),
					tokenExpires: $("#tokenExpires").val()
				};
				if (DEBUG) console.log("🗒️ PageData.checkDashboardForFlags() attempt to save token 🔑 tokenData = " + JSON.stringify(tokenData));
				// save token
				TallyStorage.saveToken(tokenData);
				// update progress
				Progress.update("tokenAdded", true);
			}



			// if there are flags
			if ($("#tallyFlags").length) {
				if (DEBUG) console.log("🗒️ PageData.checkDashboardForFlags() FLAGS! 🚩", $("#tallyFlags").html(), pageData.url, tally_meta.website);

				let flags = JSON.parse($("#tallyFlags").html().trim());

				for (let i = 0; i < flags.length; i++) {
					console.log("🚩 PageData.checkDashboardForFlags() FLAG = " + JSON.stringify(flags[i]));

					// if resetUser
					if (flags[i].name == "resetUser") {
						// tell user
						Dialogue.showStr("You have reset your account. One moment while the game resets...", "neutral");
						// reset game
						TallyStorage.resetUser(tokenOnPage, tokenData);
					}
				}

			}



		} catch (err) {
			console.error(err);
		}
	}

	// PUBLIC
	return {
		checkDashboard: function() {
			checkDashboard();
		}

	};
})();
