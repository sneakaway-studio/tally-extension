"use strict";

var AttackData = (function() {

    var attacks =
    {"CryptCracker":{"name":"CryptCracker","type":"attack","staminaCost":"10","crtChance":"0.1"},"BleedingEdge":{"name":"BleedingEdge","type":"attack","damage":"1.2","staminaCost":"25","crtChance":"0.4"},"MegaByte":{"name":"MegaByte","type":"attack","damage":"1.45","staminaCost":"20","crtChance":"0.1","damageOTChance":"0.25","damageOverTime":"0.3","turns":"2"},"DDOS":{"name":"DDOS","type":"attack","damage":"1","staminaCost":"20","accuracy":"0.5","crtChance":"0.1"},"BitBolt":{"name":"BitBolt","type":"attack","damage":"1.25","staminaCost":"10","crtChance":"0.1"},"Overcompress":{"name":"Overcompress","type":"attack","description":"Destroys some of the enemy’s stamina/mana","damage":"1.2","staminaCost":"15","crtChance":"0.1","animation":"make them smaller temporarily"},"AttachTracker":{"name":"AttachTracker","type":"attack","description":"Damage over time, increasing with how many trackers are placed on a enemy. Trackers fade after a certain number of turns.","staminaCost":"10","crtChance":"0.1","damageOTChance":"0.7","damageOverTime":"0.2","turns":"2","animation":"like a parasite"},"RandomAccess":{"name":"RandomAccess","type":"attack","description":"Uses an Random Move from the list","staminaCost":"20","crtChance":"0.1","animation":"slot machine to determine which attack"},"Embed":{"name":"Embed","type":"attack","crtChance":"0.1","damageOTChance":"0.85","damageOverTime":"0.2","turns":"2","heal":"0.1"},"CorruptDrive":{"name":"CorruptDrive","type":"attack","crtChance":"0.1","confuseChance":"0.75"},"DataCorruption":{"name":"DataCorruption","type":"attack","damage":"1.15","staminaCost":"15","crtChance":"0.1","oppDef":"0.85"},"BannerOverload":{"name":"BannerOverload","type":"attack","damage":"1.5","staminaCost":"25","crtChance":"0.1"},"ViralInfection":{"name":"ViralInfection","type":"attack","staminaCost":"15","crtChance":"0.1","damageOTChance":"1","damageOverTime":"0.3","turns":"3"},"PacketLoss":{"name":"PacketLoss","type":"attack","staminaCost":"10","crtChance":"0.1","oppAtk":"0.75"},"SlowConnection":{"name":"SlowConnection","type":"attack","damage":"1.3","staminaCost":"10","crtChance":"0.1","oppAcc":"0.85"},"GoPhish":{"name":"GoPhish","type":"attack","description":"Trigger QTE in player, if they fail, damage inversely proportional to how many times they lasted.","special":"qte","damage":"1.4","staminaCost":"25","crtChance":"0.1"},"RAMHog":{"name":"RAMHog","type":"attack","damage":"1.25","staminaCost":"15","crtChance":"0.1","oppEva":"0.85"},"PreRoll":{"name":"PreRoll","type":"attack","description":"Once activated, the character will only use pre-roll until it misses. Does more damage and has less accuracy each time it hits.","staminaCost":"10","crtChance":"0.1"},"Triangulate":{"name":"Triangulate","type":"attack","description":"Increases accuracy. If used three times in a row, attacks will never miss","staminaCost":"10","selfAcc":"1.3","crtChance":"0.1"},"EvilEmail":{"name":"EvilEmail","type":"attack","damage":"1.4","staminaCost":"20","crtChance":"0.1","damageOTChance":"0.25","damageOverTime":"0.1","turns":"2"},"AlgoRhythm":{"name":"AlgoRhythm","type":"attack","description":"Initiate QTE to increase how much damage you deal.","special":"qte","staminaCost":"30","crtChance":"0.1"},"TagStrike":{"name":"TagStrike","type":"attack","damage":"1.45","staminaCost":"25","crtChance":"0.1"},"SubliminalMessage":{"name":"SubliminalMessage","type":"attack","description":"Chance to hit, but neither player will know if it has for 2 turns, at which point the opponent’s defense will drop dramatically.","staminaCost":"15","crtChance":"0.1","oppDef":"0.5"},"IdentityTheft":{"name":"IdentityTheft","type":"attack","description":"Steals HP and stamina/mana from enemy","damage":"1.3","staminaCost":"20","crtChance":"0.1","heal":"1.15"},"SpamBash":{"name":"SpamBash","type":"attack"},"DriverUpdate":{"name":"DriverUpdate","type":"defense"},"Reboot":{"name":"Reboot","type":"defense","description":"High Mana cost, player 'shuts down' for 2 turns, after, they regain a large portion of health","staminaCost":"40"},"Firewall":{"name":"Firewall","type":"defense","description":"Chance to set the user on fire","staminaCost":"15","accuracy":"1","selfDef":"1.2","animation":"fire"},"CrowdReach":{"name":"CrowdReach","type":"defense","staminaCost":"20","selfAtk":"1.25","selfAcc":"1.1"},"Influence":{"name":"Influence","type":"defense","staminaCost":"15","selfAcc":"1.3"},"BugFix":{"name":"BugFix","type":"defense","staminaCost":"20","heal":"1.3"},"AccessDenied":{"name":"AccessDenied","type":"defense","description":"Slightly Increase DEF, Chance to Deny Enemy Turn","staminaCost":"20","selfDef":"1.15"},"DomainSwipe":{"name":"DomainSwipe","type":"defense","description":"Switch a random stat with the enemy","staminaCost":"15"},"SpamBlock":{"name":"SpamBlock","type":"defense","description":"Remove previously used enemy attack for 3 turns","staminaCost":"25"},"Automation":{"name":"Automation","type":"defense","staminaCost":"10","selfDef":"0.15","turns":"3"},"AdBlock":{"name":"AdBlock","type":"defense"},"UserError":{"name":"UserError","type":"attack","description":"Chance for High Damage, but Chance for Self-Damage and Confusion","staminaCost":"25"},"EnableVPN":{"name":"EnableVPN","type":"defense","description":"Stats are locked for 3 turns","special":"lock","staminaCost":"10","turns":"3"},"CacheErase":{"name":"CacheErase","type":"defense","selfEva":"1.25","heal":"1.2"},"CyberPower":{"name":"CyberPower","type":"attack","damage":"1.35","staminaCost":"15","crtChance":"0.3"}}
    ;

    function returnAttack(name=""){
        // if looking up specific one then get by key
        if (name != "" && attacks[name] )
            return attacks[name];
        // else return random
        else
            return FS_Object.randomObjProperty(attacks);
    }

    function returnMultipleAttacks(count){
        let attacks = [];
        if (count > 0){
            for (var i=0; i<count; i++){
                attacks.push(returnAttack());
            }
        }
        return attacks;
    }

     return {
         data:attacks,
         returnAttack: function(name){
             return returnAttack(name);
         },
         returnMultipleAttacks: function(count){
             return returnMultipleAttacks(count);
         }
     };

})();
