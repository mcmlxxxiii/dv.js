v0.2.0 (Oct 23, 2015)
===================

- #link not only changes the value on dependant dv but also propagates the change further to its deps (and so on) when value is different from current.

- #onchange method nrenamed into #onChange.

- Setting value with forceFlag now propagates the change to the lifts and their lifts and so on.

- Added handy utility dv.link class method. `dv.link(someDv)` and `dv().link(someDv)` lead to same result.

- Made #onchange and #cleanup return self.

- Reworked old and new values comparison from strict equal (===) to deep object compare!

- Extended dv.lift with the way to have both new and old values in lift functions.
```
  var a = dv();
  var b = dv();
  var c = dv.lift(function (a, a_, b, b_) {
    return a == 1 && a_ == 0 & b == b_;
  })(a, b);
```

- Improved dv.lift and dv#map to receive initial value with their 1st arg.
```
  // Previously
  var a = dv.lift(function (…) {…})(…, 'initial');
  var b = a.map(function (…, 'value') {…});

  // Now
  var a = dv.lift('initial', function (…) {…})(…);
  var b = a.map('value', function (…) {…});
```

- Introduced **dv.deferred** and **dv.when**.

- Fixed invalid unlinking when other instances were also linked to where the one being unlinked was linked to.

- Added _#get_ getter and _#set_ setter. _#set_ setter treats
  2nd argument as a flag whether it should force setting the same
  value, trigger onchange event and propagate the value further.

- Made _#link_ and _#unlink_ now return self, so that shortcuts like following are possible.
```
var dvA = dv().link(dvB);
var dvC = dvD.unlink().link(dvB);
```

- Made lift treat the first excessive arg as an initial value (to avoid calculatioins on init).
```
var sum = dv.lift(function (a, b, c) {
  return a + b + c;
})(dvA, dvB, dvC, 1001);

var strSize = dv.lift(function (str) {
  return str.length;
})(dvStr, 0);
```

- Made lifting functions receive current values as context (this).

- Made lifting functions receive values as arguments instead of their dv's. It is better explained by the example.
```
  // Previously
  var sum = dv.lift(function (dvA, dvB, dvC) {
    return dvA.value + dvB.value + dvC.value;
  })(dvA, dvB, dvC);

  // Now
  var sum = dv.lift(function (a, b, c) {
    return a + b + c;
  })(dvA, dvB, dvC);
```


v0.1 (Jul 06, 2014)
=======================
- new dv(value)
- new dv(liftFn, liftFnArgs)
- dv(value)
- dv(liftFn, liftFnArgs)
- dv.lift(liftFn)
- dv#map(mapFn)
- dv#link(otherDv)
- dv#unlink()
- dv#cleanup()
- dv#onchange(callbackFn)
- dv#value getter
- dv#value setter
- node.js compatibility
