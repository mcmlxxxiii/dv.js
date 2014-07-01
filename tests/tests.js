module("Creating dv w/ keyword `new`");

test( "wo/ value (zero args)", function() {
  var v = new dv();
  ok( v._value == undefined );
  ok( v._fn == undefined );
  ok( v._args == undefined );  
  ok( v._deps == undefined );  
  ok( v._changeHandler == undefined );  
  ok( v._linkedTo == undefined );  
});

test( "w/ value (1 arg)", function() {
  var v = new dv(12.3);
  ok( v._value == 12.3 );
  ok( v._fn == undefined );
  ok( v._args == undefined );  
  ok( v._deps == undefined );  
  ok( v._changeHandler == undefined );  
  ok( v._linkedTo == undefined );  
});

test( "w/ value (not 2 args — 3)", function() {
  var v = new dv(2.3, 3.4, 4.5);
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
    
  ok(true, "should not throw exceptions");
  ok(calc.called == 1, "should call #_calculateValue");  
  ok(v.value == 6, "should contain valid calculated value");  

  dv.prototype._calculateValue.restore();
});

module("Creating dv wo/ keyword `new`");
// This module tends to contain all the tests from the above module,
// but dv being created wo/ keyword `new`.

test( "wo/ value (zero args)", function() {
  var v = dv();
  ok( v._value == undefined );
  ok( v._fn == undefined );
  ok( v._args == undefined );  
  ok( v._deps == undefined );  
  ok( v._changeHandler == undefined );  
  ok( v._linkedTo == undefined );  
});

test( "w/ value (1 arg)", function() {
  var v = dv(12.3);
  ok( v._value == 12.3 );
  ok( v._fn == undefined );
  ok( v._args == undefined );  
  ok( v._deps == undefined );  
  ok( v._changeHandler == undefined );  
  ok( v._linkedTo == undefined );  
});

test( "w/ value (not 2 args — 3)", function() {
  var v = dv(2.3, 3.4, 4.5);
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
    
  ok(true, "should not throw exceptions");
  ok(calc.called == 1, "should call #_calculateValue");  
  ok(v.value == 6, "should contain valid calculated value");  

  dv.prototype._calculateValue.restore();
});

