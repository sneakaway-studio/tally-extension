"use strict";

window.Tracker = (function() {
	// PRIVATE
	let DEBUG = Debug.ALL.Tracker,
		trackerOnPage = false;




	/**
	 *	Get all trackers hidden on a page, block
	 */
	function blockOnPage(domain) {
		try {
			if (DEBUG) console.log("🕷️ Tracker.blockOnPage() [0]");
			let foundObj = {},
				foundArr = [];

			// get all scripts on the page
			let scripts = document.getElementsByTagName("script");
			// loop through each script
			for (let i = 0, l = scripts.length; i < l; i++) {

				// get source and domain of script
				let scriptSrc = scripts[i].src || "",
					scriptDomain = Environment.extractRootDomain(scriptSrc) || "";

				// if no scriptSrc or scriptDomain is whitelisted then skip
				if (scripts[i].src !== "" || GameData.whitelistScriptDomains.indexOf(scriptDomain)) {
					// skip
					// continue;
				}
				if (DEBUG) console.log("🕷️ Tracker.blockOnPage() [1]",
					"scriptSrc =", scripts[i].src,
					"scriptDomain =", scriptDomain
				);


				// otherwise check disconnect services
				 if (foundArr.indexOf(scriptDomain) < 0 && TrackersByUrl.data[scriptDomain] >= 0) {
					if (DEBUG) console.log("🕷️ Tracker.blockOnPage() [2] 👀", scriptSrc, scriptDomain);
					foundArr.push(scriptDomain);
				}

			}
			// // if the domain is known for tracking then also add it
			// if (domain) {
			// 	// console.log("domain =",domain);
			// 	if (TrackersByUrl.data[domain]) {
			// 		foundArr.push(domain);
			// 	}
			// }

			// set the number of trackers in the badge
			TallyStorage.setBadgeText(foundArr.length);

			//console.log("foundObj",foundObj);
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

		} catch (err) {
			console.error(err);
		}
	}



	/**
	 *	Remove trackers that have been "caught"
	 */
	function removeCaughtTrackers() {
		try {
			return;
			if (!tally_user.trackers || Page.data.trackers.length < 1) return;

			if (DEBUG) console.log("🕷️ Tracker.removeCaughtTrackers() [1]", tally_user.trackers, Page.data.trackers);

			// loop through trackers on page and check if each is in block list
			for (let i = 0, l = Page.data.trackers.length; i < l; i++) {
				// if there is a match then block it
				if (tally_user.trackers[Page.data.trackers[i]] && tally_user.trackers[Page.data.trackers[i]].blocked) {

					if (DEBUG) console.log("🕷️ Tracker.removeCaughtTrackers() [2] ATTEMPT BLOCK", tally_user.trackers[i]);

					// reference to script element
					var x = $("script[src*='" + Page.data.trackers[i] + "']");

					// block it
					if (FS_Object.prop(x[0]) && FS_Object.prop(x[0].src)) {
						x[0].src = Page.data.trackers[i] + "-script-blocked-by-tally!!!";
						if (DEBUG) console.log("🕷️ Tracker.removeCaughtTrackers() [3] BLOCKED!", Page.data.trackers[i], x[0].src);
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
		blockOnPage: blockOnPage,
		removeCaughtTrackers: removeCaughtTrackers,
		addToRemoveList: addToRemoveList,
		onPage: onPage
	};
}());
