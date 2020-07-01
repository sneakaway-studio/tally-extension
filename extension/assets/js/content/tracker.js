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
		};


	/**
	 *	Find trackers hidden on a page
	 */
	function findAll(_domain) {
		try {
			let log = "🕷️ Tracker.findAll()";
			if (DEBUG) console.log(log, "(looking for trackers)");

			let foundArr = {};

			// get all scripts on the page
			let scripts = document.getElementsByTagName("script");
			// loop through each script
			for (let i = 0, l = scripts.length; i < l; i++) {
				if (DEBUG) console.log(log, "[1] _domain =", _domain, ", script =", scripts[i].src);

				// get source and domain of script
				let found = false,
					tracker = {
						url: scripts[i].src || "",
						domain: Environment.extractRootDomain(scripts[i].src) || ""
					};

				// skip if no url or domain or if is whitelisted by user
				if (tracker.url === "" || tracker.domain === "") continue;
				if (GameData.whitelistScriptDomains.includes(tracker.domain)) continue;

				// otherwise check disconnect services
				if (FS_Object.prop(TrackersByUrl.data[tracker.domain])) {
					if (DEBUG) console.log(log + " [2.1] FOUND %c" + tracker.domain, Debug.styles.redbg, "=>", tracker.url);
					// add to arr
					found = true;
					foundArr[tracker.domain] = tracker;
				}
				// if the domain is known for tracking then alternatively add it
				else if (_domain && TrackersByUrl.data[_domain]) {
					if (DEBUG) console.log(log, " [2.2] [DOMAIN] FOUND %c" + tracker.domain, Debug.styles.redbg, "=>", tracker.url);
					found = true;
					foundArr[tracker.domain] = {
						url: _domain,
						domain: _domain
					};
				} else {
					// if (DEBUG) console.log(log, " [2.3] [ANY] FOUND %c" + tracker.domain, Debug.styles.redbg, "=>", tracker.url);
					// // add it anyway
					// foundArr[_domain] = {
					// 	url: _domain,
					// 	domain: _domain
					// };
				}

				// mark the categories
				if (found && FS_Object.prop(TrackersByUrl.data[tracker.domain]) && TrackersByUrl.data[tracker.domain].cats.length) {
					if (DEBUG) console.log(log, "CHECKING CATEGORIES", TrackersByUrl.data[tracker.domain].cats);
					for (let j = 0; j < TrackersByUrl.data[tracker.domain].cats.length; j++) {
						// increment categories
						categories[TrackersByUrl.data[tracker.domain].cats[j]]++;
					}
				}
			}

			if (DEBUG) console.log(log, "foundArr", foundArr);

			// add found arr to Page.data.trackers
			return foundArr;
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
			for (var domain in Page.data.trackers.found) {
				// if (DEBUG) console.log(log, "[2]", Page.data.trackers.found[domain]);

				// if there is a match and it is in the block list ...
				if (T.tally_user.trackers[domain] && T.tally_user.trackers[domain].blocked > 0) {
					if (DEBUG) console.log(log, "[3] ATTEMPT BLOCK", T.tally_user.trackers[domain]);

					// reference to script element
					var x = $("script[src*='" + domain + "']");
					// ... then block it
					if (FS_Object.prop(x[0]) && FS_Object.prop(x[0].src)) {
						if (DEBUG) console.log(log, "[4] BLOCKED!", T.tally_user.trackers[domain], x[0].src);
						x[0].src = domain + "-script-blocked-by-tally!!!";
						blocked[domain] = Page.data.trackers.found[domain];
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
				console.log("🕷️ Tracker.setBadgeText() response =", response);
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
