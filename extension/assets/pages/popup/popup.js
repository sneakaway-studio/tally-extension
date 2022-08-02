/*  DATA
 ******************************************************************************/

let tally_options = {},
	tally_user = {},
	tally_meta = {},
	updatePageOnSaveOptions = false,
	attacksMax = 4,
	attacksSelected = 0,
	popupUpdate = createPopupBackgroundUpdate();






/*  INIT / PAGE LOAD
 ******************************************************************************/

// on load
document.addEventListener('DOMContentLoaded', init);
async function init() {
	try {

		// get all required data
		tally_options = await getDataPromise("getOptions");
		tally_user = await getDataPromise("getUser");
		tally_meta = await getDataPromise("getMeta");

		console.log("POPUP > tally_options", JSON.stringify(tally_options));
		console.log("POPUP > tally_user", JSON.stringify(tally_user));
		console.log("POPUP > tally_meta", JSON.stringify(tally_meta));

		// show tally header image
		$('.container').css({
			'background-image': 'url(' + chrome.runtime.getURL("assets/img/tally/tally-logo-clear-600w.png") + ')'
		});
		// user is admin
		if (tally_user.admin > 0) {
			$(".hideUnlessAdmin").css({
				'display': 'block'
			});
		}

		getTab();

	} catch (err) {
		console.error(err);
	}
}


function getDataPromise(action) {
	return new Promise((resolve, reject) => {
		chrome.runtime.sendMessage({
			"action": action
		}, response => {
			if (response.action == action) {
				resolve(response.data);
			} else {
				reject('Something wrong');
			}
		});
	});
}


async function getTab(tab) {
	try {
		// user NOT logged in
		if (!tally_meta.userLoggedIn) {
			// display only the login prompt
			let str = "<a href='" + tally_meta.env.website + "/dashboard" + "' target='_blank'>Link your Tally account</a>";
			$(".content").html(str);
			return;
		}

		// the tab to open
		let tabName;

		// refresh data
		tally_options = await getDataPromise("getOptions");
		tally_user = await getDataPromise("getUser");
		tally_meta = await getDataPromise("getMeta");

		if (tab) {
			tabName = tab;
		} else if (tally_options.mostRecentTab && tally_options.mostRecentTab !== "") {
			tabName = tally_options.mostRecentTab;
		} else {
			// default
			tabName = "status";
		}


		// save most recent tab
		tally_options.mostRecentTab = tabName;
		saveOptionsRecentPage();
		// display tab
		displayTab(tabName);

	} catch (err) {
		console.error(err);
	}
}


async function displayTab(tab) {
	try {
		// show correct tab
		var t = document.getElementsByClassName("tab");
		for (let i = 0; i < t.length; i++) {
			t[i].style.display = "none";
		}
		document.getElementById(tab + "Tab").style.display = "block";

		// show correct tab button
		var b = document.getElementsByClassName("tab-button");
		for (let i = 0; i < b.length; i++) {
			b[i].classList.remove("active");
		}
		document.getElementById(tab + "TabBtn").classList.add("active");



		updateData();

		if (tab == "items") {
			displayAttacks();
		}

	} catch (err) {
		console.error(err);
	}
}





function updateData() {
	try {
		// STATUS
		$("#username").html(tally_user.username);
		$("#level").html(tally_user.level);
		$("#score").html(tally_user.score.score);
		$("#clicks").html(tally_user.score.clicks);
		$("#likes").html(tally_user.score.likes);
		$("#pages").html(tally_user.score.pages);
		$("#time").html(moment.utc(tally_user.score.time * 1000).format('HH:mm:ss'));
		$("#monsters").html(FS_Object.objLength(tally_user.monsters));

		// OPTIONS
		$("#gameMode").val(tally_options.gameMode);
		$("#soundVolume").val(tally_options.soundVolume * 100);
		$("#disabledDomains").val(tally_options.disabledDomains.join("\n"));

		// META
		$("#onlineStatus").html((tally_meta.userOnline ? "true" : "false"));
		$("#serverStatus").html((tally_meta.serverOnline ? "true" : "false"));
		$("#loggedInStatus").html((tally_meta.userLoggedIn ? "true" : "false"));
		$("#currentAPI").html((tally_meta.env.currentAPI ? tally_meta.env.currentAPI : "null"));
		$("#api").html((tally_meta.env.api ? tally_meta.env.api : "null"));
		$("#installedOn").html(tally_meta.install.date);
		$("#version").html(tally_meta.install.version);
	} catch (err) {
		console.error(err);
	}
}




