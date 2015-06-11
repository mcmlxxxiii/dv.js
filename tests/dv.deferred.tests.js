module('Creating dv.deferred');

test('w/ keyword `new`', function() {
  var d = new dv.deferred();
  ok(d instanceof Object);
  ok(objSize(d) === 9);
});

test('wo/ keyword `new`', function() {
  var d = dv.deferred();
  ok(d instanceof Object);
  ok(objSize(d) === 9);
});



module('Newly created dv.deferred');

test('should have correct public methods', function() {
  var d = dv.deferred();
  ok(typeof d.resolve === 'function');
  ok(typeof d.resolveWith === 'function');
  ok(typeof d.reject === 'function');
  ok(typeof d.rejectWith === 'function');
  ok(typeof d.state === 'function');
  ok(typeof d.done === 'function');
  ok(typeof d.fail === 'function');
  ok(typeof d.always === 'function');
  ok(typeof d.promise === 'function');
});



var CONTEXTS = [ 'DEFERRED', 'PROMISE' ];
var CALLBACKS = ['done', 'fail', 'always'];

for (var i = 0; i < CONTEXTS.length; i++) {

  var context = CONTEXTS[i],
    setup = (function (context) {
      return function () {
        this.d = new dv.deferred();
        if (context == 'PROMISE') {
          this.t = this.d.promise();
        } else {
          this.t = this.d;
        }
      };
    })(context);



  module(context + ' dv.deferred#promise', { setup: setup });

  test('should return correct promise object', function() {
    var p = this.t.promise();
    ok(objSize(p) === 5);
    ok(p.done === this.t.done);
    ok(p.fail === this.t.fail);
    ok(p.always === this.t.always);
    ok(p.state === this.t.state);
    ok(p.promise === this.t.promise);
  });

  test('should always return same promise object', function() {
    var p = this.t.promise();
    ok( this.d.promise() === p );
    ok( p.promise() === p );
  });



  module(context + ' dv.deferred#resolve', { setup: setup });

  test('should make state resolved', function() {
    this.d.resolve();
    ok(this.t.state() === 'resolved');
  });

  test('should trigger done callbacks in the order they were bound', function() {
    var resolved = [];
    this.t.done(function () { resolved.push(1); }).
           done(function () { resolved.push(2); }).
           done(function () { resolved.push(3); });
    deepEqual(resolved, []);
    this.d.resolve();
    deepEqual(resolved, [ 1, 2, 3 ]);
  });

  test('should trigger done callbacks passing them received arguments', function() {
    var resolved = [];
    this.t.done(function () { resolved.push(args(arguments)); }).
           done(function () { resolved.push(args(arguments)); }).
           done(function () { resolved.push(args(arguments)); });
    deepEqual(resolved, []);
    this.d.resolve(4, 5, 6);
    deepEqual(resolved, [ [4,5,6], [4,5,6], [4,5,6] ]);
  });

  test('should trigger done callbacks wo/ context', function() {
    var resolved = [];
    this.t.done(function () { 'use strict'; resolved.push(this); }).
           done(function () { 'use strict'; resolved.push(this); }).
           done(function () { 'use strict'; resolved.push(this); });
    deepEqual(resolved, []);
    this.d.resolve();
    deepEqual(resolved, [ null, null, null ]);
  });

  test('should trigger always callbacks in the order they were bound', function() {
    var resolved = [];
    this.t.always(function () { resolved.push(1); }).
           always(function () { resolved.push(2); }).
           always(function () { resolved.push(3); });
    deepEqual(resolved, []);
    this.d.resolve();
    deepEqual(resolved, [ 1, 2, 3 ]);
  });

  test('should trigger always callbacks passing them received arguments', function() {
    var resolved = [];
    this.t.always(function () { resolved.push(args(arguments)); }).
           always(function () { resolved.push(args(arguments)); }).
           always(function () { resolved.push(args(arguments)); });
    deepEqual(resolved, []);
    this.d.resolve(4, 5, 6);
    deepEqual(resolved, [ [4,5,6], [4,5,6], [4,5,6] ]);
  });

  test('should trigger always callbacks wo/ context', function() {
    var resolved = [];
    this.t.always(function () { 'use strict'; resolved.push(this); }).
           always(function () { 'use strict'; resolved.push(this); }).
           always(function () { 'use strict'; resolved.push(this); });
    deepEqual(resolved, []);
    this.d.resolve();
    deepEqual(resolved, [ null, null, null ]);
  });

  test('should trigger both done and always callbacks in the order they were bound', function() {
    var resolved = [];
    this.t.done(function ()   { resolved.push(1); }).
           always(function () { resolved.push(2); }).
           done(function ()   { resolved.push(3); }).
           always(function () { resolved.push(4); });
    deepEqual(resolved, []);
    this.d.resolve();
    deepEqual(resolved, [ 1, 2, 3, 4 ]);
  });

  test('should trigger both done and always callbacks passing them received arguments', function() {
    var resolved = [];
    this.t.done(function ()   { resolved.push(args(arguments)); }).
           always(function () { resolved.push(args(arguments)); }).
           done(function ()   { resolved.push(args(arguments)); }).
           always(function () { resolved.push(args(arguments)); });
    deepEqual(resolved, []);
    this.d.resolve(4, 5, 6);
    deepEqual(resolved, [ [4,5,6], [4,5,6], [4,5,6], [4,5,6] ]);
  });

  test('should trigger both done and always callbacks wo/ context', function() {
    var resolved = [];
    this.t.done(function ()   { 'use strict'; resolved.push(this); }).
           always(function () { 'use strict'; resolved.push(this); }).
           done(function ()   { 'use strict'; resolved.push(this); }).
           always(function () { 'use strict'; resolved.push(this); });
    deepEqual(resolved, []);
    this.d.resolve();
    deepEqual(resolved, [ null, null, null, null ]);
  });

  test('should not trigger fail callbacks', function () {
    var resolved = [];
    this.t.fail(function () { resolved.push(1); }).
           fail(function () { resolved.push(2); }).
           fail(function () { resolved.push(3); });
    deepEqual(resolved, []);
    this.d.resolve();
    deepEqual(resolved, []);
  });



  module(context + ' dv.deferred#resolveWith', { setup: setup });

  test('should make state resolved', function() {
    this.d.resolveWith(123);
    ok(this.t.state() === 'resolved');
  });

  test('should trigger done callbacks in the order they were bound', function() {
    var resolved = [];
    this.t.done(function () { resolved.push(1); }).
           done(function () { resolved.push(2); }).
           done(function () { resolved.push(3); });
    deepEqual(resolved, []);
    this.d.resolveWith(123);
    deepEqual(resolved, [ 1, 2, 3 ]);
  });

  test('should trigger done callbacks passing them received arguments (passed as 2nd and last arg being an array)', function() {
    var resolved = [];
    this.t.done(function () { resolved.push(args(arguments)); }).
           done(function () { resolved.push(args(arguments)); }).
           done(function () { resolved.push(args(arguments)); });
    deepEqual(resolved, []);
    this.d.resolveWith(123, [4, 5, 6]);
    deepEqual(resolved, [ [4,5,6], [4,5,6], [4,5,6] ]);
  });

  test('should trigger done callbacks passing them received arguments (passed as additional args with 2nd arg not being an array)', function() {
    var resolved = [];
    this.t.done(function () { resolved.push(args(arguments)); }).
           done(function () { resolved.push(args(arguments)); }).
           done(function () { resolved.push(args(arguments)); });
    deepEqual(resolved, []);
    this.d.resolveWith(123, 4, 5, 6, 7);
    deepEqual(resolved, [ [4,5,6,7], [4,5,6,7], [4,5,6,7] ]);
  });

  test('should trigger done callbacks passing them received arguments (passed as additional args with 2nd being an array)', function() {
    var resolved = [];
    this.t.done(function () { resolved.push(args(arguments)); }).
           done(function () { resolved.push(args(arguments)); }).
           done(function () { resolved.push(args(arguments)); });
    deepEqual(resolved, []);
    this.d.resolveWith(123, [4,5,6], 7);
    deepEqual(resolved, [ [ [4,5,6], 7], [[4,5,6], 7], [[4,5,6], 7] ]);
  });

  test('should trigger done callbacks w/ context provided', function() {
    var resolved = [];
    this.t.done(function () { resolved.push(this); }).
           done(function () { resolved.push(this); }).
           done(function () { resolved.push(this); });
    deepEqual(resolved, []);
    this.d.resolveWith(1);
    deepEqual(resolved, [ 1, 1, 1 ]);
  });

  test('should trigger always callbacks in the order they were bound', function() {
    var resolved = [];
    this.t.always(function () { resolved.push(1); }).
           always(function () { resolved.push(2); }).
           always(function () { resolved.push(3); });
    deepEqual(resolved, []);
    this.d.resolveWith(123);
    deepEqual(resolved, [ 1, 2, 3 ]);
  });

  test('should trigger always callbacks passing them received arguments', function() {
    var resolved = [];
    this.t.always(function () { resolved.push(args(arguments)); }).
           always(function () { resolved.push(args(arguments)); }).
           always(function () { resolved.push(args(arguments)); });
    deepEqual(resolved, []);
    this.d.resolveWith(123, [4, 5, 6]);
    deepEqual(resolved, [ [4,5,6], [4,5,6], [4,5,6] ]);
  });

  test('should trigger always callbacks w/ context provided', function() {
    var resolved = [];
    this.t.always(function () { 'use strict'; resolved.push(this); }).
           always(function () { 'use strict'; resolved.push(this); }).
           always(function () { 'use strict'; resolved.push(this); });
    deepEqual(resolved, []);
    this.d.resolveWith(2);
    deepEqual(resolved, [ 2, 2, 2 ]);
  });

  test('should trigger both done and always callbacks in the order they were bound', function() {
    var resolved = [];
    this.t.done(function ()   { resolved.push(1); }).
           always(function () { resolved.push(2); }).
           done(function ()   { resolved.push(3); }).
           always(function () { resolved.push(4); });
    deepEqual(resolved, []);
    this.d.resolveWith(123);
    deepEqual(resolved, [ 1, 2, 3, 4 ]);
  });

  test('should trigger both done and always callbacks passing them received arguments', function() {
    var resolved = [];
    this.t.done(function ()   { resolved.push(args(arguments)); }).
           always(function () { resolved.push(args(arguments)); }).
           done(function ()   { resolved.push(args(arguments)); }).
           always(function () { resolved.push(args(arguments)); });
    deepEqual(resolved, []);
    this.d.resolveWith(123, [4,5,6]);
    deepEqual(resolved, [ [4,5,6], [4,5,6], [4,5,6], [4,5,6] ]);
  });

  test('should trigger both done and always callbacks w/ context provided', function() {
    var resolved = [];
    this.t.done(function ()   { 'use strict'; resolved.push(this); }).
           always(function () { 'use strict'; resolved.push(this); }).
           done(function ()   { 'use strict'; resolved.push(this); }).
           always(function () { 'use strict'; resolved.push(this); });
    deepEqual(resolved, []);
    this.d.resolveWith(3);
    deepEqual(resolved, [ 3, 3, 3, 3 ]);
  });

  test('should not trigger fail callbacks', function () {
    var resolved = [];
    this.t.fail(function () { resolved.push(1); }).
           fail(function () { resolved.push(2); }).
           fail(function () { resolved.push(3); });
    deepEqual(resolved, []);
    this.d.resolveWith(123);
    deepEqual(resolved, []);
  });



  module(context + ' dv.deferred#reject', { setup: setup });

  test('should make state rejected', function() {
    this.d.reject();
    ok(this.t.state() === 'rejected');
  });

  test('should trigger fail callbacks in the order they were bound', function() {
    var rejected = [];
    this.t.fail(function () { rejected.push(1); }).
           fail(function () { rejected.push(2); }).
           fail(function () { rejected.push(3); });
    deepEqual(rejected, []);
    this.d.reject();
    deepEqual(rejected, [ 1, 2, 3 ]);
  });

  test('should trigger fail callbacks passing them received arguments', function() {
    var rejected = [];
    this.t.fail(function () { rejected.push(args(arguments)); }).
           fail(function () { rejected.push(args(arguments)); }).
           fail(function () { rejected.push(args(arguments)); });
    deepEqual(rejected, []);
    this.d.reject(4, 5, 6);
    deepEqual(rejected, [ [4,5,6], [4,5,6], [4,5,6] ]);
  });

  test('should trigger fail callbacks wo/ context', function() {
    var rejected = [];
    this.t.fail(function () { 'use strict'; rejected.push(this); }).
           fail(function () { 'use strict'; rejected.push(this); }).
           fail(function () { 'use strict'; rejected.push(this); });
    deepEqual(rejected, []);
    this.d.reject();
    deepEqual(rejected, [ null, null, null ]);
  });

  test('should trigger always callbacks in the order they were bound', function() {
    var rejected = [];
    this.t.always(function () { rejected.push(1); }).
           always(function () { rejected.push(2); }).
           always(function () { rejected.push(3); });
    this.d.reject();
    deepEqual(rejected, [ 1, 2, 3 ]);
  });

  test('should trigger always callbacks passing them received arguments', function() {
    var rejected = [];
    this.t.always(function () { rejected.push(args(arguments)); }).
           always(function () { rejected.push(args(arguments)); }).
           always(function () { rejected.push(args(arguments)); });
    deepEqual(rejected, []);
    this.d.reject(4, 5, 6);
    deepEqual(rejected, [ [4,5,6], [4,5,6], [4,5,6] ]);
  });

  test('should trigger always callbacks wo/ context', function() {
    var rejected = [];
    this.t.always(function () { 'use strict'; rejected.push(this); }).
           always(function () { 'use strict'; rejected.push(this); }).
           always(function () { 'use strict'; rejected.push(this); });
    deepEqual(rejected, []);
    this.d.reject();
    deepEqual(rejected, [ null, null, null ]);
  });

  test('should trigger both fail and always callbacks in the order they were bound', function() {
    var rejected = [];
    this.t.fail(function ()   { rejected.push(1); }).
           always(function () { rejected.push(2); }).
           fail(function ()   { rejected.push(3); }).
           always(function () { rejected.push(4); });
    deepEqual(rejected, []);
    this.d.reject();
    deepEqual(rejected, [ 1, 2, 3, 4 ]);
  });

  test('should trigger both fail and always callbacks passing them received arguments', function() {
    var rejected = [];
    this.t.fail(function ()   { rejected.push(args(arguments)); }).
           always(function () { rejected.push(args(arguments)); }).
           fail(function ()   { rejected.push(args(arguments)); }).
           always(function () { rejected.push(args(arguments)); });
    deepEqual(rejected, []);
    this.d.reject(4, 5, 6);
    deepEqual(rejected, [ [4,5,6], [4,5,6], [4,5,6], [4,5,6] ]);
  });

  test('should trigger both fail and always callbacks wo/ context', function() {
    var rejected = [];
    this.t.fail(function ()   { 'use strict'; rejected.push(this); }).
           always(function () { 'use strict'; rejected.push(this); }).
           fail(function ()   { 'use strict'; rejected.push(this); }).
           always(function () { 'use strict'; rejected.push(this); });
    deepEqual(rejected, []);
    this.d.reject();
    deepEqual(rejected, [ null, null, null, null ]);
  });

  test('should not trigger done callbacks', function () {
    var rejected = [];
    this.t.done(function () { rejected.push(1); }).
           done(function () { rejected.push(2); }).
           done(function () { rejected.push(3); });
    deepEqual(rejected, []);
    this.d.reject();
    deepEqual(rejected, []);
  });



  module(context + ' dv.deferred#rejectWith', { setup: setup });

  test('should make state rejected', function() {
    this.d.rejectWith(123);
    ok(this.t.state() === 'rejected');
  });

  test('should trigger fail callbacks in the order they were bound', function() {
    var rejected = [];
    this.t.fail(function () { rejected.push(1); }).
           fail(function () { rejected.push(2); }).
           fail(function () { rejected.push(3); });
    deepEqual(rejected, []);
    this.d.rejectWith(123);
    deepEqual(rejected, [ 1, 2, 3 ]);
  });

  test('should trigger fail callbacks passing them received arguments (passed as 2nd and last arg being an array)', function() {
    var rejected = [];
    this.t.fail(function () { rejected.push(args(arguments)); }).
           fail(function () { rejected.push(args(arguments)); }).
           fail(function () { rejected.push(args(arguments)); });
    deepEqual(rejected, []);
    this.d.rejectWith(123, [4,5,6]);
    deepEqual(rejected, [ [4,5,6], [4,5,6], [4,5,6] ]);
  });

  test('should trigger fail callbacks passing them received arguments (passed as additional args with 2nd arg not being an array)', function() {
    var rejected = [];
    this.t.fail(function () { rejected.push(args(arguments)); }).
           fail(function () { rejected.push(args(arguments)); }).
           fail(function () { rejected.push(args(arguments)); });
    deepEqual(rejected, []);
    this.d.rejectWith(123, 4, 5, 6, 7);
    deepEqual(rejected, [ [4,5,6,7], [4,5,6,7], [4,5,6,7] ]);
  });

  test('should trigger fail callbacks passing them received arguments (passed as additional args with 2nd being an array)', function() {
    var rejected = [];
    this.t.fail(function () { rejected.push(args(arguments)); }).
           fail(function () { rejected.push(args(arguments)); }).
           fail(function () { rejected.push(args(arguments)); });
    deepEqual(rejected, []);
    this.d.rejectWith(123, [4,5,6], 7);
    deepEqual(rejected, [ [[4,5,6], 7], [[4,5,6], 7], [[4,5,6], 7] ]);
  });

  test('should trigger fail callbacks w/ context provided', function() {
    var rejected = [];
    this.t.fail(function () { rejected.push(this); }).
           fail(function () { rejected.push(this); }).
           fail(function () { rejected.push(this); });
    deepEqual(rejected, []);
    this.d.rejectWith(10);
    deepEqual(rejected, [ 10, 10, 10 ]);
  });

  test('should trigger always callbacks in the order they were bound', function() {
    var rejected = [];
    this.t.always(function () { rejected.push(1); }).
           always(function () { rejected.push(2); }).
           always(function () { rejected.push(3); });
    deepEqual(rejected, []);
    this.d.rejectWith(123);
    deepEqual(rejected, [ 1, 2, 3 ]);
  });

  test('should trigger always callbacks passing them received arguments', function() {
    var rejected = [];
    this.t.always(function () { rejected.push(args(arguments)); }).
           always(function () { rejected.push(args(arguments)); }).
           always(function () { rejected.push(args(arguments)); });
    deepEqual(rejected, []);
    this.d.rejectWith(123, [4,5,6]);
    deepEqual(rejected, [ [4,5,6], [4,5,6], [4,5,6] ]);
  });

  test('should trigger always callbacks w/ context provided', function() {
    var rejected = [];
    this.t.always(function () { 'use strict'; rejected.push(this); }).
           always(function () { 'use strict'; rejected.push(this); }).
           always(function () { 'use strict'; rejected.push(this); });
    deepEqual(rejected, []);
    this.d.rejectWith(11);
    deepEqual(rejected, [ 11, 11, 11 ]);
  });

  test('should trigger both fail and always callbacks in the order they were bound', function() {
    var rejected = [];
    this.t.fail(function ()   { rejected.push(1); }).
           always(function () { rejected.push(2); }).
           fail(function ()   { rejected.push(3); }).
           always(function () { rejected.push(4); });
    deepEqual(rejected, []);
    this.d.rejectWith(123);
    deepEqual(rejected, [ 1, 2, 3, 4 ]);
  });

  test('should trigger both fail and always callbacks passing them received arguments', function() {
    var rejected = [];
    this.t.fail(function ()   { rejected.push(args(arguments)); }).
           always(function () { rejected.push(args(arguments)); }).
           fail(function ()   { rejected.push(args(arguments)); }).
           always(function () { rejected.push(args(arguments)); });
    deepEqual(rejected, []);
    this.d.rejectWith(123, [4,5,6]);
    deepEqual(rejected, [ [4,5,6], [4,5,6], [4,5,6], [4,5,6] ]);
  });

  test('should trigger both fail and always callbacks wo/ context', function() {
    var rejected = [];
    this.t.fail(function ()   { 'use strict'; rejected.push(this); }).
           always(function () { 'use strict'; rejected.push(this); }).
           fail(function ()   { 'use strict'; rejected.push(this); }).
           always(function () { 'use strict'; rejected.push(this); });
    deepEqual(rejected, []);
    this.d.rejectWith(12);
    deepEqual(rejected, [ 12, 12, 12, 12 ]);
  });

  test('should not trigger done callbacks', function () {
    var rejected = [];
    this.t.done(function () { rejected.push(1); }).
           done(function () { rejected.push(2); }).
           done(function () { rejected.push(3); });
    deepEqual(rejected, []);
    this.d.rejectWith(123);
    deepEqual(rejected, []);
  });



  module(context + ' dv.deferred#state', { setup: setup });

  test('should be `pending` right after creation', function() {
    ok(this.t.state() === 'pending');
  });

  test('should be `resolved` after resolve call', function() {
    this.d.resolve();
    ok(this.t.state() === 'resolved');
  });

  test('should stay `resolved` after subsequent resolve calls', function() {
    this.d.resolve();
    ok(this.t.state() === 'resolved');
    this.d.resolve();
    ok(this.t.state() === 'resolved');
    this.d.resolve();
    ok(this.t.state() === 'resolved');
  });

  test('should be `resolved` after resolveWith call', function() {
    this.d.resolveWith(123);
    ok(this.t.state() === 'resolved');
  });

  test('should be `rejected` after reject call', function() {
    this.d.reject();
    ok(this.t.state() === 'rejected');
  });

  test('should stay `rejected` after subsequent reject calls', function() {
    this.d.reject();
    ok(this.t.state() === 'rejected');
    this.d.reject();
    ok(this.t.state() === 'rejected');
    this.d.reject();
    ok(this.t.state() === 'rejected');
  });

  test('should be `rejected` after rejectWith call', function() {
    this.d.rejectWith(123);
    ok(this.d.state() === 'rejected');
  });

  test('should not change to `rejected` after being resolved', function() {
    this.d.resolve();
    this.d.reject();
    ok(this.t.state() === 'resolved');
    this.d.rejectWith(123);
    ok(this.t.state() === 'resolved');
  });

  test('should not change to `rejected` after being resolved w/ resolvedWith', function() {
    this.d.resolveWith(123);
    this.d.reject();
    ok(this.t.state() === 'resolved');
    this.d.rejectWith(234);
    ok(this.t.state() === 'resolved');
  });

  test('should not change to `resolved` after being rejected', function() {
    this.d.reject();
    this.d.resolve();
    ok(this.t.state() === 'rejected');
    this.d.resolveWith(123);
    ok(this.t.state() === 'rejected');
  });

  test('should not change to `rejected` after being rejected w/ rejectWith', function() {
    this.d.rejectWith(123);
    this.d.resolve();
    ok(this.t.state() === 'rejected');
    this.d.resolveWith(234);
    ok(this.t.state() === 'rejected');
  });


  module(context + ' dv.deferred#done', { setup: setup });

  test('should not change state of a new deferred', function() {
    ok(this.t.state() === 'pending');
    this.t.done(function () {});
    ok(this.t.state() === 'pending');
  });

  test('should not change state of a resolved deferred', function() {
    this.d.resolve();
    ok(this.t.state() === 'resolved');
    this.t.done(function () {});
    ok(this.t.state() === 'resolved');
  });

  test('should not change state of a rejected deferred', function() {
    this.d.reject();
    ok(this.t.state() === 'rejected');
    this.t.done(function () {});
    ok(this.t.state() === 'rejected');
  });

  test('should trigger done callback immediately with arguments and context the deferred was previously resolved', function() {
    var argz, context;
    this.d.resolveWith(123, [ 1, 2, 3 ]);
    ok(context === undefined);
    ok(argz === undefined);
    this.t.done(function () { context = this; argz = args(arguments); });
    ok(context == 123);
    deepEqual(argz, [ 1, 2, 3 ]);
  });

  test('should never trigger fail callback', function() {
    var failTriggered = false;
    this.t.fail(function () { failTriggered = true; });
    this.t.done(function () {});
    ok(!failTriggered);
    this.d.resolve();
    ok(!failTriggered);
    this.t.done(function () {});
    ok(!failTriggered);
  });

  test('should not throw errors', function() {
    this.t.done();
    ok(true);
    this.d.resolve();
    this.t.done();
    ok(true);
  });

  test('should return correct self', (function(context) {
    return function () {
      var ret = this.t.done();
      if (context === 'DEFERRED') {
        ok(objSize(ret) == 9);
        ok(ret === this.d);
      } else {
        ok(objSize(ret) == 5);
        ok(ret === this.t);
      }
    }
  })(context));


  module(context + ' dv.deferred#fail', { setup: setup });

  test('should not change state of a new deferred', function() {
    ok(this.t.state() === 'pending');
    this.t.fail(function () {});
    ok(this.t.state() === 'pending');
  });

  test('should not change state of a resolved deferred', function() {
    this.d.resolve();
    ok(this.t.state() === 'resolved');
    this.t.fail(function () {});
    ok(this.t.state() === 'resolved');
  });

  test('should not change state of a rejected deferred', function() {
    this.d.reject();
    ok(this.t.state() === 'rejected');
    this.t.fail(function () {});
    ok(this.t.state() === 'rejected');
  });

  test('should trigger fail callback immediately with arguments and context the deferred was previously rejected', function() {
    var argz, context;
    this.d.rejectWith(123, [ 1, 2, 3 ]);
    ok(context === undefined);
    ok(argz === undefined);
    this.t.fail(function () { context = this; argz = args(arguments); });
    ok(context == 123);
    deepEqual(argz, [ 1, 2, 3 ]);
  });

  test('should never trigger done callback', function() {
    var doneTriggered = false;
    this.t.done(function () { doneTriggered = true; });
    this.t.fail(function () {});
    ok(!doneTriggered);
    this.d.reject();
    ok(!doneTriggered);
    this.t.fail(function () {});
    ok(!doneTriggered);
  });

  test('should not throw errors', function() {
    this.t.fail();
    ok(true);
    this.d.resolve();
    this.t.fail();
    ok(true);
  });

  test('should return correct self', (function(context) {
    return function () {
      var ret = this.t.fail();
      if (context === 'DEFERRED') {
        ok(objSize(ret) == 9);
        ok(ret === this.d);
      } else {
        ok(objSize(ret) == 5);
        ok(ret === this.t);
      }
    }
  })(context));


  module(context + ' dv.deferred#always', { setup: setup });

  test('should not change state of a new deferred', function() {
    ok(this.t.state() === 'pending');
    this.t.always(function () {});
    ok(this.t.state() === 'pending');
  });

  test('should not change state of a resolved deferred', function() {
    this.d.resolve();
    ok(this.t.state() === 'resolved');
    this.t.always(function () {});
    ok(this.t.state() === 'resolved');
  });

  test('should not change state of a rejected deferred', function() {
    this.d.reject();
    ok(this.t.state() === 'rejected');
    this.t.always(function () {});
    ok(this.t.state() === 'rejected');
  });

  test('should trigger always callback immediately if deferred is already resolved', function() {
    var alwaysTriggered = false;
    this.d.resolve();
    this.t.always(function () { alwaysTriggered = true; });
    ok(alwaysTriggered);
  });

  test('should trigger always callback immediately if deferred is already rejected', function() {
    var alwaysTriggered = false;
    this.d.reject();
    this.t.always(function () { alwaysTriggered = true; });
    ok(alwaysTriggered);
  });

  test('should never trigger done callback', function() {
    var doneTriggered = false;
    this.t.done(function () { doneTriggered = true; });
    this.t.always(function () {});
    ok(!doneTriggered);
    this.d.reject();
    ok(!doneTriggered);
    this.t.always(function () {});
    ok(!doneTriggered);
  });

  test('should never trigger fail callback', function() {
    var failTriggered = false;
    this.t.fail(function () { failTriggered = true; });
    this.t.always(function () {});
    ok(!failTriggered);
    this.d.resolve();
    ok(!failTriggered);
    this.t.always(function () {});
    ok(!failTriggered);
  });

  test('should not throw errors', function() {
    this.t.always();
    ok(true);
    this.d.resolve();
    this.t.always();
    ok(true);
  });

  test('should return correct self', (function(context) {
    return function () {
      var ret = this.t.always();
      if (context === 'DEFERRED') {
        ok(objSize(ret) == 9);
        ok(ret === this.d);
      } else {
        ok(objSize(ret) == 5);
        ok(ret === this.t);
      }
    }
  })(context));
}