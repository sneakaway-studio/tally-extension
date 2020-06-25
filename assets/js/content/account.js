"use strict";

/*  ACCOUNT
 ******************************************************************************/

window.Account = (function() {
	// PRIVATE

	let DEBUG = Debug.ALL.Account;



	/**
	 *	Return a prompt string to prompt login
	 */
	function returnPrompt() {
		try {
			// an array of message prompts
			let messages = [
				"Please <a href='" + T.tally_meta.website + "/dashboard' target='_blank'>visit your dashboard</a> to connect your account",
				"You can't stop the trackers unless you <a href='" + T.tally_meta.website + "/dashboard' target='_blank'>connect your account</a>",
				"<a href='" + T.tally_meta.website + "/dashboard' target='_blank'>Link your account</a> to start playing Tally"
			];
			return FS_Object.randomArrayIndex(messages);
		} catch (err) {
			console.error(err);
		}
	}


	/**
	 *	Make sure user's account is current
	 */
	function checkStatus() {
		try {
			if (DEBUG) console.log("🔑 Account.checkStatus() T.tally_meta = " + JSON.stringify(T.tally_meta));

			// if not on the dashboard
			if (Page.data.url !== T.tally_meta.website + "/dashboard") {

				// if not logged in
				if (T.tally_meta.userLoggedIn) {
					// set Page.data.mode
					Page.data.mode = TallyMain.getPageMode();
				} else {
					if (DEBUG) console.log("🔑 Account.checkStatus() ACCOUNT OK ");
				}
			}
		} catch (err) {
			console.error(err);
		}
	}



	function promptHandler() {
		try {


			if (DEBUG) console.log("🔑 Account.checkStatus() ACCOUNT (STILL) BROKEN " +
				JSON.stringify(T.tally_meta),
				"T.tally_meta.install.prompts = " + T.tally_meta.install.prompts);

			// don't bother them every time
			if (T.tally_meta.install.prompts % 2 == 0) {
				setTimeout(function() {
					Dialogue.showStr(returnPrompt(), "sad");
				}, 500);
			}
			T.tally_meta.install.prompts++;
			TallyStorage.saveData("tally_meta", T.tally_meta, "🔑 Account.checkStatus()");
		} catch (err) {
			console.error(err);
		}
	}




	// PUBLIC
	return {
		returnPrompt: returnPrompt,
		checkStatus: checkStatus
	};
})();
