var deferred = require('../dv.deferred'),
  happy = deferred(),
  clap = deferred(),
  outcome = deferred();

happy.done(function () {
  clap.resolve();
});

clap.done(function () {
  outcome.resolve([ 1, 2, 3 ]);
});

outcome.done(function (result) {
  console.log(result);
});

happy.resolve();
// [ 1, 2, 3 ]

