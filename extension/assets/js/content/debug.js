"use strict";

/*  DEBUGGER
 ******************************************************************************/

window.Debug = (function() {
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

			Consumable: true,
			Core: false,
			Debug: true,
			Demo: true,
			Dialogue: true,
			Disguise: true,
			Effect: true,
			Flag: true,
			TallyEvents: true,
			Interface: true,
			Item: true,

			// monsters
			MonsterCheck: true,
			Monster: true,

			Page: true,
			Progress: true,

			Sound: true,
			StatsDisplay: false,
			Stats: false,
			Skin: false,

			Tally: true,
			TallyData: true,
			TallyListeners: false,
			TallyMain: true,
			TallyStorage: true,
			Tracker: true,
			Tutorial: true
		},
		debugButtonListenersAdded = false,
		tallyConsoleIcon = 'font-size:12px; background:url("' + chrome.extension.getURL('assets/img/tally/tally-clear-20w.png') + '") no-repeat;';


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
		redbg: 'background: red; color: white; display: block;',
		greenbg: 'background: green; color: white; display: block;',
		blue: 'color: blue; display: block;',
		purple: 'color: purple; display: block;'
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


	// add the debugger
	function add() {
		try {
			if (!FS_Object.prop(T.tally_options) || !T.tally_options.showDebugger) return;

			// make sure it isn't already there
			if ($("#tyd").length) return;

			let str = "<div id='tyd' class='tally draggable data-field grabbable'></div>";
			$('#tally_wrapper').append(str);
			// make it draggable
			$("#tyd").draggable({
				axis: "y"
				// ,drag: function () {
				//if (DEBUG) console.log("🗜️ Debug.add() draggable:drag");
				// var offset = $(this).offset();
				// var xPos = offset.left;
				// var yPos = offset.top - $(window).scrollTop();
				// T.tally_options.debuggerPosition = [xPos,yPos];
				// },
				// stop: function () {
				//if (DEBUG) console.log("🗜️ Debug.add() draggable:stop");
				//TallyStorage.saveData("tally_options",T.tally_options,"tyd.draggable.stop");
				// }
			});
		} catch (err) {
			console.error(err);
		}
	}

	function update() {
		try {
			if (!FS_Object.prop(T.tally_options) || !T.tally_options.showDebugger) return;
			if (!$("#tyd").length) return;

			var str =
				// "<div class='tally'>" +
				"<button class='tally clickable' id='showRandomUrl'>SHOW RANDOM URL</button> " +
				"<button class='tally clickable' id='resetTallyUserFromBackground'>RESET FROM BACKGROUND</button> " +
				"<button class='tally clickable' id='resetTallyUserFromServer'>RESET FROM SERVER</button>" +
				"";

			// add T.tally_user.score
			if (FS_Object.prop(T.tally_user.score))
				str += "<b class='tally'>T.tally_user.score (XP)</b>: " + JSON.stringify(T.tally_user.score) + "<br>";

			// add T.tally_user.monsters
			if (FS_Object.prop(T.tally_user.monsters))
				str += "<b class='tally'>T.tally_user.monsters</b>: " + JSON.stringify(T.tally_user.monsters) + "<br>";

			// add T.tally_nearby_monsters
			// if (FS_Object.prop(T.tally_nearby_monsters))
			// 	str += "<b class='tally'>T.tally_nearby_monsters (" +
			// 	FS_Object.objLength(T.tally_nearby_monsters) + ")</b>: " +JSON.stringify(T.tally_nearby_monsters) + "<br>";

			// add T.tally_options
			if (FS_Object.prop(T.tally_options)) str += "T.tally_options: " + JSON.stringify(T.tally_options) + "<br>";

			// add Page.data
			if (FS_Object.prop(Page.data)) str += "<b>Page.data</b>: " + JSON.stringify(Page.data) + "<br>";

			// add Page.data.tags
			// if (FS_Object.prop(Page.data.tags))
			// 	str += "<b class='tally'>Page.data.tags (" + Page.data.tags.length + ")</b>: " +
			// 	JSON.stringify(Page.data.tags) + "<br>";

			// add Page.data.trackers
			// if (FS_Object.prop(Page.data.trackers))
			// 	str += "<b class='tally'>Page.data.trackers</b>: " +
			// 	JSON.stringify(Page.data.trackers) + "<br>";

			// str += "</div>";
			$('#tyd').html(str);

			addDebugButtonListeners();

		} catch (err) {
			console.error(err);
		}
	}


	function addDebugButtonListeners() {
		try {
			if (debugButtonListenersAdded) return;
			debugButtonListenersAdded = true;

			if (DEBUG) console.log("🗜️ Debug.addDebugButtons()");

			// add listener for reset buttons
			$(document).on("click", '#resetTallyUserFromBackground', function() {
				TallyStorage.getDataFromBackground(TallyMain.contentStartChecks);
			});
			$(document).on("click", '#resetTallyUserFromServer', function() {
				TallyStorage.resetTallyUserFromServer();
			});
			$(document).on("click", '#showRandomUrl', function(e) {
				e.preventDefault();
				TallyStorage.getDataFromServer("/url/random", function(response) {
					console.log("🗜️ Debug #showRandomUrl", response.data.urls[0]);
				});
			});

		} catch (err) {
			console.error(err);
		}
	}



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
			Mousetrap.bind(k + ' 7', function() {

			});
			Mousetrap.bind(k + ' 8', function() {
				BattleConsole.log("What will Tally do?", "showBattleOptions");
			});
			Mousetrap.bind(k + ' 9', function() {

			});
			Mousetrap.bind(k + ' q', function() {
				Battle.end(true);
			});

			Mousetrap.bind(k + ' e', function() {
				Effect.explode();
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
	window.onerror = function(msg, url, lineNo, columnNo, error) {
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
		add: add,
		update: update,
		addKeys: addKeys,
		elapsedTime: elapsedTime,
		tallyConsoleIcon: tallyConsoleIcon,

		getCurrentDateStr: getCurrentDateStr
	};
})();
