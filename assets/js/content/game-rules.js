


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
	"powerup": 	10,
	"ultra": 	100,
};


/**
 * 	Levels
 */
gameRules.levels = [

	{ "minScore":        0 }, // 0
	{ "minScore":       20 }, 
	{ "minScore":       50 }, 
	{ "minScore":      100 },
	{ "minScore":      200 },
	{ "minScore":      400 }, // 5 
	{ "minScore":      800 },
	{ "minScore":     1600 }, 
	{ "minScore":     3200 }, 
	{ "minScore":     6400 }, 
	{ "minScore":    12800 }, // 10
	{ "minScore":    25600 },
	{ "minScore":    51200 },
	{ "minScore":   102400 }, 
	{ "minScore":   204800 }, 
	{ "minScore":   409600 }, // 15
	{ "minScore":   819200 }, 
	{ "minScore":  1638400 }, 
	{ "minScore":  3276800 }, 
	{ "minScore":  6553600 }, 
	{ "minScore": 13107200 }, // 20
	{ "minScore": 26214400 }, 
	{ "minScore": 52428800 }, 
	{ "minScore":104857600 }, 
	{ "minScore":209715200 }, 
	{ "minScore":419430400 }, // 25

];
