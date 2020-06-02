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

	function returnPatternStr(pattern) {
		try {
			let str = "";

			if (pattern === "houndstooth") {
				// w/h = how often repeat happens
				str += '<pattern id="tallyPattern" x="0" y="0" width="70" height="70" patternUnits="userSpaceOnUse">';
				str += '<g id="tallyFrontGroup" fill="rgba(255,255,255,.15)">';
				str += '<path d="M70.173,20.624 L89.265,19.917 L70.880,38.302 L70.173,53.151 L34.818,88.506 L34.111,72.243 L52.496,53.858 L34.818,54.565 L35.525,36.887 L17.140,55.272 L0.877,54.565 L36.232,19.210 L51.789,19.210 L70.173,0.825 L70.173,20.624 Z" />';
				str += '</g>';
				// duplicate and reposition the pattern -->
				str += '<use x="70" y="0" xlink:href="#tallyFrontGroup" />';
				str += '<use x="0" y="-70" xlink:href="#tallyFrontGroup" />';
				str += '<use x="-70" y="0" xlink:href="#tallyFrontGroup" />';
				str += '</pattern>';
			}
			return str;
		} catch (err) {
			console.error(err);
		}
	}







	/*
	 *	Return Tally SVG
	 */
	function returnTallySVG() {
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
			svg += '<svg id="tally-svg" class="tally" viewBox="0 0 914 814" ' +
				// 'xmlns:xlink="http://www.w3.org/1999/xlink" '+
				'xmlns="http://www.w3.org/2000/svg" ' +
				' overflow="hidden" ' +
				'>';
			svg += '<defs>' + skinData.pattern + skinData.gradient + '</defs>';

			// alt method: use CSS
			// svg += '<style type="text/css"> .tallySkinBackFill {fill:#C308C1;} .tallySkinFrontFill {fill:#D32CF1;} </style>';


			// back fill (color or gradient)
			svg += '<path class="tally tallySkinBackFill" fill="' + skinData.backFill + '"' +
				' d="M652.5 793.8l255.5-281-342.8-385.2-307.3 35L5 366l88.5 346.8 559 81z"/>';
			// back pattern
			svg += '<path class="tally tallySkinBackPattern" fill="url(#tallyPattern)"' +
				' d="M652.5 793.8l255.5-281-342.8-385.2-307.3 35L5 366l88.5 346.8 559 81z"/>';

			// front fill (color or gradient)
			svg += '<path class="tally tallySkinFrontFill" fill="' + skinData.frontFill + '"' +
				' d="M199.8 809l419.9-139.2 126.5 10.1 161.9-319L690.5 14.1 509.8 36.2 450.2 4 258.3 66.9l-190 23.2-17.7 443L199.8 809z"/>';
			// front pattern
			svg += '<path class="tally tallySkinFrontPattern" fill="url(#tallyPattern)"' +
				' d="M199.8 809l419.9-139.2 126.5 10.1 161.9-319L690.5 14.1 509.8 36.2 450.2 4 258.3 66.9l-190 23.2-17.7 443L199.8 809z"/>';


			svg += '</svg>';
			return svg;
		} catch (err) {
			console.error(err);
		}
	}

	/*
	 *	Return the skin information
	 *	1) to initalize tally character or
	 *	2) update after on character already on screen
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

			// object to hold / pass strings
			let skinData = {
				"pattern": "",
				"gradient": "",
				"frontFill": "",
				"backFill": ""
			};

			// type = COLOR
			// - apply front and back fill only
			if (currentSkinObj.type == "color") {
				skinData.frontFill = currentSkinObj.front;
				skinData.backFill = currentSkinObj.back;
			}

			// type = GRADIENT
			// - add string to <gradient>
			// - then store reference in fills
			else if (currentSkinObj.type == "gradient") {
				let gradientObj = assembleGradient(currentSkinObj);
				skinData.gradient = gradientObj.front + gradientObj.back;
				skinData.frontFill = "url(#tallyGradientFront)";
				skinData.backFill = "url(#tallyGradientBack)";
			}

			// type = IMAGE
			// - add image url to <pattern>
			// - then store reference in fills
			else if (currentSkinObj.type == "image") {
				skinData.pattern = '<pattern id="tallyPattern" patternUnits="userSpaceOnUse" width="120%" height="120%">' +
					'<image xlink:href="' + chrome.extension.getURL('assets/img/tally/skins/' + currentSkinObj.url) +
					'" x="-10" y="-10" width="100%" height="100%" />' +
					'</pattern>';
				// if an image then make fill transparent
				skinData.frontFill = "rgba(0,0,0,0)";
				skinData.backFill = "rgba(0,0,0,0)";
			}

			// type = PATTERN
			// - add SVG to <pattern>
			// - then store reference in fills
			// TEMP COMMENT OUT - TALLY WAS INVISIBLE!?
			// removed from spreadsheet, may eventually delete
			// houndstooth	pattern			225	225	pattern-houndstooth.svg
			// else if (currentSkinObj.type == "pattern") {
			// 	skinData.pattern = returnPatternStr("houndstooth");
			// 	// if an SVG pattern then make fill based on current
			// 	skinData.frontFill = "url(#tallyPattern)";
			// 	skinData.backFill = "url(#tallyPattern)";
			// }

			// DEFAULT
			// otherwise default to magenta fill
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
	 *	Assemble an SVG gradient
	 */
	function assembleGradient(currentSkinObj) {
		try {

			let gradientObj = {
				"stops": currentSkinObj.stops.trim().split(","),
				"stopColors": currentSkinObj["stop-colors"].trim().split(","),
				"front": "",
				"back": ""
			};

			// use linearGradient to set gradient angle
			gradientObj.front = '<linearGradient id="tallyGradientFront" x2="1" gradientTransform="rotate(' + currentSkinObj.angle + ')" >';
			gradientObj.back = '<linearGradient id="tallyGradientBack" x2="1" gradientTransform="rotate(' + (currentSkinObj.angle + 135) + ')" >';

			// loop through stops in the gradient to get colors
			for (const key in gradientObj.stops) {
				if (DEBUG) console.log("👚 Skin.assembleGradient()", key, gradientObj.stops[key]);
				if (gradientObj.stops[key] !== undefined) {
					gradientObj.front += '<stop offset="' + gradientObj.stops[key] + '%" stop-color="' +
						gradientObj.stopColors[key] + '"></stop>';
					gradientObj.back += '<stop offset="' + gradientObj.stops[key] + '%" stop-color="' +
						gradientObj.stopColors[key] + '"></stop>';
				}
			}

			// not sure if this needs to be inside stop element
			//
			// if (currentSkinObj.anim) {
			// 	frontGradient += '<animate attributeName="stop-color" dur="2s" repeatCount="indefinite" ';
			// 	// skinData.gradient += ' values="0;1;0"';
			// 	frontGradient += ' values="'+ stopColors.join('; ') + '; ' + stopColors[0] +'"';
			// 	frontGradient += '></animate>';
			//
			// // ' + colors.join('; ') + '; ' + colors[0] + '
			//
			// 	// move last to first
			//
			// 	// var last = colors.pop();
			// 	// colors.unshift(last);
			// }

			// close gradient
			gradientObj.front += '</linearGradient>';
			gradientObj.back += '</linearGradient>';

			return gradientObj;


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
			// set defs (this also determines any patterns or images)
			$('#tally-svg defs').html(skinData.pattern + skinData.gradient);
			// and fill
			$('#tally-svg .tallySkinFrontFill').attr("fill", skinData.frontFill);
			$('#tally-svg .tallySkinBackFill').attr("fill", skinData.backFill);

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
