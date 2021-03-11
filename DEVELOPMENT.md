



# Browser Extension Development

See [learn-javascript/topics-extensions.md](https://github.com/omundy/learn-javascript/blob/main/topics-extensions.md) for general information and references for cross-browser extension development




### Packaging

1. Set all `T.envOptions` to `false`
1. Remove localhost and `webRequest` from host permissions in manifest
1. Zip extension files (Chrome: Zip `extension/` directory; Firefox: Zip *only files inside* extension directory)
1. Rename extension zip files  
1. `cd /releases` Run `./clean_zip.sh <filename>*` to remove all hidden files like `.DS_Store`
1. Upload to respective web stores







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
