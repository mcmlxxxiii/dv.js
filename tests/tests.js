module('Creating dv wo/ value (zero args)');

test('w/ keyword `new`', function() {
  var v = new dv();
  ok(v instanceof dv);
  ok(v._value == undefined);
  ok(v._fn == undefined);
  ok(v._args == undefined);
  ok(v._deps == undefined);
  ok(v._changeHandler == undefined);
  ok(v._linkedTo == undefined);
});

test('wo/ keyword `new`', function() {
  var v = dv();
  ok(v instanceof dv);
  ok(v._value == undefined);
  ok(v._fn == undefined);
  ok(v._args == undefined);
  ok(v._deps == undefined);
  ok(v._changeHandler == undefined);
  ok(v._linkedTo == undefined);
});


module('Creating dv w/ value (1 arg)');

test('w/ keyword `new`', function() {
  var v = new dv(12.3);
  ok(v instanceof dv);
  ok(v._value == 12.3);
  ok(v._fn == undefined);
  ok(v._args == undefined);
  ok(v._deps == undefined);
  ok(v._changeHandler == undefined);
  ok(v._linkedTo == undefined);
});

test('wo/ keyword `new`', function() {
  var v = dv(12.3);
  ok(v instanceof dv);
  ok(v._value == 12.3);
  ok(v._fn == undefined);
  ok(v._args == undefined);
  ok(v._deps == undefined);
  ok(v._changeHandler == undefined);
  ok(v._linkedTo == undefined);
});


module('Creating dv w/ value (2 args: 1st — not a function, 2nd — an array)');

test('w/ keyword `new`', function() {
  throws(function () { var v = new dv(1, []); },
    Error, 'dv: when 2+ args, 1st should be function!');
});

test('wo/ keyword `new`', function() {
  throws(function () { var v = dv(1, []); },
    Error, 'dv: when 2+ args, 1st should be function!');
});


module('Creating dv w/ value (2 args: 1st — function, 2nd — not an array)');

test('w/ keyword `new`', function() {
  var fn = function () {};
  throws(function () { var v = new dv(fn, 3); },
    Error, 'dv: when 2+ args, 2nd should be array of dv!');
});

test('wo/ keyword `new`', function() {
  var fn = function () {};
  throws(function () { var v = new dv(fn, 3); },
    Error, 'dv: when 2+ args, 2nd should be array of dv!');
});


module('Creating dv w/ value (2 args: 1st — function, 2nd — array not of dv)');

test('w/ keyword `new`', function() {
  var fn = function (a, b, c) { return a + b + c; },
    dvA = new dv(1),
    dvB = new dv(2),
    dvC = 3;
  throws(function () { var v = new dv(fn, [dvA, dvB, dvC]); },
    Error, 'dv: when 2+ args, 2nd (array) should consist only of dynamic values! (element 2 is not a dv)');
});

test('wo/ keyword `new`', function() {
  var fn = function (a, b, c) { return a + b + c; },
    dvA = dv(1),
    dvB = dv(2),
    dvC = 3;
  throws(function () { var v = dv(fn, [dvA, dvB, dvC]); },
    Error, 'dv: when 2+ args, 2nd (array) should consist only of dynamic values! (element 2 is not a dv)');
});


module('Creating dv w/ value (2 args: 1st — function, 2nd — array of dv)');

test('w/ keyword `new`', function() {
  var fn = function (a, b, c) { return a + b + c; },
    dvA = new dv(1),
    dvB = new dv(2),
    dvC = new dv(3),
    v = new dv(fn, [dvA, dvB, dvC]);

  ok(v instanceof dv);
  ok(true, 'should not throw exceptions');
  ok(v._value == 6, 'should contain correct calculation result in its value');
});

test('wo/ keyword `new`', function() {
  var fn = function (a, b, c) { return a + b + c; },
    dvA = dv(1),
    dvB = dv(2),
    dvC = dv(3),
    v = dv(fn, [dvA, dvB, dvC]);

  ok(v instanceof dv);
  ok(true, 'should not throw exceptions');
  ok(v._value == 6, 'should contain correct calculation result in its value');
});


module('Creating dv w/ value (2+ args: 1st — not a function, 2nd — an array, 3rd — initial value)');

test('w/ keyword `new`', function() {
  throws(function () { var v = new dv(1, [], 2); },
    Error, 'dv: when 2+ args, 1st should be function!');
});

