"use strict";

/*  STRING FUNCTIONS
 ******************************************************************************/

window.FS_String = (function() {
	// PRIVATE


	// PUBLIC
	return {
		// add a leading zero
		pad: function(num, size) {
			try {
				var s = num + "";
				while (s.length < size) s = "0" + s;
				return s;
			} catch (err) {
				console.error(err);
			}
		},
		containsVowel: function(str) {
			try {
				return /[aeiouAEIOU]/.test(str);
			} catch (err) {
				console.error(err);
			}
		},

		ucFirst: function(str) {
			try {
				if (str === undefined || str === "") return str;
				return str.charAt(0).toUpperCase() + str.slice(1);
			} catch (err) {
				console.error(err);
			}
		},

		/**
		 *	Insert stylesheet into a page, ensure it works for CSS3 animations
		 *	credit: https://stackoverflow.com/a/43904152/441878
		 */
		insertStylesheets: function() {
			try {
				if ($("#tally_styles").length) return;
				let sheets = document.styleSheets,
					style = document.createElement('style'),
					addKeyFrames = null;
				style.setAttribute("id", "tally_styles");
				style.appendChild(document.createTextNode(""));
				document.head.appendChild(style);
				if (CSS && CSS.supports && CSS.supports('animation: name')) {
					// we can safely assume that the browser supports unprefixed version.
					addKeyFrames = function(name, frames) {
						let sheet = sheets[sheets.length - 1];
						sheet.insertRule(
							"@keyframes " + name + "{" + frames + "}");
					};
				}
			} catch (err) {
				console.error(err);
			}
		},

		removeHTML: function(str = "") {
			try {
				if (!str) return;
				// make sure it is a string
				if (typeof str !== "string") {
					console.warn("FS_String.removeHTML() NOT A STRING");
				}
				// remove html and resulting whitespace
				return str.replace(/<[^>]*>?/gm, ' ').replace(/\s+/g, ' ');
			} catch (err) {
				console.error(err);
			}
		},

		/**
		 *	Trim a string to length
		 */
		trimStr: function(str, length) {
			try {
				return str.length > length ? str.substring(0, length - 3) + "&hellip;" : str;
			} catch (err) {
				console.error(err);
			}
		},

		/**
		 * Clean a string of punctuation, commas, etc, return as array
		 */
		cleanStringReturnTagArray: function(str = "") {
			try {
				var arr = [];
				// decode html entitites
				str = this.htmlDecode(str);
				// console.log(str);

				// remove html
				str = FS_String.removeHTML(str);
				// console.log(str);

				// remove punctuation
				str = str.replace(/['!"#$%&\\'…,()\*+\-\.\/:;<=>?@\[\\\]\^_`{|}~']/g, " ");
				// console.log(str);

				// clean
				str = str
					.replace(/[0-9]/g, '') // remove numbers
					.replace(/\s+/g, ' ') // remove multiple (white)spaces
					.toLowerCase() // convert to lowercase
					.trim();
				// console.log(str);

				// if chars left then split into array
				if (str.length > 2) arr = str.split(" ");
				//  make sure each tag is > 2 long
				for (let i = 0; i < arr.length; i++)
					if (arr[i].length <= 2) arr.splice(i, 1);
				// console.log(JSON.stringify(arr));

				return arr;
			} catch (err) {
				console.error(err);
			}
		},

		htmlDecode: function(value) {
			try {
				return $("<div/>").html(value).text();
			} catch (err) {
				console.error(err);
			}
		},

		removeStopWords: function(str = null, wordArr = null) {
			try {
				var common = this.stopWords();
				if (wordArr === null) // allow str or arrays
					wordArr = str.match(/\w+/g);
				var commonObj = {},
					uncommonArr = [],
					word, i;
				for (i = 0; i < common.length; i++) {
					commonObj[common[i].trim()] = true;
				}
				for (i = 0; i < wordArr.length; i++) {
					word = wordArr[i].trim().toLowerCase();
					if (!commonObj[word]) {
						uncommonArr.push(word);
					}
				}
				return uncommonArr;
			} catch (err) {
				console.error(err);
			}
		},


		stopWords: function() {
			try {
				// http://geeklad.com/remove-stop-words-in-javascript
				return ['a', 'about', 'above', 'across', 'after', 'again', 'against', 'all', 'almost', 'alone', 'along', 'already', 'also',
					'although', 'always', 'among', 'an', 'and', 'another', 'any', 'anybody', 'anyone', 'anything', 'anywhere', 'are', 'area',
					'areas', 'around', 'as', 'ask', 'asked', 'asking', 'asks', 'at', 'away', 'b', 'back', 'backed', 'backing', 'backs', 'be', 'became',
					'because', 'become', 'becomes', 'been', 'before', 'began', 'behind', 'being', 'beings', 'best', 'better', 'between', 'big',
					'both', 'but', 'by', 'c', 'came', 'can', 'cannot', 'case', 'cases', 'certain', 'certainly', 'clear', 'clearly', 'come', 'could',
					'd', 'did', 'differ', 'different', 'differently', 'do', 'does', 'done', 'down', 'down', 'downed', 'downing', 'downs', 'during',
					'e', 'each', 'early', 'either', 'end', 'ended', 'ending', 'ends', 'enough', 'even', 'evenly', 'ever', 'every', 'everybody',
					'everyone', 'everything', 'everywhere', 'f', 'face', 'faces', 'fact', 'facts', 'far', 'felt', 'few', 'find', 'finds', 'first',
					'for', 'four', 'from', 'full', 'fully', 'further', 'furthered', 'furthering', 'furthers', 'g', 'gave', 'general', 'generally',
					'get', 'gets', 'give', 'given', 'gives', 'go', 'going', 'good', 'goods', 'got', 'great', 'greater', 'greatest', 'group',
					'grouped', 'grouping', 'groups', 'h', 'had', 'has', 'have', 'having', 'he', 'her', 'here', 'herself', 'high', 'high', 'high',
					'higher', 'highest', 'him', 'himself', 'his', 'how', 'however', 'i', 'if', 'important', 'in', 'interest', 'interested',
					'interesting', 'interests', 'into', 'is', 'it', 'its', 'itself', 'j', 'just', 'k', 'keep', 'keeps', 'kind', 'knew', 'know',
					'known', 'knows', 'l', 'large', 'largely', 'last', 'later', 'latest', 'least', 'less', 'let', 'lets', 'like', 'likely', 'long',
					'longer', 'longest', 'm', 'made', 'make', 'making', 'man', 'many', 'may', 'me', 'member', 'members', 'men', 'might', 'more',
					'most', 'mostly', 'mr', 'mrs', 'much', 'must', 'my', 'myself', 'n', 'necessary', 'need', 'needed', 'needing', 'needs', 'never',
					'new', 'new', 'newer', 'newest', 'next', 'no', 'nobody', 'non', 'noone', 'not', 'nothing', 'now', 'nowhere', 'number', 'numbers',
					'o', 'of', 'off', 'often', 'old', 'older', 'oldest', 'on', 'once', 'one', 'only', 'open', 'opened', 'opening', 'opens', 'or',
					'order', 'ordered', 'ordering', 'orders', 'other', 'others', 'our', 'out', 'over', 'p', 'part', 'parted', 'parting', 'parts',
					'per', 'perhaps', 'place', 'places', 'point', 'pointed', 'pointing', 'points', 'possible', 'present', 'presented',
					'presenting', 'presents', 'problem', 'problems', 'put', 'puts', 'q', 'quite', 'r', 'rather', 'really', 'right', 'right', 'room',
					'rooms', 's', 'said', 'same', 'saw', 'say', 'says', 'second', 'seconds', 'see', 'seem', 'seemed', 'seeming', 'seems', 'sees',
					'several', 'shall', 'she', 'should', 'show', 'showed', 'showing', 'shows', 'side', 'sides', 'since', 'small', 'smaller',
					'smallest', 'so', 'some', 'somebody', 'someone', 'something', 'somewhere', 'state', 'states', 'still', 'still', 'such', 'sure',
					't', 'take', 'taken', 'than', 'that', 'the', 'their', 'them', 'then', 'there', 'therefore', 'these', 'they', 'thing', 'things',
					'think', 'thinks', 'this', 'those', 'though', 'thought', 'thoughts', 'three', 'through', 'thus', 'to', 'today', 'together',
					'too', 'took', 'toward', 'turn', 'turned', 'turning', 'turns', 'two', 'u', 'under', 'until', 'up', 'upon', 'us', 'use', 'used',
					'uses', 'v', 'very', 'w', 'want', 'wanted', 'wanting', 'wants', 'was', 'way', 'ways', 'we', 'well', 'wells', 'went', 'were', 'what',
					'when', 'where', 'whether', 'which', 'while', 'who', 'whole', 'whose', 'why', 'will', 'with', 'within', 'without', 'work',
					'worked', 'working', 'works', 'would', 'x', 'y', 'year', 'years', 'yet', 'you', 'young', 'younger', 'youngest', 'your', 'yours', 'z',
					//
					"ain't", "aren't", "can't", "could've", "couldn't", "didn't", "doesn't", "don't", "hasn't", "he'd", "he'll", "he's", "how'd", "how'll", "how's", "i'd", "i'll", "i'm", "i've", "isn't", "it's", "might've", "mightn't", "must've", "mustn't", "shan't", "she'd", "she'll", "she's", "should've", "shouldn't", "that'll", "that's", "there's", "they'd", "they'll", "they're", "they've", "wasn't", "we'd", "we'll", "we're", "weren't", "what'd", "what's", "when'd", "when'll", "when's", "where'd", "where'll", "where's", "who'd", "who'll", "who's", "why'd", "why'll", "why's", "won't", "would've", "wouldn't", "you'd", "you'll", "you're", "you've",
					// mine
					"ages", "generations", "carefully", "page", "directly", "description", "test", "title", "keywords"
				];
			} catch (err) {
				console.error(err);
			}
		},


		// remove small words
		// count down so no skipping occurs
		 removeSmallWords: function(arr) {
			try {
				for (var i = arr.length - 1; i >= 0; i--) {
					if (arr[i].length < 3)
						arr.splice(i, 1);
				}
				return arr;
			} catch (err) {
				console.error(err);
			}
		}


	};
})();
