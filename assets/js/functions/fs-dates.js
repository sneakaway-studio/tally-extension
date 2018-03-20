"use strict";

/*  DATE FUNCTIONS
******************************************************************************/

/**
 *	Return a date in ISO string
 */
function returnDateISO(_date=null){
	var date = new Date();
	if (_date != null)
		date = _date;
	var s;
	s = date.toISOString(); //"2011-12-19T15:28:46.493Z"
	//Removing milisseconds;
	s = s.substring(0, s.indexOf('.'));
	return s;
}
