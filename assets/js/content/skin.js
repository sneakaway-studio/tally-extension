"use strict";

window.Skin = (function() {
	// PRIVATE
	let DEBUG = Debug.ALL.Skin,
		currentMonsterStage = 0,
		currentSkinName = "magenta",
		currentSkinObj = {};

	let changeWithMonsters = false; // unsure whether to let user know we are changing


	// REVISIT these
	// https://www.visualcinnamon.com/2016/05/smooth-color-legend-d3-svg-gradient.html
	// https://codepen.io/brenna/pen/mybQVx

	// "pattern": {
	// 	"plaidYellow": {
	// 		"str": '<pattern id="tallyPattern" width="40" height="40" patternUnits="userSpaceOnUse">'+
	// '<rect width="40" height="40" fill="#343434"></rect>'+
	// '<path d="M0,8l8,-8M-2,2l4,-4M6,10l4,-4" stroke="white" stroke-width="5" stroke-linecap="square"></path>'
	// 	},
	// 	"plaidRed": {
	// 		"str": '<pattern id="tallyPattern" width="40" height="40" patternUnits="userSpaceOnUse">'+
	// '<rect width="40" height="40" fill="#343434"></rect>'+
	// '<path d="M0,8l8,-8M-2,2l4,-4M6,10l4,-4" stroke="white" stroke-width="5" stroke-linecap="square"></path>'
	// 	}





	/**
	 *	Update the skin color (using the highest monster stage and skin name)
	 */
	function updateFromHighestMonsterStage() {
		try {
			if (DEBUG) console.log("👚 Skin.updateFromHighestMonsterStage() [1] currentMonsterStage =",
				currentMonsterStage, ", currentSkinName=", currentSkinName);
			// console.trace();

			// save the highest stage
			currentMonsterStage = returnHighestMonsterStage();
			// save the current skin name
			currentSkinName = returnSkinNameFromStage(currentMonsterStage);

			if (DEBUG) console.log("👚 Skin.updateFromHighestMonsterStage() [2] currentMonsterStage =",
				currentMonsterStage, ", currentSkinName=", currentSkinName);

			// change skin
			update(currentSkinName);

		} catch (err) {
			console.error(err);
		}
	}

	/*
	 *	Return the number of the monster with the highest stage
	 */
	function returnHighestMonsterStage() {
		try {
			let highestStage = 0;
			// loop through nearby monsters
			for (var mid in tally_nearby_monsters) {
				if (tally_nearby_monsters.hasOwnProperty(mid)) {
					// skin should reflect highest stage
					highestStage = Math.max(highestStage, parseInt(tally_nearby_monsters[mid].stage));
				}
			}
			if (DEBUG) console.log("👚 Skin.returnHighestMonsterStage() highestStage =", highestStage);

			return highestStage;

		} catch (err) {
			console.error(err);
		}
	}

	/*
	 *	Save and return the skin name from a stage
	 */
	function returnSkinNameFromStage(stage = 0) {
		try {
			if (DEBUG) console.log("👚 Skin.returnSkinNameFromStage()", stage);

			if (stage === 1) currentSkinName = "yellow";
			else if (stage === 2) currentSkinName = "orange";
			else if (stage === 3) currentSkinName = "red";
			else currentSkinName = "magenta";

			return currentSkinName;

		} catch (err) {
			console.error(err);
		}
	}





	/*
	 *	Return Tally SVG
	 */
	function returnTallySVG(defs = "") {
		try {
			if (DEBUG) console.log("👚 Skin.returnTallySVG()");

			// run first so we have accurate color
			let highestStage = returnHighestMonsterStage();
			// get skin name
			let newSkinName = returnSkinNameFromStage(highestStage);
			// get skin data
			let skinData = returnSkinData(newSkinName);

			// old bitmap method
			//svg = "<img class='tally-svg' src='" + chrome.extension.getURL('assets/img/tally/tally.svg') + "'>";

			var svg = "";
			svg += '<svg id="tally-svg" class="tally" viewBox="0 0 914 814"' +
				'xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">';
			svg += '<defs>' + defs + '</defs>';
			// svg += '<style type="text/css"> .tallySkinBack {fill:#C308C1;} .tallySkinFront {fill:#D32CF1;} </style>';
			svg += '<path class="tally tallySkinBack" fill="' + skinData.backFill +
				'" d="M652.5,793.8l255.5-281L565.2,127.6l-307.3,35L5,366l88.5,346.8L652.5,793.8z"/>';
			svg += '<path class="tally tallySkinFront" fill="' + skinData.frontFill +
				'" d="M199.8,809l419.9-139.2l126.5,10.1l161.9-319L690.5,14.1L509.8,36.2L450.2,' +
				'4L258.3,66.9l-190,23.2 l-17.7,443L199.8,809z"/>';
			svg += '</svg>';
			return svg;
		} catch (err) {
			console.error(err);
		}
	}

	/*
	 *	Return the skin information 1) to initalize tally character or 2) update after on screen
	 */
	function returnSkinData(newSkinName = "magenta") {
		try {
			if (DEBUG) console.log("👚 Skin.returnSkinData() [1] newSkinName =", newSkinName);

			// if skin doesn't exist set magenta default
			if (!FS_Object.prop(tally_user.skins) ||
				FS_Object.objLength(tally_user.skins) < 1 || tally_user.skins[newSkinName]) {
				newSkinName = "magenta";
			}
			// set current skin name and obj
			currentSkinName = newSkinName;
			currentSkinObj = SkinData.data[currentSkinName];
			if (DEBUG) console.log("👚 Skin.returnSkinData() [2] currentSkinName = " + currentSkinName +
				", currentSkinObj = " + JSON.stringify(currentSkinObj));

			// object to hold / pass
			let skinData = {
				"def": "",
				"frontFill": "",
				"backFill": ""
			};

			// type = COLOR
			if (currentSkinObj.type == "color") {
				skinData.frontFill = currentSkinObj.front;
				skinData.backFill = currentSkinObj.back;
			}

			// type = GRADIENT
			else if (currentSkinObj.type == "gradient") {
				// make a copy of the colors
				let stops = currentSkinObj.stops.trim().split(","),
					stopColors = currentSkinObj["stop-colors"].trim().split(",");

				// use linearGradient to set gradient angle
				skinData.def += '<linearGradient id="tallyGradient" x2="1" gradientTransform="rotate(' + currentSkinObj.angle + ')" >';

				// loop through stops in the gradient to get colors
				for (const key in stops) {
					console.log(key, stops[key]);
					if (stops[key] !== undefined) {
						skinData.def += '<stop offset="' + stops[key] + '%" stop-color="' + stopColors[key] + '">';

						skinData.def += '</stop>';
					}
				}

				// not sure if this needs to be inside stop element
				//
				// if (currentSkinObj.anim) {
				// 	skinData.def += '<animate attributeName="stop-color" dur="2s" repeatCount="indefinite" ';
				// 	// skinData.def += ' values="0;1;0"';
				// 	skinData.def += ' values="'+ stopColors.join('; ') + '; ' + stopColors[0] +'"';
				// 	skinData.def += '></animate>';
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
				skinData.def += '</linearGradient>';
				skinData.frontFill = "url(#tallyGradient)";
				skinData.backFill = "url(#tallyGradient)";
			}

			// type = IMAGE
			else if (currentSkinObj.type == "image") {
				skinData.def += '<pattern id="tallyPattern" patternUnits="userSpaceOnUse" width="120%" height="120%">';
				skinData.def += '<image xlink:href="' + chrome.extension.getURL('assets/img/tally/skins/' +
					currentSkinObj.url) + '" x="-10" y="-10" width="100%" height="100%" />';
				skinData.def += '</pattern>';
				skinData.frontFill = "url(#tallyPattern)";
				skinData.backFill = "url(#tallyPattern)";
			}

			// otherwise default to magenta
			else {
				skinData.frontFill = currentSkinObj.front;
				skinData.backFill = currentSkinObj.back;
			}

			return skinData;


		} catch (err) {
			console.error(err);
		}
	}

	/*
	 *	Update Tally SVG (already on page)
	 */
	function update(newSkinName) {
		try {
			// allow offline
			if (Page.mode().notActive) return;
			// don't allow if mode disabled or stealth
			if (tally_options.gameMode === "disabled" || tally_options.gameMode === "stealth") return;

			// get skin data
			let skinData = returnSkinData(newSkinName);
			// set def and fill
			$('#tally-svg defs').html(skinData.def);
			$('.tallySkinFront').attr("fill", skinData.frontFill);
			$('.tallySkinBack').attr("fill", skinData.backFill);
		} catch (err) {
			console.error(err);
		}
	}

	/*
	 *	Select and change to a random skin
	 */
	function random() {
		try {
			update(FS_Object.randomObjProperty(SkinData.data).name);
		} catch (err) {
			console.error(err);
		}
	}




	// PUBLIC
	return {
		update: update,
		returnTallySVG: returnTallySVG,
		updateFromHighestMonsterStage: updateFromHighestMonsterStage,
		returnHighestMonsterStage: returnHighestMonsterStage,
		random: random,


		// returnSkin: function(skin) {
		// 	return returnSkin(skin);
		// }

		//preload: preload

	};
})();
