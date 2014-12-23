module.exports = function(browser) {
    'use strict';

    var articleURL = 'http://demo.cinema6.com/e2e/2014/06/17/light-text/';

    this.exp = 'e-656ebb63ef2c6d';

    this.get = function() {
        return browser.get(articleURL)
            .then(function() {
                return browser.executeScript(function() {
                    window.scrollBy(0, 200);
                });
            });
    };
};
