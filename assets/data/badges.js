"use strict";

var Badges = (function() { 

var data = 
{"worker-bee":{"ref":"a","title":"Worker Bee","name":"worker-bee","ext":".gif","color":"#d38e2f","type":"economy","level":0,"sound":"happy","trigger":"afterLoad","how-to":"tWorkday","description":"Lots of activity between 9-5 during a weekday"},"night-owl":{"ref":"a","title":"Night Owl","name":"night-owl","ext":".gif","color":"#3a7db7","type":"economy","level":0,"sound":"happy","trigger":"afterLoad","how-to":"tNight","description":"Using the internet at night"},"day-walker":{"ref":"a","title":"Day Walker","name":"day-walker","ext":".gif","color":"#502f4d","type":"economy","level":0,"sound":"cautious","trigger":"afterLoad","how-to":"tDay","description":"Spend time on Facebook between 6:00 am and 9:00 pm"},"big-clicker":{"ref":"a","title":"Big Clicker","name":"big-clicker","ext":".gif","color":"#712288","type":"computer","level":0,"sound":"happy","trigger":"afterLoad","how-to":"clicks","description":"Awarded for high click rate"},"long-distance-scroller":{"ref":"a","title":"Long Distance Scroller","name":"long-distance-scroller","type":"computer","level":0,"sound":"happy","trigger":"scrollAction","how-to":"pageActionsScrollDistance","description":"How many miles have you scrolled?"},"cryptomaniac":{"ref":"a","title":"Cryptomaniac","name":"cryptomaniac","type":"cryptography","level":0,"sound":"happy","trigger":"afterLoad","tags":["encryption","cryptography","SSL"],"progress":"pageTagsEncryption","description":"Visit web pages containing information about encryption and security"},"photo-geek":{"ref":"a","title":"Photo Geek","name":"photo-geek","type":"data","level":0,"sound":"cautious","trigger":"afterLoad","tags":["gallery","picture","photo","full resolution"],"progress":"pageTagsPhotos","description":"View lots of online galleries"},"news-hound":{"ref":"a","title":"News Hound","name":"news-hound","type":"data","level":0,"sound":"cautious","trigger":"afterLoad","tags":["news","article","post","npr","breaking"],"progress":"pageTagsNews","description":"When you get most of your news through Facebook"},"cat-crazy":{"ref":"a","title":"Cat Crazy","name":"cat-crazy","type":"data","level":0,"sound":"cautious","trigger":"afterLoad","tags":["cat","cats","feline"],"progress":"pageTagsCats","description":"Any post with word “cat”"},"potty-mouth":{"ref":"a","title":"Potty Mouth","name":"potty-mouth","type":"data","level":0,"sound":"cautious","trigger":"afterLoad","tags":["fuck","shit","damn","asshole","bitch","motherfucker","cunt"],"progress":"pageTagsProfanity","description":"Visit web pages containing swear words"},"404-scout":{"ref":"a","title":"404 Scout","name":"404-scout","type":"error","level":0,"sound":"happy","trigger":"afterLoad","tags":["404","error","error page","not found"],"progress":"pageTagsErrors","description":"A knack for finding 404 errors"},"refresh-king":{"ref":"a","title":"Refresh King","name":"refresh-king","type":"memory","level":0,"sound":"happy","trigger":"afterLoad","how-to":"Repeatedly getting time = 1","description":"Refresh the page a lot"},"net-artisan":{"ref":"a","title":"Net.Artisan","name":"net-artisan","type":"network","level":0,"sound":"happy","trigger":"afterLoad","tags":["dns","tcp","server","linux","net.art"],"progress":"pageTagsNetworks","description":"Visit web pages containing information about networks"},"biggest-fan":{"ref":"a","title":"Biggest Fan","name":"biggest-fan","type":"network","level":0,"sound":"happy","trigger":"afterLoad","tags":["tally","tally saves the internet"],"progress":"pageTagsTally"},"cookie-monster":{"ref":"a","title":"Cookie Monster","name":"cookie-monster","type":"security","level":0,"sound":"happy","trigger":"afterLoad","how-to":"progress.cookies","description":"Collect lots of cookies"},"fine-print":{"ref":"a","title":"Fine Print","name":"fine-print","type":"security","level":0,"sound":"happy","trigger":"clickAction","tags":["terms","terms of service","law","privacy"],"progress":"pageTagsLegal","description":"Click on a Terms of Service or Privacy link"},"filter-bubble":{"ref":"a","title":"Filter Bubble","name":"filter-bubble","ext":".gif","color":"#8563f8","type":"social","level":0,"sound":"cautious","trigger":"afterLoad","how-to":"tSocial","description":"Spend a lot of time on social media"},"stalker":{"ref":"a","title":"Stalker","name":"stalker","ext":".gif","color":"#007fc1","type":"social","level":0,"sound":"cautious","trigger":"afterLoad","how-to":"pSocial","description":"Spend a lot of time on social media but rarely click like"},"narcissist":{"ref":"a","title":"Narcissist","name":"narcissist","type":"social","level":0,"sound":"cautious","trigger":"clickAction","tags":["\"edit profile\""],"how-to":"Look for text in click action","description":"Spend time editing your own profile"},"sheeple":{"ref":"a","title":"Sheeple","name":"sheeple","type":"social","level":0,"sound":"cautious","trigger":"clickAction","tags":["follow","share"],"how-to":"Look for text in click action","description":"Get lost in The Feed"},"mossy-bum":{"ref":"a","title":"Mossy Bum","name":"mossy-bum","type":"economy","level":0,"sound":"cautious","trigger":"scrollAction","how-to":"scrollDuration","description":"Number of times player scrolled on one page"}}; 

return { data: data }; 

})(); 
