(function() {
    'use strict';

    var config = require('../../config');

    var browser;
    var runLocally = process.env.RUN_LOCALLY || 'true';

    if(runLocally === 'true'){
        console.log('Starting Local Tests');

        // Start the selenium server
        var SeleniumServer = require('selenium-webdriver/remote').SeleniumServer;
        var server = new SeleniumServer(config.localOptions.server.jar, config.localOptions.server.options);
        server.start();

        var capabilities = config.localOptions.capabilities;
        var browserName = capabilities.browserName;
        var serverAddress = server.address();
        var webdriver = require('selenium-webdriver');

        browser = module.exports = new webdriver.Builder()
            .withCapabilities(webdriver.Capabilities.firefox())
            .build();
        browser.browserName = 'firefox';

    }else{
        var browserName = process.env.BROWSER_NAME || 'firefox';

        // Add credentials to the capabilities
        var capabilities = config.browserStackOptions[browserName];
        capabilities['browserstack.user'] = process.env.BROWSERSTACK_USER;
        capabilities['browserstack.key'] = process.env.BROWSERSTACK_KEY;
        if(process.env.BROWSERSTACK_DEBUG === 'true') {
            capabilities['browserstack.debug'] = true;
        }

        var serverAddress = config.browserStackOptions.server.address;
        var webdriver = require('browserstack-webdriver');

        browser = module.exports = new webdriver.Builder()
            .usingServer(serverAddress)
            .withCapabilities(capabilities)
            .build();
        browser.browserName = browserName;
    }

    browser.manage().timeouts().implicitlyWait(10);

}());
