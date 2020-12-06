"use strict";

/*  DATE FUNCTIONS *requires Moment.js*
 * 	- See notes in API README about datetime for Tally and future projects
 ******************************************************************************/

window.FS_Date = (function() {
	// PRIVATE
	function format(date) {
		if (date == "now") date = moment();
		else date = moment(date);
		return date;
	}
	// 24 hour time format
	let timeFormat24 = 'HH:mm:ss';
	// now
	let time = moment();
	let workTime = [
			moment("9:00", timeFormat24),
			moment("17:00", timeFormat24)
		],
		nightTime = [
			moment("22:00", timeFormat24),
			moment("6:00", timeFormat24).add(1, 'day') // add one day for tomorrow morning
		];

	function isWeekDay() {
		let weekDay = moment().isBetween(moment().isoWeekday(1), moment().isoWeekday(5), 'day', '[]');
		//console.log("isWeekDay()", weekDay);
		return weekDay;
	}


	// PUBLIC
	return {
		time: function() {
			return time;
		},
		isWorkday: function() {
			let ret = (moment().isBetween(workTime[0], workTime[1]) && isWeekDay());
			//console.log("isWorkday", ret);
			if (ret)
				return true;
			else return false;
		},
		isWeekDay: isWeekDay,
		isNight: function() {
			//console.log("isNight", time, moment().isBetween(nightTime[0], nightTime[1]));
			if (moment().isBetween(nightTime[0], nightTime[1]))
				return true;
			else return false;
		},
		// what is the difference in milliseconds?
		difference: function(d1, d2) {
			d1 = format(d1);
			d2 = format(d2);
			return moment(d1).diff(moment(d2));
		},
		diffSeconds: function(d1, d2) {
			d1 = format(d1);
			d2 = format(d2);
			return Math.floor((d1.diff(moment(d2)) / 1000));
		},
		diffMinutes: function(d1, d2) {
			d1 = format(d1);
			d2 = format(d2);
			return Math.floor((d1.diff(moment(d2)) / 1000 / 60));
		},
		diffHours: function(d1, d2) {
			d1 = format(d1);
			d2 = format(d2);
			return Math.floor((d1.diff(moment(d2)) / 1000 / 60 / 60));
		},
		// is the difference between date1 and date2 more than "val" "period"?
		moreThan: function(d1, d2, val, period) {
			d1 = format(d1);
			d2 = format(d2);
			if (moment(d1).diff(moment(d2), period) > val)
				return true;
			return false;
		},
		moreThanOneHourAgo: function(endtime) {
			endtime = format(endtime);
			let diff = moment().diff(endtime, "minutes");
			// console.log("FS_Date.moreThanOneHourAgo()",endtime,diff);
			return (diff > 3);
		}

	};
})();



/*  DATE FUNCTIONS (OLD, VANILLA JS, BEFORE SWITCHING TO MOMENT() )
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
