"use strict";

let tally_meta = getMeta();

function getMeta() {
	chrome.runtime.sendMessage({
		'action': 'getMeta'
	}, function(response) {
		//console.log("getMeta()",JSON.stringify(response.data));
		tally_meta = response.data;
	});
}

$(document).on('click','#launchRegistrationBtn',function(){
    chrome.tabs.create({
        url: tally_meta.website + "/signup"
    }, function(tab) {
        console.log(">>>>> launching registration page", tab.url);
    });
});
