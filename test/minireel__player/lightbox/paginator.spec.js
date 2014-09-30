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

    describe(browser.browserName + ' MiniReel Player [lightbox]: Paginator', function() {

        beforeEach(function() {
            return article.get()
                .then(function() {
                    console.log('Got the article');
                    return paginator.get();
                });
        });

        // Failed
        describe('going to the next card', function() {

            this.timeout(90000);

            it('should show each card', function() {
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
                }));
            });
        });

        describe('going to the previous card', function() {

            this.timeout(180000);

            // This before each is experiencing occasional failures
            beforeEach(function() {
                var recapCardVisible = false;
                return promiseWhile(
                    function() {
                        return !recapCardVisible;
                    }
                    , function() {
                        return lightbox.nextButton.click()
                            .then(function() {
                                console.log("next button clicked");
                                return browser.sleep(5000);
                            })
                            .then(function() {
                                return mrPlayer.getCard(4);
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
                return chain([3, 1, 0].map(function(index) {
                    return function() {
                        return paginator.prevButton.get()
                            .then(function(nextButton) {
                                return nextButton.getAttribute("class")
                                    .then(function(classes) {
                                        console.log(classes);
                                        return (classes.indexOf("mr-pager__btn--disabled") === -1);
                                    });
                            })
                            .then(function() {
                                return paginator.prevButton.get();
                            })
                            .then(function(prevButton) {
                                return prevButton.click();
                            })
                            .then(function() {
                                console.log('getting card ' + index);
                                return mrPlayer.getCard(index);
                            })
                            .then(function(card) {
                                console.log('expecting card ' + index);
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
