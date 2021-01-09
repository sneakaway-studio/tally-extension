



## Browser Extension Development

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

1. Set all `T.envOptions` to `false`
1. Remove localhost and `webRequest` from host permissions in manifest
1. Zip extension files (Chrome: Zip `extension/` directory; Firefox: Zip *only files inside* extension directory)
1. Rename extension zip files  
1. `cd /releases` Run `./clean_zip.sh <filename>*` to remove all hidden files like `.DS_Store`
1. Upload to respective web stores



### Publishing

* [Chrome Web Store Developer Console](https://chrome.google.com/u/1/webstore/devconsole) - upload ZIP file
* [Opera](https://addons.opera.com/developer/) - Upload CRX
* Firefox - [upload ZIP of extension files themselves, not the containing directory](https://mzl.la/2r2McKv)
* Brave - uses Chrome Web Store version



## Notable Example Extensions

- Add-Art [source](https://github.com/coreytegeler/add-art-chrome/)
- [Catblock](https://getcatblock.com/)
- Adblock [source](http://code.getadblock.com/releases/)

## Platform References & Notes


### Cross-browser compatibility

* [Porting a Google Chrome extension](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Porting_a_Google_Chrome_extension)
* [Mozilla > Chrome incompatibilities](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Chrome_incompatibilities)
* [Mozilla > Browser support for JavaScript APIs](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Browser_support_for_JavaScript_APIs)



### Browsers

- Chrome (Chromium) - [download](https://www.google.com/chrome/)
- Chromium - [download](https://www.chromium.org/getting-involved/download-chromium)
- Firefox - [Addons Store](https://addons.mozilla.org/en-US/firefox/), [Developer Hub](https://addons.mozilla.org/en-US/developers/), [Documentation](https://extensionworkshop.com/)
- Opera (Chromium) - [Opera Store](https://addons.opera.com/en/extensions/), [Developer portal](https://addons.opera.com/developer/)
- Brave ([Chromium](https://support.brave.com/hc/en-us/articles/360017909112-How-can-I-add-extensions-to-Brave-))



## Tips for building extensions

### CSS

CSS from web pages will affect ("pollute") display properties in your extension, often messing up your own styling. For example, if this rule is set on a page your extension (html that you show in the content scripts) will inherit it:
```css
p { color: red; }
```
To make sure your code doesn't inherit page styles (listed in increasing potential to protect your own styles):
- Use uncommon class and id names. This works unless the styling rules are applied very broadly (like above).
- Wrap all your code within a unique class or id.
- Using `!important` on all your rules.
- Explicitly set a default for every property within your extension.

```css
#uniquePrefix p { color: black !important; }
```








## Libraries used in Tally

Links to official versions of our libraries (required for Firefox Addon review)

```
https://github.com/juliangarnier/anime/blob/3.2.0/lib/anime.min.js
https://github.com/jquery/jquery/blob/3.2.1/build/release/dist.js
https://jqueryui.com/download/all/
https://github.com/moment/moment/blob/2.29.0/moment.js
https://github.com/ccampbell/mousetrap/blob/1.6.2/mousetrap.min.js
https://github.com/adamwdraper/Numeral-js/blob/2.0.6/numeral.js
https://github.com/nbubna/store/blob/2.12.0/dist/store2.min.js


```
