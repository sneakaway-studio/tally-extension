"use strict";

/*  DATE FUNCTIONS *requires Moment.js*
 ******************************************************************************/

 window.FS_Date = (function() {
 	// PRIVATE
	function format(date){
		if (date == "now") date = moment();
		else date = moment(date);
		return date;
	}


 	// PUBLIC
 	return {
		// what is the difference in milliseconds?
 		difference: function(d1,d2){
 			d1 = format(d1);
	 		d2 = format(d2);
 			return moment(d1).diff(moment(d2));
 		},
		// is the difference between date1 and date2 more than "val" "period"?
		moreThan: function(d1,d2,val,period){
 			d1 = format(d1);
	 		d2 = format(d2);
			if (moment(d1).diff(moment(d2),period) > val)
				return true;
			return false;
		},
		moreThanOneHourAgo: function(d1){
 			d1 = format(d1);
			return (moment(moment()).diff(d1,"hour") > 1);
		}

 	};
 })();



 /*  DATE FUNCTIONS (OLD, VANILLA JS)
  ******************************************************************************/

/**
 *	Return a date in ISO string
 */
/*
function returnDateISO(_date = null) {
	var date = new Date();
	if (_date != null)
		date = _date;
	var s;
	s = date.toISOString(); //"2011-12-19T15:28:46.493Z"
	// remove milliseconds
	s = s.substring(0, s.indexOf('.'));
	return s;
}
*/


/**
 *	Return true if now-then > date period
 */
/*
function timeElapsed(_now,_then,period){
	let then = Date.parse(_then),
		now = Date.parse(_now);
	var t = {};
	t.second = 1000;
	t.minute = 60 * t.second;
	t.hour = 60 * t.minute;
	t.day = 24 * t.hour;
	// t.week = 7 * t.day;
	// t.month = 7 * t.week;
	console.log(then,now,(now - then),period,t[period]);
	if ((now - then) > t[period])
		return true;
	else
		return false;
}
*/


/**
 *	Check if a date string is valid
 */
/*
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
*/

/**
 *	Format a date and return number millis between now and date
 *	Return
 *		false = date is invalid
 *		positive number = date is in the future
 *		negative number = date is in the past
 *		0 = date is now
 */
/*
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
*/
