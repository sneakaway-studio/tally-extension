/**
 *	Main file
 */

// console.log("navigator", navigator);
function isServiceWorker(){
	return (typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope);
}

// run this in global scope to determine if script is in window or worker.
if (isServiceWorker) {
	// console.log("service worker");
} else {
	// console.log("web page");
}



self.T = (function() {
	// PRIVATE

	// objects created on server, mirrored locally
	let tally_user = {},
		tally_top_monsters = {};
	// objects that only exist locally
	let tally_meta = {},
		tally_options = {},
		tally_nearby_monsters = {},
		tally_tag_matches = {},
		tally_stats = {};

	// global vars
	let startUpPromisesResolved = false; // has all data loaded from background?

	// environment options for development / production
	let envOptions = {
			development: {
				// api: "http://localhost:5000/api",
				// website: "http://localhost:5000",
				api: "https://127.0.0.1:5000/api",
				website: "https://127.0.0.1:5000",
			},
			production: {
				// api: "https://tallygame.net/api",
				// website: "https://tallygame.net",
				api: "https://tallysavestheinternet.com/api",
				website: "https://tallysavestheinternet.com",
			},
			// true = development, false = production
			localhost: false, // change to false to quickly shift to production server
			debugging: true
		},
		DEBUG = true;


	function updateOptionsFromGameMode(options) {
		try {
			// chill
			if (options.gameMode === "chill") {
				options.showTally = true;
				options.showClickVisuals = true;
				options.playSounds = true;
				options.showNotifications = false;
			}
			// stealth | disabled
			else if (options.gameMode === "stealth" || options.gameMode === "disabled") {
				options.showTally = false;
				options.showClickVisuals = false;
				options.playSounds = false;
				options.showNotifications = false;
			} else {
				// demo | testing | full
				options.showTally = true;
				options.showClickVisuals = true;
				options.playSounds = true;
				options.showNotifications = true;
			}
			return options;
		} catch (err) {
			console.error(err);
		}
	}


	// PUBLIC
	return {

		envOptions: envOptions,
		updateOptionsFromGameMode: updateOptionsFromGameMode,

		set startUpPromisesResolved (value) { startUpPromisesResolved = value; },
		get startUpPromisesResolved () { return startUpPromisesResolved; },

		set tally_user (value) { tally_user = value; },
		get tally_user () { return tally_user; },
		set tally_top_monsters (value) { tally_top_monsters = value; },
		get tally_top_monsters () { return tally_top_monsters; },
		set tally_meta (value) { tally_meta = value; },
		get tally_meta () { return tally_meta; },
		set tally_options (value) { tally_options = value; },
		get tally_options () { return tally_options; },
		set tally_nearby_monsters (value) { tally_nearby_monsters = value; },
		get tally_nearby_monsters () { return tally_nearby_monsters; },
		set tally_tag_matches (value) { tally_tag_matches = value; },
		get tally_tag_matches () { return tally_tag_matches; },
		set tally_stats (value) { tally_stats = value; },
		get tally_stats () { return tally_stats; },

	};
})();
