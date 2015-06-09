var dv = require('../dv'),
  a = dv(10)

a.value = 10;
a.onchange(function (newValue, oldValue) {
  console.log('a changed to', newValue, 'from', oldValue);
});


a.value = 100;
// a changed to 100 from 10

a.value = 150;
// a changed to 150 from 100

a.value = 170;
// a changed to 170 from 150