(function() {
    'use strict';

    var config = require('../config');

    var browser;

    if(config.runLocally){
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
        var browserIndex = process.env.BROWSER_INDEX || 0;
        browser = module.exports = new webdriver.Builder()
            .usingServer(config.browserStackOptions.server.address)
            .withCapabilities(config.browserStackOptions.browsers[browserIndex])
            .build();
    }

    browser.manage().timeouts().implicitlyWait(10);

}());