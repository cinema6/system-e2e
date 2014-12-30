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

    describe(2, browser.browserName + ' MiniReel Player [lightbox]: Video Card', function() {
        var card;

        this.beforeEach = function() {
            return article.get()
            .then(function() {
                return mrPlayer.get();
            });
        };

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
                var self = this;
                this.beforeEach = function() {
                    return self.parent.beforeEach().then(fn);
                };

                describe('the title', function() {
                    it('should be shown', function() {
                        return self.beforeEach()
                        .then(function() {
                            return card.title.get();
                        })
                        .then(function(title) {
                            return expect(title.isDisplayed()).to.eventually.equal(true);
                        });
                    });
                });

                describe('the source', function() {
                    it('should be shown', function() {
                        return self.beforeEach()
                        .then(card.source.get)
                        .then(function(source) {
                            return expect(source.isDisplayed()).to.eventually.equal(true);
                        });
                    });

                    it('should link to the video', function() {
                        return self.beforeEach()
                        .then(function() {
                            return card.source.link.get();
                        })
                        .then(function(link) {
                            return expect(link.getAttribute('href')).to.eventually.equal(card.source.href);
                        });
                    });

                    it('should have the correct text', function() {
                        return self.beforeEach()
                        .then(function() {
                            return card.source.get();
                        })
                        .then(function(source) {
                            return expect(source.getText()).to.eventually.equal(card.source.text);
                        });
                    });
                });

                describe('the description', function() {
                    it('should be shown', function() {
                        return self.beforeEach()
                        .then(function() {
                            return card.description.get();
                        })
                        .then(function(description) {
                            return expect(description.isDisplayed()).to.eventually.equal(true);
                        });
                    });

                    it('should have the correct text', function() {
                        return self.beforeEach()
                        .then(function() {
                            return card.description.get();
                        })
                        .then(function(description) {
                            return expect(description.getText()).to.eventually.equal(card.description.text);
                        });
                    });
                });

                describe('watching the video', function() {
                    var self = this;
                    this.beforeEach = function() {
                        this.timeout(60000);
                        return self.parent.beforeEach()
                        .then(function() {
                            return card.player.watchVideo();
                        });
                    };

                    it('should autoplay the next card (could be an ad)', function() {
                        var nextCard;
                        if (card.index === 0) {
                            nextCard = mrPlayer.cards[1];
                        } else if (card.index === 2) {
                            nextCard = mrPlayer.cards[2];
                        }
                        return self.beforeEach()
                        .then(function() {
                            return nextCard.get();
                        })
                        .then(function(element) {
                            return expect(element.isDisplayed()).to.eventually.equal(true);
                        });
                    });
                });

            });
        });

        describe('clicking a link on the recap card', function() {

            this.timeout(120000); // extend the global timeout

            var self = this;
            this.beforeEach = function() {
                return self.parent.beforeEach()
                .then(function() {
                    paginator.skipToRecapCard();
                })
                .then(function() {
                    return mrPlayer.cards[4].buttons.clickButton(0);
                })
                .then(function() {
                    // Wait for the ad to become skippable
                    return mrPlayer.waitForAd();
                })
                .then(function() {
                    // Skip the ad
                    return paginator.next();
                });
            };
            it('should link to its corresponding video card', function() {
                return self.beforeEach()
                .then(function() {
                    return mrPlayer.getCard(0);
                })
                .then(function(element) {
                    return expect(element.isDisplayed()).to.eventually.equal(true);
                });
            });
        });

        describe('the nav buttons on the video player', function() {

            var self = this;
            this.beforeEach = function() {
                return self.parent.beforeEach();
            };

            describe('when the next button is clicked', function() {

                this.timeout(120000); // extend the global timeout

                it('should show each card', function() {
                    return self.beforeEach()
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
                                            return paginator.nextButton.get()
                                            .then(function(nextButton) {
                                                return nextButton.getAttribute('class')
                                                .then(function(classes) {
                                                    return (classes.indexOf('mr-pager__btn--disabled') === -1);
                                                });
                                            });
                                        });
                                    } else if (mrPlayer.isAdCard(mrPlayer.cards[index + 1])) {
                                        return browser.sleep(5000);
                                    }
                                })
                                .then(function() {
                                    if (index < 4) {
                                        return lightbox.nextButton.click();
                                    }
                                });
                            };
                        })); // end - chain
                    });
                });
            });

            describe('exiting the MiniReel', function() {
                var self = this;
                this.beforeEach = function() {
                    return self.parent.beforeEach()
                    .then(function() {
                        return lightbox.prevButton.click();
                    })
                    .then(function() {
                        return browser.switchTo().defaultContent();
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

    });
}());
