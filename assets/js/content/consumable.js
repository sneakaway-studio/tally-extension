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
		if (r < 0.1)
			create(2);
		else if (r < 0.5)
			create();
		else
			return false;
	}
	/**
	 *	2. if so, then make a new one from list
	 */
	function create(num=1) {
		try {
			for (var i=0; i<=num; i++){
				if (!pageData.activeOnPage || tally_options.gameMode !== "full") return;
				//console.log("Consumable.create() gameMode="+tally_options.gameMode);
				consumables.push(randomObjProperty(types[randomObjKey(types)]));
				// testing
				//consumables.push(types.cookie.fortune);
			}
			//console.log(consumables);
			add();
		} catch (err) {
			console.error(error);
		}
	}
	/**
	 *	3. add consumable to a page
	 */
	function add() {
		try {
			// loop through and add all consumables
			for (var i=0; i<consumables.length; i++){
				// new position
				let x = Math.ceil(Math.random() * (pageData.browser.width - 100)),
					y = Math.ceil(Math.random() * (pageData.browser.fullHeight - 100));
				let css = "left:" + x + "px;top:" + y + "px;";
				// html
				let imgStr = chrome.extension.getURL('assets/img/consumables/' + consumables[i].type + "s/" + consumables[i].img);
				let ref = 'tally_consumable_'+ i;
				let str = "<div data-consumable='"+ i +"' class='tally_consumable_inner "+ref+"' style='" + css + "'>"+
						  "<img src='" + imgStr + "'></div>";
				$('.tally_consumable_wrapper').append(str);
				// add listeners
				$(document).on("mouseover", "."+ref, function() {
					//console.log($(this));
					hover($(this).attr("data-consumable"));
				});
				$(document).on("click", "."+ref, function() {
					// Math.random so gif replays
					let imgStr = chrome.extension.getURL('assets/img/consumables/consumable-explosion.gif?' + Math.random());
					let str ="<img src='" + imgStr + "'>";
					$("."+ref).html(str);
					setTimeout(function() {
						// remove
						$("."+ref).remove();
					}, 111500);
					collect($(this).attr("data-consumable"));
				});
			}
		} catch (err) {
			console.error(error);
		}
	}
	/**
	 * 	4. user hovers over consumable
	 */
	function hover(key) {
		let consumable = consumables[key];
		//console.log("Consumable.hover()", key, consumable);
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
		//console.log("Consumable.collect()", key, consumable);
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
