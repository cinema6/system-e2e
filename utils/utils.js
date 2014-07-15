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
        var sleepTime = sleepTime || 1500;
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
                return e.click();
            })
            .then(function() {
                return browser.sleep(sleepTime);
            });
        };
    };

    exports.mouseClickMethod = function(element, browser, sleepTime) {
        var sleepTime = sleepTime || 1500;
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
                    .mouseUp(e)
                    .perform();
            })
            .then(function() {
                return browser.sleep(sleepTime);
            });
        };
    };

}());
