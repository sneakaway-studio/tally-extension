"use strict";





/*  DATA
 ******************************************************************************/

let _tally_options = {},
	_tally_user = {},
	_tally_meta = {},
	updatePage = false,
	attacksMax = 4,
	attacksSelected = 0,
	popupUpdate = createPopupBackgroundUpdate();

var background = chrome.extension.getBackgroundPage();

// beforeunload works only by clicking the "X"
$(window).on("beforeunload", function() {
	try {
		background.console.log("POPUP: beforeunload called");
		saveAndClose();
	} catch (err) {
		console.error(err);
	}
});

// called when the page is unloaded
addEventListener("unload", function(event) {
	try {
		background.console.log("POPUP: unload called");
		saveAndClose();
	} catch (err) {
		console.error(err);
	}
}, true);


/**
 *	Save everything on close windopw
 */
function saveAndClose() {
	try {
		saveOptionsInBackground();
		saveUserInBackground();
		if (updatePage)
			// refresh current page with new settings
			refreshPageWithNewSettings();
	} catch (err) {
		console.error(err);
	}
}






// if user hasn't logged in then show login only
function init() {
	try {

		// show tally image
		$('.container').css({
			'background-image': 'url(' + chrome.runtime.getURL("assets/img/tally/tally-logo-clear-600w.png") + ')'
		});

		chrome.runtime.sendMessage({
			'action': 'getMeta'
		}, function(response) {
			console.log("getMeta()", JSON.stringify(response.data));
			_tally_meta = response.data;
			if (!_tally_meta.userLoggedIn) {
				// display only the login
				let str = "<a href='" + _tally_meta.env.website + "/dashboard" + "' target='_blank'>Link your Tally account</a>";
				$(".content").html(str);
			} else {
				if (_tally_user.admin > 0)
					$(".hideUnlessAdmin").css({
						'display': 'block'
					});
				getOptions();
			}
		});
	} catch (err) {
		console.error(err);
	}
}
// on load
document.addEventListener('DOMContentLoaded', init);



/******************** FUNCTIONS ********************/

function getUser(callback) {
	try {
		chrome.runtime.sendMessage({
			'action': 'getUser'
		}, function(response) {
			//console.log("getUser()",JSON.stringify(response.data));
			_tally_user = response.data;
			$("#username").html(_tally_user.username);
			$("#level").html(_tally_user.level);
			$("#score").html(_tally_user.score.score);
			$("#clicks").html(_tally_user.score.clicks);
			$("#likes").html(_tally_user.score.likes);
			$("#pages").html(_tally_user.score.pages);
			$("#time").html(moment.utc(_tally_user.score.time * 1000).format('HH:mm:ss'));
			$("#monsters").html(FS_Object.objLength(_tally_user.monsters));
			// do a callback if exists
			if (callback)
				for (var i in callback)
					callback[i]();
		});
	} catch (err) {
		console.error(err);
	}
}

