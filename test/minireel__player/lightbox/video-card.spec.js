(function() {
    'use strict';

    var browser = require('../browser'),
        expect = require('chai').expect,
        chain = require('../../../utils/promise').chain;

    var Article = require('./modules/Article'),
        MRPlayer = require('./modules/MRPlayer'),
        Paginator = require('./modules/Paginator');

    var article = new Article(browser),
        mrPlayer = new MRPlayer(browser),
        paginator = new Paginator(browser);

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
                        return card.player.watchVideo();
                    });

                    it('should autoplay the next card', function() {
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

    });
}());
