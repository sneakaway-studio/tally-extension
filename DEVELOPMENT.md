



## Development

General information and references for cross-browser extension development


### Chrome, Brave, and Opera Development Installation

1. Download and unzip the [extension](https://github.com/omprojects/tally-extension/archive/master.zip)
1. In Chrome, go to `chrome://extensions`
1. Enable Developer mode by ticking the checkbox in the upper-right corner.
1. Click on the "Load unpacked extension..." button.
1. Select the directory containing your unpacked extension.


### Firefox Development Installation

1. Open Firefox browser and navigate to `about:debugging#/runtime/this-firefox`
1. Click the "Load Temporary Add-on" button.
1. Select the directory containing your unpacked extension.
1. Then select the manifest file.


### Packaging

1. Set all `T.options` to `false`
1. Remove localhost from host permissions in manifest
1. Zip extension files (Chrome: Zip `extension/` directory; Firefox: Zip *only files inside* extension directory)
1. Rename extension zip files  
1. Run `releases/clean_zip.sh <filename>.zip` to remove all hidden files like `.DS_Store`
1. Upload to respective web stores



### Publishing

* [Chrome Web Store Developer Console](https://chrome.google.com/u/1/webstore/devconsole) - upload ZIP file
* [Opera](https://addons.opera.com/developer/) - Upload CRX
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
* [Opera Store](https://addons.opera.com/en/extensions/)
* [Developer portal](https://addons.opera.com/developer/)


### Brave Browser

* [Based on Chromium browser](https://support.brave.com/hc/en-us/articles/360017909112-How-can-I-add-extensions-to-Brave- )



### Cross-browser compatibility

* [Porting a Google Chrome extension](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Porting_a_Google_Chrome_extension)
* [Mozilla > Chrome incompatibilities](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Chrome_incompatibilities)
* [Mozilla > Browser support for JavaScript APIs](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Browser_support_for_JavaScript_APIs)
