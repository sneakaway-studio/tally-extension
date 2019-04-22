"use strict";


/**
 * 	Game rule object(s)
 */
var gameRules = {};


/**
 * 	Click Score rules
 */
gameRules.clickScore = {

	// essentially, what did they click on?
	//

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


/**
 * 	Levels
 */
gameRules.levels = [

	{ "level": 1, "minScore":        0 }, // 0
	{ "level": 2, "minScore":       20 },
	{ "level": 2, "minScore":       50 },
	{ "level": 3, "minScore":      100 },
	{ "level": 4, "minScore":      200 },
	{ "level": 5, "minScore":      400 }, // 5
	{ "level": 6, "minScore":      800 },
	{ "level": 7, "minScore":     1600 },
	{ "level": 8, "minScore":     3200 },
	{ "level": 9, "minScore":     6400 },
	{ "level": 10, "minScore":    12800 }, // 10
	{ "level": 11, "minScore":    25600 },
	{ "level": 12, "minScore":    51200 },
	{ "level": 13, "minScore":   102400 },
	{ "level": 14, "minScore":   204800 },
	{ "level": 15, "minScore":   409600 }, // 15
	{ "level": 16, "minScore":   819200 },
	{ "level": 17, "minScore":  1638400 },
	{ "level": 18, "minScore":  3276800 },
	{ "level": 19, "minScore":  6553600 },
	{ "level": 20, "minScore": 13107200 }, // 20
	{ "level": 21, "minScore": 26214400 },
	{ "level": 22, "minScore": 52428800 },
	{ "level": 23, "minScore":104857600 },
	{ "level": 24, "minScore":209715200 },
	{ "level": 25, "minScore":419430400 }, // 25

];
