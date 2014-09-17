(function() {
    'use strict';

    var browser = require('../browser'),
        expect = require('chai').expect,
        Q = require('q'),
        chain = require('../../../utils/promise').chain,
        promiseWhile = require('../../../utils/promise').promiseWhile;

    var Article = require('./modules/Article'),
        Paginator = require('./modules/Paginator'),
        MRPlayer = require('./modules/MRPlayer'),
        Splash = require('../modules/Splash');

    var article = new Article(browser),
        paginator = new Paginator(browser),
        mrPlayer = new MRPlayer(browser),
        splash = new Splash(browser);

    splash.exp = article.exp;

    describe(browser.browserName + ' MiniReel Player [lightbox]: Paginator', function() {

        beforeEach(function() {
            return article.get()
                .then(function() {
                    return paginator.get();
                });
        });

        describe('going to the next card', function() {
            it('should show each card', function() {
                this.timeout(60000);
                return chain([0, 1, 2, 3, 4].map(function(index) {
                    return function() {
                        return mrPlayer.getCard(index)
                            .then(function(card) {
                                return expect(card.isDisplayed()).to.eventually.equal(true);
                            })
                            .then(function() {
                                if(mrPlayer.isAdCard(mrPlayer.cards[index])){
                                    return browser.sleep(7000);
                                }
                            })
                            .then(function() {
                                return browser.sleep(5000)
                                    .then(function() {
                                        return paginator.next();
                                    });
                            });
                    };
                }));
            });
        });

        describe.skip('going to the previous card', function() {

            beforeEach(function() {
                var cardDisplayed = false;
                return promiseWhile(
                    function() {
                        return !cardDisplayed;
                    },
                    function() {
                        return mrPlayer.getCard(4)
                            .then(function(lastVideoCard) {
                                return lastVideoCard.isDisplayed();
                            })
                            .then(function(isDisplayed) {
                                cardDisplayed = isDisplayed;
                                if (!isDisplayed) {
                                    paginator.next();
                                }
                            });
                    }
                );
            });

            it('should show each video card', function() {
                return chain([3, 1, 0].map(function(index) {
                    return function() {
                        return paginator.prev()
                            .then(function() {
                                return mrPlayer.getCard(index);
                            })
                            .then(function(card) {
                                return expect(card.isDisplayed()).to.eventually.equal(true);
                            });
                    };
                }));
            });
        });

        describe('skipping ahead to a card', function() {
            describe('if there is an ad in front of the card', function() {
                beforeEach(function() {
                    return browser.sleep(5000)
                        .then(function() {
                            return paginator.skipTo(2);
                        });
                });

                it('should show the ad', function() {
                    return mrPlayer.getCard(2)
                        .then(function(card) {
                            return expect(card.isDisplayed()).to.eventually.equal(true);
                        });
                });
            });

            describe('if there is no ad in front of the card', function() {
                beforeEach(function() {
                    return paginator.skipTo(3);
                });

                it('should show the card', function() {
                    return mrPlayer.getCard(4)
                        .then(function(card) {
                            return expect(card.isDisplayed()).to.eventually.equal(true);
                        });
                });
            });
        });

        describe('exiting the MiniReel', function() {
            beforeEach(function() {
                return paginator.prev()
                    .then(function() {
                        return browser.switchTo().defaultContent();
                    });
            });

            it('should hide the iframe', function() {
                return splash.iframe.get()
                    .then(function(iframe) {
                        return expect(iframe.isDisplayed()).to.eventually.equal(false);
                    });
            });
        });
    });
}());
