"use strict";

/*  CONSUMABLE
 ******************************************************************************/

window.Consumable = (function() {
	// PRIVATE

	let consumables = [],
		hovered = false,
		types = {
			"cookies": {
				"health": {
					"name": "health",
					"type":"cookie",
					"img": "cookie-dots.gif",
					"val": FS_Number.round(Math.random()*0.2,2),
					"stat": "health",
					"sound": "happy",
				},
				"stamina": {
					"name": "stamina",
					"type":"cookie",
					"img": "cookie-waffle.gif",
					"val": FS_Number.round(Math.random()*0.2,2),
					"stat": "stamina",
					"sound": "happy",
				},
				"fortune": {
					"name": "fortune",
					"type":"cookie",
					"img": "cookie-fortune.gif",
					"val": FS_Number.round(FS_Number.randomPosNeg(0.2),2),
					"stat": randomObjKey(Stats.resetStats),
					"sound": "cautious",
				},
				"bad": {
					"name": "bad",
					"type":"cookie",
					"img": "cookie-bad.gif",
					"val": -FS_Number.round(Math.random()*0.2,2),
					"stat": randomObjKey(Stats.resetStats),
					"sound": "danger",
				}
			}
		};

	/**
	 *	1. determine if we will generate a consumable on this page
	 */
	function randomizer() {
		let r = Math.random();
		if (r > 0.5)
			create();
		else
			return false;
	}
	/**
	 *	2. if so, then make a new one from list
	 */
	function create() {
		if (!pageData.activeOnPage || tally_options.gameMode !== "full") return;
		console.log("Consumable.create()",tally_options.gameMode);
		console.log(types[randomObjKey(types)]);
		consumables.push(randomObjProperty(types[randomObjKey(types)]));
		// testing
		//consumables.push(types.fortune);
		console.log(consumables);
		add();
	}
	/**
	 *	3. add consumable to a page
	 */
	function add() {
		// loop through and add all consumables
		for (var i=0; i<10; i++){
			// new position
			let x = Math.ceil(Math.random() * (pageData.browser.width - 100)),
				y = Math.ceil(Math.random() * (pageData.browser.height - 100));
			let css = "left:" + x + "px;top:" + y + "px;";
			// html
			let imgStr = chrome.extension.getURL('assets/img/consumables/' + consumables[i].type + "s/" + consumables[i].img);
			let str = "<div class='tally_consumable_inner' style='" + css + "'><img data-consumable='"+ i +"' src='" + imgStr + "'></div>";
			$('.tally_consumable_wrapper').html(str);
			$(document).on("mouseover", ".tally_consumable_inner img", function() {
				//console.log($(this))
				hover($(this).attr("data-consumable"));
			});
			$(document).on("click", ".tally_consumable_inner img", function() {
				// remove consumable
				let imgStr = chrome.extension.getURL('assets/img/consumables/consumable-explosion.gif');
				let str = "<div class='tally_consumable_inner' style='" + css + "'><img data-consumable='"+ i +"' src='" + imgStr + "'></div>";
				$('.tally_consumable_wrapper').html(str);
				setTimeout(function() {
					// remove
					$('.tally_consumable_wrapper').html("");
				}, 500);
				collect($(this).attr("data-consumable"));
			});
		}
	}
	/**
	 * 	4. user hovers over consumable
	 */
	function hover(key) {
		let consumable = consumables[key];
		console.log("Consumable.hover()", key, consumable);
		if (!hovered){
			// tell them
			Thought.showString("Oh, you found a " + consumable.name + " " + consumable.type + "!", consumable.sound, true);
		}
		// only show hover message once
		hovered = true;
	}

	/**
	 *	5. user clicks a consumable
	 */
	function collect(key) {
		let consumable = consumables[key];
		console.log("Consumable.collect()", key, consumable);
		// play sound
		Sound.playRandomPowerup();


		// create backgroundUpdate object
		var backgroundUpdate = newBackgroundUpdate();
		// store the data
		backgroundUpdate.consumable = consumable;
		// then push to the server
		sendBackgroundUpdate(backgroundUpdate);


		// delay then update stats
		setTimeout(function() {
			// update stats
			Stats.update(consumable);
		}, 700);
	}




	// PUBLIC
	return {
		randomizer: randomizer,
		create: create,
		add: add,
	};
})();
