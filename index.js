var __Promise = Promise;
function async(makeGenerator){
  return function (){
    var generator = makeGenerator.apply(this, arguments);
    function handle(result){ // { done: [Boolean], value: [Object] }
      var value = result.value;
      if (result.done) return value;
      if(typeof value === 'undefined' || value === null || 'function' !== typeof value.then) {
        value = __Promise.resolve(value);
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
module.exports.use = function (p) { __Promise = p; }
