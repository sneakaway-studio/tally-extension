"use strict";

/*  BATTLE
 ******************************************************************************/

var Battle = (function() {
	// PRIVATE

	var _active = false,
		_logDelay = 1000,
		details = {
			"mid": null,
			"monsterName": "",
			"mostRecentAttack": "",
			"mostRecentDamage": ""
		};

	function getDetails() {
		return details;
	}

	// control state
	function active(state) {
		if (state != undefined && (state === true || state === false))
			_active = state;
		if (false) end();

		return _active;
	}
	// start battle
	function start(mid) {
		if (_active) return;
		active(true);

		// get monster name
		details.monsterName = MonsterData.dataById[mid].name + " monster";

		// setup page
		setupRumble();


		// move tally into position



		// add monster and move into position

		// show console
		BattleConsole.show();
		setTimeout(function() {
			BattleConsole.log("Battle started with " + details.monsterName + "!");
			monsterTakeTurn();
		}, 100);

	}

	function monsterTakeTurn() {

		details.mostRecentAttack = "spambash attack";
		details.mostRecentDamage = "24 health";
		// save as most recent attack

		setTimeout(function() {
			BattleConsole.log(details.monsterName + " used the " + details.mostRecentAttack + "!");
			setTimeout(function() {
				BattleConsole.log("Tally lost " + details.mostRecentDamage + ".");
				setTimeout(function() {
					BattleConsole.log("What will Tally do?");
				}, _logDelay);
			}, _logDelay);
		}, _logDelay);
	}

	function tallyTakeTurn() {
		// show buttons
		setTimeout(function() {
			BattleConsole.log("Tally used the _____ attack!");
			setTimeout(function() {
				BattleConsole.log(_monster + " monster received ______ in damages.");
				monsterTakeTurn();
			}, _logDelay);
		}, _logDelay);
	}


	function test() {
		if (!_active) {
			start(681);
			Skin.update("pattern", "plaidRed");
		} else {
			BattleConsole.log("Some more stuff for the console " + pageData.time);
			Skin.random();
		}
	}

	let source,nodes,n = "*";

	function setupRumble(){
		// display source code of web page in background
		if (source == null){
			// add div
			$("body").append("<blockquote id='battle-background'></blockquote>");
			source = $("body").html();
			source.replace(/[^<]/gi, '&lt;').replace(/[^>]/gi, '&gt;')
			//console.log(source);
		}
		if (nodes == null){
			// all possible html5 nodes
			nodes = ['a', 'b', 'blockquote', 'br', 'button', 'canvas', 'code', 'dd', 'div', 'dl', 'dt',
				'em', 'embed', 'footer', 'frame', 'form', 'header', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'hr',
				'iframe', 'img', 'input', 'label', 'nav', 'ol', 'ul', 'li', 'option', 'p', 'pre', 'section', 'span',
				'strong', 'sup', 'svg', 'table', 'tr', 'td', 'th', 'tbody', 'thead', 'template', 'textarea', 'text', 'u', 'video'
			];
			//console.log(nodes.join(", "));
			// add any exclusions
			for (let i = 0, l = nodes.length; i < l; i++) {
				//console.log(nodes.length, nodes[i], $(nodes[i]).height(), $(nodes[i]).length);
				// remove large divs
				if ($(nodes[i]).length == 0 || $(nodes[i]).height() > 2000 || $(nodes[i]).height() == undefined) {
					//console.log(" --> removed ");
					delete nodes[i];
				} else {
					nodes[i] = nodes[i] + ':not(.tally)';
				}
			}

			// clean empties from array
			nodes = nodes.filter(function (el) {
				return el != null;
			});
			console.log("final node count: "+nodes.length);

			// format for selection
			n = nodes.join(', ');
			//console.log(n);
		}
	}


	function rumble(degree="medium") {
		if (source == null || nodes == null)
			setupRumble();

		if (degree == "small")
			Sound.playFile("explosions/explode.mp3",0,-.2);
		else if (degree == "medium")
			Sound.playFile("explosions/explode.mp3",0,0);
		else if (degree == "large")
			Sound.playFile("explosions/explode.mp3",0,.2);

		// display background
		$("#battle-background").text(source);
		// rumble page elements
		$(n).addClass(degree+'-rumble');
		// after delay set back to normal
		setTimeout(function() {
			$(n).removeClass(degree+'-rumble');
			$("#battle-background").text("");
		}, 500);
		

	}

	// end battle
	function end() {
		_active = false;
		BattleConsole.hide();
	}





	// PUBLIC
	return {
		start: function(mid) {
			start(mid);
		},
		end: end,
		test: test,
		active: function(state) {
			return active(state);
		},
		rumble: function(degree) {
			rumble(degree);
		},
		details: details
	};
})();
