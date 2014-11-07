/*
 * dv.deferred.js v0.1
 *
 * Copyright 2014 by Mykhaylo Gavrylyuk, https://github.com/mcmlxxxiii
 * Licensed under the MIT license
 *
 * Date: Sun Jul 6, 2014
 */

var dv,
  u, module, cjs = module != u && !!module.require;


if (cjs) {
  dv = module.require('./dv');
} else {
  dv = window.dv;
}


var deferred = (function (dv) {

  function deferred() {
    var dd = {},
      prom = {},
      dvState = dv([ 'pending' ]);

    function resolve() {
      if (dd.state() === 'pending') {
        dvState.value = [ 'resolved', null, Array.prototype.slice.apply(arguments) ];
      }
      return this;
    };

    function resolveWith() {
      if (dd.state() === 'pending') {
        var args = arguments[1];
        dvState.value = [ 'resolved', arguments[0], args instanceof Array ? args : [ args ] ];
      }
      return this;
    };

    function reject() {
      if (dd.state() === 'pending') {
        dvState.value = [ 'rejected', null, Array.prototype.slice.apply(arguments) ];
      }
      return this;
    };

    function rejectWith() {
      if (dd.state() === 'pending') {
        var args = arguments[1];
        dvState.value = [ 'rejected', arguments[0], args instanceof Array ? args : [ args ] ];
      }
      return this;
    };

    function state() {
      return dvState.value[0];
    };

    function done(callback) {
      if (typeof callback !== 'function') return this;
      if (dvState.value[0] === 'resolved') {
        callback.apply(dvState.value[1], dvState.value[2]);
      } else {
        dvState.onchange(function (state, prev) {
          if (state[0] !== 'resolved') return;
          callback.apply(dvState.value[1], dvState.value[2]);
        });
      }
      return this;
    };

    function fail(callback) {
      if (typeof callback !== 'function') return this;
      if (dvState.value[0] === 'rejected') {
        callback.apply(dvState.value[1], dvState.value[2]);
      } else {
        dvState.onchange(function (state, prev) {
          if (state[0] !== 'rejected') return;
          callback.apply(dvState.value[1], dvState.value[2]);
        });
      }
      return this;
    };

    function always(callback) {
      if (typeof callback !== 'function') return this;
      if (dvState.value[0] === 'pending') {
        dvState.onchange(function (state, prev) {
          callback.apply(dvState.value[1], dvState.value[2]);
        });
      } else {
        callback.apply(dvState.value[1], dvState.value[2]);
      }
      return this;
    };

    function promise() {
      return prom;
    };


    prom.done = done;
    prom.fail = fail;
    prom.always = always;
    prom.state = state;
    prom.promise = promise;

    dd.done = done;
    dd.fail = fail;
    dd.always = always;
    dd.state = state;
    dd.resolve = resolve;
    dd.resolveWith = resolveWith;
    dd.reject = reject;
    dd.rejectWith = rejectWith;
    dd.promise = promise;

    return dd;
  }


  /**
   * NOTE Current implementation of `when` is absolute copy of jQuery.when
   * implementation.
   * https://github.com/jquery/jquery/blob/master/src/deferred.js
   */
  function when(subordinate /* , ..., subordinateN */) {
    var i,
      resolveValues = Array.prototype.slice.apply(arguments),
      length = resolveValues.length,
      remaining = length != 1 || (subordinate && typeof subordinate.promise === 'function') ? length : 0,
      dfrrd = remaining === 1 ? subordinate : deferred(),
      updateFunc = function (i, contexts, values) {
        return function (value) {
          contexts[i] = this;
          values[i] = arguments.length > 1 ? Array.prototype.slice.call(arguments) : value;
          if (!(--remaining)) {
            dfrrd.resolveWith(contexts, values);
          }
        };
      },
      resolveContexts;

    if (length > 1) {
      resolveContexts = new Array(length);
      for (i = 0; i < length; i++) {
        if (resolveValues[i] && typeof resolveValues[i].promise === 'function') {
          resolveValues[i].promise()
            .done(updateFunc(i, resolveContexts, resolveValues))
            .fail(dfrrd.reject);
        } else {
          --remaining;
        }
      }
    }

    if (!remaining) {
      dfrrd.resolveWith(resolveContexts, resolveValues);
    }

    return dfrrd.promise();
  }

  deferred.when = when;

  return deferred;

})(dv);


if (!cjs) {
  dv.deferred = deferred;
  dv.when = deferred.when;
}


(cjs ? module : window)[(cjs ? 'exports' : 'deferred')] = deferred;

