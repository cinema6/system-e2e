(function() {
    'use strict';

    var webdriver = require('selenium-webdriver');
    var config = require('../config');

    var browser;

    if(config.runLocally){
        var SeleniumServer = require('selenium-webdriver/remote').SeleniumServer;
        var server = new SeleniumServer(config.localOptions.server.jar, config.localOptions.server.options);
        server.start();
        browser = module.exports = new webdriver.Builder()
            .usingServer(server.address())
            .withCapabilities(config.localOptions.capabilities)
            .build();
    }else{
        browser = module.exports = new webdriver.Builder()
            .usingServer(config.browserStackOptions.server.address)
            .withCapabilities(config.browserStackOptions.capabilities)
            .build();
    }

    browser.manage().timeouts().implicitlyWait(10);

}());