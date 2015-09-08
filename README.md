Promises and Generators
=======================

This is [@ForbesLindesay](https://github.com/ForbesLindesay)'s `async` function from his [Control Flow Utopia](http://pag.forbeslindesay.co.uk/) presentation. I was surprised to find out it apparently hadn't been packaged yet.

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

Essentially `yield` turns its Promise argument into that Promise's result.

Replace `Promise.resolve` with your preferred asynchronous operation for full power.
