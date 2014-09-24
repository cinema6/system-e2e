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

    exports.clickMethod = function(element, browser, sleepTime) {
        return function() {
            var visibleElement;
            return browser.wait(function() {
                return element.get()
                    .then(function(e) {
                        visibleElement = e;
                        return e.isDisplayed();
                    });
            })
            .then(function() {
                return visibleElement.click();
            });
        };
    };

    exports.mouseClickMethod = function(element, browser, sleepTime) {
        return function() {
            return browser.wait(function() {
                return element.get()
                    .then(function(e) {
                        return e.isDisplayed();
                    });
            })
            .then(function() {
                return element.get();
            })
            .then(function(e) {
                return browser.actions()
                    .mouseDown(e)
                    .mouseUp()
                    .perform();
            });
        };
    };

}());
