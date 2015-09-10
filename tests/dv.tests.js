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
    new Error('dv: when 2+ args, 1st should be function!'));
});

test('wo/ keyword `new`', function() {
  throws(function () { var v = dv(1, []); },
    new Error('dv: when 2+ args, 1st should be function!'));
});


module('Creating dv w/ value (2 args: 1st — function, 2nd — not an array)');

test('w/ keyword `new`', function() {
  var fn = function () {};
  throws(function () { var v = new dv(fn, 3); },
    new Error('dv: when 2+ args, 2nd should be array of dv!'));
});

test('wo/ keyword `new`', function() {
  var fn = function () {};
  throws(function () { var v = new dv(fn, 3); },
    new Error('dv: when 2+ args, 2nd should be array of dv!'));
});


module('Creating dv w/ value (2 args: 1st — function, 2nd — array not of dv)');

test('w/ keyword `new`', function() {
  var fn = function (a, b, c) { return a + b + c; },
    dvA = new dv(1),
    dvB = new dv(2),
    dvC = 3;
  throws(function () { var v = new dv(fn, [dvA, dvB, dvC]); },
    new Error('dv: when 2+ args, 2nd (array) should consist only of dynamic values! (element 2 is not a dv)'));
});

test('wo/ keyword `new`', function() {
  var fn = function (a, b, c) { return a + b + c; },
    dvA = dv(1),
    dvB = dv(2),
    dvC = 3;
  throws(function () { var v = dv(fn, [dvA, dvB, dvC]); },
    new Error('dv: when 2+ args, 2nd (array) should consist only of dynamic values! (element 2 is not a dv)'));
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
    new Error('dv: when 2+ args, 1st should be function!'));
});

test('wo/ keyword `new`', function() {
  throws(function () { var v = dv(1, [], 3); },
    new Error('dv: when 2+ args, 1st should be function!'));
});


module('Creating dv w/ value (3+ args: 1st — function, 2nd — not an array, 3rd — initial value)');

test('w/ keyword `new`', function() {
  var fn = function () {};
  throws(function () { var v = new dv(fn, 3, 1); },
    new Error('dv: when 2+ args, 2nd should be array of dv!'));
});

test('wo/ keyword `new`', function() {
  var fn = function () {};
  throws(function () { var v = new dv(fn, 3, 2); },
    new Error('dv: when 2+ args, 2nd should be array of dv!'));
});


module('Creating dv w/ value (3+ args: 1st — function, 2nd — array not of dv, 3rd — initial value)');

test('w/ keyword `new`', function() {
  var fn = function (a, b, c) { return a + b + c; },
    dvA = new dv(1),
    dvB = new dv(2),
    dvC = 3;
  throws(function () { var v = new dv(fn, [dvA, dvB, dvC], 122); },
    new Error('dv: when 2+ args, 2nd (array) should consist only of dynamic values! (element 2 is not a dv)'));
});

test('wo/ keyword `new`', function() {
  var fn = function (a, b, c) { return a + b + c; },
    dvA = dv(1),
    dvB = dv(2),
    dvC = 3;
  throws(function () { var v = dv(fn, [dvA, dvB, dvC], 221); },
    new Error('dv: when 2+ args, 2nd (array) should consist only of dynamic values! (element 2 is not a dv)'));
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



module('dv.lift method');

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
  ok(dv.calledWithExactly(liftFn, [ dvA, dvB, dvC ]));
  equal(lifted._value, 6);

  window.dv.restore();
});

test('should return correct old values dependent dv lift constructor when args provided cover connections two times strictly', function () {
  var lift,
    dvA = dv(1),
    dvB = dv(),
    dvC = dv(3),
    valuesForLifting,
    lifted,
    liftFn = function (a, a_, b, b_, c, c_) {
      valuesForLifting = args(arguments);
      return a + (b || 0) + c;
    };

  sinon.spy(window, 'dv');

  lift = dv.lift(liftFn);

  equal(dv.callCount, 0);

  lifted = lift(dvA, dvB, dvC);

  ok(dv.calledOnce);
  ok(dv.calledWithNew());
  ok(dv.calledWithExactly(liftFn, [ dvA, dvB, dvC ]));
  equal(lifted.value, 4);

  dvA.value = 5;
  deepEqual(valuesForLifting, [5,1,undefined,undefined,3,3]);

  dvB.value = 2;
  deepEqual(valuesForLifting, [5,5,2,undefined,3,3]);

  window.dv.restore();
});