function getAttacks(callback) {
	try {
		chrome.runtime.sendMessage({
			'action': 'getUser'
		}, function(response) {
			//console.log("getAttacks()",JSON.stringify(response.data));
			_tally_user = response.data;
			// reset selected
			attacksSelected = 0;
			// start string
			var str = "";
			// for each attack
			for (var key in _tally_user.attacks) {
				if (_tally_user.attacks.hasOwnProperty(key)) {
					let checked = "";
					// if below limit and it should be shown as selected
					if (attacksSelected < attacksMax && _tally_user.attacks[key].selected === 1) {
						checked = " checked ";
						// track # of selected
						attacksSelected++;
					}
					// show defense vs. attack
					let defenseOption = "";

					// if defense
					if (_tally_user.attacks[key].type === "defense") {
						defenseOption = "battle-options-defense";
					}
					let title = _tally_user.attacks[key].name + " [" + _tally_user.attacks[key].category + " " + _tally_user.attacks[key].type + "] ";
					if (_tally_user.attacks[key].description) title += _tally_user.attacks[key].description;

					str += "<li>";
					str += '<input class="attack-checkbox" type="checkbox" id="' + key + '" name="attacks" ' + checked + ' />';
					str += "<label " +
						" for='" + key + "'" +
						" title='" + title + "' " +
						" data-attack='" + _tally_user.attacks[key].name + "' " +
						" class='tally battle-options battle-options-fire " + defenseOption + " attack-" + _tally_user.attacks[key].name + "'>" +
						"<span class='tally attack-icon attack-icon-" + _tally_user.attacks[key].type + "' ></span>" +
						key + '</label>';
					str += "</li>";

				}
			}
			// alert("getAttacks() " + attacksSelected + "/" + attacksMax);

			// console.log(str);
			$(".attacksCloud").html(str);
			// update display
			updateSelectedCheckboxesDisplay();

			// add icons
			$(".attack-icon-attack").css({
				"background-image": 'url(' + chrome.extension.getURL('../../assets/img/battles/sword-pixel-13sq.png') + ')'
			});
			$(".attack-icon-defense").css({
				"background-image": 'url(' + chrome.extension.getURL('../../assets/img/battles/shield-pixel-13sq.png') + ')'
			});

			// add listener for buttons
			$('input.attack-checkbox[type="checkbox"]').change(function() {
				try {
					// update totals
					updateSelectedCheckboxesTotal();
					// get attack name
					let name = $(this).attr("id");
					// do not allow selection of more than limit
					if (attacksSelected > attacksMax) {
						// show status
						showStatus('You can only use up to four attacks in battles.');
						// set back to false
						$("#" + name).prop('checked', false);
						// update totals
						updateSelectedCheckboxesTotal();
						return;
					}
					// set attack selected
					if (this.checked) _tally_user.attacks[name].selected = 1;
					else _tally_user.attacks[name].selected = 0;

					// save user in background
					saveUserInBackground();
					// save attacks on server (not that efficient but reliable)
					saveAttacksOnServer();
					// set flag to update page and server when finished
					updatePage = true;
					// update display
					updateSelectedCheckboxesDisplay();
				} catch (err) {
					console.error(err);
				}
			});
			if (callback) callback();
		});
	} catch (err) {
		console.error(err);
	}
}

function updateSelectedCheckboxesTotal() {
	try {
		// get all that are checked
		var checkedBoxes = document.querySelectorAll('input[type=checkbox]:checked');
		attacksSelected = checkedBoxes.length;
		// alert(JSON.stringify(checkedBoxes));
		// alert("updateSelectedCheckboxesTotal() " + attacksSelected +"/"+ attacksMax);
	} catch (err) {
		console.error(err);
	}
}

function updateSelectedCheckboxesDisplay() {
	try {
		updateSelectedCheckboxesTotal();
		let attacksInfo = '<span id="attacksSelected">' + attacksSelected + '</span>/' +
			'<span id="attacksMax">' + attacksMax + '</span>';
		$("#attacksInfo").html(attacksInfo);
	} catch (err) {
		console.error(err);
	}
}

/**
 * 	Save attack data on the server
 */
function saveAttacksOnServer() {
	try {
		background.console.log("POPUP -> saveAttacksOnServer()");

		// get all check boxes
		var checkBoxes = document.querySelectorAll('input[type=checkbox]');
		// alert(JSON.stringify(checkBoxes))
		// array of attacks to save on server
		let attacks = [];

		for (var i = 0; i < checkBoxes.length; i++) {
			// get name
			let name = $(checkBoxes[i]).attr("id");
			// double check this is a value
			if (name && _tally_user.attacks[name] && $("#" + name)) {
				// double check selected status in data
				_tally_user.attacks[name].selected = $("#" + name).prop('checked');
				//alert(name + "," + JSON.stringify(checkBoxes[i]));
				attacks.push(_tally_user.attacks[name]);
			}
		}
		popupUpdate.itemData.attacks = attacks;


		// update attacksSelected
		let progress = [];
		// add to update
		progress.push({
			"name": "attacksSelected",
			"val": attacksSelected
		});
		popupUpdate.itemData.progress = progress;
		// alert(JSON.stringify(popupUpdate.itemData.progress));

		sendUpdateToBackground();
		// alert(JSON.stringify(attacks));
	} catch (err) {
		console.error(err);
	}
}


