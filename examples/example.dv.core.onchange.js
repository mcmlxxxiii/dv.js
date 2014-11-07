var dv = require('../dv'),
  dvA = dv(10)

dvA.value = 10;
dvA.onchange(function (nv, ov) {
  console.log('a changed to', nv, 'from', ov);
});


dvA.value = 100;
// a changed to 100 from 10

dvA.value = 150;
// a changed to 150 from 100

dvA.value = 170;
// a changed to 170 from 150