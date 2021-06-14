"use strict";

/*  ITEM
 ******************************************************************************/

window.Item = (function() {
	// PRIVATE

	let DEBUG = Debug.ALL.Item,
		visible = false,
		hideTimeout = {},
		listenersAdded = false;




	/**
	 *	Show the manager
	 */
	function showManager(state = null) {
		try {
			// update the data
			updateManager();
			// if state is received then use that
			if (state !== null) itemManagerVisible(state);
			// otherwise, toggle
			else if (!visible) itemManagerVisible(true);
			// default is to hide
			else itemManagerVisible(false);
		} catch (err) {
			console.error(err);
		}
	}




	/**
	 *	Update the manager
	 */
	function updateManager() {
		try {
			let str = "",
				menu = "",
				attacksSelected = 0,
				attacksMax = 4;
			// html += JSON.stringify(T.tally_user.attacks)


			menu += `<div class="tally tab-button-group">
				<button class="tally tab-button active attacksBtn">Attacks</button>
				<button class="tally tab-button itemsBtn">Items</button>
				<button class="tally tab-button optionsBtn">Options</button>
				<button class="tally tab-button hideUnlessAdmin debuggingBtn">🗜️</button>
			</div>`;

			// update menu
			$("#tally_item_manager_menu").html(menu);





			// attacks
			if (T.tally_user.attacks) {
				str += '<div class="tally tab attacksTab">';
				for (var key in T.tally_user.attacks) {
					if (T.tally_user.attacks.hasOwnProperty(key)) {
						let checked = "";
						// if below limit and it should be shown as selected
						if (attacksSelected < attacksMax && T.tally_user.attacks[key].selected === 1) {
							checked = " checked ";
							// track # of selected
							attacksSelected++;
						}
						// show defense vs. attack
						let defenseOption = "";

						// if defense
						if (T.tally_user.attacks[key].type === "defense") {
							defenseOption = "battle-options-defense";
						}
						let title = T.tally_user.attacks[key].name + " [" + T.tally_user.attacks[key].category + " " + T.tally_user.attacks[key].type + "] ";
						if (T.tally_user.attacks[key].description) title += T.tally_user.attacks[key].description;

						str += "<li>";
						str += '<input class="attack-checkbox" type="checkbox" id="' + key + '" name="attacks" ' + checked + ' />';
						str += "<label " +
							" for='" + key + "'" +
							" title='" + title + "' " +
							" data-attack='" + T.tally_user.attacks[key].name + "' " +
							" class='tally battle-options battle-options-fire " + defenseOption + " attack-" + T.tally_user.attacks[key].name + "'>" +
							"<span class='tally attack-icon attack-icon-" + T.tally_user.attacks[key].type + "' ></span>" +
							key + '</label>';
						str += "</li>";

					}
				}
				str += '</div>';
			}



			str += '<div class="tally tab itemsTab">';
			str += '</div>';

			str += '<div class="tally tab optionsTab">';
			str += '</div>';

			str += '<div class="tally tab debuggingTab">';
			str += '</div>';

			$("#tally_item_manager_inner").html(str);

			// add icons
			$(".attack-icon-attack").css({
				"background-image": 'url(' + browser.runtime.getURL('assets/img/battles/sword-pixel-13sq.png') + ')'
			});
			$(".attack-icon-defense").css({
				"background-image": 'url(' + browser.runtime.getURL('assets/img/battles/shield-pixel-13sq.png') + ')'
			});

			addListeners();

		} catch (err) {
			console.error(err);
		}
	}

	// add tab listeners
	function addListeners() {
		try {
			if (DEBUG) console.log("📦 Item.addListeners() [1]");
			if (listenersAdded) return;
			else listenersAdded = true;

			$(document).on('click', '.attacksBtn', function() {
				openTab("attacks");
			});
			$(document).on('click', '.itemsBtn', function() {
				openTab("items");
			});
			$(document).on('click', '.optionsBtn', function() {
				openTab("options");
			});
			$(document).on('click', '.debuggingBtn', function() {
				openTab("debugging");
			});


			if (DEBUG) console.log("📦 Item.addListeners() [2]");
		} catch (err) {
			console.error(err);
		}
	}

	// show tab
	function openTab(tab) {
		try {
			if (DEBUG) console.log("📦 Item.openTab() tab = " + tab);

			// hide all
			$('.attacksTab').css({
				'display': 'none'
			});
			$('.itemsTab').css({
				'display': 'none'
			});
			$('.optionsTab').css({
				'display': 'none'
			});
			$('.debuggingTab').css({
				'display': 'none'
			});
			// show new
			$('.' + tab + "Tab").css({
				'display': 'block'
			});

			// display correct menu
			$('.attacksBtn').removeClass('active');
			$('.itemsBtn').removeClass('active');
			$('.optionsBtn').removeClass('active');
			$('.debuggingBtn').removeClass('active');
			// show new
			$('.' + tab + "Btn").addClass('active');

		} catch (err) {
			console.error(err);
		}
	}




	// close items after a period
	function closeAfterTime() {
		try {
			hideTimeout = setTimeout(itemManagerVisible, 20);
			clearTimeout(hideTimeout);
		} catch (err) {
			console.error(err);
		}
	}

	/**
	 *	Slide show
	 */
	function itemManagerVisible(state = false) {
		try {
			if (DEBUG) console.log("📦 Item.itemManagerVisible() current = " + visible, ", new state = " + state);
			if (state) { // show it
				visible = true;
				$('#tally_item_manager').css({
					"display": "block",
					"left": "240px",
					"opacity": 1
				});
				closeAfterTime();
			} else { // hide it
				visible = false;
				$('#tally_item_manager').css({
					"display": "none",
					"left": "-1500px",
					"opacity": 0
				});
			}
		} catch (err) {
			console.error(err);
		}
	}

	// PUBLIC
	return {
		visible: function() {
			return visible;
		},
		showManager: function() {
			showManager();
		},
		hideManager: function() {
			itemManagerVisible(false);
		}


	};
})();
