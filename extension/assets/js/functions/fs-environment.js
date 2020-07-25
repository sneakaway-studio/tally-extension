"use strict";

var Environment = (function() {
	// PRIVATE

	async function getBrowserName() {
		try {
			// check brave, then opera first
			if (navigator.brave && await navigator.brave.isBrave()) {
				return "Brave";
			} else if (navigator.userAgent.match(/Opera|OPR\//)) {
				return "Opera";
			} else if (navigator.userAgent.indexOf("Chrome") != -1) {
				return "Chrome";
			} else if (navigator.userAgent.indexOf("MSIE") != -1) {
				return "IE";
			} else if (navigator.userAgent.indexOf("Firefox") != -1) {
				return "Firefox";
			} else {
				return false;
			}
		} catch (err) {
			console.error(err);
		}
	}


	function getBrowserLanguage(){
		let lang = "";
		if (navigator.languages.length > 0)
			lang = navigator.languages[0];
		return lang;
	}
	function getPlatform(){
		let os = navigator.platform || "",
			nAgt = navigator.userAgent;
		var clientStrings = [
                { s: 'Windows 3.11', r: /Win16/ },
                { s: 'Windows 95', r: /(Windows 95|Win95|Windows_95)/ },
                { s: 'Windows ME', r: /(Win 9x 4.90|Windows ME)/ },
                { s: 'Windows 98', r: /(Windows 98|Win98)/ },
                { s: 'Windows CE', r: /Windows CE/ },
                { s: 'Windows 2000', r: /(Windows NT 5.0|Windows 2000)/ },
                { s: 'Windows XP', r: /(Windows NT 5.1|Windows XP)/ },
                { s: 'Windows Server 2003', r: /Windows NT 5.2/ },
                { s: 'Windows Vista', r: /Windows NT 6.0/ },
                { s: 'Windows 7', r: /(Windows 7|Windows NT 6.1)/ },
                { s: 'Windows 8.1', r: /(Windows 8.1|Windows NT 6.3)/ },
                { s: 'Windows 8', r: /(Windows 8|Windows NT 6.2)/ },
                { s: 'Windows NT 4.0', r: /(Windows NT 4.0|WinNT4.0|WinNT|Windows NT)/ },
                { s: 'Windows ME', r: /Windows ME/ },
                { s: 'Android', r: /Android/ },
                { s: 'Open BSD', r: /OpenBSD/ },
                { s: 'Sun OS', r: /SunOS/ },
                { s: 'Linux', r: /(Linux|X11)/ },
                { s: 'iOS', r: /(iPhone|iPad|iPod)/ },
                { s: 'Mac OS X', r: /Mac OS X/ },
                { s: 'Mac OS', r: /(MacPPC|MacIntel|Mac_PowerPC|Macintosh)/ },
                { s: 'QNX', r: /QNX/ },
                { s: 'UNIX', r: /UNIX/ },
                { s: 'BeOS', r: /BeOS/ },
                { s: 'OS/2', r: /OS\/2/ },
                { s: 'Search Bot', r: /(nuhk|Googlebot|Yammybot|Openbot|Slurp|MSNBot|Ask Jeeves\/Teoma|ia_archiver)/ }
            ];
		for (var id in clientStrings) {
			if (clientStrings.hasOwnProperty(id)) {
				var cs = clientStrings[id];
				if (cs.r.test(nAgt)) {
					os = cs.s;
					break;
				}
			}
		}
		// get osVersion
		var osVersion = "";
		if (/Windows/.test(os)) {
			osVersion = /Windows (.*)/.exec(os)[1];
			os = 'Windows';
		}
		switch (os) {
			case 'Mac OS X':
				osVersion = /Mac OS X (10[\.\_\d]+)/.exec(nAgt)[1];
				break;

			case 'Android':
				osVersion = /Android ([\.\_\d]+)/.exec(nAgt)[1];
				break;

			case 'iOS':
				osVersion = /OS (\d+)_(\d+)_?(\d+)?/.exec(nAgt);
				osVersion = osVersion[1] + '.' + osVersion[2] + '.' + (osVersion[3] | 0);
				break;
		}
		return os +" "+ osVersion;
	}



	/* DOMAINS */

	/**
	 *	Return entire name from URL
	 */
	function extractHostname(url) {
		//console.log("extractHostname()",url);
		var hostname;
		//find & remove protocol (http, ftp, etc.) and get hostname

		if (url.indexOf("://") > -1) {
			hostname = url.split('/')[2];
		} else {
			hostname = url.split('/')[0];
		}

		//find & remove port number
		hostname = hostname.split(':')[0];
		//find & remove "?"
		hostname = hostname.split('?')[0];
		//console.log("extractHostname() hostname =",hostname);
		return hostname;
	}

	/**
	 *	Return just the domain and TLD name
	 */
	function extractRootDomain(url) {
		//console.log("extractRootDomain()",url);
		if (url == "") return "";
		var domain = extractHostname(url),
			splitArr = domain.split('.'),
			arrLen = splitArr.length;


		//extracting the root domain here
		if (arrLen > 2) {
			domain = splitArr[arrLen - 2] + '.' + splitArr[arrLen - 1];
		}
		//console.log("extractRootDomain() domain =",domain);
		return domain;
	}

	function extractSubDomain(url) {
		//console.log("extractSubDomain()");
		if (url == "") return "";
		var domain = extractHostname(url);
		return domain;
	}

	// PUBLIC
	return {
		getBrowserName: getBrowserName,
		getBrowserLanguage: getBrowserLanguage,
		getPlatform: getPlatform,
		extractHostname: function(url){
			return extractHostname(url);
		},
		extractRootDomain: function(url){
			return extractRootDomain(url);
		},
		extractSubDomain: function(url){
			return extractSubDomain(url);
		},

	};
})();
