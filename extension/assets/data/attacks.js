"use strict";

var Attacks = (function() { 

var data = 
{"BaitAndSwitch":{"ref":"a","name":"BaitAndSwitch","type":"attack","color":"#22d47b","category":"economy","animation-name":"economy-baitandswitch.gif","special":"opp-loses-1-turn","description":"Steal a turn from your opponent","artist":"Rebecca Cobo","staminaCost":0.1,"accuracy":1,"crtChance":0.1,"oppHealth":0.2,"oppAcc":0.15},"MicroTransaction":{"ref":"a","name":"MicroTransaction","type":"attack","color":"#22d47b","category":"economy","animation-name":"economy-microtransaction.gif","sound":"economy-microtransaction.wav","description":"Nickle and dime the opponent","artist":"Rebecca Cobo","staminaCost":0.05,"accuracy":1,"oppHealth":0.15,"oppDef":0.1,"oppAtk":0.1,"oppAcc":0.1,"oppEva":0.1},"ConfirmShaming":{"ref":"a","name":"ConfirmShaming","type":"attack","color":"#22d47b","category":"economy","animation-name":"economy-confirmshaming.gif","description":"Shame the monster into compliance","blurb":"https://www.darkpatterns.org/types-of-dark-pattern","artist":"Rebecca Cobo","staminaCost":0.12,"accuracy":1,"crtChance":0.1,"oppHealth":0.15,"oppEva":0.2},"PayToWin":{"ref":"a","name":"PayToWin","type":"defense","color":"#22d47b","category":"economy","animation-name":"economy-paytowin.gif","description":"Not all games have to be this way","artist":"Rebecca Cobo","staminaCost":0.15,"accuracy":1,"selfHealth":1.1,"selfAtk":0.2},"HiddenCosts":{"ref":"a","name":"HiddenCosts","type":"defense","color":"#22d47b","category":"economy","animation-name":"economy-hiddencosts.gif","sound":"economy-hiddencosts.wav","special":"opp-loses-2-turns","description":"Always beware fine print","artist":"Rebecca Cobo","staminaCost":0.1,"accuracy":1,"crtChance":0.1,"selfHealth":1.05,"selfAcc":1.2,"selfEva":1.15},"MegaByte":{"ref":"a","name":"MegaByte","type":"attack","color":"#2640ab","category":"computer","animation-name":"computer-megabyte.gif","sound":"computer-megabyte.wav","description":"256 levels of chomp","artist":"Rebecca Cobo","staminaCost":0.2,"accuracy":1,"crtChance":0.1,"oppHealth":0.4},"BitBolt":{"ref":"a","name":"BitBolt","type":"attack","color":"#2640ab","category":"computer","animation-name":"computer-bitbolt.gif","sound":"computer-megabyte.wav","description":"Beware the power of 2","artist":"Rebecca Cobo","staminaCost":0.1,"accuracy":0.9,"crtChance":0.1,"oppHealth":0.2},"LowBattery":{"ref":"a","name":"LowBattery","type":"attack","color":"#2640ab","category":"computer","animation-name":"computer-lowbattery.gif","sound":"computer-lowbattery.wav","special":"opp-loses-2-turns","description":"Steal two turns from your opponent!","artist":"Richard Farrell","staminaCost":0.1,"accuracy":1,"oppHealth":0.1,"oppDef":0.1,"oppAcc":0.1},"DriverUpdate":{"ref":"a","name":"DriverUpdate","type":"defense","color":"#2640ab","category":"computer","animation-name":"computer-driverupdate.gif","sound":"computer-driverupdate.wav","description":"We can patch it after launch","artist":"Rebecca Cobo","staminaCost":0.1,"accuracy":1,"selfHealth":1.1,"selfDef":1.1,"selfAcc":1.2},"Reboot":{"ref":"a","name":"Reboot","type":"defense","color":"#2640ab","category":"computer","animation-name":"computer-driverupdate.gif","sound":"computer-reboot.wav","description":"Have you tried turning it off and back on again?","artist":"Rebecca Cobo","staminaCost":0.18,"accuracy":1,"selfHealth":1.5},"CryptCracker":{"ref":"a","name":"CryptCracker","type":"attack","color":"#7037cf","category":"cryptography","animation-name":"cryptography-cryptcracker.gif","sound":"cryptography-cryptcracker.wav","description":"Damaging attack that breaks open secrets","artist":"Rebecca Cobo","staminaCost":0.1,"accuracy":0.85,"crtChance":0.1,"oppHealth":0.25},"CryptoSlam":{"ref":"a","name":"CryptoSlam","type":"attack","color":"#7037cf","category":"cryptography","animation-name":"cryptography-cryptoslam.gif","description":"Can't find me now","artist":"Richard Farrell","staminaCost":0.1,"accuracy":1,"oppHealth":0.2,"oppAcc":0.2},"Triangulate":{"ref":"a","name":"Triangulate","type":"attack","color":"#7037cf","category":"cryptography","animation-name":"cryptography-triangulate.gif","sound":"cryptography-triangulate.wav","description":"Keep them on the line for one minute","artist":"Rebecca Cobo","staminaCost":0.1,"accuracy":0.95,"crtChance":0.1,"oppHealth":0.2,"oppEva":0.25},"AlgoRhythm":{"ref":"a","name":"AlgoRhythm","type":"defense","color":"#7037cf","category":"cryptography","animation-name":"cryptography-algorhythm.gif","sound":"cryptography-algorhythm.wav","special":"qte","description":"Feel the beat!","artist":"Richard Farrell","staminaCost":0.15,"accuracy":1,"crtChance":0.1,"selfHealth":1.1},"Overcompress":{"ref":"an","name":"Overcompress","type":"attack","color":"#5b6489","category":"data","animation-name":"data-overcompress.gif","description":"Ugh, this image is all fuzzy!","artist":"Richard Farrell","staminaCost":0.12,"accuracy":0.8,"crtChance":0.1,"oppHealth":0.2},"CorruptDrive":{"ref":"a","name":"CorruptDrive","type":"attack","color":"#5b6489","category":"data","animation-name":"data-corruptdrive.gif","throw":"true","sound":"data-corruptdrive.wav","description":"Should've backed up","artist":"Richard Farrell","staminaCost":0.1,"accuracy":1,"crtChance":0.1,"oppHealth":0.3},"DataCorruption":{"ref":"a","name":"DataCorruption","type":"attack","color":"#5b6489","category":"data","animation-name":"data-datacorruption.gif","throw":"true","sound":"data-datacorruption.wav","description":"Take down their defenses","artist":"Richard Farrell","staminaCost":0.12,"accuracy":0.85,"crtChance":0.1,"oppHealth":0.15,"oppDef":0.3},"CyberOptimize":{"ref":"a","name":"CyberOptimize","type":"defense","color":"#5b6489","category":"data","animation-name":"data-cyberoptimize.gif","description":"Heals in log(n) time","artist":"Richard Farrell","staminaCost":0.15,"accuracy":1,"crtChance":0.3,"selfHealth":1.2,"selfAcc":1.25,"selfEva":1.15},"UserError":{"ref":"a","name":"UserError","type":"attack","color":"#ffc444","category":"error","animation-name":"error-usererror.gif","sound":"error-usererror.wav","description":"99% of the time","artist":"Richard Farrell","staminaCost":0.12,"accuracy":1,"crtChance":0.2,"oppHealth":0.25},"BannerOverload":{"ref":"a","name":"BannerOverload","type":"attack","color":"#ffc444","category":"error","animation-name":"error-banneroverload.gif","sound":"error-banneroverload.wav","description":"No I don't want to buy a Lexus! I want to watch a YouTube video!","artist":"Richard Farrell","staminaCost":0.15,"accuracy":0.95,"crtChance":0.1,"oppHealth":0.3},"PacketLoss":{"ref":"a","name":"PacketLoss","type":"attack","color":"#ffc444","category":"error","animation-name":"error-packetloss.gif","description":"Can't hit what you can't load","artist":"Richard Farrell","staminaCost":0.1,"accuracy":1,"crtChance":0.1,"oppHealth":0.2,"oppAtk":0.25},"BleedingEdge":{"ref":"a","name":"BleedingEdge","type":"attack","color":"#ffc444","category":"error","animation-name":"error-bleedingedge.gif","description":"So advanced, it's basically magic","artist":"Richard Farrell","staminaCost":0.15,"accuracy":0.95,"crtChance":0.4,"oppHealth":0.2},"BugFix":{"ref":"a","name":"BugFix","type":"defense","color":"#ffc444","category":"error","animation-name":"error-bugfix.gif","description":"Every programmer's worst nightmare","artist":"Richard Farrell","staminaCost":0.15,"accuracy":1,"selfHealth":1.3,"selfDef":1.2},"RandomAccess":{"ref":"a","name":"RandomAccess","type":"attack","color":"#f85888","category":"memory","animation-name":"memory-randomaccess.gif","sound":"memory-randomaccess.wav","description":"Spin to Win","artist":"Richard Farrell","staminaCost":0.18,"accuracy":0.95,"crtChance":0.1,"oppHealth":0.2,"oppDef":0.2},"RAMHog":{"ref":"a","name":"RAMHog","type":"attack","color":"#f85888","category":"memory","animation-name":"memory-ramhog.gif","sound":"memory-ramhog.wav","description":"Looking at you, Chrome","artist":"Richard Farrell","staminaCost":0.15,"accuracy":0.9,"crtChance":0.1,"oppHealth":0.25,"oppEva":0.3},"MemoryFlare":{"ref":"a","name":"MemoryFlare","type":"attack","color":"#f85888","category":"memory","animation-name":"memory-memoryflare.gif","sound":"memory-memoryflare.wav","description":"Why is my computer so hot?","artist":"Rebecca Cobo","staminaCost":0.1,"accuracy":1,"oppHealth":0.3,"oppAtk":0.25},"CacheErase":{"ref":"a","name":"CacheErase","type":"defense","color":"#f85888","category":"memory","animation-name":"memory-cacheerase.gif","sound":"memory-cacheerase.wav","description":"No one wants to see that","artist":"Richard Farrell","staminaCost":0.2,"accuracy":1,"selfHealth":1.2,"selfEva":1.25},"TraceRoute":{"ref":"a","name":"TraceRoute","type":"attack","color":"#41b6f2","category":"network","animation-name":"network-traceroute.gif","sound":"network-traceroute.wav","description":"\"Did you try to log in from [Asgabat, Turkmenistan]?\"","artist":"Richard Farrell","staminaCost":0.1,"accuracy":1,"crtChance":0.1,"oppHealth":0.2,"oppAcc":0.2},"SlowConnection":{"ref":"a","name":"SlowConnection","type":"attack","color":"#41b6f2","category":"network","animation-name":"network-slowconnection.gif","sound":"network-slowconnection.wav","description":"LAAAAAAG... OH GOD THE LAG","artist":"Rebecca Cobo","staminaCost":0.1,"accuracy":0.9,"crtChance":0.1,"oppHealth":0.2,"oppAcc":0.3},"OMGDDOS":{"ref":"an","name":"OMGDDOS","type":"attack","color":"#41b6f2","category":"network","animation-name":"network-omgddos.gif","description":"ROTFLMAO","artist":"Richard Farrell","staminaCost":0.18,"accuracy":1,"crtChance":0.1,"oppHealth":0.2},"DomainSwipe":{"ref":"a","name":"DomainSwipe","type":"defense","color":"#41b6f2","category":"network","animation-name":"network-domainswipe.gif","sound":"network-domainswipe.wav","description":"Dang, someone registered it before me!","artist":"Rebecca Cobo","staminaCost":0.15,"accuracy":1,"selfAcc":1.2},"EnableVPN":{"ref":"an","name":"EnableVPN","type":"defense","color":"#41b6f2","category":"network","animation-name":"network-enablevpn.gif","description":"I am from Australia for as long as it takes to watch this movie","artist":"Richard Farrell","staminaCost":0.1,"accuracy":1,"selfDef":1.2},"PacketShield":{"ref":"a","name":"PacketShield","type":"defense","color":"#41b6f2","category":"network","animation-name":"network-packetshield.gif","sound":"network-packetshield.wav","description":"Won't lose these!","artist":"Rebecca Cobo","staminaCost":0.1,"accuracy":1,"selfDef":1.1,"selfEva":1.2},"AttachTracker":{"ref":"an","name":"AttachTracker","type":"attack","color":"#ff7044","category":"security","animation-name":"security-attachtracker.gif","sound":"security-attachtracker.wav","description":"Only villains do that","artist":"Rebecca Cobo","staminaCost":0.1,"accuracy":0.9,"crtChance":0.1,"oppHealth":0.2,"oppDef":0.2},"ViralInfection":{"ref":"a","name":"ViralInfection","type":"attack","color":"#ff7044","category":"security","animation-name":"security-viralinfection.gif","sound":"security-viralinfection.wav","description":"6 feet apart","artist":"Rebecca Cobo","staminaCost":0.15,"accuracy":1,"crtChance":0.1,"oppHealth":0.2,"oppEva":0.25},"GoPhish":{"ref":"a","name":"GoPhish","type":"attack","color":"#ff7044","category":"security","animation-name":"security-gophish.gif","sound":"security-gophish.wav","sound-delay":"300","special":"qte","description":"Do you have any two's?","artist":"Rebecca Cobo","staminaCost":0.12,"accuracy":1,"crtChance":0.1,"oppHealth":0.25},"IdentityTheft":{"ref":"an","name":"IdentityTheft","type":"attack","color":"#ff7044","category":"security","animation-name":"security-identitytheft.gif","special":"opp-loses-2-turns","description":"Steal two turns from your opponent!","artist":"Rebecca Cobo","staminaCost":0.2,"accuracy":0.9,"crtChance":0.1,"oppHealth":0.1,"oppAcc":0.1},"Spambush":{"ref":"a","name":"Spambush","type":"attack","color":"#ff7044","category":"security","animation-name":"security-spambush.gif","sound":"security-spambush.wav","description":"Check the box to sign up for our newsletter","artist":"Richard Farrell","staminaCost":0.15,"accuracy":0.8,"crtChance":0.1,"oppHealth":0.2,"oppEva":0.25},"Firewall":{"ref":"a","name":"Firewall","type":"defense","color":"#ff7044","category":"security","animation-name":"security-firewall.gif","sound":"security-firewall.wav","description":"Health and Defense","artist":"Rebecca Cobo","staminaCost":0.15,"accuracy":1,"selfHealth":1.1,"selfDef":1.2},"DenyAccess":{"ref":"a","name":"DenyAccess","type":"defense","color":"#ff7044","category":"security","animation-name":"security-denyaccess.gif","special":"opp-loses-1-turn","description":"Steal a turn from your opponent","artist":"Richard Farrell","staminaCost":0.2,"accuracy":1,"selfDef":1.15},"FilterBurn":{"ref":"a","name":"FilterBurn","type":"defense","color":"#ff7044","category":"security","animation-name":"security-filterburn.gif","sound":"security-filterburn.wav","description":"Burn it all down","artist":"Richard Farrell","staminaCost":0.15,"accuracy":1,"selfEva":1.2},"TagCurse":{"ref":"a","name":"TagCurse","type":"attack","color":"#ff484f","category":"social","animation-name":"social-tagcurse.gif","sound":"social-tagcurse.wav","description":"Don't fall prey to the curse of the influencers!","artist":"Rebecca Cobo","staminaCost":0.1,"accuracy":0.8,"crtChance":0.1,"oppHealth":0.2,"oppDef":0.25},"EmailBlitz":{"ref":"an","name":"EmailBlitz","type":"attack","color":"#ff484f","category":"social","animation-name":"social-emailblitz.gif","sound":"social-emailblitz.wav","description":"Hi, would you like to vote for _______?","artist":"Rebecca Cobo","staminaCost":0.18,"accuracy":0.8,"crtChance":0.1,"oppHealth":0.3},"ClickStrike":{"ref":"a","name":"ClickStrike","type":"attack","color":"#ff484f","category":"social","animation-name":"social-clickstrike.gif","sound":"social-clickstrike.wav","description":"Basic attack, does damage, you know how it goes","artist":"Rebecca Cobo","staminaCost":0.15,"accuracy":0.95,"crtChance":0.1,"oppHealth":0.15},"PrivacyLeech":{"ref":"a","name":"PrivacyLeech","type":"attack","color":"#ff484f","category":"social","animation-name":"social-privacyleech.gif","sound":"social-privacyleech.wav","special":"opp-loses-1-turn","description":"Steal a turn from your opponent","artist":"Rebecca Cobo","staminaCost":0.15,"accuracy":1,"crtChance":0.1,"oppHealth":0.15,"oppDef":0.1},"Klomper":{"ref":"a","name":"Klomper","type":"attack","color":"#ff484f","category":"social","animation-name":"social-klomper.gif","sound":"social-klomper.wav","special":"opp-loses-2-turns","description":"Steal two turns! Oh, you gotta download Klomper","artist":"Rebecca Cobo","staminaCost":0.15,"accuracy":1,"crtChance":0.1,"oppHealth":0.15,"oppDef":0.1},"CrowdReach":{"ref":"a","name":"CrowdReach","type":"defense","color":"#ff484f","category":"social","animation-name":"social-crowdreach.gif","sound":"social-crowdreach.wav","description":"This video is sponsored by Raid: Shadow Legends","artist":"Rebecca Cobo","staminaCost":0.2,"accuracy":1,"selfAtk":1.25,"selfAcc":1.1},"Influence":{"ref":"an","name":"Influence","type":"defense","color":"#ff484f","category":"social","animation-name":"social-influence.gif","sound":"social-influence.wav","description":"I've got 100k followers, how many do you have?","artist":"Rebecca Cobo","staminaCost":0.15,"accuracy":1,"selfAcc":1.3},"AdBlock":{"ref":"an","name":"AdBlock","type":"defense","color":"#ff484f","category":"social","animation-name":"social-adblock.gif","sound":"social-adblock.wav","description":"Forever Enabled","artist":"Rebecca Cobo","staminaCost":0.1,"accuracy":1,"selfDef":1.2,"selfEva":1.2},"MissedConnection":{"ref":"a","name":"MissedConnection","type":"defense","color":"#ff484f","category":"social","animation-name":"social-missedconnection.gif","description":"Craigslist's Most Wanted","artist":"Richard Farrell","accuracy":1,"selfDef":1.2,"selfEva":1.2}}; 

return { data: data }; 

})(); 
