(function() {
    'use strict';

    var chai = require('chai'),
        chaiWebdriver = require('chai-webdriver'),
        chaiAsPromised = require("chai-as-promised"),
        browser = require('./browser');

    before(function() {
        chai
            .use(chaiWebdriver(browser))
            .use(chaiAsPromised);
    });

    after(function() {
        return browser.quit();
    });
}());
