"use strict";

var DialogueData = (function() {

	let DEBUG = false;



	/**
	 *	Get a random fact (by domain)
	 */
	function getFact(domain, includeSource = true) {
		try {
			let fact = FS_Object.randomArrayIndex(Facts.data[domain]);
			// get fact
			let str = fact.fact;
			// should we include source?
			if (includeSource) {
				if (fact.url && fact.source)
					str += " Source: <a href='" + fact.url + "' target='_blank'>" + fact.source + "</a>";
				if (fact.year)
					str += " (" + fact.year + ")";
			}
			return str;
		} catch (err) {
			console.error(err);
		}
	}

	/**
	 *	Return a dialogue, arr = ["category", "subcategory", "index"]
	 */
	function get(arr) {
		try {
			// make sure it is an array
			if (!Array.isArray(arr)) return;
			// category is required
			if (!prop(arr[0])) return;

			if (DEBUG) console.log("💭 DialogueData.get() arr="+ JSON.stringify(arr));


			// get category
			let category, categoryStr, subcategoryStr;
			categoryStr = arr[0];
			category = Dialogue.data[categoryStr];

			if (DEBUG) console.log("💭 DialogueData.get()", "categoryStr="+categoryStr +", category="+ JSON.stringify(category));

			// if there is a subcategory, then select random
			if (prop(arr[1])) {
				subcategoryStr = arr[1];
				if (DEBUG) console.log("💭 DialogueData.get()", "subcategoryStr="+subcategoryStr );
				// if prop doesn't exist in DialogueData then don't show anything
				if (!prop(category[subcategoryStr]) || category[subcategoryStr].length < 1) return;
				// otherwise get a random one
				let r = Math.floor(Math.random() * category[subcategoryStr].length);
				if (DEBUG) console.log("💭 DialogueData.get()", "subcategoryStr="+subcategoryStr +", category[subcategoryStr]="+ JSON.stringify(category[subcategoryStr]));
				return category[subcategoryStr][r];
			}
			// if there is no subcategory, then get by index
			else if (arr[2]) {
				let index = arr[2];
				return category[index];
			}
			// otherwise
			else return false;
		} catch (err) {
			console.error(err);
		}
	}



	return {
		getFact: function(domain, includeSource) {
			return getFact(domain, includeSource);
		},
		get: function(arr) {
			return get(arr);
		},
		dialogue: Dialogue.data,
		facts: Facts.data
	};

})();
