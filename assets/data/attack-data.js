"use strict";

var AttackData = (function() {

    let DEBUG = false;

    var data =
{"BaitAndSwitch":{"name":"BaitAndSwitch","type":"attack","category":"capitalism","staminaCost":"0.1","crtChance":"0.1","oppHealth":"0.2","oppAcc":"0.15"},"LootBox":{"name":"LootBox","type":"attack","category":"capitalism","staminaCost":"0.1","accuracy":"0.8","crtChance":"0.2","oppHealth":"0.15","oppAcc":"0.2"},"MicroTransaction":{"name":"MicroTransaction","type":"attack","category":"capitalism","staminaCost":"0.05","oppHealth":"0.1","oppDef":"0.1","oppAtk":"0.1","oppAcc":"0.1","oppEva":"0.1"},"ConfirmShaming":{"name":"ConfirmShaming","type":"attack","category":"capitalism","staminaCost":"0.15","crtChance":"0.1","oppHealth":"0.15","oppEva":"0.2"},"PayToWin":{"name":"PayToWin","type":"defense","category":"capitalism","staminaCost":"0.15","selfHealth":"1.1","selfAtk":"0.2"},"DarkPattern":{"name":"DarkPattern","type":"defense","category":"capitalism","staminaCost":"0.1","crtChance":"0.1","selfHealth":"1.1","selfAcc":"1.25","selfEva":"1.1"},"HiddenCosts":{"name":"HiddenCosts","type":"defense","category":"capitalism","staminaCost":"0.1","crtChance":"0.1","selfHealth":"1.05","selfAcc":"1.2","selfEva":"1.15"},"MegaByte":{"name":"MegaByte","type":"attack","category":"computer","animation-name":"attack-computer.gif","staminaCost":"0.2","accuracy":"0.6","crtChance":"0.1","oppHealth":"0.4","damageOTChance":"0.25","damageOverTime":"0.3","turns":"2"},"BitBolt":{"name":"BitBolt","type":"attack","category":"computer","animation-name":"attack-computer.gif","staminaCost":"0.1","accuracy":"0.9","crtChance":"0.1","oppHealth":"0.2"},"DriverUpdate":{"name":"DriverUpdate","type":"defense","category":"computer","animation-name":"defense-computer.gif","staminaCost":"0.1","accuracy":"1","selfHealth":"1.1","selfDef":"1.1","selfAcc":"1.2"},"Reboot":{"name":"Reboot","type":"defense","category":"computer","animation-name":"defense-computer.gif","staminaCost":"0.4","accuracy":"1","selfHealth":"1.5"},"CryptCracker":{"name":"CryptCracker","type":"attack","category":"cryptography","animation-name":"attack-cryptography-cryptcracker.gif","staminaCost":"0.1","accuracy":"0.85","crtChance":"0.1","oppHealth":"0.25"},"CryptoSlam":{"name":"CryptoSlam","type":"attack","category":"cryptography","staminaCost":"0.1","oppHealth":"0.1","oppAcc":"0.2"},"Triangulate":{"name":"Triangulate","type":"attack","category":"cryptography","animation-name":"attack-cryptography-triangulate.gif","staminaCost":"0.1","accuracy":"0.7","crtChance":"0.1","oppHealth":"0.2","oppEva":"0.25"},"AlgoRhythm":{"name":"AlgoRhythm","type":"defense","category":"cryptography","special":"qte","staminaCost":"0.3","accuracy":"1","crtChance":"0.1","selfHealth":"1.1"},"Overcompress":{"name":"Overcompress","type":"attack","category":"data","staminaCost":"0.15","accuracy":"0.8","crtChance":"0.1","oppHealth":"0.15"},"CorruptDrive":{"name":"CorruptDrive","type":"attack","category":"data","throw":"true","staminaCost":"0.1","accuracy":"1","crtChance":"0.1","oppHealth":"0.3","confuseChance":"0.75"},"DataCorruption":{"name":"DataCorruption","type":"attack","category":"data","throw":"true","staminaCost":"0.15","accuracy":"0.85","crtChance":"0.1","oppHealth":"0.15","oppDef":"0.3"},"CyberOptimize":{"name":"CyberOptimize","type":"defense","category":"network","staminaCost":"0.15","accuracy":"1","crtChance":"0.3","selfHealth":"1.2","selfAcc":"1.25","selfEva":"1.15"},"UserError":{"name":"UserError","type":"attack","category":"error","staminaCost":"0.25","accuracy":"1","crtChance":"0.2","oppHealth":"0.25"},"BannerOverload":{"name":"BannerOverload","type":"attack","category":"error","staminaCost":"0.25","accuracy":"0.75","crtChance":"0.1","oppHealth":"0.3"},"PacketLoss":{"name":"PacketLoss","type":"attack","category":"error","staminaCost":"0.1","accuracy":"1","crtChance":"0.1","oppHealth":"0.1","oppAtk":"0.25"},"BleedingEdge":{"name":"BleedingEdge","type":"attack","category":"error","staminaCost":"0.25","accuracy":"0.75","crtChance":"0.4","oppHealth":"0.2"},"BugFix":{"name":"BugFix","type":"defense","category":"security","staminaCost":"0.2","accuracy":"1","selfHealth":"1.3","selfDef":"1.2"},"RandomAccess":{"name":"RandomAccess","type":"attack","category":"memory","staminaCost":"0.2","accuracy":"0.9","crtChance":"0.1","oppHealth":"0.1","oppDef":"0.2"},"RAMHog":{"name":"RAMHog","type":"attack","category":"memory","staminaCost":"0.15","accuracy":"0.8","crtChance":"0.1","oppHealth":"0.25","oppEva":"0.3"},"MemoryFlare":{"name":"MemoryFlare","type":"attack","category":"memory","animation-name":"attack-memory-memoryflare.gif","staminaCost":"0.1","accuracy":"1","oppHealth":"0.3","oppAtk":"0.25"},"CacheErase":{"name":"CacheErase","type":"defense","category":"memory","staminaCost":"0.2","accuracy":"1","selfHealth":"1.2","selfEva":"1.25"},"TraceRoute":{"name":"TraceRoute","type":"attack","category":"network","staminaCost":"0.1","accuracy":"1","crtChance":"0.1","oppHealth":"0.2","oppAcc":"0.2","damageOTChance":"0.85","damageOverTime":"0.2","turns":"2"},"SlowConnection":{"name":"SlowConnection","type":"attack","category":"network","staminaCost":"0.1","accuracy":"0.75","crtChance":"0.1","oppHealth":"0.2","oppAcc":"0.3"},"OMGDDOS":{"name":"OMGDDOS","type":"attack","category":"network","staminaCost":"0.2","accuracy":"1","crtChance":"0.1","oppHealth":"0.2"},"DomainSwipe":{"name":"DomainSwipe","type":"defense","category":"network","staminaCost":"0.15","accuracy":"1","selfAcc":"1.2"},"EnableVPN":{"name":"EnableVPN","type":"defense","category":"network","special":"lock","staminaCost":"0.1","accuracy":"1","selfDef":"1.2","turns":"3"},"PacketShield":{"name":"PacketShield","type":"defense","category":"network","animation-name":"defense-network-packetshield.gif","staminaCost":"0.1","accuracy":"1","selfDef":"1.1","selfEva":"1.2","turns":"3"},"AttachTracker":{"name":"AttachTracker","type":"attack","category":"security","staminaCost":"0.1","accuracy":"0.8","crtChance":"0.1","oppHealth":"0.1","oppDef":"0.2","damageOTChance":"0.7","damageOverTime":"0.2","turns":"2"},"ViralInfection":{"name":"ViralInfection","type":"attack","category":"security","staminaCost":"0.15","accuracy":"1","crtChance":"0.1","oppHealth":"0.2","oppEva":"0.25","damageOTChance":"1","damageOverTime":"0.3","turns":"3"},"GoPhish":{"name":"GoPhish","type":"attack","category":"security","special":"qte","staminaCost":"0.25","accuracy":"1","crtChance":"0.1","oppHealth":"0.25"},"IdentityTheft":{"name":"IdentityTheft","type":"attack","category":"security","staminaCost":"0.2","accuracy":"0.8","crtChance":"0.1","oppHealth":"0.3","oppAcc":"0.2"},"SpamBush":{"name":"SpamBush","type":"attack","category":"security","staminaCost":"0.15","accuracy":"0.7","crtChance":"0.1","oppHealth":"0.2","oppEva":"0.25"},"Firewall":{"name":"Firewall","type":"defense","category":"security","animation-name":"defense-security-firewall.gif","staminaCost":"0.15","accuracy":"1","selfHealth":"1.1","selfDef":"1.2"},"DenyAccess":{"name":"DenyAccess","type":"defense","category":"security","staminaCost":"0.2","accuracy":"1","selfDef":"1.15"},"FilterBurn":{"name":"FilterBurn","type":"defense","category":"security","staminaCost":"0.25","accuracy":"1","selfEva":"1.2"},"TagCurse":{"name":"TagCurse","type":"attack","category":"social","staminaCost":"0.1","accuracy":"0.5","crtChance":"0.1","oppHealth":"0.1","oppDef":"0.25"},"EmailBlitz":{"name":"EmailBlitz","type":"attack","category":"social","animation-name":"attack-social-emailblitz.gif","staminaCost":"0.2","accuracy":"0.6","crtChance":"0.1","oppHealth":"0.3","damageOTChance":"0.25","damageOverTime":"0.1","turns":"2"},"ClickStrike":{"name":"ClickStrike","type":"attack","category":"social","animation-name":"attack-social-clickstrike.gif","staminaCost":"0.25","accuracy":"0.85","crtChance":"0.1","oppHealth":"0.15"},"PrivacyLeech":{"name":"PrivacyLeech","type":"attack","category":"social","staminaCost":"0.15","accuracy":"1","crtChance":"0.1","oppDef":"0.25"},"CrowdReach":{"name":"CrowdReach","type":"defense","category":"social","staminaCost":"0.2","accuracy":"1","selfAtk":"1.25","selfAcc":"1.1"},"Influence":{"name":"Influence","type":"defense","category":"social","staminaCost":"0.15","accuracy":"1","selfAcc":"1.3"},"AdBlock":{"name":"AdBlock","type":"defense","category":"social","staminaCost":"0.1","accuracy":"1","selfDef":"1.2","selfEva":"1.2"}}
;

    /**
     *  Return an attack of name or type or random
     */
	function returnAttack(name = "",type = "") {
		// if looking up specific one then get by key
		if (name !== "" && prop(data[name]))
			return data[name];
		else if (type !== ""){
            // get random
            let attack = FS_Object.randomObjProperty(data);
            if (DEBUG) console.log("💥 AttackData.returnAttack()", name, type, attack);
            // loop until type met
            while (attack.type !== type){
                if (DEBUG) console.log("💥 AttackData.returnAttack()", name, type, attack);
                // get new
                attack = FS_Object.randomObjProperty(data);
            }
            return attack;
		} else
            // else return random
			return FS_Object.randomObjProperty(data);
	}

	function returnRandomAttacks(count,types = []) {
		try {
            if (!count || count <= 0) return;
			if (DEBUG) console.log("💥 AttackData.returnRandomAttacks() --> count=" + count, types);
			let attack = {}, attacks = {};
            if (types.length === 0)
                types = ["attack","defense","attack"];
            // return i attacks
            for (let i = 0; i < count; i++) {
                attack = returnAttack(types[i]);
                attacks[attack.name] = attack;
            }
			if (DEBUG) console.log("💥 AttackData.returnRandomAttacks() --> count=" + count, types, attacks);
			return attacks;
		} catch (err) {
			console.error(err);
		}
	}

	return {
		data: data,
		returnAttack: function(name,type) {
			return returnAttack(name,type);
		},
		returnRandomAttacks: function(count,types) {
			return returnRandomAttacks(count,types);
		}
	};

})();
