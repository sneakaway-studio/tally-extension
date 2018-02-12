
/*  DATE FUNCTIONS
******************************************************************************/

/**
 *	Return a date in ISO string
 */
function returnDateISO(){
	var date = new Date();
	var s;
	s = date.toISOString(); //"2011-12-19T15:28:46.493Z"
	//Removing milisseconds;
	s = s.substring(0, s.indexOf('.'));
	return s;
}
