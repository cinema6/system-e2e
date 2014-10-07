module.exports = function(browser) {
    'use strict';

    var MRPlayer = require('./MRPlayer');

    var mrPlayer = new MRPlayer(browser);

    var utils = require('../../../../utils/utils');

    var self = this;

    this.nextButton = {
        selector: 'button.mr-pager__next',
        get: function() {
            return browser.findElement({ css: this.selector });
        }
    };
    this.nextButton.click = utils.clickMethod(this.nextButton, browser);

    this.prevButton = {
        selector: 'button.mr-pager__prev',
        get: function() {
            return browser.findElement({ css: this.selector });
        }
    };
    this.prevButton.click = utils.clickMethod(this.prevButton, browser);

    this.thumbs = {
        selector: '.mr-pages__list button',
        get: function() {
            return browser.findElements({ css: this.selector });
        }
    };

    this.skipTo = function(index) {
        return browser.wait(function() {
            return self.thumbs.get()
                .then(function(thumbs) {
                    return thumbs[index].isDisplayed();
                });
        })
        .then(function() {
            return self.thumbs.get();
        })
        .then(function(thumbs) {
            return thumbs[index].click();
        });
    };

    this.get = function() {
        return mrPlayer.get();
    };
};
