(function() {
    'use strict';

    var Q = require('q');

    exports.chain = function(fns) {
        return fns.reduce(function(promise, next) {
            return promise.then(next);
        }, Q.when());
    };
}());
