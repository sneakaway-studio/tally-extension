"use strict";

var AttackData = (function() {

    let DEBUG = false;

    var data =
{"MegaByte":{"name":"MegaByte","type":"attack","category":"computer","animation-name":"attack-computer.gif","staminaCost":"0.2","accuracy":"0.6","crtChance":"0.1","damage":"1.45","damageOTChance":"0.25","damageOverTime":"0.3","turns":"2"},"BitBolt":{"name":"BitBolt","type":"attack","category":"computer","animation-name":"attack-computer.gif","staminaCost":"0.1","accuracy":"0.9","crtChance":"0.1","damage":"1.25"},"DriverUpdate":{"name":"DriverUpdate","type":"defense","category":"computer","animation-name":"defense-computer.gif","staminaCost":"0.1","selfDef":"1.1","selfAcc":"1.2"},"Reboot":{"name":"Reboot","type":"defense","category":"computer","animation-name":"defense-computer.gif","description":"High Mana cost, player 'shuts down' for 2 turns, after, they regain a large portion of health","staminaCost":"0.4","heal":"1.1"},"CryptCracker":{"name":"CryptCracker","type":"attack","category":"cryptography","staminaCost":"0.1","accuracy":"0.85","crtChance":"0.1"},"Triangulate":{"name":"Triangulate","type":"attack","category":"cryptography","animation-name":"attack-cryptography-triangulate.gif","description":"Increases accuracy. If used three times in a row, attacks will never miss","staminaCost":"0.1","accuracy":"0.7","selfAcc":"1.3","crtChance":"0.1"},"AlgoRhythm":{"name":"AlgoRhythm","type":"attack","category":"cryptography","description":"Initiate QTE to increase how much damage you deal.","special":"qte","staminaCost":"0.3","accuracy":"1","crtChance":"0.1"},"Overcompress":{"name":"Overcompress","type":"attack","category":"data","animation ideas":"make them smaller temporarily","description":"Destroys some of the enemy’s stamina/mana","staminaCost":"0.15","accuracy":"0.8","crtChance":"0.1","damage":"1.2"},"Embed":{"name":"Embed","type":"attack","category":"data","staminaCost":"0.1","crtChance":"0.1","damage":"1.3","damageOTChance":"0.85","damageOverTime":"0.2","turns":"2","heal":"1.07"},"CorruptDrive":{"name":"CorruptDrive","type":"attack","category":"data","throwing-attack":"TRUE","staminaCost":"0.1","crtChance":"0.1","damage":"1.3","confuseChance":"0.75"},"DataCorruption":{"name":"DataCorruption","type":"attack","category":"data","throwing-attack":"TRUE","staminaCost":"0.15","accuracy":"0.85","crtChance":"0.1","damage":"1.15","oppDef":"0.85"},"UserError":{"name":"UserError","type":"attack","category":"error","description":"Chance for High Damage, but Chance for Self-Damage and Confusion","staminaCost":"0.25","crtChance":"0.2","damage":"1.25"},"BannerOverload":{"name":"BannerOverload","type":"attack","category":"error","staminaCost":"0.25","accuracy":"0.75","crtChance":"0.1","damage":"1.5"},"PacketLoss":{"name":"PacketLoss","type":"attack","category":"error","staminaCost":"0.1","crtChance":"0.1","oppAtk":"0.75"},"BleedingEdge":{"name":"BleedingEdge","type":"attack","category":"error","staminaCost":"0.25","accuracy":"0.75","crtChance":"0.4","damage":"1.2"},"RandomAccess":{"name":"RandomAccess","type":"attack","category":"memory","animation ideas":"slot machine to determine which attack","description":"Uses an Random Move from the list","staminaCost":"0.2","accuracy":"0.9","crtChance":"0.1"},"RAMHog":{"name":"RAMHog","type":"attack","category":"memory","staminaCost":"0.15","accuracy":"0.8","crtChance":"0.1","damage":"1.25","oppEva":"0.85"},"CacheErase":{"name":"CacheErase","type":"defense","category":"memory","staminaCost":"0.2","selfEva":"1.25","heal":"1.2"},"MemoryFlare":{"name":"MemoryFlare","type":"attack","category":"memory","staminaCost":"0.1","damage":"1.3","oppAtk":"0.75"},"SlowConnection":{"name":"SlowConnection","type":"attack","category":"network","staminaCost":"0.1","accuracy":"0.75","crtChance":"0.1","damage":"1.3","oppAcc":"0.85"},"DomainSwipe":{"name":"DomainSwipe","type":"defense","category":"network","description":"Switch a random stat with the enemy","staminaCost":"0.15","selfAcc":"1.2"},"EnableVPN":{"name":"EnableVPN","type":"defense","category":"network","description":"Stats are locked for 3 turns","special":"lock","staminaCost":"0.1","selfDef":"1.2","turns":"3"},"CyberOptimize":{"name":"CyberOptimize","type":"attack","category":"network","staminaCost":"0.15","crtChance":"0.3","damage":"1.35"},"PacketShield":{"name":"PacketShield","type":"defense","category":"network","staminaCost":"0.1","selfDef":"1.1","turns":"3"},"OMGDDOS":{"name":"OMGDDOS","type":"attack","category":"network","staminaCost":"0.2","accuracy":"1","crtChance":"0.1","damage":"1"},"AttachTracker":{"name":"AttachTracker","type":"attack","category":"security","animation ideas":"like a parasite","description":"Damage over time, increasing with how many trackers are placed on a enemy. Trackers fade after a certain number of turns.","staminaCost":"0.1","accuracy":"0.8","crtChance":"0.1","damageOTChance":"0.7","damageOverTime":"0.2","turns":"2"},"ViralInfection":{"name":"ViralInfection","type":"attack","category":"security","staminaCost":"0.15","crtChance":"0.1","damageOTChance":"1","damageOverTime":"0.3","turns":"3"},"GoPhish":{"name":"GoPhish","type":"attack","category":"security","description":"Trigger QTE in opponent, if they fail, damage inversely proportional to how many times they lasted.","special":"qte","staminaCost":"0.25","accuracy":"1","crtChance":"0.1","damage":"1.4"},"IdentityTheft":{"name":"IdentityTheft","type":"attack","category":"security","description":"Steals HP and stamina/mana from enemy","staminaCost":"0.2","accuracy":"0.8","crtChance":"0.1","damage":"1.3","heal":"1.15"},"SpamBush":{"name":"SpamBush","type":"attack","category":"security","staminaCost":"0.15","accuracy":"0.7","crtChance":"0.1","damage":"1.3","oppEva":"0.7"},"Firewall":{"name":"Firewall","type":"defense","category":"security","animation ideas":"fire","description":"Chance to set the user on fire","staminaCost":"0.15","accuracy":"1","selfDef":"1.2"},"BugFix":{"name":"BugFix","type":"defense","category":"security","staminaCost":"0.2","selfDef":"1.2","heal":"1.3"},"DenyAccess":{"name":"DenyAccess","type":"defense","category":"security","description":"Slightly Increase DEF, Chance to Deny Enemy Turn","staminaCost":"0.2","selfDef":"1.15"},"FilterBurn":{"name":"FilterBurn","type":"defense","category":"security","description":"Remove previously used enemy attack for 3 turns","staminaCost":"0.25","selfEva":"1.2"},"TagCurse":{"name":"TagCurse","type":"attack","category":"social","description":"Once activated, the character will only use pre-roll until it misses.","staminaCost":"0.1","accuracy":"0.5","crtChance":"0.1"},"EmailBlitz":{"name":"EmailBlitz","type":"attack","category":"social","staminaCost":"0.2","accuracy":"0.6","crtChance":"0.1","damage":"1.4","damageOTChance":"0.25","damageOverTime":"0.1","turns":"2"},"ClickStrike":{"name":"ClickStrike","type":"attack","category":"social","animation-name":"attack-social-clickstrike.gif","staminaCost":"0.25","accuracy":"0.85","crtChance":"0.1","damage":"1.45"},"SubliminalMessage":{"name":"SubliminalMessage","type":"attack","category":"social","description":"Chance to hit, but neither player will know if it has for 2 turns, at which point the opponent’s defense will drop dramatically.","staminaCost":"0.15","crtChance":"0.1","oppDef":"0.5"},"CrowdReach":{"name":"CrowdReach","type":"defense","category":"social","staminaCost":"0.2","selfAtk":"1.25","selfAcc":"1.1"},"Influence":{"name":"Influence","type":"defense","category":"social","staminaCost":"0.15","selfAcc":"1.3"},"AdBlock":{"name":"AdBlock","type":"defense","category":"social","staminaCost":"0.1","selfDef":"1.2","selfEva":"1.2"}}
;

	function returnAttack(name = "") {
		// if looking up specific one then get by key
		if (name != "" && prop(data[name]))
			return data[name];
		// else return random
		else
			return FS_Object.randomObjProperty(data);
	}

	function returnRandomAttacks(count) {
		try {
            if (!count || count <= 0) return;
			if (DEBUG) console.log("💥 AttackData.returnRandomAttacks() --> count=" + count);
			let attack = {}, attacks = {};
            // return i atttacks
            for (let i = 0; i < count; i++) {
                attack = FS_Object.randomObjProperty(data);
                attacks[attack.name] = attack;
            }
			//if (DEBUG) console.log("💥 BattleAttack.returnRandomAttacks() --> count=" + count, attacks);
			return attacks;
		} catch (err) {
			console.error(err);
		}
	}

	return {
		data: data,
		returnAttack: function(name) {
			return returnAttack(name);
		},
		returnRandomAttacks: function(count) {
			return returnRandomAttacks(count);
		}
	};

})();