function createPopupBackgroundUpdate() {
	try {
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
			"pageData": {}
		};
	} catch (err) {
		console.error(err);
	}
}


function sendUpdateToBackground() {
	try {
		background.console.log("POPUP -> sendUpdateToBackground() [1]", background);

		chrome.runtime.sendMessage({
			'action': 'updateTallyUser',
			'data': popupUpdate
		}, function(response) {
			background.console.log("POPUP -> sendUpdateToBackground() [2]");
			console.log('💾 > sendUpdateToBackground() RESPONSE =', response);
			// update _tally_user in content
			_tally_user = response.tally_user;
			// reset
			popupUpdate = createPopupBackgroundUpdate();
		});
	} catch (err) {
		console.error(err);
	}
}


function getOptions() {
	try {
		chrome.runtime.sendMessage({
			'action': 'getData',
			'name': "tally_options"
		}, function(response) {
			//console.log("getOptions()",JSON.stringify(response.data));
			_tally_options = response.data;
			// game
			$("#gameMode").val(_tally_options.gameMode);
			$("#soundVolume").val(_tally_options.soundVolume * 100);
			// privacy
			document.getElementById("disabledDomains").value = _tally_options.disabledDomains.join("\n");
			// debugging
			document.getElementById("showDebugger").checked = _tally_options.showDebugger;
			//document.getElementById("debuggerPosition").value = _tally_options.debuggerPosition;
		});
	} catch (err) {
		console.error(err);
	}
}

function saveUserInBackground() {
	try {
		console.log("saveUserInBackground()", _tally_user);
		background.console.log("POPUP -> saveUserInBackground() [1]");

		// save user in background.js
		chrome.runtime.sendMessage({
			'action': 'saveData',
			'name': "tally_user",
			'data': _tally_user
		}, function(response) {
			console.log(response);
			background.console.log("POPUP -> saveUserInBackground() [2]");
			// show status
			showStatus('Settings saved');
			// set flag
			updatePage = true;
		});
	} catch (err) {
		console.error(err);
	}
}

function saveOptionsInBackground() {
	try {
		background.console.log("POPUP -> saveOptionsInBackground() [1]");

		// game
		_tally_options.gameMode = $("#gameMode").val();
		_tally_options.soundVolume = $("#soundVolume").val() / 100;
		// privacy
		_tally_options.disabledDomains = $('#disabledDomains').val().trim().replace(/\r\n/g, "\n").split("\n");
		// debugging
		_tally_options.showDebugger = $('#showDebugger').prop('checked');
		_tally_options.debuggerPosition = $("#debuggerPosition").val();

		//console.log("saveOptionsInBackground()",_tally_options);

		// save options in background.js
		chrome.runtime.sendMessage({
			'action': 'saveOptions',
			'data': _tally_options
		}, function(response) {
			//console.log(response);
			background.console.log("POPUP -> saveOptionsInBackground() [2]");
			// display success status
			showStatus('Options saved');
			// set flag
			updatePage = true;
		});
	} catch (err) {
		console.error(err);
	}
}

/**
 *	Refresh the current tab
 */
function refreshPageWithNewSettings() {
	try {
		// get tab and reload
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
	} catch (err) {
		console.error(err);
	}
}


function getMeta(callback) {
	try {
		chrome.runtime.sendMessage({
			'action': 'getMeta'
		}, function(response) {
			//console.log("getMeta()",JSON.stringify(response.data));
			_tally_meta = response.data;

			$("#onlineStatus").html((_tally_meta.userOnline ? "true" : "false"));
			$("#serverStatus").html((_tally_meta.serverOnline ? "true" : "false"));
			$("#loggedInStatus").html((_tally_meta.userLoggedIn ? "true" : "false"));
			$("#currentAPI").html((_tally_meta.env.currentAPI ? _tally_meta.env.currentAPI : "null"));
			$("#api").html((_tally_meta.env.api ? _tally_meta.env.api : "null"));


			$("#installedOn").html(_tally_meta.install.date);
			$("#version").html(_tally_meta.install.version);

			// callback
			if (callback) callback();
		});
	} catch (err) {
		console.error(err);
	}
}

