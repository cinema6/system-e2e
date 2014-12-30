(function() {
    'use strict';

    var browser = require('../browser'),
    expect = require('chai').expect,
    chain = require('../../../utils/promise').chain;

    var Article = require('./modules/Article'),
    Paginator = require('./modules/Paginator'),
    MRPlayer = require('./modules/MRPlayer'),
    Splash = require('../modules/Splash');

    var article = new Article(browser),
    paginator = new Paginator(browser),
    mrPlayer = new MRPlayer(browser),
    splash = new Splash(browser);

    splash.exp = article.exp;

    describe(2, browser.browserName + ' MiniReel Player [lightbox]: Paginator', function() {

        this.beforeEach = function() {
            return article.get()
            .then(function() {
                return paginator.get();
            });
        };

        describe('going to the next card', function() {

            this.timeout(90000);
            var self = this;

            it('should show each card', function() {
                return self.parent.beforeEach()
                .then(function() {
                    return chain([0, 1, 2, 3, 4].map(function(index) {
                        return function() {
                            return mrPlayer.getCard(index)
                            .then(function(card) {
                                return expect(card.isDisplayed()).to.eventually.equal(true);
                            })
                            .then(function() {
                                if (mrPlayer.isAdCard(mrPlayer.cards[index])) {
                                    return browser.wait(function() {
                                        return browser.findElement({
                                            css: 'p.adSkip__message'
                                        })
                                        .then(function(adSkip) {
                                            return adSkip.isDisplayed();
                                        })
                                        .then(function(isDisplayed) {
                                            return !isDisplayed;
                                        });
                                    });
                                } else if (mrPlayer.isAdCard(mrPlayer.cards[index + 1])) {
                                    return browser.sleep(5000);
                                }
                            })
                            .then(function() {
                                return mrPlayer.getCard(index);
                            })
                            .then(function(card) {
                                return expect(card.isDisplayed()).to.eventually.equal(true);
                            })
                            .then(function() {
                                if (index < 4) {
                                    return paginator.nextButton.click();
                                }
                            });
                        };
                    })); // end - chain
                });
            });
        });

        describe('skipping ahead to a card', function() {
            var self = this;
            this.beforeEach = function() {
                return self.parent.beforeEach();
            };
            describe('if there is an ad in front of the card', function() {
                var self = this;
                this.beforeEach = function() {
                    return self.parent.beforeEach()
                    .then(function() {
                        return paginator.skipTo(1)
                        .then(function() {
                            return browser.sleep(5000);
                        })
                        .then(function() {
                            return paginator.skipTo(2);
                        });
                    });
                };
                it('should show the ad', function() {
                    return self.beforeEach()
                    .then(function() {
                        return mrPlayer.getCard(2);
                    })
                    .then(function(card) {
                        return expect(card.isDisplayed()).to.eventually.equal(true);
                    });
                });
            });

            describe('if there is no ad in front of the card', function() {
                var self = this;
                this.beforeEach = function() {
                    return self.parent.beforeEach()
                    .then(function() {
                        return paginator.skipTo(2);
                    });
                };

                it('should show the card', function() {
                    return self.beforeEach()
                    .then(function() {
                        return mrPlayer.getCard(3);
                    })
                    .then(function(card) {
                        return expect(card.isDisplayed()).to.eventually.equal(true);
                    });
                });
            });

        });

        describe('exiting the MiniReel', function() {
            var self = this;
            this.beforeEach = function() {
                return self.parent.beforeEach()
                .then(function() {
                    return paginator.prevButton.click()
                    .then(function() {
                        return browser.switchTo().defaultContent();
                    });
                });
            };

            it('should hide the iframe', function() {
                return self.beforeEach()
                .then(function() {
                    return splash.iframe.get();
                })
                .then(function(iframe) {
                    return expect(iframe.isDisplayed()).to.eventually.equal(false);
                });
            });
        });
    });
}());
