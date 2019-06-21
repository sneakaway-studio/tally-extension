"use strict";

var GameData = (function() {


	let socialDomains = [
		"facebook.com",
		"instagram.com",
		"reddit.com",
		"twitter.com",
		"youtube.com",
		"linkedin.com"
	];

	let clickScore = {
		"click": 	1,
		"like": 	2,
		"button": 	3,
		"image": 	5,
		"submit": 	5,
		"form": 	5,
		"SO-vote": 	10,
		"powerup": 	10,
		"ultra": 	100,
	};

	let levels = [
		{ "level": 0, "xp":         0 },
		{ "level": 1, "xp":        20 },
		{ "level": 2, "xp":        50 },
		{ "level": 3, "xp":       100 },
		{ "level": 4, "xp":       200 },
		{ "level": 5, "xp":       400 },
		{ "level": 6, "xp":       800 },
		{ "level": 7, "xp":      1600 },
		{ "level": 8, "xp":      3200 },
		{ "level": 9, "xp":      6400 },
		{ "level": 10, "xp":    12800 },
		{ "level": 11, "xp":    25600 },
		{ "level": 12, "xp":    51200 },
		{ "level": 13, "xp":   102400 },
		{ "level": 14, "xp":   204800 },
		{ "level": 15, "xp":   409600 },
		{ "level": 16, "xp":   819200 },
		{ "level": 17, "xp":  1638400 },
		{ "level": 18, "xp":  3276800 },
		{ "level": 19, "xp":  6553600 },
		{ "level": 20, "xp": 13107200 },
		{ "level": 21, "xp": 26214400 },
		{ "level": 22, "xp": 52428800 },
		{ "level": 23, "xp":104857600 },
		{ "level": 24, "xp":209715200 },
		{ "level": 25, "xp":419430400 },
	];

	return {
		socialDomains: socialDomains,
		clickScore: clickScore,
		levels: levels
	};
})();
