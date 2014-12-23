module.exports = function Ballot(browser, card) {
  'use strict';

    var utils = require('../../../../utils/utils');

    function VoteWatchAgain(vote) {
        this.selector = 'a.ballot__textLink--replay';
        this.get = utils.getMethod(vote, this.selector);
        this.click = utils.clickMethod(this, browser);
    }

    function ShowResults(vote) {
        this.selector = 'a.ballot__textLink--results';
        this.get = utils.getMethod(vote, this.selector);
        this.click = utils.clickMethod(this, browser);
    }

    function Header(vote) {
        this.selector = 'h2.ballot__title';
        this.get = utils.getMethod(vote, this.selector);
    }

    function VoteButton(vote) {
        this.selector = 'button.ballot__btn0';
        this.get = utils.getMethod(vote, this.selector);
        this.click = utils.clickMethod(this, browser);
    }

    function VoteCloseButton(vote) {
        this.selector = '.overlay button';
        this.get = utils.getMethod(vote, this.selector);
        this.click = utils.clickMethod(this, browser);
    }

    function VoteModule() {
        var self = this;
        this.watchAgain = new VoteWatchAgain(this);
        this.showResults = new ShowResults(this);
        this.header = new Header(this);
        this.voteButton = new VoteButton(this);
        this.closeButton = new VoteCloseButton(this);
        this.controls = [this.watchAgain, this.showResults, this.header, this.voteButton, this.closeButton];
        this.selector = 'ballot-vote-module';
        this.get = utils.getMethod(card, this.selector);

        // This click function is used to click the vote module overlay
        this.click = function() {
          return self.get()
              .then(function(voteModule) {
                  return voteModule.getLocation();
              })
              .then(function(location) {
                  var clickLocation = {
                      x: location.x + 50,
                      y: location.y + 50
                  };
                  return browser.actions()
                      .mouseMove(clickLocation)
                      .mouseDown()
                      .mouseUp()
                      .perform();
              });
        };
    }

    function ResultsWatchAgain(results) {
        this.selector = 'a.ballot__textLink--replay';
        this.get = utils.getMethod(results, this.selector);
        this.click = utils.clickMethod(this, browser);
    }

    function ResultsCloseButton(results) {
        this.selector = 'button.overlay__closeBtn';
        this.get = utils.getMethod(results, this.selector);
        this.click = utils.clickMethod(this, browser);
    }

    function ResultsTally(results, index) {
        this.selector = 'div.ballot__result' + index;
        this.get = utils.getMethod(results, this.selector);
    }

    function ResultsModule() {
        var self = this;
        this.watchAgain = new ResultsWatchAgain(this);
        this.closeButton = new ResultsCloseButton(this);
        this.tally = [new ResultsTally(this, 0), new ResultsTally(this, 1)];
        this.controls = [this.watchAgain, this.closeButton, this.tally[0], this.tally[1]];
        this.selector = 'ballot-results-module';
        this.get = utils.getMethod(card, this.selector);

        // This click function is used to click the vote module overlay
        this.click = function() {
            return self.get()
                .then(function(resultsModule) {
                    return resultsModule.getLocation();
                })
                .then(function(location) {
                    var clickLocation = {
                        x: location.x + 50,
                        y: location.y + 50
                    };
                    return browser.actions()
                        .mouseMove(clickLocation)
                        .mouseDown()
                        .mouseUp()
                        .perform();
                    });
                };
      }

    this.vote = new VoteModule();
    this.results = new ResultsModule();

};
