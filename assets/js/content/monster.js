"use strict";

var Monster = (function() {

	let status = {};

	function check() {
		// don't check if disabled
		if (tally_options.gameMode === "disabled") return;


		console.log(pageData);
	}



	function update() {
		chrome.runtime.sendMessage({'action':'getMonsterStatus'}, function(response) {
				console.log('>>>>> Monsters.update()',JSON.stringify(response.data));
				status = response.data; // store data
			}
		);
	}


	// PUBLIC
	return {
		update:update,
		check:check
	};
})();
