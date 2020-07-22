"use strict";

var AttackData = (function() {

    let DEBUG = Debug.ALL.AttackData;

    /**
     *  Return an attack of name or type or random
     */
	function returnAttack(name = "", type = "", monster = false) {
		try {
            if (DEBUG) console.log("💥 AttackData.returnAttack()", name, type);
    		// if looking up specific one then get by key
    		if (name !== "" && FS_Object.prop(Attacks.data[name]))
    			return Attacks.data[name];
    		else if (type !== ""){
                // get random
                let attack = FS_Object.randomObjProperty(Attacks.data);
                if (DEBUG) console.log("💥 AttackData.returnAttack()", name, type, attack);
                // loop until
                while (
                    // if monster and not special attack
                    (monster && attack.special !== "" && attack.type !== type) ||
                    // or type met
                    (!monster && attack.type !== type)){
                    if (DEBUG) console.log("💥 AttackData.returnAttack()", name, type, attack);
                    // get new
                    attack = FS_Object.randomObjProperty(Attacks.data);
                }
                return attack;
    		} else
                // else return random
    			return FS_Object.randomObjProperty(Attacks.data);
		} catch (err) {
			console.error(err);
		}
	}
    // called by monster only
	function returnRandomAttacks(count,types = []) {
		try {
            if (!count || count <= 0) return;
			if (DEBUG) console.log("💥 AttackData.returnRandomAttacks() --> count=" + count, types);
			let attack = {}, attacks = {};
            if (types.length === 0)
                types = ["attack","defense","attack","defense","attack","defense"];
            // return i attacks
            for (let i = 0; i < count; i++) {
                attack = returnAttack("",types[i],true);
                attacks[attack.name] = attack;
            }
			if (DEBUG) console.log("💥 AttackData.returnRandomAttacks() --> count=" + count, types, attacks);
			return attacks;
		} catch (err) {
			console.error(err);
		}
	}

	return {
		data: Attacks.data,
		returnAttack: function(name,type) {
			return returnAttack(name,type);
		},
		returnRandomAttacks: function(count,types) {
			return returnRandomAttacks(count,types);
		}
	};

})();
