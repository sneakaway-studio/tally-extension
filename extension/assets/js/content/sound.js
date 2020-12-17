"use strict";

window.Sound = (function() {
	// PRIVATE
	var DEBUG = Debug.ALL.Sound,
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
			},
			"tally": {
				"sad-hurt-1": "sad-hurt-1.wav",
				"sad-hurt-2": "sad-hurt-2.wav",
				"sad-hurt-3": "sad-hurt-3.wav",
			}
		};


	let musicAudioEl = null,
		musicFile = "",
		battleMusicDir = "tally-battle-6-25/";

	battleMusicDir = "tally-battle-7-25/";

	function playBattleMusic() {
		try {
			// allow offline
			if (Page.data.mode.notActive) return;
			// don't allow if mode disabled or stealth
			if (T.tally_options.gameMode === "disabled" || T.tally_options.gameMode === "stealth") return;
			// don't allow if this page doesn't have focus
			if (!document.hasFocus()) return;
			// don't allow if playSounds disabled
			if (!T.tally_options.playSounds) return;

			// play intro
			//playMusic(battleMusicDir + "battle-intro.wav", false, 0);
			playMusic(battleMusicDir + "intro-with-loop.mp3", false, 0);
			// then call again so it switches to the loop
			setTimeout(function() {
				//playMusic(battleMusicDir + "battle-loop.wav", true, 0);
				playMusic(battleMusicDir + "loop.mp3", true, 0);
			}, 500);

		} catch (err) {
			console.error(err);
		}
	}

	function playMusic(file, loop, volumeModifier = 0) {
		try {
			// allow offline
			if (Page.data.mode.notActive) return;
			// don't allow if mode disabled or stealth
			if (T.tally_options.gameMode === "disabled" || T.tally_options.gameMode === "stealth") return;
			// don't allow if this page doesn't have focus
			if (!document.hasFocus()) return;
			// don't allow if playSounds disabled
			if (!T.tally_options.playSounds) return;
			// don't allow if no soundFile
			if (!FS_Object.prop(file)) return;
			// check volume
			if (volumeModifier > 0.5) volumeModifier = 0;

			if (DEBUG) console.log("🎵 Sound.playMusic()", file, loop, volumeModifier);

			// if music isn't already playing then start it
			if (musicFile === "") {
				// save file
				musicFile = file;
				// get reference to musicAudio element and add source
				musicAudioEl = document.querySelector('#tally_music');
				$('#tally_music_source').attr("src", chrome.extension.getURL("assets/sounds/music/" + musicFile));
				// set params
				musicAudioEl.volume = FS_Number.clamp(T.tally_options.soundVolume + volumeModifier, 0, 1);
				// some hacks for Chrome
				musicAudioEl.muted = false;
				musicAudioEl.loop = loop;
				musicAudioEl.pause();
				musicAudioEl.load();

				startMusic();

				// add listener to make sure loop happens
				musicAudioEl.addEventListener('ended', function() {
					startMusic();
				}, false);

			} else {
				// save file
				musicFile = file;
				// only update src
				$('#tally_music_source').attr("src", chrome.extension.getURL("assets/sounds/music/" + musicFile));
			}

		} catch (err) {
			console.error(err);
		}
	}

	function startMusic() {
		try {
			// allow offline
			if (Page.data.mode.notActive) return;
			// don't allow if mode disabled or stealth
			if (T.tally_options.gameMode === "disabled" || T.tally_options.gameMode === "stealth") return;
			// don't allow if this page doesn't have focus
			if (!document.hasFocus()) return;
			// don't allow if playSounds disabled
			if (!T.tally_options.playSounds) return;
			// don't allow if no soundFile
			if (!FS_Object.prop(musicFile)) return;

			if (DEBUG) console.log("🎵 Sound.startMusic()");

			if (musicAudioEl !== null) {
				musicAudioEl.pause();
				musicAudioEl.currentTime = 0;
			}

			// create promise / attempt to play
			var soundPromise = musicAudioEl.play();
			// if play failed
			if (soundPromise !== undefined) {
				soundPromise.then(_ => {
					//if(DEBUG) console.log("Autoplay started!");
					//Pause and reset the sound
					// start playing again using new music if it exists
					musicAudioEl.pause();
					// musicAudioEl.currentTime = 0;
					// only update src
					$('#tally_music_source').attr("src", chrome.extension.getURL("assets/sounds/music/" + musicFile));
					musicAudioEl.load();
					// create promise / attempt to play
					musicAudioEl.play();
				}).catch(err => {
					//if (DEBUG) console.log(err);
					//if(DEBUG) console.log("Autoplay prevented!");
					// musicAudioEl.pause();
					// musicAudioEl.play();
				});
			}

		} catch (err) {
			console.error(err);
		}
	}

	function stopMusic() {
		try {
			if (DEBUG) console.log("🎵 Sound.stopMusic()");
			musicAudioEl.pause();
			musicFile = "";
		} catch (err) {
			console.error(err);
		}
	}

	//
	// function loopMusic() {
	// 	if (DEBUG) console.log("🎵 Sound.loopMusic()",musicAudioEl.src)
	// 	musicAudioEl.addEventListener('ended', function() {
	// 		this.currentTime = 0;
	// 		this.play();
	// 	}, false);
	// 	musicAudioEl.play();
	// }
	//
	//







	function playRandomPowerup() {
		try {
			Sound.playFile("powerups/" + FS_Object.randomObjProperty(sounds.powerups));
		} catch (err) {
			console.error(err);
		}
	}

	function playRandomJump() {
		try {
			Sound.playFile("jumps/" + FS_Object.randomObjProperty(sounds.jumps));
		} catch (err) {
			console.error(err);
		}
	}

	function playRandomJumpReverse() {
		try {
			Sound.playFile("jumps/" + FS_Object.randomObjProperty(sounds["jumps-reverse"]));
		} catch (err) {
			console.error(err);
		}
	}


	/**
	 * Play a sound from a category and index of sounds
	 * @param  {string} category - The general category of sounds
	 * @param  {integer} index - A specific index in the category
	 * @param  {integer} delay - Delay in milliseconds
	 */
	function playRandom(category, index, delay) {
		try {
			// allow offline
			if (Page.data.mode.notActive) return;
			// don't allow if mode disabled or stealth
			if (T.tally_options.gameMode === "disabled" || T.tally_options.gameMode === "stealth") return;
			// don't allow if this page doesn't have focus
			if (!document.hasFocus()) return;
			// don't allow if playSounds disabled
			if (!T.tally_options.playSounds) return;

			//if(DEBUG) console.log("🎵 Sound.playRandom("+ category +","+ index +")");
			var soundFile = "";
			// if a specific category && index provided, then get that sound
			if (FS_Object.prop(category) && FS_Object.prop(index))
				soundFile = category + "/" + sounds[category][index];
			// else pick random index from category
			else if (FS_Object.prop(category) && !FS_Object.prop(index))
				// for array
				//soundFile = category +"/"+ sounds[category][Math.floor((Math.random() * sounds[category].length))];
				// random from obj
				soundFile = category + "/" + FS_Object.randomObjProperty(sounds[category]);
			// else pick random category && index
			else if (!FS_Object.prop(category) && !FS_Object.prop(index)) {
				var categoryArr = FS_Object.randomObjProperty(sounds); // reference to array group in sounds
				soundFile = category + "/" + categoryArr[Math.floor(Math.random() * categoryArr.length)];
			}
			play(soundFile, delay);
		} catch (err) {
			console.error(err);
		}
	}
	// Sound.playCategory ("tally","general")
	function playCategory(category, index, delay) {
		try {
			// allow offline
			if (Page.data.mode.notActive) return;
			// don't allow if mode disabled or stealth
			if (T.tally_options.gameMode === "disabled" || T.tally_options.gameMode === "stealth") return;
			// don't allow if this page doesn't have focus
			if (!document.hasFocus()) return;
			// don't allow if playSounds disabled
			if (!T.tally_options.playSounds) return;

			let file = category + "/" + sounds[category][index];
			play(file, delay);
		} catch (err) {
			console.error(err);
		}
	}

	// available variances for moods-syllables-iterations
	let moodMap = {
		cautious: {
			'1': {
				'1': 'cautious-1-1.wav'
			},
			'2': {
				'1': 'cautious-2-1.wav',
				'2': 'cautious-2-2.wav',
				'3': 'cautious-2-3.wav',
				'4': 'cautious-2-4.wav',
				'5': 'cautious-2-5.wav'
			},
			'3': {
				'1': 'cautious-3-1.wav',
				'2': 'cautious-3-2.wav',
				'3': 'cautious-3-3.wav',
				'4': 'cautious-3-4.wav',
				'5': 'cautious-3-5.wav'
			},
			'4': {
				'1': 'cautious-4-1.wav',
				'2': 'cautious-4-2.wav',
				'3': 'cautious-4-3.wav',
				'4': 'cautious-4-4.wav',
				'5': 'cautious-4-5.wav'
			},
			'5': {
				'1': 'cautious-5-1.wav',
				'2': 'cautious-5-2.wav',
				'3': 'cautious-5-3.wav',
				'4': 'cautious-5-4.wav',
				'5': 'cautious-5-5.wav'
			}
		},
		excited: {
			'1': {
				'1': 'excited-1-1.wav'
			},
			'2': {
				'1': 'excited-2-1.wav',
				'3': 'excited-2-3.wav',
				'4': 'excited-2-4.wav',
				'5': 'excited-2-5.wav'
			},
			'3': {
				'1': 'excited-3-1.wav',
				'3': 'excited-3-3.wav',
				'4': 'excited-3-4.wav',
				'5': 'excited-3-5.wav'
			},
			'4': {
				'1': 'excited-4-1.wav',
				'3': 'excited-4-3.wav',
				'4': 'excited-4-4.wav',
				'5': 'excited-4-5.wav'
			},
			'5': {
				'1': 'excited-5-1.wav',
				'3': 'excited-5-3.wav',
				'4': 'excited-5-4.wav',
				'5': 'excited-5-5.wav'
			}
		},
		happy: {
			'1': {
				'1': 'happy-1-1.wav',
				'2': 'happy-1-2.wav'
			},
			'2': {
				'1': 'happy-2-1.wav',
				'2': 'happy-2-2.wav'
			},
			'3': {
				'1': 'happy-3-1.wav'
			},
			'4': {
				'1': 'happy-4-1.wav'
			},
			'5': {
				'1': 'happy-5-1.wav'
			}
		},
		neutral: {
			'1': {
				'1': 'neutral-1-1.wav',
				'2': 'neutral-1-2.wav',
				'3': 'neutral-1-3.wav',
				'4': 'neutral-1-4.wav'
			},
			'2': {
				'1': 'neutral-2-1.wav',
				'2': 'neutral-2-2.wav',
				'3': 'neutral-2-3.wav',
				'4': 'neutral-2-4.wav',
				'5': 'neutral-2-5.wav'
			},
			'3': {
				'1': 'neutral-3-1.wav',
				'2': 'neutral-3-2.wav'
			},
			'4': {
				'1': 'neutral-4-1.wav',
				'2': 'neutral-4-2.wav'
			},
			'5': {
				'1': 'neutral-5-1.wav',
				'2': 'neutral-5-2.wav'
			}
		},
		question: {
			'1': {
				'1': 'question-1-1.wav'
			},
			'2': {
				'1': 'question-2-1.wav',
				'3': 'question-2-3.wav',
				'4': 'question-2-4.wav',
				'5': 'question-2-5.wav'
			},
			'3': {
				'1': 'question-3-1.wav',
				'3': 'question-3-3.wav',
				'4': 'question-3-4.wav',
				'5': 'question-3-5.wav'
			},
			'4': {
				'1': 'question-4-1.wav',
				'3': 'question-4-3.wav',
				'4': 'question-4-4.wav',
				'5': 'question-4-5.wav'
			},
			'5': {
				'1': 'question-5-1.wav',
				'3': 'question-5-3.wav',
				'4': 'question-5-4.wav',
				'5': 'question-5-5.wav'
			}
		},
		sad: {
			'1': {
				'1': 'sad-1-1.wav'
			},
			'2': {
				'1': 'sad-2-1.wav'
			},
			'3': {
				'1': 'sad-3-1.wav'
			},
			'4': {
				'1': 'sad-4-1.wav'
			},
			'5': {
				'1': 'sad-5-1.wav'
			}
		}
	};

	/**
	 * 	Plays Tally's Voice based on a mood (via dialogue obj) and the length of the string
	 */
	function playTallyVoice(dialogue) {
		try {
			// allow offline
			if (Page.data.mode.notActive) return;
			// don't allow if mode disabled or stealth
			if (T.tally_options.gameMode === "disabled" || T.tally_options.gameMode === "stealth") return;
			// don't allow if this page doesn't have focus
			if (!document.hasFocus()) return;
			// don't allow if playSounds disabled
			if (!T.tally_options.playSounds) return;

			// make sure mood exists
			if (!FS_Object.prop(dialogue.mood)) return;
			// fixes old moods
			if (dialogue.mood == "award") dialogue.mood = "happy";
			if (DEBUG) console.log("🎵 Sound.playTallyVoice()", JSON.stringify(dialogue));

			// get number of spaces in the dialogue text
			let words = (dialogue.text.match(/ /g) || []).length + 1;
			if (words > 5) words = 5;

			// test
			let pathname = "",
				filename = "",
				iteration = 1;

			// e.g. question-5-3.wav --> mood-syllable-iteration.wav
			// mood
			if (moodMap[dialogue.mood]) {
				// syllable
				if (FS_Object.prop(moodMap[dialogue.mood][String(words)])) {
					// iterations
					// iteration = FS_Object.randomObjKey(moodMap[dialogue.mood][String(words)]);
					// set the file
					// pathname = "tally/moods-v4/" + dialogue.mood + "-" + words + "-" + iteration + ".wav";
					// console.error("🎵 Sound.playTallyVoice()", "NOT FOUND!! 1", moodMap[dialogue.mood][String(words)]);

					// if getting filename from moodMap
					filename = FS_Object.randomObjProperty(moodMap[dialogue.mood][String(words)]);
					pathname = "tally/moods-v4/" + filename;
				} else return;
			} else return;
			// play the file
			play(pathname, 150);
		} catch (err) {
			console.error(err);
		}
	}


	/**
	 *	(Old) Generic play function (called from others in this obj)
	 */
	// function playOld(soundFile, delay = 0, volumeModifier = 0) {
	// try {
	// 	//if(DEBUG) console.log("🎵 Sound.play("+ soundFile +","+ delay +","+ volumeModifier +")");
	// 	// load/play sound
	// 	var audio = new Audio(chrome.extension.getURL("assets/sounds/" + soundFile));
	// 	audio.muted = true;
	// 	audio.pause();
	// 	audio.volume = T.tally_options.soundVolume + volumeModifier;
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
		try {
			// allow offline
			if (Page.data.mode.notActive) return;
			// don't allow if mode disabled or stealth
			if (T.tally_options.gameMode === "disabled" || T.tally_options.gameMode === "stealth") return;
			// don't allow if this page doesn't have focus
			if (!document.hasFocus()) return;
			// don't allow if playSounds disabled
			if (!T.tally_options.playSounds) return;
			// don't allow if in chill mode, UNLESS THEY ARE INTERACTING
			if (T.tally_options.gameMode === "chill" && !Page.data.actions.userInteractingWithGame) return;
			// don't allow if no soundFile
			if (!FS_Object.prop(soundFile)) return;
			// don't allow if no extension has issue
			if (!chrome || !chrome.extension) return;

			// check volume
			if (volumeModifier > 0.5) volumeModifier = 0;

			if (DEBUG) console.log("🎵 Sound.play() [1]",
				"soundFile =", soundFile,
				"delay =", delay,
				"volumeModifier =", volumeModifier,
			);

			// reference to audio element
			var audioEl = document.querySelector('#tally_audio');
			// add source
			$('#tally_audio_source').attr("src", chrome.extension.getURL("assets/sounds/" + soundFile));
			if (!audioEl) return console.warn("🎵 Sound.play() audioEl does not exist", audioEl, $('#tally_audio_source'));
			// update the source
			audioEl.load();
			// set volume
			audioEl.volume = FS_Number.clamp(T.tally_options.soundVolume + volumeModifier, 0, 1);

			if (DEBUG) console.log("🎵 Sound.play() [2]",
				"audioEl.volume =", audioEl.volume,
			);

			// some hacks for Chrome
			audioEl.muted = false;
			// pause
			if (!audioEl.paused && !audioEl.ended) {
				audioEl.pause();
			}
			// create promise / attempt to play
			var promise = audioEl.play();
			// if play failed
			if (promise !== undefined) {
				promise.then(_ => {
					//if(DEBUG) console.log("Autoplay started!");
				}).catch(err => {
					//console.log(err);
					//if(DEBUG) console.log("Autoplay prevented!");
					// audioEl.pause();
					// audioEl.play();
				});
			}
		} catch (err) {
			console.error(err);
		}
	}



	// PUBLIC
	return {
		playBattleMusic: playBattleMusic,
		playMusic: playMusic,
		stopMusic: stopMusic,
		playRandom: playRandom,
		playRandomPowerup: playRandomPowerup,
		playRandomJump: playRandomJump,
		playRandomJumpReverse: playRandomJumpReverse,
		playCategory: playCategory,
		playFile: function(file, delay, volume) {
			play(file, delay, volume);
		},
		playTallyVoice: playTallyVoice,
		sounds: sounds
	};
})();
