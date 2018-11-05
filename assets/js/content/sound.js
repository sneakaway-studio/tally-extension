"use strict";

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
		"awards": {
			"monster": "Victory-3.mp3"
		},
		"monsters": {},
		"songs": {},
		"user": {
			"click": "Pickup-coin2.wav"
		}
	};



	let moods = {
		cautious: 3,
		danger: 3,
		happy: 2,
		neutral: 2,
		question: 2,
		sad: 1
	};


	/**
	 * Play a sound from a category and index of sounds
	 * @param  {string} category - The general category of sounds
	 * @param  {integer} index - A specific index in the category
	 * @param  {integer} delay - Delay in milliseconds
	 */
	function playRandom(category, index, delay) {
		if (!tally_options.playSounds) return;
		//console.log("playRandom("+ category +","+ index +")");
		var soundFile = "";
		// if a specific category && index provided, then get that sound
		if (prop(category) && prop(index))
			soundFile = category + "/" + sounds[category][index];
		// else pick random index from category
		else if (prop(category) && !prop(index))
			// for array
			//soundFile = category +"/"+ sounds[category][Math.floor((Math.random() * sounds[category].length))];
			// random from obj
			soundFile = category + "/" + randomObjProperty(sounds[category]);
		// else pick random category && index
		else if (!prop(category) && !prop(index)) {
			var categoryArr = randomObjProperty(sounds); // reference to array group in sounds
			soundFile = category + "/" + categoryArr[Math.floor(Math.random() * categoryArr.length)];
		}
		play(soundFile, delay);
	}
	// Sound.playCategory ("tally","general")
	function playCategory(category, index, delay) {
		if (!tally_options.playSounds) return;
		let file = category + "/" + sounds[category][index];
		play(file, delay);
	}
	// play a mood
	function playMood(mood) {
		if (!tally_options.playSounds || !prop(mood)) return;
		if (mood == "award") mood = "happy";
		console.log("Sound.playMood()",mood);
		let r = Math.ceil(Math.random() * moods[mood]);
		let file = "tally/moods-v2/" + mood + "-" + r + "-2.mp3";
		play(file,150);
	}



	/**
	 *	Generic play function (called from others in this obj)
	 */
	function play(soundFile, delay = 0) {
		console.log("♪♪♪♪♪ Sound.play("+ soundFile +")");
		// load/play sound
		var audio = new Audio(chrome.extension.getURL("assets/sounds/" + soundFile));
		audio.pause();
		audio.volume = tally_options.soundVolume || 0.3;
		if (delay > 0)
			setTimeout(function() {
				audio.play();
			}, delay);
		else
			audio.play();
	}

	// PUBLIC
	return {
		playRandom: function(category, index, delay) {
			playRandom(category, index, delay);
		},
		playCategory: function(category, index, delay) {
			playCategory(category, index, delay);
		},
		playFile: function(file) {
			play(file);
		},
		playMood: function(mood) {
			playMood(mood);
		}

	};
})();
