"use strict";

window.Install = (function() {
	// PRIVATE

	let DEBUG = Debug.ALL.BackgroundInstall;

	/**
	 *  Get or create all data for game objects in T.*
	 */
	async function init() {
		try {
			let firstTimeInstallation = false;

			// 1. if no T.tally_meta exists, this is a first install
			//
			if (!store.has("tally_meta")) {
				if (DEBUG) console.log("🔧 Install.init() -> no T.tally_meta found, creating app");
				// mark that this is the first time installation
				firstTimeInstallation = true;
			}

			// 2. update all game objects from storage || or create defaults

			T.tally_user = store("tally_user") || createUser();
			T.tally_meta = store("tally_meta") || createMeta();
			T.tally_options = store("tally_options") || createOptions();
			T.tally_nearby_monsters = store("tally_nearby_monsters") || {};
			T.tally_stats = store("tally_stats") || {};
			T.tally_tag_matches = store("tally_tag_matches") || {};
			T.tally_top_monsters = store("tally_top_monsters") || {};

			// 3. update version & environment

			// get current version
			let currentVersion = T.tally_meta.install.version || "0";
			// check for new version
			let newVersionInstalled = isNewVersion(currentVersion);
			// always update/reset meta
			T.tally_meta = createMeta();
			// get user's geolocation for tutorials
			if (firstTimeInstallation || newVersionInstalled) {
				T.tally_meta.location = await getLocation();
			}

			// 4. update all copies in storage

			store("tally_user", T.tally_user);
			store("tally_meta", T.tally_meta);
			store("tally_options", T.tally_options);
			store("tally_nearby_monsters", T.tally_nearby_monsters);
			store("tally_stats", T.tally_stats);
			store("tally_tag_matches", T.tally_tag_matches);
			store("tally_top_monsters", T.tally_top_monsters);

			if (DEBUG) console.log("🔧 Install.init() -> game installed! firstTimeInstallation =", firstTimeInstallation);

			return firstTimeInstallation;
		} catch (err) {
			console.error("failed to create user", err);
		}
	}



	/**
	 * 	Check if it is a new version
	 */
	function isNewVersion(currentVersion) {
		try {
			let manifestData = chrome.runtime.getManifest(),
				status = false;

			// if version the same
			if (currentVersion === manifestData.version) {
				if (DEBUG) console.log("🔧 Install.checkUpdateVersion()", currentVersion + "===" + manifestData.version, "..... SAME VERSION");
				status = false;
			}
			// if version is not the same
			else {
				if (DEBUG) console.log("🔧 Install.checkUpdateVersion()", currentVersion + "!==" + manifestData.version, "!!!!! NEW VERSION");
				// let calling function know
				status = true;
			}

			// SPECIFIC CHECKS, WHAT IS NEW IN VERSION ...

			// if (manifestData.version === "0.4.3") {
			// all changes to meta are now handled in init()
			// }

			return status;
		} catch (err) {
			console.error(err);
		}
	}


	/**
	 *  Set development or production server
	 */
	async function setEnvironment() {
		try {
			// T.tally_meta = store("tally_meta");
			// if (DEBUG) console.log("🔧 Install.setEnvironment() [1] currentAPI=%c" + T.tally_meta.env.currentAPI, Debug.styles.greenbg);

			// if T.envOptions.localhost == true
			if (T.envOptions.localhost)
				T.tally_meta.env.currentAPI = "development";
			else
				T.tally_meta.env.currentAPI = "production";
			// if (DEBUG) console.log("🔧 Install.setEnvironment() [2] currentAPI=%c" + T.tally_meta.env.currentAPI, Debug.styles.greenbg);

			T.tally_meta.env.api = T.envOptions[T.tally_meta.env.currentAPI].api;
			T.tally_meta.env.website = T.envOptions[T.tally_meta.env.currentAPI].website;

			if (DEBUG) console.log("🔧 Install.setEnvironment() [3] currentAPI=%c" + T.tally_meta.env.currentAPI, Debug.styles.greenbg,
				"api=" + T.tally_meta.env.api, "website=" + T.tally_meta.env.website);

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
			let pageToShow = "/get-anonyname";

			// don't launch in development
			if (T.envOptions.localhost) return;

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
			}, function(tabs) {
				var tab = tabs[0];
				// if (DEBUG) console.log("🔧 Install.launchStartScreen() current tab =", tab);

				// are we in the process resetting user's data?
				if (tab.url !== undefined && (tab.url.includes("/dashboard") ||
						tab.url.includes("tallygame.net") || tab.url.includes("tallygame.net") ||
						tab.url.includes(T.tally_meta.env.website)
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
					url: T.tally_meta.env.website + pageToShow
				}, function(newTab) {
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
			return {
				// environment
				env: {
					api: T.envOptions.production.api,
					browser: Environment.getBrowserName(),
					currentAPI: "production", // default to production on new installation
					website: T.envOptions.production.website
				},
				install: {
					date: moment().format(),
					prompts: 0, // number prompts given to user
					version: manifestData.version, // set in manifest
				},
				location: {},
				// server
				serverOnline: false,
				serverOnlineFailedAttempts: 0, // number times serverOnline failed
				serverResponseMillis: -1,
				serverSecondsSinceLastChecked: 0,
				serverTimestampFromLastCheck: -1,
				// user
				userLoggedIn: false,
				userLoggedInFailedAttempts: 0, // number times userLoggedIn (i.e. backgroundUpdate) failed
				userOnline: navigator.onLine,
				userOnlineFailedAttempts: 0, // number times userOnline failed
			};
		} catch (err) {
			console.error(err);
		}
	}


	/**
	 *  Get location
	 */
	async function getLocation() {
		try {
			return $.getJSON('http://www.geoplugin.net/json.gp', function(data) {
				if (DEBUG) console.log("Install.getLocation()", JSON.stringify(data, null, 2));
				return {
					ip: data.geoplugin_request,
					city: data.geoplugin_city,
					region: data.geoplugin_region,
					country: data.geoplugin_countryName,
					continent: data.geoplugin_continentName,
					lat: data.geoplugin_latitude,
					lng: data.geoplugin_longitude,
					timezone: data.geoplugin_timezone
				};
			});
		} catch (err) {
			console.error(err);
		}
	}


	// PUBLIC
	return {
		init: init,
		setEnvironment: setEnvironment,
		createOptions: createOptions,
		launchStartScreen: launchStartScreen
	};
}());
