(function() {
    'use strict';

    var browser = require('../browser'),
    expect = require('chai').expect,
    Q = require('q');

    var Splash = require('../modules/Splash'),
    Article = require('./modules/Article');

    var article = new Article(browser),
    splash = new Splash(browser);

    describe(2, browser.browserName + ' MiniReel Player [lightbox]: Splash Page', function() {

        var self = this;
        this.beforeEach = function() {
            splash.exp = article.exp;

            return article.get()
            .then(function() {
                return splash.get();
            });
        };

        it('should be displayed', function() {
            return self.beforeEach()
            .then(function() {
                return expect('.' + splash.className).dom.to.be.visible();
            });
        });

        describe('when you mouse over', function() {
            var self = this;
            this.beforeEach = function() {
                return self.parent.beforeEach()
                .then(function() {
                    return splash.mouseOver();
                });
            };

            it('should preload the iframe', function() {
                return self.beforeEach()
                .then(function() {
                    return Q.all([
                        expect('.' + splash.className + ' iframe').dom.not.to.be.visible()
                        ]);
                    });
                });
            });

            describe('clicking', function() {
                var self = this;
                this.beforeEach = function() {
                    return self.parent.beforeEach()
                    .then(function() {
                        return splash.click();
                    });
                };

                it('should show the iframe', function() {
                    return self.beforeEach()
                    .then(function() {
                        return expect('.' + splash.className + ' iframe').dom.to.be.visible();
                    });
                });
            });
        });
    }());
