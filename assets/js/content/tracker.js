"use strict";

window.Tracker = (function() {
	// PRIVATE
	let DEBUG = Debug.ALL.Tracker,
		trackerOnPage = false;



	/**
	 *	Count trackers hidden on a page, then block if user has caught that monster
	 */
	function countAndBlock(_domain) {
		try {
			let log = "🕷️ Tracker.countAndBlock()";

			if (DEBUG) Debug.dataReportHeader(log, "#", "before");

			let foundArr = [];

			// get all scripts on the page
			let scripts = document.getElementsByTagName("script");
			// loop through each script
			for (let i = 0, l = scripts.length; i < l; i++) {

				// get source and domain of script
				let scriptSrc = scripts[i].src || "",
					scriptDomain = Environment.extractRootDomain(scriptSrc) || "";

				// skip if no scriptSrc or scriptDomain
				if (scriptSrc === "" || scriptDomain === "") continue;
				// if is whitelisted by user then skip
				if (GameData.whitelistScriptDomains.includes(scriptDomain)) continue;

				// otherwise check disconnect services
				if (FS_Object.prop(TrackersByUrl.data[scriptDomain])) {
					if (DEBUG) console.log(log, "[1]", "scriptDomain =", scriptDomain + ", scriptSrc =", scriptSrc);
					foundArr.push(scriptDomain);
				}

				// if the domain is known for tracking then also add it
				if (_domain && TrackersByUrl.data[_domain]) {
					foundArr.push(_domain);
				}
			}

			// set the number of trackers in the badge
			TallyStorage.setBadgeText(foundArr.length);

			// update after load
			setTimeout(function() {
				// update progress
				Progress.update("trackersSeen", foundArr.length, "+");
				// are there more on this page than previously seen on one page?
				if (foundArr.length > Progress.get("trackersSeenMostOnePage"))
					Progress.update("trackersSeenMostOnePage", foundArr.length);
			}, 1000);

			//console.log("foundArr",foundArr);
			return foundArr;
		} catch (err) {
			console.error(err);
		}
	}


	/**
	 *	Remove a tracker from the page
	 */
	function removeTracker() {
		try {
			// make sure there are trackers to remove
			if (!T.tally_user.trackers || Page.data.trackers.length < 1) return;

			if (DEBUG) console.log("🕷️ Tracker.removeTracker() [1]", T.tally_user.trackers, Page.data.trackers);

			// loop through trackers on page and check if each is in block list
			for (let i = 0, l = Page.data.trackers.length; i < l; i++) {
				// if there is a match then block it
				if (T.tally_user.trackers[Page.data.trackers[i]] && T.tally_user.trackers[Page.data.trackers[i]].blocked) {

					if (DEBUG) console.log("🕷️ Tracker.removeTracker() [2] ATTEMPT BLOCK", T.tally_user.trackers[i]);

					// reference to script element
					var x = $("script[src*='" + Page.data.trackers[i] + "']");

					// block it
					if (FS_Object.prop(x[0]) && FS_Object.prop(x[0].src)) {
						x[0].src = Page.data.trackers[i] + "-script-blocked-by-tally!!!";
						if (DEBUG) console.log("🕷️ Tracker.removeTracker() [3] BLOCKED!", Page.data.trackers[i], x[0].src);
					}
				}
			}
		} catch (err) {
			console.error(err);
		}
	}
	/**
	 *	Add a tracker to remove list
	 */
	function addToRemoveList(tracker) {
		try {

		} catch (err) {
			console.error(err);
		}
	}
	/**
	 *	Is there a tracker on this page?
	 */
	function onPage() {
		try {
			return trackerOnPage;
		} catch (err) {
			console.error(err);
		}
	}


	// PUBLIC
	return {
		countAndBlock: countAndBlock,
		removeTracker: removeTracker,
		addToRemoveList: addToRemoveList,
		onPage: onPage
	};
}());
