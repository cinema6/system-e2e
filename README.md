# system-e2e
==========

## Running the Tests
* Install [mocha](http://visionmedia.github.io/mocha/): ```npm install mocha -g```
* Install [mocha](https://github.com/futurice/mocha-jenkins-reporter): ```npm install mocha-jenkins-reporter -g```
* Download [Selenium Server](http://docs.seleniumhq.org/download/) and specify its path in: ```test/config.json```
* Install [chromedriver](https://code.google.com/p/selenium/wiki/ChromeDriver): ```brew install chromedriver```
* Clone this repo: ```git clone git@github.com:cinema6/system-e2e.git```
* Install dependencies: ```npm install```
* Run the tests: ```mocha --recursive```
