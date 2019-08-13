"use strict";

/*  DEMO ("gallery mode")
 ******************************************************************************/

window.Demo = (function() {
	// PRIVATE

	let DEBUG = Debug.ALL.Demo,
		status = false,
		idleInterval = {},
		idleLength = 100,
		idleTime = 0

	;

	function start() {
		try {
			if (tally_options.gameMode === "demo") set(true);
		} catch (err) {
			console.error(err);
		}
	}

	// set status
	function set(newStatus) {
		try {
			if (!newStatus) {
				// turn off
				status = false;
				window.clearInterval(idleInterval);
			} else {
				// turn on
				status = true;
				idleInterval = setInterval(function() {
					// call action
					update();
				}, 1000);
			}
		} catch (err) {
			console.error(err);
		}
	}

	// check if we should run a demo action
	function update() {
		try {
			idleTime++;
			var d = new Date(),
				str = "";
			// console.log(d.toLocaleTimeString());
			if (idleTime >= 10) {
				// log('load new cat');
				// load_random_cat();
				// $('#exhibit_mode_info').html('');

				newAction();
			} else if (idleTime < 5) {
				// $('#exhibit_mode_info').html('');
				// idleTime++;
			} else {
				//str = (10 - idleTime);

			}

			if (str != ""){
				$('.demo_window').html(str).css({'display':'block'});
			} else {
				$('.demo_window').css({'display':'none'});
			}

			console.log('🎲 Demo.update() idleTime=' + idleTime);
		} catch (err) {
			console.error(err);
		}
	}

	function newAction() {
		try {
			console.log('🎲 Demo.newAction()');

			//  choose action






			// tell user
			// w/ cat I did this with a counter and tiny cat image
			// show loading
			// w/ cat I did this with a loading image
			// reset idle time
			idleTime = 0;
		} catch (err) {
			console.error(err);
		}
	}

	// if user interacts then reset
	$(document).on('mousemove keypress', function(e) {
		if (tally_user.admin > 0 && tally_options.gameMode === "demo") {
			idleTime = 0;
		}
	});


	// PUBLIC
	return {
		start: start,
		set: function(newStatus) {
			set(newStatus);
		}

	};
})();
