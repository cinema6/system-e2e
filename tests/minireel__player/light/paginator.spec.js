(function() {
    'use strict';

    var browser = require('../browser'),
        expect = require('chai').expect,
        Q = require('q'),
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

    describe('MiniReel Player [light]: Paginator', function() {
        this.timeout(30000);

        beforeEach(function() {
            article.get();
            return paginator.get();
        });

        describe('going to the next card', function() {
            it('should show each card', function() {
                return chain([0, 1, 2, 3, 4, 5].map(function(index) {
                    return function() {
                        return mrPlayer.getCard(index)
                            .then(function(card) {
                                return expect(card.isDisplayed()).to.eventually.equal(true);
                            })
                            .then(function next() {
                                return paginator.next();
                            });
                    };
                }));
            });
        });

        describe('going to the previous card', function() {
            beforeEach(function() {
                return chain([0, 1, 2, 3, 4].map(function() {
                    return function() {
                        return paginator.next();
                    };
                }));
            });

            it('should show each card', function() {
                return chain([4, 3, 2, 1, 0].map(function(index) {
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

            describe('exiting the MiniReel', function() {
                beforeEach(function() {
                    return paginator.prev();
                });
            });
        });

        describe('skipping to a card', function() {
            describe('if there is an ad in front of the card', function() {
                beforeEach(function() {
                    return paginator.skipTo(2);
                });

                it('should show the ad', function() {
                    return mrPlayer.getCard(3)
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
                    return mrPlayer.getCard(5)
                        .then(function(card) {
                            return expect(card.isDisplayed()).to.eventually.equal(true);
                        });
                });
            });
        });

        describe('exiting the MiniReel', function() {
            beforeEach(function() {
                paginator.prev();
                return browser.switchTo().defaultContent();
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
