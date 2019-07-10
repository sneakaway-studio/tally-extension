"use strict";

var DialogueData = (function() {

	let DEBUG = false;

	let facts =
{ advertising:
   [ { domain: 'advertising',
       fact: 'An Ad exchange is an auction-based marketplace where advertisers can bid to place ads in the space offered by websites.',
       source: 'Wall Street Journal',
       year: '',
       url: 'https://www.wsj.com/articles/SB10001424052748703999304575399492916963232' },
     { domain: 'advertising',
       fact: 'A \'Beacon\' is invisible software on many websites that can track web surfers\' location and activities online.',
       source: 'Wall Street Journal',
       year: '',
       url: 'https://www.wsj.com/articles/SB10001424052748703999304575399492916963232' },
     { domain: 'advertising',
       fact: 'A \'Data Exchange\' is a marketplace where advertisers bid for access to data about customers. Marketers then use this data to target ads.\'',
       source: 'Wall Street Journal',
       year: '',
       url: 'https://www.wsj.com/articles/SB10001424052748703999304575399492916963232' },
     { domain: 'advertising',
       fact: 'Some great ad-blockers are AdBlock Plus, AdAway, and Brave Browser.',
       source: 'Tom\'s Guide',
       year: '',
       url: 'https://www.tomsguide.com/us/pictures-story/565-best-adblockers-privacy-extensions.html#s2' } ],
  'big data':
   [ { domain: 'big data',
       fact: 'Only 20% of Fortune 500 companies tell customers how they use their data AND give those customer\'s control over how much they share.',
       source: 'Harvard Business Review',
       year: '2018',
       url: ' https://hbr.org/2018/02/research-a-strong-privacy-policy-can-save-your-company-millions ' } ],
  chrome:
   [ { domain: 'chrome',
       fact: 'Incognito mode does not mean you browse the web anonymously; it only means that your data is not stored locally. In fact, websites can still collect your data.',
       source: 'Cliqz',
       year: '2018',
       url: 'https://cliqz.com/en/magazine/know-incognito-mode-not-private' } ],
  data:
   [ { domain: 'data',
       fact: 'The European Union\'s General Data Protection Regulation (GDPR) requires businesses to protect the \'personal data and privacy of EU citizens for transactions that occur within the EU\'. ',
       source: 'ipswitch',
       year: '',
       url: 'https://blog.ipswitch.com/data-privacy-vs-data-protection' },
     { domain: 'data',
       fact: 'In the US, there is no single, comprehensive federal law regulating the collection and use of personal data.',
       source: 'Reuters',
       year: '',
       url: 'https://uk.practicallaw.thomsonreuters.com/6-502-0467?transitionType=Default&contextData=(sc.Default)&firstPage=true&bhcp=1' },
     { domain: 'data',
       fact: 'Spotify, Tinder, GrubHub, Pandora, and Lyft reserve the right to share your Non-Personal Information to third parties.',
       source: 'Business Insider',
       year: '',
       url: 'http://www.businessinsider.com/spotify-pandora-tinder-apps-sell-anonymized-data-2017-5#seamlessgrubhub-3' },
     { domain: 'data',
       fact: '84% of Americans use navigation apps like Google Maps, Waze and Apple Maps.',
       source: 'New York Times',
       year: '2018',
       url: 'https://www.nytimes.com/2018/03/06/us/artificial-intelligence-jobs.html?rref=collection%2Fsectioncollection%2Ftechnology' },
     { domain: 'data',
       fact: 'Offline Data is information about you that comes from sources other than the Internet. It could include your zip code, estimated household income, the cars you own, or the purchases you\'ve made in a store.',
       source: 'Wall Street Journal',
       year: '',
       url: 'https://www.wsj.com/articles/SB10001424052748703999304575399492916963232' },
     { domain: 'data',
       fact: '52% of Americans don\'t know what a Privacy Policy is.',
       source: 'Pew',
       year: '2014',
       url: 'http://www.pewresearch.org/fact-tank/2014/12/04/half-of-americans-dont-know-what-a-privacy-policy-is/' },
     { domain: 'data',
       fact: 'A privacy policy is a legal document that discloses how customer data is managed and used.',
       source: 'Pew',
       year: '2014',
       url: 'http://www.pewresearch.org/fact-tank/2014/12/04/half-of-americans-dont-know-what-a-privacy-policy-is/' },
     { domain: 'data',
       fact: 'Google, Facebook, Amazon, Apple, and Microsoft are dominant data harvesters in the business. ',
       source: 'New York Times',
       year: '2018',
       url: 'https://www.nytimes.com/2018/03/06/business/economy/user-data-pay.html?rref=collection%2Fsectioncollection%2Ftechnology&action=click&contentCollection=technology&region=stream&module=stream_unit&version=latest&contentPlacement=19&pgtype=sectionfront' },
     { domain: 'data',
       fact: 'The data broker, Axicom, claims to have data on 10% of the world\'s population.',
       source: 'Revolvy',
       year: '',
       url: 'https://www.revolvy.com/main/index.php?s=Senate.gov&item_type=topic' },
     { domain: 'data',
       fact: 'Facebook owns 7 other companies all of which collect, consolidate, and store data on your liking, buying, and posting habits.',
       source: 'DataEthics',
       year: '2015',
       url: 'https://dataethics.eu/en/facebooks-data-collection-sharelab/' },
     { domain: 'data',
       fact: 'The Supreme Court will hear a case this year regarding \'whether we update our laws regarding access to information for the internet age.\' ',
       source: 'Wired',
       year: '2018',
       url: 'https://www.wired.com/story/us-vs-microsoft-supreme-court-case-data/' },
     { domain: 'data',
       fact: 'There are two categories of data collection. Active data collection occurs when one needs to respond to some stimulus, like a questionnaire. Passive data collection occurs when data is collected without any action required from that person.',
       source: 'Insight to Impact',
       year: '2017',
       url: 'http://www.i2ifacility.org/insights/blog/15-innovations-in-data-collection-methods-broadening-the-financial-inclusion-survey-toolkit?entity=blog' },
     { domain: 'data',
       fact: 'The Internet of Things (IoT) is the interconnection via the Internet of computing devices embedded in everyday objects. This interconnectedness enables them to send and receive data to each other.',
       source: 'Forbes',
       year: '2014',
       url: 'https://www.forbes.com/sites/jacobmorgan/2014/05/13/simple-explanation-internet-things-that-anyone-can-understand/#7237782f1d09' },
     { domain: 'data',
       fact: 'In Estonia, the government must notify its citizens when it looks at, or alters, their data.',
       source: 'DataEthics',
       year: '2018',
       url: 'https://dataethics.eu/en/fix-future-according-andrew-keen/' } ],
  facebook:
   [ { domain: 'facebook',
       fact: 'Facebook made $17.37 billion on ads in 2017, more than 20% of all ad revenue in the United States.',
       source: 'eMarketer',
       year: '',
       url: 'https://www.emarketer.com/Article/Google-Facebook-Tighten-Grip-on-US-Digital-Ad-Market/1016494' },
     { domain: 'facebook',
       fact: 'Cambridge Analytica secretely captured data from over 50 million Facebook users.',
       source: 'Cliqz',
       year: '2018',
       url: 'https://cliqz.com/en/magazine/cambridge-analytica-scandal-delete-facebook-account' },
     { domain: 'facebook',
       fact: 'Facebook tracks 30% of web traffic.',
       source: 'Cliqz',
       year: '2018',
       url: 'https://cliqz.com/en/magazine/cambridge-analytica-scandal-delete-facebook-account' },
     { domain: 'facebook',
       fact: 'In a 2018 interview, Mark Zuckerberg says that Facebook won’t be able to uncover where all of its user data goes or how it is being deployed.',
       source: 'Wall Street Journal',
       year: '2018',
       url: 'https://www.wsj.com/articles/next-worry-for-facebook-disenchanted-users-1521717883?tesla=y' } ],
  google:
   [ { domain: 'google',
       fact: 'Google parent company Alphabet makes more money from digital ads than any company on the planet.',
       source: 'Recode',
       year: '2017',
       url: 'https://www.recode.net/2017/7/24/16020330/google-digital-mobile-ad-revenue-world-leader-facebook-growth' },
     { domain: 'google',
       fact: 'Google made $73.8 billion dollars in net digital ad sales in 2017.',
       source: 'Recode',
       year: '',
       url: 'https://www.recode.net/2017/7/24/16020330/google-digital-mobile-ad-revenue-world-leader-facebook-growth' },
     { domain: 'google',
       fact: 'Google captured 33 percent of the world’s $223.7 billion in digital ad revenue in 2017.',
       source: 'Recode',
       year: '',
       url: 'https://www.recode.net/2017/7/24/16020330/google-digital-mobile-ad-revenue-world-leader-facebook-growth' },
     { domain: 'google',
       fact: 'In 2007, Google bought, DoubleClick, an online advertising company, for $3.1 billion dollars.',
       source: 'The New York Times',
       year: '',
       url: 'www.nytimes.com/2007/04/14/technology/14DoubleClick.html' },
     { domain: 'google',
       fact: 'Internet users perform 40,000 search queries every second on Google. That\'s 3.5 searches per day and 1.2 trillion searches per year.',
       source: 'Forbes',
       year: '2015',
       url: 'https://www.forbes.com/sites/bernardmarr/2015/09/30/big-data-20-mind-boggling-facts-everyone-must-read/#71a41e5e17b1' },
     { domain: 'google',
       fact: 'Ad revenue consitutued 70% of Google\'s revenues in 2017.',
       source: 'Statista',
       year: '',
       url: 'https://www.statista.com/statistics/266249/advertising-revenue-of-google/' },
     { domain: 'google',
       fact: 'Google can track user behavior on 88 percent of all Internet domains.',
       source: 'Washington Post',
       year: '2014',
       url: 'https://www.washingtonpost.com/news/the-intersect/wp/2014/11/19/everything-google-knows-about-you-and-how-it-knows-it/?utm_term=.23ebe43d98dd' } ],
  security:
   [ { domain: 'security',
       fact: 'Non-profit 5Rights works to support children and young people as they explore, play, learn and grow in the digital environment! Learn more at their website https://5rightsframework.com/.',
       source: '5Rights',
       year: '2018',
       url: 'https://5rightsframework.com/' },
     { domain: 'security',
       fact: 'A majority of Americans (64%) have personally experienced a major data breach.',
       source: 'Pew',
       year: '2017',
       url: 'http://www.pewinternet.org/2017/01/26/americans-and-cybersecurity/' },
     { domain: 'security',
       fact: 'Nearly two-thirds of Americans have experienced some form of data theft.',
       source: 'Pew',
       year: '2017',
       url: 'http://www.pewinternet.org/2017/01/26/americans-and-cybersecurity/' },
     { domain: 'security',
       fact: 'Akamai researches found that 65,000 devices on router mechanisms have been exploited and injected with one or more malicious commands.',
       source: 'Wired',
       year: '2018',
       url: 'https://www.wired.com/story/upnp-router-game-console-vulnerabilities-exploited/' } ],
  trackers:
   [ { domain: 'trackers',
       fact: 'Trackers are scripts embedded in websites that collect and store information about you and your behavior.',
       source: '',
       year: '',
       url: '' },
     { domain: 'trackers',
       fact: 'Most trackers belong to companies who want to collect as much data as possible about you.',
       source: '',
       year: '',
       url: '' },
     { domain: 'trackers',
       fact: 'Trackers are part of a large system wherein your data is harvested in order to influence what you buy, how you vote, and what you think.',
       source: '',
       year: '',
       url: '' },
     { domain: 'trackers',
       fact: 'The data that trackers collect can include your age, where you live, what you read, and your interests.',
       source: '',
       year: '',
       url: '' },
     { domain: 'trackers',
       fact: 'Data that trackers collect is packaged and sold to others, including advertisers, other companies, even governments.',
       source: '',
       year: '',
       url: '' },
     { domain: 'trackers',
       fact: 'Ad blockers are applications (plugins or browser extensions) that remove or alter advertising content on a webpage.',
       source: 'HubSpot',
       year: '',
       url: 'https://blog.hubspot.com/marketing/how-ad-blocking-works' },
     { domain: 'trackers',
       fact: '41% of people between 18-29 years old say they use ad blocking software.',
       source: 'HubSpot',
       year: '',
       url: 'https://blog.hubspot.com/marketing/how-ad-blocking-works' },
     { domain: 'trackers',
       fact: 'Apple released an ad-blocker called Crystal for use with iOS9.',
       source: 'The Awl',
       year: '2015',
       url: 'https://www.theawl.com/2015/09/welcome-to-the-block-party/' },
     { domain: 'trackers',
       fact: 'A browser cookie is a small piece of code that lets ad networks and sites share information on what visitors view or buy.',
       source: 'Washington Post',
       year: '',
       url: 'https://www.washingtonpost.com/apps/g/page/business/how-targeted-advertising-works/412/' },
     { domain: 'trackers',
       fact: 'A \'tracking company\' uses cookies and other tracking technology to collect online data about you.',
       source: 'Wall Street Journal',
       year: '',
       url: 'https://www.wsj.com/articles/SB10001424052748703999304575399492916963232' },
     { domain: 'trackers',
       fact: 'Supercookies are trackers that contain a unique idtentifier, allowing trackers to link existing data to new browsing behavior.',
       source: 'Cliqz',
       year: '2018',
       url: 'https://cliqz.com/en/magazine/cookies-fingerprinting-co-tracking-methods-clearly-explained' },
     { domain: 'trackers',
       fact: 'There are an average of 9 trackers and 33 tracker requests per page.',
       source: 'Cliqz',
       year: '2018',
       url: 'https://cliqz.com/en/magazine/whotracks-me-find-out-where-youre-being-tracked-on-the-web' },
     { domain: 'trackers',
       fact: 'Google tracks 81% of web traffic.',
       source: 'WhoTracksMe',
       year: '2018',
       url: 'https://whotracks.me/companies/reach-chart.html' },
     { domain: 'trackers',
       fact: 'Google Analytics, Google CDN, and Google APIs are the top three trackers on the internet.',
       source: 'WhoTracksMe',
       year: '2018',
       url: 'https://whotracks.me/' },
     { domain: 'trackers',
       fact: 'Hey! Did you kow 77.4% of all page loads contain trackers.',
       source: 'Cliqz and Ghostery',
       year: '2018',
       url: 'https://cliqz.com/en/magazine/ghostery-study-infographic' } ] }
;
let dialogue =
{"consumable":{"cookie":[{"text":"I wonder if this is a good cookie?","mood":"cautious"}]},"monster":{"far":[{"text":"This place makes me nervous.","mood":"cautious"},{"text":"I've got a bad feeling about this.","mood":"cautious"},{"text":"Be prepared for product monsters.","mood":"cautious"},{"text":"Something feels off here","mood":"cautious"},{"text":"Did you see that?","mood":"cautious"}],"close":[{"text":"There are monsters nearby...","mood":"cautious"},{"text":"I think a product monster is getting closer...","mood":"cautious"},{"text":"I think I saw a product monster...","mood":"cautious"},{"text":"Be ready to click, a product monster is close by","mood":"cautious"},{"text":"Get ready, a product monster is nearby","mood":"cautious"}],"display":[{"text":"A product monster!!!","mood":"danger"},{"text":"There's a product monster on this page!","mood":"danger"},{"text":"Look out, a {{Monster.current}} monster!!!","mood":"danger"},{"text":"Look out!!!","mood":"danger"}],"captured":[{"text":"You just captured a product monster!","mood":"award"},{"text":"Wow, a {{Monster.current}} monster!","mood":"award"},{"text":"Good clicking, you captured it!","mood":"award"},{"text":"Woohoo, a {{Monster.current}} monster!","mood":"award"},{"text":"Great job, you got it!","mood":"award"}],"missed":[{"text":"The product monster got away","mood":"neutral"},{"text":"That one was fast, we have to be quicker!","mood":"neutral"},{"text":"Keep practicing, they can't run forever...","mood":"neutral"},{"text":"Almost had it!","mood":"neutral"},{"text":"We'll get it next time!","mood":"neutral"}]},"battle":{"choose":[{"text":"Quick, don't let it escape!","mood":"danger"},{"text":"Click the product monster now!","mood":"danger"},{"text":"Click the product monster now to battle!","mood":"danger"}],"start":[{"text":"Let's battle this tracker!","mood":"danger"},{"text":"Let's keep this tracker from getting our data!","mood":"danger"}],"progress9":[{"text":"What kind of algorithms are guiding this monster!?","mood":"cautious"}],"progress8":[{"text":"Not too shabby","mood":"cautious"}],"progress7":[{"text":"This monster won't get away so easily","mood":"cautious"}],"progress6":[{"text":"Fight for your right to be let alone!","mood":"cautious"}],"progress5":[{"text":"Keep going!","mood":"cautious"}],"progress4":[{"text":"This monster is tough!","mood":"cautious"}],"progress3":[{"text":"Whoa, this is getting intense!","mood":"cautious"},{"text":"The end is near!","mood":"cautious"}],"progress2":[{"text":"The battle is almost over!","mood":"cautious"}],"progress1":[{"text":"One more hit...","mood":"cautious"},{"text":"Just a bit more left!","mood":"cautious"}],"progress0":[{"text":"Finally!","mood":"cautious"}],"lost-stats":[{"text":"Oh dang","mood":"sad"},{"text":"Don't give up yet!","mood":"sad"},{"text":"Ouch!","mood":"sad"}],"gained-stats":[{"text":"That will show those trackers!","mood":"happy"},{"text":"Yes!!","mood":"happy"}],"tally-health-low":[{"text":"Oh no, we are out of health...","mood":"cautious"}],"tally-stamina-low":[{"text":"Oh no, our stamina is all gone...","mood":"cautious"}],"monster-health-low":[{"text":"Yay, the monster is out of health...","mood":"happy"}],"monster-stamina-low":[{"text":"Awesome! The monster has no stamina left...","mood":"happy"}]},"page":{"title":[{"text":"The title of this page is {{pageData.title}}","mood":"neutral"}]},"player":{"compliment":[{"text":"Nice clicking!","mood":"happy"},{"text":"Yikes! I hope you are using an adblocker","mood":"happy"}]},"random":{"greeting":[{"text":"Hello, I missed you.","mood":"sad"},{"text":"How are you?","mood":"question"},{"text":"Hello world! 😀","mood":"happy"},{"text":"What's doing?","mood":""}]},"tracker":{"lots":[{"text":"There are a lot of trackers on this page.","mood":"cautious"},{"text":"Careful, there are trackers nearby.","mood":"cautious"},{"text":"Seriously, it's getting kind of creepy around here.","mood":"cautious"}],"few":[{"text":"There are a few trackers on this page.","mood":"cautious"}],"none":[{"text":"There are no trackers on this page.","mood":"happy"}]},"onboarding":{"onboarding1":{"text":"Finally! I've found you! ","mood":"happy"},"onboarding2":{"text":"My name is Tally and I need your help.","mood":"happy"},"onboarding3":{"text":"Like you, I hang out here on the internet. Mainly I watch cat videos. ","mood":"neutral"},"onboarding4":{"text":"But lately things have been getting weird. Advertising has taken over. These aren't just popup ads...","mood":"cautious"},"onboarding5":{"text":"...they are behavioral trackers that use your data against you. ","mood":"cautious"},"onboarding6":{"text":"They are everywhere and they surveil you to influence your purchasing decisions.","mood":"cautious"},"onboarding7":{"text":"You can't use the internet without being manipulated by them. ","mood":"cautious"},"onboarding8":{"text":"What's more, Vilikon, the master tracker who controls the trackers, is growing more powerful.","mood":"danger"},"onboarding9":{"text":"His trackers are becoming more aggressive. They want more of your data to try to influence not just what you purchase, but how you vote and what you care about. ","mood":"danger"},"onboarding10":{"text":"While you’ve been browsing on your computer, Product Monsters have been watching you and taking your information.","mood":"sad"},"onboarding11":{"text":"This is what they already know about you.","mood":"neutral"},"onboarding12":{"text":"It's your job to stop the monsters from collecting your data!!!","mood":"cautious"},"onboarding13":{"text":"Before you start your journey to defeat Vilikon, we need to create your secret identity. Let's go to your profile page!","mood":"happy"}},"tutorial":{"tutorial1":{"text":"Great, now you've got a secret identity, let's begin our journey","mood":"happy"},"tutorial2":{"text":"Luckily you have me! I will stay right here and tell you when Product Monsters are nearby. I can sense when trackers and other algorithmic influencers are lurking. ","mood":"happy"},"tutorial3":{"text":"In fact, there's one right now!","mood":"cautious"},"tutorial4":{"text":"Quick! Click on the Product Monster to capture it!","mood":"danger"},"tutorial5":{"text":"Good job! You've captured your first product monster. As you use the internet, Product Monsters living on webpages will appear. For example, if you are looking at a dessert recipe, this Cake Product Monster may pop up because of the site's meta tag 'recipe'.","mood":"award"},"tutorial6":{"text":"As you collect new Product Monsters, they will appear here. You can level up each Product Monster in your collection by catching more of the same type! ","mood":"happy"},"tutorial7":{"text":"The more monsters you collect, the more points you gain and the higher your rank will be in the leaderboards.","mood":"happy"},"tutorial8":{"text":"Be careful when trying to capture Product Monsters. If your click misses the product monster, your score will drop.","mood":"cautious"},"tutorial9":{"text":"Try to get to the #1 spot on a leaderboard! I've only heard rumors, but something really cool happens if you get the top spot.","mood":"happy"},"tutorial10":{"text":"*Thunder rumble sound effect*","mood":"specialized sound effect"},"tutorial11":{"text":"Oh no! Vilikon just got even stronger.","mood":"danger"}}}
;


	/**
	 *	Get a random fact (by domain)
	 */
	function getFact(domain, includeSource = true) {
		try {
			let fact = FS_Object.randomArrayIndex(facts[domain]);
			// get fact
			let str = fact.fact;
			// should we include source?
			if (includeSource) {
				if (fact.url && fact.source)
					str += " Source: <a href='" + fact.url + "' target='_blank'>" + fact.source + "</a>";
				if (fact.year)
					str += " (" + fact.year + ")";
			}
			return str;
		} catch (err) {
			console.error(err);
		}
	}

	/**
	 *	Return a dialogue, arr = ["category", "subcategory", "index"]
	 */
	function get(arr) {
		try {
			// make sure it is an array
			if (!Array.isArray(arr)) return;
			// category is required
			if (!prop(arr[0])) return;

			if (DEBUG) console.log("💭 DialogueData.get() arr="+ JSON.stringify(arr));


			// get category
			let category, categoryStr, subcategoryStr;
			categoryStr = arr[0];
			category = dialogue[categoryStr];

			if (DEBUG) console.log("💭 DialogueData.get()", "categoryStr="+categoryStr +", category="+ JSON.stringify(category));

			// if there is a subcategory, then select random
			if (prop(arr[1])) {
				subcategoryStr = arr[1];
				if (DEBUG) console.log("💭 DialogueData.get()", "subcategoryStr="+subcategoryStr );
				// if prop doesn't exist in DialogueData then don't show anything
				if (!prop(category[subcategoryStr]) || category[subcategoryStr].length < 1) return;
				// otherwise get a random one
				let r = Math.floor(Math.random() * category[subcategoryStr].length);
				if (DEBUG) console.log("💭 DialogueData.get()", "subcategoryStr="+subcategoryStr +", category[subcategoryStr]="+ JSON.stringify(category[subcategoryStr]));
				return category[subcategoryStr][r];
			}
			// if there is no subcategory, then get by index
			else if (arr[2]) {
				let index = arr[2];
				return category[index];
			}
			// otherwise
			else return false;
		} catch (err) {
			console.error(err);
		}
	}



	return {
		getFact: function(domain, includeSource) {
			return getFact(domain, includeSource);
		},
		get: function(arr) {
			return get(arr);
		},
		dialogue: dialogue,
		facts: facts
	};

})();