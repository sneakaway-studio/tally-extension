// import test user
const Config = require('../tally-config.json');
const env = Config.environment;
const user = Config.user;

module.exports = {
	tags: ['tally'],

	// this is a new browser instance, so we have to login first
	before(browser) {
		console.log(`Setting up 🦄 ${env} environment for 👤 ${user}`);

		// 1. open browser, login
		browser.url(Config.environments[env].signin)
			.waitForElementVisible('body', 1000)
			.waitForElementVisible('#email', 3000)
			.assert.visible('#email')
			.setValue('#email', Config.users[user].email)
			.setValue('#password', Config.users[user].password)
			.submitForm('css selector', '#signin')
			.pause(2000);

		// 2. go to test url
		browser.url(Config.environments[env].testPage)
			.waitForElementVisible('body', 1000)
			.assert.title('Tally test page (title)')
			.pause(1000);

		// 3. confirm extension has loaded
		browser.assert.visible('div#tally_wrapper').pause(1000);
	},


	// 4. begin tests

	'CLICK button on page, .tally-clicked class present after': (browser) => {
		browser.waitForElementVisible('#btn1', 3000, false).click('#btn1')
			.assert.cssClassPresent('#btn1', 'tally-clicked');
	},
	'CLICK character (single), speech bubble is present': (browser) => {
		browser.moveToElement('#tally_character', 30, 30).click('#tally_character')
			.assert.elementPresent("#tally_dialogue_outer");
	},
	'CLICK character (double), speech bubble contains "menu" prompt': (browser) => {
		browser.moveToElement('#tally_character', 30, 30).doubleClick('#tally_character')
			.assert.elementPresent("#tally_dialogue_outer")
			.expect.element('#tally_dialogue_inner').text.to.startWith('Want to hear');
	},
	'CLICK character (triple), speech bubble contains joke prompt': (browser) => {
		browser.moveToElement('#tally_character', 30, 30)
			.mouseButtonDown(0).mouseButtonUp(0)
			.mouseButtonDown(0).mouseButtonUp(0)
			.mouseButtonDown(0).mouseButtonUp(0).pause(200)
			.assert.elementPresent("#tally_dialogue_outer")
			.expect.element('#tally_dialogue_inner').text.to.startWith('Want to hear a joke');
	},
	'DRAG character, dialogue is present': (browser) => {
		browser.moveToElement('#tally_character', 30, 30)
			// drag character up to verify stats
			.mouseButtonDown(0).moveTo(null, 0, -300).mouseButtonUp(0)
			.pause(200)
			.assert.elementPresent("#tally_dialogue_outer");
	},


	// add tests for ...
	//
	// score increments
	// stats is working (click top bars, check both bottom bars and numbers are present and math is close)
	// cycle through a dialogue 
	// eyes move
	// tally works on other urls
	// battle works (refresh test page until monster appears, click to initiate battle)
	// tags present


	// clean up after tests
	after(browser) {
		console.log('Tearing down...');
		setTimeout(() => {
			browser.end();
		}, 400);
	}
};
