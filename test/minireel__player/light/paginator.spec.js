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

    describe(browser.browserName + ' MiniReel Player [light]: Paginator', function() {

        beforeEach(function() {
            return article.get()
                .then(function() {
                    return paginator.get();
                });
        });

        describe('going to the next card', function() {
            it('should show each card', function() {
                this.timeout(90000); // extend the global timeout
                return chain([0, 1, 2, 3, 4, 5].map(function(index) {
                    return function() {
                        return mrPlayer.getCard(index)
                            .then(function(card) {
                                console.log('expecting card ' + index);
                                return expect(card.isDisplayed()).to.eventually.equal(true);
                            })
                            .then(function() {
                                if(mrPlayer.isAdCard(mrPlayer.cards[index])) {
                                    console.log('waiting for ad to finish');
                                    return browser.wait(function() {
                                        return browser.findElement({ css: '.adSkip__group' })
                                            .then(function(adSkip) {
                                                return adSkip.isDisplayed();
                                            })
                                            .then(function(isDisplayed) {
                                                return !isDisplayed;
                                            });
                                    });
                                }
                                else if(mrPlayer.isAdCard(mrPlayer.cards[index+1])) {
                                    console.log('loading ad');
                                    return browser.sleep(10000);
                                }
                            })
                            .then(function() {
                                if(index<5) {
                                    console.log('clicking next');
                                    return paginator.nextButton.click();
                                }
                            });
                    };
                }));
            });
        });

        describe('going to the previous card', function() {

            this.timeout(180000); // extend the global timeout

            beforeEach(function() {
                var recapCardVisible = false;
                return promiseWhile(
                    function() {
                        return !recapCardVisible;
                    }
                    , function() {
                        return browser.wait(function() {
                            return paginator.nextButton.get()
                                .then(function(nextButton) {
                                    return browser.findElement({ css: '.adSkip__group' })
                                        .then(function(adSkip) {
                                            return adSkip.isDisplayed();
                                        })
                                        .then(function(isDisplayed) {
                                            return !isDisplayed;
                                        });
                                });
                            })
                            .then(function() {
                                return paginator.nextButton.get();
                            })
                            .then(function(nextButton) {
                                console.log("Clicking the next button.");
                                return nextButton.click();
                            })
                            .then(function() {
                                return mrPlayer.getCard(5);
                            })
                            .then(function(recapCard) {
                                return recapCard.isDisplayed();
                            })
                            .then(function(isDisplayed) {
                                if(isDisplayed) {
                                    console.log("recap card visible");
                                }
                                recapCardVisible = isDisplayed;
                            });
                    }
                );
            });

            it('should show each video card', function() {
                this.timeout(90000); // extend the global timeout
                return chain([4, 2, 0].map(function(index) {
                    return function() {
                        return paginator.prevButton.click()
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
                return paginator.prevButton.click()
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
