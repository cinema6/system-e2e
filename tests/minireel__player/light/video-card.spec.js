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

    describe('MiniReel Player [light]: Video Card', function() {
        var card;

        this.timeout(30000);

        beforeEach(function() {
            article.get();
            return mrPlayer.get();
        });

        [
            function() {
                card = mrPlayer.cards[0];
            },
            function() {
                card = mrPlayer.cards[4];

                paginator.skipTo(3);
                return paginator.skipTo(2);
            }
        ].forEach(function(fn, index) {
            describe('test ' + index, function() {
                beforeEach(fn);

                describe('the title', function() {
                    it('should not be shown', function() {
                        return card.title.get()
                            .then(function(title) {
                                return expect(title.isDisplayed()).to.eventually.equal(true);
                            });
                    });
                });

                describe('the source', function() {
                    it('should not be shown initially', function() {
                        return card.source.get()
                            .then(function(source) {
                                return expect(source.isDisplayed()).to.eventually.equal(false);
                            });
                    });

                    it('should link to the video', function() {
                        return card.source.link.get()
                            .then(function(link) {
                                expect(link.getAttribute('href')).to.eventually.equal(card.source.href);
                            });
                    });

                    describe('when the drop-down button is hovered over', function() {
                        beforeEach(function() {
                            return card.dropDown.hover();
                        });

                        it('should show the source', function() {
                            return card.source.get()
                                .then(function(source) {
                                    return expect(source.isDisplayed()).to.eventually.equal(true);
                                });
                        });

                        it('should have the correct text', function() {
                            return card.source.get()
                                .then(function(source) {
                                    expect(source.getText()).to.eventually.equal(card.source.text);
                                });
                        });

                        describe('when the drop-down button is not hovered over', function() {
                            beforeEach(function() {
                                return card.dropDown.leave();
                            });

                            it('should hide the source', function() {
                                return card.source.get()
                                    .then(function(source) {
                                        return expect(source.isDisplayed()).to.eventually.equal(false);
                                    });
                            });
                        });
                    });
                });
            });
        });
    });
}());
