var dv = require('../dv'),
  dvA = dv(10),
  dvB = dv(20),
  dvC = dv.lift(function (v1, v2) {
    return v1 + v2;
  })(dvA, dvB);

dvA.value = 10;
dvB.value = 20;

console.log(dvA.value, dvB.value, dvC.value);
// 10 20 30

dvA.value = 100;
dvB.value = 30;

console.log(dvA.value, dvB.value, dvC.value);
// 100 30 130

dvA.value = 200;
dvB.value = 60;

console.log(dvA.value, dvB.value, dvC.value);
// 200 60 260
