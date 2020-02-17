"use strict";

window.Skin = (function() {
	// PRIVATE
	let DEBUG = Debug.ALL.Skin;



	let skinStage = 0,
		currentSkinName = "magenta",
		currentSkinObj = {};

	let changeWithMonsters = false; // unsure whether to let user know we are changing


	// REVISIT these
	// https://www.visualcinnamon.com/2016/05/smooth-color-legend-d3-svg-gradient.html
	// https://codepen.io/brenna/pen/mybQVx



	// "pattern": {
	// 	"plaidYellow": {
	// 		"str": '<pattern id="tallyPattern" width="40" height="40" patternUnits="userSpaceOnUse"><rect width="40" height="40" fill="#343434"></rect><path d="M0,8l8,-8M-2,2l4,-4M6,10l4,-4" stroke="white" stroke-width="5" stroke-linecap="square"></path>'
	// 	},
	// 	"plaidRed": {
	// 		"str": '<pattern id="tallyPattern" width="40" height="40" patternUnits="userSpaceOnUse"><rect width="40" height="40" fill="#343434"></rect><path d="M0,8l8,-8M-2,2l4,-4M6,10l4,-4" stroke="white" stroke-width="5" stroke-linecap="square"></path>'
	// 	}





	/**
	 *	Set the skin color based on the stage
	 */
	function setStage(n = 0) {
		try {
			if (DEBUG) console.log("👚 Skin.setStage(" + n + ")");
			skinStage = n;
			// update skin
			if (skinStage === 1) update("yellow");
			else if (skinStage === 2) update("orange");
			else if (skinStage === 3) update("red");
			else update("magenta");
		} catch (err) {
			console.error(err);
		}
	}





	/*
	 *	Return Tally SVG
	 */
	function returnBasicSVG(defs = "") {
		try {
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
		} catch (err) {
			console.error(err);
		}
	}

	/*
	 *	Update Tally SVG
	 */
	function update(newSkinName = "magenta") {
		try {

			// // if !tally_user.skins then set magenta default
			// if (!prop(tally_user.skins) || FS_Object.objLength(tally_user.skins) < 1 || tally_user.skins[newSkinName]) {
			// 	newSkinName = "magenta";
			// }

			let def = "",
				frontFill = "",
				backFill = "";

			// set current skin name and obj
			currentSkinName = newSkinName;
			currentSkinObj = SkinData.data[currentSkinName];

			if (DEBUG) console.log("👚 Skin.update() currentSkinName = " + currentSkinName + ", currentSkinObj = " + JSON.stringify(currentSkinObj));

			// COLOR
			if (currentSkinObj.type == "color") {
				frontFill = currentSkinObj.front;
				backFill = currentSkinObj.back;
			}

			// GRADIENT
			else if (currentSkinObj.type == "gradient") {
				// make a copy of the colors
				let stops = currentSkinObj.stops.trim().split(","),
					stopColors = currentSkinObj["stop-colors"].trim().split(",");

				// use linearGradient to set gradient angle
				def += '<linearGradient id="tallyGradient" x2="1" gradientTransform="rotate(' + currentSkinObj.angle + ')"  >';


				// loop through stops in the gradient to get colors

				for (const key in stops) {
					console.log(key,stops[key]);
					if (stops[key] !== undefined) {
						def += '<stop offset="' + stops[key] + '%" stop-color="' + stopColors[key] + '">';

						def += '</stop>';
					}
				}

// not sure if this needs to be inside stop element
				//
				// if (currentSkinObj.anim) {
				// 	def += '<animate attributeName="stop-color" dur="2s" repeatCount="indefinite" ';
				// 	// def += ' values="0;1;0"';
				// 	def += ' values="'+ stopColors.join('; ') + '; ' + stopColors[0] +'"';
				// 	def += '></animate>';
				//
				// // ' + colors.join('; ') + '; ' + colors[0] + '
				//
				// 	// move last to first
				//
				//
				// 	// var last = colors.pop();
				// 	// colors.unshift(last);
				// }

				// close gradient
				def += '</linearGradient>';
				frontFill = "url(#tallyGradient)";
				backFill = "url(#tallyGradient)";
			}

			// IMAGE
			else if (currentSkinObj.type == "image") {
				def += '<pattern id="tallyPattern" patternUnits="userSpaceOnUse" width="120%" height="120%">';
				def += '<image xlink:href="' + chrome.extension.getURL('assets/img/tally/skins/' + currentSkinObj.url) + '" x="-10" y="-10" width="100%" height="100%" />';
				def += '</pattern>';
				frontFill = "url(#tallyPattern)";
				backFill = "url(#tallyPattern)";
			}

			// otherwise default to magenta
			else {
				frontFill = currentSkinObj.front;
				backFill = currentSkinObj.back;
			}

			// set/reset defs
			$('#tally-svg defs').html(def);
			// update fill
			$('.tallySkinFront').attr("fill", frontFill);
			$('.tallySkinBack').attr("fill", backFill);
		} catch (err) {
			console.error(err);
		}
	}


	function random() {
		try {
			update(FS_Object.randomObjProperty(SkinData.data).name);
		} catch (err) {
			console.error(err);
		}
	}








	// PUBLIC
	return {
		update: function(str) {
			update(str);
		},
		returnBasicSVG: function() {
			return returnBasicSVG();
		},
		setStage: function(n) {
			setStage(n);
		},
		random: random,





		// returnSkin: function(skin) {
		// 	return returnSkin(skin);
		// }

		//preload: preload

	};
})();
