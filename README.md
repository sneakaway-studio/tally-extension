

## Tally

![Tally](https://tallygame.net/assets/img/tally-153w.png "Hi! I'm Tally.")

Tally is a browser extension that transforms the data advertisers collect into a multiplayer game. 
Learn more at [tallygame.net](https://tallygame.net).


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

* Switch to a user account w/ admin=1
* Select "Demo" in options
* If sound doesn't play automatically use (Chrome Canary)[https://www.google.com/chrome/canary/] with startup flags: `/Applications/Google\ Chrome\ Canary.app/Contents/MacOS/Google\ Chrome\ Canary  --autoplay-policy=no-user-gesture-required`


## Packaging

1. Remove (dev only) reference in manifest to `hot-reload.js`
2. Comment `development` lines in `changeMeta()` function in `assets/js/background/background-install.js`
3. Zip only files needed for extension (`assets/`,`LICENSE`,`manifest.json`,`README.md`)
4. Rename extension and upload to live server



## Development Versions

## [Changelog](CHANGELOG.md)


## Dependencies

* [Mousetrap.js](https://craig.is/killing/mice)
* [Moment.js](https://momentjs.com/)
* [Anime.js](https://animejs.com/)
* [CSShake](https://elrumordelaluz.github.io/csshake/)
* [jQuery](https://jquery.com/)
* [jQuery Growl](http://ksylvest.github.io/jquery-growl/)
* [Store2](https://www.npmjs.com/package/store2)


# Notes on cross-browser compatibility

* [Porting a Google Chrome extension](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Porting_a_Google_Chrome_extension)
* [Mozilla > Chrome incompatibilities](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Chrome_incompatibilities)
* [Mozilla > Browser support for JavaScript APIs](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Browser_support_for_JavaScript_APIs)