test('lift function should calculate value when there is no initial value provided', function () {
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
  ok(dv.calledWithExactly(liftFn, [ dvA, dvB, dvC ]));
  equal(lifted._value, 6);

  window.dv.restore();
});

test('lift function should not calculate value when there is initial value provided', function () {
  var lift,
    dvA = dv(1),
    dvB = dv(2),
    dvC = dv(3),
    lifted,
    liftFn = function (a, b, c) {
      return a + b + c;
    };

  sinon.spy(window, 'dv');

  lift = dv.lift(15, liftFn);

  equal(dv.callCount, 0);

  lifted = lift(dvA, dvB, dvC);

  ok(dv.calledOnce);
  ok(dv.calledWithNew());
  ok(dv.calledWithExactly(liftFn, [ dvA, dvB, dvC ], 15));
  equal(lifted._value, 15);

  window.dv.restore();
});

test('should fail if more than two arguments provided', function () {
  throws(function () { dv.lift(1, 2, 3); },
    new Error('dv.lift: accepts either 1 (liftFn) or 2 (initialValue, liftFn) args'));
});

test('should fail if no arguments provided', function () {
  throws(function () { dv.lift(); },
    new Error('dv.lift: accepts either 1 (liftFn) or 2 (initialValue, liftFn) args'));
});

test('should fail if liftFn argument is not a function (1 arg)', function () {
  throws(function () { dv.lift(1); },
    new Error('dv.lift: liftFn argument should be function'));
});

test('should fail if liftFn argument is not a function (2 args)', function () {
  throws(function () { dv.lift(1, 2); },
    new Error('dv.lift: liftFn argument should be function'));
});



module('dv.link method');

test('should create and return new dv wo/ initial value and call #link method on it passing own arguments to it', function() {
  var one = dv();

  sinon.spy(window, 'dv');
  sinon.stub(window.dv.prototype, 'link').returns('Good!');

  var two = dv.link(one, 3);

  ok(dv.calledOnce);
  ok(dv.calledWithNew());
  ok(dv.calledWithExactly());

  ok(window.dv.prototype.link.calledWithExactly(one, 3));
  ok(two === 'Good!');

  window.dv.prototype.link.restore();
  window.dv.restore();
});



module('dv#onChange method');

test('should remember change handlers in the order they are registered', function() {
  var v = dv(3),
    spy1 = sinon.spy(),
    spy2 = sinon.spy(),
    spy3 = sinon.spy();

  v.onChange(spy1);
  deepEqual(v._changeHandlers, [ spy1 ]);

  v.onChange(spy3);
  deepEqual(v._changeHandlers, [ spy1, spy3 ]);

  v.onChange(spy2);
  deepEqual(v._changeHandlers, [ spy1, spy3, spy2 ]);
});

test('should return self', function() {
  var v = dv(), spy = sinon.spy();
  ok(v === v.onChange(spy));
});



module('dv#cleanup method');

test('should cleanup change handlers', function() {
  var v = dv(3),
    spy1 = sinon.spy(),
    spy2 = sinon.spy(),
    spy3 = sinon.spy();

  v.onChange(spy1);
  v.onChange(spy2);
  v.onChange(spy3);

  deepEqual(v._changeHandlers, [ spy1, spy2, spy3 ]);

  v.cleanup();

  ok(v._changeHandlers == undefined);
});

test('should return self', function() {
  var v = dv(3),
    spy = sinon.spy();
  v.onChange(spy);
  ok(v === v.cleanup());
});



module('dv#link method');

