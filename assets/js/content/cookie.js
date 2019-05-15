"use strict";

/*  COOKIE
 ******************************************************************************/

window.Cookie = (function() {
	// PRIVATE

	let cookie = {};

	var types = {
		"health": {
			"img": "cookie-dots.gif",
			"value": Math.random(),
			"stat": "hp",
		},
		"stamina": {
			"img": "cookie-waffle.gif",
			"value": Math.random(),
			"stat": "mp",
		}
	};

	// 1. determine if we will generate a cookie on this page
	function randomizer() {
		let r = Math.random();
		if (r > 0.5)
			create();
		else
			return false;
	}
	// 2. if so, then make a new one from list
	function create() {
		var obj = randomObjProperty(types);
		cookie = obj;
		add();
	}
	// 3. add cookie to a page
	function add() {
		// position
		let x = Math.ceil(Math.random() * (pageData.browser.width-100)),
			y = Math.ceil(Math.random() * (pageData.browser.height-100));
		let css = "left:" + x + "px;top:" + y + "px;";
		// html
		let str = "<div class='tally_cookie_inner' style='" + css + "'>" +
			"<img src='" + chrome.extension.getURL('assets/img/cookies/' + cookie.img) + "'></div>";
		$('.tally_cookie_wrapper').html(str);
		$(document).on("click", ".tally_cookie_inner", function() {
			console.log(cookie);
			let str = "<div class='tally_cookie_inner' style='" + css + "'>" +
				"<img src='" + chrome.extension.getURL('assets/img/cookies/cookie-explosion.gif') +"'></div>";
			$('.tally_cookie_wrapper').html(str);
			Tally.updateStats({
				"stat": cookie.stat,
				"val": cookie.val
			});
		});
	}

	// user has clicked a cookie
	function pickup() {

	}

	// use the cookie
	function use() {

	}







	// PUBLIC
	return {
		randomizer: randomizer,
		create: create,
		add: add,
	};
})();
