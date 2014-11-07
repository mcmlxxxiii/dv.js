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



  module('dv.deferred#promise ' + context, { setup: setup });

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



  module('dv.deferred#resolve ' + context, { setup: setup });

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



  module('dv.deferred#resolveWith ' + context, { setup: setup });

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

  test('should trigger done callbacks passing them received arguments', function() {
    var resolved = [];
    this.t.done(function () { resolved.push(args(arguments)); }).
           done(function () { resolved.push(args(arguments)); }).
           done(function () { resolved.push(args(arguments)); });
    deepEqual(resolved, []);
    this.d.resolveWith(123, [4, 5, 6]);
    deepEqual(resolved, [ [4,5,6], [4,5,6], [4,5,6] ]);
  });

  test('should trigger done callbacks wo/ context', function() {
    var resolved = [];
    this.t.done(function () { resolved.push(123); }).
           done(function () { resolved.push(123); }).
           done(function () { resolved.push(123); });
    deepEqual(resolved, []);
    this.d.resolveWith(123);
    deepEqual(resolved, [ 123, 123, 123 ]);
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

  test('should trigger always callbacks wo/ context', function() {
    var resolved = [];
    this.t.always(function () { 'use strict'; resolved.push(this); }).
           always(function () { 'use strict'; resolved.push(this); }).
           always(function () { 'use strict'; resolved.push(this); });
    deepEqual(resolved, []);
    this.d.resolveWith(456);
    deepEqual(resolved, [ 456, 456, 456 ]);
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

  test('should trigger both done and always callbacks wo/ context', function() {
    var resolved = [];
    this.t.done(function ()   { 'use strict'; resolved.push(this); }).
           always(function () { 'use strict'; resolved.push(this); }).
           done(function ()   { 'use strict'; resolved.push(this); }).
           always(function () { 'use strict'; resolved.push(this); });
    deepEqual(resolved, []);
    this.d.resolveWith(567);
    deepEqual(resolved, [ 567, 567, 567, 567 ]);
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



  module('dv.deferred#reject ' + context, { setup: setup });

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



  module('dv.deferred#rejectWith ' + context, { setup: setup });

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

  test('should trigger fail callbacks passing them received arguments', function() {
    var rejected = [];
    this.t.fail(function () { rejected.push(args(arguments)); }).
           fail(function () { rejected.push(args(arguments)); }).
           fail(function () { rejected.push(args(arguments)); });
    deepEqual(rejected, []);
    this.d.rejectWith(123, [4,5,6]);
    deepEqual(rejected, [ [4,5,6], [4,5,6], [4,5,6] ]);
  });

  test('should trigger fail callbacks wo/ context', function() {
    var rejected = [];
    this.t.fail(function () { rejected.push(123); }).
           fail(function () { rejected.push(123); }).
           fail(function () { rejected.push(123); });
    deepEqual(rejected, []);
    this.d.rejectWith(123);
    deepEqual(rejected, [ 123, 123, 123 ]);
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

  test('should trigger always callbacks wo/ context', function() {
    var rejected = [];
    this.t.always(function () { 'use strict'; rejected.push(this); }).
           always(function () { 'use strict'; rejected.push(this); }).
           always(function () { 'use strict'; rejected.push(this); });
    deepEqual(rejected, []);
    this.d.rejectWith(456);
    deepEqual(rejected, [ 456, 456, 456 ]);
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
    this.d.rejectWith(567);
    deepEqual(rejected, [ 567, 567, 567, 567 ]);
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



  module('dv.deferred#state ' + context, { setup: setup });

  test('should be `pending` right after creation', function() {
    ok(this.t.state() === 'pending');
  });

  test('should be `resolved` after resolve call', function() {
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


  for (var j = 0; j < CALLBACKS.length; j++) {
    var callback = CALLBACKS[j];

    module('dv.deferred#' + callback + ' ' + context, { setup: setup });

    test('should not change state', function() {
      ok(this.t.state() === 'pending');
      this.t[callback](function () {});
      ok(this.t.state() === 'pending');

      this.d.resolve();
      ok(this.t.state() === 'resolved');
      this.t[callback](function () {});
      ok(this.t.state() === 'resolved');
    });

    test('should not throw errors', function() {
      this.t[callback]();
      ok(true);
    });

    test('should return correct self', (function(context) {
      return function () {
        var ret = this.t[callback]();
        if (context === 'DEFERRED') {
          ok(objSize(ret) == 9);
        } else {
          ok(objSize(ret) == 5);
        }
      }
    })(context));

  }
}
