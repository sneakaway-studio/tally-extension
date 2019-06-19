

## Tally

![Tally](https://tallygame.net/assets/img/tally-153w.png "Hi! I'm Tally.")

Tally is a browser extension that uses AI to transform the data advertisers collect into a multiplayer game. Learn more at [tallygame.net](https://tallygame.net).


### Chrome and Opera Development Installation

1. Download and unzip the [extension](https://github.com/omprojects/tally-extension/archive/master.zip)
2. In Chrome, go to ```chrome://extensions```
3. Enable Developer mode by ticking the checkbox in the upper-right corner.
4. Click on the "Load unpacked extension..." button.
5. Select the directory containing your unpacked extension.


### Firefox Development Installation

1. Open Firefox browser and navigate to ```about:debugging```
2. Click the "Load Temporary Add-on" button.
3. Select the directory containing your unpacked extension.
4. Then select the manifest file.



### Options

* Some settings can be changed by clicking on the Tally icon in the top, right of your screen
* Some debugging options are available by double-clicking on Tally




## Packaging

1. Remove reference in manifest to `hot-reload.js`
2. Remove image files not being used (e.g. `assets/img/monsters-400h/`)



## Development Versions


### Version 0.2.1

* Fixes various installation issues
* Adds installation tutorial framework

### Version 0.2.0

* Adds beginning of turn-based RPG battle system with console, explosions, etc.
* Adds consumables (cookies, data junk, etc.)
* Adds new logging system to Tally Thoughts
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