test('wo/ keyword `new`', function() {
  throws(function () { var v = dv(1, [], 3); },
    Error, 'dv: when 2+ args, 1st should be function!');
});


module('Creating dv w/ value (3+ args: 1st — function, 2nd — not an array, 3rd — initial value)');

test('w/ keyword `new`', function() {
  var fn = function () {};
  throws(function () { var v = new dv(fn, 3, 1); },
    Error, 'dv: when 2+ args, 2nd should be array of dv!');
});

test('wo/ keyword `new`', function() {
  var fn = function () {};
  throws(function () { var v = new dv(fn, 3, 2); },
    Error, 'dv: when 2+ args, 2nd should be array of dv!');
});


module('Creating dv w/ value (3+ args: 1st — function, 2nd — array not of dv, 3rd — initial value)');

test('w/ keyword `new`', function() {
  var fn = function (a, b, c) { return a + b + c; },
    dvA = new dv(1),
    dvB = new dv(2),
    dvC = 3;
  throws(function () { var v = new dv(fn, [dvA, dvB, dvC], 122); },
    Error, 'dv: when 2+ args, 2nd (array) should consist only of dynamic values! (element 2 is not a dv)');
});

test('wo/ keyword `new`', function() {
  var fn = function (a, b, c) { return a + b + c; },
    dvA = dv(1),
    dvB = dv(2),
    dvC = 3;
  throws(function () { var v = dv(fn, [dvA, dvB, dvC], 221); },
    Error, 'dv: when 2+ args, 2nd (array) should consist only of dynamic values! (element 2 is not a dv)');
});


module('Creating dv w/ value (3+ args: 1st — function, 2nd — array of dv, 3rd — initial value)');

test('w/ keyword `new`', function() {
  var fn = function (a, b, c) { return a + b + c; },
    dvA = new dv(1),
    dvB = new dv(2),
    dvC = new dv(3),
    v = new dv(fn, [dvA, dvB, dvC], 89);

  ok(v instanceof dv);
  ok(true, 'should not throw exceptions');
  equal(v._value, 89, 'should contain correct calculation result in its value');
});

test('wo/ keyword `new`', function() {
  var fn = function (a, b, c) { return a + b + c; },
    dvA = dv(1),
    dvB = dv(2),
    dvC = dv(3),
    v = dv(fn, [dvA, dvB, dvC], 78);

  ok(v instanceof dv);
  ok(true, 'should not throw exceptions');
  equal(v._value, 78, 'should contain correct calculation result in its value');
});



module('.lift method');

test('should return correct dv lift constructor', function () {
  var lift,
    dvA = dv(1),
    dvB = dv(2),
    dvC = dv(3),
    lifted,
    liftFn = function (a, b, c) {
      return a + b + c;
    };

  sinon.spy(window, 'dv');

  lift = dv.lift(liftFn);

  equal(dv.callCount, 0);

  lifted = lift(dvA, dvB, dvC);

  ok(dv.calledOnce);
  ok(dv.calledWithNew());
  ok(dv.calledWith(liftFn, [ dvA, dvB, dvC ]));
  equal(lifted._value, 6);

  window.dv.restore();
});



module('#onchange method');

test('should remember change handlers in the order they are registered', function() {
  var v = dv(3),
    spy1 = sinon.spy(),
    spy2 = sinon.spy(),
    spy3 = sinon.spy();

  v.onchange(spy1);
  deepEqual(v._changeHandlers, [ spy1 ]);

  v.onchange(spy3);
  deepEqual(v._changeHandlers, [ spy1, spy3 ]);

  v.onchange(spy2);
  deepEqual(v._changeHandlers, [ spy1, spy3, spy2 ]);
});



module('#cleanup method');

test('should cleanup change handlers', function() {
  var v = dv(3),
    spy1 = sinon.spy(),
    spy2 = sinon.spy(),
    spy3 = sinon.spy();

  v.onchange(spy1);
  v.onchange(spy2);
  v.onchange(spy3);

  deepEqual(v._changeHandlers, [ spy1, spy2, spy3 ]);

  v.cleanup();

  ok(v._changeHandlers == undefined);
});



module('#link method');

test('should shout unless given another dynamic value as single argument', function() {
  var v = dv(3);
  throws(function () { v.link(1); },
    Error, 'dv: #link only accepts other dv as single argument!');
  throws(function () { v.link(v); },
    Error, 'dv: #link only accepts other dv as single argument!');
});

test('should not shout when given another dynamic value as single argument', function() {
  var v = dv(3),
    otherV = dv(4);
  v.link(otherV);
  ok(true);
});

