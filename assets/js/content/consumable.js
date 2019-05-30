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
					"ref":"a",
					"img": "cookie-dots.gif",
					"val": FS_Number.round(Math.random()*0.2,2),
					"stat": "health",
					"sound": "happy",
				},
				"stamina": {
					"name": "stamina",
					"type":"cookie",
					"ref":"a",
					"img": "cookie-waffle.gif",
					"val": FS_Number.round(Math.random()*0.2,2),
					"stat": "stamina",
					"sound": "happy",
				},
				"fortune": {
					"name": "fortune",
					"type":"cookie",
					"ref":"a",
					"img": "cookie-fortune.gif",
					"val": FS_Number.round(FS_Number.randomPosNeg(0.2),2),
					"stat": randomObjKey(Stats.resetStats),
					"sound": "cautious",
				},
				"bad": {
					"name": "bad",
					"type":"cookie",
					"ref":"a",
					"img": "cookie-bad.gif",
					"val": -FS_Number.round(Math.random()*0.2,2),
					"stat": randomObjKey(Stats.resetStats),
					"sound": "danger",
				}
			},
			"junk": {
				"data": {
					"name": "data",
					"type":"junk",
					"ref":"some",
					"img": "junk-data.gif",
					"val": -FS_Number.round(Math.random()*0.2,2),
					"stat": "stamina",
					"sound": "cautious",
				},
			}
		};

	/**
	 *	1. determine if we will generate a consumable on this page
	 */
	function randomizer() {
		try {
			let r = Math.random();
			if (r < 0.01)
				create(3);
			else if (r < 0.05)
				create(2);
			else if (r < 0.5)
				create(1);
			else
				return false;
		} catch (err) {
			console.error(err);
		}
	}
	/**
	 *	2. if so, then make a new one from list
	 */
	function create(num=1) {
		try {
			for (var i=0; i<num; i++){
				if (!pageData.activeOnPage || tally_options.gameMode !== "full") return;
				//console.log("Consumable.create() gameMode="+tally_options.gameMode);
				consumables.push(FS_Object.randomObjProperty(types[randomObjKey(types)]));
				// testing
				//consumables.push(types.cookie.fortune);
			}
			//console.log(consumables);
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
			// loop through and add all consumables
			for (var i=0; i<consumables.length; i++){
				/*jshint loopfunc: true */
				//console.log("Consumable.add()",i);
				// new position
				let randomPos = Core.returnRandomPositionFull();
				let css = "left:" + randomPos.x + "px;top:" + randomPos.y + "px;";
				//console.log("Core.add()",randomPos,css);
				// html
				let imgStr = chrome.extension.getURL('assets/img/consumables/' + consumables[i].type + "/" + consumables[i].img);
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
		//console.log("Consumable.hover()", key, consumable);
		if (!hovered){
			// tell them
			Thought.showString("Oh, you found " + consumable.ref + " " + consumable.name + " " + consumable.type + "!", consumable.sound, true);
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
			//console.log("Consumable.collect()", key, consumable);
			// play sound
			Sound.playRandomPowerup();


			// create backgroundUpdate object
			var backgroundUpdate = TallyStorage.newBackgroundUpdate();
			// store the data
			backgroundUpdate.consumable = consumable;
			// then push to the server
			sendBackgroundUpdate(backgroundUpdate);


			// delay then update stats
			setTimeout(function() {
				// update stats
				Stats.update(consumable);
			}, 700);
		} catch (err) {
			console.error(err);
		}
	}




	// PUBLIC
	return {
		randomizer: randomizer,
		create: create,
		add: add,
	};
})();
