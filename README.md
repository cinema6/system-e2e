# system-e2e
==========

## Dependencies
* Install [mocha](http://visionmedia.github.io/mocha/): ```npm install mocha -g```
* Install [mocha-jenkins-reporter](https://github.com/futurice/mocha-jenkins-reporter): ```npm install mocha-jenkins-reporter -g```
* Clone this repo: ```git clone git@github.com:cinema6/system-e2e.git```
* Install dependencies: ```npm install```

## Running the Tests Locally
* Download [Selenium Server](http://docs.seleniumhq.org/download/) and specify its path in: ```test/config.json```
* Install [chromedriver](https://code.google.com/p/selenium/wiki/ChromeDriver): ```brew install chromedriver```
* Set the path to which the report will be saved: ```export JUNIT_REPORT_PATH=./reports/report.xml```
* Run the tests: ```mocha --recursive```

## Running the Tests on Browserstack
* Set up the following environment variables described below
* Run the tests: ```node index```

| Variable          | Description               | Default                   |
| ----------------- | ------------------------- | -----------------------   |
| BROWSERSTACK_USER | BrowserStack user id      | null                      |
| BROWSERSTACK_KEY  | BrowserStack api key      | null                      |
| BROWSERS          | The browsers to test on   | firefox, chrome, explorer |