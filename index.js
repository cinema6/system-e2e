// Running this script will run e2e tests for every browser
//  listed in the env variable BROWSERS.
// BROWSERS should contain comma separated strings
//  that reference attributes in config.browstackOptions.

'use strict';

var sys = require('sys'),
    exec = require('child_process').exec,
    config = require('./tests/config');

// Announce the start of the tests
console.log('Beginning to run E2E tests on BrowserStack');

// Parse the BROWSERS environment variable
var browsers = process.env.BROWSERS || 'firefox, chrome';
console.log('using browsers:', browsers);
var browserList = browsers.split(',');
browserList = browserList.map(function(browser) {
    return browser.replace( /\s/g, "").toLowerCase();
});

// Check to see if the specified browsers exist in the config file
browserList.forEach(function(browserName) {
    if(!config.browserStackOptions[browserName]) {
        console.error('ERROR:', browserName, 'not defined in config file');
        process.exit(1);
    }
});

// For each specified browser...
browserList.forEach(function(browserName) {
    console.log(browserName.toUpperCase() + ': Starting Tests');
    exec("RUN_LOCALLY=false BROWSER_NAME=" + browserName + " mocha tests --recursive", function(error, stdout, stderr) {
    	console.log(error);
    	console.log(stdout);
    	console.log(stderr);
        console.log(browserName.toUpperCase() + ': Done Tests');
    });
});
