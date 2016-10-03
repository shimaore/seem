[![Build Status](https://travis-ci.org/shimaore/seem.svg?branch=master)](https://travis-ci.org/shimaore/seem)

seem: Promises and Generators for async/await
=============================================

`seem` is a tiny module that gives you the power of ES7's `async/await` using ES6's `yield`.

This is [@ForbesLindesay](https://github.com/ForbesLindesay)'s `async` function from his [Control Flow Utopia](http://pag.forbeslindesay.co.uk/) presentation, with an extension to accept non-thenable.

```javascript
var seem = require('seem');

var g = seem(function*(n){
  var a = yield Promise.resolve(n+4);
  var b = yield Promise.resolve(a+5);
  return b+3;
});
```

The function will now return a Promise that will resolve to the value of the `return` statement upon success.

```javascript
g(2).then(function(result){ assert(result === 2+4+5+3); })
```

Essentially, inside a `seem`-ified generator function, `yield` turns its Promise argument into that Promise's result.

Replace `Promise.resolve` in the example with your preferred asynchronous operation for full power.

Accepts non-Promises
--------------------

If the value you `yield` is not thenable, `seem` will turn it into a Promise.

```javascript
var seem = require('seem');

var g = seem(function*(n){
  var a = yield n+4;
  var b = yield Promise.resolve(a+5);
  return b+3;
});
```

In other words you can freely mix-and-match Promises and non-Promises, and `seem` will do the right thing.

(Contrarily to `co` v4, `seem` will not attempt to resolve Promises in an array or an object given to `yield`. It will pass the array or object as-is.)

This module uses native Promises by default; `seem.use(Promise)` to provide your own (or use a polyfill before including the module).
