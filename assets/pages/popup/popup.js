"use strict";





/*  DATA
 ******************************************************************************/

let _tally_options = {},
	_tally_user = {},
	_tally_meta = {},
	attacksMax = 4,
	attacksSelected = 0,
	popupUpdate = createPopupBackgroundUpdate();


// make sure everything is saved when user closes window
$(window).on("beforeunload", function() {
	try {
		saveOptions();
		saveUser();
	} catch (err) {
		console.error(err);
	}
});

// if user hasn't logged in then show login only
function init() {
	try {
		// show tally image
		$('.container').css({
			'background-image': 'url(' + chrome.runtime.getURL("assets/img/tally/tally-logo-clear-1600w.png") + ')'
		});

		chrome.runtime.sendMessage({
			'action': 'getMeta'
		}, function(response) {
			console.log("getMeta()",JSON.stringify(response.data));
			_tally_meta = response.data;
			if (_tally_meta.token.status != "ok") {
				// display only the login
				let str = "<a href='" + _tally_meta.website + "/dashboard" + "' target='_blank'>Link your Tally account</a>";
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
				// update totals
				updateSelectedCheckboxes();
				// get attack name
				let name = $(this).attr("id");
				// do not allow selection of more than limit
				if (attacksSelected >= attacksMax) {
					// tell user
					showStatus('You can only use ' + attacksMax + ' attacks in battle. Level up to earn more!'); // display success message
					// set back to false
					$("#" + name).prop('checked', false);
					// update totals
					updateSelectedCheckboxes();
					return;
				}
				// set attack selected
				if (this.checked) _tally_user.attacks[name].selected = 1;
				else _tally_user.attacks[name].selected = 0;

				// save user
				saveUser();
				saveAttacks();
				// update display
				updateSelectedCheckboxesDisplay();
			});
			if (callback) callback();
		});
	} catch (err) {
		console.error(err);
	}
}

function updateSelectedCheckboxes() {
	try {
		// get all that are checked
		var checkedBoxes = document.querySelectorAll('input[type=checkbox]:checked');
		attacksSelected = checkedBoxes.length - 1;
		// alert(JSON.stringify(checkedBoxes));
		// alert("updateSelectedCheckboxes() " + attacksSelected +"/"+ attacksMax);
	} catch (err) {
		console.error(err);
	}
}

function updateSelectedCheckboxesDisplay() {
	try {
		let attacksInfo = '<span id="attacksSelected">' + attacksSelected + '</span>/' +
			'<span id="attacksMax">' + attacksMax + '</span>';
		$("#attacksInfo").html(attacksInfo);
	} catch (err) {
		console.error(err);
	}
}

function saveAttacks() {
	try {
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
			"pageData": {},
			"token": "INSERT_IN_BACKGROUND",
		};
	} catch (err) {
		console.error(err);
	}
}


function sendUpdateToBackground() {
	try {

		chrome.runtime.sendMessage({
			'action': 'sendUpdateToBackground',
			'data': popupUpdate
		}, function(response) {
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

function saveUser() {
	try {

		console.log("saveUser()", _tally_user);

		// saveOptions in background.js
		chrome.runtime.sendMessage({
			'action': 'saveData',
			'name': "tally_user",
			'data': _tally_user
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
	} catch (err) {
		console.error(err);
	}
}

function saveOptions() {
	try {
		// game
		_tally_options.gameMode = $("#gameMode").val();
		_tally_options.soundVolume = $("#soundVolume").val() / 100;
		// privacy
		_tally_options.disabledDomains = $('#disabledDomains').val().trim().replace(/\r\n/g, "\n").split("\n");
		// debugging
		_tally_options.showDebugger = $('#showDebugger').prop('checked');
		_tally_options.debuggerPosition = $("#debuggerPosition").val();

		//console.log("saveOptions()",_tally_options);

		// saveOptions in background.js
		chrome.runtime.sendMessage({
			'action': 'saveOptions',
			'data': _tally_options
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

			$("#tokenStatus").html(_tally_meta.token.status);
			$("#tokenExpiresDate").html((_tally_meta.token.expiresDate ? _tally_meta.token.expiresDate : "null"));
			$("#tokenExpiresInMillis").html((_tally_meta.token.expiresInMillis ? _tally_meta.token.expiresInMillis : "null"));
			$("#serverStatus").html((_tally_meta.server.online ? "yes" : "no"));
			$("#currentAPI").html((_tally_meta.currentAPI ? _tally_meta.currentAPI : "null"));
			$("#api").html((_tally_meta.api ? _tally_meta.api : "null"));


			$("#installedOn").html(_tally_meta.installedOn);
			$("#version").html(_tally_meta.version);

			// callback
			if (callback) callback();
		});
	} catch (err) {
		console.error(err);
	}
}

// reset _tally_user
document.getElementById("opt_reset_user").onclick = function() {
	window.open(_tally_meta.website + "/dashboard");
};
// reset _tally_options
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
	window.open(_tally_meta.website + "/signin");
});
$(document).on('click', '#viewProfileBtn', function() {
	window.open(_tally_meta.website + "/profile/" + _tally_user.username);
});
$(document).on('click', '#editProfileBtn', function() {
	window.open(_tally_meta.website + "/dashboard");
});
$(document).on('click', '#viewLeaderboardsBtn', function() {
	window.open(_tally_meta.website + "/leaderboards");
});
$(document).on('click', '#viewPrivacyPolicyBtn', function() {
	window.open(_tally_meta.website + "/privacy");
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
	try {
		// Update status to let user know options were saved.
		var status = document.getElementById("status");
		status.innerHTML = msg;
		status.style.display = "block";
		setTimeout(function() {
			status.innerHTML = "";
			status.style.display = "none";
		}, 1250);
	} catch (err) {
		console.error(err);
	}
}
