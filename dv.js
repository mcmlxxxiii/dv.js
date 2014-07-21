/*
 * dv.js v0.1
 *
 * Copyright 2014 by Mykhaylo Gavrylyuk, https://github.com/mcmlxxxiii
 * Licensed under the MIT license
 *
 * Date: Sun Jul 6, 2014
 */

dv = (function () {

  function dv(value) {
    var i, arr = [];
    if (arguments.callee !== this.constructor) {
      for (i = 0; i < arguments.length; i++) { arr.push('arguments[' + i + ']'); }
      return eval('new arguments.callee(' + arr.join(',') + ');');
    }

    this._value;
    this._fn;
    this._args;
    this._deps; // = [];
    this._changeHandler;
    this._linkedTo;

    if (arguments.length > 1) {
      var fn = arguments[0],
        args = arguments[1];

      if (typeof fn !== 'function') {
        throw new Error('dv: when 2+ args, 1st should be function!');
      }

      if (!(args instanceof Array)) {
        throw new Error('dv: when 2+ args, 2nd should be array of dv!');
      }

      for (i = 0; i < args.length; i++) {
        if (!(args[i] instanceof this.constructor)) {
            throw new Error('dv: when 2+ args, 2nd (array) should consist only '+
                            'of dynamic values! (element '+i+' is not a dv)');
        }
      }

      this._fn = fn;
      this._args = args;

      for (i = 0; i < this._args.length; i++) {
        if (!this._args[i]._deps) { this._args[i]._deps = []; }
        this._args[i]._deps.push(this);
      }

      // Not `if (value) {...` because it might be falsy,
      if (arguments.length > 2) {
        this._value = arguments[2];
      } else {
        this._calculateValue();
      }
    }

    else {
      this.value = value;
    }
  }


  dv.lift = function (fn) {
    var cls = this,
      fnCode = fn.toString(),
      iBracketO = fnCode.indexOf('('),
      iBracketC = fnCode.indexOf(')'),
      fnSignature = fnCode.substr(iBracketO + 1, iBracketC - iBracketO - 1),
      argNames = fnSignature.split(/\s*,\s*/);

    return function () {
      var args = Array.prototype.slice.call(arguments, 0, argNames.length),
        initialValue = arguments[argNames.length];
      if (arguments.length > argNames.length) {
        return new cls(fn, args, initialValue);
      } else {
        return new cls(fn, args);
      }
    };
  };


  dv.prototype.onchange = function (handlerFn) {
    if (!this._changeHandlers) this._changeHandlers = [];
    this._changeHandlers.push(handlerFn);
  };

  dv.prototype.cleanup = function () {
    delete this._changeHandlers;
  };

  dv.prototype.link = function (dvOther) {
    if (!(dvOther instanceof dv) || this === dvOther)
      throw new Error('dv: #link only accepts other dv as single argument!');
    this._linkedTo = dvOther;
    if (!this._linkedTo._deps) { this._linkedTo._deps = []; }
    this._linkedTo._deps.push(this);
    this._value = this._linkedTo._value;
    return this;
  };

  dv.prototype.unlink = function () {
    if (this._linkedTo === undefined) return;
    this._linkedTo._deps.splice(this._linkedTo._deps.indexOf(this), 1);
    if (this._linkedTo._deps.length === 0) {
      delete this._linkedTo._deps;
    }
    delete this._linkedTo;
    return this;
  };

  dv.prototype.map = function (mapFn, initialValue) {
    if (arguments.length > 1) {
      return dv.lift(mapFn)(this, initialValue);
    } else {
      return dv.lift(mapFn)(this);
    }
  };


  dv.prototype.__defineGetter__('value', function () {
    return this._value;
  });

  dv.prototype.__defineSetter__('value', function (newValue) {
    var oldValue = this._value;
    if (this._value !== newValue) {
      this._value = newValue;
      this._triggerChange(newValue, oldValue);
      this._propagateChange();
    }
  });


  dv.prototype._triggerChange = function (newValue, oldValue) {
    if (this._changeHandlers) {
      for (var i = 0; i < this._changeHandlers.length; i++ ) {
        this._changeHandlers[i](newValue, oldValue);
      }
    }
  };

  dv.prototype._propagateChange = function () {
    var i;
    if (this._deps instanceof Array) {
      for (i = 0; i < this._deps.length; i++) {
        this._deps[i]._calculateValue();
      }
    }
  };

  dv.prototype._argsValues = function () {
    var i,
      values = [];
    for (i = 0; i < this._args.length; i++) {
      values.push(this._args[i].value);
    }
    return values;
  };

  dv.prototype._calculateValue = function () {
    var newValue,
      oldValue;
    if (this._linkedTo !== undefined && this._linkedTo !== this) {
      newValue = this._linkedTo._value;
      oldValue = this._value;
    } else if (this._args instanceof Array && typeof this._fn === 'function') {
      newValue = this._fn.apply(this._value, this._argsValues());
      oldValue = this._value;
    }
    if (newValue !== oldValue) {
      this._value = newValue;
      this._triggerChange(newValue, oldValue);
      this._propagateChange();
    }
  };


  return dv;

})();


var u, module, cjs = module != u;
(cjs ? module : window)[(cjs ? 'exports' : 'dv')] = dv;
