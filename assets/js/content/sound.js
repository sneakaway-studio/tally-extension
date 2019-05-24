"use strict";

window.Sound = (function() {
	// PRIVATE
	var DEBUG = false,
		sounds = {
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
				]
			},
			"awards": {
				"monster": "Victory-3.mp3"
			},
			"jumps": {
				"jump1-1": "Jump1-1.wav",
				"jump1-2": "Jump1-2.wav",
				"jump1-3": "Jump1-3.wav",
			},
			"jumps-reverse": {
				"jump1-1-reverse": "Jump1-1-reverse.wav",
				"jump1-2-reverse": "Jump1-2-reverse.wav",
				"jump1-3-reverse": "Jump1-3-reverse.wav",
			},
			"monsters": {},
			"songs": {},
			"user": {
				"click": "Pickup-coin2.wav",
			},
			"powerups": {
				"powerup1": "powerup1.wav",
				"powerup2": "powerup2.wav",
				"powerup3": "powerup3.wav",
				"powerup4": "powerup4.wav",
				"powerup5": "powerup5.wav",
				"powerup6": "powerup6.wav",
				"powerup7": "powerup7.wav",
				"powerup8": "powerup8.wav",
				"powerup9": "powerup9.wav",
				"powerup10": "powerup10.wav",
				"powerup11": "powerup11.wav",
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

	function playRandomPowerup() {
		Sound.playFile("powerups/" + randomObjProperty(sounds.powerups));
	}
	function playRandomJump() {
		Sound.playFile("jumps/" + randomObjProperty(sounds.jumps));
	}
	function playRandomJumpReverse() {
		Sound.playFile("jumps-reverse/" + randomObjProperty(sounds["jumps-reverse"]));
	}


	/**
	 * Play a sound from a category and index of sounds
	 * @param  {string} category - The general category of sounds
	 * @param  {integer} index - A specific index in the category
	 * @param  {integer} delay - Delay in milliseconds
	 */
	function playRandom(category, index, delay) {
		if (!tally_options.playSounds) return;
		//if(DEBUG) console.log("playRandom("+ category +","+ index +")");
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
		if (DEBUG) console.log("Sound.playMood()", mood);
		let r = Math.ceil(Math.random() * moods[mood]);
		let file = "tally/moods-v2/" + mood + "-" + r + "-2.mp3";
		play(file, 150);
	}



	/**
	 *	(Old) Generic play function (called from others in this obj)
	 */
	// function playOld(soundFile, delay = 0, volumeModifier = 0) {
	// 	//if(DEBUG) console.log("♪♪♪♪♪ Sound.play("+ soundFile +","+ delay +","+ volumeModifier +")");
	// 	// load/play sound
	// 	var audio = new Audio(chrome.extension.getURL("assets/sounds/" + soundFile));
	// 	audio.muted = true;
	// 	audio.pause();
	// 	audio.volume = (tally_options.soundVolume || 0.3) + volumeModifier;
	// 	if (delay > 0)
	// 		setTimeout(function() {
	// 			audio.muted = false;
	// 			audio.play();
	// 		}, delay);
	// 	else{
	// 		audio.play();
	// 	}
	// }




	/**
	 *	Generic play function (called from others in this obj)
	 */
	function play(soundFile, delay = 0, volumeModifier = 0) {
		if (DEBUG) console.log("♪♪♪♪♪ Sound.play(" + soundFile + "," + delay + "," + volumeModifier + ")");

		// reference to audio element
		var audio = document.querySelector('#tally_audio');
		// add source
		$('#tally_audio_source').attr("src", chrome.extension.getURL("assets/sounds/" + soundFile));
		// set params
		audio.volume = (tally_options.soundVolume || 0.3) + volumeModifier;
		if (audio.volume < 0) audio.volume = 0;
		audio.muted = false;
		audio.pause();
		audio.load();

		// create promise / attempt to play
		var promise = audio.play();
		// if play failed
		if (promise !== undefined) {
			promise.then(_ => {
				//if(DEBUG) console.log("Autoplay started!");
			}).catch(error => {
				//if(DEBUG) console.log("Autoplay prevented!");
				// audio.pause();
				// audio.play();
			});
		}
	}



	// PUBLIC
	return {
		playRandom: function(category, index, delay) {
			playRandom(category, index, delay);
		},
		playRandomPowerup: playRandomPowerup,
		playRandomJump: playRandomJump,
		playCategory: function(category, index, delay) {
			playCategory(category, index, delay);
		},
		playFile: function(file, delay, volume) {
			play(file, delay, volume);
		},
		playMood: function(mood) {
			playMood(mood);
		},
		sounds: sounds
	};
})();
