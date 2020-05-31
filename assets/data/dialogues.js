"use strict";

var Dialogues = (function() { 

var data = 
{"tag":{"covid":[{"text":"I'm thankful and yet worried for the internet these days.","mood":"neutral"}],"ads":[{"text":"Is behavioural tracking even moral? ","mood":"question"},{"text":"Can you feel the FOMO?","mood":"question"},{"text":"I can almost feel the ads working!","mood":"excited"}]},"tag ":{"privacy":[{"text":"Is it time for a <a href=\"https://datadetoxkit.org/\" target=\"_blank\">Data Detox</a>?","mood":"question"},{"text":"Do you know about the <a href=\"https://duckduckgo.com/?q=privacy+paradox\" target=\"_blank\">privacy paradox</a>?","mood":"cautious"},{"text":"Online tracking is just one way people trying to influence you.","mood":"cautious"}]},"domain":{"amazon.com":[{"text":"Beware the <a href=\"https://www.darkpatterns.org/\">dark patterns</a>","mood":"cautious"}],"google.com":[{"text":"Most data Google collects <a href=\"https://digitalcontentnext.org/wp-content/uploads/2018/08/DCN-Google-Data-Collection-Paper.pdf\" target=\"blank\">is recorded passively and not anonymous</a>.","mood":"cautious"}],"foxnews.com":[{"text":"Fair and balanced for whom?","mood":"question"}],"facebook.com":[{"text":"Is this what a filter bubble feels like?","mood":"question"},{"text":"There is a link between declining mental health and social media use.","mood":"cautious"},{"text":"I wonder if they only show content you already agree with?","mood":"question"}]},"level":{"up":[{"text":"You leveled up! <a href='https://tallygame.net/profile'>Check out your profile</a>","mood":"excited"}]},"consumable":{"cookie":[{"text":"Is that edible?","mood":"question"},{"text":"Looks tasty. But is it safe?","mood":"question"},{"text":"Smells good...","mood":"happy"}],"warning":[{"text":"I'm not sure about this one.","mood":"cautious"},{"text":"Be careful.","mood":"cautious"}]},"monster":{"far":[{"text":"Hmm... Something's wrong.","mood":"cautious"},{"text":"I've got a bad feeling about this.","mood":"cautious"},{"text":"Something feels off here.","mood":"cautious"},{"text":"Stay on the lookout for product monsters.","mood":"cautious"}],"close":[{"text":"There are monsters nearby...","mood":"cautious"},{"text":"Did you see that?","mood":"cautious"},{"text":"I think I saw a product monster...","mood":"cautious"},{"text":"An algorithm on this page is attempting a match.","mood":"cautious"},{"text":"A tracking algorithm matched you to a product monster...","mood":"cautious"},{"text":"Get ready, a product monster is nearby.","mood":"cautious"}],"display":[{"text":"Lets fight that monster!!!","mood":"excited"},{"text":"There's a product monster!","mood":"excited"},{"text":"Look out, a {{Monster.current}} monster!!!","mood":"excited"},{"text":"Look out!!!","mood":"excited"}],"captured":[{"text":"We just captured a product monster!","mood":"excited"},{"text":"Nice, a {{Monster.current}} monster!","mood":"excited"},{"text":"Good clicking, we captured it.","mood":"happy"},{"text":"Woohoo, a {{Monster.current}}!","mood":"excited"},{"text":"Great job, we caught it!","mood":"excited"}],"missed":[{"text":"It got away...","mood":"neutral"},{"text":"That one was fast, we have to be quicker!","mood":"neutral"},{"text":"Keep practicing, they can't run forever...","mood":"neutral"},{"text":"Almost had it!","mood":"excited"},{"text":"We'll get it next time!","mood":"neutral"},{"text":"So close! It barely got away.","mood":"neutral"}]},"battle":{"choose":[{"text":"Quick, don't let it escape!","mood":"excited"},{"text":"Click the product monster now!","mood":"excited"},{"text":"Click the product monster now to battle!","mood":"excited"}],"start":[{"text":"Let's battle this tracker!","mood":"excited"},{"text":"Let's keep this tracker from getting our data!","mood":"excited"}],"progress9":[{"text":"What's this {{Monster.current}} going to do...","mood":"cautious"}],"progress8":[{"text":"Not too shabby!","mood":"excited"}],"progress7":[{"text":"This monster won't get away so easily.","mood":"cautious"}],"progress6":[{"text":"Take that!","mood":"excited"}],"progress5":[{"text":"Keep going!","mood":"excited"},{"text":"These attacks are draining my stamina.","mood":"cautious"}],"progress4":[{"text":"This monster is tough!","mood":"excited"}],"progress3":[{"text":"Whoa, this is getting intense!","mood":"excited"},{"text":"The end is near!","mood":"excited"}],"progress2":[{"text":"Almost there!","mood":"excited"},{"text":"The battle is almost over!","mood":"excited"}],"progress1":[{"text":"Almost there...","mood":"cautious"},{"text":"One more hit...","mood":"cautious"},{"text":"Just a bit more left!","mood":"excited"}],"progress0":[{"text":"Finally!","mood":"excited"}],"lost-stats":[{"text":"Oh no!","mood":"sad"},{"text":"Don't give up yet!","mood":"sad"},{"text":"Ouch!","mood":"sad"}],"gained-stats":[{"text":"I feel great!","mood":"excited"},{"text":"Yes, a boost!","mood":"excited"}],"lost":[{"text":"We lost, but we'll get 'em next time.","mood":"sad"}],"tally-health-low":[{"text":"I'm almost out of health...","mood":"cautious"}],"tally-stamina-low":[{"text":"My stamina is almost gone...","mood":"cautious"}],"tally-health-gone":[{"text":"Oh no, I'm out of health...","mood":"sad"},{"text":"I need to get some rest...","mood":"sad"},{"text":"Looks like I've been beaten...","mood":"sad"}],"tally-stamina-gone":[{"text":"Man, I'm exhausted...","mood":"sad"},{"text":"Ugh, our stamina is all gone...","mood":"sad"}],"monster-health-low":[{"text":"The monster's health is almost gone...","mood":"happy"}],"monster-stamina-low":[{"text":"The monster is running out of stamina.","mood":"happy"}],"monster-health-gone":[{"text":"Yay, the {{Monster.current}} is out of health!","mood":"excited"}],"monster-stamina-gone":[{"text":"Awesome! The {{Monster.current}} is out of stamina!","mood":"excited"}]},"page":{"title":[{"text":"The title of this page is {{Page.data.title}}","mood":"neutral"}]},"player":{"compliment":[{"text":"Nice clicking!","mood":"excited"},{"text":"Yikes! I hope you're using an adblocker.","mood":"happy"}]},"random":{"long-return":[{"text":"Hello again! Where have you been?","mood":"sad"},{"text":"Hi! It's been a while!","mood":"sad"}],"greeting":[{"text":"How are you?","mood":"question"},{"text":"You ready to defeat some monsters?","mood":"question"},{"text":"I'm so ready to beat some product monsters!","mood":"happy"},{"text":"I wonder how many product monsters we'll find today...","mood":"happy"},{"text":"Another great day to move up the leaderboard!","mood":"happy"}],"conversation":[{"text":"Phwwwwwhht...","mood":"neutral"},{"text":"What's this site?","mood":"neutral"},{"text":"I just watched \"Tiger King.\" Have you seen it?","mood":"question"}],"info":[{"text":"Access options by clicking on the icon on the top right.","mood":"happy"}]},"disguise":{"random":[{"text":"We've already beat a monster on this site.","mood":"happy"},{"text":"We've blocked a tracker here.","mood":"happy"},{"text":"Undercover...","mood":"neutral"}],"mask-pirate-black":[{"text":"Aaaaaaaarrrrrrrrrr!","mood":"excited"}],"glasses-groucho":[{"text":"Who's Tally?","mood":"question"},{"text":"Tally who?","mood":"question"}],"glasses-sun-green":[{"text":"Time to chill","mood":"happy"}],"glasses-tape":[{"text":"Be careful.","mood":"cautious"},{"text":"Oops!","mood":"cautious"}],"glasses-sherlock":[{"text":"Hmmmm...","mood":"neutral"},{"text":"Elementary","mood":"neutral"}],"mask-carnival-pink":[{"text":"Party time!","mood":"excited"}],"glasses-sun-hearts-red":[{"text":"I love my job.","mood":"happy"}],"glasses-3D":[{"text":"Now in 3D!","mood":"excited"}]},"tally":{"drag":[{"text":"Here we go!","mood":"excited"},{"text":"On the move!","mood":"excited"},{"text":"Cruisin'","mood":"happy"},{"text":"Weeeeeeeee!","mood":"happy"},{"text":"Look, no hands!","mood":"excited"},{"text":"I can fly!","mood":"excited"},{"text":"Up up and away","mood":"happy"},{"text":"Places to do, things to do.","mood":"happy"}]},"tracker":{"lots":[{"text":"There are a lot of trackers on this page.","mood":"cautious"},{"text":"Careful, there are trackers nearby.","mood":"cautious"},{"text":"Seriously, it's getting kinda creepy around here.","mood":"cautious"}],"few":[{"text":"There are a few trackers on this page.","mood":"cautious"}],"none":[{"text":"There are no trackers on this page.","mood":"happy"},{"text":"I don't see any trackers on this page.","mood":"happy"},{"text":"All the trackers are hiding!","mood":"excited"}]},"sound-test":{"happy":[{"text":"Hello!","mood":"happy"},{"text":"We won!","mood":"happy"},{"text":"Let's go explore!","mood":"happy"},{"text":"You blocked a tracker!","mood":"happy"},{"text":"We beat the product monster!","mood":"happy"}],"question":[{"text":"Who?","mood":"question"},{"text":"What's that?","mood":"question"},{"text":"How are you?","mood":"question"},{"text":"Was that a tracker?","mood":"question"},{"text":"Do you have any questions?","mood":"question"}],"cautious":[{"text":"Creeps","mood":"cautious"},{"text":"Oh no!","mood":"cautious"},{"text":"Be careful","mood":"cautious"},{"text":"One more hit...","mood":"cautious"},{"text":"Let's be careful here","mood":"cautious"},{"text":"There are a few trackers on this page.","mood":"cautious"}],"sad":[{"text":"Ouch","mood":"sad"},{"text":"Oh no","mood":"sad"},{"text":"It got away...","mood":"sad"},{"text":"We lost the battle","mood":"sad"},{"text":"We need to block more trackers","mood":"sad"},{"text":"Hi! It's been a while!","mood":"sad"},{"text":"Hello again! Where have you been?","mood":"sad"}],"excited":[{"text":"Yikes!","mood":"excited"},{"text":"Look out!","mood":"excited"},{"text":"There's a monster!","mood":"excited"},{"text":"Lets fight that monster!","mood":"excited"},{"text":"There's a product monster!","mood":"excited"}],"neutral":[{"text":"Weird","mood":"neutral"},{"text":"It got away...","mood":"neutral"},{"text":"That one was fast, we have to be quicker.","mood":"neutral"},{"text":"Keep practicing, they can't run forever...","mood":"neutral"},{"text":"Almost had it.","mood":"neutral"},{"text":"We'll get it next time.","mood":"neutral"}]},"tutorial":{"story1-1":{"text":"My name is Tally and I need your help.","mood":"happy"},"story1-2":{"text":"Like you, I hang out here on the internet. ","mood":"happy"},"story1-3":{"text":"Mainly I watch cat videos 🐱","mood":"happy","callback":"slideShowCatGifs"},"story1-4":{"text":"Lately things are getting weird. Advertising has taken over.","mood":"cautious"},"story1-5":{"text":"These aren't just popup ads...","mood":"cautious","callback":"slideShowPopUpAds"},"story1-6":{"text":"...they track your behavior and try to manipulate you. ","mood":"cautious"},"story1-7":{"text":"They want to tell you what to buy and even how to vote!","mood":"cautious"},"story1-8":{"text":"This is what they already know about you...","mood":"cautious","callback":"slideShowBrowserDetails"},"story1-9":{"text":"...and a whole lot more. Behavior manipulation is big business.","mood":"cautious"},"story1-10":{"text":"That's where I come in. I can sense trackers and warn you.","mood":"excited"},"story1-11":{"text":"I know they are near if <b>product monsters</b> are hiding on the page...","mood":"excited","callback":"slideShowKindleMonster"},"story1-12":{"text":"...trying to influence you with targeted ads from your browsing history.","mood":"excited"},"story1-13":{"text":"Together, we can battle the product monsters...","mood":"happy","callback":"slideShowBattle"},"story1-14":{"text":"...and block the trackers from using your data against you!","mood":"happy"},"story1-15":{"text":"Ok, go <a href=\"https://www.google.com/search?q=what%27s+on+the+internet+today\">enjoy the web</a> and let me know if you want to see a <a class=\"tally tally_showTutorial1\">game tutorial</a>.","mood":"happy","callback":"closeSlideshow"},"story1-16":{"text":"And watch out for those product monsters!","mood":"excited"},"story2-1":{"text":"Did you know a company predicted a woman was pregnant based on her purchases?","mood":"question"},"story2-2":{"text":"Want to hear the story? <a href=\"#\" class=\"story2-1\">Yes</a> | <a href=\"#\" class=\"no-story\">Another time</a>","mood":"question"},"story2-3":{"text":"Corporations can learn a lot about you just by your buying habits."},"story2-4":{"text":"...like whether you're pregnant or not."},"story2-5":{"text":"Target found that pregnant women often buy specific products at different points in their pregnancy."},"story2-6":{"text":"Within the first 20 weeks of pregnancy, women tend to buy supplements like calcium, magnesium, and zinc."},"story2-7":{"text":"Pregnent women also tend to buy unscented lotion in their second trimester."},"story2-8":{"text":"Using about 25 buying habits like these,"},"story2-9":{"text":"Target can not only predict if someone is pregnant,"},"story2-10":{"text":"but what stage of pregnancy someone is at and send them targeted ads."},"story2-11":{"text":"This is just one way that companies use surveillance to change your behaviour."},"story2-12":{"text":"Read more about <a href=\"https://www.nytimes.com/2012/02/19/magazine/shopping-habits.html\">this story</a>."},"tutorial1-1":{"text":"Want to practice finding product monsters with me?","mood":"happy"},"tutorial1-2":{"text":"I can sense when trackers and other algorithmic influencers are lurking. ","mood":"happy"},"tutorial1-3":{"text":"I will tell you when Product Monsters are nearby.","mood":"cautious"},"tutorial1-4":{"text":"In fact, there's one right now!","mood":"cautious"},"tutorial1-5":{"text":"Quick! Click on the Product Monster to capture it!","mood":"excited"},"tutorial1-6":{"text":"Good job! You've captured your first product monster. As you use the internet, Product Monsters living on webpages will appear. For example, if you are looking at a dessert recipe, this Cake Product Monster may pop up because of the site's meta tag 'recipe'.","mood":"happy"},"tutorial1-7":{"text":"As you collect new Product Monsters, they will appear here. You can level up each Product Monster in your collection by catching more of the same type! ","mood":"happy"},"tutorial1-8":{"text":"The more monsters you collect, the more XP you gain and the higher your rank will be in the leaderboards.","mood":"happy"},"tutorial1-9":{"text":"Be careful when trying to capture Product Monsters.","mood":"cautious"},"tutorial1-10":{"text":"Try to get to the #1 spot on a leaderboard! I've only heard rumors, but something really cool happens if you get the top spot.","mood":"happy"},"tutorial1-11":{"mood":"happy"}}}; 

return { data: data }; 

})(); 