test('should link to other dv and grab its value', function() {
  var v = dv(3),
    v2 = dv(2),
    otherV = dv(4);

  ok(otherV._deps == undefined);

  v.link(otherV);
  ok(v._linkedTo == otherV);
  deepEqual(otherV._deps, [ v ]);
  ok(v._value == 4);

  v2.link(otherV);
  ok(v2._linkedTo == otherV);
  deepEqual(otherV._deps, [ v, v2 ]);
  ok(v2._value == 4);
});

test('should return self', function() {
  var v = dv(3),
    v2 = dv(2),
    otherV = dv(4);

  ok(v === v.link(otherV));
});



module('#unlink method');

test('should unlink from other dv, but still hold its value', function() {
  var v = dv(3),
    v2 = dv(2),
    otherV = dv(4);

  v.link(otherV);
  v2.link(otherV);

  v.unlink()
  deepEqual(otherV._deps, [ v2 ]);
  ok(v._value == 4);

  v2.unlink()
  ok(otherV._deps === undefined);
  ok(v2._value == 4);
});

test('should do nothing if not linked', function() {
  var v = dv(3);
  v.unlink()
  ok(true, 'should not shout');
  ok(v._value == 3);
});

test('should return self', function() {
  var v = dv(3),
    v2 = dv(2),
    otherV = dv(4);

  v.link(otherV);
  v2.link(otherV);

  ok(v.unlink() === v);
  ok(v2.unlink() === v2);
});



module('#value getter');

test('should return correct value', function() {
  var v = dv(3);
  v._value = 123;
  ok(v.value == 123);
});



module('#value setter');

test('should set value correctly', function() {
  var v = dv(3);
  v.value = 123;
  ok(v._value == 123);
});

test('should trigger change handlers', function() {
  var v = dv(3),
    spy1 = sinon.spy(),
    spy2 = sinon.spy(),
    spy3 = sinon.spy();

  v.onchange(spy1);
  v.onchange(spy3);
  v.onchange(spy2);

  v.value = 123;
  ok(spy1.calledOnce);
  ok(spy2.calledOnce);
  ok(spy3.calledOnce);
  sinon.assert.callOrder(spy1, spy3, spy2);
});

test('should not trigger changeHandlers when value was not changed', function() {
  var v = dv(3),
    spy1 = sinon.spy(),
    spy2 = sinon.spy(),
    spy3 = sinon.spy();

  v.onchange(spy1);
  v.onchange(spy3);
  v.onchange(spy2);

  v.value = 3;
  ok(spy1.notCalled);
  ok(spy2.notCalled);
  ok(spy3.notCalled);
});

test('should propagate change to linked instances', function() {
  var v = dv(3),
    v2 = dv(4),
    v3 = dv(5);

  v3.link(v2);
  v2.value = 1;
  ok(v3._value == 1);

  v2.link(v);
  v.value = 2;

  ok(v2._value == 2);
  ok(v3._value == 2);
});

test('should trigger change before propagating it', function() {
  var v = dv(3),
    v2 = dv(4),
    trigger = sinon.spy(v, '_triggerChange'),
    propagate = sinon.spy(v, '_propagateChange');

  v2.link(v);
  v.value = 2;

  ok(trigger.calledOnce);
  ok(propagate.calledOnce);
  sinon.assert.callOrder(trigger, propagate);
});

test('lift function should receive current value as context (this)', function () {
  var lift,
    dvA = dv(1),
    dvB = dv(2),
    dvC = dv(3),
    values = [],
    values2 = [],
    lifted = dv.lift(function (a, b, c) {
      values.push(this);
      return a + b + c;
    })(dvA, dvB, dvC),
    lifted2 = dv.lift(function (a, b, c) {
       'use strict';
      values2.push(this);
      return a + b + c;
    })(dvA, dvB, dvC);

  dvA.value = 4;
  dvB.value = 5;
  dvC.value = 6;

  deepEqual(values, [ window, 6, 9, 12 ]);
  deepEqual(values2, [ undefined, 6, 9, 12 ]);
});



module('#map method');

test('should return new dv lifted from self with function provided', function () {
  var dvStr = dv('abc'),
    mapFn = function (d) { return d.length; },
    mapped = dvStr.map(mapFn);

  ok(mapped instanceof dv);
  ok(mapped.value == 3);

  dvStr.value = 'abcdefghi';
  ok(mapped.value == 9);
});

