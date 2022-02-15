

## Tally Saves the Internet!

![Tally](https://tallysavestheinternet.com/assets/img/tally/tally-153w.png "Hi! I'm Tally.")

Tally Saves the Internet! is a browser extension that transforms the data advertisers collect into a multiplayer game.
Learn more at [tallysavestheinternet.com](https://tallysavestheinternet.com).


### Install the extension

* [Get Tally Now](https://tallysavestheinternet.com)




### Game play and options

* Check out <a href="https://tallysavestheinternet.com/how-to-play">How to Play</a> and the <a href="https://tallysavestheinternet.com/leaderboard">Leaderboard</a> to see how people are playing Tally.
* Curious about why we made Tally? Watch the <a href="https://tallysavestheinternet.com/">trailer</a>, or check out <a href="https://tallysavestheinternet.com/learn-more">Learn More</a>.
* See our <a href="https://tallysavestheinternet.com/press">Press page</a> for high-resolution images and other resources.
* Have feedback or find an issue? See the <a href="https://tallysavestheinternet.com/faq#feedback">Playtest Survey</a> and <a href="https://tallysavestheinternet.com/faq#feedback">Report-a-Bug Form</a>.
* Tally was created by <a href="https://sneakaway.studio">Sneakaway Studio</a> with the help of <a href="https://tallysavestheinternet.com/credits">many others</a>. Follow our work on <a href="https://sneakaway.studio/blog" target="_blank"> our blog </a>, <a href="https://twitter.com/SneakawayStudio" target="_blank"> Twitter </a>, <a href="https://www.instagram.com/sneakaway.studio/" target="_blank">Instagram</a>, or <a href="https://www.facebook.com/sneakawaystudio/" target="_blank">Facebook</a>
* Still have questions? Check out the <a href="https://tallysavestheinternet.com/faq">FAQ</a> or our <a href="https://tallysavestheinternet.com/privacy">Privacy Policy</a>.





### Demo Mode ("Gallery Version")
This game has a demo mode. <a href="https://sneakaway.studio">Reach out</a> if you want to exhibit this game.

Instructions
* Switch to a user account with admin privileges
* Select "Demo" in options
* If sound doesn't play automatically use [Chrome Canary](https://www.google.com/chrome/canary/) with startup flags: `/Applications/Google\ Chrome\ Canary.app/Contents/MacOS/Google\ Chrome\ Canary  --autoplay-policy=no-user-gesture-required`





### Tests


#### Functional Tests

Functional (a.k.a. "e2e") tests use [nightwatch](https://nightwatchjs.org/)

- Location: See `./__tests__/nightwatch/tests/tally-tests/*.test.js` for tests
- Documentation: [Chai BDD](https://www.chaijs.com/api/bdd/) and [Nightwatch docs](https://nightwatchjs.org/api/) for examples

```bash
# install chromedriver to match your version of chrome, for example chrome 96...
npm install chromedriver@96

cd /__tests__/nightwatch/
npm test
```


#### Unit Tests

Unit tests use [jest](https://jestjs.io/)

- Location: These only run against "pure" functions covered in `js/functions/*.test.js`

```bash
cd /__tests__/jest/
npm test
```




More on nightwatch
- https://nightwatchjs.org/
- https://www.lambdatest.com/blog/nightwatch-js-tutorial-for-test-automation-beginners/
- https://testautomationu.applitools.com/nightwatchjs-tutorial/chapter1.html
- https://blog.logrocket.com/using-nightwatch-js-to-write-end-to-end-tests/



### Other notes

* [Extension Development](DEVELOPMENT.md)
* [Changelog](CHANGELOG.md)
