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
        Splash = require('../modules/Splash'),
        Lightbox = require('./modules/Lightbox');

    var article = new Article(browser),
        paginator = new Paginator(browser),
        mrPlayer = new MRPlayer(browser),
        splash = new Splash(browser),
        lightbox = new Lightbox(browser);

    splash.exp = article.exp;

    describe(2, browser.browserName + ' MiniReel Player [lightbox]: Paginator', function() {

        this.beforeEach = function() {
            return article.get()
                .then(function() {
                    console.log('Got the article');
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
                                        console.log('Expecting card ' + index + ' to be displayed.')
                                        return expect(card.isDisplayed()).to.eventually.equal(true);
                                    })
                                    .then(function() {
                                        if(mrPlayer.isAdCard(mrPlayer.cards[index])) {
                                            console.log('Waiting for the ad to finish');
                                            return browser.wait(function() {
                                                return paginator.nextButton.get()
                                                    .then(function(nextButton) {
                                                        return nextButton.getAttribute("class")
                                                            .then(function(classes) {
                                                                console.log(classes);
                                                                return (classes.indexOf("mr-pager__btn--disabled") === -1)
                                                            });
                                                    });
                                            });
                                        }
                                        else if(mrPlayer.isAdCard(mrPlayer.cards[index+1])) {
                                            console.log('Waiting on a card before an ad');
                                            return browser.sleep(5000);
                                        }
                                    })
                                    .then(function() {
                                        return mrPlayer.getCard(index);
                                    })
                                    .then(function(card) {
                                        console.log('Expecting card ' + index + ' to be displayed, we did not click next yet.')
                                        return expect(card.isDisplayed()).to.eventually.equal(true);
                                    })
                                    .then(function() {
                                        if(index<4) {
                                            console.log('clicking the next button');
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
                                    console.log('loading the ad');
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
                            return mrPlayer.getCard(3)
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
