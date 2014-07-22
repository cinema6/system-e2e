module.exports = function(browser) {
    'use strict';

    var utils = require('../../../../utils/utils');

    function CloseButton() {
        this.selector = '.mr-ui__close';
        this.get = function() {
            return browser.findElement({ css: this.selector })
        };
        this.click = utils.clickMethod(this, browser);
    }

    function PrevButton() {
        this.selector = '.mr-nav__prev'
        this.get = function() {
            return browser.findElement({ css: this.selector })
        };
        this.click = utils.clickMethod(this, browser);
    }

    function NextButton() {
        this.selector = '.mr-nav__next'
        this.get = function() {
            return browser.findElement({ css: this.selector })
        };
        this.click = utils.clickMethod(this, browser);
    }

    this.closeButton = new CloseButton();
    this.prevButton = new PrevButton();
    this.nextButton = new NextButton();

};
