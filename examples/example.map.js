var dv = require('../dv'),
  dvNumbers = dv("1.0 30e3 20.07 50"),
  dvNumbersList = dvNumbers.map(function (dvStr) {
    return dvStr.value.split(/\s+/);
  }),
  dvNumbersIntList = dvNumbersList.map(function (dvArr) {
    var arr = [], i;
    for (i = 0; i < dvArr.value.length; i++) {
      arr.push(parseFloat(dvArr.value[i]));
    }
    return arr;
  });

dvNumbersList.onchange(function () {
  console.log('list changed');
});

dvNumbersIntList.onchange(function () {
  console.log('int list changed');
});

console.log(dvNumbersList.value);
// [ '1.0', '30e3', '20.07', '50' ]

console.log(dvNumbersIntList.value);
// [ 1, 30000, 20.07, 50 ]

dvNumbers.value = "1.9 23e3 18.07 30";
// list changed
// int list changed

console.log(dvNumbersList.value);
// [ '1.9', '23e3', '18.07', '30' ]

console.log(dvNumbersIntList.value);
// [ 1.9, 23000, 18.07, 30 ]
