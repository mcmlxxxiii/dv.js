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

  function flatten(ary) {
    var newAry = [];
    for (var i = 0; i < ary.length; i++) {
      if (ary[i] instanceof Array) {
        newAry = newAry.concat(flatten(ary[i]));
      } else {
        newAry.push(ary[i]);
      }
    }
    return newAry;
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

    function resolveWith(context, args) {
      if (dd.state() === State.PENDING) {
        var args = args instanceof Array ? args : [ args ];
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

    function rejectWith(context, args) {
      if (dd.state() === State.PENDING) {
        var args = args instanceof Array ? args : [ args ];
        dvState.value = [ State.REJECTED, context, args ];
      }
      return this;
    };

    function notify() {
      if (dd.state() === State.PENDING) {
        dvState.set([ State.PENDING, null, slice(arguments) ], true);
      }
      return this;
    };

    function notifyWith(context, args) {
      if (dd.state() === State.PENDING) {
        var args = args instanceof Array ? args : [ args ];
        dvState.set([ State.PENDING, context, args ], true);
      }
      return this;
    };


    function state() {
      return dvState.value[0];
    };

    function done() {
      var callbacks = flatten(arguments);
      for (var i = 0; i < callbacks.length; i++) {
        var one = callbacks[i];
        if (typeof one !== 'function') continue;
        if (dvState.value[0] === State.RESOLVED) {
          one.apply(dvState.value[1], dvState.value[2]);
        } else {
          dvState.onchange((function (cb) {
            return function (state, prev) {
              if (state[0] !== State.RESOLVED) return;
              cb.apply(dvState.value[1], dvState.value[2]);
            };
          })(one));
        }
      }
      return this;
    };

    function fail() {
      var callbacks = flatten(arguments);
      for (var i = 0; i < callbacks.length; i++) {
        var one = callbacks[i];
        if (typeof one !== 'function') continue;
        if (dvState.value[0] === State.REJECTED) {
          one.apply(dvState.value[1], dvState.value[2]);
        } else {
          dvState.onchange((function (cb) {
            return function (state, prev) {
              if (state[0] !== State.REJECTED) return;
              cb.apply(dvState.value[1], dvState.value[2]);
            };
          })(one));
        }
      }
      return this;
    };

    function progress() {
      if (dvState.value[0] !== State.PENDING) return;
      var callbacks = flatten(arguments);
      for (var i = 0; i < callbacks.length; i++) {
        var one = callbacks[i];
        dvState.onchange((function (cb) {
          return function (state, prev) {
            if (state[0] !== State.PENDING) return;
            cb.apply(dvState.value[1], dvState.value[2]);
          };
        })(one));
      }
      return this;
    };

    function always() {
      var callbacks = flatten(arguments);
      for (var i = 0; i < callbacks.length; i++) {
        var one = callbacks[i];
        if (typeof one !== 'function') continue;
        if (dvState.value[0] === State.PENDING) {
          dvState.onchange((function (cb) {
            return function (state, prev) {
              if (state[0] === State.PENDING) return;
              cb.apply(dvState.value[1], dvState.value[2]);
            };
          })(one));
        } else {
          one.apply(dvState.value[1], dvState.value[2]);
        }
      }
      return this;
    };

    function promise() {
      return ps;
    };


    ps.done = done;
    ps.fail = fail;
    ps.progress = progress;
    ps.always = always;
    ps.state = state;
    ps.promise = promise;

    dd.done = done;
    dd.fail = fail;
    dd.progress = progress;
    dd.always = always;
    dd.state = state;
    dd.resolve = resolve;
    dd.resolveWith = resolveWith;
    dd.reject = reject;
    dd.rejectWith = rejectWith;
    dd.notify = notify;
    dd.notifyWith = notifyWith;
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