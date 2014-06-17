module.exports = function(browser) {
    'use strict';

    var Splash = require('../../modules/Splash'),
        Article = require('./Article');

    var splash = new Splash(browser),
        article = new Article(browser);

    splash.exp = article.exp;

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
