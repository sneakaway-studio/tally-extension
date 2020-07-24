"use strict";

/*  CONSUMABLE
 ******************************************************************************/

window.Consumable = (function () {
	// PRIVATE

	let DEBUG = Debug.ALL.Consumable,
		consumables = [],
		hovered = false
		;



	/**
	 *	0. Get consumable or new empty random one (from ConsumableData)
	 */
	function get(slug = "", type = "") {
		try {
			let consumable = {},
				safety = 0;
			// if slug is set
			if (slug && slug !== "") {
				consumable = ConsumableData.data[slug];
			}
			// if only type is set
			else if (slug && slug !== "") {
				consumable = FS_Object.randomObjProperty(ConsumableData.data);
				while (consumable.type !== type) {
					if (++safety > 30) {
						console.log("🧰 TallyMain SAFETY FIRST!");
						break;
					}
					// try again
					consumable = FS_Object.randomObjProperty(ConsumableData.data);
				}
			}
			// nothing set
			else {
				//select a new random consumable and populate with data
				consumable = FS_Object.randomObjProperty(ConsumableData.data);
			}

			// after selecting...
			consumable.val = Number(consumable.val);

			// SET STAT
			if (consumable.stat === "r" || consumable.stat === "") {
				consumable.stat = randomObjKey(Stats.resetStatsAll);
			}
			// SET VALUE
			if (consumable.val == 0 || consumable.val == "") {
				if (!consumable.min) consumable.min = 0;
				if (!consumable.max) consumable.max = 0;

				safety = 0;
				while (consumable.val == 0 || isNaN(consumable.val)) {
					if (++safety > 30) {
						console.log("🧰 TallyMain SAFETY FIRST!");
						break;
					}
					consumable.val = FS_Number.round(FS_Number.randomFloatBetween(consumable.min, consumable.max), 4);
				}
			}

			// if (DEBUG) console.log('🍪 Consumable.get() consumable =', consumable);

			return consumable;
		} catch (err) {
			console.error(err);
		}
	}




	/**
	 *	1. determine if we will generate a consumable on this page
	 */
	function randomizer() {
		try {
			// allow offline
			if (Page.data.mode.notActive) return;
			// don't allow if mode disabled or stealth
			if (T.tally_options.gameMode === "disabled" || T.tally_options.gameMode === "stealth") return;

			let countR = Math.random(), // whether to create a consumable
				r = Math.random(), // whether to create consumable of type
				type = "", // default type
				count = 1, // number to create
				chosen = false;


			// test
			// create("", "", 10);
			// return;


			// add three on one page every 1000 loads
			if (countR < 0.001) count = 3;
			// add two on one page every 200 loads
			else if (countR < 0.005) count = 2;

			// pick random from type
			if (r < 0.05) create("cookie", "", count);
			else if (r < 0.06) create("data", "", count);
			else if (r < 0.07) create("marketing", "", count);
			// pick random type
			else if (r < 0.08) create("", "", count);
			// gameMode === testing
			else if (r < 0.4 && ["demo", "testing"].includes(T.tally_options.gameMode))
				// create("marketing", "", 1);
				create("cookie", "", 1);

		} catch (err) {
			console.error(err);
		}
	}
	/**
	 *	2. if so, then make a new one from list
	 */
	function create(slug = "", type = "", count = 1) {
		try {
			// // make sure there is a type
			// if (type === "") return;

			if (DEBUG) Debug.dataReportHeader("🍪 Consumable.create()", "#", "before");
			if (DEBUG) console.log("🍪 Consumable.create()", "type=" + type, "name=" + name, "count=" + count);

			// store the consumable
			let consumable = {};
			for (var i = 0; i < count; i++) {

				consumable = get(slug,type);

				// if a consumable was selected push it to array
				if (consumable != {}) consumables.push(consumable);

				if (DEBUG) console.log("🍪 Consumable.create()", type, i + "/" + count, consumable);
			}
			if (DEBUG) console.log("🍪 Consumable.create()", consumables);
			// add all the consumables
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

				if (!consumables[i].ext) continue;

				// new position
				randomPos = Core.returnRandomPositionFull('', 100, 100, "below-the-fold");
				css = "left:" + randomPos.x + "px;top:" + randomPos.y + "px;";
				if (DEBUG) console.log("🍪 Consumable.add()", randomPos, css);

				// html
				imgStr = chrome.extension.getURL('assets/img/consumables/' + consumables[i].type + "/" + consumables[i].slug + consumables[i].ext);
				id = 'tally_consumable_' + i;
				str = "<div data-consumable='" + i + "' class='tally_consumable_inner' id='" + id + "' style='" + css + "'>";
				str += "<img src='" + imgStr + "'";
				// make clouds semi-transparent
				if (consumables[i].name == "cloud") {
					str += " style='opacity:.7';";
				}
				str += "></div>";
				$('.tally_consumable_wrapper').append(str);

				// add listeners
				$(document).on("mouseover", "#" + id, function () {
					//if (DEBUG) console.log($(this));
					hover($(this).attr("data-consumable"));
				});
				$(document).on("click", "#" + id, function () {
					// Math.random so gif replays
					let img = chrome.extension.getURL('assets/img/consumables/consumable-explosion.gif?' + Math.random());
					$(this).html("<img src='" + img + "'>");
					setTimeout(function () {
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
			Dialogue.showStr("Oh, " + consumable.ref + " " + consumable.name + " " + consumable.type + "!", consumable.sound);
			if (consumable.name == "fortune")
				Dialogue.showData({
					"text": "Feeling lucky?",
					"mood": consumable.sound
				}, {
					addIfInProcess: false
				});
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
			// update progress
			Progress.update("consumables", count("all"));
			if (consumable.type == "cookie") Progress.update("cookies", count("cookie"));
			// save in background (and on server)
			TallyData.queue("itemData", "consumables", consumable, "🍪 Consumables.collect()");
			// delay then update stats
			setTimeout(function () {
				// update stats
				Stats.updateFromConsumable(consumable);
				// hide
				$('.tally_consumable_wrapper').html("");
			}, 700);
		} catch (err) {
			console.error(err);
		}
	}

	function count(type = "all") {
		try {
			// console.log("🍪 Consumable.count()", type, T.tally_user.consumables);
			// console.log("🍪 Consumable.count() T.tally_user.progress.consumables", T.tally_user.progress.consumables);
			// console.log("🍪 Consumable.count() T.tally_user.progress.cookies", T.tally_user.progress.cookies);

			// start by counting the new one
			let total = 1;
			for (var i in T.tally_user.consumables) {
				// if (DEBUG) console.log("🍪 Consumable.count()", type, i, T.tally_user.consumables[i]);
				if (type == "all" || T.tally_user.consumables[i].type == type) {
					total += T.tally_user.consumables[i].count;
				}
			}
			return total;
		} catch (err) {
			console.error(err);
		}
	}








	// PUBLIC
	return {
		get: get,
		randomizer: randomizer,
		add: add,
	};
})();
