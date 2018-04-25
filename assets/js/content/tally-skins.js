"use strict";

var Skin = (function() {
	// PRIVATE

	// default
	let skins = {
		"color-magenta": {
			front: "#D32CF1",
			back: "#C308C1"
		},
		"color-red": {
			front: "#fd0202",
			back: "#db0606"
		},
		"color-orange": {
			front: "#fe8023",
			back: "#ed6d10"
		},
		"color-yellow": {
			front: "#f1ce2c",
			back: "#e0c02a"
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




	function updateList() {
		//skins = tally_user.skins;
	}

	// replacing with svg
	// function preload() {
	// 	//console.log("preloadSkins()",tally_user.skins);
	// 	updateList();
	// 	let str = "";
	// 	// for (let i = 0, l = skins.length; i < l; i++) {
	// 	// 	str += "url('" + chrome.extension.getURL('assets/img/tally-skins/skin-' + skins[i] + ".png'") + ")";
	// 	// }
	// 	for (let i in skins){
	// 		str += "url('" + chrome.extension.getURL('assets/img/tally-skins/skin-' + skins[i] + ".png'") + ")";
	// 	}
	// 	$("#tally::after").css({
	// 		"position": "absolute",
	// 		"width": "0",
	// 		"height": "0",
	// 		"overflow": "hidden",
	// 		"z-index": "-1",
	// 		"content": str
	// 	});
	// }

	/**
	 *	Set the skin color using a reference: "color-magenta"
	 */
	function set(skin) {
		console.log("Skin.set()", skin);
		if (skin != "" && prop(tally_game_status)) tally_game_status.skin = skin;
		saveGameStatus(tally_game_status);
		updateList();

		// random color
		var r = Math.floor(Math.random() * 255);
		var g = Math.floor(Math.random() * 255);
		var b = Math.floor(Math.random() * 255);
		$("#tally-front").css({
			//fill: 'rgb(' + r + ', ' + g + ' , ' + b + ')'
			fill: skins[skin].front
		});
		$("#tally-back").css({
			//fill: 'rgb(' + r + ', ' + g + ' , ' + b + ')'
			fill: skins[skin].back
		});

		// bitmap image method
		// let url = chrome.extension.getURL('assets/img/tally-skins/skin-' + skins[skin] + '.png');
		// $("#tally_character_container").css("background-image", "url('" + url + "')");
	}
	/**
	 *	Set the skin color based on the stage
	 */
	function setStage(n) {
		skinStage = n;
		let stageColors = [
			"color-magenta",
			"color-yellow",
			"color-orange",
			"color-red"
		];
		set(stageColors[n]);
	}

	// PUBLIC
	return {
		set: function(skin) {
			set(skin);
		},
		setStage: function(n) {
			setStage(n);
		},
		skins:skins
		//preload: preload

	};
})();
