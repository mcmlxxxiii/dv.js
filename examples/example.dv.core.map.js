var dv = require('../dv'),
  strNumbers = dv("1.0 30e3 20.07 50"),
  aryStrNumber = strNumbers.map(function (string) {
    return string.split(/\s+/);
  }),
  aryIntNumber = aryStrNumber.map(function (ary) {
    var arr = [], i;
    for (i = 0; i < ary.length; i++) {
      arr.push(parseFloat(ary[i]));
    }
    return arr;
  });

console.log(aryStrNumber.value);
// [ '1.0', '30e3', '20.07', '50' ]

console.log(aryIntNumber.value);
// [ 1, 30000, 20.07, 50 ]

strNumbers.value = "1.9 23e3 18.07 30";

console.log(aryStrNumber.value);
// [ '1.9', '23e3', '18.07', '30' ]

console.log(aryIntNumber.value);
// [ 1.9, 23000, 18.07, 30 ]
