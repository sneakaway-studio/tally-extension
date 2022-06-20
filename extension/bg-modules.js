/**
 *	Import all bg scripts
 */


const scripts = [
	"assets/js/background/t.js",
	"assets/js/content/debug.js",

	"assets/libs/store2-2.13.1.js",
	"assets/libs/moment-2.29.0.js",

	"assets/data/game-data.js",
	"assets/data/monsters-by-tag.js",
	"assets/data/monsters-by-id.js",
	"assets/data/monster-data.js",
	"assets/data/attacks.js",
	"assets/data/attack-data.js",
	"assets/data/skins.js",
	"assets/data/skin-data.js",

	"assets/js/functions/fs-objects.js",
	"assets/js/functions/fs-dates.js",
	"assets/js/functions/fs-environment.js",
	"assets/js/background/bg-install.js",
	"assets/js/background/bg-server.js",
	"assets/js/background/bg-listener.js",
	"assets/js/background/background.js"
];

try {
	for (let i = 0; i < scripts.length; i++) {
		// console.log(scripts[i]);
		importScripts(scripts[i]);
	}
} catch (error) {
	console.error(error);
}
