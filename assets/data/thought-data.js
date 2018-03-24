"use strict";

var ThoughtData = (function() {


	var data = {
		"monster": {
            "far": [{
                "text": "This place makes me nervous.",
                "mood": "cautious"
            }],
			"close": [{
				"text": "There are monsters nearby ...",
				"mood": "cautious"
			}, {
				"text": "I think a product monster is getting closer ...",
				"mood": "cautious"
			}, {
				"text": "I think I saw a product monster ...",
				"mood": "cautious"
			}],
			"launch": [{
				"text": "A product monster!!!",
				"mood": "danger"
			}, {
				"text": "Look out, a {{type}} monster!!!",
				"mood": "danger"
			}, {
				"text": "Look out!!!",
				"mood": "danger"
			}],
			"captured": [{
				"text": "You just captured a product monster!",
				"mood": "award"
			}]
		},
		"page": {
			"title": [{
				"text": "The title of this page is *****",
				"mood": "neutral"
			}]
		},
		"player": {
			"complement": [{
				"text": "Nice clicking!",
				"mood": "happy"
			}]
		},
		"random": {
			"greeting": [{
				"text": "Hello, I missed you.",
				"mood": "sad"
			}, {
				"text": "How are you?",
				"mood": "question"
			}, {
				"text": "Hello world! 😀",
				"mood": "happy"
			}]
		},
		"tracker": {
			"lots": [{
				"text": "There are a lot of trackers on this page.",
				"mood": "cautious"
			}, {
				"text": "Careful, there are trackers nearby.",
				"mood": "cautious"
			}, {
				"text": "Seriously, it's getting kind of creepy around here.",
				"mood": "cautious"
			}],
			"few": [{
				"text": "There are only a few trackers on this page.",
				"mood": "cautious"
			}],
			"none": [{
				"text": "There are no trackers on this page.",
				"mood": "happy"
			}]
		},
		"narrative": {
			"story1": {
				"text": "Finally! I’ve found you, __(insert username/some kind of identity)_______I need your help.",
				"mood": "happy"
			},
			"story2": {
				"text": "My name is Tally.",
				"mood": "neutral"
			},
			"story3": {
				"text": "I’m a daidite. You’ve probably never heard of me and my friends, but we live inside your computer in our world, Daedom.",
				"mood": "neutral"
			},
			"story4": {
				"text": "We live, work, and play inside your computer to keep you connected to [insert #1 used website], your most used website. We process your data by moving and storing it.",
				"mood": "neutral"
			},
			"story5": {
				"text": "But recently, one of the daidites, Vilikon, has been acting strangely…",
				"mood": "cautious"
			},
			"story6": {
				"text": "Vilikon used to work inside your computer like the rest of us, but a few days ago he realized that he could absorb your data for himself. Just over the past few days, Vilikon’s power has already doubled.",
				"mood": "cautious"
			},
			"story7": {
				"text": "Most recently, he created an army of data trackers called Product Monsters.",
				"mood": "danger"
			},
			"story8": {
				"text": "While you’ve been browsing on your computer, Product Monsters have been watching you and taking your information.",
				"mood": "cautious"
			},
			"story9": {
				"text": "This is what they already know about you: [list: browser, operating system, kind of computer, geographical location]",
				"mood": "neutral"
			},
			"story10": {
				"text": "Help me stop Vilikon by taking your data back from him!",
				"mood": "danger"
			},
			"story11": {
				"text": "Luckily you have me! I will stay right here and tell you when Product Monsters are nearby. As a Daidite, I can sense when trackers and other algorithmic influencers are lurking. ",
				"mood": "happy"
			},
			"story12": {
				"text": "In fact, there's one right now!",
				"mood": "cautious"
			},
			"story13": {
				"text": "Quick! Click on the Product Monster to capture it!",
				"mood": "danger"
			},
			"story14": {
				"text": "Good job! You've captured your first product monster. As you use the internet, Product Monsters living on webpages will appear. For example, if you are looking at a dessert recipe, this Cake Product Monster may pop up because of the site's meta tag 'recipe'.",
				"mood": "award"
			},
			"story15": {
				"text": "As you collect new Product Monsters, they will appear here. You can level up each Product Monster in your collection by catching more of the same type! ",
				"mood": "happy"
			},
			"story16": {
				"text": "The more monsters you collect, the more points you gain and the higher your rank will be in the leaderboards.",
				"mood": "happy"
			},
			"story17": {
				"text": "Be careful when trying to capture Product Monsters. If your click misses the product monster, your score will drop.",
				"mood": "cautious"
			},
			"story18": {
				"text": "Try to get to the #1 spot on a leaderboard! I've only heard rumors, but something really cool happens if you get the top spot.",
				"mood": "happy"
			},
			"story19": {
				"text": "*Thunder rumble sound effect*",
				"mood": "specialized sound effect"
			},
			"story20": {
				"text": "Oh no! Vilikon just got even stronger.",
				"mood": "danger"
			},
			"story21": {
				"text": "Before you start your journey to defeat Vilikon, we need to create your secret identity. Let's go to your profile page!",
				"mood": "happy"
			}
		}
	};

	var facts = {
		google: [{
				domain: 'google',
				fact: 'Google parent company Alphabet makes more money from digital ads than any company on the planet.',
				source: 'Recode',
				year: '2017',
				url: 'https://www.recode.net/2017/7/24/16020330/google-digital-mobile-ad-revenue-world-leader-facebook-growth'
			},
			{
				domain: 'google',
				fact: 'Google made $73.8 billion dollars in net digital ad sales in 2017',
				source: 'Recode',
				year: '',
				url: 'https://www.recode.net/2017/7/24/16020330/google-digital-mobile-ad-revenue-world-leader-facebook-growth'
			},
			{
				domain: 'google',
				fact: 'Google captured 33 percent of the world’s $223.7 billion in digital ad revenue in 2017',
				source: 'Recode',
				year: '',
				url: 'https://www.recode.net/2017/7/24/16020330/google-digital-mobile-ad-revenue-world-leader-facebook-growth'
			},
			{
				domain: 'google',
				fact: 'In 2007, Google bought, DoubleClick, an online advertising company, for $3.1 billion dollars.',
				source: 'The New York Times',
				year: '',
				url: 'www.nytimes.com/2007/04/14/technology/14DoubleClick.html'
			},
			{
				domain: 'google',
				fact: 'we perform 40,000 search queries every second on Google. That\'s 3.5 searches per day and 1.2 trillion searches per year.',
				source: 'Forbes',
				year: '2015',
				url: 'https://www.forbes.com/sites/bernardmarr/2015/09/30/big-data-20-mind-boggling-facts-everyone-must-read/#71a41e5e17b1'
			},
			{
				domain: 'google',
				fact: 'ad revenue consitutued 70% of Google\'s revenues in 2017',
				source: 'Statista',
				year: '',
				url: 'https://www.statista.com/statistics/266249/advertising-revenue-of-google/'
			},
			{
				domain: 'google',
				fact: 'Google can track user behavior on 88 percent of all Internet domains.',
				source: 'Washington Post',
				year: '2014',
				url: 'https://www.washingtonpost.com/news/the-intersect/wp/2014/11/19/everything-google-knows-about-you-and-how-it-knows-it/?utm_term=.23ebe43d98dd'
			}
		],
		facebook: [{
			domain: 'facebook',
			fact: 'Facebook made $17.37 billion on ads in 2017, more than 20% of all ad revenue in the United States.',
			source: 'eMarketer',
			year: '',
			url: 'https://www.emarketer.com/Article/Google-Facebook-Tighten-Grip-on-US-Digital-Ad-Market/1016494'
		}],
		trackers: [{
				domain: 'trackers',
				fact: 'Trackers are scripts embedded in websites that collect and store information about you and your behavior',
				source: '',
				year: '',
				url: ''
			},
			{
				domain: 'trackers',
				fact: 'Most trackers belong to companies who want to collect as much data as possible about you.',
				source: '',
				year: '',
				url: ''
			},
			{
				domain: 'trackers',
				fact: 'Trackers are part of a large system wherein your data is harvested in order to influence, not only what you buy, but how you vote, and what you think.',
				source: '',
				year: '',
				url: ''
			},
			{
				domain: 'trackers',
				fact: 'The data that trackers collect can include your age, where you live, what you read, and your interests.',
				source: '',
				year: '',
				url: ''
			},
			{
				domain: 'trackers',
				fact: 'Data that trackers collect is packaged and sold to others, including advertisers, other companies, even governments.',
				source: '',
				year: '',
				url: ''
			},
			{
				domain: 'trackers',
				fact: 'Ad blockers are applications (plugins or browser extensions) that remove or alter advertising content on a webpage',
				source: 'HubSpot',
				year: '',
				url: 'https://blog.hubspot.com/marketing/how-ad-blocking-works'
			},
			{
				domain: 'trackers',
				fact: '41% of people between 18-29 years old say they use ad blocking software.',
				source: 'HubSpot',
				year: '',
				url: 'https://blog.hubspot.com/marketing/how-ad-blocking-works'
			},
			{
				domain: 'trackers',
				fact: 'Apple released an ad-blocker called Crystal for use with iOS9',
				source: 'The Awl',
				year: '2015',
				url: 'https://www.theawl.com/2015/09/welcome-to-the-block-party/'
			},
			{
				domain: 'trackers',
				fact: 'a browser cookie is a small piece of code that lets ad networks and sites share information on what visitors view or buy.',
				source: 'Washington Post',
				year: '',
				url: 'https://www.washingtonpost.com/apps/g/page/business/how-targeted-advertising-works/412/'
			},
			{
				domain: 'trackers',
				fact: 'a \'tracking company\' uses cookies and other tracking technology to collect online data about you.',
				source: 'Wall Street Journal',
				year: '',
				url: 'https://www.wsj.com/articles/SB10001424052748703999304575399492916963232'
			},
			{
				domain: 'trackers',
				fact: 'supercookies are trackers that contain a unique idtentifier, allowing trackers to link existing data to new browsing behavior',
				source: 'Cliqz',
				year: '2018',
				url: 'https://cliqz.com/en/magazine/cookies-fingerprinting-co-tracking-methods-clearly-explained'
			},
			{
				domain: 'trackers',
				fact: 'There are an average of 9 trackers and 33 tracker requests per page',
				source: 'Cliqz',
				year: '2018',
				url: 'https://cliqz.com/en/magazine/whotracks-me-find-out-where-youre-being-tracked-on-the-web'
			},
			{
				domain: 'trackers',
				fact: 'Google tracks 81% of web traffic',
				source: 'WhoTracksMe',
				year: '2018',
				url: 'https://whotracks.me/companies/reach-chart.html'
			},
			{
				domain: 'trackers',
				fact: 'The top three trackers are: 1. Google Analytics 2. Google CDN 3. Google APIs',
				source: 'WhoTracksMe',
				year: '2018',
				url: 'https://whotracks.me/'
			},
			{
				domain: 'trackers',
				fact: '77.4% of all page loads contain trackres',
				source: 'Cliqz and Ghostery',
				year: '2018',
				url: 'https://cliqz.com/en/magazine/ghostery-study-infographic'
			}
		],
		'big data': [{
				domain: 'big data',
				fact: 'Only 20% of Fortune 500 companies tell customers how they use their data AND give those customer\'s control over how much they share.',
				source: 'Harvard Business Review',
				year: '2018',
				url: ' https://hbr.org/2018/02/research-a-strong-privacy-policy-can-save-your-company-millions '
			},
			{
				domain: 'big data',
				fact: 'the European Union\'s General Data Protection Regulation (GDPR) requires businesses to protect the \'personal data and privacy of EU citizens for transactions that occur within the EU.\' ',
				source: 'ipswitch',
				year: '',
				url: 'https://blog.ipswitch.com/data-privacy-vs-data-protection'
			},
			{
				domain: 'big data',
				fact: 'In the US, there is no single, comprehensive federal law regulating the collection and use of personal data',
				source: 'Reuters',
				year: '',
				url: 'https://uk.practicallaw.thomsonreuters.com/6-502-0467?transitionType=Default&contextData=(sc.Default)&firstPage=true&bhcp=1'
			},
			{
				domain: 'big data',
				fact: 'Spotify, Tinder, GrubHub, Pandora, and Lyft reserve the right to share your Non-Personal Information to third parties',
				source: 'Business Insider',
				year: '',
				url: 'http://www.businessinsider.com/spotify-pandora-tinder-apps-sell-anonymized-data-2017-5#seamlessgrubhub-3'
			},
			{
				domain: 'big data',
				fact: '84% of Americans use navigation apps like Google Maps, Waze and Apple Maps',
				source: 'New York Times',
				year: '2018',
				url: 'https://www.nytimes.com/2018/03/06/us/artificial-intelligence-jobs.html?rref=collection%2Fsectioncollection%2Ftechnology'
			},
			{
				domain: 'big data',
				fact: 'Offline Data is information about you that comes from sources other than the Internet. It could include your zip code, estimated household income, the cars you own, or the purchases you\'ve made in a store.',
				source: 'Wall Street Journal',
				year: '',
				url: 'https://www.wsj.com/articles/SB10001424052748703999304575399492916963232'
			},
			{
				domain: 'big data',
				fact: '52% of Americans don\'t know what a Privacy Policy is',
				source: 'Pew',
				year: '2014',
				url: 'http://www.pewresearch.org/fact-tank/2014/12/04/half-of-americans-dont-know-what-a-privacy-policy-is/'
			},
			{
				domain: 'big data',
				fact: 'a privacy policy is a legal document that discloses how customer data is managed and used',
				source: 'Pew',
				year: '2014',
				url: 'http://www.pewresearch.org/fact-tank/2014/12/04/half-of-americans-dont-know-what-a-privacy-policy-is/'
			},
			{
				domain: 'big data',
				fact: 'Google, Facebook, Amazon, Apple, and Microsoft are dominant data harvesters in the business. ',
				source: 'New York Times',
				year: '2018',
				url: 'https://www.nytimes.com/2018/03/06/business/economy/user-data-pay.html?rref=collection%2Fsectioncollection%2Ftechnology&action=click&contentCollection=technology&region=stream&module=stream_unit&version=latest&contentPlacement=19&pgtype=sectionfront'
			},
			{
				domain: 'big data',
				fact: 'The data broker, Axicom, claims to have data on 10% of the world\'s population',
				source: 'Revolvy',
				year: '',
				url: 'https://www.revolvy.com/main/index.php?s=Senate.gov&item_type=topic'
			},
			{
				domain: 'big data',
				fact: 'Facebook owns 7 other companies all of which collect, consolidate, and store data on your liking, buying, and posting habits',
				source: 'DataEthics',
				year: '2015',
				url: 'https://dataethics.eu/en/facebooks-data-collection-sharelab/'
			}
		],
		'information security': [{
				domain: 'information security',
				fact: 'A majority of Americans (64%) have personally experienced a major data breach.',
				source: 'Pew',
				year: '2017',
				url: 'http://www.pewinternet.org/2017/01/26/americans-and-cybersecurity/'
			},
			{
				domain: 'information security',
				fact: 'Nearly two-thirds of Americans have experienced some form of data theft',
				source: 'Pew',
				year: '2017',
				url: 'http://www.pewinternet.org/2017/01/26/americans-and-cybersecurity/'
			}
		],
		advertising: [{
				domain: 'advertising',
				fact: 'An Ad exchange is an auction-based marketplace where advertisers can bid to place ads in the space offered by websites.',
				source: 'Wall Street Journal',
				year: '',
				url: 'https://www.wsj.com/articles/SB10001424052748703999304575399492916963232'
			},
			{
				domain: 'advertising',
				fact: 'a \'Beacon\' is invisible software on many websites that can track web surfers\' location and activities online.',
				source: 'Wall Street Journal',
				year: '',
				url: 'https://www.wsj.com/articles/SB10001424052748703999304575399492916963232'
			},
			{
				domain: 'advertising',
				fact: 'A \'Data Exchange\' is a marketplace where advertisers bid for access to data about customers. Marketers then use this data to target ads.\'',
				source: 'Wall Street Journal',
				year: '',
				url: 'https://www.wsj.com/articles/SB10001424052748703999304575399492916963232'
			},
			{
				domain: 'advertising',
				fact: 'Some great ad-blockers are AdBlock Plus, AdAway, and Brave Browser',
				source: 'Tom\'s Guide',
				year: '',
				url: 'https://www.tomsguide.com/us/pictures-story/565-best-adblockers-privacy-extensions.html#s2'
			}
		],
		'data collection': [{
			domain: 'data collection',
			fact: 'In Estonia, the government must notify its citizens when it looks at, or alters, their data',
			source: 'DataEthics',
			year: '2018',
			url: 'https://dataethics.eu/en/fix-future-according-andrew-keen/'
		}],
		chrome: [{
			domain: 'chrome',
			fact: 'Incognito mode does not mean you browse the web anonymously; it only means that your data is not stored locally. In fact, websites can still collect your data!',
			source: 'Cliqz',
			year: '2018',
			url: 'https://cliqz.com/en/magazine/know-incognito-mode-not-private'
		}]
	};

	return {
		data: data,
		facts: facts
	}

})();
