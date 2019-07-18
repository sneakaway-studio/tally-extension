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
		"Dialogue": false,
		"Effect": true,
		"TallyEvents": true,
		"Interface": true,
		"TallyListeners": false,
		"TallyMain": true,
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
		"Tracker": true,
		"Tutorial": true
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


	// add the debugger
	function add() {
		try {
			if (!prop(tally_options) || !tally_options.showDebugger) return;

			let str = "<div id='tyd' class='tally draggable data-field grabbable'>" + "</div>";
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

			var str = "<div class='tally'>" +
				"<b class='tally'>tally_user.score</b>: " + JSON.stringify(tally_user.score) + "<br>" +
				"<b class='tally'>tally_user.monsters</b>: " + JSON.stringify(tally_user.monsters) + "<br>" +
				"<b class='tally'>tally_nearby_monsters (" + objLength(tally_nearby_monsters) + ")</b>: " + JSON.stringify(tally_nearby_monsters) + "<br>" +
				//"tally_options: " + JSON.stringify(tally_options) +"<br>"+
				//"<b>pageData</b>: " + JSON.stringify(pageData) +"<br>"+
				"<b class='tally'>pageData.tags (" + pageData.tags.length + ")</b>: " + JSON.stringify(pageData.tags) + "<br>" +
				"<b class='tally'>pageData.trackers (" + pageData.trackers.length + ")</b>: " + JSON.stringify(pageData.trackers) + "<br>" +
				"</div>";
			$('#tyd').html(str);
		} catch (err) {
			console.error(err);
		}
	}


	// PUBLIC
	return {
		ALL: ALL,
		setAll: function(state) {
			setAll(state);
		},
		add: add,
		update: update
	};
})();
