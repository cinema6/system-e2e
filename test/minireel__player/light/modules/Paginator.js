module.exports = function(browser) {
    'use strict';

    var MRPlayer = require('./MRPlayer'),
        utils = require('../../../../utils/utils');


    var mrPlayer = new MRPlayer(browser);

    this.nextButton = {
        selector: 'button.pager__next',
        get: function() {
            return browser.findElement({ css: this.selector });
        }
    };
    this.nextButton.click = utils.clickMethod(this.nextButton, browser);

    this.prevButton = {
        selector: 'button.pager__prev',
        get: function() {
            return browser.findElement({ css: this.selector });
        }
    };
    this.thumbs = {
        selector: '.pages__list button',
        get: function() {
            return browser.findElements({ css: this.selector });
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

    this.prev = function() {
        return this.prevButton.get()
            .then(function(prevButton) {
                return prevButton.click();
            })
            .then(function sleep() {
                return browser.sleep(2000);
            });
    };

    this.skipTo = function(index) {
        return this.thumbs.get()
            .then(function(thumbs) {
                return thumbs[index];
            })
            .then(function(thumb) {
                return thumb.click();
            })
            .then(function() {
                return browser.sleep(2000);
            });
    };

    this.get = function() {
        return mrPlayer.get();
    };
};
