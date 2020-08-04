"use strict";

window.Tracker = (function () {
	// PRIVATE
	let DEBUG = Debug.ALL.Tracker,
		blockAttempted = false,
		// track the categories of trackers
		categories = {
			Advertising: 0,
			Analytics: 0,
			Content: 0,
			Social: 0,
			Disconnect: 0,
			Fingerprinting: 0,
			Cryptomining: 0
		},
		painInTheAssDomains = {
			"amazon.com": "amazon-adsystem.com"
		};


	/**
	 *	Find trackers hidden on a page
	 */
	function findAll(pageDomain) {
		try {
			let log = "🕷️ Tracker.findAll()";
			if (DEBUG) console.log(log, "(looking for trackers)");

			let foundObj = {};

			// get all scripts on the page
			// let scripts = document.getElementsByTagName("script");
			let scripts = $("script,iframe");


			// loop through each script
			for (let i = 0, l = scripts.length; i < l; i++) {

				// get source and domain of script
				let script = {
					url: scripts[i].src || "",
					domain: Environment.extractRootDomain(scripts[i].src) || ""
				};

				// if (DEBUG) console.log(log, "[1] pageDomain =", pageDomain, ", script =", scripts[i]);
				// if (DEBUG) console.log(log, "[2] script =", script);



				if (pageDomain in painInTheAssDomains) {
					if (DEBUG) console.log(log + " [2.0] [CUSTOM] FOUND %c" + painInTheAssDomains[pageDomain], Debug.styles.redbg);
					// $("iframe[src*='amazon-adsystem.com']" );
					foundObj[painInTheAssDomains[pageDomain]] = {
						url: "",
						domain: painInTheAssDomains[pageDomain]
					};
					break;
				} else {

					// skip if no url or domain or if is whitelisted by user
					if (script.url === "" || script.domain === "" ||
						GameData.whitelistScriptDomains.includes(script.domain)) continue;

					if (!FS_Object.prop(TrackersByUrl.data[script.domain])) continue;



					// otherwise check TrackersByUrl
					else if (FS_Object.prop(TrackersByUrl.data[script.domain])) {
						if (DEBUG) console.log(log + " [2.1] [SCRIPT] FOUND %c" + script.domain, Debug.styles.redbg, "=>", script.url);
						// add to arr
						foundObj[script.domain] = script;
					}
					// if the domain is known for tracking then alternatively add it
					else if (pageDomain && TrackersByUrl.data[pageDomain]) {
						if (DEBUG) console.log(log, " [2.2] [DOMAIN] FOUND %c" + script.domain, Debug.styles.redbg, "=>", script.url);
						foundObj[script.domain] = {
							url: pageDomain,
							domain: pageDomain
						};
					}

				}
			}


			// if trackers found, add the categories
			if (FS_Object.objLength(foundObj) > 0) {
				// for each tracker
				for (let trackerUrl in foundObj) {
					let cats = TrackersByUrl.data[trackerUrl].cats;
					// if (DEBUG) console.log(log, "CHECKING CATEGORIES [1]",
					// 	"trackerUrl =", trackerUrl,
					// 	"TrackersByUrl.data[trackerUrl] =", TrackersByUrl.data[trackerUrl],
					// 	"TrackersByUrl.data[trackerUrl].cats =", TrackersByUrl.data[trackerUrl].cats,
					// 	"cats =", cats
					// );
					// increment each catogory
					for (let j = 0; j < cats.length; j++) {
						// if (DEBUG) console.log(log, "CHECKING CATEGORIES [2]", "cats[j] =", cats[j]);
						// account for all types of fingerprinting
						if (cats[j].match("Fingerprinting")) {
							categories.Fingerprinting++;
						} else {
							// all others
							categories[cats[j]]++;
						}
					}
				}
			}


			if (DEBUG) console.log(log, "foundObj =", foundObj);
			if (DEBUG) console.log(log, "categories =", categories);

			// add found arr to Page.data.trackers
			return foundObj;
		} catch (err) {
			console.error(err);
		}
	}


	/**
	 *	Remove blocked trackers from the page - called after T.tally_user loads
	 */
	function removeBlocked() {
		try {
			// allow offline
			if (Page.data.mode.notActive) return;
			// don't allow if mode disabled
			if (T.tally_options.gameMode === "disabled") return;


			// mark progress
			if (categories.Fingerprinting > 0) {
				Progress.update("trackersSeenFingerprinting", categories.Fingerprinting, "+");
			}


			let log = "🕷️ Tracker.removeBlocked()";
			if (DEBUG) console.log(log, "[1] Page.data.trackers =", Page.data.trackers,
				"T.tally_user.trackers =", T.tally_user.trackers);

			let blocked = {};

			// make sure there are trackers to remove
			if (!T.tally_user.trackers || FS_Object.objLength(Page.data.trackers.found) < 1 || FS_Object.objLength(T.tally_user.trackers) < 1) return;

			// loop through each found tracker
			for (var trackerUrl in Page.data.trackers.found) {
				if (DEBUG) console.log(log, "[2]",
					"trackerUrl =", trackerUrl
				);

				if (trackerUrl == "1st-party-tracker") continue; // first party trackers can't be blocked

				// if there is a match and it is in the block list ...
				if (FS_Object.prop(T.tally_user.trackers[trackerUrl]) && T.tally_user.trackers[trackerUrl].blocked > 0) {
					if (DEBUG) console.log(log, "[3] ATTEMPT BLOCK",
						"T.tally_user.trackers[trackerUrl] =", T.tally_user.trackers[trackerUrl],
						"T.tally_user.trackers[trackerUrl].blocked =", T.tally_user.trackers[trackerUrl].blocked
					);

					// reference to script element
					var ele = $("script[src*='" + trackerUrl + "']");
					if (DEBUG) console.log(log, "[4] ele =", ele);
					// ... then block it
					if (FS_Object.prop(ele[0]) && FS_Object.prop(ele[0].src)) {
						if (DEBUG) console.log(log, "[5] BLOCKED!", T.tally_user.trackers[trackerUrl], ele[0].src);
						ele[0].src = trackerUrl + "-script-blocked-by-tally!!!";
						blocked[trackerUrl] = Page.data.trackers.found[trackerUrl];
					} else if (Page.data.domain in painInTheAssDomains) {
						// amazon
						if (Page.data.domain === "amazon.com") {
							blocked[trackerUrl] = Page.data.trackers.found[trackerUrl];
							removeTrackerMutations("#sis_pixel_r2");
						}

					}
				}
			}
			// add blocked to Page.data.trackers
			Page.data.trackers.blocked = blocked;
			// remember the attempt
			blockAttempted = true;
			// update progress
			updateProgress();

		} catch (err) {
			console.error(err);
		}
	}





	let observer,
		observerConfig = {
			subtree: true,
			attributes: true,
			childList: true,
			characterData: true
		};
	/**
	 *	MutationObserver to detect tracker additions
	 */
	function removeTrackerMutations(eleStr) {
		try {
			// create mutation observer
			observer = new MutationObserver(function (mutations) {
				$(mutations).each(function (index, mutation) {
					if (DEBUG) console.log("🕷️ Tracker.removeTrackerMutations()", index, mutation, mutation.target);
					// remove the node
					mutation.target.parentNode.removeChild(mutation.target);
				});
			}).observe(
				document.querySelector(eleStr), observerConfig
			);
		} catch (err) {
			console.error(err);
		}
	}





	/**
	 *	Update progress on trackers
	 */
	function updateProgress() {
		try {
			// update progress
			Progress.update("trackersSeen", FS_Object.objLength(Page.data.trackers.found), "+");
			Progress.update("trackersBlocked", FS_Object.objLength(Page.data.trackers.blocked), "+");
			// are there more on this page than previously seen on one page?
			if (FS_Object.objLength(Page.data.trackers.found) > Progress.get("trackersSeenMostOnePage"))
				Progress.update("trackersSeenMostOnePage", FS_Object.objLength(Page.data.trackers.found));
		} catch (err) {
			console.error(err);
		}
	}

	/**
	 *	Show # trackers in badge
	 */
	function setBadgeText(data) {
		try {
			// icons are too small and covers Tally icon in Opera
			if (Page.data.browser.name === "Opera") return;
			chrome.runtime.sendMessage({
				'action': 'setBadgeText',
				'data': data
			}, function (response) {
				if (DEBUG) console.log("🕷️ Tracker.setBadgeText() response =", response);
			});
		} catch (err) {
			console.error(err);
		}
	}



	// PUBLIC
	return {
		findAll: findAll,
		removeBlocked: removeBlocked,
		setBadgeText: setBadgeText,
		set blockAttempted(value) {
			blockAttempted = value;
		},
		get blockAttempted() {
			return blockAttempted;
		},
	};
}());
