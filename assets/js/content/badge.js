"use strict";

/*  BADGE
 ******************************************************************************/

window.Badge = (function() {
	// PRIVATE

	let DEBUG = false,
		hovered = false,
		types = {

			"stalker": {
				"name": "stalker",
				"type": "badge",
				"ref": "a",
				"img": "social-stalker.gif",
				"val": FS_Number.round(Math.random() * 10, 0),
				"sound": "cautious",
			},
			"night owl": {
				"name": "night owl",
				"type": "badge",
				"ref": "a",
				"img": "worker-nightowl.gif",
				"val": FS_Number.round(Math.random() * 10, 0),
				"sound": "happy",
			}

		};

	/**
	 *	1. determine if we will generate a badge on this page
	 */
	function randomizer() {
		try {
			// don't display badge if display is off
			if (!pageData.activeOnPage || tally_options.gameMode !== "full") return;

			let r = Math.random(), // whether to create badge of type
				chosen = false;

			// testing
			//return create("stalker");
			//return create("night owl");

			// SOCIAL DOMAINS
			if (GameData.socialDomains.indexOf(pageData.domain) > -1) {
				//if (DEBUG) console.log("social domain");
				if (r < 0.01) return create("stalker");
			}
			// 9a-5p busy bee
			else if (FS_Date.isWorkday()) {
				//if (DEBUG) console.log('9a-5p busy bee');
				//if (r < 0. 1) return create("busy bee");
			}
			// 10p–6a night owl
			else if (FS_Date.isNight()) {
				//if (DEBUG) console.log('10p–6a night owl')
				if (r < 0.01) return create("night owl");
			}


		} catch (err) {
			console.error(err);
		}
	}
	/**
	 *	2. if so, then make a new one from list
	 */
	function create(name = "") {
		try {
			if (DEBUG) console.log("Badge.create()", name);

			// if name is set
			if (name !== "") add(types[name]);

		} catch (err) {
			console.error(err);
		}
	}
	/**
	 *	3. add badge to a page
	 */
	function add(badge) {
		try {
			if (DEBUG) console.log("Badge.add()", badge);
			if (!prop(badge.name) && badge.name === "") return;

			let randomPos = [],
				imgStr = "",
				id = "",
				str = "";

			// new position
			randomPos = Core.returnRandomPositionFull('', 100, 100);

			//if (DEBUG) console.log("Core.add()",randomPos,css);
			// html
			imgStr = chrome.extension.getURL('assets/img/badges/' + badge.img);
			id = badge.name.replace(" ","_") + '_badge';
			str = "<div data-badge='" + badge.name + "' class='tally tally_badge_inner' id='" + id + "'>" +
				"<img src='" + imgStr + "'></div>";
			$('.tally_badge').html(str);
			$('.tally_badge').css({
				"left": randomPos.x + "px",
				"top": randomPos.y + "px"
			});

			// add floating animation
			anime({
				targets: ".tally_badge",
				translateY: 5,
				// scale: 1.05,
				direction: 'alternate',
				loop: true,
				easing: 'easeInOutSine'
			});

			// add listeners
			$(document).on("mouseover", "#" + id, function() {
				if (DEBUG) console.log($(this));
				hover($(this).attr("data-badge"));
			});
			$(document).on("click", "#" + id, function() {
				if (DEBUG) console.log($(this));
				// Math.random so gif replays
				let img = chrome.extension.getURL('assets/img/consumables/consumable-explosion.gif?' + Math.random());
				$(this).html("<img src='" + img + "'>");
				setTimeout(function() {
					// remove
					$(this).remove();
				}, 500);
				collect($(this).attr("data-badge"));
			});

		} catch (err) {
			console.error(err);
		}
	}
	/**
	 * 	4. user hovers over badge
	 */
	function hover(key) {
		let badge = types[key];
		//if (DEBUG) console.log("Badge.hover()", key, badge);
		if (!hovered) {
			// tell them
			Dialogue.showStr("Oh, you found " + badge.ref + " " + badge.name + " badge!", badge.sound, true);
		}
		Dialogue.showStr("Click to collect the badge!", badge.sound, true);
		// only show hover message once
		hovered = true;
	}

	/**
	 *	5. user clicks a badge
	 */
	function collect(key) {
		try {
			let badge = types[key];
			//if (DEBUG) console.log("Badge.collect()", key, badge);
			// play sound
			Sound.playRandomPowerup();

			// create backgroundUpdate object
			var backgroundUpdate = TallyStorage.newBackgroundUpdate();
			// store the data
			backgroundUpdate.badge = badge;
			// then push to the server
			sendBackgroundUpdate(backgroundUpdate);

		} catch (err) {
			console.error(err);
		}
	}




	// PUBLIC
	return {
		randomizer: randomizer,
		create: function(name) {
			create(name);
		},
		add: add,
	};
})();
