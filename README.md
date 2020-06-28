

## Tally Saves the Internet!

![Tally](https://tallygame.net/assets/img/tally/tally-153w.png "Hi! I'm Tally.")

Tally Saves the Internet! is a browser extension that transforms the data advertisers collect into a multiplayer game.
Learn more at [tallygame.net](https://tallygame.net).


### Install the extension

* [Chrome](https://chrome.google.com/webstore/detail/tally/clidhbnhgfffjhooihemgfgmfhmojbfl)
* [Opera](https://addons.opera.com/en/extensions/) (coming soon) - currently available using Opera's [Install Chrome Extensions addon](https://addons.opera.com/en/extensions/details/install-chrome-extensions/)
* Firefox (coming soon)
* [Brave](https://chrome.google.com/webstore/detail/tally/clidhbnhgfffjhooihemgfgmfhmojbfl) - [available via Chrome Web Store](https://support.brave.com/hc/en-us/articles/360017909112-How-can-I-add-extensions-to-Brave-)




## Development


### Chrome and Opera Development Installation

1. Download and unzip the [extension](https://github.com/omprojects/tally-extension/archive/master.zip)
2. In Chrome, go to `chrome://extensions`
3. Enable Developer mode by ticking the checkbox in the upper-right corner.
4. Click on the "Load unpacked extension..." button.
5. Select the directory containing your unpacked extension.


### Firefox Development Installation

1. Open Firefox browser and navigate to `about:debugging`
2. Click the "Load Temporary Add-on" button.
3. Select the directory containing your unpacked extension.
4. Then select the manifest file.



### Options

* Some settings can be changed by clicking on the Tally icon in the top, right of your screen
* Some debugging options are available by double-clicking on Tally




### Demo Mode ("Gallery Version")

* Switch to a user account with admin privileges
* Select "Demo" in options
* If sound doesn't play automatically use [Chrome Canary](https://www.google.com/chrome/canary/) with startup flags: `/Applications/Google\ Chrome\ Canary.app/Contents/MacOS/Google\ Chrome\ Canary  --autoplay-policy=no-user-gesture-required`


### Packaging

1. Change T `options.hotreload` to `false` (prevents `hot-reload.js` from running)
2. Change T `options.localhost` to `false` (so extension uses production server)
3. Zip only files needed for extension (`assets/`,`LICENSE`,`manifest.json`,`README.md`)
4. Rename extension zip file and upload to live server


### Publishing

* [Chrome Web Store Developer Console](https://chrome.google.com/u/1/webstore/devconsole) - upload ZIP file
* Opera - Upload CRX
* Firefox - [upload ZIP of extension files themselves, not the containing directory](https://mzl.la/2r2McKv)
* Brave - uses Chrome Web Store version


### Development How-to

1. Install GIT and Github Desktop
2. Create a Github account
3. Clone the project
4. If using remote API, change T `options.localhost` to `false`
5. Install in Chrome per above instructions
6. Change options as needed in popup


### [Changelog](CHANGELOG.md)


### Dependencies

* [Mousetrap.js](https://craig.is/killing/mice)
* [Moment.js](https://momentjs.com/)
* [Anime.js](https://animejs.com/)
* [CSShake](https://elrumordelaluz.github.io/csshake/)
* [jQuery](https://jquery.com/)
* [jQuery Growl](http://ksylvest.github.io/jquery-growl/)
* [Store2](https://www.npmjs.com/package/store2)
* [Disconnect Tracking Protection](https://github.com/disconnectme/disconnect-tracking-protection)

### Notes on cross-browser compatibility

* [Porting a Google Chrome extension](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Porting_a_Google_Chrome_extension)
* [Mozilla > Chrome incompatibilities](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Chrome_incompatibilities)
* [Mozilla > Browser support for JavaScript APIs](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Browser_support_for_JavaScript_APIs)
