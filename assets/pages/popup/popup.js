"use strict";





/*  DATA
 ******************************************************************************/

let tally_options = {},
	tally_user = {},
	tally_meta = {},
	attacksMax = 0,
	attacksSelected = 0,
	backgroundUpdate = createBackgroundUpdate();


// make sure everything is saved when user closes window
$(window).on("beforeunload", function() {
	saveOptions();
	saveUser();
});

// if user hasn't logged in then show login only
function init() {
	// show tally image
	$('.container').css({
		'background-image': 'url(' + chrome.runtime.getURL("assets/img/tally/tally-logo-clear-1600w.png") + ')'
	});

	chrome.runtime.sendMessage({
		'action': 'getMeta'
	}, function(response) {
		//console.log("getMeta()",JSON.stringify(response.data));
		tally_meta = response.data;
		if (tally_meta.userTokenStatus != "ok") {
			// display only the login
			let str = "<a href='" + tally_meta.website + "/dashboard" + "' target='_blank'>Link your Tally account</a>";
			$(".content").html(str);
		} else {
			getOptions();
		}
	});
}
// on load
document.addEventListener('DOMContentLoaded', init);



/******************** FUNCTIONS ********************/

function getUser(callback) {
	chrome.runtime.sendMessage({
		'action': 'getUser'
	}, function(response) {
		//console.log("getUser()",JSON.stringify(response.data));
		tally_user = response.data;
		$("#level").html(tally_user.level);
		$("#score").html(tally_user.score.score);
		$("#likes").html(tally_user.score.likes);
		$("#clicks").html(tally_user.score.clicks);
		$("#pages").html(tally_user.score.pages);
		$("#time").html(moment.utc(tally_user.score.time*1000).format('HH:mm:ss'));
		$("#monsters").html(objLength(tally_user.monsters));
		// do a callback if exists
		if (callback)
			for(var i in callback)
				callback[i]();
	});
}

function getAttacks(callback) {
	chrome.runtime.sendMessage({
		'action': 'getUser'
	}, function(response) {
		//console.log("getAttacks()",JSON.stringify(response.data));
		tally_user = response.data;
		// set limits
		attacksMax = tally_user.progress.attackLimit.val;
		attacksSelected = 0;
		// alert(attacksSelected + "," + attacksMax);
		// start string
		var str = "";
		// for each attack
		for (var name in tally_user.attacks) {
			if (tally_user.attacks.hasOwnProperty(name)) {
				let checked = "";
				// if below limit and it should be shown as selected
				if (attacksSelected < attacksMax && tally_user.attacks[name].selected === 1) {
					checked = " checked ";
					// track # of selected
					attacksSelected++;
				}
				// show defense vs. attack
				let defenseOption = "",
					defenseCharacter = "",
					attackCharacter = "";
				// if defense
				if (tally_user.attacks[name].type === "defense"){
					defenseOption = "battle-options-defense";
					defenseCharacter = "<span class='defenseCharacter'>&larrb;</span>";
				} else if (tally_user.attacks[name].type === "attack"){
					defenseCharacter = "<span class='defenseCharacter'>&#8674;</span>";
				}
				str += "<li>";
				str += '<input type="checkbox" id="' + name + '" name="attacks" ' + checked + ' />';
				str += '<label class="btn attackBtn" title="' +
					name + " " + tally_user.attacks[name].type + '" for="' + name + '">' +
					defenseCharacter + name + '</label>';
				str += "</li>";
			}
		}
		// console.log(str);
		$(".attacksCloud").html(str);
		// update display
		updateSelectedCheckboxesDisplay();

		// add listener for buttons
		$('input[type="checkbox"]').change(function() {
			// update totals
			updateSelectedCheckboxes();
			// get attack name
			let name = $(this).attr("id");
			// do not allow selection of more than limit
			if (attacksSelected > attacksMax) {
				// tell user
				showStatus('You can only use ' + attacksMax + ' attacks in battle. Level up to earn more!'); // display success message
				// set back to false
				$("#" + name).prop('checked', false);
				// update totals
				updateSelectedCheckboxes();
				return;
			}
			// set attack selected
			if (this.checked) tally_user.attacks[name].selected = 1;
			else tally_user.attacks[name].selected = 0;

			// save user
			saveUser();
			saveAttacks();
			// update display
			updateSelectedCheckboxesDisplay();
		});
		if (callback) callback();
	});
}

function updateSelectedCheckboxes() {
	var checkedBoxes = document.querySelectorAll('input[type=checkbox]:checked');
	attacksSelected = checkedBoxes.length;
	attacksMax = tally_user.progress.attackLimit.val;
	// alert(JSON.stringify(checkedBoxes));
	// alert(attacksSelected +"/"+ attacksMax);
}

function updateSelectedCheckboxesDisplay() {
	$("#attacksSelected").html(attacksSelected);
	$("#attacksMax").html(attacksMax);
}

