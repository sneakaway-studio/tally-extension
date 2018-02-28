/*jshint esversion: 6 */

var Sound = (function() {
	// PRIVATE
	var sounds = {
		"_tests": {
			"blip": [
				"Blip-select1.wav",
				"Blip-select2.wav"
			],
			"bubble": [
				"bubbles1.mp3"
			],
			"hit": [
				"Hit-hurt1.wav",
				"Hit-hurt2.wav"
			],
			"shoot": [
				"Laser-shoot1.wav"
			],
			"coin": [
				"Pickup-coin1.wav",
				"Pickup-coin2.wav"
			],
			"powerup": [
				"powerup1.wav",
				"powerup2.wav",
				"powerup3.wav",
				"powerup4.wav",
			]
		},
		"awards": {},
		"monsters": {},
		"songs": {},
		"tally": {
			"click":"Blip-select2.wav",
            "thought-basic-open":"Hit-hurt2.wav",
            "thought-basic-close":"Hit-hurt1.wav",
        },
		"user": {
			"click":"Pickup-coin2.wav"
		}
	};



	/**
	 * Play a sound from a category and index of sounds
	 * @param  {string} category - The general category of sounds
	 * @param  {integer} index - A specific index in the category
	 * @param  {integer} delay - Delay in milliseconds
	 */
	function testSound(category, index, delay) {
		if (!tally_options.playSounds) return;
		//log("playSound("+ category +","+ index +")");
		var soundFile = "";
		// if a specific category && index provided
		if (prop(category) && prop(index))
			soundFile = "_tests/"+ sounds._tests[category][index];
		// else pick random index from category
		else if (prop(category) && !prop(index))
			soundFile = "_tests/"+ sounds._tests[category][Math.floor((Math.random() * sounds._tests[category].length))];
		// else pick random category && index
		else if (!prop(category) && !prop(index)) {
			var categoryArr = randomObjProperty(sounds._tests); // reference to array group in sounds
			soundFile = "_tests/"+ categoryArr[Math.floor(Math.random() * categoryArr.length)];
		}
		play(soundFile,delay);
	}
    // Sound.play ("tally","general")
    function playSound(category, index, delay) {
        if (!tally_options.playSounds) return;
        var soundFile = category +"/"+ sounds[category][index];
		play(soundFile,delay);
    }

    // generic play function
    function play(soundFile,delay=0){
		// load/play sound
        var audio = new Audio(chrome.extension.getURL("assets/sounds/"+ soundFile));
        audio.volume = 0.3;
		if (delay > 0)
			setTimeout(function() {
				audio.play();
			}, delay)
		else
			audio.play();
    }

	// PUBLIC
	return {
		test: function(category, index, delay) {
			testSound(category, index, delay);
		},
		play: function(category, index, delay) {
			playSound(category, index, delay);
		}

	};
})();
