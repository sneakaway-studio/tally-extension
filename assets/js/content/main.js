/*jshint esversion: 6 */

// load objects
let pageData = getPageData(),
    eventData = {},
    tally_user = {},
    tally_options = {},
    tally_meta = {};


function initFromBackground(){
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
initFromBackground();



// displays
var tallyHTML = "<div id='tally' class='reset-this-root reset-this'>"+"</div>";
$('body').append(tallyHTML);



function updateAfterInit(){
    console.log("updateAfterInit()");
    addMainClickEventListener();
    updateDisplay();
}

function updateDisplay(){
    var str = "<div id='tyd' class='draggable data-field'>"+
                "tally_user: " + JSON.stringify(tally_user) +"<br>"+
                "tally_options: " + JSON.stringify(tally_options) +"<br>"+
                "pageData: " + JSON.stringify(pageData) +"<br>"+
              "</div>";
    $('#tally').html(str);
}

// create timed functions
var timedEvents = {
	pageTimerInterval: setInterval(function(){
		// if this page is visible
		if (document.hasFocus()){
            pageData.time = pageData.time + 0.5;
            updateDisplay();
            // console.log(pageData.time);
            // store("tally_wtf",{"hello":pageData.time});
            // console.log(111,store("tally_wtf"));
        }
	}, 500)
};
