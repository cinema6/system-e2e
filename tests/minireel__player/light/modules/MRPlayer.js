module.exports = function(browser) {
    'use strict';

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

        this.get = function() {
            var selector = this.selector;

            return card.get()
                .then(function(card) {
                    return card.findElement({ css: selector });
                });
        };
    }

    function Title(text, card) {
        this.text = text || null;
        this.selector = '.mr-card__title-h1';

        this.get = function() {
            var selector = this.selector;

            return card.get()
                .then(function(card) {
                    return card.findElement({ css: selector });
                });
        };
    }

    function DropDown(card) {
        this.selector = '.mr-card__title>button';

        this.get = function() {
            var selector = this.selector;

            return card.get()
                .then(function(card) {
                    return card.findElement({ css: selector });
                });
        };
    }
    DropDown.prototype = {
        hover: function() {
            return this.get()
                .then(function(button) {
                    return browser.actions()
                        .mouseMove(button)
                        .perform();
                })
                .then(function() {
                    return browser.sleep(1500);
                });
        },
        leave: function() {
            return this.get()
                .then(function(button) {
                    return browser.actions()
                        .mouseMove(button, {
                            x: -25,
                            y: -25
                        })
                        .perform();
                })
                .then(function() {
                    return browser.sleep(1500);
                });
        }
    };

    function Card(title, source) {
        this.title = new Title(title, this);
        this.dropDown = new DropDown(this);
        this.source = source ? new Source(source.source, source.href, this) : null;
    }
    Card.prototype = {
        get: function() {
            return self.getCard(self.cards.indexOf(this));
        }
    };

    splash.exp = article.exp;

    this.cards = [
        new Card('Sergio Flores', {
            source: 'YouTube',
            href: 'https://www.youtube.com/watch?v=GaoLU6zKaws'
        }),
        new Card(),
        new Card('Epic Sax Guy', {
            source: 'YouTube',
            href: 'https://www.youtube.com/watch?v=gy1B3agGNxw'
        }),
        new Card(),
        new Card('Sunstroke Project', {
            source: 'YouTube',
            href: 'https://www.youtube.com/watch?v=UQBc2RcbTHo'
        }),
        new Card()
    ];

    this.getCard = function(index) {
        return browser.findElements({ css: 'ul.mr-cards__list>li' })
            .then(function(lis) {
                return lis[index];
            });
    };

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
