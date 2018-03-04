/*jshint esversion: 6 */



function updateTabSkins(){
	let str = "";
	for (var key in tally_user.skins) {
		str += "<span class='skinThumb'><a href='#'>";
		str += "<img src='";
		str += chrome.extension.getURL('assets/img/tally-skins/skin-'+ tally_user.skins[key] +".png");
		str += "'></a></span>";
	}
	$("#skinsList").html(str);
}



/*  GETTING / SAVING OPTIONS
******************************************************************************/

var tally_options = {},tally_user = {};

document.addEventListener('DOMContentLoaded', getOptions);

function getUser(callback) {
	chrome.runtime.sendMessage({'action':'getUser'}, function(response) {
			console.log("getUser()",JSON.stringify(response.data));
			tally_user = response.data;
			callback();
		}
	);
}
function getOptions() {
	chrome.runtime.sendMessage({'action':'getOptions'}, function(response) {
			console.log("getOptions()",JSON.stringify(response.data));
			tally_options = response.data;
			// game
			$("#gameMode").val(tally_options.gameMode);
			// privacy
			document.getElementById("disabledDomains").value = tally_options.disabledDomains.join("\n");
			// debugging
			document.getElementById("showDebugger").checked = tally_options.showDebugger;
			document.getElementById("debuggerPosition").value = tally_options.debuggerPosition;
		}
	);
}
function saveOptions() {
	// game
	tally_options.gameMode 			= $("#gameMode").val();
	// privacy
	tally_options.disabledDomains 	= $('#disabledDomains').val().trim().replace(/\r\n/g,"\n").split("\n");
	// debugging
	tally_options.showDebugger 		= $('#showDebugger').prop('checked');
	tally_options.debuggerPosition 	= $("#debuggerPosition").val();

	console.log("saveOptions()",tally_options);

  	// saveOptions in background.js
	chrome.runtime.sendMessage({'action':'saveOptions','data':tally_options}, function(response) {
			console.log(response);
			showStatus('User options saved'); // display success message
			// refresh current page (w/new settings)
			chrome.tabs.query({active: true, currentWindow: true}, function (arrayOfTabs) {
				console.log("query again")
				var code = 'window.location.reload(1);';
				chrome.tabs.executeScript(arrayOfTabs[0].id, {code: code});
			});
		}
	);
}

// reset tally_user
document.getElementById("opt_reset_user").onclick = function(){
	chrome.runtime.sendMessage({action: "resetUser"}, function(response) {
			console.log(response); // display success message
  			showStatus("User has been reset");
		}
	);
};
// reset tally_options
document.getElementById("opt_reset_options").onclick = function(){
	chrome.runtime.sendMessage({action: "resetOptions"}, function(response) {
			console.log(response); // display success message
  			showStatus("Options have been reset");
		}
	);
};



/*  FORM FUNCTIONS
******************************************************************************/

$("input").mouseup(function(){
	// wait a moment so the options are saved before the input has changed value
	window.setTimeout(function(){
		saveOptions("popup options");
	}, 250);
});
$("select#gameMode").change(function(){
	saveOptions("popup options");
});
// timeout to save textarea
var timeoutId;
$('#disabledDomains').on('input propertychange change', function() {
    console.log('Textarea Change');

    clearTimeout(timeoutId);
    timeoutId = setTimeout(function() {
        // Runs 1 second (1000 ms) after the last change
        saveOptions("popup options");
    }, 1000);
});




/*  TAB FUNCTIONS
******************************************************************************/

function openTab(btn,tabName) {
	// update options from background
	if (btn == "optionsBtn") getOptions();
	if (btn == "skinsBtn") getUser(updateTabSkins);

	//console.log(tabName)
	// hide other tab content
	var t = document.getElementsByClassName("tab");
	for (let i = 0; i < t.length; i++)
		t[i].style.display = "none";
	document.getElementById(tabName).style.display = "block";
	// hide other tabs
	var b = document.getElementsByClassName("tab-button");
	for (let i = 0; i < b.length; i++)
		b[i].classList.remove("active");
	// set correct one active
	document.getElementById(btn).classList.add("active");
}
// set default
//openTab("scoreBtn","scoreTab");
//openTab("optionsBtn","optionsTab");
openTab("skinsBtn","skinsTab");

// tab buttons
document.getElementById("debuggingBtn").onclick = function() { openTab("debuggingBtn","debuggingTab"); };
document.getElementById("skinsBtn").onclick = function() { openTab("skinsBtn","skinsTab"); };
document.getElementById("scoreBtn").onclick = function() { openTab("scoreBtn","scoreTab"); };
document.getElementById("optionsBtn").onclick = function() { openTab("optionsBtn","optionsTab"); };
document.getElementById("aboutBtn").onclick = function() { openTab("aboutBtn","aboutTab"); };

// close the popup window
document.getElementById("opt_close").onclick = function(){ window.close(); };

// show status message
function showStatus(msg){
	// Update status to let user know options were saved.
	var status = document.getElementById("status");
	status.innerHTML = msg;
	status.style.display = "block";
	setTimeout(function() {
		status.innerHTML = "";
		status.style.display = "none";
	}, 1250);
}
