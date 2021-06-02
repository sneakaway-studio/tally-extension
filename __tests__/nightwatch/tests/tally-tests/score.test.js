// import test settings
const Config = require('../tally-config.json');
const env = Config.settings.env;
const user = Config.settings.user;

var tests = {

	'RESET user data': (browser, key) => {
		browser.perform(() => console.log('🤔', key));
		// go to dashboard
		browser.url(`${Config.env[env].host}/dashboard`).waitForElementVisible('body', 1000)
			.assert.title('Dashboard - Tally Saves the Internet!');

		// // add email to delete data button
		// browser.moveToElement('#reset-confirm-email', 1, 1)
		// 	.waitForElementVisible('#reset-confirm-email', 3000)
		// 	.assert.visible('#reset-confirm-email')
		// 	.setValue('#reset-confirm-email', Config.users[user].email)
		// 	.pause(1000);
		//
		// browser.expect.element('#reset-confirm-email').to.have.value.that.equals(Config.users[user].email);

		// submit form
		browser.submitForm('css selector', '#reset-user-account-form').pause(2000);

		browser.url(`${Config.env[env].host}/dashboard`).waitForElementVisible('body', 1000)
			.assert.elementPresent("#about")
			.expect.element('#about').text.to.equal('');


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
