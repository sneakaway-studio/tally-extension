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

	let domainKeywords = {
		"facebook.com": "social,networks,facebook,like",
	};

	let clickScore = {
		"click": 	1,
		"like": 	2,
		"button": 	3,
		"image": 	5,
		"submit": 	5,
		"form": 	5,
		"SO-vote": 	3,
		"powerup": 	10,
		"ultra": 	100,
	};


	let attackLimits = [0,1,2,3,4];

	// added 0 even though new installs default to level=1
	// in order to make array work elsewhere intuitive (e.g. level = array[n])
	let levels = [
		{ "level":	0	, "xp":	0	 },
		{ "level":	1	, "xp":	0	 },
		{ "level":	2	, "xp":	8	 },
		{ "level":	3	, "xp":	27	 },
		{ "level":	4	, "xp":	64	 },
		{ "level":	5	, "xp":	125	 },
		{ "level":	6	, "xp":	216	 },
		{ "level":	7	, "xp":	343	 },
		{ "level":	8	, "xp":	512	 },
		{ "level":	9	, "xp":	729	 },
		{ "level":	10	, "xp":	1000	 },
		{ "level":	11	, "xp":	1331	 },
		{ "level":	12	, "xp":	1728	 },
		{ "level":	13	, "xp":	2197	 },
		{ "level":	14	, "xp":	2744	 },
		{ "level":	15	, "xp":	3375	 },
		{ "level":	16	, "xp":	4096	 },
		{ "level":	17	, "xp":	4913	 },
		{ "level":	18	, "xp":	5832	 },
		{ "level":	19	, "xp":	6859	 },
		{ "level":	20	, "xp":	8000	 },
		{ "level":	21	, "xp":	9261	 },
		{ "level":	22	, "xp":	10648	 },
		{ "level":	23	, "xp":	12167	 },
		{ "level":	24	, "xp":	13824	 },
		{ "level":	25	, "xp":	15625	 },
		{ "level":	26	, "xp":	17576	 },
		{ "level":	27	, "xp":	19683	 },
		{ "level":	28	, "xp":	21952	 },
		{ "level":	29	, "xp":	24389	 },
		{ "level":	30	, "xp":	27000	 },
		{ "level":	31	, "xp":	29791	 },
		{ "level":	32	, "xp":	32768	 },
		{ "level":	33	, "xp":	35937	 },
		{ "level":	34	, "xp":	39304	 },
		{ "level":	35	, "xp":	42875	 },
		{ "level":	36	, "xp":	46656	 },
		{ "level":	37	, "xp":	50653	 },
		{ "level":	38	, "xp":	54872	 },
		{ "level":	39	, "xp":	59319	 },
		{ "level":	40	, "xp":	64000	 },
		{ "level":	41	, "xp":	68921	 },
		{ "level":	42	, "xp":	74088	 },
		{ "level":	43	, "xp":	79507	 },
		{ "level":	44	, "xp":	85184	 },
		{ "level":	45	, "xp":	91125	 },
		{ "level":	46	, "xp":	97336	 },
		{ "level":	47	, "xp":	103823	 },
		{ "level":	48	, "xp":	110592	 },
		{ "level":	49	, "xp":	117649	 },
		{ "level":	50	, "xp":	125000	 },
		{ "level":	51	, "xp":	132651	 },
		{ "level":	52	, "xp":	140608	 },
		{ "level":	53	, "xp":	148877	 },
		{ "level":	54	, "xp":	157464	 },
		{ "level":	55	, "xp":	166375	 },
		{ "level":	56	, "xp":	175616	 },
		{ "level":	57	, "xp":	185193	 },
		{ "level":	58	, "xp":	195112	 },
		{ "level":	59	, "xp":	205379	 },
		{ "level":	60	, "xp":	216000	 },
		{ "level":	61	, "xp":	226981	 },
		{ "level":	62	, "xp":	238328	 },
		{ "level":	63	, "xp":	250047	 },
		{ "level":	64	, "xp":	262144	 },
		{ "level":	65	, "xp":	274625	 },
		{ "level":	66	, "xp":	287496	 },
		{ "level":	67	, "xp":	300763	 },
		{ "level":	68	, "xp":	314432	 },
		{ "level":	69	, "xp":	328509	 },
		{ "level":	70	, "xp":	343000	 },
		{ "level":	71	, "xp":	357911	 },
		{ "level":	72	, "xp":	373248	 },
		{ "level":	73	, "xp":	389017	 },
		{ "level":	74	, "xp":	405224	 },
		{ "level":	75	, "xp":	421875	 },
		{ "level":	76	, "xp":	438976	 },
		{ "level":	77	, "xp":	456533	 },
		{ "level":	78	, "xp":	474552	 },
		{ "level":	79	, "xp":	493039	 },
		{ "level":	80	, "xp":	512000	 },
		{ "level":	81	, "xp":	531441	 },
		{ "level":	82	, "xp":	551368	 },
		{ "level":	83	, "xp":	571787	 },
		{ "level":	84	, "xp":	592704	 },
		{ "level":	85	, "xp":	614125	 },
		{ "level":	86	, "xp":	636056	 },
		{ "level":	87	, "xp":	658503	 },
		{ "level":	88	, "xp":	681472	 },
		{ "level":	89	, "xp":	704969	 },
		{ "level":	90	, "xp":	729000	 },
		{ "level":	91	, "xp":	753571	 },
		{ "level":	92	, "xp":	778688	 },
		{ "level":	93	, "xp":	804357	 },
		{ "level":	94	, "xp":	830584	 },
		{ "level":	95	, "xp":	857375	 },
		{ "level":	96	, "xp":	884736	 },
		{ "level":	97	, "xp":	912673	 },
		{ "level":	98	, "xp":	941192	 },
		{ "level":	99	, "xp":	970299	 },
		{ "level":	100	, "xp":	1000000	 },
	];


	let flags = {
		"levelUp": {
			"name": "levelUp",
			"dialogue": "You just leveled up!",
			"mood": "happy",
			"status": null
		}
	};

	return {
		socialDomains: socialDomains,
		clickScore: clickScore,
		attackLimits: attackLimits,
		levels: levels,
		flags: flags
	};
})();
