(function() {
    'use strict';

    var browser = require('../browser'),
        expect = require('chai').expect,
        Q = require('q'),
        chain = require('../../../utils/promise').chain;

    var Article = require('./modules/Article'),
        Paginator = require('./modules/Paginator'),
        MRPlayer = require('./modules/MRPlayer');

    var article = new Article(browser),
        paginator = new Paginator(browser),
        mrPlayer = new MRPlayer(browser);

    describe('MiniReel Player [light]: Paginator', function() {
        this.timeout(10000);

        beforeEach(function() {
            article.get();
            return paginator.get();
        });

        describe('going to the next card', function() {
            it('should show each card', function() {
                this.timeout(20000);

                return chain([0, 1, 2, 3, 4, 5].map(function(index) {
                    return function() {
                        return mrPlayer.getCard(index)
                            .then(function(card) {
                                return expect(card.isDisplayed()).to.eventually.equal(true);
                            })
                            .then(function next() {
                                return paginator.next();
                            });
                    };
                }));
            });
        });
    });
}());
