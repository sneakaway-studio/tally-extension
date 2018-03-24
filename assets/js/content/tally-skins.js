"use strict";

var Skin = (function() {
	// PRIVATE

	// default
	var skins = {
		"color-magenta":"color-magenta",
		"color-red":"color-red",
		"color-orange":"color-orange",
		"color-yellow":"color-yellow"
	};

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

	function preload() {
		//console.log("preloadSkins()",tally_user.skins);
		updateList();
		let str = "";
		// for (let i = 0, l = skins.length; i < l; i++) {
		// 	str += "url('" + chrome.extension.getURL('assets/img/tally-skins/skin-' + skins[i] + ".png'") + ")";
		// }
		for (let i in skins){
			str += "url('" + chrome.extension.getURL('assets/img/tally-skins/skin-' + skins[i] + ".png'") + ")";
		}
		$("#tally::after").css({
			"position": "absolute",
			"width": "0",
			"height": "0",
			"overflow": "hidden",
			"z-index": "-1",
			"content": str
		});
	}

	function set(skin) {
		if (skin != "") tally_game_status.skin = skin;
		saveGameStatus(tally_game_status);
		updateList();
		let url = chrome.extension.getURL('assets/img/tally-skins/skin-' + skins[skin] + '.png');
		$("#tally_character_container").css("background-image", "url('" + url + "')");
	}

	// PUBLIC
	return {
		set: function(skin){
			set(skin);
		},
		preload: preload

	};
})();
