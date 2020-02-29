"use strict";

/*  ITEM
 ******************************************************************************/

window.Item = (function() {
	// PRIVATE

	let DEBUG = Debug.ALL.Item,
		visible = false,
		hideTimeout = {};




	/**
	 *	Show the manager
	 */
	function showManager() {
		try {
			updateManager();
			if (visible) itemManagerVisible(false);
			else itemManagerVisible(true);

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
			attacksSelected =0,
			attacksMax =4;
			// html += JSON.stringify(tally_user.attacks)
 
			// attacks
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




			$("#tally_item_manager_inner").html(str);
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
	function itemManagerVisible(state=false) {
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
