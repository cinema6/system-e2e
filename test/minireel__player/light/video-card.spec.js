(function() {
    'use strict';

    var browser = require('../browser'),
        expect = require('chai').expect,
        chain = require('../../../utils/promise').chain,
        config = require('../../config');

    var Article = require('./modules/Article'),
        MRPlayer = require('./modules/MRPlayer'),
        Paginator = require('./modules/Paginator');

    var article = new Article(browser),
        mrPlayer = new MRPlayer(browser),
        paginator = new Paginator(browser);

    describe('MiniReel Player [light]: Video Card', function() {
        var card;

        beforeEach(function() {
            return article.get()
                .then(function() {
                    return mrPlayer.get();
                });
        });

        [
            function() {
                return card = mrPlayer.cards[0];
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
                    it('should be shown', function() {
                        return card.title.get()
                            .then(function(title) {
                                return expect(title.isDisplayed()).to.eventually.equal(true);
                            });
                    });
                });

                describe('the play button', function() {
                    it('should be shown initially', function() {
                        return card.playButton.get()
                            .then(function(element) {
                                return expect(element.isDisplayed()).to.eventually.equal(true);
                            });
                    });
 
                    describe('when it is clicked', function() {
                        beforeEach(function() {
                            return card.playButton.click();
                        });
 
                        it('should disappear', function() {
                            return card.playButton.get()
                                .then(function(element){
                                    return expect(element.isDisplayed()).to.eventually.equal(false);
                                });
                        });
 
                        it('should reappear when the playing video is clicked', function() {
                            return card.player.click()
                                .then(function() {
                                    return card.playButton.get();
                                })
                                .then(function(element) {
                                     return expect(element.isDisplayed()).to.eventually.equal(true);
                                });
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
            });
        });
    });
}());
