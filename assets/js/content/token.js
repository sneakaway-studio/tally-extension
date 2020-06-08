"use strict";

/*  TOKEN
 ******************************************************************************/

window.Token = (function() {
	// PRIVATE

	let DEBUG = Debug.ALL.Token;



	/**
	 *	Return a prompt string to update token
	 */
	function returnPrompt() {
		try {
			// an array of message prompts for new token
			let messages = [
				"Please <a href='" + T.tally_meta.website + "/dashboard' target='_blank'>visit your dashboard</a> to reconnect your account",
				"You can't stop the trackers unless you <a href='" + T.tally_meta.website + "/dashboard' target='_blank'>connect your account</a>",
				"<a href='" + T.tally_meta.website + "/dashboard' target='_blank'>Link your account</a> to start playing Tally"
			];
			return FS_Object.randomArrayIndex(messages);
		} catch (err) {
			console.error(err);
		}
	}


	/**
	 *	Make sure user's token is current
	 */
	function checkStatus() {
		try {
			if (DEBUG) console.log("🔑 Token.checkStatus() T.tally_meta = " + JSON.stringify(T.tally_meta));

			// if not on the dashboard
			if (Page.data.url !== T.tally_meta.website + "/dashboard") {

				// if token status not ok
				// - expired || error || !ok
				if (T.tally_meta.token.status != "ok") {
					// set Page.data.mode
					Page.data.mode = TallyMain.getPageMode();
				} else {
					if (DEBUG) console.log("🔑 Token.checkStatus() TOKEN OK ");
				}
			}
		} catch (err) {
			console.error(err);
		}
	}



	function promptHandler() {
		try {


			if (DEBUG) console.log("🔑 Token.checkStatus() TOKEN (STILL) BROKEN " +
				JSON.stringify(T.tally_meta),
				"T.tally_meta.token.prompts = " + T.tally_meta.token.prompts);

			// don't bother them every time
			if (T.tally_meta.token.prompts % 2 == 0) {
				setTimeout(function() {
					Dialogue.showStr(returnPrompt(), "sad");
				}, 500);
			}
			T.tally_meta.token.prompts++;
			TallyStorage.saveData("tally_meta", T.tally_meta, "🔑 Token.checkStatus()");
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
