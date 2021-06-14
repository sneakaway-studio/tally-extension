"use strict";

/*  CONSUMABLE
 ******************************************************************************/

window.Consumable = (function() {
	// PRIVATE

	let DEBUG = Debug.ALL.Consumable,
		consumables = [],
		hovered = false,
		statsToAffect = [
			'accuracy',
			'stamina',
			'health',
			'evasion'
		],
		types = [
			"algorithm",
			"boots",
			"bug",
			"cake",
			"cookie",
			"data",
			"marketing",
			"packet",
			"pattern",
			"potion",
		];



	/**
	 *	0. Get consumable or new empty random one (from ConsumableData)
	 */
	function get(slug = "", type = "") {
		try {
			let consumable = {},
				safety = 0;

			if (DEBUG) console.log('🍪 Consumable.get() [] slug =', slug, 'type =', type);

			// if slug is set
			if (slug && slug !== "") {
				consumable = ConsumableData.data[slug];
			}
			// if only type is set
			else if (type && type !== "") {
				// select a random consumable
				consumable = FS_Object.randomObjProperty(ConsumableData.data);
				// loop until the random matches the type we want
				while (consumable.type !== type) {
					if (++safety > 30) {
						console.log("🍪 Consumable.get() SAFETY FIRST!");
						break;
					}
					// try again
					consumable = FS_Object.randomObjProperty(ConsumableData.data);
				}
			}
			// if no specific slug or type then
			else {
				// select a new random consumable
				consumable = FS_Object.randomObjProperty(ConsumableData.data);
			}

			// after selecting, make sure everything is a number
			consumable.val = Number(consumable.val) || 0;
			consumable.max = Number(consumable.max) || 0;
			consumable.min = Number(consumable.min) || 0;

			// if stat is set to r
			if (!consumable.stat || consumable.stat === "" || consumable.stat === "r") {
				// select ranndom stat
				consumable.stat = FS_Object.randomArrayIndex(statsToAffect);
			}

			// reset safety
			safety = 0;
			// if val is not set or if it is too close to zero
			while (consumable.val === 0 || FS_Number.round(consumable.val, 2) === 0) {
				consumable.val = FS_Number.round(FS_Number.randomFloatBetween(consumable.min, consumable.max), 4);
				// if (DEBUG) console.log('🍪 Consumable.get() [2] consumable =', consumable);
				if (++safety > 30) {
					console.log("🍪 Consumable.get()  SAFETY FIRST!");
					break;
				}
			}

			if (DEBUG) console.log('🍪 Consumable.get() [3] consumable =', consumable);

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

			if (DEBUG) console.log('🍪 Consumable.randomizer()');

			let count = 1, // number to create
				rCount = Math.random(), // whether to create a consumable
				type = "", // default type to create
				r = Math.random() // whether to create consumable of type
			;


			// test
			// create("", "", 10);
			// create("", "data", 2);
			// return;


			// HOW MANY TO CREATE?

			// add three on one page every 1000 loads
			if (rCount < 0.001) count = 3;
			// add two on one page every 200 loads
			else if (rCount < 0.005) count = 2;

			// SHOULD WE CREATE?

			// 8%
			if (r < 0.08) {
				// pick random type
				type = FS_Object.randomArrayIndex(types);
				// create
				create("", type, count);
			}
			// gameMode === testing
			else if (["demo", "testing"].includes(T.tally_options.gameMode))
				// create("marketing", "", 1);
				create("", "cookie", 1);

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
			if (DEBUG) console.log("🍪 Consumable.create()", "slug=" + slug, "type=" + type, "count=" + count);

			// store the consumable
			let consumable = {};
			for (var i = 0; i < count; i++) {

				consumable = get(slug, type);

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
				css = "left:" + randomPos.x + "px;top:" + randomPos.y + "px;z-index:999999999999999;";
				if (DEBUG) console.log("🍪 Consumable.add()", randomPos, css);

				// html
				imgStr = browser.runtime.getURL('assets/img/consumables/' + consumables[i].slug + consumables[i].ext);
				id = 'tally_consumable_' + i;
				str = "<div data-consumable='" + i + "' class='tally_consumable_inner " + consumables[i].type +
					"' id='" + id + "' style='" + css + "'>";
				str += "<img src='" + imgStr + "'";
				// make clouds semi-transparent
				if (consumables[i].name == "cloud") {
					str += " style='opacity:.7';";
				}
				str += "></div>";
				$('.tally_consumable_wrapper').append(str);

				// add listeners
				$(document).on("mouseover", "#" + id, function() {
					// so that we know player engaged on this page load
					Page.data.actions.userInteractingWithGame = true;
					//if (DEBUG) console.log($(this));
					hover($(this).attr("data-consumable"));
				});
				$(document).on("click", "#" + id, function() {
					// so that we know player engaged on this page load
					Page.data.actions.userInteractingWithGame = true;

					// Math.random so gif replays
					let img = browser.runtime.getURL('assets/img/consumables/consumable-explosion.gif?' + Math.random());
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
	function hover(index) {
		let consumable = consumables[index];
		//if (DEBUG) console.log("🍪 Consumable.hover()", index, consumable);
		if (!hovered) {
			// tell them
			Dialogue.showStr("Oh, " + consumable.ref + " " + consumable.name + " " + consumable.type + "!", consumable.sound);

			let dia1 = Dialogue.getData({
				category: "consumable",
				subcategory: consumable.slug
			});
			let dia2 = Dialogue.getData({
				category: "consumable",
				subcategory: consumable.type
			});
			// if dialogue for slug exists (more specific)
			if (dia1)
				Dialogue.showData(dia1, {
					addIfInProcess: false
				});
			// if dialogue for type exists
			else if (dia2)
				Dialogue.showData(dia1, {
					addIfInProcess: false
				});

		}
		// only show hover message once
		hovered = true;
	}

	/**
	 *	5. user clicks a consumable
	 */
	function collect(index) {
		try {
			let consumable = consumables[index];
			//if (DEBUG) console.log("🍪 Consumable.collect()", index, consumable);
			// play sound
			Sound.playRandomPowerup();
			// update progress
			Progress.update("consumables", count("all"));
			if (consumable.type == "cookie") Progress.update("cookies", count("cookie"));
			// save in background (and on server)
			TallyData.queue("itemData", "consumables", consumable, "🍪 Consumables.collect()");
			// delay then update stats
			setTimeout(function() {
				// update stats
				Stats.updateFromConsumable(consumable);
				// hide
				// $('.tally_consumable_wrapper').html("");
				// hide one
				$('.' + consumable.slug).remove();
			}, 700);
		} catch (err) {
			console.error(err);
		}
	}

	/**
	 *	Count all collected consumables
	 */
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
