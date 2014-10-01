(function() {
    'use strict';

    var browser = require('../browser'),
        expect = require('chai').expect,
        chain = require('../../../utils/promise').chain;

    var Article = require('./modules/Article'),
        MRPlayer = require('./modules/MRPlayer'),
        Paginator = require('./modules/Paginator'),
        Splash = require('../modules/Splash'),
        Lightbox = require('./modules/Lightbox');

    var article = new Article(browser),
        mrPlayer = new MRPlayer(browser),
        paginator = new Paginator(browser),
        splash = new Splash(browser),
        lightbox = new Lightbox(browser);

    splash.exp = article.exp;

    describe(browser.browserName + ' MiniReel Player [lightbox]: Lightbox', function() {

        beforeEach(function() {
            return article.get();
        });

        describe('the close button', function() {
            beforeEach(function() {
                return mrPlayer.get()
                    .then(function() {
                        return lightbox.closeButton.click();
                    })
                    .then(function() {
                        return browser.switchTo().defaultContent();
                    });
            });

            it('should hide the iframe', function() {
                return splash.iframe.get()
                    .then(function(iframe) {
                        return expect(iframe.isDisplayed()).to.eventually.equal(false);
                    });
            });

        });

        describe('the title', function() {

            it('should be displayed', function() {
                return article.title.get()
                    .then(function(element) {
                        return expect(element.isDisplayed()).to.eventually.equal(true);
                    });
            });

            describe('when it is clicked', function() {

                beforeEach(function() {
                    return article.title.click()
                        .then(function() {
                            return browser.wait(function() {
                                return splash.iframe.get()
                                    .then(function(iframe) {
                                        return iframe.isDisplayed();
                                    });
                            });
                        })
                        .then(function() {
                            return splash.iframe.get();
                        })
                        .then(function(iframe) {
                            return browser.switchTo().frame(iframe);
                        });
                });

                it('should show the first video card', function() {
                    return mrPlayer.getCard(0)
                        .then(function(element) {
                            return expect(element.isDisplayed()).to.eventually.equal(true);
                        });
                });

            });
        });



    });
}());
