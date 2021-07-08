"use strict";

/*  ACCOUNT
 ******************************************************************************/

window.Account = (function() {
	// PRIVATE

	let DEBUG = Debug.ALL.Account,
		dialogueLoginPromptsOnThisPage = 0,
		maxDialogueLoginPromptsPerPage = 3;



	/**
	 *	Return a prompt string to prompt login
	 */
	function returnDialogueLoginPrompt() {
		try {
			// array of potential login prompts
			let messages = [
				"Please <a href='" + T.tally_meta.env.website + "/dashboard' target='_blank'>visit your dashboard</a> to connect your account",
				"You can't stop the trackers unless you <a href='" + T.tally_meta.env.website + "/dashboard' target='_blank'>connect your account</a>",
				"<a href='" + T.tally_meta.env.website + "/dashboard' target='_blank'>Link your account</a> to start playing Tally"
			];
			return FS_Object.randomArrayIndex(messages);
		} catch (err) {
			console.error(err);
		}
	}

	/**
	 *	Check to see if Tally should say a login prompt (and play)
	 */
	function checkAndPlayDialogueLoginPrompt() {
		try {
			const log = "🔑 Account.checkAndPlayDialogueLoginPrompt()";
			if (DEBUG) console.log(log, "[1.0]",
				"T.tally_meta.install.loginPrompts.dialogue =", T.tally_meta.install.loginPrompts.dialogue,
				"dialogueLoginPromptsOnThisPage =", dialogueLoginPromptsOnThisPage
			);

			let didPrompt = false;

			// if !loggedIn, and we're sure server wasn't just temporarily offline...
			if (!Page.data.mode.loggedIn &&
				(T.tally_meta.userLoggedInFailedAttempts >= 5 || T.tally_meta.serverOnlineFailedAttempts >= 5)
			) {
				// only play a few times per page
				if (++dialogueLoginPromptsOnThisPage > maxDialogueLoginPromptsPerPage) return;
				// don't bother them every time
				if (T.tally_meta.install.loginPrompts.dialogue % 2 == 0) {
					setTimeout(function() {
						Dialogue.showStr(returnDialogueLoginPrompt(), "sad");
					}, 500);
				}
				// return true so calling functions know to stop execution of other game events
				didPrompt = true;
				// increment so we know how many times we've attempted
				T.tally_meta.install.loginPrompts.dialogue++;
				TallyStorage.saveData("tally_meta", T.tally_meta, log);
			}
			return didPrompt;

		} catch (err) {
			console.error(err);
		}
	}



	// PUBLIC
	return {
		returnDialogueLoginPrompt: returnDialogueLoginPrompt,
		checkAndPlayDialogueLoginPrompt: checkAndPlayDialogueLoginPrompt
	};
})();
