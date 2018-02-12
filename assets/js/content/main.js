/*jshint esversion: 6 */

// load objects
let pageData = getPageData(),
    eventData = {},
    tally_user = {},
    tally_options = {},
    tally_meta = {};


function initGetData(){
	Promise // after async functions then update
		.all([getUserPromise, getOptionsPromise, getMetaPromise]) // , getLastServerUpdatePromise
		.then(function(results) {
			//console.log('init() Promise >>>>> all data has loaded',results,tally_user,tally_options);

			// // check if extension should be active on this page before proceeding
			// pageData.activeOnPage = shouldExtensionBeActiveOnPage();
			// updateDebuggerDisplay();
			// if (pageData.activeOnPage) {
			// 	log("Tally is loaded");
			// //	addMO();
			// 	addMainClickEventListener();
			 //	updateAfterInit();
			// }

            updateAfterInit();
		})
		.catch(function(error) {
			console.log('one or more promises have failed: ' + error);
		});
}
initGetData();


function updateAfterInit(){
    console.log("updateAfterInit()");
    addMainClickEventListener();
    checkPageTags();
    updateDebugger();
    //checkPageForMonsters(pageData.tags);
}



// create timed functions
var timedEvents = {
	pageTimerInterval: setInterval(function(){
		// if this page is visible
		if (document.hasFocus()){
            pageData.time = pageData.time + 0.5;
            updateDebugger();
        }
	}, 500)
};
