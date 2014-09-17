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
                card = mrPlayer.cards[1];
                return paginator.skipTo(1);
            },
            function() {
                card = mrPlayer.cards[3];
                return paginator.skipTo(3)
                    .then(function() {
                        return paginator.skipTo(2);
                    });
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
                        var nextCardIndex = mrPlayer.cards.indexOf(card) + 1;
                        var nextCard = mrPlayer.cards[nextCardIndex];
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
                        card = mrPlayer.cards[4];
                        return card.buttons.clickButton(0);
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

                it('should show each card', function() {
                    this.timeout(60000); // extend the global timeout
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
                                    if(index < 4) {
                                        return browser.sleep(5000)
                                            .then(function() {
                                                return lightbox.nextButton.click();
                                            });
                                    }
                                });
                        };
                    }));
                });
            });

            describe('when the previous button is clicked', function() {

                beforeEach(function() {
                    var nextButtonExists = true;
                    return promiseWhile(
                        function() {
                            return nextButtonExists;
                        },
                        function() {
                            return lightbox.nextButton.get()
                                .then(function(nextButton) {
                                    return nextButton.isDisplayed();
                                })
                                .then(function(isDisplayed) {
                                    nextButtonExists = isDisplayed;
                                    if (nextButtonExists) {
                                        lightbox.nextButton.click();
                                    }
                                });
                        }
                    );
                });

                it('should show each video card', function() {
                    console.log('beginning test');
                    return chain([1, 0].map(function(index) {
                        return function() {
                            return lightbox.prevButton.click()
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
