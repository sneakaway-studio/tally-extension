"use strict";

window.Page = (function() {
	// PRIVATE

	let DEBUG = true;

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
	function getTrackersOnPage() {
		try {
			var foundObj = {},
				foundArr = [],
				// testing
				trackers = {
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
					//console.log("👀 👀 getTrackersOnPage()", str, scriptDomain);
					foundArr.push(scriptDomain);
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
					name: Environment.getBrowserName(),
					cookieEnabled: navigator.cookieEnabled || "",
					language: Environment.getBrowserLanguage(),
					platform: Environment.getPlatform(),
					width: window.innerWidth || document.body.clientWidth,
					height: window.innerHeight || document.body.clientHeight,
					center: {
						x: 0,
						y: 0
					},
					fullHeight: document.body.scrollHeight
				},
				screen: {
					width: screen.width,
					height: screen.height
				},
				contentType: window.document.contentType,
				description: getDescription(),
				domain: Environment.extractRootDomain(document.location.href),
				h1: getH1(),
				keywords: getKeywords(),
				mouseX: 0,
				mouseY: 0,
				mouseupFired: false,
				subDomain: Environment.extractSubDomain(document.location.href),
				tags: "",
				time: 0,
				title: getTitle(),
				trackers: getTrackersOnPage(),
				previousUrl: "",
				url: document.location.href
			};
			data.browser.center.x = data.browser.width / 2;
			data.browser.center.y = data.browser.height / 2;
			// check page tags
			data.tags = getPageTags(data);
			//console.log("pageData",data);
			// add it to the update for this page
			storePageDataInBackgroundUpdate(data);
			return data;
		} catch (err) {
			console.error(err);
		}
	}


	function storePageDataInBackgroundUpdate(data) {
		TallyStorage.backgroundUpdate.pageData = {
			"description": data.description,
			"domain": data.domain,
			"keywords": data.keywords,
			"tags": data.tags,
			"time": data.time,
			"title": data.title,
			"url": data.url
		}
	}


	/**
	 *	If on dashboard page then check for flags
	 */
	function checkForFlags() {
		try {
			//console.log("🗒️ Page.checkForFlags()", pageData.url, tally_meta.website + "/dashboard");

			let tokenOnPage = false,
				tokenData = {};

			// if user is on dashboard then check for flags or new token
			if (pageData.url === tally_meta.website + "/dashboard") {

				// if there is a token
				if ($("#token").length) {
					if (DEBUG) console.log("🗒️ Page.checkForFlags() TOKEN! 🔑", pageData.url, tally_meta.website + "/dashboard");
					// grab new token
					tokenData = {
						token: $("#token").val(),
						tokenExpires: $("#tokenExpires").val()
					};
					// for flag checking
					tokenOnPage = true;
					//console.log("🗒️ Page.checkForFlags() tokenData = " + tokenData);
					TallyStorage.saveToken(tokenData);


					console.log("🗒️ Page.checkForFlags() SYNC WITH SERVER");


// // create backgroundUpdate object
// var backgroundUpdate = TallyStorage.newBackgroundUpdate();
// // then push to the server
// sendBackgroundUpdate(backgroundUpdate);

// get new stuff
//		TallyMain.startGameOnPage();

				}

				// if there are flags
				if ($("#tallyFlags").length) {
					if (DEBUG) console.log("🗒️ Page.checkForFlags() FLAGS! 🚩", $("#tallyFlags").html(), pageData.url, tally_meta.website);

					let flags = JSON.parse($("#tallyFlags").html().trim());

					for (let i = 0; i < flags.length; i++) {
						console.log("🚩 Page.checkForFlags() FLAG = " + JSON.stringify(flags[i]));

						// if resetUser
						if (flags[i].name == "resetUser") {
							// tell user
							Dialogue.showStr("You have reset your account. One moment while the game resets...", "neutral");
							// reset game
							TallyStorage.resetUser(tokenOnPage, tokenData);
						}
					}

				}


			}
		} catch (err) {
			console.error(err);
		}
	}


	// PUBLIC
	return {
		getPageData: getPageData,
		checkForFlags: checkForFlags

	};
})();
