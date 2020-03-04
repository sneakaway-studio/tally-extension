"use strict";

/*  DEMO ("gallery mode")
 ******************************************************************************/

window.Demo = (function() {
	// PRIVATE

	let DEBUG = Debug.ALL.Demo,
		mode = "off", // "off" | "start" | "countdown"
		messageStr = "",
		listenerActive = false,
		idleInterval = {}, // store the interval
		idleReset = 15, // start value
		idleShowCountdown = 10, // when to start showing counter
		idleTime = idleReset, // counter
		scrollToMonster = false,
		clickOnMonster = false,
		alreadyTriedToFollowLink = false;

	// (maybe) set demo mode "on"
	function start() {
		try {
            // do not allow offline
            if (!Page.mode().active) return;
            // do not allow if mode !demo
            if (tally_options.gameMode !== "demo") return;

			if (mode !== "off") return;
			console.log('🎲 Demo.start() idleTime=' + idleTime);
			// show all debug messages
			Debug.setAll(true);
			// set to countdown mode
			mode = "countdown";
			// start timer
			idleInterval = setInterval(function() {
				// call action
				counter();
			}, 1000);

			// if user interacts then restart
			$(document).on('mousemove keypress scroll click', function(e) {
				try {
					// only call restart once per event
					if (listenerActive) return;
					// double check we are in demo mode
					if (tally_user && tally_user.admin > 0 && tally_options.gameMode === "demo") {
						listenerActive = true;
						restart();
						// set listenerActive back after a moment
						setTimeout(function() {
							listenerActive = false;
						}, 500);
					}
				} catch (err) {
					console.error(err);
				}
			});


		} catch (err) {
			console.error(err);
		}
	}

	function restart() {
		try {
			// does the page have focus?
			if (!document.hasFocus()) return;
			console.log('🎲 Demo.restart() idleTime=' + idleTime +
				", Monster.onPage()=" + Monster.onPage() +
				", document.hasFocus()=" + document.hasFocus());
			// reset idle time
			idleTime = idleReset;
			// hide message
			showMessage(false);
		} catch (err) {
			console.error(err);
		}
	}

	function cancel() {
		try {
			if (mode == "off") return;
			mode = "off";
			// stop interval
			window.clearInterval(idleInterval);
			// hide message
			showMessage(false);
		} catch (err) {
			console.error(err);
		}
	}



	// check if we should run a demo action
	function counter() {
		try {
			// does the page have focus?
			if (!document.hasFocus()) return;
			// is it day time?
			//if (!FS_Date.isWorkday()) return;

			// update idle counter
			--idleTime;
			// if
			if (!document.hasFocus() || idleTime > idleShowCountdown) {
				showMessage(false);
			}
			// showing countdown
			else if (idleTime <= idleShowCountdown && idleTime > 0) {
				messageStr = "<div><b class='text-tally'>ENTERING DEMO MODE IN " + idleTime + " SECONDS</b></div> " +
					"<div>Move mouse to cancel demo and keep playing...</div>";
				showMessage(true);
			}
			// countdown has reached zero, commence to doing things
			else {
				messageStr = "<div><b class='text-tally'>DEMO MODE</b></div> " +
					"<div>Move mouse to cancel demo and keep playing...</div>";
				showMessage(true);


				// pause listener so we can automate
				listenerActive = true;

				// is a battle in progress?
				if (Battle.active() && !Battle.details.attackInProgress) {
					// only run every other second
					if (idleTime % 2 == 0) {
						let l = $('.battle-options-fire').length;
						// fire a shot
						if (l > 0) {
							let r = Math.floor(Math.random() * l);
							// console.log($('.battle-options-fire'));
							$('.battle-options-fire:eq(' + r + ')').trigger("click");
						}
					}
				}
				// is a monster on the page?
				else if (Monster.onPage()) {
					// scroll to it
					if (!scrollToMonster) {
						$('html,body').animate({
							scrollTop: $(".tally_monster_sprite_container").offset().top
						}, {
							complete: function() {
								$(".tally_monster_sprite_container").trigger("mouseover");
								// set flag
								scrollToMonster = true;
							}
						});
					}
					// and launch battle
					else if (!clickOnMonster) {
						setTimeout(function() {
							$(".tally_monster_sprite_container").trigger("click");
							// set flag
							clickOnMonster = true;
						}, 300);
					}

					setTimeout(function() {
						// reset listener after a moment
						listenerActive = false;
					}, 400);

				} else {
					let waitForServerUpdate = 0;
					// if some updating needs to happen
					if (clickOnMonster) {
						waitForServerUpdate = 500;
					}
					setTimeout(function() {
						goToNewPage();
					}, waitForServerUpdate);
				}
			}
			// update text
			$('.tally_demo_window').html(messageStr);
			console.log('🎲 Demo.counter() idleTime=' + idleTime +
				", Monster.onPage()=" + Monster.onPage() +
				", document.hasFocus()=" + document.hasFocus());
		} catch (err) {
			console.error(err);
		}
	}


	function goToNewPage(now) {
		try {
            // do not allow offline
            if (!Page.mode().active) return;
            // do not allow if mode !demo
            if (tally_options.gameMode !== "demo") return;
		
			// occassionally go to new site
			if (Math.random() > 0.5) alreadyTriedToFollowLink = true;
			// always go to random for now so it doesn't open new tabs
			alreadyTriedToFollowLink = true;
			// if we want to go to random right now
			if (now) alreadyTriedToFollowLink = true;
			// if we haven't tried already
			if (!alreadyTriedToFollowLink) {
				// save attempt
				alreadyTriedToFollowLink = true;
				// get all links
				var links = $('a[target!="_blank"]');
				// is safe to click link
				let isSafeLink = false,
					safety = 0;
				// loop until it is
				while (!isSafeLink) {
					// get random link
					let r = Math.floor(Math.random() * links.length);
					// console.log(r, links[r], links[r].href);
					// make sure it has an href and isn't an email
					if (links[r].href &&
						links[r].href.search("download") < 0 &&
						links[r].href.search("mailto") < 0) {
						// console.log("SAFE", links[r].href);
						isSafeLink = true;
						links.get(r).click();
						break;
					}
					if (++safety > 20) break;
				}
			}
			// if it didn't work the first time, go to a new *random* page
			else TallyStorage.getDataFromServer('/url/random', Demo.goToUrlCallback);
		} catch (err) {
			console.error(err);
		}
	}



	function showMessage(state) {
		try {
			// move it on top again if needed
			$('.tally_demo_window').css({
				'z-index': '999999999999999'
			});
			if (state)
				// slide window up
				$('.tally_demo_window').removeClass('tally_demo_window_hidden');
			else
				// slide window down
				$('.tally_demo_window').addClass('tally_demo_window_hidden');
		} catch (err) {
			console.error(err);
		}
	}

	// callback to go to random url from server
	function goToUrlCallback(response) {
		try {
			console.log('🎲 Demo.goToUrl()', response.data);
			if (prop(response.data.urls[0]))
				window.location.assign(response.data.urls[0].url);
		} catch (err) {
			console.error(err);
		}
	}


	// PUBLIC
	return {
		start: start,
		goToNewPage: goToNewPage,
		goToUrlCallback: goToUrlCallback

	};
})();
