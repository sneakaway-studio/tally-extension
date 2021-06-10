// import test settings
const Config = require('../tally-config.json');
const env = Config.settings.env;
const user = Config.settings.user;


var tally_user = {};

var tests = {

	'RESET user data': (browser, key) => {
		browser.perform(() => console.log('🤔', key));
		// go to dashboard
		browser.url(`${Config.env[env].host}/dashboard`).waitForElementVisible('body', 1000)
			.assert.title('Dashboard - Tally Saves the Internet!');
		// submit form
		browser.submitForm('css selector', '#reset-user-account-form').pause(2000);
		// check that data is reset
		browser.url(`${Config.env[env].host}/dashboard`).waitForElementVisible('body', 1000)
			.assert.elementPresent("#about")
			.expect.element('#about').text.to.equal('');
	},
	'CHECK tally_user #1': (browser, key) => {
		browser.perform(() => console.log('🤔', key));
		browser.execute(function() {
			var ele = document.getElementById('tally_data');
			var str = ele.getAttribute('data-tally');
			var data = JSON.parse(decodeURIComponent(str));
			return data;
		}, [], function(result) {
			// console.log('done', result);
			tally_user = result.value;
			// console.log('tally_user', tally_user);
			// assertions about state of data
			this.assert.equal(typeof tally_user, "object");
			this.assert.equal(tally_user.level, 1);
			this.assert.equal(tally_user.score.score, 0);
		});
	},
	'GO to test url': (browser, key) => {
		browser.perform(() => console.log('🤔', key));
		// go to test url
		browser.url(Config.settings.testPage).waitForElementVisible('body', 1000).pause(1000);
		// confirm extension has loaded
		browser.assert.visible('div#tally_wrapper').pause(1000);
	},
	'CLICK button on page': (browser, key) => {
		browser.perform(() => console.log('🤔', key));

		// click all the buttons on the page
		for (let i = 1; i < 7; i++){
			browser.waitForElementVisible('#btn'+i, 1000, false)
				.moveToElement('#btn'+i, 1, 1)
				.pause(2000)
				.mouseButtonClick(0, function(clickStatus) {
					// this.assert.strictEqual(clickStatus.status, 0);
					// console.log("clickStatus", clickStatus);
				});
		}
		
		browser.waitForElementVisible('#btn2', 3000, false)
			.moveToElement('#btn2', 1, 1)
			.pause(2000)
			.click('#btn2')
			.mouseButtonDown(0).mouseButtonUp(0).pause(500)
			.mouseButtonDown(0).mouseButtonUp(0).pause(500)
			.mouseButtonDown(0).mouseButtonUp(0).pause(500)
			.mouseButtonDown(0).mouseButtonUp(0).pause(500)
			.execute('scrollTo(0, 1000)').pause(500)
			.execute('scrollTo(0, 0)').pause(500)
			.assert.elementPresent("#appendTo button")
			// wait for background update to happen
			.pause(10000);

	},
	'CHECK tally_user #2': (browser, key) => {
		browser.perform(() => console.log('🤔', key));
		browser.execute(function() {
			var ele = document.getElementById('tally_data');
			var str = ele.getAttribute('data-tally');
			var data = JSON.parse(decodeURIComponent(str));
			return data;
		}, [], function(result) {
			// console.log('done', result);
			tally_user = result.value;
			console.log('tally_user.score', tally_user.score);
			// assertions about state of data
			this.assert.equal(typeof tally_user, "object");
			this.assert.ok(tally_user.level >= 2);
			this.assert.ok(tally_user.score.score >= 5);
		});
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
