(function() {
    'use strict';

    var config = require('../config');

    var browser;
    var runLocally = process.env.RUN_LOCALLY || 'true';

    if(runLocally === 'true'){
        var webdriver = require('selenium-webdriver');
        var SeleniumServer = require('selenium-webdriver/remote').SeleniumServer;
        var server = new SeleniumServer(config.localOptions.server.jar, config.localOptions.server.options);
        server.start();
        browser = module.exports = new webdriver.Builder()
            .usingServer(server.address())
            .withCapabilities(config.localOptions.capabilities)
            .build();
    }else{
        var webdriver = require('browserstack-webdriver');
        var browserName = process.env.BROWSER_NAME || 'firefox';

        // Add credentials to the capabilities
        var capabilities = config.browserStackOptions[browserName];
        capabilities['browserstack.user'] = process.env.BROWSERSTACK_USER;
        capabilities['browserstack.key'] = process.env.BROWSERSTACK_KEY;

        browser = module.exports = new webdriver.Builder()
            .usingServer(config.browserStackOptions.server.address)
            .withCapabilities(capabilities)
            .build();
    }

    browser.manage().timeouts().implicitlyWait(10);

}());