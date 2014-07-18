module.exports = function(browser) {
    'use strict';

    this.exp = 'e-c5ed8122f00a87';

    this.get = function() {
        return browser.get('http://demo.cinema6.com/e2e/2014/07/16/vertical-stack/')
            .then(function() {
                return browser.sleep(1500);
            });
    };
};
