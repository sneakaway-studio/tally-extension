/*jshint esversion: 6 */

// load objects
let pageData = getPageData(),
    eventData = {},
    tally_user = {},
    tally_options = {},
    tally_meta = {};


function init(){
	Promise // after async functions then update
		.all([getUserPromise, getOptionsPromise, getMetaPromise]) // , getLastServerUpdatePromise
		.then(function(results) {
			console.log('>>>>> init() Promise all data has loaded',tally_user,tally_options);
			// check if extension should be active on this page before proceeding
			pageData.activeOnPage = shouldExtensionBeActiveOnPage(tally_options);
            if (pageData.activeOnPage) {
                startGame();
            }
		})
		.catch(function(error) {
			console.log('one or more promises have failed: ' + error);
		});
}
init();

/**
 * Make sure Tally isn't disabled on this page|domain|subdomain
 */
function shouldExtensionBeActiveOnPage(_tally_options){
	if (_tally_options.disabledDomains.length < 1 ||
		($.inArray(pageData.domain, _tally_options.disabledDomains) >= 0) ||
		($.inArray(pageData.subDomain, _tally_options.disabledDomains) >= 0)) {
		console.log("Tally is disabled on this domain");
		return false;
	} else return true;
}
/**
 * Run Game
 */
function startGame(){
    console.log(">>>>> startGame() -> Starting Tally on this page");
    debug.add();
    addMainClickEventListener();
    debug.update();
    //checkPageForMonsters(pageData.tags);
}



// create timed functions
var timedEvents = {
	pageTimerInterval: setInterval(function(){
		// if this page is visible
		if (document.hasFocus()){
            pageData.time = pageData.time + 0.5;
            debug.update();
        }
	}, 500)
};
