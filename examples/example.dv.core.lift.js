// $ node examples/example/dv.core.lift.js

var dv = require('../dv'),
  a = dv(10),
  b = dv(20),
  c = dv.lift(function (a, b) {
    return a + b;
  })(a, b);


console.log(a.value, b.value, c.value);
// 10 20 30

a.value = 100;
console.log(a.value, b.value, c.value);
// 100 20 120

b.value = 30;
console.log(a.value, b.value, c.value);
// 100 30 130

a.value = 200;
console.log(a.value, b.value, c.value);
// 200 30 230

b.value = 60;
console.log(a.value, b.value, c.value);
// 200 60 260