"use strict";

var T = (function () {
	// PRIVATE

	// objects created on server, mirrored locally
	let tally_user = {},
		tally_top_monsters = {};
	// objects that only exist locally
	let tally_meta = {},
		tally_options = {},
		tally_nearby_monsters = {},
		tally_stats = {};

	// global vars
	let startUpPromisesResolved = false; // has all data loaded from background?

	// options for development / production
	let options = {
			development: {
				// api: "http://localhost:5000/api",
				// website: "http://localhost:5000",
				api: "http://127.0.0.1:5000/api",
				website: "http://127.0.0.1:5000",
			},
			production: {
				// api: "https://tallygame.net/api",
				// website: "https://tallygame.net",
				api: "https://tallysavestheinternet.com/api",
				website: "https://tallysavestheinternet.com",
			},
			// true = development, false = production
			localhost: false, // change to false to quickly shift to production server
			hotreload: false,
			debugging: true
		},
		DEBUG = true;


	// PUBLIC
	return {

		options: options,

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
		set tally_stats (value) { tally_stats = value; },
		get tally_stats () { return tally_stats; },

	};
})();
