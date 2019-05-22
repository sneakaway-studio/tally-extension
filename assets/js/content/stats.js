"use strict";

/*  BATTLE STATS
 ******************************************************************************/

window.Stats = (function() {
	// PRIVATE



	



	function rechargeFromCookie(cookieObj){

	}

	function rechargeSinceLastActive(){
		// if player hasn't been online for 1 hour then recharge
		// if (){
		//
		// }
		// update last active
		tally_user.lastActive = returnDateISO();
		store("tally_user", tally_user);

		console.log(tally_user);

	}




	// PUBLIC
	return {

		rechargeSinceLastActive: rechargeSinceLastActive,
		rechargeFromCookie: function(cookieObj){
			rechargeFromCookie(cookieObj);
		}
	};
})();
