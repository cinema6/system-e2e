(function() {
    'use strict';

    var browser = require('../browser'),
        expect = require('chai').expect,
        Q = require('q');

    var Splash = require('../modules/Splash'),
        Article = require('./modules/Article');

    var article = new Article(browser),
        splash = new Splash(browser);

    describe(browser.browserName + ' MiniReel Player [light]: Splash Page', function() {

        beforeEach(function() {
            splash.exp = article.exp;

            return article.get()
                .then(function() {
                    return splash.get();
                });
        });

        it('should be displayed', function() {
            return expect('.' + splash.className).dom.to.be.visible();
        });

        it('should preload the iframe', function() {
            return Q.all([
                expect(browser.findElement({ className: splash.className }).isElementPresent({ tagName: 'iframe' })).to.eventually.equal(true),
                expect('.' + splash.className + ' iframe').dom.not.to.be.visible()
            ]);
        });

        describe('clicking', function() {
            beforeEach(function() {
                return splash.click();
            });

            it('should show the iframe', function() {
                return expect('.' + splash.className + ' iframe').dom.to.be.visible();
            });
        });
    });
}());
