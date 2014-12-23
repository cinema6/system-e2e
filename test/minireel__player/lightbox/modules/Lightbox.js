module.exports = function(browser) {
    'use strict';

    var utils = require('../../../../utils/utils');

    function CloseButton() {
        this.selector = '.MiniReel__closeBtn';
        this.get = function() {
            return browser.findElement({ css: this.selector });
        };
        this.click = utils.clickMethod(this, browser);
    }

    function PrevButton() {
        this.selector = '.nav__btn--prev';
        this.get = function() {
            return browser.findElement({ css: this.selector });
        };
        this.click = utils.clickMethod(this, browser);
    }

    function NextButton() {
        this.selector = '.nav__btn--next';
        this.get = function() {
            return browser.findElement({ css: this.selector });
        };
        this.click = utils.clickMethod(this, browser);
    }

    this.closeButton = new CloseButton();
    this.prevButton = new PrevButton();
    this.nextButton = new NextButton();

};
