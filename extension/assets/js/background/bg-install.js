"use strict";

window.Install = (function () {
	// PRIVATE

	let DEBUG = Debug.ALL.BackgroundInstall;

	/**
	 *  Create all objects for game from scratch
	 */
	async function init() {
		try {
			let cleanInstall = true;

			// does T.tally_meta exists, or is this the first install?
			if (store.has("tally_meta")) {
				if (DEBUG) console.log("🔧 Install.init() -> T.tally_meta exists, need to check account");
				cleanInstall = false;
				// update all game objects
				T.tally_user = store("tally_user");
				T.tally_options = store("tally_options");
				T.tally_nearby_monsters = store("tally_nearby_monsters");
				T.tally_tag_matches = store("tally_tag_matches");
				T.tally_meta = store("tally_meta");
				T.tally_stats = store("tally_stats");
				T.tally_top_monsters = store("tally_top_monsters");
			} else {
				if (DEBUG) console.log("🔧 Install.init() -> no T.tally_meta found, creating app");
				// Create all game objects
				store("tally_user", createUser());
				store("tally_options", createOptions());
				store("tally_nearby_monsters", {});
				store("tally_tag_matches", {});
				store("tally_meta", createMeta());
				store("tally_stats", {});
				store("tally_top_monsters", {});

				// get user's geolocation
				await saveLocation();

				cleanInstall = true;
			}
			if (DEBUG) console.log("🔧 Install.init() -> game installed! cleanInstall =", cleanInstall);
			return cleanInstall;
		} catch (err) {
			console.error("failed to create user", err);
		}
	}



	/**
	 * 	Check if it is a new version
	 */
	async function setVersion() {
		try {
			T.tally_meta = store("tally_meta");
			let manifestData = chrome.runtime.getManifest();

			// if version the same
			if (T.tally_meta.install.version == manifestData.version) {
				if (DEBUG) console.log("🔧 Install.setVersion()", T.tally_meta.install.version + "==" + manifestData.version, "..... SAME VERSION");
			}

			// SPECIFIC CHECKS, WHAT IS NEW IN VERSION ...

			// ADDED 0.4.3
			if (!store("tally_tag_matches")) store("tally_tag_matches", {});


			// IF INSTALLING 0.4.3
			if (manifestData.version === "0.4.3") {
				// changes in tally_meta structure
				store("tally_meta", createMeta());
				// update user's geolocation
				await saveLocation();
			}
			// IF INSTALLING ANY OTHER VERSION
			else {
				if (DEBUG) console.log("🔧 Install.setVersion()", T.tally_meta.install.version + "!=" + manifestData.version, "!!!!! NEW VERSION");
				// update meta with version number
				T.tally_meta.install.version = manifestData.version;
				store("tally_meta", T.tally_meta);
			}


			return true;
		} catch (err) {
			console.error(err);
		}
	}


	/**
	 *  Set development or production server
	 */
	async function setCurrentAPI() {
		try {
			T.tally_meta = store("tally_meta");
			// if (DEBUG) console.log("🔧 Install.setCurrentAPI() [1] currentAPI=%c" + T.tally_meta.currentAPI, Debug.styles.greenbg);

			// if T.options.localhost == true
			if (T.options.localhost)
				T.tally_meta.currentAPI = "development";
			else
				T.tally_meta.currentAPI = "production";
			// if (DEBUG) console.log("🔧 Install.setCurrentAPI() [2] currentAPI=%c" + T.tally_meta.currentAPI, Debug.styles.greenbg);

			T.tally_meta.api = T.options[T.tally_meta.currentAPI].api;
			T.tally_meta.website = T.options[T.tally_meta.currentAPI].website;

			if (DEBUG) console.log("🔧 Install.setCurrentAPI() [3] currentAPI=%c" + T.tally_meta.currentAPI, Debug.styles.greenbg,
				"api=" + T.tally_meta.api, "website=" + T.tally_meta.website);

			store("tally_meta", T.tally_meta);
			return true;
		} catch (err) {
			console.error(err);
		}
	}




	/**
	 *  Launch Start Screen - call if getTallyUser fails
	 */
	async function launchStartScreen() {
		try {
			// console.trace();
			T.tally_meta = await store("tally_meta");
			let	pageToShow = "/get-anonyname";

			// don't launch in development
			if (T.options.localhost) return;

			// don't launch if !server
			if (!T.tally_meta.serverOnline) {
				if (DEBUG) console.log("🔧 Install.launchStartScreen() 🛑 SERVER OFFLINE");
				return;
			}

			// if they are logged in show how to play
			if (T.tally_meta.userLoggedIn) {
				// return console.log("🔧 Install.launchStartScreen() 🛑 ALREADY LOGGED IN");
				if (DEBUG) console.log("🔧 Install.launchStartScreen() 🛑 ALREADY LOGGED IN");
				// show how to
				pageToShow = "/how-to-play";
			}

			// get current page
			chrome.tabs.query({
				active: true,
				currentWindow: true
			}, function (tabs) {
				var tab = tabs[0];
				// if (DEBUG) console.log("🔧 Install.launchStartScreen() current tab =", tab);

				// are we in the process resetting user's data?
				if (tab.url !== undefined && (tab.url.includes("/dashboard") ||
						tab.url.includes("tallygame.net") || tab.url.includes("tallygame.net") ||
						tab.url.includes(T.tally_meta.website)
					)) {
					if (DEBUG) console.log("🔧 Install.launchStartScreen() 🛑 ON DASHBOARD");
					return;
				}

				// keep track of prompts and don't do too many
				if (T.tally_meta.install.prompts >= 30) {
					if (DEBUG) console.log("🔧 Install.launchStartScreen() 🛑 T.tally_meta.install.prompts >=",
						T.tally_meta.install.prompts
					);
					return;
				}

				// else launch install page
				chrome.tabs.create({
					url: T.tally_meta.website + pageToShow
				}, function (newTab) {
					// increment
					T.tally_meta.install.prompts = T.tally_meta.install.prompts + 1;
					store("tally_meta", T.tally_meta);
					if (DEBUG) console.log("🔧 Install.launchStartScreen() 👍 launching",
						"T.tally_meta.install.prompts =", T.tally_meta.install.prompts,
						"newTab =", newTab
					);
					return true;
				});
			});
		} catch (err) {
			console.error(err);
		}
	}



	/*  INIT FUNCTIONS
	 ******************************************************************************/

	/**
	 *  Create user
	 */
	function createUser() {
		try {
			var obj = {
				achievements: {},
				admin: 0,
				attacks: {},
				badges: {},
				consumables: {},
				flags: {},
				confirmFlags: {},
				lastActive: moment().format(),
				level: 1,
				monsters: {},
				progress: {},
				score: {
					clicks: 0,
					domains: 0,
					likes: 0,
					pages: 0,
					score: 0,
					time: 0,
				},
				skins: ["magenta"],
				timezone: "",
				trackers: {},
				username: "",
			};
			return obj;
		} catch (err) {
			console.error(err);
		}
	}

	function createOptions() {
		try {
			var obj = {
				showTally: true,
				showClickVisuals: true,
				playSounds: true,
				soundVolume: 0.2,
				showNotifications: true,
				gameMode: "full", // demo | testing | full | chill | stealth | disabled
				disabledDomains: [
					"drive.google.com",
					"docs.google.com",
					"gmail.com",
					"mail.google.com",
					"moodle.davidson.edu",
				],
				showDebugger: false,
				debuggerPosition: [0, 300]
			};
			// save options based on gameMode
			obj = T.updateOptionsFromGameMode(obj);
			return obj;
		} catch (err) {
			console.error(err);
		}
	}


	/**
	 *  Create Meta object on installation
	 */
	function createMeta() {
		try {
			var manifestData = chrome.runtime.getManifest();
			var obj = {
				install: {
					date: moment().format(),
					prompts: 0, // number prompts given to user
					version: manifestData.version, // set in manifest
				},
				serverOnline: false,
				serverTimeOfLastCheckMillis: -1,
				serverTimeSinceLastCheck: -1,
				serverResponseMillis: -1,
				userLoggedIn: false,
				userOnline: navigator.onLine,

				currentAPI: "production", // default to production on new installation
				api: T.options.production.api,
				website: T.options.production.website,
				browser: Environment.getBrowserName(),
				location: {}
			};

			return obj;
		} catch (err) {
			console.error(err);
		}
	}


	/**
	 *  Get location
	 */
	async function saveLocation() {
		try {
			T.tally_meta = store("tally_meta");
			return $.getJSON('http://www.geoplugin.net/json.gp', function (data) {
				// if (DEBUG) console.log(JSON.stringify(data, null, 2));
				T.tally_meta.location = {
					ip: data.geoplugin_request,
					city: data.geoplugin_city,
					region: data.geoplugin_region,
					country: data.geoplugin_countryName,
					continent: data.geoplugin_continentName,
					lat: data.geoplugin_latitude,
					lng: data.geoplugin_longitude,
					timezone: data.geoplugin_timezone
				};
				store("tally_meta", T.tally_meta);
			});
		} catch (err) {
			console.error(err);
		}
	}


	// PUBLIC
	return {
		init: init,
		setVersion: setVersion,
		setCurrentAPI: setCurrentAPI,
		createOptions: createOptions,
		saveLocation: saveLocation,
		launchStartScreen: launchStartScreen
	};
}());
