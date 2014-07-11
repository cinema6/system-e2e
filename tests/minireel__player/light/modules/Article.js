module.exports = function(browser) {
    'use strict';

    this.exp = 'e-656ebb63ef2c6d';

    this.get = function() {
        return browser.get('http://demo.cinema6.com/e2e/2014/06/17/light-text/')
            .then(function() {
                return browser.sleep(1500);
            });
    };
};
