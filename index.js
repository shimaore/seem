function async(makeGenerator){
  return function (){
    var generator = makeGenerator.apply(this, arguments);
    function handle(result){ // { done: [Boolean], value: [Object] }
      var value = result.value;
      if (result.done) return value;
      if('function' !== typeof value.then) {
        debug('Expected a Promise',value);
        value = Promise.resolve(value);
      }
      return value.then(function (res){
        return handle(generator.next(res));
      }, function (err){
        return handle(generator.throw(err));
      })
    }
    return handle(generator.next());
  }
}
module.exports = async;
var debug = require('debug')('seem');
