"use strict";

window.Page = (function() {
	// PRIVATE
	let DEBUG = Debug.ALL.Page,
		data = getData();


	/*  HTML FUNCTIONS
	 ******************************************************************************/

	function getDescription() {
		try {
			let str = "",
				tags = [
					document.head.querySelector("meta[name='description']"),
					document.head.querySelector("meta[name='Description']"), // uppercase
					document.head.querySelector("meta[property='og:description']"),
					document.head.querySelector("meta[name='twitter:description']"),
				];
			// console.log("getDescription() [1]", tags, str);

			for (let i = 0; i < tags.length; i++) {
				if (tags[i])
					str += tags[i].getAttribute("content") + " ";
			}
			// console.log("getDescription() [2]", tags, str);

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
				document.head.querySelector("meta[name='keywords']") ||
				document.head.querySelector("meta[name='Keywords']"); // uppercase
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
			// if (DEBUG) console.log("🗒 Page.getPageTags()");
			let tags = [],
				str = data.description + " " +
				data.h1 + " " +
				data.keywords + " " +
				data.title;
			tags = FS_String.cleanStringReturnTagArray(str);
			//if (DEBUG) console.log( "tags", JSON.stringify(tags) );
			// delete duplicates
			tags = FS_Object.removeArrayDuplicates(tags);
			tags = FS_String.removeStopWords(null, tags);
			tags = FS_String.removeSmallWords(tags);

console.log( "tags", JSON.stringify(tags) );

			return tags;
		} catch (err) {
			console.error(err);
		}
	}





	/**
	 *	Run getData again with refresh flag
	 */
	async function refreshData() {
		try {
			data = await getData(true);
			return true;
		} catch (err) {
			console.error(err);
		}
	}

	/**
	 *	Get data about this page
	 */
	function getData(refresh = false) {
		try {
			let log = "🗒 Page.getData()";
			if (DEBUG) Debug.dataReportHeader(log, "#", "before");

			var url = document.location.href;
			// only run on web pages
			// if (!url || !url.match(/^http/)) return;
			// object
			let newData = {
				browser: {
					name: "",
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
				host: Environment.extractHostname(document.location.href) || "",
				h1: getH1() || "",
				keywords: getKeywords() || "",
				mode: {},
				mouseX: 0,
				mouseY: 0,
				subDomain: Environment.extractSubDomain(document.location.href) || "",
				tags: [],
				time: 0,
				title: getTitle() || "",
				trackers: {
					blocked: {},
					found: {},
				},
				previousUrl: "",
				url: document.location.href || "",
				// things that might need to change how we start the game on each page
				actions: {
					onDashboard: false,
					onTallyWebsite: false,
					mouseupFired: false, // throttle click listener
					checkForDashboardLoginCalled: false, // in case we are connecting the first time
					checkForAccountResetCalled: false, // in case we are connecting the first time
					resetTallyUserFromServerCalled: 0, // monitor # game resets
					userInteractingWithGame: false, // default false until they hover or click on something
				}
			};
			// add dimensions
			newData.browser.center.x = newData.browser.width / 2;
			newData.browser.center.y = newData.browser.height / 2;
			// check and count page tags
			newData.tags = getPageTags(newData);
			// find trackers
			newData.trackers.found = Tracker.findAll(newData.domain) || "";
			// if youtube
			if (newData.domain == "youtube.com")
				// 	addMutationObserver();
				addTitleChecker();

			// if (DEBUG)
			console.log(log, newData);
			// show in background
			Debug.sendBackgroundDebugMessage(log, newData.url);
			return newData;
		} catch (err) {
			console.error(err);
		}
	}







	// chrome.runtime.connect().onDisconnect.addListener(function() {
	//     // clean up when content script gets disconnected
	// 	console.warn("EXTENSION WAS UPDATED");
	//
	// 	// something went wrong
	// 	// if(chrome.runtime.lastError) console.warn("chrome.runtime.connect().onDisconnect", JSON.stringify(chrome.runtime.lastError));
	// });



	/**
	 *	MutationObserver to detect title element changes (e.g. youtube and other ajax sites)
	 *	NOTE: This slows down the page
	 */
	function addMutationObserver() {
		try {
			// allow offline
			if (Page.data.mode.notActive) return;
			// don't allow if mode disabled
			if (T.tally_options.gameMode === "disabled") return;

			new MutationObserver(function(mutations) {
				if (DEBUG) console.log("title changed", mutations[0].target.nodeValue);
				restartAfterMutation("🗒 Page.addMutationObserver()");
			}).observe(
				document.querySelector('title'), {
					subtree: true,
					characterData: true,
					childList: true
				}
			);
		} catch (err) {
			console.error(err);
		}
	}
	// alternate observer, simply listens for title change
	function addTitleChecker() {
		try {
			let pageTitleInterval = setInterval(function() {
				let title = getTitle();
				if (title != data.title) {
					//if (DEBUG) console.log("title changed", Page.data.title, " to: ",title);
					restartAfterMutation("🗒 Page.addTitleChecker()");
				} else {
					//if (DEBUG) console.log("title is same", Page.data.title, " to: ",title);
				}
			}, 10000);
		} catch (err) {
			console.error(err);
		}
	}


	/**
	 *	Restart app after page mutation
	 */
	function restartAfterMutation(caller) {
		try {
			// allow offline
			if (Page.data.mode.notActive) return;
			// don't allow if mode disabled
			if (T.tally_options.gameMode === "disabled") return;

			if (DEBUG) console.log("🗒 Page.restartAfterMutation() caller = " + caller);

			// refresh Page.data
			Page.refreshData().then(function() {
				// check for monsters again
				MonsterCheck.check();
				Debug.update();
			});

		} catch (err) {
			console.error(err);
		}
	}



	// PUBLIC
	return {
		refreshData: refreshData,
		getData: getData,
		data: data
	};
})();
