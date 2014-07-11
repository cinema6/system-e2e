var sys = require('sys'),
    exec = require('child_process').exec,
    config = require('./tests/config');

if(config.runLocally) {
	console.log('This command is for testing on browserstack only.');
} else {
	var numBrowsers = config.browserStackOptions.browsers.length;
	for(var i = 0; i < 2; i++) {
	    exec("BROWSER_INDEX=" + i + " mocha tests --recursive", function(error, stdout, stderr) {
	    	console.log(stdout);
	    });
	}
}

