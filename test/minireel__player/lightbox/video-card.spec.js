(function() {
    'use strict';

    var browser = require('../browser'),
        expect = require('chai').expect,
        chain = require('../../../utils/promise').chain,
        promiseWhile = require('../../../utils/promise').promiseWhile;

    var Article = require('./modules/Article'),
        MRPlayer = require('./modules/MRPlayer'),
        Paginator = require('./modules/Paginator'),
        Splash = require('../modules/Splash'),
        Lightbox = require('./modules/Lightbox');

    var article = new Article(browser),
        mrPlayer = new MRPlayer(browser),
        paginator = new Paginator(browser),
        splash = new Splash(browser),
        lightbox = new Lightbox(browser);

    splash.exp = article.exp;

    describe(browser.browserName + ' MiniReel Player [lightbox]: Video Card', function() {
        var card;

        beforeEach(function() {
            return article.get()
                .then(function() {
                    return mrPlayer.get();
                });
        });

        [
            function() {
                card = mrPlayer.cards[0];
            },
            function() {
                card = mrPlayer.cards[3];
                return paginator.skipTo(2);
            }
        ].forEach(function(fn, index) {
            describe('test ' + index, function() {
                beforeEach(fn);

                describe('the title', function() {
                    it('should be shown', function() {
                        return card.title.get()
                            .then(function(title) {
                                return expect(title.isDisplayed()).to.eventually.equal(true);
                            });
                    });
                });

                describe('the source', function() {
                    it('should be shown', function() {
                        return card.source.get()
                            .then(function(source) {
                                return expect(source.isDisplayed()).to.eventually.equal(true);
                            });
                    });

                    it('should link to the video', function() {
                        return card.source.link.get()
                            .then(function(link) {
                                return expect(link.getAttribute('href')).to.eventually.equal(card.source.href);
                            });
                    });

                    it('should have the correct text', function() {
                        return card.source.get()
                            .then(function(source) {
                                return expect(source.getText()).to.eventually.equal(card.source.text);
                            });
                    });
                });

                describe('the description', function() {
                    it('should be shown', function() {
                        return card.description.get()
                            .then(function(description) {
                                return expect(description.isDisplayed()).to.eventually.equal(true);
                            });
                    });

                    it('should have the correct text', function() {
                        return card.description.get()
                            .then(function(description) {
                                return expect(description.getText()).to.eventually.equal(card.description.text);
                            });
                    });
                });

                describe('watching the video', function() {
                    beforeEach(function() {
                        this.timeout(60000);
                        return card.player.watchVideo();
                    });

                    it('should autoplay the next card (could be an ad)', function() {
                        var nextCard;
                        if(card.index === 0) {
                            nextCard = mrPlayer.cards[1];
                        } else if(card.index === 2) {
                            nextCard = mrPlayer.cards[2];
                        }
                        return nextCard.get()
                            .then(function(element) {
                                return expect(element.isDisplayed()).to.eventually.equal(true);
                            });
                    });
                });

            });
        });

        describe('the recap card', function() {
            beforeEach(function() {
                return paginator.skipTo(3)
                    .then(function() {
                        // wait for ad to preload?
                        return browser.sleep(5000);
                    })
                    .then(function() {
                        // click the link to the first card
                        card = mrPlayer.cards[4];
                        return card.buttons.clickButton(0);
                    })
                    .then(function() {
                        // an ad should appear, wait for it to becoem skippable
                        return browser.wait(function() {
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
                        // click the next button to view the first card
                        return paginator.nextButton.click();
                    });
            });
            it('should link to the proper video card', function() {
                return mrPlayer.getCard(0)
                    .then(function(element) {
                        return expect(element.isDisplayed()).to.eventually.equal(true);
                    });
            });
        });

        describe('the nav buttons on the video player', function() {

            describe('when the next button is clicked', function() {

                this.timeout(120000); // extend the global timeout

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
                                        console.log('Waiting 7 seconds for the ad to play');
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
                                    if(index<4) {
                                        console.log('clicking the next button');
                                        return lightbox.nextButton.click();
                                    }
                                });
                        };
                    }));
                });
            });

            describe.skip('when the previous button is clicked', function() {
            });

            describe('exiting the MiniReel', function() {

                beforeEach(function() {
                    return lightbox.prevButton.click()
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

    });
}());
