// Running this script will run e2e tests for every browser
//  listed in the env variable BROWSERS.
// BROWSERS should contain comma separated strings
//  that reference attributes in config.browstackOptions.

'use strict';

var BrowserStack = require( "browserstack" ),
    spawn = require('child_process').spawn,
    Q = require('q'),
    Queue = require('madlib-promise-queue'),
    chain = require('./utils/promise').chain,
    config = require('./test/config');

// Setup the connection to BrowserStack to monitor running running workers
var client = BrowserStack.createClient({
    username: process.env.BROWSERSTACK_USER,
    password: process.env.BROWSERSTACK_KEY
});

// Announce the start of the tests
console.log('Beginning to run E2E tests on BrowserStack');
console.log('Results will be displayed AFTER the tests have completed');

// Parse the BROWSERS environment variable
var browsers = process.env.BROWSERS || 'firefox, chrome, explorer';
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

// Run the tests for all the specified browsers
getStatus()
.then(function(status) {
    // Make sure there are no sessions currently running
	if(status.running_sessions > 0) {
		console.error('ERROR: there are sessions currently running in BrowserStack');
		process.exit(1);
	}
	console.log('There is a limit of', status.sessions_limit, 'concurrent sessions.');
    var queue = new Queue(status.sessions_limit);
    return Q.all(browserList.map(function(browserName) {
    	return queue.ready()
    		.then(function() {
    			console.log(browserName.toUpperCase() + ': Starting Tests');
    			return runTestsForBrowser(browserName);
    		})
    		.then(function() {
    			console.log(browserName.toUpperCase() + ': Tests Complete');
    			queue.ready();
    			queue.done();
    		});
    }));
})
.catch(function(error) {
	console.error('ERROR:', error);
	process.exit(1);
})
.done();

// Gets the current status of BrowserStack
function getStatus() {
	var deferred = Q.defer();
	client.getApiStatus(function(error, status) {
		if(error){
			deferred.reject(new Error(error));
		}else{
			deferred.resolve(status);
		}
	});
	return deferred.promise;
}

// Spawn a mocha child process. Resolving this promise means that BrowserStack
//  is ready for a new test to begin to run.
function runTestsForBrowser(browserName) {
	var deferred = Q.defer();
    var cmd = 'mocha';
    var args = ['--recursive'];
    var options = {
        stdio: 'inherit',
        env: {
            RUN_LOCALLY: false,
            BROWSER_NAME: browserName,
            BROWSERSTACK_USER: process.env.BROWSERSTACK_USER,
            BROWSERSTACK_KEY: process.env.BROWSERSTACK_KEY,
            JUNIT_REPORT_PATH: 'report.xml'
        }
    };
    var child = spawn(cmd, args, options);
    child.on('close', function (code) {
        Q.delay(10000)
        .then(function() {
            return deferred.resolve();
        });
    });
    return deferred.promise;
}
