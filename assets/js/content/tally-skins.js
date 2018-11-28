"use strict";

window.Skin = (function() {
	// PRIVATE

	let SKIN_DEBUG = false;
	let skins = {
			"color": {
				"magenta": {
					front: "#D32CF1",
					back: "#C308C1"
				},
				"red": {
					front: "#fd0202",
					back: "#db0606"
				},
				"orange": {
					front: "#fe8023",
					back: "#ed6d10"
				},
				"yellow": {
					front: "#f1ce2c",
					back: "#e0c02a"
				},
				"cyan": {
					front: "#2ccef1",
					back: "#1eaecd"
				},
			},
			"gradient": {
				"gold": {
					"angle": 90,
					"stops": {
						"20%": "gold",
						"90%": "red"
					}
				},
				"rainbow": {
					"angle": 45,
					"stops": {
						"10%": "#b33bfd",
						"15%": "#733cfa",
						"20%": "#363afd",
						"25%": "#3268fc",
						"30%": "#38a4fc",
						"35%": "#3ce1fd",
						"40%": "#3efee5",
						"45%": "#3affa5",
						"50%": "#40fd7c",
						"55%": "#40fc43",
						"60%": "#7cfd41",
						"70%": "#b6fe43",
						"75%": "#fffc4a",
						"85%": "#fec842",
						"95%": "#fe863a",
						"100%": "#fe0000",
					}
				}
			},
			// "pattern": {
			// 	"plaidYellow": {
			// 		"str": '<pattern id="tallyPattern" width="40" height="40" patternUnits="userSpaceOnUse"><rect width="40" height="40" fill="#343434"></rect><path d="M0,8l8,-8M-2,2l4,-4M6,10l4,-4" stroke="white" stroke-width="5" stroke-linecap="square"></path>'
			// 	},
			// 	"plaidRed": {
			// 		"str": '<pattern id="tallyPattern" width="40" height="40" patternUnits="userSpaceOnUse"><rect width="40" height="40" fill="#343434"></rect><path d="M0,8l8,-8M-2,2l4,-4M6,10l4,-4" stroke="white" stroke-width="5" stroke-linecap="square"></path>'
			// 	}
			// },
			"image": {
				"flowerRetro": {
					"url": chrome.extension.getURL('assets/img/tally-skins/skin-pattern-flower-retro.png'),
					"w": 222,
					"h": 198
				},
				"plaidRed": {
					"url": chrome.extension.getURL('assets/img/tally-skins/skin-pattern-plaid-red.png'),
					"w": 225,
					"h": 225
				},
				"camoGrey": {
					"url": chrome.extension.getURL('assets/img/tally-skins/skin-pattern-camo-grey.png'),
					"w": 225,
					"h": 225
				},
				"plaidYellow": {
					"url": chrome.extension.getURL('assets/img/tally-skins/patterns/plaidYellow.png'),
					"w": 311,
					"h": 162
				}
			}
		},
		skinStage = 0;

	// var skins = [
	// 	"color-cyan",
	// 	"color-magenta",
	// 	"color-yellow",
	// 	"grad-rainbow",
	// 	"grad-yellow-orange",
	// 	"pattern-camo-grey",
	// 	"pattern-flower-retro",
	// 	"pattern-plaid-red"
	// ];


	/**
	 *	Set the skin color based on the stage
	 */
	function setStage(n) {
		console.log("Skin.setStage(" + n + ")");
		skinStage = n;
		let stageColors = [
			"color-magenta",
			"color-yellow",
			"color-orange",
			"color-red"
		];
		update(stageColors[n]);
	}





	/*
	 *	Default Tally SVG
	 */
	function returnBasicSVG(defs = "") {
		// old bitmap method
		//svg = "<img class='tally-svg' src='" + chrome.extension.getURL('assets/img/tally/tally.svg') + "'>";

		var svg = "";
		svg += '<svg id="tally-svg" class="tally" ' +
			'xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" ' +
			'viewBox="0 0 914 814">';
		svg += '<defs>';
		svg += '<style type="text/css"> .tallySkinBack {fill:#C308C1;} .tallySkinFront {fill:#D32CF1;} </style>';
		svg += defs + '</defs>';
		svg += '<path class="tally tallySkinBack" d="M652.5,793.8l255.5-281L565.2,127.6l-307.3,35L5,366l88.5,346.8L652.5,793.8z"/>';
		svg += '<path class="tally tallySkinFront" d="M199.8,809l419.9-139.2l126.5,10.1l161.9-319L690.5,14.1L509.8,36.2L450.2,' +
			'4L258.3,66.9l-190,23.2 l-17.7,443L199.8,809z"/>';
		svg += '</svg>';
		return svg;
	}




	/*
	 *	Update Tally SVG
	 */
	function update(_skin) {
		if (SKIN_DEBUG) console.log("👚👗 Skin.update()", _skin);
		if (_skin != "" && prop(tally_game_status)) tally_game_status.skin = _skin;
		// save the skin status
		saveGameStatus(tally_game_status);

		let skin = _skin.split("-"),
			obj = {},
			def = "",
			frontFill = "",
			backFill = "";

		// if !skin
		if (!prop(skins[skin[0]]) || skins[skin[0]] == "") {
			skin[0] = "color";
			skin[1] = "magenta";
		}
		// get object reference
		obj = skins[skin[0]][skin[1]];
		console.log(skin, obj);

		// if a solid color
		if (skin[0] == "color") {
			frontFill = obj.front;
			backFill = obj.back;
		}
		// if a gradient
		else if (skin[0] == "gradient") {
			// use linearGradient
			def += '<linearGradient id="tallyGradient" x2="1" gradientTransform="rotate(' + obj.angle + ')"  >';
			// loop through stops in the gradient
			for (const key in obj.stops) {
				def += '<stop offset="' + key + '" stop-color="' + obj.stops[key] + '"/>';
			}
			// close gradient
			def += '</linearGradient>';
			frontFill = "url(#tallyGradient)";
			backFill = "url(#tallyGradient)";
		}
		// PATTERN
		else if (skin[0] == "pattern") {
			def = obj.str;
			frontFill = "url(#tallyPattern)";
			backFill = "url(#tallyPattern)";
		}
		// IMAGE
		else if (skin[0] == "image") {
			def += '<pattern id="tallyPattern" patternUnits="userSpaceOnUse" width="100%" height="100%">';
			def += '<image xlink:href="' + obj.url + '" x="-10" y="-10" width="100%" height="100%" />';
			def += '</pattern>';
			frontFill = "url(#tallyPattern)";
			backFill = "url(#tallyPattern)";
		}
		// otherwise default to magenta
		else {
			frontFill = obj.front;
			backFill = obj.back;
		}

		// set/reset defs
		$('#tally-svg defs').html(def);
		// update fill
		$('.tallySkinFront').attr("fill", frontFill);
		$('.tallySkinBack').attr("fill", backFill);
	}


	function random(){
		var r = Math.random();
		if (r < 0.1)
			update("color", "magenta");
		else if (r < 0.2)
			update("color", "cyan");
		else if (r < 0.4)
			update("gradient", "rainbow");
		else if (r < 0.6)
			update("gradient", "redGold", "animation");
		else if (r < 0.7)
			update("gradient", "blueGreen", "animation");
		else if (r < 0.08)
			update("image", "camoGrey");
		else if (r < 0.09)
			update("pattern", "plaidYellow");
		else if (r < 1)
			update("image", "plaidRed");
	}


	// PUBLIC
	return {
		update: function(skinCat, skinColor, skinAnim) {
			update(skinCat, skinColor, skinAnim);
		},
		returnBasicSVG: function() {
			return returnBasicSVG();
		},
		setStage: function(n) {
			setStage(n);
		},
		random: random,
		skins: skins,

		returnSkin: function(skin) {
			return returnSkin(skin);
		}

		//preload: preload

	};
})();
