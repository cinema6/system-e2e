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

    describe(2, browser.browserName + ' MiniReel Player [light]: Paginator', function() {

        var self = this;
        this.beforeEach = function() {
            return article.get()
            .then(function() {
                return paginator.get();
            });
        };

        describe('going to the next card', function() {
            it('should show each card', function() {
                this.timeout(90000); // extend the global timeout
                return self.beforeEach()
                .then(function() {
                    return chain([0, 1, 2, 3, 4, 5].map(function(index) {
                        return function() {
                            return mrPlayer.getCard(index)
                            .then(function(card) {
                                console.log('expecting card ' + index);
                                return expect(card.isDisplayed()).to.eventually.equal(true);
                            })
                            .then(function() {
                                if (mrPlayer.isAdCard(mrPlayer.cards[index])) {
                                    console.log('waiting for ad to finish');
                                    return browser.wait(function() {
                                        return browser.findElement({
                                            css: 'div.adSkip__group'
                                        })
                                        .then(function(adSkip) {
                                            return adSkip.isDisplayed();
                                        })
                                        .then(function(isDisplayed) {
                                            return !isDisplayed;
                                        });
                                    });
                                } else if (mrPlayer.isAdCard(mrPlayer.cards[index + 1])) {
                                    console.log('loading ad');
                                    return browser.sleep(10000);
                                }
                            })
                            .then(function() {
                                if (index < 5) {
                                    console.log('clicking next');
                                    return paginator.nextButton.click();
                                }
                            });
                        };
                    }));
                });

            });
        });

        describe('going to the previous card', function() {

            this.timeout(180000); // extend the global timeout
            var self = this;
            this.beforeEach = function() {
                return self.parent.beforeEach()
                .then(function() {
                    return paginator.skipToRecapCard();
                });
            };

            it('should show each video card', function() {
                this.timeout(90000); // extend the global timeout
                return self.beforeEach()
                .then(function() {
                    return chain([4, 3, 2, 1, 0].map(function(index) {
                        return function() {
                            return paginator.prevButton.click()
                            .then(function() {
                                var card = mrPlayer.cards[index];
                                if (mrPlayer.isAdCard(card)) {
                                    return mrPlayer.waitForAd();
                                } else {
                                    return mrPlayer.getCard(index)
                                    .then(function(card) {
                                        return expect(card.isDisplayed()).to.eventually.equal(true);
                                    });
                                }
                            });
                        };
                    }));
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
                        return paginator.skipTo(2);
                    });
                };

                it('should show the ad', function() {
                    return self.beforeEach()
                    .then(function() {
                        return mrPlayer.getCard(3);
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
                        return paginator.skipTo(3);
                    });
                };

                it('should show the card', function() {
                    return self.beforeEach()
                    .then(function() {
                        return mrPlayer.getCard(5);
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
