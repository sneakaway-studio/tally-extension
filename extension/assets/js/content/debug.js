self.Debug = (function() {
	// PRIVATE

	let DEBUG = true,
		ALL = {

			Background: true,
			BackgroundInstall: true,
			BackgroundListener: true,
			BackgroundServer: true,


			Account: false,
			Badge: false,

			// battles
			BattleAttack: true,
			BattleConsole: true,
			BattleEffect: false,
			BattleMath: true,
			BattleTest: true,
			Battle: true,

			Consumable: false,
			Core: false,
			Debug: true,
			Demo: true,
			Dialogue: false,
			Disguise: false,
			Effect: false,
			Flag: true,
			TallyEvents: true,
			Interface: false,
			Item: false,

			// monsters
			MonsterCheck: false,
			Monster: false,

			Page: true,
			Progress: false,

			Sound: false,
			StatsDisplay: false,
			Stats: false,
			Skin: false,

			Tally: true,
			TallyData: true,
			TallyListeners: false,
			TallyMain: true,
			TallyStorage: true,
			Tracker: false,
			Tutorial: false
		},
		tallyConsoleIcon = 'font-size:12px; background:url("' + chrome.runtime.getURL('assets/img/tally/tally-clear-20w.png') + '") no-repeat;';


	console.log("%c   Hi, I'm Tally!", tallyConsoleIcon, "\n");

	/**
	 *	Track loading time for scripts, backend data
	 */
	let then = new Date().getTime();

	function elapsedTime(caller) {
		try {
			if (1) return;
			let now = new Date().getTime();
			if (DEBUG) console.log(getCurrentDateStr(), "🗜️ Debug.elapsedTime() ELAPSED =", now - then, caller);
		} catch (err) {
			console.error(getCurrentDateStr(), err);
		}
	}
	elapsedTime("");


	// https://coderwall.com/p/fskzdw/colorful-console-log
	let styles = {
		redbg: 'background: red; color: white; display: inline-block;',
		greenbg: 'background: green; color: white; display: inline-block;',
		blue: 'color: blue; display: inline-block;',
		purple: 'color: purple; display: inline-block;'
	};

	/**
	 *	Set all the debug props to...
	 */
	function setAll(state) {
		try {
			if (DEBUG) console.log(getCurrentDateStr(), "🗜️ Debug.setAll() state =", state);
			for (var key in ALL) {
				if (ALL.hasOwnProperty(key)) {
					ALL[key] = state;
				}
			}
		} catch (err) {
			console.error(getCurrentDateStr(), err);
		}
	}
	// setAll(true);
	// setAll(false);
	// ALL.Storage = true;

	if (!T.envOptions.debugging) {
		DEBUG = false;
		setAll(false);
	}







	/**
	 *	Send a debug message to background console
	 */
	function sendBackgroundDebugMessage(caller, str) {
		try {
			// time the request
			let startTime = new Date().getTime();

			// if (DEBUG) console.log(getCurrentDateStr(), "🗜️ Debug.sendBackgroundDebugMessage()", caller, str);
			let msg = {
				'action': 'sendBackgroundDebugMessage',
				'caller': caller,
				'str': str
			};

			// stop if background disconnected
			if (TallyStorage.backgroundConnectErrors >= 3) return;

			chrome.runtime.sendMessage(msg, function(response) {
				let endTime = new Date().getTime();
				// if (DEBUG) console.log(getCurrentDateStr(), "🗜️ Debug.sendBackgroundDebugMessage() time = " + (endTime - startTime) + "ms, RESPONSE =", JSON.stringify(response));
			});
		} catch (err) {
			if (!Page.isReloadExtErr(err)) {
				TallyStorage.backgroundConnectErrors++;
				console.error(getCurrentDateStr(), err);
			}
		}
	}


	function dataReportHeader(title, char, pos, count = 15) {
		try {
			if (!DEBUG) return;
			// make string
			let line = "";
			for (let i = 0; i < count; i++) {
				line += char;
			}
			if (pos == "before") console.log("");
			console.log(line + " " + title + " " + line);
			if (pos == "after") console.log("");
		} catch (err) {
			console.error(getCurrentDateStr(), err);
		}
	}



	// MARKED FOR DELETION

	// function addDebugButtonListeners() {
	// 	try {
	//
	//
	// 		// add listener for reset buttons
	// 		$(document).on("click", '#resetTallyUserFromBackground', function() {
	// 			TallyStorage.getDataFromBackground(TallyMain.runStartupChecks);
	// 		});
	// 		$(document).on("click", '#resetTallyUserFromServer', function() {
	// 			TallyStorage.resetTallyUserFromServer();
	// 		});
	// 		$(document).on("click", '#showRandomUrl', function(e) {
	// 			e.preventDefault();
	// 			TallyStorage.getDataFromServer("/url/random", function(response) {
	// 				console.log("🗜️ Debug #showRandomUrl", response.data.urls[0]);
	// 			});
	// 		});
	//
	// 	} catch (err) {
	// 		console.error(err);
	// 	}
	// }



	function addKeys() {
		try {

			let k = "`+1";
			Mousetrap.bind(k + ' p', function() {
				window.open('https://tallysavestheinternet.com/profile/' + T.tally_user.username);
			});
			Mousetrap.bind(k + ' t', function() {
				Dialogue.random();
			});
			Mousetrap.bind(k + ' w', function() {
				Skin.random();
			});
			Mousetrap.bind(k + ' m', function() {
				Sound.stopMusic();
				BattleAttack.tallyWins("The monster's health has been depleted. Tally wins!!!", "monster-health-gone");
				// BattleEffect.showCapturedMonster();
				// Monster.test();
			});
			Mousetrap.bind(k + ' b', function() {
				Battle.test();
				// Sound.playFile("explosions/explode.mp3", false, 0);
			});

			Mousetrap.bind(k + ' 0', function() {
				BattleEffect.showRumble("small");
			});
			Mousetrap.bind(k + ' 1', function() {
				BattleEffect.showRumble("medium");
			});
			Mousetrap.bind(k + ' 2', function() {
				BattleEffect.showRumble("large");
			});
			Mousetrap.bind(k + ' 8', function() {
				BattleConsole.log("What will Tally do?", "showBattleOptions");
			});
			Mousetrap.bind(k + ' q', function() {
				Battle.end(true);
			});
			Mousetrap.bind(k + ' e', function() {
				Effect.explode();
			});



			Mousetrap.bind(k + ' 7', function() {

			});

			Mousetrap.bind(k + ' z', function() {
				StatsDisplay.adjustStatsBar("tally", "health", Math.random());
			});
			Mousetrap.bind(k + ' x', function() {
				StatsDisplay.adjustStatsBar("tally", "stamina", Math.random());
			});
			Mousetrap.bind(k + ' v', function() {
				StatsDisplay.adjustStatsCircle("tally", Math.random());
			});
			Mousetrap.bind(k + ' r', function() {

			});
			Mousetrap.bind(k + ' v', function() {
				BattleTest.test();
			});

		} catch (err) {
			console.error(err);
		}
	}


	// global error handler
	self.onerror = function(msg, url, lineNo, columnNo, error) {

// A new bug in the latest version of Chrome triggers this event every time an expression is evaluated in DevTools.
if(url.endsWith("bg-modules.js")) return;

		var msgStr = msg.toLowerCase();
		// ignore CORS / CDN errors
		if (msgStr.indexOf("script error") > -1) {
			// console.error('Script Error: See Browser Console for Detail');
		} else if (msgStr.indexOf("resizeobserver") > -1) {
			// console.error('ResizeObserver loop limit exceeded error on a page visited by Tally');
		} else {
			var message = [
				'Message: ' + msg,
				'URL: ' + url,
				'Line: ' + lineNo,
				'Column: ' + columnNo,
				'Error object: ' + JSON.stringify(error)
			].join(' - ');

			console.error(getCurrentDateStr(), "Tally caught an error", message);
		}

		return false;
	};



	function getCurrentDateStr() {
		return new Date().toLocaleString('sv', {
			timeZoneName: 'short'
		});
	}





	// PUBLIC
	return {
		ALL: ALL,
		setAll: setAll,
		styles: styles,
		sendBackgroundDebugMessage: sendBackgroundDebugMessage,
		dataReportHeader: dataReportHeader,
		addKeys: addKeys,
		elapsedTime: elapsedTime,
		tallyConsoleIcon: tallyConsoleIcon,

		getCurrentDateStr: getCurrentDateStr
	};
})();
