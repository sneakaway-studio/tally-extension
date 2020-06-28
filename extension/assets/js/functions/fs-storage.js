"use strict";

/*  LOCAL STORAGE FUNCTIONS
******************************************************************************/


/**
 *  Store/get <objects || vars> in/from localStorage
 *  In Chrome go to chrome://extensions and click the background.js link, and view Resources > Local Storage
 */
function storeLocalObject(key,obj) {
	try {
		console.log("storeLocalObject()",key,JSON.stringify(obj));
		// trying w/library now
		// https://github.com/nbubna/store
		store(key,obj);
		return true;
	} catch (ex){
		console.log("storeLocalObject() failed",ex);
		return false;
	}
}
function getLocalObject(key) {
	try {
		// old method
		//var obj = window.localStorage.getItem(key);
		//return obj && JSON.parse(obj);
		// trying w/library now
		return store(key);
	} catch (ex){
		console.log("getLocalObject() failed",ex);
		return false;
	}
}
function storeLocalVar(key,obj) {
	try {
		window.localStorage.setItem(key,obj);
		//console.log("storeLocalVar()",key,JSON.stringify(obj));
		return true;
	} catch (ex){
		console.log("storeLocalVar() failed",ex);
		return false;
	}
}
function getLocalVar(key) {
	try {
		var data = window.localStorage.getItem(key);
		return data;
	} catch (ex){
		console.log("getLocalVar() failed",ex);
		return false;
	}
}
