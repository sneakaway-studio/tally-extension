/*jshint esversion: 6 */

/*  STRING FUNCTIONS
******************************************************************************/


/**
 *	Trim a string to length
 */
function trimStr(str,length){
	return str.length > length ? str.substring(0, length - 3) + "&hellip;" : str;
}

/**
 * Clean a string of punctuation, commas, etc, return as array
 */
function cleanStringReturnTagArray(str=""){
	var arr = [];
	// clean
	str = str.replace(/[.,\/#\"\'!$%\^&\*;:{}=\-_`~()\[\]]/g," ") // remove punctuation
			 .replace(/[0-9]/g,'')	// remove numbers
			 .replace(/\s\s+/g,' ')	// remove multiple (white)spaces
			 .toLowerCase()			// convert to lowercase
			 .trim();
	// if chars left then split into array
	if (str.length > 0)
		arr = str.split(" ");
	//console.log( JSON.stringify(arr) )
	return arr;
}


function removeStopWords(str=null,wordArr=null) {
    var common = stopWords();
    if (wordArr === null) // allow str or arrays
		wordArr = str.match(/\w+/g);
    var commonObj = {},
        uncommonArr = [],
        word, i;
    for (i = 0; i < common.length; i++) {
        commonObj[ common[i].trim() ] = true;
    }
    for (i = 0; i < wordArr.length; i++) {
        word = wordArr[i].trim().toLowerCase();
        if (!commonObj[word]) {
            uncommonArr.push(word);
        }
    }
    return uncommonArr;
}
function stopWords() {
    return ["a", "able", "about", "across", "after", "all", "almost", "also", "am", "among", "an", "and", "any", "are", "as", "at", "be", "because", "been", "but", "by", "can", "cannot", "could", "dear", "did", "do", "does", "either", "else", "ever", "every", "for", "from", "get", "got", "had", "has", "have", "he", "her", "hers", "him", "his", "how", "however", "i", "if", "in", "into", "is", "it", "its", "just", "least", "let", "like", "likely", "may", "me", "might", "most", "must", "my", "neither", "no", "nor", "not", "of", "off", "often", "on", "only", "or", "other", "our", "own", "rather", "said", "say", "says", "she", "should", "since", "so", "some", "than", "that", "the", "their", "them", "then", "there", "these", "they", "this", "tis", "to", "too", "twas", "us", "wants", "was", "we", "were", "what", "when", "where", "which", "while", "who", "whom", "why", "will", "with", "would", "yet", "you", "your", "ain't", "aren't", "can't", "could've", "couldn't", "didn't", "doesn't", "don't", "hasn't", "he'd", "he'll", "he's", "how'd", "how'll", "how's", "i'd", "i'll", "i'm", "i've", "isn't", "it's", "might've", "mightn't", "must've", "mustn't", "shan't", "she'd", "she'll", "she's", "should've", "shouldn't", "that'll", "that's", "there's", "they'd", "they'll", "they're", "they've", "wasn't", "we'd", "we'll", "we're", "weren't", "what'd", "what's", "when'd", "when'll", "when's", "where'd", "where'll", "where's", "who'd", "who'll", "who's", "why'd", "why'll", "why's", "won't", "would've", "wouldn't", "you'd", "you'll", "you're", "you've"];
}

// remove small words
// count down so no skipping occurs
function removeSmallWords(arr){
	for (var i = arr.length -1; i >= 0; i--) {
		if (arr[i].length < 3)
			arr.splice(i, 1);
	}
	return arr;
}


/* DOMAINS */

/**
 *	Return domain name
 */
function extractHostname(url) {
	var hostname;
	//find & remove protocol (http, ftp, etc.) and get hostname

	if (url.indexOf("://") > -1) {
		hostname = url.split('/')[2];
	}
	else {
		hostname = url.split('/')[0];
	}

	//find & remove port number
	hostname = hostname.split(':')[0];
	//find & remove "?"
	hostname = hostname.split('?')[0];

	return hostname;
}
function extractRootDomain(url) {
	if (url == "") return "";
	var domain = extractHostname(url),
		splitArr = domain.split('.'),
		arrLen = splitArr.length;

	//extracting the root domain here
	if (arrLen > 2) {
		domain = splitArr[arrLen - 2] + '.' + splitArr[arrLen - 1];
	}
	return domain;
}
function extractSubDomain(url) {
	if (url == "") return "";
	var domain = extractHostname(url);
	return domain;
}
