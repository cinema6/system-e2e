module.exports = function(browser) {
    var webdriver = require('selenium-webdriver');

    var self = this;

    this.exp = null;

    Object.defineProperties(this, {
        className: {
            get: function() {
                return 'c6embed-' + this.exp;
            }
        }
    });

    this.iframe = {
        get: function() {
            return browser.findElement({ css: this.selector });
        }
    };
    Object.defineProperties(this.iframe, {
        selector: {
            get: function() {
                return '.' + self.className + '>iframe';
            }
        }
    });

    this.get = function() {
        var className = this.className;

        return browser.wait(function() {
            return browser.findElement({ css: '.' + className })
                .then(function(element) {
                    return element.isDisplayed();
                });
        });
    };

    this.click = function() {
        var className = this.className;
        return browser.findElement({ css: '.' + className })
            .then(function click(element) {
                browser.actions()
                    .mouseDown(element)
                    .mouseUp()
                    .perform();
                return webdriver.promise.fulfilled(element);
            })
            .then(function waitForIframe(element) {
                return browser.wait(function() {
                    return element.findElement({ tagName: 'iframe' })
                        .then(function(iframe) {
                            return iframe.isDisplayed();
                        });
                }, 10000);
            });
    };

    this.mouseOver = function() {
        var className = this.className;

        return browser.findElement({ css: '.' + className })
            .then(function click(element) {
                browser.actions()
                    .mouseMove(element)
                    .perform();
                return webdriver.promise.fulfilled(element);
            });
    };

};
