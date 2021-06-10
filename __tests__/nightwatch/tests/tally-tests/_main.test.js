/**
 *	Import and run all test files
 */

// import test settings
const Config = require('../tally-config.json');
const env = Config.settings.env;
const user = Config.settings.user;

module.exports = {
	tags: ['tally'],

	// before all tests
	before(browser) {
		console.log(`Setting up 🦄 ${env} environment for 👤 ${user}`);

		// open browser, login
		browser.url(`${Config.env[env].host}/signin`)
			.waitForElementVisible('body', 1000)
			.waitForElementVisible('#email', 3000)
			.assert.visible('#email')
			.setValue('#email', Config.users[user].email)
			.setValue('#password', Config.users[user].password)
			// set test str for live testing
			.execute(`document.getElementById('signin').action += '?${Config.settings.testStr}';`)
			.verify.attributeContains('#signin', 'action', Config.settings.testStr)
			// submit form
			.submitForm('css selector', '#signin')
			.pause(2000);

		// confirm logged in
		browser.url(`${Config.env[env].host}/dashboard`).waitForElementVisible('body', 1000)
			.assert.title('Dashboard - Tally Saves the Internet!');

		// confirm extension has loaded
		browser.assert.visible('div#tally_wrapper').pause(1000);

		browser.windowMaximize();
	},


	// RUN TESTS

	'Interaction tests': browser => {
		require('./interaction.test.js').run(browser);
	},
	'Score tests': browser => {
		require('./score.test.js').run(browser);
	},



	// add tests for ...
	//
	// level increments
	// stats is working (click top bars, check both bottom bars and numbers are present and math is close)
	// cycle through a dialogue
	// eyes move
	// tally works on other urls
	// battle works (refresh test page until monster appears, click to initiate battle)





	// clean up after tests
	after(browser) {
		console.log('Tearing down...');
		setTimeout(() => {
			browser.end();
		}, 400);
	}
};
