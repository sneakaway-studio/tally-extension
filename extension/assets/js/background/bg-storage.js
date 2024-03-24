/**
 *	Class for chrome.storage
 */

class Storage {

	constructor() {
		console.log("Storage class");
		this.DEBUG = false;
	}


	/*  PUBLIC > DEBUGGING METHODS
	 **************************************************************************/

	/**
	 *	Log everything this extension has stored
	 *	- Paste the below into service worker DevTools console to see extension data:
	 *	- chrome.storage.local.get(console.log)
	 */
	log(all = null) {
		try {
			// using null gets everything from chrome.storage.local or .sync
			chrome.storage.local.get(all, function(data) {
				if (this.DEBUG) console.log("🍕 Storage.log()", data);
			});
		} catch (err) {
			console.error("🍕 Storage.log()", err);
		}
	}



	/*  PUBLIC > GET / SET
	 **************************************************************************/

	/**
	 *	Is data set in chrome.storage
	 */
	async isSet(key) {
		console.log("🍕 Storage.isSet() [1]");
		this.get(key).then(data => {
			if (this.DEBUG) console.log("🍕 Storage.isSet() [2] data =", JSON.stringify(data));
			if (typeof data === "undefined") return false;
			else return true;
		}).catch(err => {
			console.error("🍕 Storage.isSet() err =", JSON.stringify(err));
			return false;
		});
	}

	/**
	 *	Get / Set data by key from chrome.storage.local
	 */
	async getSet(key, data = null) {
		if (!data) {
			return this.get(key).then(d => {
				return d;
			}).catch(err => {
				console.error(err);
			});
		} else {
			return this.set(key, data).then(d => {
				return d;
			}).catch(err => {
				console.error(err);
			});
		}
	}

	/*  PUBLIC > DELETE
	 **************************************************************************/

	/* Remove data by {key} */
	delete(key) {
		chrome.storage.local.remove(key, function() {
			if (this.DEBUG) console.log(`🍕 Storage.delete(${key})`);
		});
	}
	/* Remove ALL data from chrome.storage */
	deleteAll() {
		chrome.storage.local.clear(function() {
			if (this.DEBUG) console.log(`🍕 Storage.deleteAll()`);
			var error = chrome.runtime.lastError;
			if (error) console.error(error);
		});
	}



	/*  PRIVATE
	 **************************************************************************/

	/**
	 *	Same as below but multiple (notice missing square brackets)
	 */
	async getMany(keys) {
		if (this.DEBUG) console.log("🍕 Storage.getMany() [1] keys =", JSON.stringify(keys));
		return new Promise((resolve, reject) =>
			chrome.storage.local.get(keys, result => {
				if (this.DEBUG) console.log("🍕 Storage.getMany() [2] result =", JSON.stringify(result));
				if (chrome.runtime.lastError)
					return reject(Error(chrome.runtime.lastError.message));
				else
					return resolve(result);
			})
		);
	}


	/**
	 *	Get / Set data by key from chrome.storage.local
	 *	- Return a promise from chrome.storage
	 *	- credit: https://stackoverflow.com/a/54261558/441878
	 */
	get(key) {
		if (this.DEBUG) console.log("🍕 Storage.get() [1] key =", key);
		return new Promise((resolve, reject) =>
			chrome.storage.local.get([key], result => {
				// if (this.DEBUG)
				// console.log("🍕 Storage.get() [2] result =", JSON.stringify(result));
				if (chrome.runtime.lastError)
					return reject(Error(chrome.runtime.lastError.message));
				else
					return resolve(result[key]);
			})
		);
	}
	set(key, data) {
		if (this.DEBUG) console.log("🍕 Storage.set() [1] key =", key);
		// console.log("🍕 Storage.set() [2] data =", JSON.stringify(data));
		return new Promise((resolve, reject) =>
			chrome.storage.local.set({
				[key]: data
			}, () => {
				// console.log("🍕 Storage.set() [3]");
				if (chrome.runtime.lastError)
					return reject(Error(chrome.runtime.lastError.message));
				else
					return resolve(true); // assume success
			})
		);
	}


}


// create global obj
const S = new Storage();


// TESTS
// S.set("test", 123);
// S.get("test");
// S.delete("test");
// S.log();


// S.getMany(["tally_user","tally_meta"]).then(result => {
// 	console.log(result);
// });
