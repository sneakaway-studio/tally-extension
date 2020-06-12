"use strict";

window.Tracker = (function() {
	// PRIVATE
	let DEBUG = Debug.ALL.Tracker,
		blockAttempted = false;


	/**
	 *	Find trackers hidden on a page
	 */
	function findAll(_domain) {
		try {
			let log = "🕷️ Tracker.findAll()";
			if (DEBUG) console.log(log, "(looking for trackers)");

			let found = {};

			// get all scripts on the page
			let scripts = document.getElementsByTagName("script");
			// loop through each script
			for (let i = 0, l = scripts.length; i < l; i++) {
				// get source and domain of script
				let tracker = {
					url: scripts[i].src || "",
					domain: Environment.extractRootDomain(scripts[i].src) || ""
				};

				// skip if no url or domain
				if (tracker.url === "" || tracker.domain === "") continue;
				// if is whitelisted by user then skip
				if (GameData.whitelistScriptDomains.includes(tracker.domain)) continue;

				// otherwise check disconnect services
				if (FS_Object.prop(TrackersByUrl.data[tracker.domain])) {
					if (DEBUG) console.log("%c" + tracker.domain, Debug.styles.redbg, "=>", tracker.url);
					found[tracker.domain] = tracker;
				}
				// if the domain is known for tracking then alternatively add it
				else if (_domain && TrackersByUrl.data[_domain]) {
					found[tracker.domain] = {
						url: _domain,
						domain: _domain
					};
				}
			}
			// set the number of trackers in the badge
			TallyStorage.setBadgeText(FS_Object.objLength(found));

			if (DEBUG) console.log(log, "found", found);

			// add found to Page.data.trackers
			return found;
		} catch (err) {
			console.error(err);
		}
	}


	/**
	 *	Remove blocked trackers from the page - called after T.tally_user loads
	 */
	function removeBlocked() {
		try {
			let log = "🕷️ Tracker.removeBlocked()";
			if (DEBUG) console.log(log, "[1] Page.data.trackers =", Page.data.trackers,
				"T.tally_user.trackers =", T.tally_user.trackers);

			let blocked = {};

			// make sure there are trackers to remove
			if (FS_Object.objLength(Page.data.trackers.found) < 1 || FS_Object.objLength(T.tally_user.trackers) < 1) return;

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

	// PUBLIC
	return {
		findAll: findAll,
		removeBlocked: removeBlocked,
		set blockAttempted(value) {
			blockAttempted = value;
		},
		get blockAttempted() {
			return blockAttempted;
		},
	};
}());