function saveAttacks() {
	// get all check boxes
	var checkBoxes = document.querySelectorAll('input[type=checkbox]');
	// alert(JSON.stringify(checkBoxes))
	// array of attacks to save on server
	let attacks = [];

	for (var i = 0; i < checkBoxes.length; i++) {
		// get name
		let name = $(checkBoxes[i]).attr("id");
		// double check this is a value
		if (name && tally_user.attacks[name] && $("#" + name)) {
			// double check selected status in data
			tally_user.attacks[name].selected = $("#" + name).prop('checked');
			//alert(name + "," + JSON.stringify(checkBoxes[i]));
			attacks.push(tally_user.attacks[name]);
		}
	}
	backgroundUpdate.itemData.attacks = attacks;
	sendBackgroundUpdate();
	// alert(JSON.stringify(attacks));
}


function createBackgroundUpdate() {
	return {
		// the type of update (e.g. "update" | "sync")
		"updateType": "update",
		// all the individual props that can be updated, sent as arrays
		"itemData": {
			"achievements": [],
			"attacks": [],
			"badges": [],
			"consumables": [],
			"flags": [],
			"monsters": [],
			"progress": [],
			"skins": [],
			"trackers": [],
		},
		"scoreData": {},
		"pageData": {},
		"eventData": {},
		"token": "INSERT_IN_BACKGROUND",
	};
}


function sendBackgroundUpdate() {

	chrome.runtime.sendMessage({
		'action': 'sendBackgroundUpdate',
		'data': backgroundUpdate
	}, function(response) {
		console.log('💾 > sendBackgroundUpdate() RESPONSE =', response);
		// update tally_user in content
		tally_user = response.tally_user;
		// reset
		backgroundUpdate = createBackgroundUpdate();
	});
}


function getOptions() {
	chrome.runtime.sendMessage({
		'action': 'getData',
		'name': 'tally_options'
	}, function(response) {
		//console.log("getOptions()",JSON.stringify(response.data));
		tally_options = response.data;
		// game
		$("#gameMode").val(tally_options.gameMode);
		$("#soundVolume").val(tally_options.soundVolume * 100);
		// privacy
		document.getElementById("disabledDomains").value = tally_options.disabledDomains.join("\n");
		// debugging
		document.getElementById("showDebugger").checked = tally_options.showDebugger;
		//document.getElementById("debuggerPosition").value = tally_options.debuggerPosition;
	});
}

function saveUser() {

	console.log("saveUser()", tally_user);

	// saveOptions in background.js
	chrome.runtime.sendMessage({
		'action': 'saveData',
		'name': 'tally_user',
		'data': tally_user
	}, function(response) {
		console.log(response);
		showStatus('Settings saved'); // display success message
		// // refresh current page (w/new settings)
		// chrome.tabs.query({
		// 	active: true,
		// 	currentWindow: true
		// }, function(arrayOfTabs) {
		// 	//console.log("query again")
		// 	var code = 'window.location.reload(1);';
		// 	chrome.tabs.executeScript(arrayOfTabs[0].id, {
		// 		code: code
		// 	});
		// });
	});
}

function saveOptions() {
	// game
	tally_options.gameMode = $("#gameMode").val();
	tally_options.soundVolume = $("#soundVolume").val() / 100;
	// privacy
	tally_options.disabledDomains = $('#disabledDomains').val().trim().replace(/\r\n/g, "\n").split("\n");
	// debugging
	tally_options.showDebugger = $('#showDebugger').prop('checked');
	tally_options.debuggerPosition = $("#debuggerPosition").val();

	//console.log("saveOptions()",tally_options);

	// saveOptions in background.js
	chrome.runtime.sendMessage({
		'action': 'saveOptions',
		'data': tally_options
	}, function(response) {
		//console.log(response);
		showStatus('Options saved'); // display success message
		// refresh current page (w/new settings)
		chrome.tabs.query({
			active: true,
			currentWindow: true
		}, function(arrayOfTabs) {
			//console.log("query again")
			var code = 'window.location.reload(1);';
			chrome.tabs.executeScript(arrayOfTabs[0].id, {
				code: code
			});
		});
	});
}

function getMeta(callback) {
	chrome.runtime.sendMessage({
		'action': 'getMeta'
	}, function(response) {
		//console.log("getMeta()",JSON.stringify(response.data));
		tally_meta = response.data;
		// auth
		if (tally_meta.userAuthenticated) $("#authStatus").html("true");
		else $("#authStatus").html("false");
		// token
		if (tally_meta.userTokenValid) $("#tokenStatus").html("true");
		else $("#tokenStatus").html("false");
		// token expires
		if (tally_meta.userTokenValid) $("#tokenExpires").html("true");
		else $("#tokenExpires").html("false");


		$("#authStatus").html((tally_meta.serverOnline ? "yes" : "no"));
		$("#tokenStatus").html((tally_meta.userTokenValid ? "yes" : "no"));
		$("#tokenExpires").html((tally_meta.userTokenExpires ? tally_meta.userTokenExpires : "null"));
		$("#serverStatus").html((tally_meta.serverOnline ? "yes" : "no"));


		$("#installedOn").html(tally_meta.installedOn);
		$("#version").html(tally_meta.version);

		// callback
		if (callback) callback();
	});
}

