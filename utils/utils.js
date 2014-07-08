(function() {
    'use strict';

    exports.getMethod = function(parent, selector) {
        return function() {
            return parent.get()
                .then(function(parentElement) {
                    return parentElement.findElement({ css: selector });
                });
        };
    };

    exports.clickMethod = function(element, browser) {
        return function() {
            return element.get()
                .then(function(e) {
                    return e.click();
                })
                .then(function() {
                    return browser.sleep(2000);
                });
        }
    };

    exports.mouseClickMethod = function(element, browser) {
        return function() {
            return element.get()
                .then(function(e) {
                    return browser.actions()
                        .mouseDown(e)
                        .mouseUp()
                        .perform();
                })
                .then(function() {
                    return browser.sleep(2000);
                });
        }
    };

}());
