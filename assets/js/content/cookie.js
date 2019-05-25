"use strict";

/*  COOKIE
 ******************************************************************************/

window.Cookie = (function() {
	// PRIVATE

	let cookie = {},
		hovered = false;

	var types = {
		"health": {
			"name": "health",
			"img": "cookie-dots.gif",
			"val": FS_Number.round(Math.random()*0.2,2),
			"stat": "health",
			"sound": "happy",
		},
		"stamina": {
			"name": "stamina",
			"img": "cookie-waffle.gif",
			"val": FS_Number.round(Math.random()*0.2,2),
			"stat": "stamina",
			"sound": "happy",
		},
		"fortune": {
			"name": "fortune",
			"img": "cookie-fortune.gif",
			"val": FS_Number.round(FS_Number.randomPosNeg(0.2),2),
			"stat": randomObjKey(Stats.resetStats),
			"sound": "cautious",
		},
		"bad": {
			"name": "bad",
			"img": "cookie-bad.gif",
			"val": -FS_Number.round(Math.random()*0.2,2),
			"stat": randomObjKey(Stats.resetStats),
			"sound": "danger",
		}
	};
	/**
	 *	1. determine if we will generate a cookie on this page
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
		//console.log("Cookie.create()",tally_options.gameMode);
		cookie = randomObjProperty(types);
		// testing
		//cookie = types.fortune;
		//console.log(cookie)
		add();
	}
	/**
	 *	3. add cookie to a page
	 */
	function add() {
		// position
		let x = Math.ceil(Math.random() * (pageData.browser.width - 100)),
			y = Math.ceil(Math.random() * (pageData.browser.height - 100));
		let css = "left:" + x + "px;top:" + y + "px;";
		// html
		let str = "<div class='tally_cookie_inner' style='" + css + "'>" +
			"<img src='" + chrome.extension.getURL('assets/img/cookies/' + cookie.img) + "'></div>";
		$('.tally_cookie_wrapper').html(str);

		$(document).on("mouseover", ".tally_cookie_inner img", function() {
			hover(cookie);
		});
		$(document).on("click", ".tally_cookie_inner", function() {
			// remove cookie
			let str = "<div class='tally_cookie_inner' style='" + css + "'>" +
				"<img src='" + chrome.extension.getURL('assets/img/cookies/cookie-explosion.gif') + "'></div>";
			$('.tally_cookie_wrapper').html(str);
			setTimeout(function() {
				// remove
				$('.tally_cookie_wrapper').html("");
			}, 500);
			collect();
		});
	}
	/**
	 * 	4. user hovers over cookie
	 */
	function hover() {
		console.log("Cookie.hover()", cookie);
		if (!hovered){
			// tell them
			Thought.showString("Oh, you found a " + cookie.name + " cookie!", cookie.sound, true);
		}
		// only show hover message once
		hovered = true;
	}

	/**
	 *	5. user clicks a cookie
	 */
	function collect() {
		console.log("Cookie.collect()", cookie);
		// play sound
		Sound.playRandomPowerup();


		// create backgroundUpdate object
		var backgroundUpdate = newBackgroundUpdate();
		// store the data
		backgroundUpdate.cookie = cookie;
		// then push to the server
		sendBackgroundUpdate(backgroundUpdate);


		// delay then update stats
		setTimeout(function() {
			// update stats
			Stats.update(cookie);
		}, 700);
	}




	// PUBLIC
	return {
		randomizer: randomizer,
		create: create,
		add: add,
	};
})();
