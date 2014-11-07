var dv = require('../dv'),
  dvFirst = dv(1),
  dvSecond = dv(2);

dvSecond.link(dvFirst);
console.log(dvFirst.value, dvSecond.value);
// 1 1

dvFirst.value = 3;
console.log(dvFirst.value, dvSecond.value);
// 3 3

dvSecond.unlink();
console.log(dvFirst.value, dvSecond.value);
// 3 3

dvFirst.value = 7;
console.log(dvFirst.value, dvSecond.value);
// 7 3
