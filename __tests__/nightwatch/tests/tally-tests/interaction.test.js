// import test settings
const Config = require('../tally-config.json');
const env = Config.settings.env;
const user = Config.settings.user;

var tests = {

	'GO to test url': (browser, key) => {
		browser.perform(() => console.log('🤔', key));
		// go to test url
		browser.url(Config.settings.testPage).waitForElementVisible('body', 1000)
			.pause(1000);
		// confirm extension has loaded
		browser.assert.visible('div#tally_wrapper').pause(1000);
	},
	'CLICK button on page, .tally-clicked class present after': (browser, key) => {
		browser.perform(() => console.log('🤔', key));
		browser.waitForElementVisible('#btn1', 3000, false).click('#btn1')
			.assert.cssClassPresent('#btn1', 'tally-clicked');
	},
	'CLICK character (single), speech bubble is present': (browser, key) => {
		browser.perform(() => console.log('🤔', key));
		browser.moveToElement('#tally_character', 30, 30).click('#tally_character')
			.assert.elementPresent("#tally_dialogue_outer");
	},
	'CLICK character (double), speech bubble contains "menu" prompt': (browser, key) => {
		browser.perform(() => console.log('🤔', key));
		browser.moveToElement('#tally_character', 30, 30).doubleClick('#tally_character')
			.assert.elementPresent("#tally_dialogue_outer")
			.expect.element('#tally_dialogue_inner').text.to.startWith('Want to hear');
	},
	'CLICK character (triple), speech bubble contains joke prompt': (browser, key) => {
		browser.perform(() => console.log('🤔', key));
		browser.moveToElement('#tally_character', 30, 30)
			.mouseButtonDown(0).mouseButtonUp(0)
			.mouseButtonDown(0).mouseButtonUp(0)
			.mouseButtonDown(0).mouseButtonUp(0).pause(200)
			.assert.elementPresent("#tally_dialogue_outer")
			.expect.element('#tally_dialogue_inner').text.to.startWith('Want to hear a joke');
	},
	'DRAG character, dialogue is present': (browser, key) => {
		browser.perform(() => console.log('🤔', key));
		browser.moveToElement('#tally_character', 30, 30)
			// drag character up to verify stats
			.mouseButtonDown(0).moveTo(null, 0, -300).mouseButtonUp(0)
			.pause(200)
			.assert.elementPresent("#tally_dialogue_outer");
	},
};

module.exports = {
	'@disabled': true, // allow nightwatch to run test module only inside _main
	'run': browser => {
		// call all functions inside tests
		for (const [key, f] of Object.entries(tests)) {
			if (typeof f === 'function') f(browser, key);
		}
	}
};
