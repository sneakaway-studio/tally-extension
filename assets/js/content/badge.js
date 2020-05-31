"use strict";

/*  BADGE
 ******************************************************************************/

window.Badge = (function() {
	// PRIVATE

	let DEBUG = Debug.ALL.Badge;


	/**
	 *	0. Get badge (from player) or return new empty badge (from BadgeData)
	 */
	function get(name) {
		try {
			if (tally_user.badges == {} || FS_Object.objLength(tally_user.badges) < 1) return BadgeData.data[name];
			if (tally_user.badges[name]) return tally_user.badges[name];
		} catch (err) {
			console.error(err);
		}
	}

	/**
	 *	1. determine if player has earned a new badge
	 */
	function check() {
		try {
			// do not allow offline
			if (!Page.mode().active) return;
			// don't allow if mode disabled or stealth
			if (tally_options.gameMode === "disabled" || tally_options.gameMode === "stealth") return;

			// vars for checks below
			let currentBadge, newBadgeLevel;
			var startNewCheck = function(name) {
				currentBadge = get(name);
				newBadgeLevel = 0;
			};


			/////////////// SOCIAL DOMAINS

			// if on a social domain
			// if (GameData.socialDomains.indexOf(Page.data.domain) > -1) {

			/////////////// SOCIAL DOMAINS -> filter-bubble

			// start new check; get current badge (or a new default badge)
			startNewCheck("filter-bubble");
			// get new badge level
			newBadgeLevel = Math.round((tally_user.score.likes / 5));
			// compare levels
			if (newBadgeLevel > currentBadge.level) {

				console.log("🏆 Badge.check()", "behind on badge");

				// set new level
				currentBadge.level = newBadgeLevel;


				award(currentBadge);
			}
			// report
			console.log("🏆 Badge.check()",
				"type =", currentBadge.type,
				"currentBadge =", currentBadge,
				"currentBadge.level =", currentBadge.level,
				"newBadgeLevel =", newBadgeLevel,

			);









				// if (r < 0.01) return create("stalker");
				// gameMode === testing
				// else if (["demo", "testing"].includes(tally_options.gameMode)) return create("stalker");

			// } // END SOCIAL DOMAINS






			//
			//
			//
			//
			// // 9a-5p busy bee
			// else if (FS_Date.isWorkday()) {
			// 	if (DEBUG) console.log('🏆 Badge.check() type = 9a-5p busy bee');
			// 	//if (r < 0. 1) return create("busy bee");
			// }
			//
			//
			// // 10p–6a night owl
			// else if (FS_Date.isNight()) {
			// 	if (DEBUG) console.log('🏆 Badge.check() type = 10p–6a night owl');
			// 	// return create("night-owl");
			// 	// gameMode === testing
			// 	// else if (["demo", "testing"].includes(tally_options.gameMode)) return create("night-owl");
			// }


		} catch (err) {
			console.error(err);
		}
	}






	/**
	 *	Award to player and save in background
	 */
	function award(badge = "") {
		try {
			if (!prop(badge) || !prop(badge.name) || badge.name === "") return console.error(badge);

			if (DEBUG) console.log("🏆 Badge.award()", badge);


			Dialogue.showData({
				text: "You earned a level " + badge.ref + " " + badge.level + " " + badge.name + " badge!",
				mood: badge.sound
			}, {
				instant: true
			});

			// update progress
			Progress.update("attacksAwarded", FS_Object.objLength(tally_user.attacks));

			// // play sound
			// Sound.playRandomPowerup();
			// save in background (and on server)
			TallyData.handle("itemData", "badges", badge, "🏆 Badge.award()");



		} catch (err) {
			console.error(err);
		}
	}




	// /**
	//  *	2. if so, then make a new one from list
	//  */
	// function create(name = "") {
	// 	try {
	// 		if (DEBUG) console.log("🏆 Badge.create()", name);
	//
	// 		// if name is set
	// 		if (name !== "") add(name);
	//
	// 	} catch (err) {
	// 		console.error(err);
	// 	}
	// }
	// /**
	//  *	3. add badge to a page
	//  */
	// function add(name) {
	// 	try {
	// 		let badge = types[name];
	// 		if (!prop(badge) || !prop(badge.name) || badge.name === "") return console.error(badge, types);
	//
	// 			if (DEBUG) console.log("🏆 Badge.add()", name, badge);
	// 		let randomPos = [],
	// 			imgStr = "",
	// 			nameAttr = "",
	// 			str = "";
	//
	// 		// new position
	// 		randomPos = Core.returnRandomPositionFull('', 100, 100);
	//
	// 		// html
	// 		imgStr = chrome.extension.getURL('assets/img/badges/' + badge.img);
	// 		nameAttr = name + '_badge';
	// 		str = "<div data-badge='" + name + "' class='tally tally_badge_inner' id='" + nameAttr + "'>" +
	// 			"<img src='" + imgStr + "'></div>";
	// 		$('.tally_badge').html(str);
	// 		$('.tally_badge').css({
	// 			"left": randomPos.x + "px",
	// 			"top": randomPos.y + "px"
	// 		});
	//
	// 		// add floating animation
	// 		anime({
	// 			targets: ".tally_badge",
	// 			translateY: 5,
	// 			// scale: 1.05,
	// 			direction: 'alternate',
	// 			loop: true,
	// 			easing: 'easeInOutSine'
	// 		});
	//
	// 		// add listeners
	// 		$(document).on("mouseover", "#" + name, function() {
	// 			if (DEBUG) console.log("🏆 Badge.add() mouseover", $(this));
	// 			hover($(this).attr("data-badge"));
	// 		});
	// 		$(document).on("click", "#" + name, function() {
	// 			if (DEBUG) console.log("🏆 Badge.add() click", $(this));
	// 			// Math.random so gif replays
	// 			let img = chrome.extension.getURL('assets/img/consumables/consumable-explosion.gif?' + Math.random());
	// 			$(this).html("<img src='" + img + "'>");
	// 			setTimeout(function() {
	// 				// remove
	// 				$(this).remove();
	// 			}, 500);
	// 			collect($(this).attr("data-badge"));
	// 		});
	//
	// 	} catch (err) {
	// 		console.error(err);
	// 	}
	// }
	// /**
	//  * 	4. user hovers over badge
	//  */
	// function hover(name) {
	// 	let badge = types[name];
	// 	if (DEBUG) console.log("🏆 Badge.hover()", name, badge);
	// 	if (!hovered) {
	// 		// tell them
	// 		Dialogue.showData({
	// 			"text": "Oh, you found " + badge.ref + " " + badge.name + " badge!",
	// 			"mood": badge.sound
	// 		}, {});
	// 	}
	// 	Dialogue.showData({
	// 		"text": "Click to collect the badge!",
	// 		"mood": badge.sound
	// 	}, {
	// 		addIfInProcess: false
	// 	});
	// 	// only show hover message once
	// 	hovered = true;
	// }
	//
	// /**
	//  *	5. user clicks a badge
	//  */
	// function collect(name) {
	// 	try {
	// 		let badge = types[name];
	// 		if (DEBUG) console.log("🏆 Badge.collect()", name, badge);
	// 		// play sound
	// 		Sound.playRandomPowerup();
	// 		// save in background (and on server)
	// 		TallyData.handle("itemData", "badges", badge, "🏆 Badge.collect()");
	// 	} catch (err) {
	// 		console.error(err);
	// 	}
	// }




	// PUBLIC
	return {
		check: check,
	};
})();
