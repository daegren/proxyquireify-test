(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"./tests/foo_spec.js":[function(require,module,exports){
/* proxyquireify injected requires to make browserify include dependencies in the bundle */;require('foo');/* proxyquireify injected requires to make browserify include dependencies in the bundle */;require('foo');var proxyquire = require('proxyquireify')(require);
var foo = proxyquire('foo', {
  'bar' : {
    hi: function() {
      debugger;
      return 'proxy';
    }
  }
});

console.log(foo());

},{"foo":"js/foo.js","proxyquireify":"/Users/dev/Code/dave/proxyquireify-test/node_modules/proxyquireify/index.js"}],"/Users/dev/Code/dave/proxyquireify-test/node_modules/proxyquireify/index.js":[function(require,module,exports){
'use strict';

function ProxyquireifyError(msg) {
  this.name = 'ProxyquireifyError';
  Error.captureStackTrace(this, ProxyquireifyError);
  this.message = msg || 'An error occurred inside proxyquireify.';
}

function validateArguments(request, stubs) {
  var msg = (function getMessage() {
    if (!request)
      return 'Missing argument: "request". Need it to resolve desired module.';

    if (!stubs)
      return 'Missing argument: "stubs". If no stubbing is needed, use regular require instead.';

    if (typeof request != 'string')
      return 'Invalid argument: "request". Needs to be a requirable string that is the module to load.';

    if (typeof stubs != 'object')
      return 'Invalid argument: "stubs". Needs to be an object containing overrides e.g., {"path": { extname: function () { ... } } }.';
  })();

  if (msg) throw new ProxyquireifyError(msg);
}

var stubs;

function stub(stubs_) {
  stubs = stubs_;
  // This cache is used by the prelude as an alternative to the regular cache.
  // It is not read or written here, except to set it to an empty object when
  // adding stubs and to reset it to null when clearing stubs.
  module.exports._cache = {};
}

function reset() {
  stubs = undefined;
  module.exports._cache = null;
}

function fillMissingKeys(mdl, original) {
  Object.keys(original).forEach(function (key) {
    if (!mdl[key]) mdl[key] = original[key];
  });
  if (typeof mdl === 'function' && typeof original === 'function') {
      Object.keys(original.prototype).forEach(function (key) {
          if (!mdl.prototype[key]) mdl.prototype[key] = original.prototype[key];
      });
  }

  return mdl;
}

var proxyquire = module.exports = function (require_) {
  if (typeof require_ != 'function')
    throw new ProxyquireifyError(
        'It seems like you didn\'t initialize proxyquireify with the require in your test.\n'
      + 'Make sure to correct this, i.e.: "var proxyquire = require(\'proxyquireify\')(require);"'
    );

  reset();

  return function(request, stubs) {

    validateArguments(request, stubs);

    // set the stubs and require dependency
    // when stub require is invoked by the module under test it will find the stubs here
    stub(stubs);
    var dep = require_(request);
    reset();

    return dep;
  };
};

// Start with the default cache
proxyquire._cache = null;

proxyquire._proxy = function (require_, request) {
  function original() {
    return require_(request);
  }

  if (!stubs) return original();

  var stub = stubs[request];

  if (!stub) return original();

  var stubWideNoCallThru = !!stubs['@noCallThru'] && stub['@noCallThru'] !== false;
  var noCallThru = stubWideNoCallThru || !!stub['@noCallThru'];
  return noCallThru ? stub : fillMissingKeys(stub, original());
};

if (require.cache) {
  // only used during build, so prevent browserify from including it
  var replacePreludePath = './lib/replace-prelude';
  var replacePrelude = require(replacePreludePath);
  proxyquire.browserify = replacePrelude.browserify;
  proxyquire.plugin = replacePrelude.plugin;
}

},{}],"js/bar.js":[function(require,module,exports){
module.exports = {
  hi: function() {
    return 'this';
  }
};

},{}],"js/foo.js":[function(require,module,exports){
var bar = require('bar');

module.exports = function() {
  console.log(bar.hi());
};

},{"bar":"js/bar.js"}]},{},["./tests/foo_spec.js"]);