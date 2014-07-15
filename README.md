**dv.js** is inspired by [Reactive Programming in JavaScript](http://engineering.silk.co/post/80056130804/reactive-programming-in-javascript) post by [Sebastiaan Visser](http://fvisser.nl/) in [Silk's Engineering Blog](http://engineering.silk.co/).

I was looking for a good resource to learn FRP by example and I've definitely found it in that post. Thank you, Sebastian/Silk! :)

While learning that resource my fingers were literally itching to try the described approach on practice. Unfortunatelly, their original library sources from [Silk](https://silk.co) were not shared, so I decided to create this tool following their great example.

___

### Caveats

#### 1. Null and undefined value access within lift functions in web environment

**Problem.** Lift functions might need to work w/ undefined or null values. 
For instance, on first calculation one might expect `this` (the value) to be undefined. 
Or, alternatively, it might return `null` as the value and depend on the previous value in its calculations. 
The problem with `null` and `undefined` values is that lift functions (in web environment) get context via apply call and thus both `undefined` and `null` get transformed into `window` by browsers.

```
var whatever = dv.lift(function (a, b) {
  console.log(this);
})(dvA, dvB);

dvA.value = 1;
// window
```

**Solution.** To avoid getting `window` and become able to get `undefined` and `null` values in lift functions, you'll need mark functions as strict-mode ones.

```
var whatever = dv.lift(function (a, b) {
  'use strict';
  console.log(this);
})(dvA, dvB);

dvA.value = 1;
// undefined
```

This problems is not actual in node.js environment.