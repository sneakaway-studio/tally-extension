"use strict";

/*  EVENTS
 ******************************************************************************/

window.TallyEvents = (function() {


	// PRIVATE

	let timedEvents = {};

	/**
	 * Timed functions
	 */
	function startTimeEvents() {
		try {
			timedEvents = {
				// track time on current page
				pageTimerInterval: setInterval(function() {
					// if this page is visible
					if (document.hasFocus()) {
						pageData.time = pageData.time + 0.5;
						Debug.update();
					}
				}, 500),

				// check if user is online
				// userOnlineInt: setInterval(function() {
				// }, 5 * 1000),

				// NOW HANDLED IN BACKGROUND...
				// check if server online
				// serverOnlineInt: setInterval(function() {
				// 	checkAPIServerStatus();
				// }, 500 * 1000)

			};
		} catch (err) {
			console.error(err);
		}
	}

	/**
	 *	Checks for the last time user was active
	 */
	function checkLastActive() {
		try {
			console.log("🕗 TallyEvents.checkLastActive()", "00:00:00",
				FS_String.pad(FS_Date.diffHours("now", tally_user.lastActive), 2) + ":" +
				FS_String.pad(FS_Date.diffMinutes("now", tally_user.lastActive), 2) + ":" +
				FS_String.pad(FS_Date.diffSeconds("now", tally_user.lastActive), 2)
			);
			// if player hasn't been online for n minutes then recharge
			if (FS_Date.diffMinutes("now", tally_user.lastActive) > 1) { // 0=testing
				setTimeout(function() {
					// reset tally stats
					Stats.reset("tally");
					// play sound
					Sound.playRandomJump();
					// tell them
					Thought.showString("You took a break from the internet to recharge!", "happy");
				}, 700);
			}
			// update last active
			tally_user.lastActive = moment().format();
			TallyStorage.saveData('tally_user', tally_user, "TallyEvents.checkLastActive()");
			console.log("🕗 TallyEvents.checkLastActive()", tally_user.lastActive);
		} catch (err) {
			console.error(err);
		}
	}

	/**
	 *	Checks to see if any tutorial events should be executed
	 */
	function checkTutorialEvents() {
		try {
			console.log("🕗 TallyEvents.checkTutorialEvents()", tally_tutorial_history);
			// return if done
			if (!tally_tutorial_history || tally_tutorial_history.tutorialComplete === true) return;


			/**
			 *	awardFirstAttack ??
			 */
			if (!tally_tutorial_history.awardFirstAttack && tally_user.score.score > 15 &&
				FS_Object.isEmpty(tally_user.attacks)
			) {
				// get random attack
				let attack = AttackData.returnRandomAttacks(1);
				console.log("🕗 TallyEvents.checkTutorialEvents() --> awardFirstAttack", attack);
				// store and save
				tally_user.attacks[attack.name] = attack;
				TallyStorage.saveData('tally_user',tally_user);
				// tell them
				Thought.showString("You earned a " + attack.name + " " + attack.type + "!", "happy");
				// set true
				tally_tutorial_history.awardFirstAttack = true;
			} else {
				// check to see if all have been completed
				for (var t in tally_tutorial_history) {
					if (tally_tutorial_history.hasOwnProperty(t)) {
						// mark them if so
						if (tally_tutorial_history[t] === true)
							tally_tutorial_history.tutorialComplete = true;
					}
				}
			}
			// save after updates
			TallyStorage.saveData('tally_tutorial_history', tally_tutorial_history);
		} catch (err) {
			console.error(err);
		}
	}

	/**
	 *	Reset tutorial
	 */
	function resetTutorial() {
		try {
			for (var t in tally_tutorial_history) {
				if (tally_tutorial_history.hasOwnProperty(t)) {
					tally_tutorial_history[t] = false;
				}
			}
			// save
			TallyStorage.saveData('tally_tutorial_history', tally_tutorial_history);
		} catch (err) {
			console.error(err);
		}
	}


	// PUBLIC
	return {
		startTimeEvents: startTimeEvents,
		checkLastActive: checkLastActive,
		checkTutorialEvents: checkTutorialEvents
	};
})();
