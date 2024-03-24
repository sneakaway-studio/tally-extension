"use strict";

/*  DATE FUNCTIONS *requires Moment.js*
 * 	- See notes in API README about datetime for Tally and future projects
 ******************************************************************************/

var FS_Date = (function() {
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
		},



		/*  DATE FUNCTIONS (VANILLA JS, NO LIBRARIES)
		 ******************************************************************************/

		/**
		 *	Return a date in ISO string
		 *	returnDateISO() -> '2022-08-11T15:02:30.476Z' -> (UTC string)
		 *	returnDateISO(null, ["", "-", "", ""]) -> '20220811-150230' -> (UTC string)
		 */
		returnDateISO: function(d = null, delimit = ["-", "T", ":", "Z"]) {
			let s = '';
			if (d == null) d = new Date();

			// if no Z included then use local timezone
			if (delimit[3] != "Z") {
				// get offset, remove Z https://stackoverflow.com/a/72581185/441878
				d = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
			}

			// convert to ISO format string
			s = d.toISOString();
			// console.log(s); // -> '2022-08-11T15:02:30.476Z'

			// ? remove milliseconds
			if (delimit[3] != "Z") {
				s = s.slice(0, -1);
				// console.log(s); // -> '2022-08-11T15:02:30.476'
				s = s.substring(0, s.indexOf('.'));
				// console.log(s); // -> '2022-08-11T15:02:30'
			}
			// use delimit arr to determine what is included ...

			// replace time separator with hyphens
			s = s.replace(/-/g, delimit[0]);
			s = s.replace(/T/g, delimit[1]);
			s = s.replace(/:/g, delimit[2]);
			s = s.replace(/Z/g, delimit[3]);
			// console.log(s); // -> '20220811-150230'

			return s;
		},
		pad: function(n) {
			return n < 10 ? '0' + n : n;
		}



	};
})();

// if running in node, then export module
if (typeof process === 'object') module.exports = FS_Date;
// otherwise add as "global" object window for browser / extension
else self.FS_Date = FS_Date;




/*  DATE FUNCTIONS (OLD, VANILLA JS, BEFORE SWITCHING TO MOMENT() )
 ******************************************************************************/



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
