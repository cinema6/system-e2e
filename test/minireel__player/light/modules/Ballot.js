'use strict';

module.exports = function Ballot(browser, card) {

    var utils = require('../../../../utils/utils');

    function VoteWatchAgain(vote) {
        this.selector = 'p.ballot__watch-again a';
        this.get = utils.getMethod(vote, this.selector);
        this.click = utils.clickMethod(this, browser);
    }

    function ShowResults(vote) {
        this.selector = 'p.ballot__results a';
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
        this.click = utils.clickMethod(this, browser);//, 3000);
    }

    function VoteCloseButton(vote) {
        this.selector = '.overlay button';
        this.get = utils.getMethod(vote, this.selector);
        this.click = utils.clickMethod(this, browser);
    }

    function VoteModule() {
        this.watchAgain = new VoteWatchAgain(this);
        this.showResults = new ShowResults(this);
        this.header = new Header(this);
        this.voteButton = new VoteButton(this);
        this.closeButton = new VoteCloseButton(this);
        this.controls = [this.watchAgain, this.showResults, this.header, this.voteButton, this.closeButton];
        this.selector = 'ballot-vote-module.ballot-module';
        this.get = utils.getMethod(card, this.selector);
        this.click = utils.mouseClickMethod(this, browser)
    }

    function ResultsWatchAgain(results) {
        this.selector = 'p.results__watch-again a';
        this.get = utils.getMethod(results, this.selector);
        this.click = utils.clickMethod(this, browser);
    }

    function ResultsCloseButton(results) {
        this.selector = 'button.results__close';
        this.get = utils.getMethod(results, this.selector);
        this.click = utils.clickMethod(this, browser);
    }

    function ResultsTally(results, index) {
        this.selector = 'li.results__item' + index + ' p.results__tally';
        this.get = utils.getMethod(results, this.selector);
    }

    function ResultsModule() {
        this.watchAgain = new ResultsWatchAgain(this);
        this.closeButton = new ResultsCloseButton(this);
        this.tally = [new ResultsTally(this, 0), new ResultsTally(this, 1)];
        this.controls = [this.watchAgain, this.closeButton, this.tally[0], this.tally[1]];
        this.selector = 'ballot-results-module.results-module';
        this.get = utils.getMethod(card, this.selector);
        this.click = utils.mouseClickMethod(this, browser);
    }

    this.vote = new VoteModule();
    this.results = new ResultsModule();

};