// reset _tally_user
document.getElementById("opt_reset_user").onclick = function() {
	try {
		window.open(_tally_meta.env.website + "/dashboard");
	} catch (err) {
		console.error(err);
	}
};
// reset _tally_options
document.getElementById("opt_reset_options").onclick = function() {
	try {
		chrome.runtime.sendMessage({
			action: "resetOptions"
		}, function(response) {
			//console.log(response);
			// display success status
			showStatus("Options have been reset");
		});
	} catch (err) {
		console.error(err);
	}
};




/*  FORM FUNCTIONS
 ******************************************************************************/






/*  FORM FUNCTIONS
 ******************************************************************************/

$("input").mouseup(function() {
	// wait a moment so the options are saved before the input has changed value
	window.setTimeout(function() {
		saveOptionsInBackground("popup options");
	}, 250);
});
$("select#gameMode").on('change', function() {
	saveOptionsInBackground("popup options");
});
$('#soundVolume').on('change', function() {
	// play a sound to confirm new setting
	var audio = new Audio(chrome.extension.getURL("assets/sounds/tally/moods-v3/excited-2-1.wav"));
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
		saveOptionsInBackground("popup options");
	}, 1000);
});




/*  TAB FUNCTIONS
 ******************************************************************************/

function openTab(btn, tabName) {
	try {
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
	} catch (err) {
		console.error(err);
	}
}


function updateSkins() {
	try {
		let str = "";
		if (!_tally_user.skins) return;
		for (var key in _tally_user.skins) {
			str += "<span class='skinThumb'><a href='#'>";
			str += "<img src='";
			str += chrome.extension.getURL('assets/img/tally/skins/skin-' + _tally_user.skins[key] + ".png");
			str += "'></a></span>";
		}
		$("#skinThumbs").html(str);
	} catch (err) {
		console.error(err);
	}
}



/*  BUTTON FUNCTIONS
 ******************************************************************************/

// set default
openTab("statusBtn", "statusTab");
// openTab("itemsBtn", "itemsTab");
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
document.getElementById("feedbackBtn").onclick = function() {
	openTab("feedbackBtn", "feedbackTab");
};
document.getElementById("debuggingBtn").onclick = function() {
	openTab("debuggingBtn", "debuggingTab");
};

// close the popup window
document.getElementById("opt_close").onclick = function() {
	window.close();
};

// external links
$(document).on('click', '#gameTrailerBtn', function() {
	window.open("https://www.youtube.com/watch?v=hBfq8TNHbCE");
});
$(document).on('click', '#viewProfileBtn', function() {
	window.open(_tally_meta.env.website + "/profile/" + _tally_user.username);
});
$(document).on('click', '#editProfileBtn', function() {
	window.open(_tally_meta.env.website + "/dashboard");
});
$(document).on('click', '#viewLeaderboardsBtn', function() {
	window.open(_tally_meta.env.website + "/leaderboard");
});
$(document).on('click', '#howToPlayBtn', function() {
	window.open(_tally_meta.env.website + "/how-to-play");
});
$(document).on('click', '#viewPrivacyPolicyBtn', function() {
	window.open(_tally_meta.env.website + "/privacy");
});

// surveys
$(document).on('click', '#testerSurveyBtn', function() {
	window.open("https://docs.google.com/forms/d/e/1FAIpQLSdhftpXZHrnU1RXZ-yQ0LZovCp84ShZEicZpy__mOt621-Q2w/viewform");
});
$(document).on('click', '#bugReportSurveyBtn', function() {
	window.open("https://docs.google.com/forms/d/e/1FAIpQLScUG923UhVtFWzLaV5gOsd0e1grdS9iKeNLjdwPixKEJkn4bQ/viewform");
});






/*  TAB FUNCTIONS
 ******************************************************************************/

// show status
function showStatus(msg) {
	try {
		$("#status").html(msg).css({
			'display': 'block'
		});
		setTimeout(function() {
			$("#status").html("").css({
				'display': 'none'
			});
		}, 1250);
	} catch (err) {
		console.error(err);
	}
}
