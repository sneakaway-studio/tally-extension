"use strict";

var Badges = (function() { 

var data = 
{"worker-bee":{"ref":"a","coded":"1","title":"Worker Bee","name":"worker-bee","ext":".gif","color":"#d38e2f","type":"economy","sound":"happy","trigger":"afterLoad","how-to":"tWorkday","description":"Lots of activity between 9-5 during a weekday","level":0},"nekonomics":{"ref":"a","coded":"1","title":"Nekonomics","name":"nekonomics","ext":".png","type":"economy","sound":"cautious","trigger":"afterLoad","tags":["cat","cats","feline","puppy","pup","dog","pupper"],"tagProgress":"pageTagsAnimals","description":"Any post with word “cat”","level":0},"night-owl":{"ref":"a","coded":"1","title":"Night Owl","name":"night-owl","ext":".gif","color":"#3a7db7","type":"economy","sound":"happy","trigger":"afterLoad","how-to":"tNight","description":"Using the internet at night","level":0},"big-clicker":{"ref":"a","coded":"1","title":"Big Clicker","name":"big-clicker","ext":".gif","color":"#712288","type":"computer","sound":"happy","trigger":"afterLoad","nProgress":"clicks","description":"Awarded for high click rate","level":0},"long-distance-scroller":{"ref":"a","coded":"1","title":"Long Distance Scroller","name":"long-distance-scroller","ext":".png","type":"computer","sound":"happy","trigger":"scrollAction","nProgress":"pageActionScrollDistance","description":"How many kilometers have you scrolled?","level":0},"cryptomaniac":{"ref":"a","coded":"1","title":"Cryptomaniac","name":"cryptomaniac","type":"cryptography","sound":"happy","trigger":"afterLoad","tags":["encryption","cryptography","SSL"],"tagProgress":"pageTagsEncryption","description":"Visit web pages containing information about encryption and security","level":0},"photo-geek":{"ref":"a","coded":"1","title":"Photo Geek","name":"photo-geek","ext":".png","type":"data","sound":"cautious","trigger":"afterLoad","tags":["gallery","picture","photo","full resolution"],"tagProgress":"pageTagsPhotos","description":"View lots of online galleries","level":0},"news-hound":{"ref":"a","coded":"1","title":"News Hound","name":"news-hound","type":"data","sound":"cautious","trigger":"afterLoad","tags":["news","article","post","npr","breaking"],"tagProgress":"pageTagsNews","description":"When you get most of your news through Facebook","level":0},"potty-mouth":{"ref":"a","coded":"1","title":"Potty Mouth","name":"potty-mouth","type":"data","sound":"cautious","trigger":"afterLoad","tags":["fuck","shit","damn","asshole","bitch","motherfucker","cunt"],"tagProgress":"pageTagsProfanity","description":"Visit web pages containing swear words","level":0},"404-scout":{"ref":"a","coded":"1","title":"404 Scout","name":"404-scout","type":"error","sound":"happy","trigger":"afterLoad","tags":["404","error","error page","not found"],"tagProgress":"pageTagsErrors","description":"A knack for finding 404 errors","level":0},"refresh-king":{"ref":"a","coded":"1","title":"Refresh King","name":"refresh-king","type":"memory","sound":"happy","trigger":"afterLoad","nProgress":"Repeatedly getting time = 1","description":"Refresh the page a lot","level":0},"biggest-fan":{"ref":"a","coded":"1","title":"Biggest Fan","name":"biggest-fan","type":"network","sound":"happy","trigger":"afterLoad","tags":["tally","tally saves the internet"],"tagProgress":"pageTagsTally","level":0},"fine-print":{"ref":"a","coded":"1","title":"Fine Print","name":"fine-print","type":"security","sound":"happy","trigger":"clickAction","tags":["terms","terms of service","law","privacy"],"tagProgress":"pageTagsLegal","description":"Click on a Terms of Service or Privacy link","level":0},"filter-bubble":{"ref":"a","coded":"1","title":"Filter Bubble","name":"filter-bubble","ext":".gif","color":"#8563f8","type":"social","sound":"cautious","trigger":"afterLoad","how-to":"tSocial","description":"Spend a lot of time on social media","level":0},"stalker":{"ref":"a","coded":"1","title":"Stalker","name":"stalker","ext":".gif","color":"#007fc1","type":"social","sound":"cautious","trigger":"afterLoad","how-to":"pSocial","description":"Spend a lot of time on social media but rarely click like","level":0},"ancient-data":{"ref":"an","coded":"1","title":"Ancient Data","name":"ancient-data","type":"data","sound":"happy","tags":["1990","1991","1992","1993","1994","1995","1996","1997","1998","1999"],"tagProgress":"pageTagsNineties","level":0},"utopian-visions":{"ref":"a","coded":"1","title":"Utopian Visions","name":"utopian-visions","ext":".png","type":"memory","sound":"happy","tags":["utopia","utopian","afrofuturism","futurism","octavia","butler","octavia butler"],"tagProgress":"pageTagsUtopianism","level":0},"whistleblower":{"ref":"a","coded":"1","title":"Whistleblower","name":"whistleblower","type":"security","sound":"cautious","tags":["snowden","whistleblower","brittany kaiser","cambridge analytica","psychometrics","the great hack"],"tagProgress":"pageTagsWhisteblower","level":0},"net-art":{"ref":"a","coded":"1","title":"net.art","name":"net-art","type":"network","sound":"happy","trigger":"afterLoad","tags":["net.art","jodi","theyrule","olia lialina","mark napier","alexei shulgin"],"tagProgress":"pageTagsNetArt","description":"Visit web pages containing information about networks","level":0}}; 

return { data: data }; 

})(); 
