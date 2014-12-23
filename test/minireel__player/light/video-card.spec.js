(function() {
    'use strict';

    var browser = require('../browser'),
    expect = require('chai').expect;

    var Article = require('./modules/Article'),
    MRPlayer = require('./modules/MRPlayer'),
    Paginator = require('./modules/Paginator');

    var article = new Article(browser),
    mrPlayer = new MRPlayer(browser),
    paginator = new Paginator(browser);

    describe(2, browser.browserName + ' MiniReel Player [light]: Video Card', function() {
        var card;
        this.beforeEach = function() {
            return article.get()
            .then(function() {
                return mrPlayer.get();
            })
            .then(function() {
                return browser.wait(function() {
                    return mrPlayer.cards[0].get()
                    .then(function() {
                        return true;
                    })
                    .thenCatch(function(error) {
                        console.log(error);
                        return false;
                    });
                });
            });
        };

        [
        function() {
            card = mrPlayer.cards[0];
            // For the sole purpose of returning a promise
            return browser.sleep(10);
        },
        function() {
            card = mrPlayer.cards[4];
            return paginator.skipTo(3)
            .then(function() {
                return paginator.skipTo(2);
            });
        }
        ].forEach(function(fn, index) {
            describe('test ' + index, function() {
                var self = this;
                this.beforeEach = function() {
                    return self.parent.beforeEach()
                    .then(function() {
                        return fn();
                    });
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

                describe('the play button', function() {
                    var self = this;
                    this.beforeEach = function() {
                        return self.parent.beforeEach();
                    };

                    it('should not be shown initially', function() {
                        return self.parent.beforeEach()
                        .then(function() {
                            return card.playButton.get();
                        })
                        .then(function(element) {
                            return expect(element.isDisplayed()).to.eventually.equal(false);
                        });
                    });

                    describe('when the video is paused', function() {
                        var self = this;
                        this.beforeEach = function() {
                            return self.parent.beforeEach()
                            .then(function() {
                                return card.player.click()
                                .then(function() {
                                    // Give the video a couple seconds to play
                                    return browser.sleep(3000);
                                })
                                .then(function() {
                                    return card.player.click();
                                })
                                .then(function() {
                                    return card.ballot.vote.closeButton.click();
                                });
                            });
                        };

                        it('should be shown', function() {
                            return self.beforeEach()
                            .then(function() {
                                return card.playButton.get()
                                .then(function(element) {
                                    return expect(element.isDisplayed()).to.eventually.equal(true);
                                });
                            });
                        });
                    });
                });

                describe('the source', function() {
                    it('should be shown', function() {
                        return self.beforeEach()
                        .then(function() {
                            return card.source.get();
                        })
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
            });
        });
    });
}());
