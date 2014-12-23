module.exports = function(browser) {
    'use strict';

    var utils = require('../../../../utils/utils');

    var Splash = require('../../modules/Splash'),
    Article = require('./Article'),
    Ballot = require('./Ballot');

    var splash = new Splash(browser),
    article = new Article(browser);

    var self = this;

    function Source(source, href, card) {
        var self = this;
        this.text = source ? ('via ' + source) : null;
        this.href = href || null;
        this.selector = '.card__attributes';
        this.link = {
            selector: 'a',
            get: function() {
                var selector = this.selector;

                return self.get()
                .then(function(source) {
                    return source.findElement({
                        css: selector
                    });
                });
            }
        };
        this.get = utils.getMethod(card, this.selector);
    }

    function Title(text, card) {
        this.text = text || null;
        this.selector = 'h1.card__title';
        this.get = utils.getMethod(card, this.selector);
    }

    function Player(card) {
        //this.selector = '.player__group';
        this.selector = 'youtube-player.playerBox';
        this.get = utils.getMethod(card, this.selector);
        //this.click = utils.mouseClickMethod(this, browser);
        this.click = utils.clickMethod(this, browser);
    }

    function PlayButton(card) {
        this.selector = 'button.player__playBtn';
        this.get = utils.getMethod(card, this.selector);
        this.click = utils.clickMethod(this, browser);
    }

    function Card(title, source, index) {
        this.title = new Title(title, this);
        this.playButton = new PlayButton(this);
        this.player = new Player(this);
        this.ballot = new Ballot(browser, this);
        this.source = source ? new Source(source.source, source.href, this) : null;
        this.index = index;
    }
    Card.prototype = {
        get: function() {
            return self.getCard(self.cards.indexOf(this));
        }
    };

    function AdCard() {

    }
    AdCard.prototype = {
        get: function() {
            return self.getAdCard();
        }
    };

    function RecapCard(index) {
        this.index = index;
    }
    RecapCard.prototype = {
        get: function() {
            return self.getCard(self.cards.indexOf(this));
        }
    };

    splash.exp = article.exp;

    this.cards = [
    new Card('Sergio Flores', {
        source: 'YouTube',
        href: 'https://www.youtube.com/watch?v=GaoLU6zKaws'
    }, 0),
    new AdCard(),
    new Card('Epic Sax Guy', {
        source: 'YouTube',
        href: 'https://www.youtube.com/watch?v=gy1B3agGNxw'
    }, 1),
    new AdCard(),
    new Card('Sunstroke Project', {
        source: 'YouTube',
        href: 'https://www.youtube.com/watch?v=UQBc2RcbTHo'
    }, 2),
    new RecapCard(3)
    ];

    this.isAdCard = function(card) {
        return (card instanceof AdCard);
    };

    this.getCard = function(cardNum) {
        var card = self.cards[cardNum];
        if (self.isAdCard(card)) {
            return this.getAdCard();
        } else {
            return browser.findElements({
                css: 'ul.cards__list>li'
            })
            .then(function(lis) {
                return lis[card.index];
            });
        }
    };

    this.getAdCard = function() {
        return browser.findElements({
            css: 'ul.cards__list>li'
        })
        .then(function(lis) {
            return lis[4];
        });
    };

    this.get = function() {
        return splash.get()
        .then(function() {
            return splash.click();
        })
        .then(function() {
            return browser.findElement({
                css: '.' + splash.className
            });
        })
        .then(function(element) {
            return element.findElement({
                tagName: 'iframe'
            });
        })
        .then(function(iframe) {
            return browser.switchTo().frame(iframe);
        });
    };

    this.waitForAd = function() {
        return browser.wait(function() {
            return browser.findElement({
                css: 'div.adSkip__group'
            })
            .then(function(adSkip) {
                return adSkip.isDisplayed();
            })
            .then(function(isDisplayed) {
                return !isDisplayed;
            });
        });
    };

};
