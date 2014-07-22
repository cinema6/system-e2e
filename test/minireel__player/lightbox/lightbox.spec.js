(function() {
    'use strict';

    var browser = require('../browser'),
        expect = require('chai').expect,
        chain = require('../../../utils/promise').chain;

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

    describe(browser.browserName + ' MiniReel Player [lightbox]: Lightbox', function() {
        var card;

        beforeEach(function() {
            return article.get();
        });

        describe('the close button', function() {
            beforeEach(function() {
                return mrPlayer.get()
                    .then(function() {
                        return lightbox.closeButton.click();
                    })
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

        describe('the title', function() {
            it('should be displayed', function() {
                return article.title.get()
                    .then(function(element) {
                        return expect(element.isDisplayed()).to.eventually.equal(true);
                    });
            });

            describe('when it is clicked', function() {
                beforeEach(function() {
                    return article.title.click();
                });

                it('should show the first video card', function() {
                    return mrPlayer.cards[0].get()
                        .then(function(element) {
                            return expect(element.isDisplayed()).to.eventually.equal(true);
                        })
                        .thenCatch(function(error) {
                            expect(error).to.not.exist();
                        });
                });

            });
        });

        describe('the recap card', function() {
            beforeEach(function() {
                mrPlayer.get()
                    .then(function() {
                        return paginator.skipTo(3);
                    })
                    .then(function() {
                        card = mrPlayer.cards[4];
                        return card.buttons.clickButton(0);
                    });
            });

            it('should link to the proper video card', function() {
                return mrPlayer.cards[0].get()
                    .then(function(element) {
                        return expect(element.isDisplayed()).to.eventually.equal(true);
                    });
            });
        });

        describe('the nav buttons on the video player', function() {
            beforeEach(function() {
                return mrPlayer.get();
            });

            describe('when the next button is clicked', function() {
                it('should show each card', function() {
                    return chain([0, 1, 2, 3, 4].map(function(index) {
                        return function() {
                            return mrPlayer.getCard(index)
                                .then(function(card) {
                                    return expect(card.isDisplayed()).to.eventually.equal(true);
                                })
                                .then(function() {
                                    if(mrPlayer.isAdCard(mrPlayer.cards[index])){
                                        return browser.sleep(7500);
                                    }
                                })
                                .then(function() {
                                    if(index < 4) {
                                        return lightbox.nextButton.click();
                                    }
                                });
                        };
                    }));
                });
            });

            describe('when the previous button is clicked', function() {
                beforeEach(function() {
                    return chain([0, 1, 2].map(function(index) {
                        return function() {
                            return mrPlayer.getCard(index)
                                .then(function() {
                                    if(mrPlayer.isAdCard(mrPlayer.cards[index])){
                                        return browser.sleep(7500);
                                    }
                                })
                                .then(function() {
                                    return lightbox.nextButton.click();
                                });
                        };
                    }));
                });

                it('should show each video card', function() {
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
