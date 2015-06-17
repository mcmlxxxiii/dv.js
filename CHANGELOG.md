HEAD (after v0.1)
=================

Multiple optimizations and improvements to tests. 

Introduced **dv.deferred** and **dv.when**.

### dv

- Fixed invalid unlinking when other instances were also linked to where the one being unlinked was linked to.
- Added _#get_ getter and _#set_ setted.
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

**Previously:**

```
var sum = dv.lift(function (dvA, dvB, dvC) {
  return dvA.value + dvB.value + dvC.value;
})(dvA, dvB, dvC);
```

**Now:**

```
var sum = dv.lift(function (a, b, c) {
  return a + b + c;
})(dvA, dvB, dvC);
```


v0.1 (Sun Jul 06, 2014)
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
