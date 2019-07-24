

## Tally

![Tally](https://tallygame.net/assets/img/tally-153w.png "Hi! I'm Tally.")

Tally is a browser extension that uses AI to transform the data advertisers collect into a multiplayer game.
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




## Packaging

1. Remove (dev only) reference in manifest to `hot-reload.js`
2. Comment `development` lines in `changeMeta()` function in `assets/js/background/background-install.js`
3. Zip only files needed for extension (`assets/`,`LICENSE`,`manifest.json`,`README.md`)
4. Rename extension and upload to live server



## Development Versions



### Version 0.2.8

* Fixes monster sprite flip bug


### Version 0.2.7

* Fixes issues with battle logic
* Adds testing game mode

### Version 0.2.6

* Rewrites backend updates to improve asynchronous communication w/ API
* Creates a queueing system so many changes on ext. / API can be staged before sending to lower traffic / processing
* Adds flags from / to ext. and server so message passing can happen more easily
* Standardizes communication of "items" with server/database
* Moves master to server so game progress is saved across installations
* ^ This allows addition of "delete data" function on dashboard so players can delete / reset their data

### Version 0.2.5

* Improvements to dialogue system
* Adds more monsters and attacks

### Version 0.2.4

* Fixes leveling issues
* Fixes battle stats display
* Adds more monsters and attacks
* Adds distinction in battle options for attack v. defense buttons

### Version 0.2.3

* Fixes many issues with battle math
* Adds battle music
* Adds more monsters and attacks

### Version 0.2.2

* Adds nearly complete battle system
* Adds badges
* Adds more monsters and attacks

### Version 0.2.1

* Fixes various installation issues
* Adds installation progress framework
* Adds more monsters and attacks

### Version 0.2.0

* Adds beginning of turn-based RPG battle system with console, explosions, etc.
* Adds consumables (cookies, data junk, etc.)
* Adds new logging system to Tally Dialogues
* Rewrite of Stats manager
* Lots of small bug fixes and improvements

### Version 0.1.4

* Many bug fixes (sound, battles, monsters)
* Adds double click debug menu option
* Adds features to monster battle

### Version 0.1.3

* Monster update
* Auth flow and other bug fixes

### Version 0.1.2

* Adds sound volume range slider to options
* Adds functions for progressive tracker blocking
* Other bug fixes

### Version 0.1.1

* Development version from Spring 2018 Digital Studies "Humanities Startup" course



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
