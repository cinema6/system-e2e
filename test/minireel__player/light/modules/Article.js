module.exports = function(browser) {
    'use strict';

    var self = this,
        promiseWhile = require('../../../../utils/promise').promiseWhile,
        splashDisplayed = false,
        articleURL = 'http://demo.cinema6.com/e2e/2014/06/17/light-text/';

    this.exp = 'e-656ebb63ef2c6d';

    this.get = function() {
        splashDisplayed = false;
        return promiseWhile(
            function() {
                return !splashDisplayed;
            },
            function() {
                return browser.get(articleURL)
                   .then(function() {
                       return browser.sleep(1500);
                    })
                    .then(function() {
                        return browser.executeScript(function() {
                            window.scrollBy(0, 200);
                        });
                    })
                    .then(function() {
                        return browser.findElement({ css: '.c6embed-' + self.exp })
                            .thenCatch(function(error) {
                                console.log('Cannot find c6embed element, refreshing the page.');
                            });
                    })
                    .then(function(element) {
                        if(element) {
                            return element.isDisplayed()
                            .then(function(isDisplayed) {
                                splashDisplayed = isDisplayed;
                            });
                        }
                    });
            }
        );
    };
};
