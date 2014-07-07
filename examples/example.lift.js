var dv = require('../dv'),
  dvA = dv(),
  dvB = dv(),
  dvC,
  sum = dv.lift(function (dvOne, dvAnother) {
    return dvOne.value + dvAnother.value;
  });

dvA.value = 10;
dvA.onchange(function (nv, ov) {
  console.log('a changed to', nv, 'from', ov);
});
dvB.value = 20;
dvC = sum(dvA, dvB);

console.log(dvA.value, dvB.value, dvC.value);
// 10 20 30

dvA.value = 100;
// a changed to 100 from 10

dvB.value = 30;

console.log(dvA.value, dvB.value, dvC.value);
// 100 30 130

dvC.onchange(function (sum) {
  console.log('sum of a and b changed to ', sum);
});

dvA.value = 200;
// a changed to 200 from 100
// sum of a and b changed to  230

dvC.cleanup();
dvB.value = 60;

console.log(dvA.value, dvB.value, dvC.value);
// 200 60 260
