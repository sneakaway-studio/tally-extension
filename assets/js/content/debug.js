"use strict";

/*  DEBUGGER
 ******************************************************************************/

window.Debug = (function() {
	// PRIVATE

	let DEBUG = true,
		ALL = {
			"Badge": true,
			// battles
			"BattleAttack": true,
			"BattleConsole": true,
			"BattleEffect": false,
			"BattleMath": true,
			"BattleTest": true,
			"Battle": true,

			"Consumable": true,
			"Core": false,
			"Debug": true,
			"Demo": true,
			"Dialogue": true,
			"Effect": true,
			"Flag": true,
			"TallyEvents": true,
			"Interface": true,
			"Item": true,

			// monsters
			"MonsterAward": false,
			"MonsterCheck": true,
			"Monster": true,

			"Onboarding": true,
			"Page": true,
			"Progress": true,

			"Sound": false,
			"StatsDisplay": false,
			"Stats": false,
			"Skin": true,

			"Tally": true,
			"TallyData": true,
			"TallyListeners": true,
			"TallyMain": true,
			"TallyStorage": true,
			"Token": true,
			"Tracker": true,
			"Tutorial": true
		};

	// https://coderwall.com/p/fskzdw/colorful-console-log
	let styles = {
		"red": 'background: red; color: white; display: block;',
		"green": 'background: green; color: white; display: block;'
	};

	/**
	 *	Set all the debug props to...
	 */
	function setAll(state) {
		for (var key in ALL) {
			if (ALL.hasOwnProperty(key)) {
				ALL[key] = state;
			}
		}
	}
	// setAll(true);
	// setAll(false);


	/**
	 *	Send a denug message to background console
	 */
	function sendBackgroundDebugMessage(caller, str) {
		try {
			// time the request
			let startTime = new Date().getTime();

			// if (DEBUG) console.log("🐞 Debug.sendBackgroundDebugMessage()", caller, str);
			let msg = {
				'action': 'sendBackgroundDebugMessage',
				'caller': caller,
				'str': str
			};
			chrome.runtime.sendMessage(msg, function(response) {
				let endTime = new Date().getTime();
				if (DEBUG) console.log("🐞 Debug.sendBackgroundDebugMessage() time = " + (endTime - startTime) + "ms, RESPONSE =", JSON.stringify(response));
			});
		} catch (err) {
			console.error(err);
		}
	}


	function dataReportHeader(title, char, pos, count=30) {
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
			console.error(err);
		}
	}


	// add the debugger
	function add() {
		try {
			if (!prop(tally_options) || !tally_options.showDebugger) return;

			let str = "<div id='tyd' class='tally draggable data-field grabbable'></div>";
			$('#tally_wrapper').append(str);
			// make it draggable
			$("#tyd").draggable({
				axis: "y",
				drag: function() {
					//console.log("draggable:drag");
					// var offset = $(this).offset();
					// var xPos = offset.left;
					// var yPos = offset.top - $(window).scrollTop();
					// tally_options.debuggerPosition = [xPos,yPos];
				},
				stop: function() {
					//console.log("draggable:stop");
					//TallyStorage.saveData("tally_options",tally_options,"tyd.draggable.stop");
				}
			});
		} catch (err) {
			console.error(err);
		}
	}

	function update() {
		try {
			if (!prop(tally_options) || !tally_options.showDebugger) return;
			if (!$("#tyd").length) return;

			var str = "<div class='tally'>" + "<button class='reset-this tally' id='updateGameFromServer'>RESET</button>";

			if (prop(tally_user.score))
				str += "<b class='tally'>tally_user.score (XP)</b>: " + JSON.stringify(tally_user.score) + "<br>";

			if (prop(tally_user.monsters))
				str += "<b class='tally'>tally_user.monsters</b>: " + JSON.stringify(tally_user.monsters) + "<br>";

			// if (prop(tally_nearby_monsters))
			// 	str += "<b class='tally'>tally_nearby_monsters (" +
			// 	FS_Object.objLength(tally_nearby_monsters) + ")</b>: " +JSON.stringify(tally_nearby_monsters) + "<br>";

			if (prop(tally_options))
				str += "tally_options: " + JSON.stringify(tally_options) + "<br>";

			if (prop(Page.data))
				str += "<b>Page.data</b>: " + JSON.stringify(Page.data) + "<br>";

			// if (prop(Page.data.tags))
			// 	str += "<b class='tally'>Page.data.tags (" + Page.data.tags.length + ")</b>: " +
			// 	JSON.stringify(Page.data.tags) + "<br>";

			// if (prop(Page.data.trackers))
			// 	str += "<b class='tally'>Page.data.trackers (" + Page.data.trackers.length + ")</b>: " +
			// 	JSON.stringify(Page.data.trackers) + "<br>";

			str += "</div>";
			$('#tyd').html(str);

			// add listener for reset button
			$(document).on("click", '#updateGameFromServer', function() {
				TallyMain.getDataFromBackground(TallyMain.contentStartChecks);
			});

		} catch (err) {
			console.error(err);
		}
	}


	function addKeys() {
		try {

			let k = "`+1";
			Mousetrap.bind(k + ' p', function() {
				window.open('https://tallygame.net/profile/' + tally_user.username);
			});
			Mousetrap.bind(k + ' s', function() {
				chrome.runtime.sendMessage({
					'action': 'openPage',
					'url': chrome.extension.getURL('assets/pages/startScreen/startScreen.html')
				});
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
				// Battle.test();
				Sound.playFile("explosions/explode.mp3", false, 0);
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
				Battle.end();
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

	// PUBLIC
	return {
		ALL: ALL,
		setAll: setAll,
		styles: styles,
		sendBackgroundDebugMessage: sendBackgroundDebugMessage,
		dataReportHeader: dataReportHeader,
		add: add,
		update: update
	};
})();
