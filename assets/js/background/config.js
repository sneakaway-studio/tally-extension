"use strict";

var Config = (function() {
	// PRIVATE
	let development = {
			"api": "http://localhost:5000/api",
			"website": "http://localhost:5000",
		},
		production = {
			"api": "https://tallygame.net/api",
			"website": "https://tallygame.net",
		};

	// PUBLIC
	return {
		development: development,
		production: production,
	};
})();
