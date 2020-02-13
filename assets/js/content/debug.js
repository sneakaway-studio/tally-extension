"use strict";

/*  DEBUGGER
 ******************************************************************************/

window.Debug = (function() {
	// PRIVATE

	let ALL = {
		"Badge": true,
		// battles
		"BattleAttack": true,
		"BattleConsole": false,
		"BattleEffect": false,
		"BattleMath": true,
		"BattleTest": true,
		"Battle": true,

		"Consumable": true,
		"Core": false,
		"Debug": true,
		"Demo": true,
		"Dialogue": false,
		"Effect": true,
		"Flag": true,
		"TallyEvents": true,
		"Interface": true,
		"TallyListeners": false,
		"TallyMain": true,
		"TallyStorage": true,
		// monsters
		"MonsterAward": false,
		"MonsterCheck": true,
		"Monster": true,

		"Onboarding": true,
		"PageData": true,
		"Progress": true,
		"Sound": false,
		"StatsDisplay": false,
		"Stats": true,
		"Skin": false,
		"Tally": true,
		"Tracker": false,
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

			if (prop(pageData))
				str += "<b>pageData</b>: " + JSON.stringify(pageData) + "<br>";

			// if (prop(pageData.tags))
			// 	str += "<b class='tally'>pageData.tags (" + pageData.tags.length + ")</b>: " +
			// 	JSON.stringify(pageData.tags) + "<br>";

			// if (prop(pageData.trackers))
			// 	str += "<b class='tally'>pageData.trackers (" + pageData.trackers.length + ")</b>: " +
			// 	JSON.stringify(pageData.trackers) + "<br>";

			str += "</div>";
			$('#tyd').html(str);

			// add listener for reset button
			$(document).on("click", '#updateGameFromServer', function() {
				TallyMain.resetGameDataFromServer();
			});

		} catch (err) {
			console.error(err);
		}
	}


	// PUBLIC
	return {
		ALL: ALL,
		styles: styles,
		setAll: function(state) {
			setAll(state);
		},
		add: add,
		update: update
	};
})();
