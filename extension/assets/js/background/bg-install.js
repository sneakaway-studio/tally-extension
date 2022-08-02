self.Install = (function() {
	// PRIVATE

	let DEBUG = Debug.ALL.BackgroundInstall;

	/**
	 *  Get or create all data for game objects in T.* and return status
	 */
	async function init() {
		try {
			let log = "🔧 Install.init()",
				previousVersion = -1,
				newVersion = -1,
				isNewVersion = false,
				installStatus = "reload"; // firstTime | newVersion | reload

			// 1. check version

			// if no tally_meta exists, this is a firstTime install
			if (!await S.isSet("tally_meta")) {
				if (DEBUG) console.log(`${log} [1.0] NO T.tally_meta found, creating app`);
				// mark that this is the first time installation
				installStatus = "firstTime";
			}
			// otherwise is a newVersion or reload
			else {
				// get current version
				let tempMeta = await S.getSet("tally_meta");
				previousVersion = tempMeta.install.version;
				// check if new version
				isNewVersion = checkIfNewVersion(previousVersion);
				// if new version
				if(isNewVersion){
					installStatus = "newVersion";
				}
				if (DEBUG) console.log(`${log} [1.1] T.tally_meta found! isNewVersion=${isNewVersion}`);
			}

			// 2. update all game objects from storage (or create defaults)
			// !!! S.getSet them immediately before FF reloads all tabs and writes over them 🙄

			T.tally_user = await S.getSet("tally_user") || createUser();
			await S.getSet("tally_user", T.tally_user);

			// always update/reset meta
			T.tally_meta = await createMeta();
			await S.getSet("tally_meta", T.tally_meta);
			newVersion = T.tally_meta.install.version;

			T.tally_options = await S.getSet("tally_options") || createOptions();
			await S.getSet("tally_options", T.tally_options);

			T.tally_nearby_monsters = await S.getSet("tally_nearby_monsters") || {};
			await S.getSet("tally_nearby_monsters", T.tally_nearby_monsters);

			T.tally_stats = await S.getSet("tally_stats") || {};
			await S.getSet("tally_stats", T.tally_stats);

			T.tally_tag_matches = await S.getSet("tally_tag_matches") || {};
			await S.getSet("tally_tag_matches", T.tally_tag_matches);

			T.tally_top_monsters = await S.getSet("tally_top_monsters") || {};
			await S.getSet("tally_top_monsters", T.tally_top_monsters);

			if (DEBUG) console.log(`${log} [2.0] game objects created`);


			// 3. get user's geolocation for tutorials on firstTime
			if (installStatus === "firstTime" || isNewVersion) {
				T.tally_meta.location = await getLocation();
				await S.getSet("tally_meta", T.tally_meta);
			}



			if (DEBUG) console.log(`${log} [3.0] previousVersion=${previousVersion} newVersion=${newVersion}`);
			if (DEBUG) console.log(`${log} [3.1] game installed! installStatus=${installStatus}`);
			// if (DEBUG) console.log(`${log} [3.2] S.getSet("tally_meta")=${await S.getSet("tally_meta")}`);
			// if (DEBUG) console.log(`${log} [3.3] T.tally_meta=${T.tally_meta}`);

			return installStatus;
		} catch (err) {
			console.error("failed to create user", err);
		}
	}



	/**
	 * 	Check if it is a new version
	 */
	function checkIfNewVersion(previousVersion) {
		try {
			let manifestData = chrome.runtime.getManifest(),
				log = "🔧 Install.checkIfNewVersion()";

			// if version the same
			if (previousVersion === manifestData.version) {
				if (DEBUG) console.log(log, previousVersion + "===" + manifestData.version, "..... SAME VERSION");
				return false;
			}
			// if version is not the same
			else {
				if (DEBUG) console.log(log, previousVersion + "!==" + manifestData.version, "!!!!! NEW VERSION");
				// let calling function know
				return true;
			}

		} catch (err) {
			console.error(err);
		}
	}


	/**
	 *  Set development or production server
	 */
	async function setEnvironment() {
		try {
			// localhost vs. live server
			if (T.envOptions.localhost)
				T.tally_meta.env.currentAPI = "development";
			else
				T.tally_meta.env.currentAPI = "production";

			// set api and website urls
			T.tally_meta.env.api = T.envOptions[T.tally_meta.env.currentAPI].api;
			T.tally_meta.env.website = T.envOptions[T.tally_meta.env.currentAPI].website;

			if (DEBUG) console.log(`🔧 Install.setEnvironment() [1] currentAPI=%c${T.tally_meta.env.currentAPI}`, `${Debug.styles.greenbg}`, `api=${T.tally_meta.env.api} website=${T.tally_meta.env.website}`);

			await S.getSet("tally_meta", T.tally_meta);
			return true;
		} catch (err) {
			console.error(err);
		}
	}




	/**
	 *  Launch Start Screen - call if api/getTallyUser fails
	 */
	async function launchStartScreen() {
		try {
			const log = "🔧 Install.launchStartScreen()";
			// console.trace();
			let pageToShow = "/get-anonyname";

			// don't launch in development
			// if (T.envOptions.localhost) return;

			// don't launch if !server
			if (!T.tally_meta.serverOnline) {
				if (DEBUG) console.log(log, "🛑 SERVER OFFLINE");
				return;
			}

			// if they are logged in show how to play
			if (T.tally_meta.userLoggedIn) {
				if (DEBUG) console.log(log, "🛑 ALREADY LOGGED IN");
				// show how to
				pageToShow = "/how-to-play";
			}

			// get current page
			chrome.tabs.query({
				active: true,
				currentWindow: true
			}, function(tabs) {
				var tab = tabs[0];
				// if (DEBUG) console.log(log, "current tab =", tab);

				// are we in the process resetting user's data?
				if (tab.url !== undefined && (tab.url.includes("/dashboard") ||
						tab.url.includes("tallygame.net") || tab.url.includes("tallysavestheinternet.com") ||
						tab.url.includes(T.tally_meta.env.website)
					)) {
					if (DEBUG) console.log(log, "🛑 ON DASHBOARD");
					return;
				}

				// keep track of loginPrompts and don't do too many
				if (T.tally_meta.install.loginPrompts.startScreen >= 30) {
					if (DEBUG) console.log(log, "🛑 T.tally_meta.install.loginPrompts.startScreen >=",
						T.tally_meta.install.loginPrompts.startScreen);
					return;
				}

				// else launch install page
				chrome.tabs.create({
					url: T.tally_meta.env.website + pageToShow
				}, async function(newTab) {
					// increment and save
					T.tally_meta.install.loginPrompts.startScreen = T.tally_meta.install.loginPrompts.startScreen + 1;
					await S.getSet("tally_meta", T.tally_meta);
					if (DEBUG) console.log(log, "👍 launching T.tally_meta.install.loginPrompts.startScreen =", T.tally_meta.install.loginPrompts.startScreen);
					// if (DEBUG) console.log(log, "newTab =", newTab);
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
			return {
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
		} catch (err) {
			console.error(err);
		}
	}

	function createOptions() {
		try {
			var obj = {
				disabledDomains: [
					"drive.google.com",
					"docs.google.com",
					"gmail.com",
					"mail.google.com",
					"moodle.davidson.edu",
				],
				gameMode: "full", // demo | testing | full | chill | stealth | disabled
				playSounds: true,
				showClickVisuals: true,
				showNotifications: true, // defined as sounds + dialogue animations
				showTally: true,
				soundVolume: 0.2,
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
	async function createMeta() {
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
					version: manifestData.version, // set in manifest
					loginPrompts: {
						startScreen: 0, // # times extension has opened a new tab (on install)
						dialogue: 0 // # times Tally has encouraged user to login
					}
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
				// game
				game: {
					midsRecentlyShown: {}
				}
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
			return await fetch('http://www.geoplugin.net/json.gp', function(data) {
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
