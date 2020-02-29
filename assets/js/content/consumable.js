"use strict";

/*  CONSUMABLE
 ******************************************************************************/

window.Consumable = (function() {
	// PRIVATE

	let DEBUG = Debug.ALL.Consumable,
		consumables = [],
		hovered = false,
		types = {
			"cookie": {
				"health": {
					"name": "health",
					"type": "cookie",
					"ref": "a",
					"img": "cookie-dots.gif",
					"val": FS_Number.round(Math.random() * 0.2, 2),
					"stat": "health",
					"sound": "happy",
				},
				"stamina": {
					"name": "stamina",
					"type": "cookie",
					"ref": "a",
					"img": "cookie-waffle.gif",
					"val": FS_Number.round(Math.random() * 0.2, 2),
					"stat": "stamina",
					"sound": "happy",
				},
				"fortune": {
					"name": "fortune",
					"type": "cookie",
					"ref": "a",
					"img": "cookie-fortune.gif",
					"val": FS_Number.round(FS_Number.randomPosNeg(0.2), 2),
					"stat": randomObjKey(Stats.resetStatsAll),
					"sound": "cautious",
				},
				"bad": {
					"name": "bad",
					"type": "cookie",
					"ref": "a",
					"img": "cookie-bad.gif",
					"val": -FS_Number.round(Math.random() * 0.2, 2),
					"stat": randomObjKey(Stats.resetStatsAll),
					"sound": "danger",
				}
			},
			"junk": {
				"data": {
					"name": "data",
					"type": "junk",
					"ref": "some",
					"img": "junk-data.gif",
					"val": -FS_Number.round(Math.random() * 0.2, 2),
					"stat": "stamina",
					"sound": "cautious",
				},
			},
		};

	/**
	 *	1. determine if we will generate a consumable on this page
	 */
	function randomizer() {
		try {
			// don't display consumable if display is off
			if (!Page.mode.active || tally_options.gameMode === "disabled" || tally_options.gameMode === "stealth") return;

			let countR = Math.random(), // whether to create a consumable at all
				r = Math.random(), // whether to create consumable of type
				type = "", // default type
				count = 1, // number to create
				chosen = false;

			// add three on one page every 1000 loads
			if (countR < 0.001) count = 3;
			// add two on one page every 200 loads
			else if (countR < 0.005) count = 2;

			// pick random from type
			if (r < 0.05) create("cookie", "", count);
			else if (r < 0.06) create("junk", "", count);
			// pick random type
			else if (r < 0.07) create("", "", count);
			// gameMode === testing
			else if (r < 0.4 && ["demo","testing"].includes(tally_options.gameMode)) create("cookie", "", 1);

		} catch (err) {
			console.error(err);
		}
	}
	/**
	 *	2. if so, then make a new one from list
	 */
	function create(type = "", name = "", num = 1) {
		try {
			// don't display if off
			if (!Page.mode.active || tally_options.gameMode === "disabled" || tally_options.gameMode === "stealth" || type === "") return;
			if (DEBUG) console.log("🍪 Consumable.create()", "type=" + type, "name=" + name, "num=" + num);

			// store the consumable
			let consumable = {};
			for (var i = 0; i < num; i++) {

				// if type and name are set, be specific
				if (type !== "" && name !== "") consumable = types[type][name];
				// if only type is set, get random from that type
				else if (type !== "") consumable = FS_Object.randomObjProperty(types[type]);
				// if nothing is set, get random
				else consumable = FS_Object.randomObjProperty(types[randomObjKey(types)]);

				// if a consumable was selected push it to array
				if (consumable != {}) consumables.push(consumable);

				if (DEBUG) console.log("🍪 Consumable.create()", type, i + "/" + num, consumable);

				// testing
				//consumables.push(types.cookie.fortune);
			}
			if (DEBUG) console.log("🍪 Consumable.create()", consumables);
			add();
		} catch (err) {
			console.error(err);
		}
	}
	/**
	 *	3. add consumable to a page
	 */
	function add() {
		try {
			let randomPos = [],
				css = "",
				imgStr = "",
				id = "",
				str = "";

			// loop through and add all consumables
			for (var i = 0; i < consumables.length; i++) {
				/*jshint loopfunc: true */
				if (DEBUG) console.log("🍪 Consumable.add()", i, consumables[i]);

				// new position
				randomPos = Core.returnRandomPositionFull('', 100, 100, "below-the-fold");
				css = "left:" + randomPos.x + "px;top:" + randomPos.y + "px;";
				if (DEBUG) console.log("🍪 Consumable.add()", randomPos, css);

				// html
				imgStr = chrome.extension.getURL('assets/img/consumables/' + consumables[i].type + "/" + consumables[i].img);
				id = 'tally_consumable_' + i;
				str = "<div data-consumable='" + i + "' class='tally_consumable_inner' id='" + id + "' style='" + css + "'>" +
					"<img src='" + imgStr + "'></div>";
				$('.tally_consumable_wrapper').append(str);

				// add listeners
				$(document).on("mouseover", "#" + id, function() {
					//if (DEBUG) console.log($(this));
					hover($(this).attr("data-consumable"));
				});
				$(document).on("click", "#" + id, function() {
					// Math.random so gif replays
					let img = chrome.extension.getURL('assets/img/consumables/consumable-explosion.gif?' + Math.random());
					$(this).html("<img src='" + img + "'>");
					setTimeout(function() {
						// remove
						$(this).remove();
					}, 500);
					collect($(this).attr("data-consumable"));
				});
			}
		} catch (err) {
			console.error(err);
		}
	}
	/**
	 * 	4. user hovers over consumable
	 */
	function hover(key) {
		let consumable = consumables[key];
		//if (DEBUG) console.log("🍪 Consumable.hover()", key, consumable);
		if (!hovered) {
			// tell them
			Dialogue.showStr("Oh, you found " + consumable.ref + " " + consumable.name + " " + consumable.type + "!", consumable.sound, true);
			if (consumable.name == "fortune")
				Dialogue.showStr("Feeling lucky?", consumable.sound, false);
		}
		// only show hover message once
		hovered = true;
	}

	/**
	 *	5. user clicks a consumable
	 */
	function collect(key) {
		try {
			let consumable = consumables[key];
			//if (DEBUG) console.log("🍪 Consumable.collect()", key, consumable);
			// play sound
			Sound.playRandomPowerup();
			// save in background and on server
			TallyStorage.saveTallyUser("consumables", consumable, "🍪 Consumables.collect()");
			TallyStorage.addToBackgroundUpdate("itemData", "consumables", consumable, "🍪 Consumables.collect()");
			// delay then update stats
			setTimeout(function() {
				// update stats
				Stats.updateFromConsumable(consumable);
				// hide
				$('.tally_consumable_wrapper').html("");
			}, 700);
		} catch (err) {
			console.error(err);
		}
	}




	// PUBLIC
	return {
		randomizer: randomizer,
		create: function(type, name, num) {
			create(type, name, num);
		},
		add: add,
	};
})();
