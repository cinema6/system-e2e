(function() {
    'use strict';

    var browser = require('../browser'),
    expect = require('chai').expect,
    chain = require('../../../utils/promise').chain;

    var Article = require('./modules/Article'),
    MRPlayer = require('./modules/MRPlayer');

    var article = new Article(browser),
    mrPlayer = new MRPlayer(browser);

    describe(2, browser.browserName + ' MiniReel Player [light]: Video Card Ballot', function() {
        var card;
        var ballot;

        var self = this;
        this.beforeEach = function() {
            return article.get()
            .then(mrPlayer.get)
            .then(function() {
                card = mrPlayer.cards[0];
                ballot = card.ballot;
                // Click the play button
                return card.player.click()
                .then(function() {
                    // Wait until the play button is no longer displayed
                    return browser.wait(function() {
                        return card.playButton.get()
                        .then(function(playButton) {
                            return playButton.isDisplayed();
                        })
                        .then(function(isDisplayed) {
                            return !isDisplayed;
                        });
                    }, 10000);
                });
            });
        };

        it('should not be shown initially', function() {
            return self.beforeEach()
            .then(function() {
                return ballot.vote.get();
            })
            .then(function(element) {
                return expect(element.isDisplayed()).to.eventually.equal(false);
            });
        });

        describe('when the player is clicked', function() {
            var self = this;
            this.beforeEach = function() {
                this.timeout(120000);
                return self.parent.beforeEach()
                .then(function() {
                    return browser.sleep(3000);
                })
                .then(function() {
                    return card.player.click()
                })
                .then(function() {
                    return browser.wait(function() {
                        return ballot.vote.closeButton.get()
                        .then(function(closeButton) {
                            return closeButton.isDisplayed();
                        });
                    }, 10000);
                });
            };

            it('should show the ballot vote-module and its controls', function() {
                return self.beforeEach()
                .then(function() {
                    return ballot.vote.get();
                })
                .then(function(element) {
                    return expect(element.isDisplayed()).to.eventually.equal(true);
                })
                .then(function() {
                    return chain(ballot.vote.controls.map(function(control) {
                        return function() {
                            return control.get()
                            .then(function(element) {
                                return expect(element.isDisplayed()).to.eventually.equal(true);
                            });
                        };
                    }));
                });
            });

            describe('when the close button is clicked', function() {
                var self = this;
                this.beforeEach = function() {
                    return self.parent.beforeEach()
                    .then(function() {
                        return ballot.vote.closeButton.click();
                    });
                };

                it('should hide the ballot vote-module', function() {
                    return self.beforeEach()
                    .then(function() {
                        return browser.wait(function() {
                            return ballot.vote.get()
                            .then(function(element) {
                                return element.isDisplayed();
                            })
                            .then(function(isDisplayed) {
                                return !isDisplayed;
                            });
                        }, 5000);
                    })
                    .then(function() {
                        return ballot.vote.get();
                    })
                    .then(function(element) {
                        return expect(element.isDisplayed()).to.eventually.equal(false);
                    });
                });

            });

            describe('when the ballot vote-module overlay is clicked', function() {
                var self = this;
                this.beforeEach = function() {
                    return self.parent.beforeEach()
                    .then(function() {
                        return ballot.vote.click();
                    });
                };

                it('should hide the ballot vote-module when the overlay is clicked after a second', function() {
                    return self.beforeEach()
                    .then(function() {
                        return browser.wait(function() {
                            return ballot.vote.get()
                            .then(function(element) {
                                return element.isDisplayed();
                            })
                            .then(function(isDisplayed) {
                                return !isDisplayed;
                            });
                        }, 5000);
                    })
                    .then(function() {
                        return ballot.vote.get();
                    })
                    .then(function(element) {
                        return expect(element.isDisplayed()).to.eventually.equal(false);
                    });
                });

            });

            describe('when the watch again link is clicked', function() {
                var self = this;
                this.beforeEach = function() {
                    return self.parent.beforeEach()
                    .then(function() {
                        return ballot.vote.watchAgain.click();
                    });
                };

                it('should hide the ballot vote-module after a second', function() {
                    return self.beforeEach()
                    .then(function() {
                        return browser.sleep(1000);
                    })
                    .then(function() {
                        return ballot.vote.get();
                    })
                    .then(function(element) {
                        return expect(element.isDisplayed()).to.eventually.equal(false);
                    });
                });

            });

            describe('when the show results link is clicked', function() {
                var self = this;
                this.beforeEach = function() {
                    return self.parent.beforeEach()
                    .then(function() {
                        return ballot.vote.showResults.click();
                    });
                };

                it('should show the ballot results-module', function() {
                    return self.beforeEach()
                    .then(function() {
                        return ballot.results.get();
                    })
                    .then(function(element) {
                        return expect(element.isDisplayed()).to.eventually.equal(true);
                    });
                });

            });

            describe('when one of the vote buttons are clicked', function() {
                var self = this;
                this.beforeEach = function() {
                    return self.parent.beforeEach()
                    .then(function() {
                        return ballot.vote.voteButton.click();
                    });
                };

                it('should hide the ballot vote-module and its controls after a second', function() {
                    return self.beforeEach()
                    .then(function() {
                        return browser.sleep(1000);
                    })
                    .then(function() {
                        return ballot.vote.get();
                    })
                    .then(function(element) {
                        return expect(element.isDisplayed()).to.eventually.equal(false);
                    })
                    .then(function() {
                        return chain(ballot.vote.controls.map(function(control) {
                            return function() {
                                return control.get()
                                .then(function(element) {
                                    return expect(element.isDisplayed()).to.eventually.equal(false);
                                });
                            };
                        }));
                    });
                });

                it('should show the ballot results-module and its controls', function() {
                    return self.beforeEach()
                    .then(function() {
                        return ballot.results.get();
                    })
                    .then(function(element) {
                        return expect(element.isDisplayed()).to.eventually.equal(true);
                    })
                    .then(function() {
                        return chain(ballot.results.controls.map(function(control) {
                            return function() {
                                return control.get()
                                .then(function(element) {
                                    return expect(element.isDisplayed()).to.eventually.equal(true);
                                });
                            };
                        }));
                    });
                });

                it('should have valid percentage values for the tallies', function() {
                    return self.beforeEach()
                    .then(function() {
                        return chain(ballot.results.tally.map(function(tally) {
                            return function() {
                                return tally.get()
                                .then(function(element) {
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
                });

                describe('when the close button is clicked', function() {
                    var self = this;
                    this.beforeEach = function() {
                        return self.parent.beforeEach()
                        .then(function() {
                            return ballot.results.closeButton.click();
                        });
                    };

                    it('should hide the ballot results-module after a second', function() {
                        return self.beforeEach()
                        .then(function() {
                            return browser.sleep(1000);
                        })
                        .then(function() {
                            return ballot.results.get();
                        })
                        .then(function(element) {
                            return expect(element.isDisplayed()).to.eventually.equal(false);
                        });
                    });

                    describe('when the ballot reappears', function() {
                        var self = this;
                        this.beforeEach = function() {
                            return self.parent.beforeEach()
                            .then(function() {
                                // Make sure the module is done fading out
                                return browser.wait(function() {
                                    return ballot.results.get()
                                    .then(function(resultsModule) {
                                        return resultsModule.isDisplayed();
                                    })
                                    .then(function(isDisplayed) {
                                        return !isDisplayed;
                                    });
                                }, 5000);
                            })
                            .then(function() {
                                return card.playButton.click();
                            })
                            .then(function() {
                                return card.player.click();
                            });
                        };

                        it('should show the ballot results-module and not the vote-module', function() {
                            return self.beforeEach()
                            .then(function() {
                                return ballot.vote.get();
                            })
                            .then(function(element) {
                                return expect(element.isDisplayed()).to.eventually.equal(false);
                            })
                            .then(function() {
                                return ballot.results.get();
                            })
                            .then(function(element) {
                                return expect(element.isDisplayed()).to.eventually.equal(true);
                            });
                        });

                    });

                });

                // Change this to fit the new mocha retry style
                // describe.only('when the ballot results-module overlay is clicked', function() {
                //
                //     beforeEach(function() {
                //         return ballot.results.click();
                //     });
                //
                //     it('should hide the ballot results-module after a second', function() {
                //         return browser.sleep(1000)
                //             .then(function() {
                //                 return ballot.results.get();
                //             })
                //             .then(function(element) {
                //                 return expect(element.isDisplayed()).to.eventually.equal(false);
                //             });
                //     });
                //
                // });

                describe('when the watch again link is clicked', function() {
                    var self = this;
                    this.beforeEach = function() {
                        return self.parent.beforeEach()
                        .then(function() {
                            return ballot.results.watchAgain.click();
                        });
                    };

                    it('should hide the ballot vote-module after a second', function() {
                        return self.beforeEach()
                        .then(function() {
                            return browser.sleep(1000);
                        })
                        .then(function() {
                            return ballot.results.get();
                        })
                        .then(function(element) {
                            return expect(element.isDisplayed()).to.eventually.equal(false);
                        });
                    });

                });

            });

        });
    });
}());
