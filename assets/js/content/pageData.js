"use strict";


/**
 *	Get data about this page
 */
function getPageData() {
	var url = document.location.href;
	// only run on web pages
	if (!url || !url.match(/^http/)) return;
	// object
	var data = {
		activeOnPage: false, // default
		browser: {
			name: Environment.getBrowserName(),
			cookieEnabled: navigator.cookieEnabled || "",
			language: Environment.getBrowserLanguage(),
			platform: Environment.getPlatform(),
			width: window.innerWidth || document.body.clientWidth,
			height: window.innerHeight || document.body.clientHeight
		},
		screen: {
			width: screen.width,
			height: screen.height
		},
		contentType: window.document.contentType,
		description: getDescription(),
		domain: Environment.extractRootDomain(document.location.href),
		h1: getH1(),
		keywords: getKeywords(),
		mouseX: 0,
		mouseY: 0,
		mouseupFired: false,
		subDomain: Environment.extractSubDomain(document.location.href),
		tags: "",
		time: 0,
		title: getTitle(),
		trackers: getTrackers(),
		previousUrl: "",
		url: document.location.href
	};
	// test for grabbing token of logged in user
	if (data.url.indexOf("/dashboard") > 0 && $("#token").length) {
		checkPageToken();
	}
	// check page tags
	data.tags = getPageTags(data);
	//console.log("pageData",data);
	return data;
}


/**
 *	If on dashboard page then check for updates to token
 */
function checkPageToken() {
	var data = {
		token: $("#token").val(),
		tokenExpires: $("#tokenExpires").val()
	};
	//console.log(data);
	saveToken(data);
}


/**
 *	Get all "tags" on a page
 */
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
function getTrackers() {

	var foundObj = {},
		foundArr = [],
		// testing
		trackers = {
			'Analytics': ['statcounter.com', '_gaq']
		};
	// get a much larger list
	trackers = disconnectTrackingServices;
	// get scripts on the page
	var scripts = document.getElementsByTagName("script");
	// loop through each script
	for (var i = 0, l = scripts.length; i < l; i++) {
		// get source of script
		let str = "";
		if (scripts[i].src !== "") str = scripts[i].src;
		// not sure why this is here, why would we want textContent of script?
		//else if (scripts[i].textContent) str = scripts[i].textContent;
		// no script here
		else continue;

		// get root domain of scripts
		let scriptDomain = Environment.extractRootDomain(str);
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
		if (foundArr.indexOf(scriptDomain) < 0 && trackers.indexOf(scriptDomain) >= 0) {
			console.log("👀 👀 getTrackers()", str, scriptDomain);
			foundArr.push(scriptDomain);
		}

	}
	// set the number of trackers in the badge
	setBadgeText(foundArr.length);

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
