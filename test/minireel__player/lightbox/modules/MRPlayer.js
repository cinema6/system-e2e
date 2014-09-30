module.exports = function(browser) {
    'use strict';

    var utils = require('../../../../utils/utils');

    var Splash = require('../../modules/Splash'),
        Article = require('./Article');

    var splash = new Splash(browser),
        article = new Article(browser);

    var self = this;

    function Source(source, href, card) {
        var self = this;
        this.text = source ? ('via ' + source) : null;
        this.href = href || null;
        this.selector = '.mr-card__attributes';
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

    function Description(text, card) {
        this.text = text || null;
        this.selector = '.mr-card__desc';
        this.get = utils.getMethod(card, this.selector);
    }

    function Title(text, card) {
        this.text = text || null;
        this.selector = 'h1.mr-card__title';
        this.get = utils.getMethod(card, this.selector);
    }

    function Player(card) {
        this.selector = '.mr-player,iframe';
        this.get = utils.getMethod(card, this.selector);
        this.click = utils.mouseClickMethod(this, browser, 2000);
        this.watchVideo = function() {
            var time = (card.duration + 5) * 1000;
            return browser.sleep(time);
        }
    }

    function RecapButtons(recapCard) {
        this.selector = 'ul.mr-recap__list button.mr-recap__imgBtn';
        this.getButton = function(i) {
            var selector = this.selector;
            return recapCard.get()
                .then(function(element) {
                    return element.findElements({ css: selector });
                })
                .then(function(elements) {
                    return elements[i];
                });
        }
    }
    RecapButtons.prototype = {
        clickButton: function(i) {
            var self = this;
            var visibleElement;
            return browser.wait(function() {
                return self.getButton(i)
                    .then(function(e) {
                        visibleElement = e;
                        return e.isDisplayed();
                    });
            })
            .then(function() {
                return visibleElement.click();
            });
        }
    }

    function Card(title, source, duration, description, index) {
        this.title = new Title(title, this);
        this.source = source ? new Source(source.source, source.href, this) : null;
        this.duration = duration;
        this.description = new Description(description, this);
        this.index = index;
        this.player = new Player(this);
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
        this.buttons = new RecapButtons(this);
    }
    RecapCard.prototype = {
        get: function() {
            return self.getCard(self.cards.indexOf(this));
        }
    }

    splash.exp = article.exp;

    this.cards = [
        new Card('True Facts About The Mantis Shrimp',
            {
                source: 'YouTube',
                href: 'https://www.youtube.com/watch?v=F5FEj9U-CJM'
            },
            240,
            'Here we have true facts about the mantis shrimp.',
            0),
        new Card('Mantis Shrimp Solves a Rubiks Cube',
            {
                source: 'YouTube',
                href: 'https://www.youtube.com/watch?v=0uTdTRXNdEY'
            },
            40,
            'This highly intelligent stomatopod does the unthinkable and solves a Rubiks cube in record time.',
            1),
        new AdCard(),
        new Card('Mantis Shrimp Punches Hole in Clam',
            {
                source: 'YouTube',
                href: 'https://www.youtube.com/watch?v=i-ahuZEvWH8'
            },
            30,
            '...',
            2),
        new RecapCard(3)
    ];

    this.isAdCard = function (card){
        return (card instanceof AdCard);
    }

    this.getCard = function(cardNum) {
        // Make sure the card number argument is valid
        if (cardNum < 0 || cardNum >= this.cards.length) {
            throw new Error('Specified card is invalid.');
        }
        // Get the requested card
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
    };

    this.get = function() {
        return splash.get()
            .then(function() {
                splash.click();
            })
            .then(function() {
                return browser.findElement({ css: '.' + splash.className })
            })
            .then(function(element) {
                return element.findElement({ tagName: 'iframe' });
            })
            .then(function(iframe) {
                return browser.switchTo().frame(iframe);
            });
    };
};
