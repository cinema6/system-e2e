// Running this script will run e2e tests for every browser
//  listed in the env variable BROWSERS.
// BROWSERS should contain comma separated strings
//  that reference attributes in config.browstackOptions.

'use strict';

var BrowserStack = require("browserstack"),
spawn = require('child_process').spawn,
fs = require('fs'),
Q = require('q'),
Queue = require('madlib-promise-queue'),
chain = require('./utils/promise').chain,
promiseWhile = require('./utils/promise').promiseWhile,
config = require('./config.json');

var secrets;

// Check if the secrets file exists
if (fs.existsSync('./.browserstack_secrets.json')) {
    secrets = require('./.browserstack_secrets.json');
} else {
    secrets = {
        "browserstack": {}
    };
}

// Aquire the neccessary BrowserStack credentials
var browserStackUser = process.env.BROWSERSTACK_USER || secrets.browserstack.user,
browserStackKey = process.env.BROWSERSTACK_KEY || secrets.browserstack.key;

// Setup the connection to BrowserStack to monitor running workers
var client = BrowserStack.createClient({
    username: browserStackUser,
    password: browserStackKey
});

// Announce the start of the tests
console.log('Beginning to run E2E tests on BrowserStack');
console.log('Output from concurrently running tests may be mixed.');

// Parse the BROWSERS environment variable
var browsers = process.env.BROWSERS || 'firefox, chrome, explorer';
console.log('using browsers:', browsers);
var browserList = browsers.split(',');
browserList = browserList.map(function(browser) {
    return browser.replace(/\s/g, "").toLowerCase();
});

// Check to see if the specified browsers exist in the config file
browserList.forEach(function(browserName) {
    if (!config.browserStackOptions[browserName]) {
        console.error('ERROR:', browserName, 'not defined in config file');
        process.exit(1);
    }
});

// Array of players to test
var playerList = ['light', 'lightbox'];

// Array of tests to be run
var testList = [];
browserList.forEach(function(browser) {
    playerList.forEach(function(player) {
        testList.push({
            browser: browser,
            player: player
        });
    });
});

// Record the starting time of the tests
var startDate = new Date();
var startTime = startDate.getTime();

// Run the tests for all the specified browsers
getStatus()
.then(function(status) {
    // Make sure there are no sessions currently running
    if (status.running_sessions > 0) {
        throw new Error('ERROR: there are ' + status.running_sessions + ' sessions currently running in BrowserStack');
    }

    // Output the maximum number of concurrent sessions allowed
    console.log('There is a limit of', status.sessions_limit, 'concurrent sessions.');

    // Setup up the promise queue
    var queue = new Queue(status.sessions_limit);
    return Q.allSettled(testList.map(function(test) {
        return queue.ready()
        .then(waitForSpot)
        .then(function() {
            console.log(test.browser.toUpperCase() + ' ' + test.player.toUpperCase() + ': Starting Tests');
            return runTestsForBrowser(test.browser, test.player);
        })
        .then(function() {
            console.log(test.browser.toUpperCase() + ' ' + test.player.toUpperCase() + ': Tests Complete');
            queue.done();
        })
        .catch(function(error) {
            console.log(test.browser.toUpperCase() + ' ' + error);
            queue.done();
            throw new Error(error);
        });
    }));

})
.then(function(results) {

    // Check the results of each promise in the promise queue
    results.forEach(function(result) {
        if (result.state === "rejected") {
            throw new Error(result.state.reason);
        }
    });

})
.catch(function(error) {

    // Handle errors from any of the previous steps
    console.error(error);
    process.exit(1);

})
.done();

// Gets the current status of BrowserStack
function getStatus() {
    var deferred = Q.defer();
    client.getApiStatus(function(error, status) {
        if (error) {
            deferred.reject(new Error(error));
        } else {
            deferred.resolve(status);
        }
    });
    return deferred.promise;
}

// Waits until a spot frees up to run tests on another browser
function waitForSpot() {
    var spotAvailable = false;
    return promiseWhile(function() {
        return !spotAvailable;
    }, function() {
        return getStatus()
        .then(function(status) {
            if (status.running_sessions < status.sessions_limit) {
                spotAvailable = true;
            } else {
                return Q.delay(10000);
            }
        });
    });
}

// Spawn a mocha child process. Resolving this promise means that BrowserStack
//  is ready for a new test to begin to run.
function runTestsForBrowser(browserName, playerName) {
    var deferred = Q.defer();
    var cmd = 'mocha';
    var args = ['test/minireel__player/setup-teardown.js', 'test/minireel__player/' + playerName];
    var options = {
        stdio: 'inherit',
        env: {
            PATH: process.env.PATH,
            RUN_LOCALLY: false,
            BROWSER_NAME: browserName,
            BROWSERSTACK_USER: browserStackUser,
            BROWSERSTACK_KEY: browserStackKey,
            BROWSERSTACK_DEBUG: process.env.BROWSERSTACK_DEBUG,
            JUNIT_REPORT_PATH: ('./reports/' + browserName + '_' + playerName + '_report.xml')
        }
    };
    var child = spawn(cmd, args, options);
    child.on('exit', function(code) {
        if (code === 0) {
            deferred.resolve();
        } else {
            deferred.reject(new Error('Mocha process exited with error code ' + code));
        }
    });
    return deferred.promise;
}

// Log the status code when the process ends
process.on('exit', function(code) {
    if (code === 0) {
        var endDate = new Date();
        var endTime = endDate.getTime();
        var totalTime = endTime - startTime;
        var totalMinutes = totalTime / 1000 / 60;
        console.log('Tests completed in ' + totalMinutes.toFixed(2) + ' minutes');
    }
    console.log('process ended with code ', code);
});
