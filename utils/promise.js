(function() {
    'use strict';

    var Q = require('q');

    exports.chain = function(fns) {
        return fns.reduce(function(promise, next) {
            return promise.then(next);
        }, Q.when());
    };


    exports.promiseWhile = function(condition, body) {
        var deferred = Q.defer();
        function loop() {
        if (!condition()) return deferred.resolve();
            Q.when(body(), loop, deferred.reject);
        }
        Q.nextTick(loop);
        return deferred.promise;
    }

}());
