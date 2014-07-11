module.exports = function(browser) {
    'use strict';

    var webdriver = require('selenium-webdriver'),
        utils = require('../../../../utils/utils');

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
        this.selector = 'span.mr-card__attributes';
        this.link = {
            selector: 'a',
            get: function() {
                var selector = this.selector;

                return self.get()
                    .then(function(source) {
                        return source.findElement({ css: selector });
                    });
            }
        };
        this.get = utils.getMethod(card, this.selector);
    }

    function Title(text, card) {
        this.text = text || null;
        this.selector = 'h1.mr-card__title';
        this.get = utils.getMethod(card, this.selector);
    }

    function PlayButton(card) {
        this.selector = 'button.mr-player__play-btn';
        this.get = utils.getMethod(card, this.selector);
        this.click = utils.clickMethod(this, browser);
    }

    function Player(card) {
        this.selector = '.mr-player__group,iframe';
        this.get = utils.getMethod(card, this.selector);
        this.click = utils.mouseClickMethod(this, browser);
    }
    Player.prototype = {
        skipToEnd: function() {
            return this.get()
                .then(function(element) {
                    return element.sendKeys(webdriver.Key.END);
                })
                .then(function() {
                    return browser.sleep(2000);
                });
        }
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

    splash.exp = article.exp;

    this.cards = [
        new Card('Sergio Flores', {
            source: 'YouTube',
            href: 'https://www.youtube.com/watch?v=GaoLU6zKaws'
        },0),
        new AdCard(),
        new Card('Epic Sax Guy', {
            source: 'YouTube',
            href: 'https://www.youtube.com/watch?v=gy1B3agGNxw'
        },1),
        new AdCard(),
        new Card('Sunstroke Project', {
            source: 'YouTube',
            href: 'https://www.youtube.com/watch?v=UQBc2RcbTHo'
        },2),
        new Card(null,null,3)
    ];

    this.isAdCard = function (card){
        return (card instanceof AdCard);
    }

    this.getCard = function(cardNum) {
        var card = this.cards[cardNum];
        if (this.isAdCard(card)){
            return this.getAdCard();
         } else {
             return browser.findElements({ css: 'ul.mr-cards__list>li' })
                 .then(function(lis) {
                     return lis[card.index];
                 });
        }
    };

    this.getAdCard = function() {
        return browser.findElements({ css: 'ul.mr-cards__list>li' })
            .then(function(lis) {
                return lis[4];
            });
    }

    this.get = function() {
        splash.get();
        splash.click();
        return browser.findElement({ id: splash.id })
            .then(function(element) {
                return element.findElement({ tagName: 'iframe' });
            })
            .then(function(iframe) {
                return browser.switchTo().frame(iframe);
            });
    };
};
