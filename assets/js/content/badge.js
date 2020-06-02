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
			// start here
			let badge = BadgeData.data[name];
			// if they have received one before
			if (tally_user.badges && tally_user.badges[name])
				// then update level
				badge.level = tally_user.badges[name].level;
			if (DEBUG) console.log('🏆 Badge.get() name =', name, badge);
			return badge;
		} catch (err) {
			console.error(err);
		}
	}

	/**
	 *	1. determine if player has earned a new badge
	 */
	function check(type = "afterLoad") {
		try {
			// do not allow offline
			if (!Page.mode().active) return;
			// don't allow if mode disabled or stealth
			if (tally_options.gameMode === "disabled" || tally_options.gameMode === "stealth") return;



			// afterLoad
			// scrollAction
			// clickAction




			// which things should we check?
			let shouldCheck = {
					social: 1, // (GameData.socialDomains.indexOf(Page.data.domain) > -1),
					tags: false,
					workday: true,
					nighttime: true,
					clickText: false,
					scrolling: false
				},
				log = "🏆 Badge.check()";

			// vars for checks below
			let currentBadge, newBadgeLevel;
			var startNewCheck = function(name) {
				// the current badge or a "blank" one
				currentBadge = get(name);
				// reset new badge level (to compare to current one)
				newBadgeLevel = 0;
				// log
				console.log(log, "startNewCheck()", name, currentBadge);
			};


			/////////////// SOCIAL DOMAINS ///////////////



			/////////////// filter-bubble -> based on (increasing) likes on social media
			// get current badge (or a new default badge) and start new check
			startNewCheck("filter-bubble");
			// get new badge level
			newBadgeLevel = Math.round(tally_user.score.likes / 5);
			// compare levels
			if (shouldCheck.social && newBadgeLevel > currentBadge.level) {
				console.log(log, "newBadgeLevel > currentBadge.level !!!!!");
				// set new level
				currentBadge.level = newBadgeLevel;
				// report
				console.log(log, "newBadgeLevel > currentBadge.level", "currentBadge =", currentBadge);
				// award new badge
				if (1) return award(currentBadge);
			}

			/////////////// stalker -> based on (increasing) on social media but very few likes
			startNewCheck("stalker");
			// every 30 min they level up
			newBadgeLevel = Math.round(tally_user.streamReport.pSocial / 60 / 30);
			if (shouldCheck.social && newBadgeLevel > currentBadge.level) {
				currentBadge.level = newBadgeLevel;
				console.log(log, "newBadgeLevel > currentBadge.level", "currentBadge =", currentBadge);
				if (1) return award(currentBadge);
			}







			/////////////// ECONOMY ///////////////

			/////////////// worker-bee -> 9a-5p M-F
			if (shouldCheck.workday && FS_Date.isWorkday()) {
				startNewCheck("worker-bee");
				newBadgeLevel = Math.round(tally_user.streamReport.tWorkday / 10000);
				if (newBadgeLevel > currentBadge.level) {
					currentBadge.level = newBadgeLevel;
					console.log(log, "newBadgeLevel > currentBadge.level", "currentBadge =", currentBadge);
					if (1) return award(currentBadge);
				}
			}
			///////////// night-owl -> 10p–6a
			else if (shouldCheck.nighttime && FS_Date.isNight()) {
				startNewCheck("night-owl");
				newBadgeLevel = Math.round(tally_user.streamReport.tNight / 10000);
				if (newBadgeLevel > currentBadge.level) {
					currentBadge.level = newBadgeLevel;
					console.log(log, "newBadgeLevel > currentBadge.level", "currentBadge =", currentBadge);
					if (1) return award(currentBadge);
				}
			}

			// refresh
			// https://stackoverflow.com/questions/5004978/check-if-page-gets-reloaded-or-refreshed-in-javascript
			// if (performance.navigation.type == 1)




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

			let awardText = "<div class='tally tally-badge' style='background-color: " + badge.color + "'>" +
				"<img class='tally tally-badge-img' src='";
			// placeholder for badges not finished
			if (badge.ext !== "") awardText += chrome.extension.getURL('assets/img/badges/' + badge.name + badge.ext);
			else awardText += chrome.extension.getURL('assets/img/badges/placeholder.gif');
			awardText += "'>" +
				"<div class='tally do-not-break tally-badge-text'>" +
				"<span class='tally do-not-break'>" + badge.title + "</span>" +
				"<div class='tally tally-badge-text-level'>level " + badge.level + "</div>" +
				"</div></div>";
			// if they already have that badge
			if (tally_user.badges[badge.name] && badge.level > tally_user.badges[badge.name].level) {
				awardText += "You leveled up!";
			} else {
				awardText += "You earned a new badge!";
			}

			// show dialogue with badge image
			Dialogue.showData({
				text: awardText,
				mood: badge.sound
			}, {
				instant: true
			});
			Dialogue.showData(Dialogue.getData({
				category: "badge",
				subcategory: badge.name
			}));

			// update progress
			Progress.update("badgesAwarded", FS_Object.objLength(tally_user.badges));
			// play sound
			Sound.playRandomPowerup();
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
