/*jshint esversion: 6 */


/**
 *	Get data about this page
 */
function getPageData() {
	var url = document.location.href;
	// only run on web pages
	if (!url || !url.match(/^http/)) return;
	// object
	var data = {
		activeOnPage: false,
		description: getDescription(),
		domain: extractRootDomain(document.location.href),
		h1: getH1(),
		keywords: getKeywords(),
		mouseX: 0,
		mouseY: 0,
		mouseupFired: false,
		subDomain: extractSubDomain(document.location.href),
		tags: "",
		time: 0,
		title: getTitle(),
		trackers: getTrackers(),
		previousUrl: "",
		url: document.location.href
	};
	// test for grabbing token of logged in user
	if (data.url.indexOf("localhost:5000/dashboard") > 0) {
		console.log($("#token").val());
		console.log("grab it", data)
	}
	// check page tags
	data.tags = getPageTags(data);
	return data;
}

// check the page for tags
function getPageTags(data) {
	// create array
	let tags = [],
		str = data.description + " " +
		data.h1 + " " +
		data.keywords + " " +
		data.title;
	tags = cleanStringReturnTagArray(str);
	//console.log( "tags", JSON.stringify(tags) );
	// delete duplicates
	tags = removeDuplicates(tags);
	tags = removeStopWords(null, tags);
	tags = removeSmallWords(tags);
	return tags;
}



/**
 *	Get all trackers hidden on this page
 */
function getTrackers(){

	var foundObj = {},
		foundArr = [],
		// testing
		trackers = { 'Analytics':['statcounter.com','_gaq'] };
	// get a much larger list
	trackers = disconnectTrackingServices;
	// get scripts on the page
	var scripts = document.getElementsByTagName("script");
	// loop through each script
	for(var i=0, l=scripts.length; i < l; i++){
		// get source of script
		let str = "";
		if (scripts[i].src !== "") str = scripts[i].src;
		else if (scripts[i].textContent) str = scripts[i].textContent;
		// get root domain of scripts
		let scriptDomain = extractRootDomain(str);
		//console.log(scriptDomain);

		// // this method loops through each tracker category
		// for (var category in trackers) {
		// 	var categoryArr = trackers[category];
		// 	//console.log(catArr);
		// 	if (categoryArr.indexOf(scriptDomain) >= 0){
		// 		if (!prop(foundObj[category]))
		// 			foundObj[category] = [];
		// 		foundObj[category].push(scriptDomain);
		// 	}
		// }

		// this method uses the single array (no categories)
		// I think this may be the way to go in the end
		if (foundArr.indexOf(scriptDomain) < 0 && trackers.indexOf(scriptDomain) >= 0){
			foundArr.push(scriptDomain);
		}

	}
	//console.log("foundObj",foundObj);
	//console.log("foundArr",foundArr);
	return foundArr;
}


function getDescription() {
	var str = "";
	var descriptionTag = document.head.querySelector("meta[property='og:description']") || document.head.querySelector("meta[name='description']");
	if (descriptionTag) str = descriptionTag.getAttribute("content");
	return str;
}

function getH1() {
	var str = "";
	if ($('h1').length) str = $('h1').text().trim();
	return str;
}

function getKeywords() {
	var str = "";
	var keywordsTag = document.head.querySelector("meta[property='og:keywords']") || document.head.querySelector("meta[name='keywords']");
	if (keywordsTag) str = keywordsTag.getAttribute("content");
	return str;
}

function getTitle() {
	var str = "";
	var ogTitle = document.querySelector("meta[property='og:title']");
	if (ogTitle) str = ogTitle.getAttribute("content");
	else str = document.title;
	return str;
}




/**
 *  Create new serverUpdate object (to send to backend and/or server)
 */
function newServerUpdate() {
	var obj = {
		"pageData": {
			"description": pageData.description,
			"domain": pageData.domain,
			"keywords": pageData.keywords,
			"tags": pageData.tags,
			"time": pageData.time,
			"title": pageData.title,
			"url": pageData.url
		},
		"scoreData": {
			"score": 0,
			"clicks": 0,
			"likes": 0,
			"pages": 0,
			"domains": 0,
			"level": 0
		},
		"eventData": {
			"action": "",
			"text": ""
		},
		"userData": {
			"token": "",
		}
	};
	console.log("newScoreUpdater() -> obj", obj);
	return obj;
}
