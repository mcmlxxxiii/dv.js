## Next

2. Lifting function now provides current values as context (this).

1. Lifting function now provides dvs' values as arguments, not dvs.
It is better explained by the example.

**How it was previously:**

```
var sum = dv.lift(function (dvA, dvB, dvC) {
  return dvA.value + dvB.value + dvC.value;
})(dvA, dvB, dvC);
```

**How it is now:**

```
var sum = dv.lift(function (a, b, c) {
  return a + b + c;
})(dvA, dvB, dvC);
```


## v0.1 (Sun Jul 06, 2014)

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
