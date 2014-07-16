(function() {
    'use strict';

    var config = require('../../config');

    var browser;
    var runLocally = process.env.RUN_LOCALLY || 'true';

    var capabilities;
    var browserName;
    var serverAddress;
    var webdriver;

    if(runLocally === 'true'){
        console.log('Starting Local Tests');

        // Start the selenium server
        var SeleniumServer = require('selenium-webdriver/remote').SeleniumServer;
        var server = new SeleniumServer(config.localOptions.server.jar, config.localOptions.server.options);
        server.start();

        capabilities = config.localOptions.capabilities;
        browserName = capabilities.browserName;
        serverAddress = server.serverAddress
        webdriver = require('selenium-webdriver');
    }else{
        browserName = process.env.BROWSER_NAME || 'firefox';

        // Add credentials to the capabilities
        capabilities = config.browserStackOptions[browserName];
        capabilities['browserstack.user'] = process.env.BROWSERSTACK_USER;
        capabilities['browserstack.key'] = process.env.BROWSERSTACK_KEY;

        serverAddress = config.browserStackOptions.server.address;
        webdriver = require('browserstack-webdriver');
    }

    browser = module.exports = new webdriver.Builder()
        .usingServer(serverAddress)
        .withCapabilities(capabilities)
        .build();
    browser.browserName = browserName;
    browser.manage().timeouts().implicitlyWait(10);

}());