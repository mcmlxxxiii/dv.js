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

  function slice(obj) {
    return Array.prototype.slice.call(obj);
  }


  var State = {
    PENDING: 'pending',
    RESOLVED: 'resolved',
    REJECTED: 'rejected'
  };


  function deferred() {
    var dd = {},
      ps = {},
      dvState = dv([ State.PENDING ]);

    function resolve() {
      if (dd.state() === State.PENDING) {
        dvState.value = [ State.RESOLVED, null, slice(arguments) ];
      }
      return this;
    };

    function resolveWith() {
      if (dd.state() === State.PENDING) {
        var args = slice(arguments),
          context = args.shift();
        args = args[0] instanceof Array && args.length === 1 ? args[0] : args;
        dvState.value = [ State.RESOLVED, context, args ];
      }
      return this;
    };

    function reject() {
      if (dd.state() === State.PENDING) {
        dvState.value = [ State.REJECTED, null, slice(arguments) ];
      }
      return this;
    };

    function rejectWith() {
      if (dd.state() === State.PENDING) {
        var args = slice(arguments),
          context = args.shift();
        args = args[0] instanceof Array && args.length === 1 ? args[0] : args;
        dvState.value = [ State.REJECTED, context, args ];
      }
      return this;
    };

    function state() {
      return dvState.value[0];
    };

    function done(callback) {
      if (typeof callback !== 'function') return this;
      if (dvState.value[0] === State.RESOLVED) {
        callback.apply(dvState.value[1], dvState.value[2]);
      } else {
        dvState.onchange(function (state, prev) {
          if (state[0] !== State.RESOLVED) return;
          callback.apply(dvState.value[1], dvState.value[2]);
        });
      }
      return this;
    };

    function fail(callback) {
      if (typeof callback !== 'function') return this;
      if (dvState.value[0] === State.REJECTED) {
        callback.apply(dvState.value[1], dvState.value[2]);
      } else {
        dvState.onchange(function (state, prev) {
          if (state[0] !== State.REJECTED) return;
          callback.apply(dvState.value[1], dvState.value[2]);
        });
      }
      return this;
    };

    function always(callback) {
      if (typeof callback !== 'function') return this;
      if (dvState.value[0] === State.PENDING) {
        dvState.onchange(function (state, prev) {
          callback.apply(dvState.value[1], dvState.value[2]);
        });
      } else {
        callback.apply(dvState.value[1], dvState.value[2]);
      }
      return this;
    };

    function promise() {
      return ps;
    };


    ps.done = done;
    ps.fail = fail;
    ps.always = always;
    ps.state = state;
    ps.promise = promise;

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
      resolveValues = slice(arguments),
      length = resolveValues.length,
      remaining = length != 1 || (subordinate && typeof subordinate.promise === 'function') ? length : 0,
      dfrrd = remaining === 1 ? subordinate : deferred(),
      updateFunc = function (i, contexts, values) {
        return function (value) {
          contexts[i] = this;
          values[i] = arguments.length > 1 ? slice(arguments) : value;
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