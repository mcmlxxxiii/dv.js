var deferred = require('../dv.deferred'),
  happy = deferred(),
  knowIt = deferred(),
  reallyWantToShowIt = deferred(),
  clap = 'not yet';

deferred.when(happy, knowIt, reallyWantToShowIt).done(function (a, b, c) {
  clap = [ a, b, c ];
});


happy.resolve(1);
console.log(clap);
// not yet

knowIt.resolve(2);
console.log(clap);
// not yet

reallyWantToShowIt.resolve(3);
console.log(clap);
// [ 1, 2, 3 ]

