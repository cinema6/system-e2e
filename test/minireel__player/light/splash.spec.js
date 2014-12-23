(function() {
    'use strict';

    var browser = require('../browser'),
        expect = require('chai').expect;

    var Splash = require('../modules/Splash'),
        Article = require('./modules/Article');

    var article = new Article(browser),
        splash = new Splash(browser);

    describe(2, browser.browserName + ' MiniReel Player [light]: Splash Page', function() {
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

        it('should preload the iframe', function() {
          return self.beforeEach()
          .then(function() {
            return browser.wait(function() {
              return browser.findElement({ className: splash.className })
              .isElementPresent({ tagName: 'iframe' });
            }, 3000);
          })
          .then(function() {
            return expect('.' + splash.className + ' iframe').dom.not.to.be.visible();
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