// reset tally_user
document.getElementById("opt_reset_user").onclick = function() {
	window.open(tally_meta.website + "/dashboard");
};
// reset tally_options
document.getElementById("opt_reset_options").onclick = function() {
	chrome.runtime.sendMessage({
		action: "resetOptions"
	}, function(response) {
		//console.log(response); // display success message
		showStatus("Options have been reset");
	});
};



/*  FORM FUNCTIONS
 ******************************************************************************/

$("input").mouseup(function() {
	// wait a moment so the options are saved before the input has changed value
	window.setTimeout(function() {
		saveOptions("popup options");
	}, 250);
});
$("select#gameMode").on('change', function() {
	saveOptions("popup options");
});
$('#soundVolume').on('change', function() {
	// play a sound to confirm new setting
	var audio = new Audio(chrome.extension.getURL("assets/sounds/tally/tally-hello-q.mp3"));
	audio.volume = $(this).val() / 100;
	audio.play();
});
// timeout to save textarea
var timeoutId;
$('#disabledDomains').on('input propertychange change', function() {
	//console.log('Textarea Change');

	clearTimeout(timeoutId);
	timeoutId = setTimeout(function() {
		// Runs 1 second (1000 ms) after the last change
		saveOptions("popup options");
	}, 1000);
});




/*  TAB FUNCTIONS
 ******************************************************************************/

function openTab(btn, tabName) {
	// update options from background
	if (btn == "optionsBtn") {
		getOptions();
	}
	if (btn == "statusBtn") {
		getUser();
		getMeta();
	}
	if (btn == "itemsBtn") {
		getAttacks();
	}
	if (btn == "debuggingBtn") {
		getUser([updateSkins]);
		getMeta();
	}

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


function updateSkins() {
	let str = "";
	for (var key in tally_user.skins) {
		str += "<span class='skinThumb'><a href='#'>";
		str += "<img src='";
		str += chrome.extension.getURL('assets/img/tally/skins/skin-' + tally_user.skins[key] + ".png");
		str += "'></a></span>";
	}
	$("#skinThumbs").html(str);
}



/*  BUTTON FUNCTIONS
 ******************************************************************************/

// set default
openTab("itemsBtn", "itemsTab");
//openTab("statusBtn", "statusTab");
//openTab("optionsBtn","optionsTab");

// tab buttons
document.getElementById("statusBtn").onclick = function() {
	openTab("statusBtn", "statusTab");
};
document.getElementById("itemsBtn").onclick = function() {
	openTab("itemsBtn", "itemsTab");
};
document.getElementById("optionsBtn").onclick = function() {
	openTab("optionsBtn", "optionsTab");
};
document.getElementById("aboutBtn").onclick = function() {
	openTab("aboutBtn", "aboutTab");
};
document.getElementById("debuggingBtn").onclick = function() {
	openTab("debuggingBtn", "debuggingTab");
};

// close the popup window
document.getElementById("opt_close").onclick = function() {
	window.close();
};

// external links
$(document).on('click', '#updateTokenBtn', function() {
	window.open(tally_meta.website + "/signin");
});
$(document).on('click', '#viewProfileBtn', function() {
	window.open(tally_meta.website + "/profile/" + tally_user.username);
});
$(document).on('click', '#editProfileBtn', function() {
	window.open(tally_meta.website + "/dashboard");
});
$(document).on('click', '#viewLeaderboardsBtn', function() {
	window.open(tally_meta.website + "/leaderboards");
});
$(document).on('click', '#viewPrivacyPolicyBtn', function() {
	window.open(tally_meta.website + "/privacy");
});

$(document).on('click', '#testerSurveyBtn', function() {
	window.open("https://docs.google.com/forms/d/e/1FAIpQLSeGx8zsF4aMQZH1eM0SzOvcpXijt8Bem1pzg4eni9eK8Jr-Lg/viewform");
});
$(document).on('click', '#gameTrailerBtn', function() {
	window.open("https://www.youtube.com/watch?v=xfsbm1cI2uo");
});





/*  TAB FUNCTIONS
 ******************************************************************************/

// show status message
function showStatus(msg) {
	// Update status to let user know options were saved.
	var status = document.getElementById("status");
	status.innerHTML = msg;
	status.style.display = "block";
	setTimeout(function() {
		status.innerHTML = "";
		status.style.display = "none";
	}, 1250);
}
