module("Creating dv w/ keyword `new`");

test( "wo/ value (zero args)", function() {
  var v = new dv();
  ok( v instanceof dv );
  ok( v._value == undefined );
  ok( v._fn == undefined );
  ok( v._args == undefined );
  ok( v._deps == undefined );
  ok( v._changeHandler == undefined );
  ok( v._linkedTo == undefined );
});

test( "w/ value (1 arg)", function() {
  var v = new dv(12.3);
  ok( v instanceof dv );
  ok( v._value == 12.3 );
  ok( v._fn == undefined );
  ok( v._args == undefined );
  ok( v._deps == undefined );
  ok( v._changeHandler == undefined );
  ok( v._linkedTo == undefined );
});

test( "w/ value (not 2 args — 3)", function() {
  var v = new dv(2.3, 3.4, 4.5);
  ok( v instanceof dv );
  ok( v._value == 2.3 );
  ok( v._fn == undefined );
  ok( v._args == undefined );
  ok( v._deps == undefined );
  ok( v._changeHandler == undefined );
  ok( v._linkedTo == undefined );
});

test( "w/ value (2 args: 1st — not a function, 2nd — an array)", function() {
  throws(function () { var v = new dv(1, []); },
    Error, "dv: when 2 args, 1st should be function!");
});

test( "w/ value (2 args: 1st — function, 2nd — not an array)", function() {
  var fn = function () {};
  throws(function () { var v = new dv(fn, 3); },
    Error, "dv: when 2 args, 2nd should be array of dv!");
});

test( "w/ value (2 args: 1st — function, 2nd — array not of dv)", function() {
  var fn = function (a, b, c) { return a.value + b.value + c; },
    dvA = new dv(1),
    dvB = new dv(2),
    dvC = 3;
  throws(function () { var v = new dv(fn, [dvA, dvB, dvC]); },
    Error, 'dv: when 2 args, 2nd (array) should consist only of dynamic values! (element 2 is not a dv)');
});

test( "w/ value (2 args: 1st — function, 2nd — array of dv)", function() {
  var fn = function (a, b, c) { return a.value + b.value + c.value; },
    dvA = new dv(1),
    dvB = new dv(2),
    dvC = new dv(3),
    calc = sinon.spy(dv.prototype, '_calculateValue'),
    v = new dv(fn, [dvA, dvB, dvC]);

  ok( v instanceof dv );
  ok(true, "should not throw exceptions");
  ok(calc.called == 1, "should call #_calculateValue");
  ok(v._value == 6, "should contain valid calculated value");

  dv.prototype._calculateValue.restore();
});


module("Creating dv wo/ keyword `new`");
// This module tends to contain all the tests from the above module,
// but dv being created wo/ keyword `new`.

test( "wo/ value (zero args)", function() {
  var v = dv();
  ok( v instanceof dv );
  ok( v._value == undefined );
  ok( v._fn == undefined );
  ok( v._args == undefined );
  ok( v._deps == undefined );
  ok( v._changeHandler == undefined );
  ok( v._linkedTo == undefined );
});

test( "w/ value (1 arg)", function() {
  var v = dv(12.3);
  ok( v instanceof dv );
  ok( v._value == 12.3 );
  ok( v._fn == undefined );
  ok( v._args == undefined );
  ok( v._deps == undefined );
  ok( v._changeHandler == undefined );
  ok( v._linkedTo == undefined );
});

test( "w/ value (not 2 args — 3)", function() {
  var v = dv(2.3, 3.4, 4.5);
  ok( v instanceof dv );
  ok( v._value == 2.3 );
  ok( v._fn == undefined );
  ok( v._args == undefined );
  ok( v._deps == undefined );
  ok( v._changeHandler == undefined );
  ok( v._linkedTo == undefined );
});

test( "w/ value (2 args: 1st — not a function, 2nd — an array)", function() {
  throws(function () { var v = dv(1, []); },
    Error, "dv: when 2 args, 1st should be function!");
});

test( "w/ value (2 args: 1st — function, 2nd — not an array)", function() {
  var fn = function () {};
  throws(function () { var v = new dv(fn, 3); },
    Error, "dv: when 2 args, 2nd should be array of dv!");
});

test( "w/ value (2 args: 1st — function, 2nd — array not of dv)", function() {
  var fn = function (a, b, c) { return a.value + b.value + c; },
    dvA = dv(1),
    dvB = dv(2),
    dvC = 3;
  throws(function () { var v = dv(fn, [dvA, dvB, dvC]); },
    Error, 'dv: when 2 args, 2nd (array) should consist only of dynamic values! (element 2 is not a dv)');
});

