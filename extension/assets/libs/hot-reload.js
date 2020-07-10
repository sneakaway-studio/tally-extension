"use strict";

/**
 *  Chrome Extension Hot Reload https://github.com/xpl/crx-hotreload
 *  Automatically refreshes chrome://extensions and current tab after save (for development)
 */

const filesInDirectory = dir => new Promise(resolve =>
	dir.createReader().readEntries(entries =>
		Promise.all(entries.filter(e => e.name[0] !== '.').map(e =>
			e.isDirectory ?
			filesInDirectory(e) :
			new Promise(resolve => e.file(resolve))
		))
		.then(files => [].concat(...files))
		.then(resolve)
	)
);

const timestampForFilesInDirectory = dir =>
	filesInDirectory(dir).then(files =>
		files.map(f => f.name + f.lastModifiedDate).join());

const reload = () => {
	chrome.tabs.query({
		active: true,
		currentWindow: true
	}, tabs => {
		if (tabs[0]) {
			chrome.tabs.reload(tabs[0].id);
		}
		chrome.runtime.reload();
	});
};

const watchChanges = (dir, lastTimestamp) => {
	timestampForFilesInDirectory(dir).then(timestamp => {
		if (!lastTimestamp || (lastTimestamp === timestamp)) {
			// retry after 1s
			setTimeout(() => watchChanges(dir, timestamp), 1000);
		} else {
			if (!document.location.href.includes("docs.google.com")) {
				if (T.options.hotreload) {
					console.log(T.options, "RELOADING!!!!");
					reload();
				}
			}
		}
	});
};

chrome.management.getSelf(self => {
	console.log(self);
	if (self.installType === 'development') {
        if (browserName() === "Chrome")
            chrome.runtime.getPackageDirectoryEntry(dir => watchChanges(dir));
	}
});



function browserName() {
	if ((navigator.userAgent.indexOf("Opera") || navigator.userAgent.indexOf('OPR')) != -1) {
		return 'Opera';
	} else if (navigator.userAgent.indexOf("Chrome") != -1) {
		return 'Chrome';
	} else if (navigator.userAgent.indexOf("Safari") != -1) {
		return 'Safari';
	} else if (navigator.userAgent.indexOf("Firefox") != -1) {
		return 'Firefox';
	} else if ((navigator.userAgent.indexOf("MSIE") != -1) || (!!document.documentMode == true)) {
		return 'IE';
	} else {
		return 'unknown';
	}
}
