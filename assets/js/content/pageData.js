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
        mouseX:0, mouseY:0, mouseupFired:false,
        subDomain: extractSubDomain(document.location.href),
        tags: "",
    	time: 0,
    	title: getTitle(),
        previousUrl: "",
		url: document.location.href
	};
	// test for grabbing token of logged in user
	if (data.url.indexOf("localhost:5000/dashboard") > 0){
		console.log($("#token").val());
		console.log("grab it",data)
	}
	// check page tags
	data.tags = savePageTags(data);
	return data;
}

// check the page for tags
function savePageTags(data){
	// create array
	let tags = [],
		str = data.description +" "+
		  	  data.h1 +" "+
			  data.keywords +" "+
			  data.title;
	tags = cleanStringReturnTagArray(str);
	//console.log( "tags", JSON.stringify(tags) );
	// delete duplicates
	tags = removeDuplicates(tags);
	tags = removeStopWords(null,tags);
	tags = removeSmallWords(tags);
	return tags;
}



function getDescription(){
    var str = "";
    var descriptionTag = document.head.querySelector("meta[property='og:description']") || document.head.querySelector("meta[name='description']");
    if (descriptionTag) str = descriptionTag.getAttribute("content");
    return str;
}
function getH1(){
    var str = "";
    if ($('h1').length) str = $('h1').text().trim();
    return str;
}
function getKeywords(){
    var str = "";
	var keywordsTag = document.head.querySelector("meta[property='og:keywords']") || document.head.querySelector("meta[name='keywords']");
	if (keywordsTag) str = keywordsTag.getAttribute("content");
    return str;
}
function getTitle(){
    var str = "";
	var ogTitle = document.querySelector("meta[property='og:title']");
	if (ogTitle) str = ogTitle.getAttribute("content");
	else str = document.title;
    return str;
}




/**
 *  Create new serverUpdate object (to send to backend and/or server)
 */
function newServerUpdate(){
	var obj = {
		"pageData":{
			"description": pageData.description,
			"domain": pageData.domain,
			"keywords": pageData.keywords,
			"tags": pageData.tags,
			"time": pageData.time,
			"title": pageData.title,
			"url": pageData.url
		},
		"scoreData":{
			"score":0,
			"clicks":0,
			"likes":0,
			"pages":0,
			"domains":0,
			"level":0
		},
		"eventData":{
			"action":"",
			"text":""
		},
		"userData":{
			"token":"",
		}
	};
	console.log("newScoreUpdater() -> obj",obj);
	return obj;
}