test('should shout unless given another dynamic value as single argument', function() {
  var v = dv(3);
  throws(function () { v.link(1); },
    new Error('dv#link: accepts other dv as the single argument only!'));
  throws(function () { v.link(v); },
    new Error('dv#link: cannot link to self!'));
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

// TODO test for link's initial values.


module('dv#unlink method');

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

test('should unlink from other dv not affecting other linked ones', function() {
  var v = dv(1),
    v2 = dv(2),
    v3 = dv(3),
    v4 = dv(4);

  v2.link(v);
  v3.link(v);
  v4.link(v);

  deepEqual(v._deps, [ v2, v3, v4 ]);

  v2.unlink()
  deepEqual(v._deps, [ v3, v4 ]);

  v4.unlink()
  deepEqual(v._deps, [ v3 ]);

  v3.unlink()
  deepEqual(v._deps, undefined);
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



module('dv#get getter');

test('should return value of #_value', function() {
  var v = dv();
  v._value = 'Good!';
  ok(v.get() === 'Good!');
});



module('dv#value getter');

test('should return the return of #get getter', function() {
  var v = dv(3);
  sinon.stub(v, 'get').returns('Good!');
  ok(v.value === 'Good!');
});


module('dv#oldValue getter');

test('should return correct value', function() {
  var v = dv();
  v._oldValue = 123;
  ok(v.oldValue == 123);
});

// TODO Should check old values for just created dv-s (lift, map, link, dv) with initial values and without.



module('dv#set setter');

test('should set value correctly', function() {
  var v = dv(3);
  v.set(123);
  equal(v._value, 123);
});

test('should trigger change handlers', function() {
  var v = dv(3),
    spy1 = sinon.spy(),
    spy2 = sinon.spy(),
    spy3 = sinon.spy();

  v.onChange(spy1);
  v.onChange(spy3);
  v.onChange(spy2);

  v.set(123);
  ok(spy1.calledOnce);
  ok(spy2.calledOnce);
  ok(spy3.calledOnce);
  sinon.assert.callOrder(spy1, spy3, spy2);
});

test('should not trigger changeHandlers when value was not changed (scalar types)', function() {
  var values = [3, '123', true, null, Infinity, undefined];
  for (var i = 0; i < values.length; i++) {
    var v = dv(values[i]),
      spy = sinon.spy();
    v.onChange(spy);
    v.set(values[i]);
    ok(spy.notCalled);
  }
});

test('should not trigger changeHandlers when value was not changed (array)', function() {
  var v = dv([1,2,[3,4],5]),
    spy = sinon.spy();
  v.onChange(spy);
  v.set([1,2,[3,4],5]);
  ok(spy.notCalled);
});

test('should not trigger changeHandlers when value was not changed (object)', function() {
  var v = dv({a:1,b:{c:2,d:3}}),
    spy = sinon.spy();
  v.onChange(spy);
  v.set({a:1,b:{c:2,d:3}});
  ok(spy.notCalled);
});

test('should propagate change to linked instances when value changes', function() {
  var v = dv(3),
    v2 = dv(4),
    v3 = dv(5);

  v3.link(v2);
  v2.set(1);
  ok(v3._value == 1);

  v2.link(v);
  v.set(2);

  ok(v2._value == 2);
  ok(v3._value == 2);
});

test('should not propagate change to linked instances when value does not change', function() {
  var v1 = dv(3);
  var v2 = dv(4);
  var v3 = dv(5);

  v3.link(v2);
  v3._value = 12;
  v2.set(4);
  equal(v3._value, 12);

  v2.link(v1);
  v2._value = 33;
  v1.set(3);
  ok(v2._value == 33);
  ok(v3._value == 12);
});

test('should propagate change to lifted instances and their lifts and so on when value changes', function() {
  var dv1 = dv(3);

  var liftFn1 = sinon.spy(function (z) { return 2 * z; });
  var liftFn2 = sinon.spy(function (z) { return 2 * z; });
  var liftFn3 = sinon.spy(function (z) { return 2 * z; });
  var liftFn4 = sinon.spy(function (z) { return 2 * z; });
  var liftFn5 = sinon.spy(function (z) { return 2 * z; });

  var lifted1 = dv.lift(liftFn1)(dv1);
  var lifted2 = dv.lift(liftFn2)(lifted1);
  var lifted3 = dv.lift(liftFn3)(lifted2);
  var lifted4 = dv.lift(liftFn4)(lifted3);
  var lifted5 = dv.lift(liftFn5)(lifted4);

  equal(liftFn1.callCount, 1);
  equal(liftFn2.callCount, 1);
  equal(liftFn3.callCount, 1);
  equal(liftFn4.callCount, 1);
  equal(liftFn5.callCount, 1);

  dv1.set(4, true);

  equal(liftFn1.callCount, 2);
  equal(liftFn2.callCount, 2);
  equal(liftFn3.callCount, 2);
  equal(liftFn4.callCount, 2);
  equal(liftFn5.callCount, 2);
});

test('should not propagate change to lifted instances when value does not change', function() {
  var v1 = dv(3);
  var v2 = dv(4);
  var v3 = dv(5);
  var liftFn = sinon.spy(function (a, b, c) {
      return a + b + c;
    });
  var lifted = dv.lift(liftFn)(v1, v2, v3);
  var liftFn2 = sinon.spy(function (z) {
      return 2 * z;
    });
  var lifted2 = dv.lift(liftFn2)(lifted);

  equal(liftFn.callCount, 1);
  equal(liftFn2.callCount, 1);
  v2.set(4);
  equal(liftFn.callCount, 1);
  equal(liftFn2.callCount, 1);
});

test('should trigger change before propagating it', function() {
  var v = dv(3),
    v2 = dv(4),
    trigger = sinon.spy(v, '_triggerChange'),
    propagate = sinon.spy(v, '_propagateChange');

  v2.link(v);
  v.set(2);

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

  dvA.set(4);
  dvB.set(5);
  dvC.set(6);

  deepEqual(values, [ window, 6, 9, 12 ]);
  deepEqual(values2, [ undefined, 6, 9, 12 ]);
});



module('dv#set setter (forceFlag set)');

test('should set value correctly', function() {
  var v = dv(3);
  v.set(123, true);
  equal(v._value, 123);
});

test('should trigger change handlers', function() {
  var v = dv(3),
    spy1 = sinon.spy(),
    spy2 = sinon.spy(),
    spy3 = sinon.spy();

  v.onChange(spy1);
  v.onChange(spy3);
  v.onChange(spy2);

  v.set(123, true);
  ok(spy1.calledOnce);
  ok(spy2.calledOnce);
  ok(spy3.calledOnce);
  sinon.assert.callOrder(spy1, spy3, spy2);
});

test('should trigger changeHandlers when value was not changed (scalar types)', function() {
  var values = [3, '123', true, null, Infinity, undefined];
  for (var i = 0; i < values.length; i++) {
    var v = dv(values[i]),
      spy = sinon.spy();
    v.onChange(spy);
    v.set(values[i], true);
    ok(spy.calledOnce);
  }
});

test('should trigger changeHandlers when value was not changed (array)', function() {
  var v = dv([1,2,[3,4],5]),
    spy = sinon.spy();
  v.onChange(spy);
  v.set([1,2,[3,4],5], true);
  ok(spy.calledOnce);
});

test('should not trigger changeHandlers when value was not changed (object)', function() {
  var v = dv({a:1,b:{c:2,d:3}}),
    spy = sinon.spy();
  v.onChange(spy);
  v.set({a:1,b:{c:2,d:3}}, true);
  ok(spy.calledOnce);
});

test('should always propagate change to linked instances', function() {
  var v1 = dv(3);
  var v2 = dv(4);
  var v3 = dv(5);

  v3.link(v2);
  v3._value = 12;
  v2.set(4, true);
  equal(v3._value, 4);

  v2.link(v1);
  v2._value = 33;
  v1.set(3, true);
  ok(v2._value == 3);
  ok(v3._value == 3);
});

test('should always propagate change to lifted instances and their lifts and so on', function() {
  var dv1 = dv(3);

  var liftFn1 = sinon.spy(function (z) { return 2 * z; });
  var liftFn2 = sinon.spy(function (z) { return 2 * z; });
  var liftFn3 = sinon.spy(function (z) { return 2 * z; });
  var liftFn4 = sinon.spy(function (z) { return 2 * z; });
  var liftFn5 = sinon.spy(function (z) { return 2 * z; });

  var lifted1 = dv.lift(liftFn1)(dv1);
  var lifted2 = dv.lift(liftFn2)(lifted1);
  var lifted3 = dv.lift(liftFn3)(lifted2);
  var lifted4 = dv.lift(liftFn4)(lifted3);
  var lifted5 = dv.lift(liftFn5)(lifted4);

  equal(liftFn1.callCount, 1);
  equal(liftFn2.callCount, 1);
  equal(liftFn3.callCount, 1);
  equal(liftFn4.callCount, 1);
  equal(liftFn5.callCount, 1);

  dv1.set(4, true);

  equal(liftFn1.callCount, 2);
  equal(liftFn2.callCount, 2);
  equal(liftFn3.callCount, 2);
  equal(liftFn4.callCount, 2);
  equal(liftFn5.callCount, 2);
});

test('should trigger change before propagating it', function() {
  var v = dv(3),
    v2 = dv(4),
    trigger = sinon.spy(v, '_triggerChange'),
    propagate = sinon.spy(v, '_propagateChange');

  v2.link(v);
  v.set(2, true);

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

  dvA.set(4, true);
  dvB.set(5, true);
  dvC.set(6, true);

  deepEqual(values, [ window, 6, 9, 12 ]);
  deepEqual(values2, [ undefined, 6, 9, 12 ]);
});



module('dv#value setter');

test('should call #set setter with the provided value and without forceFlag', function() {
  var v = dv(3);
  var setter = sinon.spy(v, 'set');
  v.value = 5;
  equal(setter.callCount, 1);
  ok(setter.calledWithExactly(5));

  v.value = 5;
  equal(setter.callCount, 2);
  ok(setter.calledWithExactly(5));
});




module('dv#map method');

test('should return new dv lifted from self with function provided (as single arg)', function () {
  var dvStr = dv('abc'),
    mapFn = function (d) { return d.length; },
    mapped = dvStr.map(mapFn);

  ok(mapped instanceof dv);
  ok(mapped.value == 3);

  dvStr.value = 'abcdefghi';
  ok(mapped.value == 9);
});

test('map function should get new and old values when it receives two arguments', function () {
  var dvStr = dv('abc'),
    received,
    mapped = dvStr.map(function (d, d_) {
      received = args(arguments);
      return d.length;
    });

  ok(mapped instanceof dv);
  ok(mapped.value == 3);
  deepEqual(received, ['abc', undefined]);

  dvStr.value = 'abcdefghi';
  deepEqual(received, ['abcdefghi', 'abc']);
  ok(mapped.value == 9);
});

test('should calculate value when there is no initial value provided (single arg is function)', function () {
  var dvA = dv('abcdefghijk'),
    mapFn = function (str) { return str.length; },
    dvB;

  sinon.spy(dv, 'lift');

  dvB = dvA.map(mapFn);

  ok(dv.lift.calledOnce);
  ok(dv.lift.calledWithExactly(mapFn));

  equal(dvB._value, 11);

  window.dv.lift.restore();
});

test('should fail if more than two arguments provided', function () {
  var dvA = new dv(1);
  throws(function () { var v = dvA.map(1, 2, 3); },
    new Error('dv#map: accepts either 1 (mapFn) or 2 (initialValue, mapFn) args'));
});

test('should fail if no arguments provided', function () {
  var dvA = new dv(1);
  throws(function () { var v = dvA.map(); },
    new Error('dv#map: accepts either 1 (mapFn) or 2 (initialValue, mapFn) args'));
});

test('should fail if mapFn argument is not a function (1 arg)', function () {
  var dvA = new dv(1);
  throws(function () { var v = dvA.map(1); },
    new Error('dv#map: mapFn argument should be function'));
});

test('should fail if mapFn argument is not a function (2 args)', function () {
  var dvA = new dv(1);
  throws(function () { var v = dvA.map(1, 2); },
    new Error('dv#map: mapFn argument should be function'));
});

test('should not calculate value when there is initial value provided', function () {
  var dvA = dv('abcdefghijk'),
    mapFn = function (str) { return str.length; },
    dvB;

  sinon.spy(dv, 'lift');

  dvB = dvA.map(10001, mapFn);

  ok(dv.lift.calledOnce);
  ok(dv.lift.calledWithExactly(10001, mapFn));

  equal(dvB._value, 10001);

  window.dv.lift.restore();
});