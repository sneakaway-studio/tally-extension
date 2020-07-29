"use strict";

var Dialogues = (function() { 

var data = 
{"badge":{"worker-bee":[{"text":"Time for some exercise?","mood":"question"},{"text":"Maybe it's time for a break?","mood":"question"},{"text":"Workers of the world unite; you have nothing to lose but your chains.","mood":"neutral"},{"text":"Reason has always existed, but not always in a reasonable form.","mood":"neutral"},{"text":"I am nothing but I must be everything.","mood":"neutral"},{"text":"Men's ideas are the most direct emanations of their material state.","mood":"neutral"}],"night-owl":[{"text":"Who who?","mood":"question"}],"stalker":[{"text":"Um, maybe we should do something offline for a while?","mood":"cautious"},{"text":"Hmmm.","mood":"cautious"},{"text":"To surveil and be surveilled.","mood":"cautious"}],"filter-bubble":[{"text":"Preaching to the converted.","mood":"neutral"},{"text":"Is this what a filter bubble feels like?","mood":"question"},{"text":"The attention economy overlords demand more engagement!","mood":"excited"}],"big-clicker":[{"text":"Silicon Valley called; they need you to click more!","mood":"excited"},{"text":"If you aren't paying then you are the product","mood":"neutral"}]},"account":{"reset":[{"text":"You reset your account!","mood":"excited"},{"text":"A fresh start!","mood":"excited"},{"text":"Don't you wish you could delete your data from all the apps?","mood":"question"},{"text":"Starting over.","mood":"excited"}],"updated":[{"text":"Your account has been updated!","mood":"excited"},{"text":"Your account is active. You are ready to play!","mood":"excited"},{"text":"Your account is active!","mood":"excited"}]},"help":{"dashboard":[{"text":"Can I help you find something?","mood":"question"},{"text":"Have you seen the <a href=\"https://tallysavestheinternet.com/faq\" target=\"_blank\">FAQ</a>?","mood":"question"},{"text":"Reach out on social media if you want to discuss the game.","mood":"neutral"}],"how-to-play":[{"text":"Forget how to play? Check out the <a href=\"https://tallysavestheinternet.com/how-to-play\">How to Play</a> page.","mood":"excited"},{"text":"Don't know what to do? Did you see the <a href=\"https://tallysavestheinternet.com/how-to-play\">game loop</a>.","mood":"excited"},{"text":"Would you like to see the <a href=\"https://tallysavestheinternet.com/how-to-play\">How to Play</a> page?","mood":"question"},{"text":"Need a <a href=\"https://tallysavestheinternet.com/how-to-play\">How to Play</a> a refresher?","mood":"question"}]},"tag":{"covid":[{"text":"I'm thankful and yet worried for the internet these days.","mood":"neutral"}],"ads":[{"text":"Is behavioural tracking even moral? ","mood":"question"},{"text":"Can you feel the FOMO?","mood":"question"},{"text":"I can almost feel the ads working!","mood":"excited"}]},"tag ":{"privacy":[{"text":"Is it time for a <a href=\"https://datadetoxkit.org/\" target=\"_blank\">Data Detox</a>?","mood":"question"},{"text":"Do you know about the <a href=\"https://duckduckgo.com/?q=privacy+paradox\" target=\"_blank\">privacy paradox</a>?","mood":"cautious"},{"text":"Online tracking is just one way people trying to influence you.","mood":"cautious"}]},"domain":{"amazon.com":[{"text":"Beware the <a href=\"https://www.darkpatterns.org/\">dark patterns</a>","mood":"cautious"}],"google.com":[{"text":"Most data Google collects <a href=\"https://digitalcontentnext.org/wp-content/uploads/2018/08/DCN-Google-Data-Collection-Paper.pdf\" target=\"blank\">is recorded passively and not anonymous</a>.","mood":"cautious"}],"foxnews.com":[{"text":"Fair and balanced for whom?","mood":"question"}],"facebook.com":[{"text":"Is this what a filter bubble feels like?","mood":"question"},{"text":"There is a link between declining mental health and social media use.","mood":"cautious"},{"text":"I wonder if they only show content you already agree with?","mood":"question"}]},"level":{"up":[{"text":"You leveled up! <a href=https://tallysavestheinternet.com/profile'>Check out your profile</a>","mood":"excited"}]},"consumable":{"cookie":[{"text":"Is that edible?","mood":"question"},{"text":"Looks tasty. But is it safe?","mood":"question"},{"text":"Smells good.","mood":"happy"}],"fortune-cookie":[{"text":"Feeling lucky?","mood":"question"}],"pattern":[{"text":"A software pattern!","mood":"happy"},{"text":"A general repeatable solution to a commonly occurring problem.","mood":"neutral"}],"bug":[{"text":"I'm not sure about this one.","mood":"cautious"},{"text":"Be careful.","mood":"cautious"}]},"monster":{"far":[{"text":"Hmm. Something's wrong.","mood":"cautious"},{"text":"I've got a bad feeling about this.","mood":"cautious"},{"text":"Something feels off here.","mood":"cautious"},{"text":"Stay on the lookout for product monsters.","mood":"cautious"}],"close":[{"text":"There are monsters nearby.","mood":"cautious"},{"text":"Did you see that?","mood":"cautious"},{"text":"I think I saw a product monster.","mood":"cautious"},{"text":"An algorithm on this page is attempting a match.","mood":"cautious"},{"text":"A tracking algorithm matched you to a product monster.","mood":"cautious"},{"text":"Get ready, a product monster is nearby.","mood":"cautious"}],"display":[{"text":"Lets fight that monster!!!","mood":"excited"},{"text":"There's a product monster!","mood":"excited"},{"text":"Look out, a {{Monster.current}} monster!!!","mood":"excited"},{"text":"Look out!!!","mood":"excited"}],"captured":[{"text":"We just captured a product monster!","mood":"excited"},{"text":"Nice, a {{Monster.current}} monster!","mood":"excited"},{"text":"Good clicking, we captured it.","mood":"happy"},{"text":"Woohoo, a {{Monster.current}}!","mood":"excited"},{"text":"Great job, we caught it!","mood":"excited"}],"missed":[{"text":"It got away.","mood":"sad"},{"text":"Oh, the monster got away","mood":"sad"},{"text":"That one was fast, we have to be quicker!","mood":"neutral"},{"text":"Keep practicing, they can't run forever.","mood":"neutral"},{"text":"Almost had it!","mood":"excited"},{"text":"We'll get it next time!","mood":"neutral"},{"text":"So close! It barely got away.","mood":"neutral"}]},"battle":{"choose":[{"text":"Quick, don't let it escape!","mood":"excited"},{"text":"Click the product monster now!","mood":"excited"},{"text":"Click the product monster now to battle!","mood":"excited"}],"start":[{"text":"Let's battle this tracker!","mood":"excited"},{"text":"Let's keep this tracker from getting our data!","mood":"excited"}],"progress9":[{"text":"What's this {{Monster.current}} going to do.","mood":"cautious"}],"progress8":[{"text":"Not too shabby!","mood":"excited"}],"progress7":[{"text":"This monster won't get away so easily.","mood":"cautious"}],"progress6":[{"text":"Take that!","mood":"excited"}],"progress5":[{"text":"Keep going!","mood":"excited"},{"text":"These attacks are draining my stamina.","mood":"cautious"}],"progress4":[{"text":"This monster is tough!","mood":"excited"}],"progress3":[{"text":"Whoa, this is getting intense!","mood":"excited"},{"text":"The end is near!","mood":"excited"}],"progress2":[{"text":"Almost there!","mood":"excited"},{"text":"The battle is almost over!","mood":"excited"}],"progress1":[{"text":"Almost there.","mood":"cautious"},{"text":"One more hit.","mood":"cautious"},{"text":"Just a bit more left!","mood":"excited"}],"progress0":[{"text":"Finally!","mood":"excited"}],"lost-stats":[{"text":"Oh no!","mood":"sad"},{"text":"Don't give up yet!","mood":"sad"},{"text":"Ouch!","mood":"sad"}],"gained-stats":[{"text":"I feel great!","mood":"excited"},{"text":"Yes, a boost!","mood":"excited"}],"lost":[{"text":"We lost, but we'll get 'em next time.","mood":"sad"}],"tally-health-low":[{"text":"I'm almost out of health...","mood":"cautious"}],"tally-stamina-low":[{"text":"My stamina is almost gone.","mood":"cautious"}],"tally-health-gone":[{"text":"Oh no, I'm out of health.","mood":"sad"},{"text":"I need to get some rest...","mood":"sad"},{"text":"Looks like I've been beaten.","mood":"sad"}],"tally-stamina-gone":[{"text":"Man, I'm exhausted.","mood":"sad"},{"text":"Ugh, our stamina is all gone.","mood":"sad"}],"monster-health-low":[{"text":"The monster's health is almost gone.","mood":"happy"}],"monster-stamina-low":[{"text":"The monster is running out of stamina.","mood":"happy"}],"monster-health-gone":[{"text":"Yay, the {{Monster.current}} is out of health!","mood":"excited"}],"monster-stamina-gone":[{"text":"Awesome! The {{Monster.current}} is out of stamina!","mood":"excited"}]},"attack":{"reward":[{"text":"The attack chooser is in the pop up menu at the top right.","mood":"neutral"},{"text":"Edit your attacks and defenses in the popup menu.","mood":"neutral"},{"text":"You can edit attacks in the popup.","mood":"neutral"}]},"page":{"title":[{"text":"The title of this page is {{Page.data.title}}","mood":"neutral"}]},"player":{"compliment":[{"text":"Nice clicking!","mood":"excited"},{"text":"Yikes! I hope you're using an adblocker.","mood":"happy"}]},"random":{"long-return":[{"text":"Hello again! Where have you been?","mood":"sad"},{"text":"Hi! It's been a while!","mood":"sad"}],"greeting":[{"text":"What's doing?","mood":"question"},{"text":"You ready to defeat some monsters?","mood":"question"},{"text":"I'm so ready to beat some product monsters!","mood":"happy"},{"text":"I wonder how many product monsters we'll find today.","mood":"happy"},{"text":"Another great day to move up the leaderboard!","mood":"happy"}],"conversation":[{"text":"Phwwwwwhht.","mood":"neutral"},{"text":"What's this site?","mood":"neutral"},{"text":"I just watched \"Tiger King.\" Have you seen it?","mood":"question"}],"info":[{"text":"Access options by clicking on the icon on the top right.","mood":"happy"}]},"disguise":{"random":[{"text":"We've already beat a monster on this site.","mood":"happy"},{"text":"We've blocked a tracker here.","mood":"happy"},{"text":"Undercover.","mood":"neutral"}],"mask-pirate-black":[{"text":"Aaaaaaaarrrrrrrrrr!","mood":"excited"}],"glasses-groucho":[{"text":"Who's Tally?","mood":"question"},{"text":"Tally who?","mood":"question"}],"glasses-sun-green":[{"text":"Time to chill","mood":"happy"}],"glasses-tape":[{"text":"Be careful.","mood":"cautious"},{"text":"Oops!","mood":"cautious"}],"glasses-sherlock":[{"text":"Hmmmm.","mood":"neutral"},{"text":"Elementary","mood":"neutral"}],"mask-carnival-pink":[{"text":"Party time!","mood":"excited"}],"glasses-sun-hearts-red":[{"text":"I love my job.","mood":"happy"}],"glasses-3D":[{"text":"Now in 3D!","mood":"excited"}]},"tally":{"drag":[{"text":"Here we go!","mood":"excited"},{"text":"On the move!","mood":"excited"},{"text":"Cruisin'","mood":"happy"},{"text":"Weeeeeeeee!","mood":"happy"},{"text":"Look, no hands!","mood":"excited"},{"text":"I can fly!","mood":"excited"},{"text":"Up up and away","mood":"happy"},{"text":"Places to do, things to go.","mood":"happy"}]},"tracker":{"lots":[{"text":"There are a lot of trackers on this page.","mood":"cautious"},{"text":"Careful, there are trackers nearby.","mood":"cautious"},{"text":"Seriously, it's getting kinda creepy around here.","mood":"cautious"}],"few":[{"text":"There are a few trackers on this page.","mood":"cautious"}],"none":[{"text":"There are no trackers on this page.","mood":"happy"},{"text":"I don't see any trackers on this page.","mood":"happy"},{"text":"All the trackers are hiding!","mood":"excited"}]},"sound-test":{"happy":[{"text":"Hello!","mood":"happy"},{"text":"We won!","mood":"happy"},{"text":"Let's go explore!","mood":"happy"},{"text":"You blocked a tracker!","mood":"happy"},{"text":"We beat the product monster!","mood":"happy"}],"question":[{"text":"Who?","mood":"question"},{"text":"What's that?","mood":"question"},{"text":"How are you?","mood":"question"},{"text":"Was that a tracker?","mood":"question"},{"text":"Do you have any questions?","mood":"question"}],"cautious":[{"text":"Creeps","mood":"cautious"},{"text":"Oh no!","mood":"cautious"},{"text":"Be careful","mood":"cautious"},{"text":"One more hit.","mood":"cautious"},{"text":"Let's be careful here","mood":"cautious"},{"text":"There are a few trackers on this page.","mood":"cautious"}],"sad":[{"text":"Ouch","mood":"sad"},{"text":"Oh no","mood":"sad"},{"text":"It got away.","mood":"sad"},{"text":"We lost the battle","mood":"sad"},{"text":"We need to block more trackers","mood":"sad"},{"text":"Hi! It's been a while!","mood":"sad"},{"text":"Hello again! Where have you been?","mood":"sad"}],"excited":[{"text":"Yikes!","mood":"excited"},{"text":"Look out!","mood":"excited"},{"text":"There's a monster!","mood":"excited"},{"text":"Lets fight that monster!","mood":"excited"},{"text":"There's a product monster!","mood":"excited"}],"neutral":[{"text":"Weird","mood":"neutral"},{"text":"It got away.","mood":"neutral"},{"text":"That one was fast, we have to be quicker.","mood":"neutral"},{"text":"Keep practicing, they can't run forever.","mood":"neutral"},{"text":"Almost had it.","mood":"neutral"},{"text":"We'll get it next time.","mood":"neutral"}]},"image-test":{"excited":[{"text":"<img src=\"https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png\">Hello world!","mood":"excited"}]},"branch":{"answerNo":[{"text":"Ok, maybe another time.","mood":"neutral"},{"text":"No worries.","mood":"neutral"},{"text":"Ok.","mood":"neutral"}]},"tutorial":{"onboardingHowto1-1":{"text":"Hello!","mood":"happy"},"onboardingHowto1-2":{"text":"I'll hang out with you while you surf the web.","mood":"happy"},"onboardingHowto1-3":{"text":"This is the how to play page.","mood":"happy"},"onboardingHowto1-4":{"text":"Do you prefer to watch a how-to-play video? (ADD VIDEO LINK)","mood":"question"},"onboardingHowto1-5":{"text":"Or hear {my story,tutorial,story1}?","mood":"question"},"onboardingHowto1-6":{"text":"FYI, if I get too distracting, here's how to change my settings. (ADD VIDEO LINK)","mood":"cautious"},"onboardingFaq1-1":{"text":"Oh hey!","mood":"excited"},"onboardingFaq1-2":{"text":"This is our FAQ.","mood":"neutral"},"onboardingFaq1-3":{"text":"This page contains info on game play, options, and how to report technical issues.","mood":"neutral"},"onboardingFaq1-4":{"text":"Please use the links in the Feedback section if something isn't addressed here.","mood":"neutral"},"onboardingFaq1-5":{"text":"😀 thanks!","mood":"happy"},"story1-1":{"text":"OK, you chose to hear my story.","mood":"happy"},"story1-2":{"text":"My name is Tally and I need your help.","mood":"neutral"},"story1-3":{"text":"Like you, I hang out here on the internet. ","mood":"happy"},"story1-4":{"text":"Mainly I watch cat videos 🐱","mood":"happy","callback":"slideShowCatGifs"},"story1-5":{"text":"Lately things are getting weird. Advertising has taken over.","mood":"cautious"},"story1-6":{"text":"These aren't just popup ads.","mood":"cautious","callback":"slideShowPopUpAds"},"story1-7":{"text":"They track your behavior and try to manipulate you. ","mood":"cautious"},"story1-8":{"text":"They want to tell you what to buy and even how to vote!","mood":"cautious"},"story1-9":{"text":"This is what they already know about you.","mood":"cautious","callback":"slideShowBrowserDetails"},"story1-10":{"text":"Behavior manipulation is big business.","mood":"cautious"},"story1-11":{"text":"That's where I come in. I can sense trackers and warn you.","mood":"excited"},"story1-12":{"text":"They track your behavior and try to manipulate you.","mood":"excited","callback":"slideShowKindleMonster"},"story1-13":{"text":"They want to influence your actions using data from your browsing history.","mood":"excited"},"story1-14":{"text":"Together, we can battle the product monsters.","mood":"happy","callback":"slideShowBattle"},"story1-15":{"text":"We can block the trackers from using your data against you!","mood":"happy"},"story1-16":{"text":"Ok, go <a href=\"https://www.google.com/search?q=what%27s+on+the+internet+today\">enjoy the web</a> and let me know if you want to see a <a class=\"tally tally_showTutorial1\">game tutorial</a>.","mood":"happy","callback":"closeSlideshow"},"story1-17":{"text":"And watch out for those product monsters!","mood":"excited"},"story2-1":{"text":"Did you know a company predicted a woman was pregnant based on her purchases?","mood":"question"},"story2-2":{"text":"Want to hear the story? <a href=\"#\" class=\"story2-1\">Yes</a> | <a href=\"#\" class=\"no-story\">Another time</a>","mood":"question"},"story2-3":{"text":"Corporations can learn a lot about you just by your buying habits.","mood":"neutral"},"story2-4":{"text":"For example, whether you're pregnant or not.","mood":"neutral"},"story2-5":{"text":"Target found that pregnant women often buy specific products at different points in their pregnancy.","mood":"neutral"},"story2-6":{"text":"Within the first 20 weeks of pregnancy, women tend to buy supplements like calcium, magnesium, and zinc.","mood":"neutral"},"story2-7":{"text":"Pregnent women also tend to buy unscented lotion in their second trimester.","mood":"neutral"},"story2-8":{"text":"Using about 25 buying habits like these,","mood":"neutral"},"story2-9":{"text":"Target can not only predict if someone is pregnant,","mood":"neutral"},"story2-10":{"text":"but what stage of pregnancy someone is at and send them targeted ads.","mood":"neutral"},"story2-11":{"text":"This is just one way that companies use surveillance to change your behaviour.","mood":"neutral"},"story2-12":{"text":"Read more about <a href=\"https://www.nytimes.com/2012/02/19/magazine/shopping-habits.html\">this story</a>.","mood":"neutral"},"tutorial1-1":{"text":"Great! You picked the game tutorial!!","mood":"happy"},"tutorial1-2":{"text":"Want to practice finding product monsters with me?","mood":"happy"},"tutorial1-3":{"text":"If there's a product monster, there are data trackers on the page.","mood":"happy"},"tutorial1-4":{"text":"I will tell you when one is nearby.","mood":"cautious"},"tutorial1-5":{"text":"For example, let's go to <a href=\"https://www.amazon.com/\">amazon.com</a>.","mood":"cautious"},"tutorial1-6":{"text":"Search for anything.","mood":"cautious"},"tutorial1-7":{"text":"Oh a yellow monster silhouette related to the content of this page!","mood":"cautious"},"tutorial1-8":{"text":"Click on a similar page to see if you can find the monster.","mood":"cautious"}},"joke":{"jokePrompt":[{"text":"Want to hear a joke? {yes,joke,joke1} or {no,branch,answerNo}","mood":"question"},{"text":"Want to hear a joke? {yes,joke,joke2} or {no,branch,answerNo}","mood":"question"},{"text":"Want to hear a joke? {yes,joke,joke3} or {no,branch,answerNo}","mood":"question"}],"joke1-1":{"text":"What is the biggest lie in the entire universe?","mood":"question"},"joke1-2":{"text":"I have read the Terms and Conditions.","mood":"excited"},"joke1-3":{"text":"😀 ","mood":"happy"},"joke2-1":{"text":"Knock knock.","mood":"neutral"},"joke2-2":{"text":"Who's there?","mood":"question"},"joke2-3":{"text":"Canoe.","mood":"happy"},"joke2-4":{"text":"Canoe who?","mood":"question"},"joke2-5":{"text":"Canoe help me find some product monsters?","mood":"question"},"joke2-6":{"text":"😀 ","mood":"happy"},"joke3-1":{"text":"If the cloud ever went down would we call it fog instead?","mood":"question"},"joke3-2":{"text":"😀 ","mood":"happy"}}}; 

return { data: data }; 

})(); 
