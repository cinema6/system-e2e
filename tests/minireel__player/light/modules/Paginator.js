module.exports = function(browser) {
    'use strict';

    var MRPlayer = require('./MRPlayer');

    var mrPlayer = new MRPlayer(browser);

    this.nextButton = {
        selector: 'button.mr-pager__next',
        get: function() {
            return browser.findElement({ css: this.selector });
        }
    };

    this.next = function() {
        return this.nextButton.get()
            .then(function(nextButton) {
                return nextButton.click();
            })
            .then(function sleep() {
                return browser.sleep(2000);
            });
    };

    this.get = function() {
        return mrPlayer.get();
    };
};
