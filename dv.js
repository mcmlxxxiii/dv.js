function dv(value) {
  var i, arr =[];
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

  if (arguments.length == 2) {
    var fn = arguments[0],
      args = arguments[1];
    if (typeof fn !== 'function') {
      throw new Error('dv: when 2 args, 1st should be function!');
    }
    if (!(args instanceof Array)) {
      throw new Error('dv: when 2 args, 2nd should be array of dv!');
    }

    for (i = 0; i < args.length; i++) {
      if (!(args[i] instanceof this.constructor)) {
          throw new Error('dv: when 2 args, 2nd (array) should consist only '+
                          'of dynamic values! (element '+i+' is not a dv)');
      }
    }
    this._fn = fn;
    this._args = args;
    for (i = 0; i < this._args.length; i++) {
      if (!this._args[i]._deps) { this._args[i]._deps = []; }
      this._args[i]._deps.push(this);
    }
    this._calculateValue();
  }

  else {
    this.value = value;
  } 
}

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
  if (this._deps) {
    for (var i = 0; i < this._deps.length; i++) {
      this._deps[i]._calculateValue();
      this._deps[i]._propagateChange();
    }
  }
};

dv.prototype._calculateValue = function () {
  if (!this._args || !this._fn) return;
  var newValue = this._fn.apply(null, this._args),
    oldValue = this._value;
  if (newValue !== oldValue) {
    this._value = newValue;
    this._triggerChange(newValue, oldValue);
  }
};

dv.prototype.onchange = function (handlerFn) {
  if (!this._changeHandlers) this._changeHandlers = [];
  this._changeHandlers.push(handlerFn);
};

dv.prototype.cleanup = function () {
  delete this._changeHandlers;
};

dv.prototype.link = function (dvOther) {
  if (!(dvOther instanceof dv)) throw "";
  this._linkedTo = dvOther;
  if (!this._linkedTo._deps) { this._linkedTo._deps = []; }
  this._linkedTo._deps.push(this);
  this._value = this._linkedTo._value;
};

dv.prototype.unlink = function () {
  this._linkedTo._deps.splice(this._linkedTo._deps.indexOf(this), 1);
  delete this._linkedTo;
};

dv.lift = function (fn) {
  var cls = this;
  return function () {
    return cls(fn, Array.prototype.slice.call(arguments));
  };
};

dv.prototype.map = function (mapFn) {
  return dv.lift(mapFn)(this);
};
