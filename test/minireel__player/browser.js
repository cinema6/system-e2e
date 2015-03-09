(function() {
    'use strict';

    var config = require('../../config');

    var browser;
    var runLocally = process.env.RUN_LOCALLY || 'true';
    var capabilities, browserName, serverAddress, webdriver;

    if (runLocally === 'true') {
        console.log('Starting Local Tests');

        // Start the selenium server
        var SeleniumServer = require('selenium-webdriver/remote').SeleniumServer;
        var server = new SeleniumServer(config.localOptions.server.jar, config.localOptions.server.options);
        server.start();

        capabilities = config.localOptions.capabilities;
        browserName = capabilities.browserName;
        serverAddress = server.address();
        webdriver = require('selenium-webdriver');

        browser = module.exports = new webdriver.Builder()
        .withCapabilities(webdriver.Capabilities.chrome())
        .build();
        browser.browserName = 'chrome';

    } else {
        browserName = process.env.BROWSER_NAME || 'firefox';

        // Add credentials to the capabilities
        capabilities = config.browserStackOptions[browserName];
        capabilities['browserstack.user'] = process.env.BROWSERSTACK_USER;
        capabilities['browserstack.key'] = process.env.BROWSERSTACK_KEY;
        if (process.env.BROWSERSTACK_DEBUG === 'true') {
            capabilities['browserstack.debug'] = true;
        }

        serverAddress = config.browserStackOptions.server.address;
        webdriver = require('browserstack-webdriver');

        browser = module.exports = new webdriver.Builder()
        .usingServer(serverAddress)
        .withCapabilities(capabilities)
        .build();
        browser.browserName = browserName;
    }

    browser.manage().timeouts().implicitlyWait(10);

}());
