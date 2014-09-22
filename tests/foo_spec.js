var proxyquire = require('proxyquireify')(require);
var foo = proxyquire('foo', {
  'bar' : {
    hi: function() {
      return 'proxy';
    }
  }
});

console.log(foo());
