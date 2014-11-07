var dv = require('../dv'),
  dvNumbers = dv("1.0 30e3 20.07 50"),
  dvNumbersList = dvNumbers.map(function (string) {
    return string.split(/\s+/);
  }),
  dvNumbersIntList = dvNumbersList.map(function (ary) {
    var arr = [], i;
    for (i = 0; i < ary.length; i++) {
      arr.push(parseFloat(ary[i]));
    }
    return arr;
  });

console.log(dvNumbersList.value);
// [ '1.0', '30e3', '20.07', '50' ]

console.log(dvNumbersIntList.value);
// [ 1, 30000, 20.07, 50 ]

dvNumbers.value = "1.9 23e3 18.07 30";

console.log(dvNumbersList.value);
// [ '1.9', '23e3', '18.07', '30' ]

console.log(dvNumbersIntList.value);
// [ 1.9, 23000, 18.07, 30 ]
