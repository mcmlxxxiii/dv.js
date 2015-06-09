var dv = require('../dv'),
  a = dv(1),
  b = dv(2);

b.link(a);
console.log(a.value, b.value);
// 1 1

a.value = 3;
console.log(a.value, b.value);
// 3 3

b.unlink();
console.log(a.value, b.value);
// 3 3

a.value = 7;
console.log(a.value, b.value);
// 7 3