module.exports = function(browser) {
    'use strict';

    var utils = require('../../../../utils/utils');

    this.exp = 'e-c5ed8122f00a87';

    function Title() {
    	this.selector = 'a.c6js-start';
    	this.get = function() {
    		return browser.findElement({ css: this.selector });
    	};
    	this.click = utils.mouseClickMethod(this, browser);
    }

    this.title = new Title();

    this.get = function() {
        return browser.get('http://demo.cinema6.com/e2e/2014/07/16/vertical-stack/')
            .then(function() {
                return browser.sleep(1500);
            })
            .then(function() {
                return browser.executeScript(function() {
                    window.scrollBy(0, 200);
                });
            });
;
    };
};
