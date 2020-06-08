"use strict";

var T = (function() {
	// PRIVATE

	// objects created on server, mirrored locally
	let tally_user = {},
		tally_top_monsters = {};
	// objects that only exist locally
	let tally_meta = {},
		tally_options = {},
		tally_nearby_monsters = {},
		tally_stats = {};

	// PUBLIC
	return {

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
