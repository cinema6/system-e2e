module.exports = function(browser) {
    var webdriver = require('selenium-webdriver');

    this.exp = null;

    Object.defineProperties(this, {
        id: {
            get: function() {
                return 'c6embed-' + this.exp;
            }
        }
    });

    this.get = function() {
        var id = this.id;

        return browser.wait(function() {
            return browser.findElement({ id: id })
                .then(function(element) {
                    return element.isDisplayed();
                });
        });
    };

    this.click = function() {
        var id = this.id;

        return browser.findElement({ id: id })
            .then(function click(element) {
                element.click();
                return webdriver.promise.fulfilled(element);
            })
            .then(function waitForIframe(element) {
                return browser.wait(function() {
                    return element.findElement({ tagName: 'iframe' })
                        .then(function(iframe) {
                            return iframe.isDisplayed();
                        });
                });
            });
    };
};
