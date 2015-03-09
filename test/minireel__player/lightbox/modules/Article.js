module.exports = function(browser) {
    'use strict';

    var self = this,
    utils = require('../../../../utils/utils'),
    articleURL = 'http://demo.cinema6.com/e2e/2014/07/16/vertical-stack/';

    this.exp = 'e-c5ed8122f00a87';

    function Title() {
        this.selector = 'a.c6js-start';
        this.get = function() {
            return browser.findElement({
                css: this.selector
            });
        };
        this.click = utils.clickMethod(this, browser);
    }

    this.title = new Title();

    this.get = function() {
        return browser.get(articleURL)
        .then(function() {
            return browser.executeScript(function() {
                window.scrollBy(0, 200);
            });
        });
    };
};
