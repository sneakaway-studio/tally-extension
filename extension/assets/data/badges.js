"use strict";

var Badges = (function() { 

var data = 
{"nekonomics":{"ref":"a","title":"Nekonomics","name":"nekonomics","ext":".png","category":"economy","sound":"cautious","tags":["cat","cats","feline","puppy","pup","dog","pupper"],"tagProgress":"pageTagsAnimals","description":"Any post with word “cat”","blurb":"This one is for the animal lovers! Find web content related to our furry friends, and you may just come across this badge.","level":0},"cryptomaniac":{"ref":"a","title":"Cryptomaniac","name":"cryptomaniac","ext":".png","category":"cryptography","sound":"happy","tags":["encryption","cryptography","SSL"],"tagProgress":"pageTagsEncryption","description":"Visit web pages containing information about encryption and security","blurb":"As our dependency on technology increases, so does our susceptibility to data breaches. Stay on top of your security game by visiting sites with information about encryption and security to earn the Cryptomaniac badge!","level":0},"404-scout":{"ref":"a","title":"404 Scout","name":"404-scout","ext":".png","category":"error","sound":"happy","tags":["404","error","error page","not found"],"tagProgress":"pageTagsErrors","description":"A knack for finding 404 errors","blurb":"404 errors can be frustrating, but at least you can earn this badge for running into them! That makes it a little more bearable...right?","level":0},"fomo":{"ref":"a","title":"FOMO","name":"fomo","ext":".png","category":"economy","sound":"cautious","tags":["buy now","act soon","amazon","in stock","on sale","sale","black friday","are you sure","running out","fomo","miss out","exclusive","exclusive offer","auction","ends in","sign up now","act now","ends soon"," ending soon"," today only"," act now"],"tagProgress":"pageTagsFomo","blurb":"The internet is full of psychological ploys that can cause actual addiction. Maybe you'll regret not getting this badge, or perhaps you'll start to wonder how even the tiniest phrases like \"only [some number] of this product is remaining\" urge us deep down to buy into the web's tricks.","level":0},"footfall":{"ref":"a","title":"Footfall","name":"footfall","ext":".png","category":"security","sound":"cautious","tags":["in-store","pickup","location","foot traffic","physical location"],"tagProgress":"pageTagsFootfall","description":"Encounter websites that track location to get you in their stores","blurb":"Did you know websites can track your geographical location to get you in their stores? Pretty creepy, right? The Footfall badge is earned when you encounter one of these sites.","level":0},"fine-print":{"ref":"a","title":"Fine Print","name":"fine-print","ext":".png","category":"security","sound":"happy","tags":["terms","terms of service","law","privacy"],"tagProgress":"pageTagsLegal","description":"Click on a Terms of Service or Privacy link","blurb":"Earn the Fine Print badge when you click on a Terms of Service or Privacy link. More often than not, Internet users opt to blindly accept these terms, though they can include much more than what meets the eye...","level":0},"loot-box":{"ref":"a","title":"Loot Box","name":"loot-box","ext":".png","category":"economy","sound":"cautious","tags":["clans","clash of clans","battle royale","fortnight","apex legends","overwatch","battlefront","call of duty","loot box"],"tagProgress":"pageTagsLootBoxes","description":"This badge is banned in some countries","level":0},"map-rabbit":{"ref":"a","title":"Map Rabbit","name":"map-rabbit","ext":".png","category":"data","sound":"happy","tags":["location","map","maps","latitude","longitude"],"tagProgress":"pageTagsMaps","level":0},"net-art":{"ref":"a","title":"net.art","name":"net-art","ext":".png","category":"network","sound":"happy","tags":["net.art","jodi","theyrule","olia lialina","mark napier","alexei shulgin"],"tagProgress":"pageTagsNetArt","description":"Visit web pages containing information about networks","level":0},"news-hound":{"ref":"a","title":"News Hound","name":"news-hound","ext":".png","category":"data","sound":"cautious","tags":["news","article","post","npr","breaking"],"tagProgress":"pageTagsNews","description":"When you get most of your news through Facebook","blurb":"Keeping up with current events through Facebook? You might just earn the News Hound Badge!","level":0},"ancient-data":{"ref":"an","title":"Ancient Data","name":"ancient-data","ext":".png","category":"data","sound":"happy","tags":["1990","1991","1992","1993","1994","1995","1996","1997","1998","1999"],"tagProgress":"pageTagsNineties","level":0},"open-source-operative":{"ref":"an","title":"Open Source Operative","name":"open-source-operative","ext":".png","category":"network","sound":"cautious","tags":["gnu","oss","freebsd","vlc","gimp","audacity","filezilla","mozilla","firefox","opensource","open access","royalty free","foss","linux","free access","public domain"],"tagProgress":"pageTagsOpenSource","level":0},"photo-geek":{"ref":"a","title":"Photo Geek","name":"photo-geek","ext":".png","category":"data","sound":"cautious","tags":["gallery","picture","photo","full resolution"],"tagProgress":"pageTagsPhotos","description":"View lots of online galleries","level":0},"potty-mouth":{"ref":"a","title":"Potty Mouth","name":"potty-mouth","ext":".png","category":"data","sound":"cautious","tags":["fuck","shit","damn","asshole","bitch","motherfucker","cunt"],"tagProgress":"pageTagsProfanity","description":"Visit web pages containing swear words","blurb":"Warning: Explicit Content. If you're visiting web pages containing swear words, you may earn this badge!","level":0},"biggest-fan":{"ref":"a","title":"Biggest Fan","name":"biggest-fan","ext":".png","category":"network","sound":"happy","tags":["tally","tally saves the internet"],"tagProgress":"pageTagsTally","level":0},"utopian-visions":{"ref":"a","title":"Utopian Visions","name":"utopian-visions","ext":".png","category":"memory","sound":"happy","tags":["utopia","utopian","afrofuturism","futurism","octavia","butler","octavia butler"],"tagProgress":"pageTagsUtopianism","level":0},"whistleblower":{"ref":"a","title":"Utopian Visions","name":"whistleblower","ext":".png","category":"security","sound":"cautious","tags":["snowden","whistleblower","brittany kaiser","cambridge analytica","psychometrics","the great hack"],"tagProgress":"pageTagsWhisteblower","level":0},"worker-bee":{"ref":"a","title":"Worker Bee","name":"worker-bee","ext":".png","color1":"#d38e2f","category":"economy","sound":"happy","description":"Lots of activity between 9-5 during a weekday","blurb":"Busy online during the work day? It should be a breeze to earn the Worker Bee badge! The Internet can be instrumental in the workplace, but, as we all know, it poses privacy issues to you and your business.","level":0},"night-owl":{"ref":"a","title":"Night Owl","name":"night-owl","ext":".png","color1":"#3a7db7","category":"economy","sound":"happy","description":"Using the internet at night","blurb":"Sometimes technology is just too hard to put down. While you’re up burning the midnight oil, you can collect the Night Owl badge!","level":0},"big-clicker":{"ref":"a","title":"Big Clicker","name":"big-clicker","ext":".png","color1":"#712288","category":"computer","sound":"happy","description":"Awarded for high click rate","blurb":"The Big Clicker badge is awarded for a high click rate! ","level":0},"long-distance-scroller":{"ref":"a","title":"Long Distance Scroller","name":"long-distance-scroller","ext":".png","category":"computer","sound":"happy","description":"How many kilometers have you scrolled?","level":0},"refresh-king":{"ref":"a","title":"Refresh King","name":"refresh-king","ext":".png","category":"memory","sound":"happy","description":"Refresh the page a lot","blurb":"Frequently checking for updates? The Refresh King badge is for you! Earn this badge after refreshing your web page often.","level":0},"filter-bubble":{"ref":"a","title":"Filter Bubble","name":"filter-bubble","ext":".png","color1":"#8563f8","category":"social","sound":"cautious","description":"Every 25 likes","blurb":"Spending a lot of time on social media? You might earn the Filter Bubble badge while you browse!","level":0},"stalker":{"ref":"a","title":"Stalker","name":"stalker","ext":".png","color1":"#007fc1","category":"social","sound":"cautious","description":"every 1 hour","blurb":"We may not be proud of it, but everyone does it. Earn the Stalker badge for spending time on social media without liking any posts.","level":0},"cookie-monster":{"ref":"a","title":"Cookie Monster","name":"cookie-monster","ext":".png","category":"security","sound":"happy","description":"Collect lots of cookies","blurb":"No matter where you go online, you’ll definitely pick up cookies along the way! Sadly, they won’t be the baked kind. Some web cookies are pretty harmless, but others can work against you and your data privacy.","level":0},"tracker-star":{"ref":"a","title":"Tracker Star","name":"tracker-star","ext":".png","category":"security","sound":"cautious","description":"Visited page with more than 50 trackers, gif (article)","blurb":"The Tracker Star badge is awarded for visiting a web page with over fifty trackers. Seem scary? It is, but Tally can help!","level":0},"shop-therefore":{"ref":"an","title":"I shop therefore I am","name":"shop-therefore","ext":".png","category":"economy","sound":"cautious","description":"Spend a lot of time shopping online","blurb":"Money can’t buy happiness, but spending it can earn you this badge! While online shopping is a powerful technological innovation, it’s important to understand how your buying tendencies can be collected and manipulated as behavioral data.","level":0},"browser-fingerprinting":{"ref":"a","title":"Browser Fingerprinting","name":"browser-fingerprinting","ext":".png","category":"security","sound":"cautious","description":"Encounter trackers known for fingerprinting","blurb":"Each time you surf the web, websites collect valuable information about your browser to identify you and your online actions. When you encounter and battle trackers known for browser fingerprinting, you can earn this badge. ","level":0}}; 

return { data: data }; 

})(); 