test( "w/ value (2 args: 1st — function, 2nd — array of dv)", function() {
  var fn = function (a, b, c) { return a.value + b.value + c.value; },
    dvA = dv(1),
    dvB = dv(2),
    dvC = dv(3),
    calc = sinon.spy(dv.prototype, '_calculateValue'),
    v = dv(fn, [dvA, dvB, dvC]);

  ok( v instanceof dv );
  ok(true, "should not throw exceptions");
  ok(calc.called == 1, "should call #_calculateValue");
  ok(v._value == 6, "should contain valid calculated value");

  dv.prototype._calculateValue.restore();
});


module("Methods");

test( "onchange", function() {
  var v = dv(3),
    spy1 = sinon.spy(),
    spy2 = sinon.spy(),
    spy3 = sinon.spy();

  v.onchange(spy1);
  v.onchange(spy3);
  v.onchange(spy2);

  deepEqual(v._changeHandlers, [ spy1, spy3, spy2 ]);
});

test( "cleanup", function() {
  var v = dv(3),
    spy1 = sinon.spy(),
    spy2 = sinon.spy(),
    spy3 = sinon.spy();

  v.onchange(spy1);
  v.onchange(spy3);
  v.onchange(spy2);

  v.cleanup();

  ok( v._changeHandlers == undefined );
});


module('#link method');

test( "should shout unless given another dynamic value as single argument", function() {
  var v = dv(3);
  throws(function () { v.link(1); },
    Error, 'dv: #link only accepts other dv as single argument!');
  throws(function () { v.link(v); },
    Error, 'dv: #link only accepts other dv as single argument!');
});

test( "should not shout when given another dynamic value as single argument", function() {
  var v = dv(3),
    otherV = dv(4);
  v.link(otherV);
  ok(true);
});

test( "should link to other dv and grab its value", function() {
  var v = dv(3),
    v2 = dv(2),
    otherV = dv(4);

  ok( otherV._deps == undefined );

  v.link(otherV);
  ok( v._linkedTo == otherV );
  deepEqual( otherV._deps, [ v ] );
  ok( v._value == 4 );

  v2.link(otherV);
  ok( v2._linkedTo == otherV );
  deepEqual( otherV._deps, [ v, v2 ] );
  ok( v2._value == 4 );
});


module('#unlink method');

test( "should unlink from other dv, but still hold its value", function() {
  var v = dv(3),
    v2 = dv(2),
    otherV = dv(4);

  v.link(otherV);
  v2.link(otherV);

  v.unlink()
  deepEqual( otherV._deps, [ v2 ] );
  ok( v._value == 4 );

  v2.unlink()
  ok( otherV._deps === undefined );
  ok( v2._value == 4 );
});

test( "should do nothing if not linked", function() {
  var v = dv(3);
  v.unlink()
  ok( true, 'should not shout' );
  ok( v._value == 3 );
});


module('#value getter');

test( "should return correct value", function() {
  var v = dv(3);
  v._value = 123;
  ok( v.value = 123);
});


module('#value setter');

test( 'should set value correctly', function() {
  var v = dv(3);
  v.value = 123;
  ok( v._value = 123);
});

test( 'should trigger changeHandlers', function() {
  var v = dv(3),
    spy1 = sinon.spy(),
    spy2 = sinon.spy(),
    spy3 = sinon.spy();

  v.onchange(spy1);
  v.onchange(spy3);
  v.onchange(spy2);

  v.value = 123;
  ok( spy1.calledOnce );
  ok( spy2.calledOnce );
  ok( spy3.calledOnce );
  sinon.assert.callOrder( spy1, spy3, spy2 );
});

test( 'should not trigger changeHandlers when value was not changed', function() {
  var v = dv(3),
    spy1 = sinon.spy(),
    spy2 = sinon.spy(),
    spy3 = sinon.spy();

  v.onchange(spy1);
  v.onchange(spy3);
  v.onchange(spy2);

  v.value = 3;
  ok( spy1.notCalled );
  ok( spy2.notCalled );
  ok( spy3.notCalled );
});

test( 'should propagate change to linked instances', function() {
  var v = dv(3),
    v2 = dv(4),
    v3 = dv(5);

  v3.link(v2);
  v2.value = 1;
  ok( v3._value == 1);

  v2.link(v);
  v.value = 2;

  ok( v2._value == 2);
  ok( v3._value == 2);
});
