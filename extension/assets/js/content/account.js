"use strict";

/*  ACCOUNT
 ******************************************************************************/

window.Account = (function () {
	// PRIVATE

	let DEBUG = Debug.ALL.Account,
		tallyLoginPrompts = 0;



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
	 *	Tally says a login prompt
	 */
	function playLoginPrompt() {
		try {
			console.log("tallyLoginPrompts", tallyLoginPrompts);

			// check if they have already logged in and Tally should update
			if (Page.data.actions.onTallyWebsite)
				if ($(".tallyFlags").length > 0 && $("#userLoggedin").length > 0)
					Tutorial.play("tutorial","onboardingFirstLogin1");

			// only play a few times per load
			if (++tallyLoginPrompts > 5) return;
			Dialogue.showStr(returnPrompt(), "sad");

		} catch (err) {
			console.error(err);
		}
	}









	/**
	 *	Tally says a login prompt
	 */
	function promptHandler() {
		try {


			if (DEBUG) console.log("🔑 Account.promptHandler() ACCOUNT (STILL) BROKEN " +
				JSON.stringify(T.tally_meta),
				"T.tally_meta.install.prompts = " + T.tally_meta.install.prompts);

			// don't bother them every time
			if (T.tally_meta.install.prompts % 2 == 0) {
				setTimeout(function () {
					Dialogue.showStr(returnPrompt(), "sad");
				}, 500);
			}
			T.tally_meta.install.prompts++;
			TallyStorage.saveData("tally_meta", T.tally_meta, "🔑 Account.promptHandler()");
		} catch (err) {
			console.error(err);
		}
	}




	// PUBLIC
	return {
		returnPrompt: returnPrompt,
		playLoginPrompt: playLoginPrompt
	};
})();
