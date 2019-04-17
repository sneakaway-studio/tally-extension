"use strict";

/*  BATTLE
 ******************************************************************************/

window.BattleAttack = (function() {
	// PRIVATE



	function returnRandomAttacks(count = 1) {
		let obj = {};
		if (count > 1)
			for (let i = 0; i < count; i++) {
				let attack = randomObjProperty(AttackData.data);
				obj[attack.name] = attack;
			}
		return obj;
	}





	// PUBLIC
	return {
		returnRandomAttacks: function(count) {
			returnRandomAttacks(count);
		}
	};
})();
