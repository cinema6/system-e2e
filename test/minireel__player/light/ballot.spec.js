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

    describe('MiniReel Player [light]: Video Card Ballot', function() {
        var card;
        var ballot;

        beforeEach(function() {
            return article.get()
                .then(function() {
                    return mrPlayer.get();
                })
                .then(function() {
                    card = mrPlayer.cards[0];
                    ballot = card.ballot;
                    return card.playButton.click();
                });
        });

        it('should not be shown initially', function() {
            return ballot.vote.get()
                .then(function(element) {
                    return expect(element.isDisplayed()).to.eventually.equal(false);
                });
        });

        // Possible future test
        // describe('when the end of the video is reached', function() {
        //     beforeEach(function() {
        //         return card.player.skipToEnd();
        //     });

        //     it('should show the ballot vote-module', function() {
        //         return ballot.vote.get()
        //             .then(function(element) {
        //                 return expect(element.isDisplayed()).to.eventually.equal(true);
        //             });
        //     });
        // });

        describe('when the player is clicked', function() {

            beforeEach(function() {
                return card.player.click();
            });

            it('should show the ballot vote-module and its controls', function() {
                return ballot.vote.get()
                    .then(function(element) {
                        return expect(element.isDisplayed()).to.eventually.equal(true);
                    })
                    .then(function() {
                        return chain(ballot.vote.controls.map(function(control) {
                            return function() {
                                return control.get()
                                    .then(function(element){
                                        return expect(element.isDisplayed()).to.eventually.equal(true);
                                    });
                            };
                        }));
                    });
            });

            describe('when the close button is clicked', function() {

                beforeEach(function() {
                    return ballot.vote.closeButton.click();
                });

                it('should hide the ballot vote-module', function() {
                    return ballot.vote.get()
                        .then(function(element) {
                            return expect(element.isDisplayed()).to.eventually.equal(false);
                        });
                });

            });

            describe('when the ballot vote-module overlay is clicked', function() {

                beforeEach(function() {
                    return ballot.vote.click();
                });

                it('should hide the ballot vote-module when the overlay is clicked', function() {
                    return ballot.vote.get()
                        .then(function(element) {
                            return expect(element.isDisplayed()).to.eventually.equal(false);
                        });
                });

            });

            describe('when the watch again link is clicked', function() {

                beforeEach(function() {
                    return ballot.vote.watchAgain.click();
                });

                it('should hide the ballot vote-module', function() {
                    return ballot.vote.get()
                        .then(function(element) {
                            return expect(element.isDisplayed()).to.eventually.equal(false);
                        });
                });

            });

            describe('when the show results link is clicked', function() {

                beforeEach(function() {
                    return ballot.vote.showResults.click();
                });

                it('should show the ballot results-module', function() {
                    return ballot.results.get()
                        .then(function(element) {
                            return expect(element.isDisplayed()).to.eventually.equal(true);
                        });
                });

            });

            describe('when one of the vote buttons are clicked', function() {

                beforeEach(function() {
                    return ballot.vote.voteButton.click();
                });

                it('should hide the ballot vote-module and its controls', function() {
                    return ballot.vote.get()
                        .then(function(element) {
                            return expect(element.isDisplayed()).to.eventually.equal(false);
                        })
                        .then(function() {
                            return chain(ballot.vote.controls.map(function(control) {
                                return function() {
                                    return control.get()
                                        .then(function(element){
                                            return expect(element.isDisplayed()).to.eventually.equal(false);
                                        });
                                };
                            }));
                        });
                });

                it('should show the ballot results-module and its controls', function() {
                    return ballot.results.get()
                        .then(function(element) {
                            return expect(element.isDisplayed()).to.eventually.equal(true);
                        })
                        .then(function() {
                            return chain(ballot.results.controls.map(function(control) {
                                return function() {
                                    return control.get()
                                       .then(function(element){
                                            return expect(element.isDisplayed()).to.eventually.equal(true);
                                        });
                                };
                            }));
                        });
                });

                it('should have valid percentage values for the tallies', function() {
                    return chain(ballot.results.tally.map(function(tally) {
                        return function() {
                            return tally.get()
                                .then(function(element){
                                    // Regex explanation:
                                    // 100 or 
                                    // an optional non-zero digit followed by a digit
                                    // all followed by %
                                    return expect(element.getText()).to.eventually
                                        .match(/(100|[1-9]?\d)%/g);
                                });
                        };
                    }));
                });

                describe('when the close button is clicked', function() {

                    beforeEach(function() {
                        return ballot.results.closeButton.click();
                    });

                    it('should hide the ballot results-module', function() {
                        return ballot.results.get()
                            .then(function(element) {
                                return expect(element.isDisplayed()).to.eventually.equal(false);
                            });
                    });

                    describe('when the ballot reappears', function() {
                        beforeEach(function() {
                            return card.playButton.click()
                                .then(function() {
                                    return card.player.click();
                                });
                        });

                        it('should not show the ballot vote-module', function() {
                            return ballot.vote.get()
                                .then(function(element) {
                                    return expect(element.isDisplayed()).to.eventually.equal(false);
                                });
                        });

                        it('should show the ballot results-module', function() {
                            return ballot.results.get()
                                .then(function(element) {
                                    return expect(element.isDisplayed()).to.eventually.equal(true);
                                });
                        });

                    });

                });

                describe('when the ballot results-module overlay is clicked', function() {

                    beforeEach(function() {
                        return ballot.results.click();
                    });

                    it('should hide the ballot results-module', function() {
                        return ballot.results.get()
                            .then(function(element) {
                                return expect(element.isDisplayed()).to.eventually.equal(false);
                            });
                    });

                });

                describe('when the watch again link is clicked', function() {

                    beforeEach(function() {
                        return ballot.results.watchAgain.click();
                    });

                    it('should hide the ballot vote-module', function() {
                        return ballot.results.get()
                            .then(function(element) {
                                return expect(element.isDisplayed()).to.eventually.equal(false);
                            });
                    });

                });

            });

        });
    });
}());

