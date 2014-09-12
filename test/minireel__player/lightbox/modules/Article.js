module.exports = function(browser) {
    'use strict';

    var self = this,
        utils = require('../../../../utils/utils'),
        promiseWhile = require('../../../../utils/promise').promiseWhile,
        splashDisplayed = false,
        articleURL = 'http://demo.cinema6.com/e2e/2014/07/16/vertical-stack/';

    this.exp = 'e-c5ed8122f00a87';

    function Title() {
        this.selector = 'a.c6js-start';
        this.get = function() {
            return browser.findElement({ css: this.selector });
        };
        this.click = utils.clickMethod(this, browser);
    }

    this.title = new Title();

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
