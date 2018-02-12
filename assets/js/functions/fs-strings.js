
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
	str = str.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()\[\]]/g," ") // remove punctuation
			 .replace(/ +(?= )/g,'')// remove multiple spaces
			 .toLowerCase()			// convert to lowercase
			 .trim();
	// if chars left then split into array
	if (str.length > 0)
		arr = str.split(" ");
	//console.log( JSON.stringify(arr) )
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
