(function() {
    'use strict';

    var browser = require('../browser'),
    expect = require('chai').expect;

    var Article = require('./modules/Article'),
    MRPlayer = require('./modules/MRPlayer'),
    Splash = require('../modules/Splash'),
    Lightbox = require('./modules/Lightbox');

    var article = new Article(browser),
    mrPlayer = new MRPlayer(browser),
    splash = new Splash(browser),
    lightbox = new Lightbox(browser);

    splash.exp = article.exp;

    describe(2, browser.browserName + ' MiniReel Player [lightbox]: Lightbox', function() {

        var times = 0;

        this.beforeEach = function() {
            return article.get();
        };

        describe('the close button', function() {
            var self = this;
            this.beforeEach = function() {
                return self.parent.beforeEach()
                .then(mrPlayer.get)
                .then(lightbox.closeButton.click)
                .then(function() {
                    return browser.switchTo().defaultContent();
                });
            };

            it('should hide the iframe', function() {
                times ++;
                console.log(times + ' <- the iteration of trying this test');
                return self.beforeEach()
                .then(function() {
                    return splash.iframe.get();
                })
                .then(function(iframe) {
                    return expect(iframe.isDisplayed()).to.eventually.equal(false);
                });
            });

        });

        describe('the title', function() {

            it('should be displayed', function() {
                return article.title.get()
                .then(function(element) {
                    return expect(element.isDisplayed()).to.eventually.equal(true);
                });
            });

            describe('when it is clicked', function() {
                var self = this;
                this.beforeEach = function() {
                    return article.title.click()
                    .then(function() {
                        return browser.wait(function() {
                            return splash.iframe.get()
                            .then(function(iframe) {
                                return iframe.isDisplayed();
                            })
                            .thenCatch(function() {
                                return false;
                            });
                        });
                    })
                    .then(function() {
                        return splash.iframe.get();
                    })
                    .then(function(iframe) {
                        return browser.switchTo().frame(iframe);
                    });
                };

                it('should show the first video card', function() {
                    return self.beforeEach()
                    .then(function() {
                        return mrPlayer.getCard(0);
                    })
                    .then(function(element) {
                        return expect(element.isDisplayed()).to.eventually.equal(true);
                    });
                });
            }); // end - describe when it is clicked

        });


    });
}());
