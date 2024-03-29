module.exports = function(browser) {
    'use strict';

    var MRPlayer = require('./MRPlayer'),
    utils = require('../../../../utils/utils'),
    self = this;

    var mrPlayer = new MRPlayer(browser);

    this.nextButton = {
        selector: 'button.pager__btn--next',
        get: function() {
            return browser.findElement({
                css: this.selector
            });
        }
    };
    this.nextButton.click = utils.clickMethod(this.nextButton, browser);

    this.prevButton = {
        selector: 'button.pager__btn--prev',
        get: function() {
            return browser.findElement({
                css: this.selector
            });
        }
    };
    this.prevButton.click = utils.clickMethod(this.prevButton, browser);

    this.thumbs = {
        selector: '.pages__list button',
        get: function() {
            return browser.findElements({
                css: this.selector
            });
        }
    };

    this.skipTo = function(index) {
        return browser.wait(function() {
            return self.thumbs.get()
            .then(function(thumbs) {
                return thumbs[index].isDisplayed();
            });
        }, 10000)
        .then(function() {
            return self.thumbs.get();
        })
        .then(function(thumbs) {
            return thumbs[index].click();
        });
    };

    this.skipToRecapCard = function() {
        return self.skipTo(3);
    };

    this.get = function() {
        return mrPlayer.get();
    };
};
