/*jshint esversion: 6 */

var Thought = (function() {
	// PRIVATE

	var thoughtOpen = false;



	var data = {
		monsters: {
			captured: ['You just captured a product monster!'],
			launch: ['A product monster!!!', 'Look out!!!'],
			'006-suv': 'Say something special about this monster?'
		},
		narrative: {
			story1: 'e.g. In the beginning ...',
			story2: 'e.g. Then something happened ...',
			story3: 'e.g. Then something else happened ...'
		},
		page: {
			title: ['The title of this page is *****']
		},
		player: {
			complement: ['Nice clicking!']
		},
		random: {
			greeting: ['How are you?', 'Hello world! 😀']
		},
		trackers: {
			lots: ['There are a lot of trackers on this page.',
				'Careful, there are trackers nearby.',
				'Seriously, it\'s getting kind of creepy around here.',
				'I think I saw a product monster.',
				'This place makes me nervous.'
			],
			few: ['There are only a few trackers on this page.'],
			none: ['There are no trackers on this page.'],
			general: ['Trackers are scripts embedded in websites that collect and store information about you and your behavior',
				'Trackers include analytics tools that tell website owners who is visiting their site.',
				'Most trackers belong to companies who want to collect as much data as possible about you.',
				'The data that trackers collect can include your age, where you live, what you read, and your interests.',
				'Data that trackers collect is packaged and sold to others, including advertisers, other companies, even governments.'
			]
		}
	};



	function showThought(str, sound = false) {

		if (thoughtOpen) return;
		// set number of lines based on str.length
		let lines = Math.ceil(str.length / 29);
		// set duration based on number lines
		let duration = lines * 1200;

		console.log("showThought", str, duration, lines);

		// if (sound)
		// 	Sound.test("tally", "thought-basic-open");
		// adjust lines if not received

		// add text
		$('#tally_thought').html(str);

		// make the size of the box dependent on str.length
		$('#tally_thought_bubble').css({
			'display': 'flex',
			'height': lines * 30 + "px", // normal height for 50 chars is: 80px;
			'left': '10px',
			'opacity': 1 // make it visible
		});

		// // show
		// var cssProperties = anime({
		// 	targets: '#tally_thought_bubble',
		// 	opacity: 1,
		// 	duration: 400
		// });
		Tally.stare();
		//console.log("lines",lines)
		thoughtOpen = true;
		// hide after period
		setTimeout(hideThought, duration);
	}

	function hideThought(sound = false) {
		console.log("hideThought");
		if (!thoughtOpen) return;
		// if (sound)
		// 	Sound.test("tally", "thought-basic-close");
		// var cssProperties = anime({
		// 	targets: '#tally_thought_bubble',
		// 	opacity: 0,
		// 	duration: 500
		// });
		$('#tally_thought_bubble').css({
			'left': '-500px',
			'display': 'none',
			'opacity': 0
		});
		thoughtOpen = false;
		// testing
		Skin.update();
	}

	// return thought text
	function getThought(category, index) {
		let d = data[category][index];
		if (Array.isArray(d)) {
			let r = Math.floor(Math.random() * d.length);
			return data[category][index][r];
		}
		// else its a string
		else if (typeof d === 'string')
			return data[category][index];
	}

	// PUBLIC
	return {
		get: function(category, index) {
			return getThought(category, index);
		},
		show: function(str, lines, duration, sound) {
			showThought(str, lines, duration, sound);
		},
		hide: hideThought

	};
})();
