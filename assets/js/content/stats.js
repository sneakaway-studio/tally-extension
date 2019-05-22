"use strict";

/*  BATTLE STATS
 ******************************************************************************/

window.Stats = (function() {
	// PRIVATE



	function adjustLevel() {

	}



	function rechargeFromCookie(cookieObj) {

	}

	function rechargeSinceLastActive() {
		// console.log(moment(tally_user.lastActive).format());
		// console.log("now", moment().format());
		// console.log(FS_Date.moreThan("now", tally_user.lastActive, 10, "minutes"));
		// console.log(FS_Date.moreThanOneHourAgo(tally_user.lastActive));

		// if player hasn't been online for 1 hour then recharge
		if (FS_Date.moreThanOneHourAgo(tally_user.lastActive)) {
			// update stats

			// tell them

			// update last active
			tally_user.lastActive = moment().format();
			saveUser();
		}
	}




	// PUBLIC
	return {

		rechargeSinceLastActive: rechargeSinceLastActive,
		rechargeFromCookie: function(cookieObj) {
			rechargeFromCookie(cookieObj);
		}
	};
})();
