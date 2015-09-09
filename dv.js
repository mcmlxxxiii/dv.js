/*
 * dv.js v0.1
 *
 * Copyright 2014 by Mykhaylo Gavrylyuk, https://github.com/mcmlxxxiii
 * Licensed under the MIT license
 *
 * Date: Sun Jul 6, 2014
 */

dv = (function () {

  function getFunctionSignature(fn) {
    var fnCode = fn.toString(),
      iBracketO = fnCode.indexOf('('),
      iBracketC = fnCode.indexOf(')'),
      fnSignature = fnCode.substr(iBracketO + 1, iBracketC - iBracketO - 1),
      argNames = fnSignature.split(/\s*,\s*/);
    return argNames;
  }

  function objSize(obj) {
    if (typeof Object.keys === 'function') return Object.keys(obj).length;
    var count = 0;
    for (var i in obj) { count++; }
    return count;
  }

  function compare(a, b) {
    if (a !== b) {
      if (!(a instanceof Object && b instanceof Object)) return false;
      if (objSize(a) !== objSize(b)) return false;
      var isIdentical = true;
      for (var i in a) {
        if (!compare(a[i], b[i])) { isIdentical = false; break; }
      }
      return isIdentical;
    }
    return true;
  }

  function dv(initialValue) {
    var i, arr = [];
    if (arguments.callee !== this.constructor) {
      for (i = 0; i < arguments.length; i++) { arr.push('arguments[' + i + ']'); }
      return eval('new arguments.callee(' + arr.join(',') + ');');
    }

    this._value;
    this._oldValue;
    this._fn;
    this._fnSignature;
    this._args;
    this._deps; // = [];
    this._changeHandlers;
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
      this._fnSignature = getFunctionSignature(fn);
      this._args = args;
      this._calculationDependsOnOldValues = this._fnSignature.length == this._args.length * 2;

      for (i = 0; i < this._args.length; i++) {
        if (!this._args[i]._deps) { this._args[i]._deps = []; }
        this._args[i]._deps.push(this);
      }

      // Not `if (initialValue) {...` because it might be falsy,
      if (arguments.length > 2) {
        this._value = arguments[2];
      } else {
        this._value = this._fn.apply(this._value, this._argsValues(this));
      }
    }

    else {
      this.value = initialValue;
    }
  }

  dv.lift = function () {
    var initialValue,
      initialValueDefined = false,
      liftFn;

    if (arguments.length == 1) {
      liftFn = arguments[0];
    } else if (arguments.length == 2) {
      initialValueDefined = true;
      initialValue = arguments[0];
      liftFn = arguments[1];
    } else {
      throw new Error('dv.lift: accepts either 1 (liftFn) or 2 (initialValue, liftFn) args');
    }

    if (typeof liftFn != 'function') {
      throw new Error('dv.lift: liftFn argument should be function');
    }

    // This hack is needed to make Sinon be able to spy on dv when testing lift.
    // TODO Find a way to eliminate this here and in other class methods.
    var cls = this;

    return function () {
      var args = Array.prototype.slice.call(arguments);
      if (initialValueDefined) {
        return new cls(liftFn, args, initialValue);
      } else {
        return new cls(liftFn, args);
      }
    };
  };

  dv.link = function () {
    var cls = this;
    var link = new cls();
    return link.link.apply(link, arguments);
  };

  dv.prototype.onchange = function (handlerFn) {
    if (!this._changeHandlers) this._changeHandlers = [];
    this._changeHandlers.push(handlerFn);
    return this;
  };

  dv.prototype.cleanup = function () {
    delete this._changeHandlers;
    return this;
  };

  dv.prototype.link = function (dvOther, initialValue) {
    if (!(dvOther instanceof dv))
      throw new Error('dv#link: accepts other dv as the single argument only!');
    if (this === dvOther)
      throw new Error('dv#link: cannot link to self!');
    this._linkedTo = dvOther;
    if (!this._linkedTo._deps) { this._linkedTo._deps = []; }
    this._linkedTo._deps.push(this);
    //this._value = arguments.length > 1 ? initialValue : this._linkedTo._value;
    this._value = this._linkedTo._value;
    return this;
  };

  dv.prototype.unlink = function () {
    if (this._linkedTo === undefined) return;
    var i = this._linkedTo._deps.indexOf(this);
    if (i !== -1) {
      this._linkedTo._deps.splice(i, 1);
    }
    if (this._linkedTo._deps.length === 0) {
      delete this._linkedTo._deps;
    }
    delete this._linkedTo;
    return this;
  };

  dv.prototype.map = function () {
    var initialValue,
      initialValueDefined = false,
      mapFn;

    if (arguments.length == 1) {
      mapFn = arguments[0];
    } else if (arguments.length == 2) {
      initialValueDefined = true;
      initialValue = arguments[0];
      mapFn = arguments[1];
    } else {
      throw new Error('dv#map: accepts either 1 (mapFn) or 2 (initialValue, mapFn) args');
    }

    if (typeof mapFn != 'function') {
      throw new Error('dv#map: mapFn argument should be function');
    }

    if (initialValueDefined) {
      return dv.lift(initialValue, mapFn)(this);
    } else {
      return dv.lift(mapFn)(this);
    }
  };

  dv.prototype.get = function () {
    return this._value;
  };

  dv.prototype.set = function (newValue, forceFlag) {
    forceFlag = !!forceFlag;
    if (forceFlag || !compare(this._value, newValue)) {
      this._oldValue = this._value;
      this._value = newValue;
      this._triggerChange(this._value, this._oldValue);
      this._propagateChange();
    }
  };

  Object.defineProperty(dv.prototype, 'value', {
    get: function () {
      return this.get();
    },
    set: function (newValue) {
      this.set(newValue);
    }
  });

  Object.defineProperty(dv.prototype, 'oldValue', {
    get: function () {
      return this._oldValue;
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
    var i,
      propagatedFrom = this;
    if (this._deps instanceof Array) {
      for (i = 0; i < this._deps.length; i++) {
        this._deps[i]._calculateValue(propagatedFrom);
      }
    }
  };

  dv.prototype._argsValues = function (changed) {
    var i,
      values = [];
    for (i = 0; i < this._args.length; i++) {
      values.push(this._args[i].value);
      if (this._calculationDependsOnOldValues) {
        if (changed == this) {
          values.push(this.oldValue);
        } else if (changed == this._args[i]) {
          values.push(this._args[i].oldValue);
        } else {
          values.push(this._args[i].value);
        }
      }
    }
    return values;
  };

  dv.prototype._calculateValue = function (propagatedFrom) {
    var newValue,
      oldValue;

    if (this._linkedTo !== undefined) {
      newValue = this._linkedTo._value;
      oldValue = this._value;
    } else if (this._args instanceof Array && typeof this._fn === 'function') {
      newValue = this._fn.apply(this._value, this._argsValues(propagatedFrom));
      oldValue = this._value;
    }

    if (!compare(newValue, oldValue)) {
      this._oldValue = oldValue;
      this._value = newValue;
      this._triggerChange(newValue, oldValue);
      this._propagateChange();
    }
  };

  return dv;

})();


var u, module, cjs = module != u;
(cjs ? module : window)[(cjs ? 'exports' : 'dv')] = dv;