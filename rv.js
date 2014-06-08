function rv(value) {
  if (arguments.callee !== this.constructor) {
    if (arguments.length == 0) {
      return new arguments.callee();
    } else if (arguments.length == 1) {
      return new arguments.callee(arguments[0]);
    } else if (arguments.length == 2) {
      return new arguments.callee(arguments[0], arguments[1]);
    } else {
      throw new Error("rv constructor expects only 0, 1 or 2 arguments!");
    }
  }

  this._value;
  this._fn;
  this._args;
  this._deps; // = [];
  this._changeHandler;

  if (arguments.length == 1) {
    this.value = value;
  } else if (arguments.length == 2) {
    this._fn = arguments[0];
    this._args = arguments[1];
    for (var i = 0; i < this._args.length; i++) {
      if (!this._args[i]._deps) { this._args[i]._deps = []; }
      this._args[i]._deps.push(this);
    }
    this._calculateValue();
  }
}

rv.prototype.__defineGetter__('value', function () {
  return this._value;
});

rv.prototype.__defineSetter__('value', function (newValue) {
  var oldValue = this._value;
  if (this._value !== newValue) {
    this._value = newValue;
    this._triggerChange(newValue, oldValue);
    this._propagateChange();
  }
});

rv.prototype._triggerChange = function (newValue, oldValue) {
  if (this._changeHandlers) {
    for (var i = 0; i < this._changeHandlers.length; i++ ) {
      this._changeHandlers[i](newValue, oldValue);
    }
  }
};

rv.prototype._propagateChange = function () {
  if (this._deps) {
    for (var i = 0; i < this._deps.length; i++) {
      this._deps[i]._calculateValue();
      this._deps[i]._propagateChange();
    }
  }
};

rv.prototype._calculateValue = function () {
  if (!this._args || !this._fn) return;
  var newValue = this._fn.apply(null, this._args),
    oldValue = this._value;
  if (newValue !== oldValue) {
    this._value = newValue;
    this._triggerChange(newValue, oldValue);
  }
};

rv.prototype.onchange = function (handlerFn) {
  if (!this._changeHandlers) this._changeHandlers = [];
  this._changeHandlers.push(handlerFn);
};

rv.lift = function (fn) {
  var cls = this;
  return function () {
    return cls(fn, Array.prototype.slice.call(arguments));
  };
};

rv.prototype.map = function (mapFn) {
  return rv.lift(mapFn)(this);
};
