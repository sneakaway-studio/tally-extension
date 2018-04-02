"use strict";

/*  DATE FUNCTIONS
 ******************************************************************************/

/**
 *	Return a date in ISO string
 */
function returnDateISO(_date = null) {
	var date = new Date();
	if (_date != null)
		date = _date;
	var s;
	s = date.toISOString(); //"2011-12-19T15:28:46.493Z"
	//Removing milisseconds;
	s = s.substring(0, s.indexOf('.'));
	return s;
}

/**
 *	Check if a date string is valid
 */
function isValidDateString(str) {
	let timestamp = Date.parse(str);
	//console.log("timestamp", timestamp);
	if (isNaN(timestamp) == false) {
		//var d = new Date(timestamp);
		return true;
	} else {
		return false;
	}
}


/**
 *	Format a date and return number millis between now and date
 *	Return
 *		false = date is invalid
 *		positive number = date is in the future
 *		negative number = date is in the past
 *		0 = date is now
 */
function returnDateDifferenceMinutes(str) {
	if (!isValidDateString(str)) return false;
	let now = new Date(),
		then = new Date(str),
		difference = then.getTime() - now.getTime();
	// console.log("now", now.getTime());
	// console.log("then", then.getTime());
	// console.log("difference", difference);
	return difference;
}
