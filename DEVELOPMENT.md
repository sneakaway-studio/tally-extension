



## Development

General information and references for cross-browser extension development


### Chrome, Brave, and Opera Development Installation

1. Download and unzip the [extension](https://github.com/omprojects/tally-extension/archive/master.zip)
2. In Chrome, go to `chrome://extensions`
3. Enable Developer mode by ticking the checkbox in the upper-right corner.
4. Click on the "Load unpacked extension..." button.
5. Select the directory containing your unpacked extension.


### Firefox Development Installation

1. Open Firefox browser and navigate to `about:debugging#/runtime/this-firefox`
2. Click the "Load Temporary Add-on" button.
3. Select the directory containing your unpacked extension.
4. Then select the manifest file.


### Packaging

1. Change `T.options.hotreload` to `false` (prevents `hot-reload.js` from running)
2. Change `T.options.localhost` to `false` (so extension uses production server)
3. Zip the extension
    1. Chrome: Zip `extension/` directory
    2. Firefox:
        1. Remove localhost from host permissions in manifest
        2. Zip only files *inside* extension directory (`assets/` and `manifest.json`)
        3. Run `releases/clean_zip.sh file.zip` to remove all hidden files like `.DS_Store`
4. Rename extension zip file and upload to respective web stores



### Publishing

* [Chrome Web Store Developer Console](https://chrome.google.com/u/1/webstore/devconsole) - upload ZIP file
* Opera - Upload CRX
* Firefox - [upload ZIP of extension files themselves, not the containing directory](https://mzl.la/2r2McKv)
* Brave - uses Chrome Web Store version


## Platform References & Notes



### Chrome Browser

* [Download](https://www.google.com/chrome/)


### Chromium Browser

* [Download](https://www.chromium.org/getting-involved/download-chromium)



### Firefox Browser

* [Addons Store](https://addons.mozilla.org/en-US/firefox/)
* [Developer Hub](https://addons.mozilla.org/en-US/developers/)
* [Documentation](https://extensionworkshop.com/)


### Opera Browser

* Based on Chromium browser
* [Developer portal](https://addons.opera.com/developer/)


### Brave Browser

* [Based on Chromium browser](https://support.brave.com/hc/en-us/articles/360017909112-How-can-I-add-extensions-to-Brave- )



### Cross-browser compatibility

* [Porting a Google Chrome extension](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Porting_a_Google_Chrome_extension)
* [Mozilla > Chrome incompatibilities](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Chrome_incompatibilities)
* [Mozilla > Browser support for JavaScript APIs](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Browser_support_for_JavaScript_APIs)
