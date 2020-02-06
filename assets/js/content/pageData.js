"use strict";

window.PageData = (function() {
	// PRIVATE
	let DEBUG = Debug.ALL.PageData;

	function getDescription() {
		try {
			var str = "";
			var descriptionTag = document.head.querySelector("meta[property='og:description']") ||
				document.head.querySelector("meta[name='description']");
			if (descriptionTag) str = descriptionTag.getAttribute("content");
			return str;
		} catch (err) {
			console.error(err);
		}
	}

	function getH1() {
		try {
			var str = "";
			if ($('h1').length) str = $('h1').text().trim();
			return str;
		} catch (err) {
			console.error(err);
		}
	}

	function getKeywords() {
		try {
			var str = "";
			var keywordsTag = document.head.querySelector("meta[property='og:keywords']") ||
				document.head.querySelector("meta[name='keywords']");
			if (keywordsTag) str = keywordsTag.getAttribute("content");
			return str;
		} catch (err) {
			console.error(err);
		}
	}

	function getTitle() {
		try {
			var str = "";
			var ogTitle = document.querySelector("meta[property='og:title']");
			if (ogTitle) str = ogTitle.getAttribute("content");
			else str = document.title;
			return str;
		} catch (err) {
			console.error(err);
		}
	}

	/**
	 *	Get all "tags" on a page
	 */
	function getPageTags(data) {
		try {
			// create array
			let tags = [],
				str = data.description + " " +
				data.h1 + " " +
				data.keywords + " " +
				data.title;
			tags = cleanStringReturnTagArray(str);
			//console.log( "tags", JSON.stringify(tags) );
			// delete duplicates
			tags = removeDuplicates(tags);
			tags = removeStopWords(null, tags);
			tags = removeSmallWords(tags);
			return tags;
		} catch (err) {
			console.error(err);
		}
	}




	/**
	 *	Get all trackers hidden on this page
	 */
	function getTrackersOnPage(pageData) {
		try {
			if (DEBUG) console.log("🗒️ PageData.getTrackersOnPage()");
			var foundObj = {},
				foundArr = [],
				trackers = {
					// this is only for testing, will be replaced
					'Analytics': ['statcounter.com', '_gaq']
				};
			// get a much larger list
			trackers = disconnectTrackingServices;
			// get scripts on the page
			var scripts = document.getElementsByTagName("script");
			// loop through each script
			for (var i = 0, l = scripts.length; i < l; i++) {
				// get source of script
				let str = "";
				if (scripts[i].src !== "") str = scripts[i].src;
				// not sure why this is here, why would we want textContent of script?
				//else if (scripts[i].textContent) str = scripts[i].textContent;
				// no script here
				else continue;

				// get root domain of scripts
				let scriptDomain = Environment.extractRootDomain(str);
				//console.log(scriptDomain);

				// // this method loops through each tracker category
				// for (var category in trackers) {
				// 	var categoryArr = trackers[category];
				// 	//console.log(catArr);
				// 	if (categoryArr.indexOf(scriptDomain) >= 0){
				// 		if (!prop(foundObj[category]))
				// 			foundObj[category] = [];
				// 		foundObj[category].push(scriptDomain);
				// 	}
				// }

				// this method uses the single array (no categories)
				// I think this may be the way to go in the end
				if (foundArr.indexOf(scriptDomain) < 0 && trackers.indexOf(scriptDomain) >= 0) {
					if (DEBUG) console.log("🗒️ PageData.getTrackersOnPage() 👀", str, scriptDomain);
					foundArr.push(scriptDomain);
				}

			}
			// if the domain is known for tracking then also add it
			if (pageData.domain){
				// console.log("pageData.domain",pageData.domain);
				if (trackers.indexOf(pageData.domain)){
					foundArr.push(pageData.domain);
				}
			}
			// set the number of trackers in the badge
			setBadgeText(foundArr.length);

			//console.log("foundObj",foundObj);
			//console.log("foundArr",foundArr);
			return foundArr;
		} catch (err) {
			console.error(err);
		}
	}


	/**
	 *	Get data about this page
	 */
	function getPageData() {
		try {
			var url = document.location.href;
			// only run on web pages
			if (!url || !url.match(/^http/)) return;
			// object
			var data = {
				activeOnPage: false, // default
				browser: {
					name: Environment.getBrowserName() || "",
					cookieEnabled: navigator.cookieEnabled || "",
					language: Environment.getBrowserLanguage() || "",
					platform: Environment.getPlatform() || "",
					width: window.innerWidth || document.body.clientWidth,
					height: window.innerHeight || document.body.clientHeight,
					center: {
						x: 0,
						y: 0
					},
					fullHeight: document.body.scrollHeight || 0
				},
				screen: {
					width: screen.width || 0,
					height: screen.height || 0
				},
				contentType: window.document.contentType || "",
				description: getDescription() || "",
				domain: Environment.extractRootDomain(document.location.href) || "",
				h1: getH1() || "",
				keywords: getKeywords() || "",
				mouseX: 0,
				mouseY: 0,
				mouseupFired: false,
				subDomain: Environment.extractSubDomain(document.location.href) || "",
				tags: "",
				time: 0,
				title: getTitle() || "",
				trackers: "",
				previousUrl: "",
				url: document.location.href || ""
			};
			// add dimensions
			data.browser.center.x = data.browser.width / 2;
			data.browser.center.y = data.browser.height / 2;
			// check page tags
			data.tags = getPageTags(data);
			// add trackers
			data.trackers = getTrackersOnPage(data) || "";
			// if youtube
			if (data.domain == "youtube.com")
				// 	addMutationObserver();
				addTitleChecker();


			console.log("🗒 PageData.getPageData()",data);
			return data;
		} catch (err) {
			console.error(err);
		}
	}




	/**
	 *	MutationObserver to detect title element changes (e.g. youtube and other ajax sites)
	 *	NOTE: This slows down the page
	 */
	function addMutationObserver() {
		// if running
		if (tally_options.gameMode === "disabled" || !pageData.activeOnPage) return;
		new MutationObserver(function(mutations) {
			console.log("title changed", mutations[0].target.nodeValue);
			TallyMain.refreshApp("pageData.addMutationObserver()");
		}).observe(
			document.querySelector('title'), {
				subtree: true,
				characterData: true,
				childList: true
			}
		);
	}
	// alternate observer, simply listens for title change
	function addTitleChecker() {
		let pageTitleInterval = setInterval(function() {
			let title = getTitle();
			if (title != pageData.title) {
				//console.log("title changed", pageData.title, " to: ",title);
				TallyMain.refreshApp("pageData.addTitleChecker()");
			} else {
				//console.log("title is same", pageData.title, " to: ",title);
			}
		}, 10000);
	}




	// PUBLIC
	return {
		getPageData: getPageData

	};
})();
