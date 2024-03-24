"use strict";

/**
 *	Import revealing module pattern as ES6 module and test using jest
 * 	run: npm test
 */

// import module
const Mod = require('./fs-environment.js');



// // getBattery() does not work on FF
// test('TEST getBattery()', async () => {
//     var { level, charging } = await Mod.getBattery();
// 	expect(level).toBeGreaterThan(0);
// });





/*************************** EXTRACT FROM URL *******************************/

// toBe() => compares value, or reference if type allows
// toEqual() => compares value only

const
	google = 'https://google.com',
	youtube = 'http://www.youtube.com/watch?v=ClkQA2Lb_iE',
	stack = 'https://stackoverflow.com/questions/8498592/extract-hostname-name-from-string',
	tracker = 'https://www.gstatic.com/og/_/js/k=og.qtm.en_US.yoD6WPnvqKw.O/rt=j/m=qabr,qgl,q_d,qdid,qcwid,qbd,qapid/exm=qaaw,qadd,qaid,qein,qhaw,qhbr,qhch,qhga,qhid,qhin,qhpr/d=1/ed=1/rs=AA2YrTsUUSONS92GNS7z5POxtVRsKo8CAg',
	mess = 'https://really.good.news.google.com:5000/news/headlines/technology.html?ned=us&hl=en#about';


// google
test(`TEST ${google}`, () => {
	const parts = Mod.extractUrl(google);
	expect(parts.protocol).toBe('https');
	expect(parts.host).toBe('google.com');
	expect(parts.domain).toEqual('google.com');
	expect(parts.sld).toEqual('google');
	expect(parts.tld).toEqual('com');
	expect(parts.port).toEqual('');
	expect(parts.query).toEqual('');
	expect(parts.filename).toEqual('');
});

// youtube
test(`TEST ${youtube}`, () => {
	const parts = Mod.extractUrl(youtube);
	expect(parts.protocol).toBe('http');
	expect(parts.host).toBe('www.youtube.com');
	expect(parts.domain).toEqual('youtube.com');
	expect(parts.sld).toEqual('youtube');
	expect(parts.tld).toEqual('com');
	expect(parts.port).toEqual('');
	expect(parts.query).toEqual('v=ClkQA2Lb_iE');
	expect(parts.filename).toEqual('');
});

// stack
test(`TEST ${stack}`, () => {
	const parts = Mod.extractUrl(stack);
	expect(parts.protocol).toBe('https');
	expect(parts.host).toBe('stackoverflow.com');
	expect(parts.domain).toEqual('stackoverflow.com');
	expect(parts.sld).toEqual('stackoverflow');
	expect(parts.tld).toEqual('com');
	expect(parts.port).toEqual('');
	expect(parts.query).toEqual('');
	expect(parts.filename).toEqual('');
});

// tracker
test(`TEST ${tracker}`, () => {
	const parts = Mod.extractUrl(tracker);
	expect(parts.protocol).toBe('https');
	expect(parts.host).toBe('www.gstatic.com');
	expect(parts.domain).toEqual('gstatic.com');
	expect(parts.sld).toEqual('gstatic');
	expect(parts.tld).toEqual('com');
	expect(parts.port).toEqual('');
	expect(parts.query).toEqual('');
	expect(parts.filename).toEqual('');
});

// mess
test(`TEST ${mess}`, () => {
	const parts = Mod.extractUrl(mess);
	expect(parts.protocol).toBe('https');
	expect(parts.host).toBe('really.good.news.google.com');
	expect(parts.domain).toEqual('google.com');
	expect(parts.sld).toEqual('google');
	expect(parts.tld).toEqual('com');
	expect(parts.port).toEqual('5000');
	expect(parts.filename).toEqual('technology.html');
	expect(parts.extension).toEqual('html');
	expect(parts.query).toEqual('ned=us&hl=en');
	expect(parts.fragment).toEqual('about');
});