/*  SAVE ON CLOSE
 ******************************************************************************/

// beforeunload works only by clicking the "X"
$(window).on("beforeunload", function() {
	try {
		sendBackgroundDebugMessage("POPUP", "beforeunload called");
		saveAndClose();
	} catch (err) {
		console.error(err);
	}
});

// called when the page is unloaded
addEventListener("unload", function(event) {
	try {
		sendBackgroundDebugMessage("POPUP", "unload called");
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
		if (updatePageOnSaveOptions)
			// refresh current page with new settings
			refreshPageWithNewSettings();
	} catch (err) {
		console.error(err);
	}
}






/******************** FUNCTIONS ********************/


async function displayAttacks(callback) {
	try {
		// reset selected
		attacksSelected = 0;
		// start string
		var str = "";
		// for each attack
		for (var key in tally_user.attacks) {
			if (tally_user.attacks.hasOwnProperty(key)) {
				let checked = "";
				// if below limit and it should be shown as selected
				if (attacksSelected < attacksMax && tally_user.attacks[key].selected === 1) {
					checked = " checked ";
					// track # of selected
					attacksSelected++;
				}
				// show defense vs. attack
				let defenseOption = "";

				// if defense
				if (tally_user.attacks[key].type === "defense") {
					defenseOption = "battle-options-defense";
				}
				let title = tally_user.attacks[key].name + " [" + tally_user.attacks[key].category + " " + tally_user.attacks[key].type + "] ";
				if (tally_user.attacks[key].description) title += tally_user.attacks[key].description;

				str += "<li>";
				str += '<input class="attack-checkbox" type="checkbox" id="' + key + '" name="attacks" ' + checked + ' />';
				str += "<label " +
					" for='" + key + "'" +
					" title='" + title + "' " +
					" data-attack='" + tally_user.attacks[key].name + "' " +
					" class='tally battle-options battle-options-fire " + defenseOption + " attack-" + tally_user.attacks[key].name + "'>" +
					"<span class='tally attack-icon attack-icon-" + tally_user.attacks[key].type + "' ></span>" +
					key + '</label>';
				str += "</li>";

			}
		}
		// alert("displayAttacks() " + attacksSelected + "/" + attacksMax);

		// console.log(str);
		$(".attacksCloud").html(str);
		// update display
		updateSelectedCheckboxesDisplay();

		// add icons
		$(".attack-icon-attack").css({
			"background-image": 'url(' + chrome.runtime.getURL('../../assets/img/battles/sword-pixel-13sq.png') + ')'
		});
		$(".attack-icon-defense").css({
			"background-image": 'url(' + chrome.runtime.getURL('../../assets/img/battles/shield-pixel-13sq.png') + ')'
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
					showInterfaceFeedback('You can only use up to four attacks in battles.');
					// set back to false
					$("#" + name).prop('checked', false);
					// update totals
					updateSelectedCheckboxesTotal();
					return;
				}
				// set attack selected
				if (this.checked) tally_user.attacks[name].selected = 1;
				else tally_user.attacks[name].selected = 0;

				// save user in background
				saveUserInBackground();
				// save attacks on server (not that efficient but reliable)
				saveAttacksOnServer();
				// set flag to update page and server when finished
				updatePageOnSaveOptions = true;
				// update display
				updateSelectedCheckboxesDisplay();
			} catch (err) {
				console.error(err);
			}
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
		sendBackgroundDebugMessage("POPUP", "saveAttacksOnServer()");

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


/**
 *	Send a debug message to background console
 */
function sendBackgroundDebugMessage(caller, str) {
	try {
		// time the request
		let startTime = new Date().getTime();

		// if (DEBUG) console.log(getCurrentDateStr(), "🗜️ Debug.sendBackgroundDebugMessage()", caller, str);
		let msg = {
			'action': 'sendBackgroundDebugMessage',
			'caller': caller,
			'str': str
		};

		chrome.runtime.sendMessage(msg, function(response) {
			let endTime = new Date().getTime();
			console.log("POPUP > 🗜️ sendBackgroundDebugMessage() time = " + (endTime - startTime) + "ms, RESPONSE =", JSON.stringify(response));
		});
	} catch (err) {
		console.error(err);
	}
}




function sendUpdateToBackground() {
	try {
		sendBackgroundDebugMessage("POPUP", "sendUpdateToBackground() [1]");

		chrome.runtime.sendMessage({
			'action': 'updateTallyUser',
			'data': popupUpdate
		}, function(response) {
			sendBackgroundDebugMessage("POPUPsendUpdateToBackground() [2]");

			console.log('💾 > sendUpdateToBackground() RESPONSE =', response);
			// update tally_user in content
			tally_user = response.tally_user;
			// reset
			popupUpdate = createPopupBackgroundUpdate();
		});
	} catch (err) {
		console.error(err);
	}
}




function saveUserInBackground() {
	try {
		console.log("POPUP > saveUserInBackground()", tally_user);
		sendBackgroundDebugMessage("POPUP", "saveUserInBackground() [1]");

		// save user in background.js
		chrome.runtime.sendMessage({
			'action': 'saveData',
			'name': "tally_user",
			'data': tally_user
		}, function(response) {
			console.log(response);
			sendBackgroundDebugMessage("POPUP", "saveUserInBackground() [2]");

			// show status
			showInterfaceFeedback('Settings saved');
			// set flag
			updatePageOnSaveOptions = true;
		});
	} catch (err) {
		console.error(err);
	}
}

async function saveOptionsInBackground() {
	try {
		sendBackgroundDebugMessage("POPUP", "saveOptionsInBackground() [1]");

		// game
		tally_options.gameMode = $("#gameMode").val();
		tally_options.soundVolume = $("#soundVolume").val() / 100;
		// privacy
		tally_options.disabledDomains = $('#disabledDomains').val().trim().replace(/\r\n/g, "\n").split("\n");

		console.log("POPUP > saveOptionsInBackground()", tally_options);

		// save options in background.js
		chrome.runtime.sendMessage({
			'action': 'saveOptions',
			'data': tally_options
		}, function(response) {
			//console.log(response);
			sendBackgroundDebugMessage("POPUP", "saveOptionsInBackground() [2]");

			// display success status
			showInterfaceFeedback('Options saved');
			// set flag
			updatePageOnSaveOptions = true;
		});
	} catch (err) {
		console.error(err);
	}
}

// save options (just to save recent tab)
function saveOptionsRecentPage() {
	try {
		chrome.runtime.sendMessage({
			'action': 'saveOptions',
			'data': tally_options
		}, function(response) {
			console.log("POPUP > saveOptionsRecentPage()", response);
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
		sendBackgroundDebugMessage("POPUP", "refreshPageWithNewSettings()");

		// get tab and reload
		chrome.tabs.query({
			active: true,
			currentWindow: true
		}, function(arrayOfTabs) {
			console.log("POPUP > query again", arrayOfTabs);
			// reload current tab
			chrome.tabs.reload(arrayOfTabs[0].id);
		});
	} catch (err) {
		console.error(err);
	}
}









// reset tally_user
document.getElementById("opt_reset_user").onclick = function() {
	try {
		window.open(tally_meta.env.website + "/dashboard");
	} catch (err) {
		console.error(err);
	}
};
// reset tally_options
document.getElementById("opt_reset_options").onclick = function() {
	try {
		chrome.runtime.sendMessage({
			action: "resetOptions"
		}, function(response) {
			//console.log(response);
			// display success status
			showInterfaceFeedback("Options have been reset");
		});
	} catch (err) {
		console.error(err);
	}
};





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
	var audio = new Audio(chrome.runtime.getURL("assets/sounds/tally/moods-v3/excited-2-1.wav"));
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





/*  BUTTON FUNCTIONS
 ******************************************************************************/

// tab buttons
document.getElementById("statusTabBtn").onclick = function() {
	displayTab("status");
};
document.getElementById("itemsTabBtn").onclick = function() {
	displayTab("items");
};
document.getElementById("optionsTabBtn").onclick = function() {
	displayTab("options");
};
document.getElementById("aboutTabBtn").onclick = function() {
	displayTab("about");
};
document.getElementById("feedbackTabBtn").onclick = function() {
	displayTab("feedback");
};
document.getElementById("debuggingTabBtn").onclick = function() {
	displayTab("debugging");
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
	window.open(tally_meta.env.website + "/profile/" + tally_user.username);
});
$(document).on('click', '#editProfileBtn', function() {
	window.open(tally_meta.env.website + "/dashboard");
});
$(document).on('click', '#viewLeaderboardsBtn', function() {
	window.open(tally_meta.env.website + "/leaderboard");
});
$(document).on('click', '#howToPlayBtn', function() {
	window.open(tally_meta.env.website + "/how-to-play");
});
$(document).on('click', '#viewPrivacyPolicyBtn', function() {
	window.open(tally_meta.env.website + "/privacy");
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

// show feedback (saved, etc.)
function showInterfaceFeedback(msg) {
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
