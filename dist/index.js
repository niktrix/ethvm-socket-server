/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 61);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = require("ethereumjs-util");

/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = require("util");

/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = require("async");

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

const createPayload = __webpack_require__(8)

module.exports = SubProvider

// this is the base class for a subprovider -- mostly helpers


function SubProvider() {

}

SubProvider.prototype.setEngine = function(engine) {
  const self = this
  self.engine = engine
  engine.on('block', function(block) {
    self.currentBlock = block
  })
}

SubProvider.prototype.handleRequest = function(payload, next, end) {
  throw new Error('Subproviders should override `handleRequest`.')
}

SubProvider.prototype.emitPayload = function(payload, cb){
  const self = this
  self.engine.sendAsync(createPayload(payload), cb)
}

/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = require("ethereum-common");

/***/ }),
/* 5 */
/***/ (function(module, exports) {

module.exports = require("safe-buffer");

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var ERROR = {
  OUT_OF_GAS: 'out of gas',
  STACK_UNDERFLOW: 'stack underflow',
  STACK_OVERFLOW: 'stack overflow',
  INVALID_JUMP: 'invalid JUMP',
  INVALID_OPCODE: 'invalid opcode',
  REVERT: 'revert',
  STATIC_STATE_CHANGE: 'static state change',
  INTERNAL_ERROR: 'internal error'
};

function VmError(error) {
  this.error = error;
}

module.exports = {
  ERROR: ERROR,
  VmError: VmError
};

/***/ }),
/* 7 */
/***/ (function(module, exports) {

module.exports = require("assert");

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

const getRandomId = __webpack_require__(93)
const extend = __webpack_require__(17)

module.exports = createPayload


function createPayload(data){
  return extend({
    // defaults
    id: getRandomId(),
    jsonrpc: '2.0',
    params: [],
    // user-specified
  }, data)
}


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", { value: true });
const global_1 = __webpack_require__(62);
exports.default = {
    global: global_1.default
};

/***/ }),
/* 10 */
/***/ (function(module, exports) {

module.exports = require("ethereumjs-account");

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

const async = __webpack_require__(2)

module.exports = {
  matchingNibbleLength: matchingNibbleLength,
  callTogether: callTogether,
  asyncFirstSeries: asyncFirstSeries,
  doKeysMatch: doKeysMatch
}

/**
 * Returns the number of in order matching nibbles of two give nibble arrayes
 * @method matchingNibbleLength
 * @param {Array} nib1
 * @param {Array} nib2
 */
function matchingNibbleLength (nib1, nib2) {
  var i = 0
  while (nib1[i] === nib2[i] && nib1.length > i) {
    i++
  }
  return i
}

/**
 * Compare two 'nibble array' keys
 */
function doKeysMatch (keyA, keyB) {
  var length = matchingNibbleLength(keyA, keyB)
  return length === keyA.length && length === keyB.length
}

/**
 * Take two or more functions and returns a function  that will execute all of
 * the given functions
 */
function callTogether () {
  var funcs = arguments
  var length = funcs.length
  var index = length

  if (!length) {
    return function () {}
  }

  return function () {
    length = index

    while (length--) {
      var fn = funcs[length]
      if (typeof fn === 'function') {
        var result = funcs[length].apply(this, arguments)
      }
    }
    return result
  }
}

/**
 * Take a collection of async fns, call the cb on the first to return a truthy value.
 * If all run without a truthy result, return undefined
 */
function asyncFirstSeries (array, iterator, cb) {
  var didComplete = false
  async.eachSeries(array, function (item, next) {
    if (didComplete) return next
    iterator(item, function (err, result) {
      if (result) {
        didComplete = true
        process.nextTick(cb.bind(null, null, result))
      }
      next(err)
    })
  }, function () {
    if (!didComplete) {
      cb()
    }
  })
}


/***/ }),
/* 12 */
/***/ (function(module, exports) {

/**
 * This method returns `undefined`.
 *
 * @static
 * @memberOf _
 * @since 2.3.0
 * @category Util
 * @example
 *
 * _.times(2, _.noop);
 * // => [undefined, undefined]
 */
function noop() {
  // No operation performed.
}

module.exports = noop;


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.isAsync = undefined;

var _asyncify = __webpack_require__(44);

var _asyncify2 = _interopRequireDefault(_asyncify);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var supportsSymbol = typeof Symbol === 'function';

function isAsync(fn) {
    return supportsSymbol && fn[Symbol.toStringTag] === 'AsyncFunction';
}

function wrapAsync(asyncFn) {
    return isAsync(asyncFn) ? (0, _asyncify2.default)(asyncFn) : asyncFn;
}

exports.default = wrapAsync;
exports.isAsync = isAsync;

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = slice;
function slice(arrayLike, start) {
    start = start | 0;
    var newLen = Math.max(arrayLike.length - start, 0);
    var newArr = Array(newLen);
    for (var idx = 0; idx < newLen; idx++) {
        newArr[idx] = arrayLike[start + idx];
    }
    return newArr;
}
module.exports = exports["default"];

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", { value: true });
const SmallBlock_1 = __webpack_require__(71);
exports.SmallBlock = SmallBlock_1.default;
const SmallTx_1 = __webpack_require__(72);
exports.SmallTx = SmallTx_1.default;
const BlockStats_1 = __webpack_require__(73);
exports.BlockStats = BlockStats_1.default;
const common = __webpack_require__(74);
exports.common = common;

/***/ }),
/* 16 */
/***/ (function(module, exports) {

module.exports = require("events");

/***/ }),
/* 17 */
/***/ (function(module, exports) {

module.exports = require("xtend");

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = onlyOnce;
function onlyOnce(fn) {
    return function () {
        if (fn === null) throw new Error("Callback was already called.");
        var callFn = fn;
        fn = null;
        callFn.apply(this, arguments);
    };
}
module.exports = exports["default"];

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

var isFunction = __webpack_require__(130),
    isLength = __webpack_require__(55);

/**
 * Checks if `value` is array-like. A value is considered array-like if it's
 * not a function and has a `value.length` that's an integer greater than or
 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 * @example
 *
 * _.isArrayLike([1, 2, 3]);
 * // => true
 *
 * _.isArrayLike(document.body.children);
 * // => true
 *
 * _.isArrayLike('abc');
 * // => true
 *
 * _.isArrayLike(_.noop);
 * // => false
 */
function isArrayLike(value) {
  return value != null && isLength(value.length) && !isFunction(value);
}

module.exports = isArrayLike;


/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", { value: true });
const datastore_redis_1 = __webpack_require__(68);
const datastore_loki_1 = __webpack_require__(69);
const configs_1 = __webpack_require__(9);
let DS_TYPE = configs_1.default.global.DATASTORE;
let VALID_DS = {
    Redis: datastore_redis_1.default,
    LokiJS: datastore_loki_1.default
};
let expObj = {
    initialize: VALID_DS[DS_TYPE].initialize,
    addBlock: VALID_DS[DS_TYPE].addBlock,
    addTransaction: VALID_DS[DS_TYPE].addTransaction,
    getBlocks: VALID_DS[DS_TYPE].getBlocks,
    getTransactions: VALID_DS[DS_TYPE].getTransactions
};
exports.default = expObj;

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

const rlp = __webpack_require__(37)
const ethUtil = __webpack_require__(0)

module.exports = TrieNode

function TrieNode (type, key, value) {
  if (Array.isArray(type)) {
    // parse raw node
    this.parseNode(type)
  } else {
    this.type = type
    if (type === 'branch') {
      var values = key
      this.raw = Array.apply(null, Array(17))
      if (values) {
        values.forEach(function (keyVal) {
          this.set.apply(this, keyVal)
        })
      }
    } else {
      this.raw = Array(2)
      this.setValue(value)
      this.setKey(key)
    }
  }
}

TrieNode.isRawNode = isRawNode
TrieNode.addHexPrefix = addHexPrefix
TrieNode.removeHexPrefix = removeHexPrefix
TrieNode.isTerminator = isTerminator
TrieNode.stringToNibbles = stringToNibbles
TrieNode.nibblesToBuffer = nibblesToBuffer
TrieNode.getNodeType = getNodeType

Object.defineProperty(TrieNode.prototype, 'value', {
  get: function () {
    return this.getValue()
  },
  set: function (v) {
    this.setValue(v)
  }
})

Object.defineProperty(TrieNode.prototype, 'key', {
  get: function () {
    return this.getKey()
  },
  set: function (k) {
    this.setKey(k)
  }
})

// parses a raw node
TrieNode.prototype.parseNode = function (rawNode) {
  this.raw = rawNode
  this.type = getNodeType(rawNode)
}

// sets the value of the node
TrieNode.prototype.setValue = function (key, value) {
  if (this.type !== 'branch') {
    this.raw[1] = key
  } else {
    if (arguments.length === 1) {
      value = key
      key = 16
    }
    this.raw[key] = value
  }
}

TrieNode.prototype.getValue = function (key) {
  if (this.type === 'branch') {
    if (arguments.length === 0) {
      key = 16
    }

    var val = this.raw[key]
    if (val !== null && val !== undefined && val.length !== 0) {
      return val
    }
  } else {
    return this.raw[1]
  }
}

TrieNode.prototype.setKey = function (key) {
  if (this.type !== 'branch') {
    if (Buffer.isBuffer(key)) {
      key = stringToNibbles(key)
    } else {
      key = key.slice(0) // copy the key
    }

    key = addHexPrefix(key, this.type === 'leaf')
    this.raw[0] = nibblesToBuffer(key)
  }
}

// returns the key as a nibble
TrieNode.prototype.getKey = function () {
  if (this.type !== 'branch') {
    var key = this.raw[0]
    key = removeHexPrefix(stringToNibbles(key))
    return (key)
  }
}

TrieNode.prototype.serialize = function () {
  return rlp.encode(this.raw)
}

TrieNode.prototype.hash = function () {
  return ethUtil.sha3(this.serialize())
}

TrieNode.prototype.toString = function () {
  var out = this.type
  out += ': ['
  this.raw.forEach(function (el) {
    if (Buffer.isBuffer(el)) {
      out += el.toString('hex') + ', '
    } else if (el) {
      out += 'object, '
    } else {
      out += 'empty, '
    }
  })
  out = out.slice(0, -2)
  out += ']'
  return out
}

TrieNode.prototype.getChildren = function () {
  var children = []
  switch (this.type) {
    case 'leaf':
      // no children
      break
    case 'extention':
      // one child
      children.push([this.key, this.getValue()])
      break
    case 'branch':
      for (var index = 0, end = 16; index < end; index++) {
        var value = this.getValue(index)
        if (value) {
          children.push([
            [index], value
          ])
        }
      }
      break
  }
  return children
}

/**
 * @param {Array} dataArr
 * @returns {Buffer} - returns buffer of encoded data
 * hexPrefix
 **/
function addHexPrefix (key, terminator) {
  // odd
  if (key.length % 2) {
    key.unshift(1)
  } else {
    // even
    key.unshift(0)
    key.unshift(0)
  }

  if (terminator) {
    key[0] += 2
  }

  return key
}

function removeHexPrefix (val) {
  if (val[0] % 2) {
    val = val.slice(1)
  } else {
    val = val.slice(2)
  }

  return val
}

/*
 * Detrimines if a key has Arnold Schwarzenegger in it.
 * @method isTerminator
 * @param {Array} key - an hexprefixed array of nibbles
 */
function isTerminator (key) {
  return key[0] > 1
}

/*
 * Converts a string OR a buffer to a nibble array
 * @method stringToNibbles
 * @param {Buffer| String} key
 */
function stringToNibbles (key) {
  var bkey = new Buffer(key)
  var nibbles = []

  for (var i = 0; i < bkey.length; i++) {
    var q = i * 2
    nibbles[q] = bkey[i] >> 4
    ++q
    nibbles[q] = bkey[i] % 16
  }
  return nibbles
}

/*
 * Converts a  nibble array into a buffer
 * @method nibblesToBuffer
 * @param arr
 */
function nibblesToBuffer (arr) {
  var buf = new Buffer(arr.length / 2)
  for (var i = 0; i < buf.length; i++) {
    var q = i * 2
    buf[i] = (arr[q] << 4) + arr[++q]
  }
  return buf
}

/*
 * Determines the node type
 * Returns the following
 * - leaf - if teh node is a leaf
 * - branch - if the node is a branch
 * - extention - if the node is an extention
 * - unknown - if somehting fucked up
 */
function getNodeType (node) {
  if (node.length === 17) {
    return 'branch'
  } else if (node.length === 2) {
    var key = stringToNibbles(node[0])
    if (isTerminator(key)) {
      return 'leaf'
    }

    return 'extention'
  }
}

function isRawNode (node) {
  return Array.isArray(node) && !Buffer.isBuffer(node)
}


/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

const stringify = __webpack_require__(92)

module.exports = {
  cacheIdentifierForPayload: cacheIdentifierForPayload,
  canCache: canCache,
  blockTagForPayload: blockTagForPayload,
  paramsWithoutBlockTag: paramsWithoutBlockTag,
  blockTagParamIndex: blockTagParamIndex,
  cacheTypeForPayload: cacheTypeForPayload,
}

function cacheIdentifierForPayload(payload, opts = {}){
  if (!canCache(payload)) return null
  const { includeBlockRef } = opts
  const params = includeBlockRef ? payload.params : paramsWithoutBlockTag(payload)
  return payload.method + ':' + stringify(params)
}

function canCache(payload){
  return cacheTypeForPayload(payload) !== 'never'
}

function blockTagForPayload(payload){
  var index = blockTagParamIndex(payload);

  // Block tag param not passed.
  if (index >= payload.params.length) {
    return null;
  }

  return payload.params[index];
}

function paramsWithoutBlockTag(payload){
  var index = blockTagParamIndex(payload);

  // Block tag param not passed.
  if (index >= payload.params.length) {
    return payload.params;
  }

  // eth_getBlockByNumber has the block tag first, then the optional includeTx? param
  if (payload.method === 'eth_getBlockByNumber') {
    return payload.params.slice(1);
  }

  return payload.params.slice(0,index);
}

function blockTagParamIndex(payload){
  switch(payload.method) {
    // blockTag is third param
    case 'eth_getStorageAt':
      return 2
    // blockTag is second param
    case 'eth_getBalance':
    case 'eth_getCode':
    case 'eth_getTransactionCount':
    case 'eth_call':
    case 'eth_estimateGas':
      return 1
    // blockTag is first param
    case 'eth_getBlockByNumber':
      return 0
    // there is no blockTag
    default:
      return undefined
  }
}

function cacheTypeForPayload(payload) {
  switch (payload.method) {
    // cache permanently
    case 'web3_clientVersion':
    case 'web3_sha3':
    case 'eth_protocolVersion':
    case 'eth_getBlockTransactionCountByHash':
    case 'eth_getUncleCountByBlockHash':
    case 'eth_getCode':
    case 'eth_getBlockByHash':
    case 'eth_getTransactionByHash':
    case 'eth_getTransactionByBlockHashAndIndex':
    case 'eth_getTransactionReceipt':
    case 'eth_getUncleByBlockHashAndIndex':
    case 'eth_getCompilers':
    case 'eth_compileLLL':
    case 'eth_compileSolidity':
    case 'eth_compileSerpent':
    case 'shh_version':
      return 'perma'

    // cache until fork
    case 'eth_getBlockByNumber':
    case 'eth_getBlockTransactionCountByNumber':
    case 'eth_getUncleCountByBlockNumber':
    case 'eth_getTransactionByBlockNumberAndIndex':
    case 'eth_getUncleByBlockNumberAndIndex':
      return 'fork'

    // cache for block
    case 'eth_gasPrice':
    case 'eth_blockNumber':
    case 'eth_getBalance':
    case 'eth_getStorageAt':
    case 'eth_getTransactionCount':
    case 'eth_call':
    case 'eth_estimateGas':
    case 'eth_getFilterLogs':
    case 'eth_getLogs':
    case 'net_peerCount':
      return 'block'

    // never cache
    case 'net_version':
    case 'net_peerCount':
    case 'net_listening':
    case 'eth_syncing':
    case 'eth_sign':
    case 'eth_coinbase':
    case 'eth_mining':
    case 'eth_hashrate':
    case 'eth_accounts':
    case 'eth_sendTransaction':
    case 'eth_sendRawTransaction':
    case 'eth_newFilter':
    case 'eth_newBlockFilter':
    case 'eth_newPendingTransactionFilter':
    case 'eth_uninstallFilter':
    case 'eth_getFilterChanges':
    case 'eth_getWork':
    case 'eth_submitWork':
    case 'eth_submitHashrate':
    case 'db_putString':
    case 'db_getString':
    case 'db_putHex':
    case 'db_getHex':
    case 'shh_post':
    case 'shh_newIdentity':
    case 'shh_hasIdentity':
    case 'shh_newGroup':
    case 'shh_addToGroup':
    case 'shh_newFilter':
    case 'shh_uninstallFilter':
    case 'shh_getFilterChanges':
    case 'shh_getMessages':
      return 'never'
  }
}


/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

const EventEmitter = __webpack_require__(16).EventEmitter
const inherits = __webpack_require__(1).inherits

module.exports = Stoplight


inherits(Stoplight, EventEmitter)

function Stoplight(){
  const self = this
  EventEmitter.call(self)
  self.isLocked = true
}

Stoplight.prototype.go = function(){
  const self = this
  self.isLocked = false
  self.emit('unlock')
}

Stoplight.prototype.stop = function(){
  const self = this
  self.isLocked = true
  self.emit('lock')
}

Stoplight.prototype.await = function(fn){
  const self = this
  if (self.isLocked) {
    self.once('unlock', fn)
  } else {
    setTimeout(fn)
  }
}

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

const async = __webpack_require__(2)
const inherits = __webpack_require__(1).inherits
const ethUtil = __webpack_require__(0)
const Subprovider = __webpack_require__(3)
const Stoplight = __webpack_require__(23)
const EventEmitter = __webpack_require__(16).EventEmitter

module.exports = FilterSubprovider

// handles the following RPC methods:
//   eth_newBlockFilter
//   eth_newPendingTransactionFilter
//   eth_newFilter
//   eth_getFilterChanges
//   eth_uninstallFilter
//   eth_getFilterLogs

inherits(FilterSubprovider, Subprovider)

function FilterSubprovider(opts) {
  opts = opts || {}
  const self = this
  self.filterIndex = 0
  self.filters = {}
  self.filterDestroyHandlers = {}
  self.asyncBlockHandlers = {}
  self.asyncPendingBlockHandlers = {}
  self._ready = new Stoplight()
  self._ready.setMaxListeners(opts.maxFilters || 25)
  self._ready.go()
  self.pendingBlockTimeout = opts.pendingBlockTimeout || 4000
  self.checkForPendingBlocksActive = false

  // we dont have engine immeditately
  setTimeout(function(){
    // asyncBlockHandlers require locking provider until updates are completed
    self.engine.on('block', function(block){
      // pause processing
      self._ready.stop()
      // update filters
      var updaters = valuesFor(self.asyncBlockHandlers)
      .map(function(fn){ return fn.bind(null, block) })
      async.parallel(updaters, function(err){
        if (err) console.error(err)
        // unpause processing
        self._ready.go()
      })
    })
  })

}

FilterSubprovider.prototype.handleRequest = function(payload, next, end){
  const self = this
  switch(payload.method){

    case 'eth_newBlockFilter':
      self.newBlockFilter(end)
      return

    case 'eth_newPendingTransactionFilter':
      self.newPendingTransactionFilter(end)
      self.checkForPendingBlocks()
      return

    case 'eth_newFilter':
      self.newLogFilter(payload.params[0], end)
      return

    case 'eth_getFilterChanges':
      self._ready.await(function(){
        self.getFilterChanges(payload.params[0], end)
      })
      return

    case 'eth_getFilterLogs':
      self._ready.await(function(){
        self.getFilterLogs(payload.params[0], end)
      })
      return

    case 'eth_uninstallFilter':
      self._ready.await(function(){
        self.uninstallFilter(payload.params[0], end)
      })
      return

    default:
      next()
      return
  }
}

FilterSubprovider.prototype.newBlockFilter = function(cb) {
  const self = this

  self._getBlockNumber(function(err, blockNumber){
    if (err) return cb(err)

    var filter = new BlockFilter({
      blockNumber: blockNumber,
    })

    var newBlockHandler = filter.update.bind(filter)
    self.engine.on('block', newBlockHandler)
    var destroyHandler = function(){
      self.engine.removeListener('block', newBlockHandler)
    }

    self.filterIndex++
    self.filters[self.filterIndex] = filter
    self.filterDestroyHandlers[self.filterIndex] = destroyHandler

    var hexFilterIndex = intToHex(self.filterIndex)
    cb(null, hexFilterIndex)
  })
}

FilterSubprovider.prototype.newLogFilter = function(opts, cb) {
  const self = this

  self._getBlockNumber(function(err, blockNumber){
    if (err) return cb(err)

    var filter = new LogFilter(opts)
    var newLogHandler = filter.update.bind(filter)
    var blockHandler = function(block, cb){
      self._logsForBlock(block, function(err, logs){
        if (err) return cb(err)
        newLogHandler(logs)
        cb()
      })
    }

    self.filterIndex++
    self.asyncBlockHandlers[self.filterIndex] = blockHandler
    self.filters[self.filterIndex] = filter

    var hexFilterIndex = intToHex(self.filterIndex)
    cb(null, hexFilterIndex)
  })
}

FilterSubprovider.prototype.newPendingTransactionFilter = function(cb) {
  const self = this

  var filter = new PendingTransactionFilter()
  var newTxHandler = filter.update.bind(filter)
  var blockHandler = function(block, cb){
    self._txHashesForBlock(block, function(err, txs){
      if (err) return cb(err)
      newTxHandler(txs)
      cb()
    })
  }

  self.filterIndex++
  self.asyncPendingBlockHandlers[self.filterIndex] = blockHandler
  self.filters[self.filterIndex] = filter

  var hexFilterIndex = intToHex(self.filterIndex)
  cb(null, hexFilterIndex)
}

FilterSubprovider.prototype.getFilterChanges = function(hexFilterId, cb) {
  const self = this

  var filterId = Number.parseInt(hexFilterId, 16)
  var filter = self.filters[filterId]
  if (!filter) console.warn('FilterSubprovider - no filter with that id:', hexFilterId)
  if (!filter) return cb(null, [])
  var results = filter.getChanges()
  filter.clearChanges()
  cb(null, results)
}

FilterSubprovider.prototype.getFilterLogs = function(hexFilterId, cb) {
  const self = this

  var filterId = Number.parseInt(hexFilterId, 16)
  var filter = self.filters[filterId]
  if (!filter) console.warn('FilterSubprovider - no filter with that id:', hexFilterId)
  if (!filter) return cb(null, [])
  if (filter.type === 'log') {
    self.emitPayload({
      method: 'eth_getLogs',
      params: [{
        fromBlock: filter.fromBlock,
        toBlock: filter.toBlock,
        address: filter.address,
        topics: filter.topics,
      }],
    }, function(err, res){
      if (err) return cb(err)
      cb(null, res.result)
    })
  } else {
    var results = filter.getAllResults()
    cb(null, results)
  }
}

FilterSubprovider.prototype.uninstallFilter = function(hexFilterId, cb) {
  const self = this

  var filterId = Number.parseInt(hexFilterId, 16)
  var filter = self.filters[filterId]
  if (!filter) {
    cb(null, false)
    return
  }

  self.filters[filterId].removeAllListeners()

  var destroyHandler = self.filterDestroyHandlers[filterId]
  delete self.filters[filterId]
  delete self.asyncBlockHandlers[filterId]
  delete self.asyncPendingBlockHandlers[filterId]
  delete self.filterDestroyHandlers[filterId]
  if (destroyHandler) destroyHandler()

  cb(null, true)
}

// private

// check for pending blocks
FilterSubprovider.prototype.checkForPendingBlocks = function(){
  const self = this
  if (self.checkForPendingBlocksActive) return
  var activePendingTxFilters = !!Object.keys(self.asyncPendingBlockHandlers).length
  if (activePendingTxFilters) {
    self.checkForPendingBlocksActive = true
    self.emitPayload({
      method: 'eth_getBlockByNumber',
      params: ['pending', true],
    }, function(err, res){
      if (err) {
        self.checkForPendingBlocksActive = false
        console.error(err)
        return
      }
      self.onNewPendingBlock(res.result, function(err){
        if (err) console.error(err)
        self.checkForPendingBlocksActive = false
        setTimeout(self.checkForPendingBlocks.bind(self), self.pendingBlockTimeout)
      })
    })
  }
}

FilterSubprovider.prototype.onNewPendingBlock = function(block, cb){
  const self = this
  // update filters
  var updaters = valuesFor(self.asyncPendingBlockHandlers)
  .map(function(fn){ return fn.bind(null, block) })
  async.parallel(updaters, cb)
}

FilterSubprovider.prototype._getBlockNumber = function(cb) {
  const self = this
  var blockNumber = bufferToNumberHex(self.engine.currentBlock.number)
  cb(null, blockNumber)
}

FilterSubprovider.prototype._logsForBlock = function(block, cb) {
  const self = this
  var blockNumber = bufferToNumberHex(block.number)
  self.emitPayload({
    method: 'eth_getLogs',
    params: [{
      fromBlock: blockNumber,
      toBlock: blockNumber,
    }],
  }, function(err, response){
    if (err) return cb(err)
    if (response.error) return cb(response.error)
    cb(null, response.result)
  })

}

FilterSubprovider.prototype._txHashesForBlock = function(block, cb) {
  const self = this
  var txs = block.transactions
  // short circuit if empty
  if (txs.length === 0) return cb(null, [])
  // txs are already hashes
  if ('string' === typeof txs[0]) {
    cb(null, txs)
  // txs are obj, need to map to hashes
  } else {
    var results = txs.map((tx) => tx.hash)
    cb(null, results)
  }
}

//
// BlockFilter
//

inherits(BlockFilter, EventEmitter)

function BlockFilter(opts) {
  // console.log('BlockFilter - new')
  const self = this
  EventEmitter.apply(self)
  self.type = 'block'
  self.engine = opts.engine
  self.blockNumber = opts.blockNumber
  self.updates = []
}

BlockFilter.prototype.update = function(block){
  // console.log('BlockFilter - update')
  const self = this
  var blockHash = bufferToHex(block.hash)
  self.updates.push(blockHash)
  self.emit('data', block)
}

BlockFilter.prototype.getChanges = function(){
  const self = this
  var results = self.updates
  // console.log('BlockFilter - getChanges:', results.length)
  return results
}

BlockFilter.prototype.clearChanges = function(){
  // console.log('BlockFilter - clearChanges')
  const self = this
  self.updates = []
}

//
// LogFilter
//

inherits(LogFilter, EventEmitter)

function LogFilter(opts) {
  // console.log('LogFilter - new')
  const self = this
  EventEmitter.apply(self)
  self.type = 'log'
  self.fromBlock = (opts.fromBlock !== undefined) ? opts.fromBlock : 'latest'
  self.toBlock = (opts.toBlock !== undefined) ? opts.toBlock : 'latest'
  self.address = opts.address ? normalizeHex(opts.address) : opts.address
  self.topics = opts.topics || []
  self.updates = []
  self.allResults = []
}

LogFilter.prototype.validateLog = function(log){
  // console.log('LogFilter - validateLog:', log)
  const self = this

  // check if block number in bounds:
  // console.log('LogFilter - validateLog - blockNumber', self.fromBlock, self.toBlock)
  if (blockTagIsNumber(self.fromBlock) && hexToInt(self.fromBlock) >= hexToInt(log.blockNumber)) return false
  if (blockTagIsNumber(self.toBlock) && hexToInt(self.toBlock) <= hexToInt(log.blockNumber)) return false

  // address is correct:
  // console.log('LogFilter - validateLog - address', self.address)
  if (self.address && self.address !== log.address) return false

  // topics match:
  // topics are position-dependant
  // topics can be nested to represent `or` [[a || b], c]
  // topics can be null, representing a wild card for that position
  // console.log('LogFilter - validateLog - topics', log.topics)
  // console.log('LogFilter - validateLog - against topics', self.topics)
  var topicsMatch = self.topics.reduce(function(previousMatched, topicPattern, index){
    // abort in progress
    if (!previousMatched) return false
    // wild card
    if (!topicPattern) return true
    // pattern is longer than actual topics
    var logTopic = log.topics[index]
    if (!logTopic) return false
    // check each possible matching topic
    var subtopicsToMatch = Array.isArray(topicPattern) ? topicPattern : [topicPattern]
    var topicDoesMatch = subtopicsToMatch.filter(function(subTopic){
      return logTopic === subTopic
    }).length > 0
    return topicDoesMatch
  }, true)

  // console.log('LogFilter - validateLog - '+(topicsMatch ? 'approved!' : 'denied!')+' ==============')
  return topicsMatch
}

LogFilter.prototype.update = function(logs){
  // console.log('LogFilter - update')
  const self = this
  // validate filter match
  var validLogs = []
  logs.forEach(function(log) {
    var validated = self.validateLog(log)
    if (!validated) return
    // add to results
    validLogs.push(log)
    self.updates.push(log)
    self.allResults.push(log)
  })
  if (validLogs.length > 0) {
    self.emit('data', validLogs)
  }
}

LogFilter.prototype.getChanges = function(){
  // console.log('LogFilter - getChanges')
  const self = this
  var results = self.updates
  return results
}

LogFilter.prototype.getAllResults = function(){
  // console.log('LogFilter - getAllResults')
  const self = this
  var results = self.allResults
  return results
}

LogFilter.prototype.clearChanges = function(){
  // console.log('LogFilter - clearChanges')
  const self = this
  self.updates = []
}

//
// PendingTxFilter
//

inherits(PendingTransactionFilter, EventEmitter)

function PendingTransactionFilter(){
  // console.log('PendingTransactionFilter - new')
  const self = this
  EventEmitter.apply(self)
  self.type = 'pendingTx'
  self.updates = []
  self.allResults = []
}

PendingTransactionFilter.prototype.validateUnique = function(tx){
  const self = this
  return self.allResults.indexOf(tx) === -1
}

PendingTransactionFilter.prototype.update = function(txs){
  // console.log('PendingTransactionFilter - update')
  const self = this
  var validTxs = []
  txs.forEach(function (tx) {
    // validate filter match
    var validated = self.validateUnique(tx)
    if (!validated) return
    // add to results
    validTxs.push(tx)
    self.updates.push(tx)
    self.allResults.push(tx)
  })
  if (validTxs.length > 0) {
    self.emit('data', validTxs)
  }
}

PendingTransactionFilter.prototype.getChanges = function(){
  // console.log('PendingTransactionFilter - getChanges')
  const self = this
  var results = self.updates
  return results
}

PendingTransactionFilter.prototype.getAllResults = function(){
  // console.log('PendingTransactionFilter - getAllResults')
  const self = this
  var results = self.allResults
  return results
}

PendingTransactionFilter.prototype.clearChanges = function(){
  // console.log('PendingTransactionFilter - clearChanges')
  const self = this
  self.updates = []
}

// util

function normalizeHex(hexString) {
  return hexString.slice(0, 2) === '0x' ? hexString : '0x'+hexString
}

function intToHex(value) {
  return ethUtil.intToHex(value)
}

function hexToInt(hexString) {
  return Number(hexString)
}

function bufferToHex(buffer) {
  return '0x'+buffer.toString('hex')
}

function bufferToNumberHex(buffer) {
  return stripLeadingZero(buffer.toString('hex'))
}

function stripLeadingZero(hexNum) {
  let stripped = ethUtil.stripHexPrefix(hexNum)
  while (stripped[0] === '0') {
    stripped = stripped.substr(1)
  }
  return `0x${stripped}`
}

function blockTagIsNumber(blockTag){
  return blockTag && ['earliest', 'latest', 'pending'].indexOf(blockTag) === -1
}

function valuesFor(obj){
  return Object.keys(obj).map(function(key){ return obj[key] })
}


/***/ }),
/* 25 */
/***/ (function(module, exports) {

module.exports = require("rustbn.js");

/***/ }),
/* 26 */
/***/ (function(module, exports) {

module.exports = require("ethereumjs-block");

/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = once;
function once(fn) {
    return function () {
        if (fn === null) return;
        var callFn = fn;
        fn = null;
        callFn.apply(this, arguments);
    };
}
module.exports = exports["default"];

/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

var Symbol = __webpack_require__(52),
    getRawTag = __webpack_require__(131),
    objectToString = __webpack_require__(132);

/** `Object#toString` result references. */
var nullTag = '[object Null]',
    undefinedTag = '[object Undefined]';

/** Built-in value references. */
var symToStringTag = Symbol ? Symbol.toStringTag : undefined;

/**
 * The base implementation of `getTag` without fallbacks for buggy environments.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function baseGetTag(value) {
  if (value == null) {
    return value === undefined ? undefinedTag : nullTag;
  }
  return (symToStringTag && symToStringTag in Object(value))
    ? getRawTag(value)
    : objectToString(value);
}

module.exports = baseGetTag;


/***/ }),
/* 29 */
/***/ (function(module, exports) {

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return value != null && typeof value == 'object';
}

module.exports = isObjectLike;


/***/ }),
/* 30 */
/***/ (function(module, exports) {

module.exports = require("json-rpc-error");

/***/ }),
/* 31 */
/***/ (function(module, exports) {

module.exports = require("yargs");

/***/ }),
/* 32 */
/***/ (function(module, exports) {

module.exports = require("ioredis");

/***/ }),
/* 33 */
/***/ (function(module, exports) {

module.exports = require("bignumber.js");

/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

const CheckpointTrie = __webpack_require__(82)
const secureInterface = __webpack_require__(88)
const inherits = __webpack_require__(1).inherits

module.exports = SecureTrie
inherits(SecureTrie, CheckpointTrie)

/**
 * You can create a secure Trie where the keys are automatically hashed using **SHA3** by using `require('merkle-patricia-tree/secure')`. It has the same methods and constuctor as `Trie`
 * @class SecureTrie
 * @extends Trie
 */
function SecureTrie () {
  CheckpointTrie.apply(this, arguments)
  secureInterface(this)
}


/***/ }),
/* 35 */
/***/ (function(module, exports) {

module.exports = require("levelup");

/***/ }),
/* 36 */
/***/ (function(module, exports) {

module.exports = require("memdown");

/***/ }),
/* 37 */
/***/ (function(module, exports) {

module.exports = require("rlp");

/***/ }),
/* 38 */
/***/ (function(module, exports) {

module.exports = require("semaphore");

/***/ }),
/* 39 */
/***/ (function(module, exports) {

module.exports = require("readable-stream");

/***/ }),
/* 40 */
/***/ (function(module, exports) {

module.exports = require("web3-provider-engine");

/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

const inherits = __webpack_require__(1).inherits
const ethUtil = __webpack_require__(0)
const BN = ethUtil.BN
const clone = __webpack_require__(91)
const cacheUtils = __webpack_require__(22)
const Stoplight = __webpack_require__(23)
const Subprovider = __webpack_require__(3)

module.exports = BlockCacheProvider

inherits(BlockCacheProvider, Subprovider)

function BlockCacheProvider(opts) {
  const self = this
  opts = opts || {}
  // set initialization blocker
  self._ready = new Stoplight()
  self.strategies = {
    perma: new ConditionalPermaCacheStrategy({
      eth_getTransactionByHash: containsBlockhash,
      eth_getTransactionReceipt: containsBlockhash,
    }),
    block: new BlockCacheStrategy(self),
    fork: new BlockCacheStrategy(self),
  }
}

// setup a block listener on 'setEngine'
BlockCacheProvider.prototype.setEngine = function(engine) {
  const self = this
  self.engine = engine
  // unblock initialization after first block
  engine.once('block', function(block) {
    self.currentBlock = block
    self._ready.go()
    // from now on, empty old cache every block
    engine.on('block', clearOldCache)
  })

  function clearOldCache(newBlock) {
    var previousBlock = self.currentBlock
    self.currentBlock = newBlock
    if (!previousBlock) return
    self.strategies.block.cacheRollOff(previousBlock)
    self.strategies.fork.cacheRollOff(previousBlock)
  }
}

BlockCacheProvider.prototype.handleRequest = function(payload, next, end){
  const self = this

  // skip cache if told to do so
  if (payload.skipCache) {
    // console.log('CACHE SKIP - skip cache if told to do so')
    return next()
  }

  // Ignore block polling requests.
  if (payload.method === 'eth_getBlockByNumber' && payload.params[0] === 'latest') {
    // console.log('CACHE SKIP - Ignore block polling requests.')
    return next()
  }

  // wait for first block
  self._ready.await(function(){
    // actually handle the request
    self._handleRequest(payload, next, end)
  })
}

BlockCacheProvider.prototype._handleRequest = function(payload, next, end){
  const self = this

  var type = cacheUtils.cacheTypeForPayload(payload)
  var strategy = this.strategies[type]

  // If there's no strategy in place, pass it down the chain.
  if (!strategy) {
    return next()
  }

  // If the strategy can't cache this request, ignore it.
  if (!strategy.canCache(payload)) {
    return next()
  }

  var blockTag = cacheUtils.blockTagForPayload(payload)
  if (!blockTag) blockTag = 'latest'
  var requestedBlockNumber

  if (blockTag === 'earliest') {
    requestedBlockNumber = '0x00'
  } else if (blockTag === 'latest') {
    requestedBlockNumber = ethUtil.bufferToHex(self.currentBlock.number)
  } else {
    // We have a hex number
    requestedBlockNumber = blockTag
  }

  //console.log('REQUEST at block 0x' + requestedBlockNumber.toString('hex'))

  // end on a hit, continue on a miss
  strategy.hitCheck(payload, requestedBlockNumber, end, function() {
    // miss fallthrough to provider chain, caching the result on the way back up.
    next(function(err, result, cb) {
      // err is already handled by engine
      if (err) return cb()
      strategy.cacheResult(payload, result, requestedBlockNumber, cb)
    })
  })
}

//
// Cache Strategies
//

function PermaCacheStrategy() {
  var self = this
  self.cache = {}
  // clear cache every ten minutes
  var timeout = setInterval(function(){
    self.cache = {}
  }, 10 * 60 * 1e3)
  // do not require the Node.js event loop to remain active
  if (timeout.unref) timeout.unref()
}

PermaCacheStrategy.prototype.hitCheck = function(payload, requestedBlockNumber, hit, miss) {
  var identifier = cacheUtils.cacheIdentifierForPayload(payload)
  var cached = this.cache[identifier]

  if (!cached) return miss()

  // If the block number we're requesting at is greater than or
  // equal to the block where we cached a previous response,
  // the cache is valid. If it's from earlier than the cache,
  // send it back down to the client (where it will be recached.)
  var cacheIsEarlyEnough = compareHex(requestedBlockNumber, cached.blockNumber) >= 0
  if (cacheIsEarlyEnough) {
    var clonedValue = clone(cached.result)
    return hit(null, clonedValue)
  } else {
    return miss()
  }
}

PermaCacheStrategy.prototype.cacheResult = function(payload, result, requestedBlockNumber, callback) {
  var identifier = cacheUtils.cacheIdentifierForPayload(payload)

  if (result) {
    var clonedValue = clone(result)
    this.cache[identifier] = {
      blockNumber: requestedBlockNumber,
      result: clonedValue,
    }
  }

  callback()
}

PermaCacheStrategy.prototype.canCache = function(payload) {
  return cacheUtils.canCache(payload)
}

//
// ConditionalPermaCacheStrategy
//

function ConditionalPermaCacheStrategy(conditionals) {
  this.strategy = new PermaCacheStrategy()
  this.conditionals = conditionals
}

ConditionalPermaCacheStrategy.prototype.hitCheck = function(payload, requestedBlockNumber, hit, miss) {
  return this.strategy.hitCheck(payload, requestedBlockNumber, hit, miss)
}

ConditionalPermaCacheStrategy.prototype.cacheResult = function(payload, result, requestedBlockNumber, callback) {
  var conditional = this.conditionals[payload.method]

  if (conditional) {
    if (conditional(result)) {
      this.strategy.cacheResult(payload, result, requestedBlockNumber, callback)
    } else {
      callback()
    }
  } else {
    // Cache all requests that don't have a conditional
    this.strategy.cacheResult(payload, result, requestedBlockNumber, callback)
  }
}

ConditionalPermaCacheStrategy.prototype.canCache = function(payload) {
  return this.strategy.canCache(payload)
}

//
// BlockCacheStrategy
//

function BlockCacheStrategy() {
  this.cache = {}
}

BlockCacheStrategy.prototype.getBlockCacheForPayload = function(payload, blockNumber) {
  var blockTag = cacheUtils.blockTagForPayload(payload)
  var blockCache = this.cache[blockNumber]
  // create new cache if necesary
  if (!blockCache) blockCache = this.cache[blockNumber] = {}

  return blockCache
}

BlockCacheStrategy.prototype.hitCheck = function(payload, requestedBlockNumber, hit, miss) {
  var blockCache = this.getBlockCacheForPayload(payload, requestedBlockNumber)

  if (!blockCache) {
    return miss()
  }

  var identifier = cacheUtils.cacheIdentifierForPayload(payload)
  var cached = blockCache[identifier]

  if (cached) {
    return hit(null, cached)
  } else {
    return miss()
  }
}

BlockCacheStrategy.prototype.cacheResult = function(payload, result, requestedBlockNumber, callback) {
  if (result) {
    var blockCache = this.getBlockCacheForPayload(payload, requestedBlockNumber)
    var identifier = cacheUtils.cacheIdentifierForPayload(payload)
    blockCache[identifier] = result
  }
  callback()
}

BlockCacheStrategy.prototype.canCache = function(payload) {
  if (!cacheUtils.canCache(payload)) {
    return false
  }

  var blockTag = cacheUtils.blockTagForPayload(payload)

  return (blockTag !== 'pending')
}

// naively removes older block caches
BlockCacheStrategy.prototype.cacheRollOff = function(previousBlock){
  const self = this
  var previousHex = ethUtil.bufferToHex(previousBlock.number)
  delete self.cache[previousHex]
}


// util

function compareHex(hexA, hexB){
  var numA = parseInt(hexA, 16)
  var numB = parseInt(hexB, 16)
  return numA === numB ? 0 : (numA > numB ? 1 : -1 )
}

function hexToBN(hex){
  return new BN(ethUtil.toBuffer(hex))
}

function containsBlockhash(result) {
  if (!result) return false
  if (!result.blockHash) return false
  const hasNonZeroHash = hexToBN(result.blockHash).gt(new BN(0))
  return hasNonZeroHash
}

/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

const inherits = __webpack_require__(1).inherits
const Subprovider = __webpack_require__(3)

module.exports = FixtureProvider

inherits(FixtureProvider, Subprovider)

function FixtureProvider(staticResponses){
  const self = this
  staticResponses = staticResponses || {}
  self.staticResponses = staticResponses
}

FixtureProvider.prototype.handleRequest = function(payload, next, end){
  const self = this
  var staticResponse = self.staticResponses[payload.method]
  // async function
  if ('function' === typeof staticResponse) {
    staticResponse(payload, next, end)
  // static response - null is valid response
  } else if (staticResponse !== undefined) {
    // return result asynchronously
    setTimeout(() => end(null, staticResponse))
  // no prepared response - skip
  } else {
    next()
  }
}


/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

const doWhilst = __webpack_require__(94)
const inherits = __webpack_require__(1).inherits
const Stoplight = __webpack_require__(23)
const createVm = __webpack_require__(97).fromWeb3Provider
const Block = __webpack_require__(26)
const FakeTransaction = __webpack_require__(124)
const ethUtil = __webpack_require__(0)
const createPayload = __webpack_require__(8)
const rpcHexEncoding = __webpack_require__(48)
const Subprovider = __webpack_require__(3)

module.exports = VmSubprovider

// handles the following RPC methods:
//   eth_call
//   eth_estimateGas


inherits(VmSubprovider, Subprovider)

function VmSubprovider(opts){
  const self = this
  self.opts = opts || {};
  self.methods = ['eth_call', 'eth_estimateGas']
  // set initialization blocker
  self._ready = new Stoplight()
  self._blockGasLimit = null
}

// setup a block listener on 'setEngine'
VmSubprovider.prototype.setEngine = function(engine) {
  const self = this
  Subprovider.prototype.setEngine.call(self, engine)
  // unblock initialization after first block
  engine.once('block', function(block) {
    self._blockGasLimit = ethUtil.bufferToInt(block.gasLimit)
    self._ready.go()
  })
}

VmSubprovider.prototype.handleRequest = function(payload, next, end) {
  if (this.methods.indexOf(payload.method) < 0) {
    return next()
  }

  const self = this
  switch (payload.method) {

    case 'eth_call':
      self.runVm(payload, function(err, results){
        if (err) return end(err)
        var result = '0x'
        if (!results.error && results.vm.return) {
          result = ethUtil.addHexPrefix(results.vm.return.toString('hex'))
        }
        end(null, result)
      })
      return

    case 'eth_estimateGas':
      self.estimateGas(payload, end)
      return
  }
}

VmSubprovider.prototype.estimateGas = function(payload, end) {
    const self = this
    var lo = 0
    var hi = self._blockGasLimit

    var minDiffBetweenIterations = 1200
    var prevGasLimit = self._blockGasLimit
    doWhilst(
      function(callback) {
        // Take a guess at the gas, and check transaction validity
        var mid = (hi + lo) / 2
        payload.params[0].gas = mid
        self.runVm(payload, function(err, results) {
            gasUsed = err ? self._blockGasLimit : ethUtil.bufferToInt(results.gasUsed)
            if (err || gasUsed === 0) {
                lo = mid
            } else {
                hi = mid
                // Perf improvement: stop the binary search when the difference in gas between two iterations
                // is less then `minDiffBetweenIterations`. Doing this cuts the number of iterations from 23
                // to 12, with only a ~1000 gas loss in precision.
                if (Math.abs(prevGasLimit - mid) < minDiffBetweenIterations) {
                    lo = hi
                }
            }
            prevGasLimit = mid
            callback()
        })
      },
      function() { return lo+1 < hi },
      function(err) {
          if (err) {
              end(err)
          } else {
              hi = Math.floor(hi)
              var gasEstimateHex = rpcHexEncoding.intToQuantityHex(hi)
              end(null, gasEstimateHex)
          }
      }
    )
}

VmSubprovider.prototype.runVm = function(payload, cb){
  const self = this

  var blockData = self.currentBlock
  var block = blockFromBlockData(blockData)
  var blockNumber = ethUtil.addHexPrefix(blockData.number.toString('hex'))

  // create vm with state lookup intercepted
  var vm = self.vm = createVm(self.engine, blockNumber, {
    enableHomestead: true
  })

  if (self.opts.debug) {
    vm.on('step', function (data) {
      console.log(data.opcode.name)
    })
  }

  // create tx
  var txParams = payload.params[0]
  // console.log('params:', payload.params)

  const normalizedTxParams = {
    to: txParams.to ? ethUtil.addHexPrefix(txParams.to) : undefined,
    from: txParams.from ? ethUtil.addHexPrefix(txParams.from) : undefined,
    value: txParams.value ? ethUtil.addHexPrefix(txParams.value) : undefined,
    data: txParams.data ? ethUtil.addHexPrefix(txParams.data) : undefined,
    gasLimit: txParams.gas ? ethUtil.addHexPrefix(txParams.gas) : block.header.gasLimit,
    gasPrice: txParams.gasPrice ? ethUtil.addHexPrefix(txParams.gasPrice) : undefined,
    nonce: txParams.nonce ? ethUtil.addHexPrefix(txParams.nonce) : undefined,
  }
  var tx = new FakeTransaction(normalizedTxParams)
  tx._from = normalizedTxParams.from || '0x0000000000000000000000000000000000000000'

  vm.runTx({
    tx: tx,
    block: block,
    skipNonce: true,
    skipBalance: true
  }, function(err, results) {
    if (err) return cb(err)
    if (results.error != null) {
      return cb(new Error("VM error: " + results.error))
    }
    if (results.vm && results.vm.exception !== 1) {
      return cb(new Error("VM Exception while executing " + payload.method + ": " + results.vm.exceptionError))
    }

    cb(null, results)
  })

}

function blockFromBlockData(blockData){
  var block = new Block()
  // block.header.hash = ethUtil.addHexPrefix(blockData.hash.toString('hex'))

  block.header.parentHash = blockData.parentHash
  block.header.uncleHash = blockData.sha3Uncles
  block.header.coinbase = blockData.miner
  block.header.stateRoot = blockData.stateRoot
  block.header.transactionTrie = blockData.transactionsRoot
  block.header.receiptTrie = blockData.receiptRoot || blockData.receiptsRoot
  block.header.bloom = blockData.logsBloom
  block.header.difficulty = blockData.difficulty
  block.header.number = blockData.number
  block.header.gasLimit = blockData.gasLimit
  block.header.gasUsed = blockData.gasUsed
  block.header.timestamp = blockData.timestamp
  block.header.extraData = blockData.extraData
  return block
}


/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = asyncify;

var _isObject = __webpack_require__(45);

var _isObject2 = _interopRequireDefault(_isObject);

var _initialParams = __webpack_require__(95);

var _initialParams2 = _interopRequireDefault(_initialParams);

var _setImmediate = __webpack_require__(96);

var _setImmediate2 = _interopRequireDefault(_setImmediate);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Take a sync function and make it async, passing its return value to a
 * callback. This is useful for plugging sync functions into a waterfall,
 * series, or other async functions. Any arguments passed to the generated
 * function will be passed to the wrapped function (except for the final
 * callback argument). Errors thrown will be passed to the callback.
 *
 * If the function passed to `asyncify` returns a Promise, that promises's
 * resolved/rejected state will be used to call the callback, rather than simply
 * the synchronous return value.
 *
 * This also means you can asyncify ES2017 `async` functions.
 *
 * @name asyncify
 * @static
 * @memberOf module:Utils
 * @method
 * @alias wrapSync
 * @category Util
 * @param {Function} func - The synchronous function, or Promise-returning
 * function to convert to an {@link AsyncFunction}.
 * @returns {AsyncFunction} An asynchronous wrapper of the `func`. To be
 * invoked with `(args..., callback)`.
 * @example
 *
 * // passing a regular synchronous function
 * async.waterfall([
 *     async.apply(fs.readFile, filename, "utf8"),
 *     async.asyncify(JSON.parse),
 *     function (data, next) {
 *         // data is the result of parsing the text.
 *         // If there was a parsing error, it would have been caught.
 *     }
 * ], callback);
 *
 * // passing a function returning a promise
 * async.waterfall([
 *     async.apply(fs.readFile, filename, "utf8"),
 *     async.asyncify(function (contents) {
 *         return db.model.create(contents);
 *     }),
 *     function (model, next) {
 *         // `model` is the instantiated model object.
 *         // If there was an error, this function would be skipped.
 *     }
 * ], callback);
 *
 * // es2017 example, though `asyncify` is not needed if your JS environment
 * // supports async functions out of the box
 * var q = async.queue(async.asyncify(async function(file) {
 *     var intermediateStep = await processFile(file);
 *     return await somePromise(intermediateStep)
 * }));
 *
 * q.push(files);
 */
function asyncify(func) {
    return (0, _initialParams2.default)(function (args, callback) {
        var result;
        try {
            result = func.apply(this, args);
        } catch (e) {
            return callback(e);
        }
        // if result is Promise object
        if ((0, _isObject2.default)(result) && typeof result.then === 'function') {
            result.then(function (value) {
                invokeCallback(callback, null, value);
            }, function (err) {
                invokeCallback(callback, err.message ? err : new Error(err));
            });
        } else {
            callback(null, result);
        }
    });
}

function invokeCallback(callback, error, value) {
    try {
        callback(error, value);
    } catch (e) {
        (0, _setImmediate2.default)(rethrow, e);
    }
}

function rethrow(error) {
    throw error;
}
module.exports = exports['default'];

/***/ }),
/* 45 */
/***/ (function(module, exports) {

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return value != null && (type == 'object' || type == 'function');
}

module.exports = isObject;


/***/ }),
/* 46 */
/***/ (function(module, exports) {

module.exports = require("merkle-patricia-tree");

/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Buffer = __webpack_require__(5).Buffer;
var assert = __webpack_require__(7);
var utils = __webpack_require__(0);
var byteSize = 256;

/**
 * Represents a Bloom
 * @constructor
 * @param {Buffer} bitvector
 */
var Bloom = module.exports = function (bitvector) {
  if (!bitvector) {
    this.bitvector = utils.zeros(byteSize);
  } else {
    assert(bitvector.length === byteSize, 'bitvectors must be 2048 bits long');
    this.bitvector = bitvector;
  }
};

/**
 * adds an element to a bit vector of a 64 byte bloom filter
 * @method add
 * @param {Buffer} element
 */
Bloom.prototype.add = function (e) {
  e = utils.sha3(e);
  var mask = 2047; // binary 11111111111

  for (var i = 0; i < 3; i++) {
    var first2bytes = e.readUInt16BE(i * 2);
    var loc = mask & first2bytes;
    var byteLoc = loc >> 3;
    var bitLoc = 1 << loc % 8;
    this.bitvector[byteSize - byteLoc - 1] |= bitLoc;
  }
};

/**
 * checks if an element is in the blooom
 * @method check
 * @param {Buffer} element
 */
Bloom.prototype.check = function (e) {
  e = utils.sha3(e);
  var mask = 511; // binary 111111111
  var match = true;

  for (var i = 0; i < 3 && match; i++) {
    var first2bytes = e.readUInt16BE(i * 2);
    var loc = mask & first2bytes;
    var byteLoc = loc >> 3;
    var bitLoc = 1 << loc % 8;
    match = this.bitvector[byteSize - byteLoc - 1] & bitLoc;
  }

  return Boolean(match);
};

/**
 * checks if multple topics are in a bloom
 * @method check
 * @param {Buffer} element
 */
Bloom.prototype.multiCheck = function (topics) {
  var self = this;
  return topics.every(function (t) {
    if (!Buffer.isBuffer(t)) {
      t = Buffer.from(t, 'hex');
    }
    return self.check(t);
  });
};

/**
 * bitwise or blooms together
 * @method or
 * @param {Bloom} bloom
 */
Bloom.prototype.or = function (bloom) {
  if (bloom) {
    for (var i = 0; i <= byteSize; i++) {
      this.bitvector[i] = this.bitvector[i] | bloom.bitvector[i];
    }
  }
};

/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

const ethUtil = __webpack_require__(0)
const assert = __webpack_require__(127)

module.exports = {
  intToQuantityHex: intToQuantityHex,
  quantityHexToInt: quantityHexToInt,
}

/*
 * As per https://github.com/ethereum/wiki/wiki/JSON-RPC#hex-value-encoding
 * Quanities should be represented by the most compact hex representation possible
 * This means that no leading zeroes are allowed. There helpers make it easy
 * to convert to and from integers and their compact hex representation
 */

function intToQuantityHex(n){
    assert(typeof n === 'number' && n === Math.floor(n), 'intToQuantityHex arg must be an integer')
    var nHex = ethUtil.toBuffer(n).toString('hex')
    if (nHex[0] === '0') {
        nHex = nHex.substring(1)
    }
    return ethUtil.addHexPrefix(nHex)
}

function quantityHexToInt(prefixedQuantityHex) {
    assert(typeof prefixedQuantityHex === 'string', 'arg to quantityHexToInt must be a string')
    var quantityHex = ethUtil.stripHexPrefix(prefixedQuantityHex)
    var isEven = quantityHex.length % 2 === 0
    if (!isEven) {
        quantityHex = '0' + quantityHex
    }
    var buf = new Buffer(quantityHex, 'hex')
    return ethUtil.bufferToInt(buf)
}


/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

/*
 * Emulate 'eth_accounts' / 'eth_sendTransaction' using 'eth_sendRawTransaction'
 *
 * The two callbacks a user needs to implement are:
 * - getAccounts() -- array of addresses supported
 * - signTransaction(tx) -- sign a raw transaction object
 */

const waterfall = __webpack_require__(50)
const parallel = __webpack_require__(128)
const inherits = __webpack_require__(1).inherits
const ethUtil = __webpack_require__(0)
const sigUtil = __webpack_require__(155)
const extend = __webpack_require__(17)
const Semaphore = __webpack_require__(38)
const Subprovider = __webpack_require__(3)
const estimateGas = __webpack_require__(156)
const hexRegex = /^[0-9A-Fa-f]+$/g

module.exports = HookedWalletSubprovider

// handles the following RPC methods:
//   eth_coinbase
//   eth_accounts
//   eth_sendTransaction
//   eth_sign
//   eth_signTypedData
//   personal_sign
//   personal_ecRecover
//   parity_postTransaction
//   parity_checkRequest
//   parity_defaultAccount

//
// Tx Signature Flow
//
// handleRequest: eth_sendTransaction
//   validateTransaction (basic validity check)
//     validateSender (checks that sender is in accounts)
//   processTransaction (sign tx and submit to network)
//     approveTransaction (UI approval hook)
//     checkApproval
//     finalizeAndSubmitTx (tx signing)
//       nonceLock.take (bottle neck to ensure atomic nonce)
//         fillInTxExtras (set fallback gasPrice, nonce, etc)
//         signTransaction (perform the signature)
//         publishTransaction (publish signed tx to network)
//


inherits(HookedWalletSubprovider, Subprovider)

function HookedWalletSubprovider(opts){
  const self = this
  // control flow
  self.nonceLock = Semaphore(1)

  // data lookup
  if (opts.getAccounts) self.getAccounts = opts.getAccounts
  // high level override
  if (opts.processTransaction) self.processTransaction = opts.processTransaction
  if (opts.processMessage) self.processMessage = opts.processMessage
  if (opts.processPersonalMessage) self.processPersonalMessage = opts.processPersonalMessage
  if (opts.processTypedMessage) self.processTypedMessage = opts.processTypedMessage
  // approval hooks
  self.approveTransaction = opts.approveTransaction || self.autoApprove
  self.approveMessage = opts.approveMessage || self.autoApprove
  self.approvePersonalMessage = opts.approvePersonalMessage || self.autoApprove
  self.approveTypedMessage = opts.approveTypedMessage || self.autoApprove
  // actually perform the signature
  if (opts.signTransaction) self.signTransaction = opts.signTransaction  || mustProvideInConstructor('signTransaction')
  if (opts.signMessage) self.signMessage = opts.signMessage  || mustProvideInConstructor('signMessage')
  if (opts.signPersonalMessage) self.signPersonalMessage = opts.signPersonalMessage  || mustProvideInConstructor('signPersonalMessage')
  if (opts.signTypedMessage) self.signTypedMessage = opts.signTypedMessage  || mustProvideInConstructor('signTypedMessage')
  if (opts.recoverPersonalSignature) self.recoverPersonalSignature = opts.recoverPersonalSignature
  // publish to network
  if (opts.publishTransaction) self.publishTransaction = opts.publishTransaction
}

HookedWalletSubprovider.prototype.handleRequest = function(payload, next, end){
  const self = this
  self._parityRequests = {}
  self._parityRequestCount = 0

  // switch statement is not block scoped
  // sp we cant repeat var declarations
  let txParams, msgParams, extraParams
  let message, address

  switch(payload.method) {

    case 'eth_coinbase':
      // process normally
      self.getAccounts(function(err, accounts){
        if (err) return end(err)
        let result = accounts[0] || null
        end(null, result)
      })
      return

    case 'eth_accounts':
      // process normally
      self.getAccounts(function(err, accounts){
        if (err) return end(err)
        end(null, accounts)
      })
      return

    case 'eth_sendTransaction':
      txParams = payload.params[0]
      waterfall([
        (cb) => self.validateTransaction(txParams, cb),
        (cb) => self.processTransaction(txParams, cb),
      ], end)
      return

    case 'eth_signTransaction':
      txParams = payload.params[0]
      waterfall([
        (cb) => self.validateTransaction(txParams, cb),
        (cb) => self.processSignTransaction(txParams, cb),
      ], end)
      return

    case 'eth_sign':
      // process normally
      address = payload.params[0]
      message = payload.params[1]
      // non-standard "extraParams" to be appended to our "msgParams" obj
      // good place for metadata
      extraParams = payload.params[2] || {}
      msgParams = extend(extraParams, {
        from: address,
        data: message,
      })
      waterfall([
        (cb) => self.validateMessage(msgParams, cb),
        (cb) => self.processMessage(msgParams, cb),
      ], end)
      return

    case 'personal_sign':
      // process normally
      const first = payload.params[0]
      const second = payload.params[1]

      // We initially incorrectly ordered these parameters.
      // To gracefully respect users who adopted this API early,
      // we are currently gracefully recovering from the wrong param order
      // when it is clearly identifiable.
      //
      // That means when the first param is definitely an address,
      // and the second param is definitely not, but is hex.
      if (resemblesData(second) && resemblesAddress(first)) {
        let warning = `The eth_personalSign method requires params ordered `
        warning += `[message, address]. This was previously handled incorrectly, `
        warning += `and has been corrected automatically. `
        warning += `Please switch this param order for smooth behavior in the future.`
        console.warn(warning)

        address = payload.params[0]
        message = payload.params[1]
      } else {
        message = payload.params[0]
        address = payload.params[1]
      }

      // non-standard "extraParams" to be appended to our "msgParams" obj
      // good place for metadata
      extraParams = payload.params[2] || {}
      msgParams = extend(extraParams, {
        from: address,
        data: message,
      })
      waterfall([
        (cb) => self.validatePersonalMessage(msgParams, cb),
        (cb) => self.processPersonalMessage(msgParams, cb),
      ], end)
      return

    case 'personal_ecRecover':
      message = payload.params[0]
      let signature = payload.params[1]
      // non-standard "extraParams" to be appended to our "msgParams" obj
      // good place for metadata
      extraParams = payload.params[2] || {}
      msgParams = extend(extraParams, {
        sig: signature,
        data: message,
      })
      self.recoverPersonalSignature(msgParams, end)
      return

    case 'eth_signTypedData':
      // process normally
      message = payload.params[0]
      address = payload.params[1]
      extraParams = payload.params[2] || {}
      msgParams = extend(extraParams, {
        from: address,
        data: message,
      })
      waterfall([
        (cb) => self.validateTypedMessage(msgParams, cb),
        (cb) => self.processTypedMessage(msgParams, cb),
      ], end)
      return

    case 'parity_postTransaction':
      txParams = payload.params[0]
      self.parityPostTransaction(txParams, end)
      return

    case 'parity_postSign':
      address = payload.params[0]
      message = payload.params[1]
      self.parityPostSign(address, message, end)
      return

    case 'parity_checkRequest':
      const requestId = payload.params[0]
      self.parityCheckRequest(requestId, end)
      return

    case 'parity_defaultAccount':
      self.getAccounts(function(err, accounts){
        if (err) return end(err)
        const account = accounts[0] || null
        end(null, account)
      })
      return

    default:
      next()
      return

  }
}

//
// data lookup
//

HookedWalletSubprovider.prototype.getAccounts = function(cb) {
  cb(null, [])
}


//
// "process" high level flow
//

HookedWalletSubprovider.prototype.processTransaction = function(txParams, cb) {
  const self = this
  waterfall([
    (cb) => self.approveTransaction(txParams, cb),
    (didApprove, cb) => self.checkApproval('transaction', didApprove, cb),
    (cb) => self.finalizeAndSubmitTx(txParams, cb),
  ], cb)
}


HookedWalletSubprovider.prototype.processSignTransaction = function(txParams, cb) {
  const self = this
  waterfall([
    (cb) => self.approveTransaction(txParams, cb),
    (didApprove, cb) => self.checkApproval('transaction', didApprove, cb),
    (cb) => self.finalizeTx(txParams, cb),
  ], cb)
}

HookedWalletSubprovider.prototype.processMessage = function(msgParams, cb) {
  const self = this
  waterfall([
    (cb) => self.approveMessage(msgParams, cb),
    (didApprove, cb) => self.checkApproval('message', didApprove, cb),
    (cb) => self.signMessage(msgParams, cb),
  ], cb)
}

HookedWalletSubprovider.prototype.processPersonalMessage = function(msgParams, cb) {
  const self = this
  waterfall([
    (cb) => self.approvePersonalMessage(msgParams, cb),
    (didApprove, cb) => self.checkApproval('message', didApprove, cb),
    (cb) => self.signPersonalMessage(msgParams, cb),
  ], cb)
}

HookedWalletSubprovider.prototype.processTypedMessage = function(msgParams, cb) {
  const self = this
  waterfall([
    (cb) => self.approveTypedMessage(msgParams, cb),
    (didApprove, cb) => self.checkApproval('message', didApprove, cb),
    (cb) => self.signTypedMessage(msgParams, cb),
  ], cb)
}

//
// approval
//

HookedWalletSubprovider.prototype.autoApprove = function(txParams, cb) {
  cb(null, true)
}

HookedWalletSubprovider.prototype.checkApproval = function(type, didApprove, cb) {
  cb( didApprove ? null : new Error('User denied '+type+' signature.') )
}

//
// parity
//

HookedWalletSubprovider.prototype.parityPostTransaction = function(txParams, cb) {
  const self = this

  // get next id
  const count = self._parityRequestCount
  const reqId = `0x${count.toString(16)}`
  self._parityRequestCount++

  self.emitPayload({
    method: 'eth_sendTransaction',
    params: [txParams],
  }, function(error, res){
    if (error) {
      self._parityRequests[reqId] = { error }
      return
    }
    const txHash = res.result
    self._parityRequests[reqId] = txHash
  })

  cb(null, reqId)
}


HookedWalletSubprovider.prototype.parityPostSign = function(address, message, cb) {
  const self = this

  // get next id
  const count = self._parityRequestCount
  const reqId = `0x${count.toString(16)}`
  self._parityRequestCount++

  self.emitPayload({
    method: 'eth_sign',
    params: [address, message],
  }, function(error, res){
    if (error) {
      self._parityRequests[reqId] = { error }
      return
    }
    const result = res.result
    self._parityRequests[reqId] = result
  })

  cb(null, reqId)
}

HookedWalletSubprovider.prototype.parityCheckRequest = function(reqId, cb) {
  const self = this
  const result = self._parityRequests[reqId] || null
  // tx not handled yet
  if (!result) return cb(null, null)
  // tx was rejected (or other error)
  if (result.error) return cb(result.error)
  // tx sent
  cb(null, result)
}

//
// signature and recovery
//

HookedWalletSubprovider.prototype.recoverPersonalSignature = function(msgParams, cb) {
  let senderHex
  try {
    senderHex = sigUtil.recoverPersonalSignature(msgParams)
  } catch (err) {
    return cb(err)
  }
  cb(null, senderHex)
}

//
// validation
//

HookedWalletSubprovider.prototype.validateTransaction = function(txParams, cb){
  const self = this
  // shortcut: undefined sender is invalid
  if (txParams.from === undefined) return cb(new Error(`Undefined address - from address required to sign transaction.`))
  self.validateSender(txParams.from, function(err, senderIsValid){
    if (err) return cb(err)
    if (!senderIsValid) return cb(new Error(`Unknown address - unable to sign transaction for this address: "${txParams.from}"`))
    cb()
  })
}

HookedWalletSubprovider.prototype.validateMessage = function(msgParams, cb){
  const self = this
  if (msgParams.from === undefined) return cb(new Error(`Undefined address - from address required to sign message.`))
  self.validateSender(msgParams.from, function(err, senderIsValid){
    if (err) return cb(err)
    if (!senderIsValid) return cb(new Error(`Unknown address - unable to sign message for this address: "${msgParams.from}"`))
    cb()
  })
}

HookedWalletSubprovider.prototype.validatePersonalMessage = function(msgParams, cb){
  const self = this
  if (msgParams.from === undefined) return cb(new Error(`Undefined address - from address required to sign personal message.`))
  if (msgParams.data === undefined) return cb(new Error(`Undefined message - message required to sign personal message.`))
  if (!isValidHex(msgParams.data)) return cb(new Error(`HookedWalletSubprovider - validateMessage - message was not encoded as hex.`))
  self.validateSender(msgParams.from, function(err, senderIsValid){
    if (err) return cb(err)
    if (!senderIsValid) return cb(new Error(`Unknown address - unable to sign message for this address: "${msgParams.from}"`))
    cb()
  })
}

HookedWalletSubprovider.prototype.validateTypedMessage = function(msgParams, cb){
  if (msgParams.from === undefined) return cb(new Error(`Undefined address - from address required to sign typed data.`))
  if (msgParams.data === undefined) return cb(new Error(`Undefined data - message required to sign typed data.`))
  this.validateSender(msgParams.from, function(err, senderIsValid){
    if (err) return cb(err)
    if (!senderIsValid) return cb(new Error(`Unknown address - unable to sign message for this address: "${msgParams.from}"`))
    cb()
  })
}

HookedWalletSubprovider.prototype.validateSender = function(senderAddress, cb){
  const self = this
  // shortcut: undefined sender is invalid
  if (!senderAddress) return cb(null, false)
  self.getAccounts(function(err, accounts){
    if (err) return cb(err)
    const senderIsValid = (accounts.map(toLowerCase).indexOf(senderAddress.toLowerCase()) !== -1)
    cb(null, senderIsValid)
  })
}

//
// tx helpers
//

HookedWalletSubprovider.prototype.finalizeAndSubmitTx = function(txParams, cb) {
  const self = this
  // can only allow one tx to pass through this flow at a time
  // so we can atomically consume a nonce
  self.nonceLock.take(function(){
    waterfall([
      self.fillInTxExtras.bind(self, txParams),
      self.signTransaction.bind(self),
      self.publishTransaction.bind(self),
    ], function(err, txHash){
      self.nonceLock.leave()
      if (err) return cb(err)
      cb(null, txHash)
    })
  })
}

HookedWalletSubprovider.prototype.finalizeTx = function(txParams, cb) {
  const self = this
  // can only allow one tx to pass through this flow at a time
  // so we can atomically consume a nonce
  self.nonceLock.take(function(){
    waterfall([
      self.fillInTxExtras.bind(self, txParams),
      self.signTransaction.bind(self),
    ], function(err, signedTx){
      self.nonceLock.leave()
      if (err) return cb(err)
      cb(null, {raw: signedTx, tx: txParams})
    })
  })
}

HookedWalletSubprovider.prototype.publishTransaction = function(rawTx, cb) {
  const self = this
  self.emitPayload({
    method: 'eth_sendRawTransaction',
    params: [rawTx],
  }, function(err, res){
    if (err) return cb(err)
    cb(null, res.result)
  })
}

HookedWalletSubprovider.prototype.fillInTxExtras = function(txParams, cb){
  const self = this
  const address = txParams.from
  // console.log('fillInTxExtras - address:', address)

  const reqs = {}

  if (txParams.gasPrice === undefined) {
    // console.log("need to get gasprice")
    reqs.gasPrice = self.emitPayload.bind(self, { method: 'eth_gasPrice', params: [] })
  }

  if (txParams.nonce === undefined) {
    // console.log("need to get nonce")
    reqs.nonce = self.emitPayload.bind(self, { method: 'eth_getTransactionCount', params: [address, 'pending'] })
  }

  if (txParams.gas === undefined) {
    // console.log("need to get gas")
    reqs.gas = estimateGas.bind(null, self.engine, cloneTxParams(txParams))
  }

  parallel(reqs, function(err, result) {
    if (err) return cb(err)
    // console.log('fillInTxExtras - result:', result)

    const res = {}
    if (result.gasPrice) res.gasPrice = result.gasPrice.result
    if (result.nonce) res.nonce = result.nonce.result
    if (result.gas) res.gas = result.gas

    cb(null, extend(txParams, res))
  })
}

// util

// we use this to clean any custom params from the txParams
function cloneTxParams(txParams){
  return {
    from: txParams.from,
    to: txParams.to,
    value: txParams.value,
    data: txParams.data,
    gas: txParams.gas,
    gasPrice: txParams.gasPrice,
    nonce: txParams.nonce,
  }
}

function toLowerCase(string){
  return string.toLowerCase()
}

function resemblesAddress (string) {
  const fixed = ethUtil.addHexPrefix(string)
  const isValid = ethUtil.isValidAddress(fixed)
  return isValid
}

// Returns true if resembles hex data
// but definitely not a valid address.
function resemblesData (string) {
  const fixed = ethUtil.addHexPrefix(string)
  const isValidAddress = ethUtil.isValidAddress(fixed)
  return !isValidAddress && isValidHex(string)
}

function isValidHex(data) {
  const isString = typeof data === 'string'
  if (!isString) return false
  const isHexPrefixed = data.slice(0,2) === '0x'
  if (!isHexPrefixed) return false
  const nonPrefixed = data.slice(2)
  const isValid = nonPrefixed.match(hexRegex)
  return isValid
}

function mustProvideInConstructor(methodName) {
  return function(params, cb) {
    cb(new Error('ProviderEngine - HookedWalletSubprovider - Must provide "' + methodName + '" fn in constructor options'))
  }
}


/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (tasks, callback) {
    callback = (0, _once2.default)(callback || _noop2.default);
    if (!(0, _isArray2.default)(tasks)) return callback(new Error('First argument to waterfall must be an array of functions'));
    if (!tasks.length) return callback();
    var taskIndex = 0;

    function nextTask(args) {
        var task = (0, _wrapAsync2.default)(tasks[taskIndex++]);
        args.push((0, _onlyOnce2.default)(next));
        task.apply(null, args);
    }

    function next(err /*, ...args*/) {
        if (err || taskIndex === tasks.length) {
            return callback.apply(null, arguments);
        }
        nextTask((0, _slice2.default)(arguments, 1));
    }

    nextTask([]);
};

var _isArray = __webpack_require__(51);

var _isArray2 = _interopRequireDefault(_isArray);

var _noop = __webpack_require__(12);

var _noop2 = _interopRequireDefault(_noop);

var _once = __webpack_require__(27);

var _once2 = _interopRequireDefault(_once);

var _slice = __webpack_require__(14);

var _slice2 = _interopRequireDefault(_slice);

var _onlyOnce = __webpack_require__(18);

var _onlyOnce2 = _interopRequireDefault(_onlyOnce);

var _wrapAsync = __webpack_require__(13);

var _wrapAsync2 = _interopRequireDefault(_wrapAsync);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = exports['default'];

/**
 * Runs the `tasks` array of functions in series, each passing their results to
 * the next in the array. However, if any of the `tasks` pass an error to their
 * own callback, the next function is not executed, and the main `callback` is
 * immediately called with the error.
 *
 * @name waterfall
 * @static
 * @memberOf module:ControlFlow
 * @method
 * @category Control Flow
 * @param {Array} tasks - An array of [async functions]{@link AsyncFunction}
 * to run.
 * Each function should complete with any number of `result` values.
 * The `result` values will be passed as arguments, in order, to the next task.
 * @param {Function} [callback] - An optional callback to run once all the
 * functions have completed. This will be passed the results of the last task's
 * callback. Invoked with (err, [results]).
 * @returns undefined
 * @example
 *
 * async.waterfall([
 *     function(callback) {
 *         callback(null, 'one', 'two');
 *     },
 *     function(arg1, arg2, callback) {
 *         // arg1 now equals 'one' and arg2 now equals 'two'
 *         callback(null, 'three');
 *     },
 *     function(arg1, callback) {
 *         // arg1 now equals 'three'
 *         callback(null, 'done');
 *     }
 * ], function (err, result) {
 *     // result now equals 'done'
 * });
 *
 * // Or, with named functions:
 * async.waterfall([
 *     myFirstFunction,
 *     mySecondFunction,
 *     myLastFunction,
 * ], function (err, result) {
 *     // result now equals 'done'
 * });
 * function myFirstFunction(callback) {
 *     callback(null, 'one', 'two');
 * }
 * function mySecondFunction(arg1, arg2, callback) {
 *     // arg1 now equals 'one' and arg2 now equals 'two'
 *     callback(null, 'three');
 * }
 * function myLastFunction(arg1, callback) {
 *     // arg1 now equals 'three'
 *     callback(null, 'done');
 * }
 */

/***/ }),
/* 51 */
/***/ (function(module, exports) {

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray = Array.isArray;

module.exports = isArray;


/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

var root = __webpack_require__(53);

/** Built-in value references. */
var Symbol = root.Symbol;

module.exports = Symbol;


/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

var freeGlobal = __webpack_require__(54);

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

module.exports = root;


/***/ }),
/* 54 */
/***/ (function(module, exports) {

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

module.exports = freeGlobal;


/***/ }),
/* 55 */
/***/ (function(module, exports) {

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This method is loosely based on
 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 * @example
 *
 * _.isLength(3);
 * // => true
 *
 * _.isLength(Number.MIN_VALUE);
 * // => false
 *
 * _.isLength(Infinity);
 * // => false
 *
 * _.isLength('3');
 * // => false
 */
function isLength(value) {
  return typeof value == 'number' &&
    value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

module.exports = isLength;


/***/ }),
/* 56 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
// A temporary value used to identify if the loop should be broken.
// See #1064, #1293
exports.default = {};
module.exports = exports["default"];

/***/ }),
/* 57 */
/***/ (function(module, exports) {

module.exports = function(module) {
	if(!module.webpackPolyfill) {
		module.deprecate = function() {};
		module.paths = [];
		// module.parent = undefined by default
		if(!module.children) module.children = [];
		Object.defineProperty(module, "loaded", {
			enumerable: true,
			get: function() {
				return module.l;
			}
		});
		Object.defineProperty(module, "id", {
			enumerable: true,
			get: function() {
				return module.i;
			}
		});
		module.webpackPolyfill = 1;
	}
	return module;
};


/***/ }),
/* 58 */
/***/ (function(module, exports, __webpack_require__) {

const inherits = __webpack_require__(1).inherits
const Transaction = __webpack_require__(157)
const ethUtil = __webpack_require__(0)
const Subprovider = __webpack_require__(3)
const blockTagForPayload = __webpack_require__(22).blockTagForPayload

module.exports = NonceTrackerSubprovider

// handles the following RPC methods:
//   eth_getTransactionCount (pending only)
// observes the following RPC methods:
//   eth_sendRawTransaction


inherits(NonceTrackerSubprovider, Subprovider)

function NonceTrackerSubprovider(opts){
  const self = this

  self.nonceCache = {}
}

NonceTrackerSubprovider.prototype.handleRequest = function(payload, next, end){
  const self = this

  switch(payload.method) {

    case 'eth_getTransactionCount':
      var blockTag = blockTagForPayload(payload)
      var address = payload.params[0].toLowerCase()
      var cachedResult = self.nonceCache[address]
      // only handle requests against the 'pending' blockTag
      if (blockTag === 'pending') {
        // has a result
        if (cachedResult) {
          end(null, cachedResult)
        // fallthrough then populate cache
        } else {
          next(function(err, result, cb){
            if (err) return cb()
            if (self.nonceCache[address] === undefined) {
              self.nonceCache[address] = result
            }
            cb()
          })
        }
      } else {
        next()
      }
      return

    case 'eth_sendRawTransaction':
      // allow the request to continue normally
      next(function(err, result, cb){
        // only update local nonce if tx was submitted correctly
        if (err) return cb()
        // parse raw tx
        var rawTx = payload.params[0]
        var stripped = ethUtil.stripHexPrefix(rawTx)
        var rawData = new Buffer(ethUtil.stripHexPrefix(rawTx), 'hex')
        var tx = new Transaction(new Buffer(ethUtil.stripHexPrefix(rawTx), 'hex'))
        // extract address
        var address = '0x'+tx.getSenderAddress().toString('hex').toLowerCase()
        // extract nonce and increment
        var nonce = ethUtil.bufferToInt(tx.nonce)
        nonce++
        // hexify and normalize
        var hexNonce = nonce.toString(16)
        if (hexNonce.length%2) hexNonce = '0'+hexNonce
        hexNonce = '0x'+hexNonce
        // dont update our record on the nonce until the submit was successful
        // update cache
        self.nonceCache[address] = hexNonce
        cb()
      })
      return

    default:
      next()
      return

  }
}

/***/ }),
/* 59 */
/***/ (function(module, exports) {

module.exports = require("promise-to-callback");

/***/ }),
/* 60 */
/***/ (function(module, exports) {

module.exports = require("cross-fetch");

/***/ }),
/* 61 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", { value: true });
const configs_1 = __webpack_require__(9);
const http = __webpack_require__(63);
const rethinkConn_1 = __webpack_require__(64);
const addEvents_1 = __webpack_require__(76);
const datastores_1 = __webpack_require__(20);
const yargs_1 = __webpack_require__(31);
const cacheDB_1 = __webpack_require__(78);
const vmRunner_1 = __webpack_require__(80);
const vmEngine_1 = __webpack_require__(90);
if (yargs_1.argv.resetDS) datastores_1.default.initialize();
const server = http.createServer();
const io = __webpack_require__(180)(server, configs_1.default.global.SOCKET_IO);
server.listen(configs_1.default.global.SOCKET_IO.port, configs_1.default.global.SOCKET_IO.ip, () => {
    console.log("Listening on", configs_1.default.global.SOCKET_IO.port);
});
let cacheDB = new cacheDB_1.default(configs_1.default.global.REDIS.URL, {
    port: configs_1.default.global.GETH_RPC.port,
    host: configs_1.default.global.GETH_RPC.host
});
let vmRunner = new vmRunner_1.default(cacheDB);
let rdb = new rethinkConn_1.default(io, vmRunner);
datastores_1.default.getBlocks(_blocks => {
    vmRunner.setStateRoot(_blocks && _blocks[0] && _blocks[0].stateRoot ? new Buffer(_blocks[0].stateRoot) : new Buffer('d7f8974fb5ac78d9ac099b9ad5018bedc2ce0a72dad1827a1709da30580f0544', 'hex'));
});
console.log("Start VmEngine");
vmEngine_1.default.start();
io.on('connection', _socket => {
    addEvents_1.default(_socket, rdb, vmRunner, vmEngine_1.default);
});

/***/ }),
/* 62 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    BLOCK_TIME: 14,
    LOKI: {
        dbName: "loki.json",
        tableNames: ["blocks", "transactions"],
        ttl: {
            interval: 5000,
            age: 5 * 60 * 1000
        }
    },
    REDIS: {
        URL: process.env.REDIS_URL
    },
    SOCKET_IO: {
        port: parseInt(process.env.PORT) || 3000,
        serveClient: false,
        pingInterval: 10000,
        pingTimeout: 5000,
        cookie: true,
        ip: "0.0.0.0"
    },
    DATASTORE: 'Redis',
    RETHINK_DB: {
        host: "localhost",
        port: 28015,
        db: "eth_mainnet",
        env_cert: "RETHINKDB_CERT",
        env_cert_raw: "RETHINKDB_CERT_RAW",
        env_url: "RETHINKDB_URL"
    },
    MAX: {
        socketRows: 64
    },
    GETH_RPC: {
        port: process.env.RPC_PORT ? parseInt(process.env.RPC_PORT) : 8545,
        host: process.env.RPC_HOST || "localhost"
    },
    ID: process.env.DYNO || "local"
};

/***/ }),
/* 63 */
/***/ (function(module, exports) {

module.exports = require("http");

/***/ }),
/* 64 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", { value: true });
const r = __webpack_require__(65);
const configs_1 = __webpack_require__(9);
const fs = __webpack_require__(66);
const url_1 = __webpack_require__(67);
const yargs_1 = __webpack_require__(31);
const datastores_1 = __webpack_require__(20);
const libs_1 = __webpack_require__(15);
class RethinkDB {
    constructor(_socketIO, _vmR) {
        this.socketIO = _socketIO;
        this.vmRunner = _vmR;
        this.start();
    }
    start() {
        let _this = this;
        this.tempTxs = [];
        let conf = configs_1.default.global.RETHINK_DB;
        let tempConfig = {
            host: conf.host,
            port: conf.port,
            db: conf.db
        };
        let connect = _config => {
            r.connect(_config, (err, conn) => {
                if (!err) {
                    _this.dbConn = conn;
                    _this.setAllEvents();
                } else {
                    console.log(err);
                }
            });
        };
        let connectWithCert = _cert => {
            let url = new url_1.URL(process.env[conf.env_url]);
            tempConfig = {
                host: url.hostname,
                port: parseInt(url.port),
                password: url.password,
                ssl: {
                    ca: _cert
                },
                db: conf.db
            };
            if (!_cert) delete tempConfig.ssl;
            connect(tempConfig);
        };
        if (yargs_1.argv.remoteRDB && !yargs_1.argv.rawCert) {
            fs.readFile(process.env[conf.env_cert], (err, caCert) => {
                connectWithCert(caCert);
            });
        } else if (yargs_1.argv.remoteRDB && yargs_1.argv.rawCert) {
            connectWithCert(process.env[conf.env_cert_raw]);
        } else {
            connect(tempConfig);
        }
    }
    setAllEvents() {
        let _this = this;
        r.table('blocks').changes().map(change => {
            return change('new_val');
        }).merge(block => {
            return {
                transactions: r.table('transactions').getAll(r.args(block('transactionHashes'))).coerceTo('array'),
                blockStats: {
                    pendingTxs: r.table('data').get('cached').getField('pendingTxs')
                }
            };
        }).run(_this.dbConn, (err, cursor) => {
            cursor.each((err, block) => {
                if (!err) {
                    _this.vmRunner.setStateRoot(block.stateRoot);
                    let bstats = new libs_1.BlockStats(block, block.transactions);
                    block.blockStats = Object.assign({}, bstats.getBlockStats(), block.blockStats);
                    let sBlock = new libs_1.SmallBlock(block);
                    let blockHash = sBlock.hash();
                    _this.socketIO.to(blockHash).emit(blockHash + '_update', block);
                    _this.onNewBlock(sBlock.smallify());
                    _this.onNewTx(block.transactions.map(_tx => {
                        let sTx = new libs_1.SmallTx(_tx);
                        let txHash = sTx.hash();
                        _this.socketIO.to(txHash).emit(txHash + '_update', _tx);
                        return sTx.smallify();
                    }));
                }
            });
        });
        r.table('transactions').changes().filter(r.row('new_val')('pending').eq(true)).run(_this.dbConn, (err, cursor) => {
            cursor.each((err, row) => {
                if (!err) {
                    let _tx = row.new_val;
                    if (_tx.pending) {
                        let sTx = new libs_1.SmallTx(_tx);
                        let txHash = sTx.hash();
                        _this.socketIO.to(txHash).emit(txHash + '_update', _tx);
                        _this.socketIO.to('pendingTxs').emit('newPendingTx', sTx.smallify());
                    }
                }
            });
        });
    }
    getAddressTransactionPages(address, hash, bNumber, cb) {
        let _this = this;
        let sendResults = _cursor => {
            _cursor.toArray((err, results) => {
                if (err) cb(err, null);else cb(null, results.map(_tx => {
                    return new libs_1.SmallTx(_tx).smallify();
                }));
            });
        };
        if (!hash) {
            r.table("transactions").orderBy({ index: r.desc("numberAndHash") }).filter(r.row("from").eq(r.args([new Buffer(address)])).or(r.row("to").eq(r.args([new Buffer(address)])))).limit(25).run(_this.dbConn, (err, cursor) => {
                if (err) cb(err, null);else sendResults(cursor);
            });
        } else {
            r.table("transactions").orderBy({ index: r.desc("numberAndHash") }).between(r.args([[r.minval, r.minval]]), r.args([[bNumber, new Buffer(hash)]]), { leftBound: "open", index: "numberAndHash" }).filter(r.or(r.row("from").eq(r.args([new Buffer(address)])), r.row("to").eq(r.args([new Buffer(address)])))).limit(25).run(_this.dbConn, function (err, cursor) {
                if (err) cb(err, null);else sendResults(cursor);
            });
        }
    }
    getTransactionPages(hash, bNumber, cb) {
        let _this = this;
        let sendResults = _cursor => {
            _cursor.toArray((err, results) => {
                if (err) cb(err, null);else cb(null, results.map(_tx => {
                    return new libs_1.SmallTx(_tx).smallify();
                }));
            });
        };
        if (!hash) {
            r.table("transactions").orderBy({ index: r.desc("numberAndHash") }).filter({ pending: false }).limit(25).run(_this.dbConn, (err, cursor) => {
                if (err) cb(err, null);else sendResults(cursor);
            });
        } else {
            r.table("transactions").orderBy({ index: r.desc("numberAndHash") }).between(r.args([[r.minval, r.minval]]), r.args([[bNumber, new Buffer(hash)]]), { leftBound: "open", index: "numberAndHash" }).filter({ pending: false }).limit(25).run(_this.dbConn, function (err, cursor) {
                if (err) cb(err, null);else sendResults(cursor);
            });
        }
    }
    getBlockTransactions(hash, cb) {
        r.table('blocks').get(r.args([new Buffer(hash)])).do(block => {
            return r.table('transactions').getAll(r.args(block('transactionHashes'))).coerceTo('array');
        }).run(this.dbConn, (err, result) => {
            if (err) cb(err, null);else cb(null, result.map(_tx => {
                return new libs_1.SmallTx(_tx).smallify();
            }));
        });
    }
    getBlock(hash, cb) {
        r.table('blocks').get(r.args([new Buffer(hash)])).run(this.dbConn, (err, result) => {
            if (err) cb(err, null);else cb(null, result);
        });
    }
    getTx(hash, cb) {
        r.table("transactions").get(r.args([new Buffer(hash)])).merge(function (_tx) {
            return {
                trace: r.db("eth_mainnet").table('traces').get(_tx('hash')),
                logs: r.db("eth_mainnet").table('logs').get(_tx('hash'))
            };
        }).run(this.dbConn, (err, result) => {
            if (err) cb(err, null);else cb(null, result);
        });
    }
    onNewBlock(_block) {
        let _this = this;
        console.log("go new block", _block.hash);
        this.socketIO.to('blocks').emit('newBlock', _block);
        datastores_1.default.addBlock(_block);
    }
    onNewTx(_tx) {
        if (Array.isArray(_tx) && !_tx.length) return;
        this.socketIO.to('txs').emit('newTx', _tx);
        datastores_1.default.addTransaction(_tx);
    }
}
exports.default = RethinkDB;

/***/ }),
/* 65 */
/***/ (function(module, exports) {

module.exports = require("rethinkdb");

/***/ }),
/* 66 */
/***/ (function(module, exports) {

module.exports = require("fs");

/***/ }),
/* 67 */
/***/ (function(module, exports) {

module.exports = require("url");

/***/ }),
/* 68 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", { value: true });
const Redis = __webpack_require__(32);
const configs_1 = __webpack_require__(9);
let redis = new Redis(configs_1.default.global.REDIS.URL);
let tableCache = {
    transactions: [],
    blocks: []
};
let tables = {
    transactions: "transactions",
    blocks: 'blocks'
};
let bufferify = obj => {
    for (let key in obj) {
        if (obj.hasOwnProperty(key) && obj[key]) {
            if (obj[key].type && obj[key].type === 'Buffer') {
                obj[key] = new Buffer(obj[key]);
            } else if (Array.isArray(obj[key])) {
                obj[key] = obj[key].map(_item => {
                    if (_item.type && _item.type === 'Buffer') return new Buffer(_item);else return _item;
                });
            }
        }
    }
    return obj;
};
let getArray = (tbName, cb) => {
    let tbKey = tbName;
    if (tableCache[tbKey].length) cb(tableCache[tbKey]);else {
        let vals = redis.get(tbName, (err, result) => {
            if (!err && result) {
                let bufferedArr = JSON.parse(result).map(_item => {
                    return bufferify(_item);
                });
                tableCache[tbKey] = bufferedArr;
                cb(bufferedArr);
            } else cb([]);
        });
    }
};
let addTransaction = tx => {
    getArray(tables.transactions, pTxs => {
        if (Array.isArray(tx)) {
            tx.forEach(tTx => {
                pTxs.unshift(tTx);
            });
        } else {
            pTxs.unshift(tx);
        }
        if (pTxs.length > configs_1.default.global.MAX.socketRows) pTxs = pTxs.slice(0, configs_1.default.global.MAX.socketRows);
        let tbKey = "transactions";
        tableCache[tbKey] = pTxs;
        redis.set(tables.transactions, JSON.stringify(pTxs));
    });
};
let addBlock = block => {
    getArray(tables.blocks, pBlocks => {
        pBlocks.unshift(block);
        if (pBlocks.length > configs_1.default.global.MAX.socketRows) pBlocks = pBlocks.slice(0, configs_1.default.global.MAX.socketRows);
        let tbKey = "blocks";
        tableCache[tbKey] = pBlocks;
        redis.set(tables.blocks, JSON.stringify(pBlocks));
    });
};
let getBlocks = cb => {
    getArray(tables.blocks, cb);
};
let getTransactions = cb => {
    getArray(tables.transactions, cb);
};
let thisReturnsANumber = (id, name) => {
    return 0;
};
let initialize = () => {
    redis.set(tables.transactions, JSON.stringify([]));
    redis.set(tables.blocks, JSON.stringify([]));
};
exports.default = {
    addTransaction,
    addBlock,
    getBlocks,
    getTransactions,
    initialize
};

/***/ }),
/* 69 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", { value: true });
const loki = __webpack_require__(70);
const configs_1 = __webpack_require__(9);
let lokiDB = new loki(configs_1.default.global.LOKI.dbName, { autosave: true, autosaveInterval: 5000, autoload: true });
let tables = configs_1.default.global.LOKI.tableNames;
let setCollections = () => {
    tables.forEach((item, idx) => {
        if (!lokiDB.getCollection(item)) lokiDB.addCollection(item, { unique: ['hash'] }).setTTL(configs_1.default.global.LOKI.ttl.age, configs_1.default.global.LOKI.ttl.interval);
    });
};
let hexify = obj => {
    let _obj = Object.assign({}, obj);
    for (var key in _obj) {
        if (_obj.hasOwnProperty(key)) {
            if (Buffer.isBuffer(_obj[key])) _obj[key] = '0x' + _obj[key].toString('hex');
        }
    }
    return _obj;
};
let bufferify = obj => {
    let _obj = Object.assign({}, obj);
    for (var key in _obj) {
        if (_obj.hasOwnProperty(key)) {
            if ((typeof _obj[key] === 'string' || _obj[key] instanceof String) && _obj[key].substring(0, 2) == '0x') _obj[key] = new Buffer(_obj[key].substring(2).toUpperCase(), 'hex');
        }
    }
    return _obj;
};
let processTx = tx => {
    let hexed = hexify(tx);
    let col = lokiDB.getCollection('transactions');
    var obj = col.by('hash', hexed.hash);
    if (obj) {
        col.remove(obj);
    }
    lokiDB.getCollection('transactions').insert(hexed);
};
let addTransaction = tx => {
    if (Array.isArray(tx)) {
        tx.forEach(tTx => {
            processTx(tTx);
        });
    } else {
        processTx(tx);
    }
};
let addBlock = block => {
    let hexed = hexify(block);
    let col = lokiDB.getCollection('blocks');
    var obj = col.by('hash', hexed.hash);
    if (obj) {
        col.remove(obj);
    }
    lokiDB.getCollection('blocks').insert(hexed);
};
let getBlocks = cb => {
    cb(lokiDB.getCollection('blocks').chain().simplesort('blockNumber').data().map(_block => {
        return bufferify(_block);
    }));
};
let getTransactions = cb => {
    cb(lokiDB.getCollection('transactions').chain().simplesort('blockNumber').data().map(_tx => {
        return bufferify(_tx);
    }));
};
let thisReturnsANumber = (id, name) => {
    return 0;
};
let initialize = () => {
    setCollections();
    lokiDB.getCollection('transactions').clear();
    lokiDB.getCollection('blocks').clear();
};
exports.default = {
    addTransaction,
    addBlock,
    getBlocks,
    getTransactions,
    initialize
};

/***/ }),
/* 70 */
/***/ (function(module, exports) {

module.exports = require("lokijs");

/***/ }),
/* 71 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", { value: true });
const libs_1 = __webpack_require__(15);
const bignumber_js_1 = __webpack_require__(33);
class SmallBlock {
    constructor(_block) {
        this.block = _block;
    }
    hash() {
        return '0x' + new Buffer(this.block.hash).toString('hex');
    }
    smallify() {
        let _block = this.block;
        return {
            number: _block.number,
            intNumber: _block.intNumber,
            hash: _block.hash,
            miner: _block.miner,
            timestamp: _block.timestamp,
            transactionCount: _block.transactionHashes.length,
            uncleHashes: _block.uncleHashes,
            isUncle: _block.isUncle,
            totalBlockReward: Buffer.from(new bignumber_js_1.default(libs_1.common.bufferToHex(_block.blockReward)).plus(new bignumber_js_1.default(libs_1.common.bufferToHex(_block.txFees))).plus(new bignumber_js_1.default(libs_1.common.bufferToHex(_block.uncleReward))).toString(16), 'hex'),
            blockReward: _block.blockReward,
            txFees: _block.txFees,
            stateRoot: _block.stateRoot,
            uncleReward: _block.uncleReward,
            difficulty: _block.difficulty,
            blockStats: _block.blockStats
        };
    }
}
exports.default = SmallBlock;

/***/ }),
/* 72 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", { value: true });
class SmallTx {
    constructor(_tx) {
        this.tx = _tx;
    }
    hash() {
        return '0x' + new Buffer(this.tx.hash).toString('hex');
    }
    smallify() {
        let _tx = this.tx;
        return {
            blockNumber: _tx.blockNumber,
            blockHash: _tx.blockHash,
            from: _tx.from,
            to: _tx.to,
            gasUsed: _tx.gasUsed,
            contractAddress: _tx.contractAddress,
            gas: _tx.gas,
            gasPrice: _tx.gasPrice,
            hash: _tx.hash,
            input: _tx.input,
            value: _tx.value,
            status: _tx.status,
            timestamp: _tx.timestamp
        };
    }
}
exports.default = SmallTx;

/***/ }),
/* 73 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", { value: true });
const bignumber_js_1 = __webpack_require__(33);
const libs_1 = __webpack_require__(15);
const configs_1 = __webpack_require__(9);
let previousBlockTime = new bignumber_js_1.default(0);
const BLOCK_TIME = configs_1.default.global.BLOCK_TIME;
class BlockStats {
    constructor(_block, _txs) {
        this.block = _block;
        this.txs = _txs;
        let ts = new bignumber_js_1.default(libs_1.common.bufferToHex(this.block.timestamp));
        if (!previousBlockTime) previousBlockTime = ts.sub(BLOCK_TIME);
        this.blockTime = ts.sub(previousBlockTime).abs();
        if (!this.block.isUncle) previousBlockTime = new bignumber_js_1.default(libs_1.common.bufferToHex(this.block.timestamp));
    }
    getBlockStats() {
        if (!this.txs.length) return {
            blockTime: '0x0',
            failed: '0x0',
            success: '0x0',
            avgGasPrice: '0x0',
            avgTxFees: '0x0'
        };
        let txStatus = {
            blockTime: new bignumber_js_1.default(0),
            failed: new bignumber_js_1.default(0),
            success: new bignumber_js_1.default(0),
            totGasPrice: new bignumber_js_1.default(0),
            totTxFees: new bignumber_js_1.default(0)
        };
        this.txs.forEach(_tx => {
            if (_tx.status) txStatus.success = txStatus.success.add(1);else txStatus.failed = txStatus.failed.add(1);
            txStatus.totGasPrice = txStatus.totGasPrice.add(new bignumber_js_1.default(libs_1.common.bufferToHex(_tx.gasPrice)));
            txStatus.totTxFees = txStatus.totTxFees.add(new bignumber_js_1.default(libs_1.common.bufferToHex(_tx.gasPrice)).mul(new bignumber_js_1.default(libs_1.common.bufferToHex(_tx.gasUsed))));
        });
        return {
            blockTime: libs_1.common.bnToHex(this.blockTime),
            failed: libs_1.common.bnToHex(txStatus.failed),
            success: libs_1.common.bnToHex(txStatus.success),
            avgGasPrice: libs_1.common.bnToHex(txStatus.totGasPrice.div(this.txs.length).ceil()),
            avgTxFees: libs_1.common.bnToHex(txStatus.totTxFees.div(this.txs.length).ceil())
        };
    }
}
exports.default = BlockStats;

/***/ }),
/* 74 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", { value: true });
const _ = __webpack_require__(75);
let bufferToHex = _buf => {
    let r = '0x' + new Buffer(_buf).toString('hex');
    if (r == '0x') r = "0x0";
    return r;
};
exports.bufferToHex = bufferToHex;
let bnToHex = _bn => {
    return '0x' + _bn.toString(16);
};
exports.bnToHex = bnToHex;
let validateHexString = str => {
    if (str == "") return true;
    str = str.substring(0, 2) == '0x' ? str.substring(2).toUpperCase() : str.toUpperCase();
    var re = /^[0-9A-F]+$/g;
    return re.test(str);
};
let validateByteArray = arr => {
    let valid = true;
    arr.forEach(_item => {
        if (!_.isNumber(_item) || _item < 0 || _item > 255) valid = false;
    });
    return valid;
};
let check = {
    isNumber(_item) {
        return _.isNumber(_item);
    },
    isHashString(_item) {
        return _item.substr(0, 2) == "0x" && validateHexString(_item.substring(2).toUpperCase()) && _item.length === 66;
    },
    isHashBuffer(_item) {
        return Buffer.isBuffer(_item) && _item.length === 32;
    },
    isAddressString(_item) {
        return _item.substr(0, 2) == "0x" && validateHexString(_item.substring(2).toUpperCase()) && _item.length === 42;
    },
    isAddressBuffer(_item) {
        return Buffer.isBuffer(_item) && _item.length === 20;
    },
    isBufferObject(_item, length) {
        return _item.type && _item.type == "Buffer" && _item.data && _.isArray(_item.data) && validateByteArray(_item.data) && _item.data.length == length;
    }
};
exports.check = check;
let newError = _msg => {
    return {
        message: _msg
    };
};
exports.newError = newError;
let errors = {
    notNumber: "Not a valid number",
    notBuffer: "Not a valid Buffer",
    notHash: "Not a valid Hash string",
    notAddress: "Not a valid Address string",
    invalidInput: "Invalid input"
};
exports.errors = errors;

/***/ }),
/* 75 */
/***/ (function(module, exports) {

module.exports = require("lodash");

/***/ }),
/* 76 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", { value: true });
const globalFuncs_1 = __webpack_require__(77);
const datastores_1 = __webpack_require__(20);
const libs_1 = __webpack_require__(15);
let events = [{
    name: "join",
    onEvent: (_socket, _msg) => {
        if (_msg) {
            _socket.join(_msg);
            globalFuncs_1.log.info(_socket.id, "joined", _msg);
        } else {
            globalFuncs_1.log.error(_socket.id, 'tried to join invalid room', _msg);
        }
    }
}, {
    name: "leave",
    onEvent: (_socket, _msg) => {
        if (_msg) {
            _socket.leave(_msg);
            globalFuncs_1.log.info(_socket.id, "Left", _msg);
        } else {
            globalFuncs_1.log.error(_socket.id, 'tried to leave invalid room', _msg);
        }
    }
}, {
    name: "pastBlocks",
    onEvent: (_socket, _msg, _glob, _cb) => {
        datastores_1.default.getBlocks(_blocks => {
            let blocks = [];
            _blocks.forEach((_block, idx) => {
                blocks.unshift(_block);
            });
            _cb(null, blocks);
        });
    }
}, {
    name: "pastTxs",
    onEvent: (_socket, _msg, _glob, _cb) => {
        datastores_1.default.getTransactions(_txs => {
            let txs = [];
            _txs.forEach(_tx => {
                txs.unshift(_tx);
            });
            _cb(null, txs);
        });
    }
}, {
    name: "getBlock",
    onEvent: (_socket, _msg, _glob, _cb) => {
        _glob.rdb.getBlock(_msg, _cb);
    }
}, {
    name: "getTx",
    onEvent: (_socket, _msg, _glob, _cb) => {
        _glob.rdb.getTx(_msg, _cb);
    }
}, {
    name: "getBlockTransactions",
    onEvent: (_socket, _msg, _glob, _cb) => {
        _glob.rdb.getBlockTransactions(_msg, _cb);
    }
}, {
    name: "getAccount",
    onEvent: (_socket, _msg, _glob, _cb) => {
        _glob.vmE.getStorageAt(_msg, _cb);
    }
}, {
    name: "ethCall",
    onEvent: (_socket, _msg, _glob, _cb) => {
        console.log("ethCall ethCall ethCall ethCall ethCall ethCall ethCall ethCall ");
        _glob.vmR.call(_msg, _cb);
    }
}, {
    name: "getKeyValue",
    onEvent: (_socket, _msg, _glob, _cb) => {
        if (!libs_1.common.check.isBufferObject(_msg, 32)) _cb(libs_1.common.newError(libs_1.common.errors.notBuffer), null);else _glob.vmR.getKeyValue(_msg, _cb);
    }
}, {
    name: "getCurrentStateRoot",
    onEvent: (_socket, _msg, _glob, _cb) => {
        if (_msg != "") _cb(libs_1.common.newError(libs_1.common.errors.invalidInput), null);else _glob.vmR.getCurrentStateRoot(_cb);
    }
}, {
    name: "getTransactionPages",
    onEvent: (_socket, reqObj, _glob, _cb) => {
        if (reqObj.hash && (!libs_1.common.check.isBufferObject(reqObj.hash, 32) || !libs_1.common.check.isNumber(reqObj.number))) _cb(libs_1.common.newError(libs_1.common.errors.notBuffer), null);else _glob.rdb.getTransactionPages(reqObj.hash, reqObj.number, _cb);
    }
}, {
    name: "getAddressTransactionPages",
    onEvent: (_socket, reqObj, _glob, _cb) => {
        if (reqObj.hash && (!libs_1.common.check.isBufferObject(reqObj.hash, 32) || !libs_1.common.check.isNumber(reqObj.number))) _cb(libs_1.common.newError(libs_1.common.errors.notBuffer), null);else if (!libs_1.common.check.isBufferObject(reqObj.address, 20)) _cb(libs_1.common.newError(libs_1.common.errors.notBuffer), null);else _glob.rdb.getAddressTransactionPages(reqObj.address, reqObj.hash, reqObj.number, _cb);
    }
}];
let onConnection = (_socket, _rdb, _vmR, _vmE) => {
    events.forEach((event, idx) => {
        _socket.on(event.name, (msg, cb) => {
            event.onEvent(_socket, msg, {
                rdb: _rdb,
                vmR: _vmR,
                vmE: _vmE
            }, cb);
        });
    });
};
exports.default = onConnection;

/***/ }),
/* 77 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", { value: true });
let log = {
    error: (..._msg) => {
        console.error(_msg.join(' '));
    },
    info: (..._msg) => {
        console.info(_msg.join(' '));
    }
};
exports.log = log;

/***/ }),
/* 78 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", { value: true });
const Redis = __webpack_require__(32);
const rpc = __webpack_require__(79);
class CacheDB {
    constructor(_redis, _rpc) {
        this.redisConn = new Redis(_redis);
        this.rpcConn = rpc.Client.$create(_rpc.port, _rpc.host);
    }
    get(key, options, cb) {
        let _this = this;
        this.redisConn.get(key, (err, result) => {
            if (!err && result) {
                cb(null, new Buffer(result, 'hex'));
            } else {
                this.rpcConn.call('eth_getKeyValue', ['0x' + key.toString('hex')], function (err, result) {
                    if (err) {
                        cb(err, null);
                    } else {
                        let resBuf = new Buffer(result.substring(2), 'hex');
                        _this.redisConn.set(key, resBuf.toString('hex'));
                        cb(null, resBuf);
                    }
                });
            }
        });
    }
    put(key, val, options, cb) {
        cb(null, true);
    }
    batch(ops, options, cb) {
        cb(null, true);
    }
    del(key, cb) {
        cb(null, true);
    }
    isOpen() {
        return true;
    }
}
exports.default = CacheDB;

/***/ }),
/* 79 */
/***/ (function(module, exports) {

module.exports = require("json-rpc2");

/***/ }),
/* 80 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", { value: true });
let VM = __webpack_require__(81);
let Account = __webpack_require__(10);
let Trie = __webpack_require__(34);
const GAS_LIMIT = '0x4c4b40';
var LRU = __webpack_require__(89);
const hexToBuffer = hex => {
    return Buffer.from(hex.toLowerCase().replace('0x', ''), 'hex');
};
class VmRunner {
    constructor(_db) {
        this.db = _db;
        this.codeCache = new LRU(2000);
    }
    setStateRoot(_hash) {
        let _temp = new Trie(this.db, _hash);
        this.stateTrie = _temp;
    }
    call(txs, mCB) {
        console.log("eth call ====================");
        let _this = this;
        let _trie = _this.stateTrie.copy();
        let runCode = (sTree, to, code, gasLimit, data, _cb) => {
            let vm = new VM({
                state: sTree
            });
            vm.runCode({
                address: to,
                code: code,
                gasLimit: gasLimit,
                data: data
            }, (err, result) => {
                _cb(err, result ? result.return : null);
            });
        };
        let getResult = (tx, treeClone, cb) => {
            if (_this.codeCache.peek(tx.to)) {
                runCode(treeClone, hexToBuffer(tx.to), _this.codeCache.get(tx.to), GAS_LIMIT, hexToBuffer(tx.data), cb);
                return;
            }
            treeClone.get(hexToBuffer(tx.to), (err, val) => {
                if (err) {
                    cb(err, null);
                    return;
                }
                let account = new Account(val);
                treeClone.getRaw(account.codeHash, (err, code) => {
                    if (err) {
                        cb(err, null);
                        return;
                    }
                    _this.codeCache.set(tx.to, code);
                    runCode(treeClone, hexToBuffer(tx.to), code ? code : new Buffer('00', 'hex'), GAS_LIMIT, hexToBuffer(tx.data), cb);
                });
            });
        };
        if (Array.isArray(txs)) {
            let returnArr = [];
            let counter = 0;
            txs.forEach((_tx, _idx) => {
                getResult(_tx, _trie.copy(), (err, result) => {
                    counter++;
                    returnArr[_idx] = { error: err, result: result };
                    if (counter == txs.length) mCB(null, returnArr);
                });
            });
        } else {
            getResult(txs, _trie, mCB);
        }
    }
    getKeyValue(_key, _cb) {
        this.db.get(new Buffer(_key), {
            keyEncoding: 'binary',
            valueEncoding: 'binary'
        }, _cb);
    }
    getCurrentStateRoot(_cb) {
        _cb(null, this.stateTrie.root);
    }
    getAccount(_to, cb) {
        let treeClone = this.stateTrie.copy();
        console.log("----getAccountgetAccount -----", _to);
        treeClone.get(hexToBuffer(_to), (err, val) => {
            console.log(err, val);
            if (err) {
                cb(err, null);
            } else {
                cb(null, val);
            }
        });
    }
}
exports.default = VmRunner;

/***/ }),
/* 81 */
/***/ (function(module, exports) {

module.exports = require("ethereumjs-vm");

/***/ }),
/* 82 */
/***/ (function(module, exports, __webpack_require__) {

const BaseTrie = __webpack_require__(83)
const checkpointInterface = __webpack_require__(85)
const inherits = __webpack_require__(1).inherits
const proof = __webpack_require__(87)

module.exports = CheckpointTrie

inherits(CheckpointTrie, BaseTrie)

function CheckpointTrie () {
  BaseTrie.apply(this, arguments)
  checkpointInterface(this)
}

CheckpointTrie.prove = proof.prove
CheckpointTrie.verifyProof = proof.verifyProof



/***/ }),
/* 83 */
/***/ (function(module, exports, __webpack_require__) {

const assert = __webpack_require__(7)
const levelup = __webpack_require__(35)
const memdown = __webpack_require__(36)
const async = __webpack_require__(2)
const rlp = __webpack_require__(37)
const ethUtil = __webpack_require__(0)
const semaphore = __webpack_require__(38)
const TrieNode = __webpack_require__(21)
const ReadStream = __webpack_require__(84)
const matchingNibbleLength = __webpack_require__(11).matchingNibbleLength
const doKeysMatch = __webpack_require__(11).doKeysMatch
const callTogether = __webpack_require__(11).callTogether
const asyncFirstSeries = __webpack_require__(11).asyncFirstSeries

module.exports = Trie

/**
 * Use `require('merkel-patricia-tree')` for the base interface. In Ethereum applications stick with the Secure Trie Overlay `require('merkel-patricia-tree/secure')`. The API for the raw and the secure interface are about the same
 * @class Trie
 * @param {Object} [db] An instance of [levelup](https://github.com/rvagg/node-levelup/) or a compatible API. If the db is `null` or left undefined, then the trie will be stored in memory via [memdown](https://github.com/rvagg/memdown)
 * @param {Buffer|String} [root]` A hex `String` or `Buffer` for the root of a previously stored trie
 * @prop {Buffer} root The current root of the `trie`
 * @prop {Boolean} isCheckpoint  determines if you are saving to a checkpoint or directly to the db
 * @prop {Buffer} EMPTY_TRIE_ROOT the Root for an empty trie
 */
function Trie (db, root) {
  var self = this
  this.EMPTY_TRIE_ROOT = ethUtil.SHA3_RLP
  this.sem = semaphore(1)

  // setup dbs
  this.db = db ||
    levelup('', {
      db: memdown
    })

  this._getDBs = [this.db]
  this._putDBs = [this.db]

  Object.defineProperty(this, 'root', {
    set: function (value) {
      if (value) {
        value = ethUtil.toBuffer(value)
        assert(value.length === 32, 'Invalid root length. Roots are 32 bytes')
      } else {
        value = self.EMPTY_TRIE_ROOT
      }

      this._root = value
    },
    get: function () {
      return this._root
    }
  })

  this.root = root
}

/**
 * Gets a value given a `key`
 * @method get
 * @param {Buffer|String} key - the key to search for
 * @param {Function} cb A callback `Function` which is given the arguments `err` - for errors that may have occured and `value` - the found value in a `Buffer` or if no value was found `null`
 */
Trie.prototype.get = function (key, cb) {
  var self = this

  key = ethUtil.toBuffer(key)

  self.findPath(key, function (err, node, remainder, stack) {
    var value = null
    if (node && remainder.length === 0) {
      value = node.value
    }

    cb(err, value)
  })
}

/**
 * Stores a given `value` at the given `key`
 * @method put
 * @param {Buffer|String} key
 * @param {Buffer|String} Value
 * @param {Function} cb A callback `Function` which is given the argument `err` - for errors that may have occured
 */
Trie.prototype.put = function (key, value, cb) {
  var self = this

  key = ethUtil.toBuffer(key)
  value = ethUtil.toBuffer(value)

  if (!value || value.toString() === '') {
    self.del(key, cb)
  } else {
    cb = callTogether(cb, self.sem.leave)

    self.sem.take(function () {
      if (self.root.toString('hex') !== ethUtil.SHA3_RLP.toString('hex')) {
        // first try to find the give key or its nearst node
        self.findPath(key, function (err, foundValue, keyRemainder, stack) {
          if (err) {
            return cb(err)
          }
          // then update
          self._updateNode(key, value, keyRemainder, stack, cb)
        })
      } else {
        self._createInitialNode(key, value, cb) // if no root initialize this trie
      }
    })
  }
}

/**
 * deletes a value given a `key`
 * @method del
 * @param {Buffer|String} key
 * @param {Function} callback the callback `Function`
 */
Trie.prototype.del = function (key, cb) {
  var self = this

  key = ethUtil.toBuffer(key)
  cb = callTogether(cb, self.sem.leave)

  self.sem.take(function () {
    self.findPath(key, function (err, foundValue, keyRemainder, stack) {
      if (err) {
        return cb(err)
      }
      if (foundValue) {
        self._deleteNode(key, stack, cb)
      } else {
        cb()
      }
    })
  })
}

/**
 * Retrieves a raw value in the underlying db
 * @method getRaw
 * @param {Buffer} key
 * @param {Function} callback A callback `Function`, which is given the arguments `err` - for errors that may have occured and `value` - the found value in a `Buffer` or if no value was found `null`.
 */
Trie.prototype.getRaw = function (key, cb) {
  key = ethUtil.toBuffer(key)

  function dbGet (db, cb2) {
    db.get(key, {
      keyEncoding: 'binary',
      valueEncoding: 'binary'
    }, function (err, foundNode) {
      if (err || !foundNode) {
        cb2(null, null)
      } else {
        cb2(null, foundNode)
      }
    })
  }
  asyncFirstSeries(this._getDBs, dbGet, cb)
}

// retrieves a node from dbs by hash
Trie.prototype._lookupNode = function (node, cb) {
  if (TrieNode.isRawNode(node)) {
    cb(new TrieNode(node))
  } else {
    this.getRaw(node, function (err, value) {
      if (err) {
        throw err
      }

      if (value) {
        value = new TrieNode(rlp.decode(value))
      }

      cb(value)
    })
  }
}

// TODO: remove the proxy method when changing the caching
Trie.prototype._putRaw = function (key, val, cb) {
  function dbPut (db, cb2) {
    db.put(key, val, {
      keyEncoding: 'binary',
      valueEncoding: 'binary'
    }, cb2)
  }
  async.each(this._putDBs, dbPut, cb)
}

/**
 * Writes a value directly to the underlining db
 * @method putRaw
 * @param {Buffer|String} key The key as a `Buffer` or `String`
 * @param {Buffer} value The value to be stored
 * @param {Function} callback A callback `Function`, which is given the argument `err` - for errors that may have occured
 */
Trie.prototype.putRaw = Trie.prototype._putRaw

/**
 * Removes a raw value in the underlying db
 * @method delRaw
 * @param {Buffer|String} key
 * @param {Function} callback A callback `Function`, which is given the argument `err` - for errors that may have occured
 */
Trie.prototype.delRaw = function (key, cb) {
  function del (db, cb2) {
    db.del(key, {
      keyEncoding: 'binary'
    }, cb2)
  }
  async.each(this._putDBs, del, cb)
}

// writes a single node to dbs
Trie.prototype._putNode = function (node, cb) {
  var hash = node.hash()
  var serialized = node.serialize()
  this._putRaw(hash, serialized, cb)
}

// writes many nodes to db
Trie.prototype._batchNodes = function (opStack, cb) {
  function dbBatch (db, cb) {
    db.batch(opStack, {
      keyEncoding: 'binary',
      valueEncoding: 'binary'
    }, cb)
  }

  async.each(this._putDBs, dbBatch, cb)
}

/**
 * Trys to find a path to the node for the given key
 * It returns a `stack` of nodes to the closet node
 * @method findPath
 * @param {String|Buffer} - key - the search key
 * @param {Function} - cb - the callback function. Its is given the following
 * arguments
 *  - err - any errors encontered
 *  - node - the last node found
 *  - keyRemainder - the remaining key nibbles not accounted for
 *  - stack - an array of nodes that forms the path to node we are searching for
 */

Trie.prototype.findPath = function (targetKey, cb) {
  var self = this
  var root = self.root
  var stack = []
  targetKey = TrieNode.stringToNibbles(targetKey)

  this._walkTrie(root, processNode, cb)

  function processNode (nodeRef, node, keyProgress, walkController) {
    var nodeKey = node.key || []
    var keyRemainder = targetKey.slice(matchingNibbleLength(keyProgress, targetKey))
    var matchingLen = matchingNibbleLength(keyRemainder, nodeKey)

    stack.push(node)

    if (node.type === 'branch') {
      if (keyRemainder.length === 0) {
        walkController.return(null, node, [], stack)
      // we exhausted the key without finding a node
      } else {
        var branchIndex = keyRemainder[0]
        var branchNode = node.getValue(branchIndex)
        if (!branchNode) {
          // there are no more nodes to find and we didn't find the key
          walkController.return(null, null, keyRemainder, stack)
        } else {
          // node found, continuing search
          walkController.only(branchIndex)
        }
      }
    } else if (node.type === 'leaf') {
      if (doKeysMatch(keyRemainder, nodeKey)) {
        // keys match, return node with empty key
        walkController.return(null, node, [], stack)
      } else {
        // reached leaf but keys dont match
        walkController.return(null, null, keyRemainder, stack)
      }
    } else if (node.type === 'extention') {
      if (matchingLen !== nodeKey.length) {
        // keys dont match, fail
        walkController.return(null, null, keyRemainder, stack)
      } else {
        // keys match, continue search
        walkController.next()
      }
    }
  }
}

/*
 * Finds all nodes that store k,v values
 */
Trie.prototype._findNode = function (key, root, stack, cb) {
  this.findPath(key, function () {
    cb.apply(null, arguments)
  })
}

/*
 * Finds all nodes that store k,v values
 */
Trie.prototype._findValueNodes = function (onFound, cb) {
  this._walkTrie(this.root, function (nodeRef, node, key, walkController) {
    var fullKey = key

    if (node.key) {
      fullKey = key.concat(node.key)
    }

    if (node.type === 'leaf') {
      // found leaf node!
      onFound(nodeRef, node, fullKey, walkController.next)
    } else if (node.type === 'branch' && node.value) {
      // found branch with value
      onFound(nodeRef, node, fullKey, walkController.next)
    } else {
      // keep looking for value nodes
      walkController.next()
    }
  }, cb)
}

/*
 * Finds all nodes that are stored directly in the db
 * (some nodes are stored raw inside other nodes)
 */
Trie.prototype._findDbNodes = function (onFound, cb) {
  this._walkTrie(this.root, function (nodeRef, node, key, walkController) {
    if (TrieNode.isRawNode(nodeRef)) {
      walkController.next()
    } else {
      onFound(nodeRef, node, key, walkController.next)
    }
  }, cb)
}

/**
 * Updates a node
 * @method _updateNode
 * @param {Buffer} key
 * @param {Buffer| String} value
 * @param {Array} keyRemainder
 * @param {Array} stack -
 * @param {Function} cb - the callback
 */
Trie.prototype._updateNode = function (key, value, keyRemainder, stack, cb) {
  var toSave = []
  var lastNode = stack.pop()

  // add the new nodes
  key = TrieNode.stringToNibbles(key)

  // Check if the last node is a leaf and the key matches to this
  var matchLeaf = false
  if (lastNode.type === 'leaf') {
    var l = 0
    for (var i = 0; i < stack.length; i++) {
      var n = stack[i]
      if (n.type === 'branch') {
        l++
      } else {
        l += n.key.length
      }
    }
    if ((matchingNibbleLength(lastNode.key, key.slice(l)) === lastNode.key.length) && (keyRemainder.length === 0)) {
      matchLeaf = true
    }
  }

  if (matchLeaf) {
    // just updating a found value
    lastNode.value = value
    stack.push(lastNode)
  } else if (lastNode.type === 'branch') {
    stack.push(lastNode)
    if (keyRemainder !== 0) {
      // add an extention to a branch node
      keyRemainder.shift()
      // create a new leaf
      var newLeaf = new TrieNode('leaf', keyRemainder, value)
      stack.push(newLeaf)
    } else {
      lastNode.value = value
    }
  } else {
    // create a branch node
    var lastKey = lastNode.key
    var matchingLength = matchingNibbleLength(lastKey, keyRemainder)
    var newBranchNode = new TrieNode('branch')

    // create a new extention node
    if (matchingLength !== 0) {
      var newKey = lastNode.key.slice(0, matchingLength)
      var newExtNode = new TrieNode('extention', newKey, value)
      stack.push(newExtNode)
      lastKey.splice(0, matchingLength)
      keyRemainder.splice(0, matchingLength)
    }

    stack.push(newBranchNode)

    if (lastKey.length !== 0) {
      var branchKey = lastKey.shift()
      if (lastKey.length !== 0 || lastNode.type === 'leaf') {
        // shriking extention or leaf
        lastNode.key = lastKey
        var formatedNode = this._formatNode(lastNode, false, toSave)
        newBranchNode.setValue(branchKey, formatedNode)
      } else {
        // remove extention or attaching
        this._formatNode(lastNode, false, true, toSave)
        newBranchNode.setValue(branchKey, lastNode.value)
      }
    } else {
      newBranchNode.value = lastNode.value
    }

    if (keyRemainder.length !== 0) {
      keyRemainder.shift()
      // add a leaf node to the new branch node
      var newLeafNode = new TrieNode('leaf', keyRemainder, value)
      stack.push(newLeafNode)
    } else {
      newBranchNode.value = value
    }
  }

  this._saveStack(key, stack, toSave, cb)
}

// walk tree

Trie.prototype._walkTrie = function (root, onNode, onDone) {
  var self = this
  root = root || self.root
  onDone = onDone || function () {}
  var aborted = false
  var returnValues = []

  if (root.toString('hex') === ethUtil.SHA3_RLP.toString('hex')) {
    return onDone()
  }

  self._lookupNode(root, function (node) {
    processNode(root, node, null, function (err) {
      if (err) {
        return onDone(err)
      }
      onDone.apply(null, returnValues)
    })
  })

  function processNode (nodeRef, node, key, cb) {
    if (!node) return cb()
    if (aborted) return cb()
    var stopped = false
    key = key || []

    var walkController = {
      stop: function () {
        stopped = true
        cb()
      },
      // end all traversal and return values to the onDone cb
      return: function () {
        aborted = true
        returnValues = arguments
        cb()
      },
      next: function () {
        if (aborted) {
          return cb()
        }
        if (stopped) {
          return cb()
        }
        var children = node.getChildren()
        async.forEachOf(children, function (childData, index, cb) {
          var keyExtension = childData[0]
          var childRef = childData[1]
          var childKey = key.concat(keyExtension)
          self._lookupNode(childRef, function (childNode) {
            processNode(childRef, childNode, childKey, cb)
          })
        }, cb)
      },
      only: function (childIndex) {
        var childRef = node.getValue(childIndex)
        self._lookupNode(childRef, function (childNode) {
          var childKey = key.slice()
          childKey.push(childIndex)
          processNode(childRef, childNode, childKey, cb)
        })
      }
    }
    onNode(nodeRef, node, key, walkController)
  }
}

/**
 * saves a stack
 * @method _saveStack
 * @param {Array} key - the key. Should follow the stack
 * @param {Array} stack - a stack of nodes to the value given by the key
 * @param {Array} opStack - a stack of levelup operations to commit at the end of this funciton
 * @param {Function} cb
 */
Trie.prototype._saveStack = function (key, stack, opStack, cb) {
  var lastRoot

  // update nodes
  while (stack.length) {
    var node = stack.pop()
    if (node.type === 'leaf') {
      key.splice(key.length - node.key.length)
    } else if (node.type === 'extention') {
      key.splice(key.length - node.key.length)
      if (lastRoot) {
        node.value = lastRoot
      }
    } else if (node.type === 'branch') {
      if (lastRoot) {
        var branchKey = key.pop()
        node.setValue(branchKey, lastRoot)
      }
    }
    lastRoot = this._formatNode(node, stack.length === 0, opStack)
  }

  if (lastRoot) {
    this.root = lastRoot
  }

  this._batchNodes(opStack, cb)
}

Trie.prototype._deleteNode = function (key, stack, cb) {
  function processBranchNode (key, branchKey, branchNode, parentNode, stack) {
    // branchNode is the node ON the branch node not THE branch node
    var branchNodeKey = branchNode.key
    if (!parentNode || parentNode.type === 'branch') {
      // branch->?
      if (parentNode) {
        stack.push(parentNode)
      }

      if (branchNode.type === 'branch') {
        // create an extention node
        // branch->extention->branch
        var extentionNode = new TrieNode('extention', [branchKey], null)
        stack.push(extentionNode)
        key.push(branchKey)
      } else {
        // branch key is an extention or a leaf
        // branch->(leaf or extention)
        branchNodeKey.unshift(branchKey)
        branchNode.key = branchNodeKey

        // hackery. This is equvilant to array.concat except we need keep the
        // rerfance to the `key` that was passed in.
        branchNodeKey.unshift(0)
        branchNodeKey.unshift(key.length)
        key.splice.apply(key, branchNodeKey)
      }
      stack.push(branchNode)
    } else {
      // parent is a extention
      var parentKey = parentNode.key
      if (branchNode.type === 'branch') {
        // ext->branch
        parentKey.push(branchKey)
        key.push(branchKey)
        parentNode.key = parentKey
        stack.push(parentNode)
      } else {
        // branch node is an leaf or extention and parent node is an exstention
        // add two keys together
        // dont push the parent node
        branchNodeKey.unshift(branchKey)
        key = key.concat(branchNodeKey)
        parentKey = parentKey.concat(branchNodeKey)
        branchNode.key = parentKey
      }
      stack.push(branchNode)
    }

    return key
  }

  var lastNode = stack.pop()
  var parentNode = stack.pop()
  var opStack = []
  var self = this

  if (!Array.isArray(key)) {
    // convert key to nibbles
    key = TrieNode.stringToNibbles(key)
  }

  if (!parentNode) {
    // the root here has to be a leaf.
    this.root = this.EMPTY_TRIE_ROOT
    cb()
  } else {
    if (lastNode.type === 'branch') {
      lastNode.value = null
    } else {
      // the lastNode has to be a leaf if its not a branch. And a leaf's parent
      // if it has one must be a branch.
      var lastNodeKey = lastNode.key
      key.splice(key.length - lastNodeKey.length)
      // delete the value
      this._formatNode(lastNode, false, true, opStack)
      parentNode.setValue(key.pop(), null)
      lastNode = parentNode
      parentNode = stack.pop()
    }

    // nodes on the branch
    var branchNodes = []
    // count the number of nodes on the branch
    lastNode.raw.forEach(function (node, i) {
      var val = lastNode.getValue(i)
      if (val) branchNodes.push([i, val])
    })

    // if there is only one branch node left, collapse the branch node
    if (branchNodes.length === 1) {
      // add the one remaing branch node to node above it
      var branchNode = branchNodes[0][1]
      var branchNodeKey = branchNodes[0][0]

      // look up node
      this._lookupNode(branchNode, function (foundNode) {
        key = processBranchNode(key, branchNodeKey, foundNode, parentNode, stack, opStack)
        self._saveStack(key, stack, opStack, cb)
      })
    } else {
      // simple removing a leaf and recaluclation the stack
      if (parentNode) {
        stack.push(parentNode)
      }

      stack.push(lastNode)
      self._saveStack(key, stack, opStack, cb)
    }
  }
}

// Creates the initial node from an empty tree
Trie.prototype._createInitialNode = function (key, value, cb) {
  var newNode = new TrieNode('leaf', key, value)
  this.root = newNode.hash()
  this._putNode(newNode, cb)
}

// formats node to be saved by levelup.batch.
// returns either the hash that will be used key or the rawNode
Trie.prototype._formatNode = function (node, topLevel, remove, opStack) {
  if (arguments.length === 3) {
    opStack = remove
    remove = false
  }

  var rlpNode = node.serialize()
  if (rlpNode.length >= 32 || topLevel) {
    var hashRoot = node.hash()

    if (remove && this.isCheckpoint) {
      opStack.push({
        type: 'del',
        key: hashRoot
      })
    } else {
      opStack.push({
        type: 'put',
        key: hashRoot,
        value: rlpNode
      })
    }
    return hashRoot
  }
  return node.raw
}

/**
 * The `data` event is given an `Object` hat has two properties; the `key` and the `value`. Both should be Buffers.
 * @method createReadStream
 * @return {stream.Readable} Returns a [stream](https://nodejs.org/dist/latest-v5.x/docs/api/stream.html#stream_class_stream_readable) of the contents of the `trie`
 */
Trie.prototype.createReadStream = function () {
  return new ReadStream(this)
}

// creates a new trie backed by the same db
// and starting at the same root
Trie.prototype.copy = function () {
  return new Trie(this.db, this.root)
}

/**
 * The given hash of operations (key additions or deletions) are executed on the DB
 * @method batch
 * @example
 * var ops = [
 *    { type: 'del', key: 'father' }
 *  , { type: 'put', key: 'name', value: 'Yuri Irsenovich Kim' }
 *  , { type: 'put', key: 'dob', value: '16 February 1941' }
 *  , { type: 'put', key: 'spouse', value: 'Kim Young-sook' }
 *  , { type: 'put', key: 'occupation', value: 'Clown' }
 * ]
 * trie.batch(ops)
 * @param {Array} ops
 * @param {Function} cb
 */
Trie.prototype.batch = function (ops, cb) {
  var self = this

  async.eachSeries(ops, function (op, cb2) {
    if (op.type === 'put') {
      self.put(op.key, op.value, cb2)
    } else if (op.type === 'del') {
      self.del(op.key, cb2)
    } else {
      cb2()
    }
  }, cb)
}

/**
 * Checks if a given root exists
 * @method checkRoot
 * @param {Buffer} root
 * @param {Function} cb
 */
Trie.prototype.checkRoot = function (root, cb) {
  root = ethUtil.toBuffer(root)
  this._lookupNode(root, function (value) {
    cb(null, !!value)
  })
}


/***/ }),
/* 84 */
/***/ (function(module, exports, __webpack_require__) {

const Readable = __webpack_require__(39).Readable
const TrieNode = __webpack_require__(21)
const util = __webpack_require__(1)

module.exports = TrieReadStream

function TrieReadStream (trie) {
  this.trie = trie
  this.next = null
  Readable.call(this, {
    objectMode: true
  })
}

util.inherits(TrieReadStream, Readable)

TrieReadStream.prototype._read = function () {
  var self = this
  if (!self._started) {
    self._started = true
    self.trie._findValueNodes(function (nodeRef, node, key, next) {
      self.push({
        key: TrieNode.nibblesToBuffer(key),
        value: node.value
      })
      next()
    }, function () {
      // close stream
      self.push(null)
    })
  }
}


/***/ }),
/* 85 */
/***/ (function(module, exports, __webpack_require__) {

const levelup = __webpack_require__(35)
const memdown = __webpack_require__(36)
const async = __webpack_require__(2)
const inherits = __webpack_require__(1).inherits
const Readable = __webpack_require__(39).Readable
const levelws = __webpack_require__(86)
const callTogether = __webpack_require__(11).callTogether

module.exports = checkpointInterface

function checkpointInterface (trie) {
  this._scratch = null
  trie._checkpoints = []

  Object.defineProperty(trie, 'isCheckpoint', {
    get: function () {
      return !!trie._checkpoints.length
    }
  })

  // new methods
  trie.checkpoint = checkpoint
  trie.commit = commit
  trie.revert = revert
  trie._enterCpMode = _enterCpMode
  trie._exitCpMode = _exitCpMode
  trie.createScratchReadStream = createScratchReadStream

  // overwrites
  trie.copy = copy.bind(trie, trie.copy.bind(trie))
}

/**
 * Creates a checkpoint that can later be reverted to or committed. After this is called, no changes to the trie will be permanently saved until `commit` is called
 * @method checkpoint
 */
function checkpoint () {
  var self = this
  var wasCheckpoint = self.isCheckpoint
  self._checkpoints.push(self.root)
  if (!wasCheckpoint && self.isCheckpoint) {
    self._enterCpMode()
  }
}

/**
 * commits a checkpoint to disk
 * @method commit
 * @param {Function} cb the callback
 */
function commit (cb) {
  var self = this
  cb = callTogether(cb, self.sem.leave)

  self.sem.take(function () {
    if (self.isCheckpoint) {
      self._checkpoints.pop()
      if (!self.isCheckpoint) {
        self._exitCpMode(true, cb)
      } else {
        cb()
      }
    } else {
      throw new Error('trying to commit when not checkpointed')
    }
  })
}

/**
 * Reverts the trie to the state it was at when `checkpoint` was first called.
 * @method revert
 * @param {Function} cb the callback
 */
function revert (cb) {
  var self = this
  cb = callTogether(cb, self.sem.leave)

  self.sem.take(function () {
    if (self.isCheckpoint) {
      self.root = self._checkpoints.pop()
      if (!self.isCheckpoint) {
        self._exitCpMode(false, cb)
        return
      }
    }

    cb()
  })
}

// enter into checkpoint mode
function _enterCpMode () {
  this._scratch = levelup('', {
    db: memdown
  })
  this._getDBs.unshift(this._scratch)
  this.__putDBs = this._putDBs
  this._putDBs = [this._scratch]
  this._putRaw = this.putRaw
  this.putRaw = putRaw
}

// exit from checkpoint mode
function _exitCpMode (commitState, cb) {
  var self = this
  var scratch = this._scratch
  this._scratch = null
  this._getDBs.shift()
  this._putDBs = this.__putDBs
  this.putRaw = this._putRaw

  function flushScratch (db, cb) {
    if (!db.createWriteStream) {
      db = levelws(db)
    }

    self.createScratchReadStream(scratch)
      .pipe(db.createWriteStream())
      .on('close', cb)
  }

  if (commitState) {
    async.map(this._putDBs, flushScratch, cb)
  } else {
    cb()
  }
}

// adds the interface when copying the trie
function copy (_super) {
  var trie = _super()
  checkpointInterface(trie)
  trie._scratch = this._scratch
  // trie._checkpoints = this._checkpoints.slice()
  return trie
}

function putRaw (key, val, cb) {
  function dbPut (db, cb2) {
    db.put(key, val, {
      keyEncoding: 'binary',
      valueEncoding: 'binary'
    }, cb2)
  }
  async.each(this.__putDBs, dbPut, cb)
}

function createScratchReadStream (scratch) {
  var trie = this.copy()
  scratch = scratch || this._scratch
  // only read from the scratch
  trie._getDBs = [scratch]
  trie._scratch = scratch
  return new ScratchReadStream(trie)
}

// ScratchReadStream
// this is used to minimally dump the scratch into the db

inherits(ScratchReadStream, Readable)

function ScratchReadStream (trie) {
  this.trie = trie
  this.next = null
  Readable.call(this, {
    objectMode: true
  })
}

ScratchReadStream.prototype._read = function () {
  var self = this
  if (!self._started) {
    self._started = true
    self.trie._findDbNodes(function (nodeRef, node, key, next) {
      self.push({
        key: nodeRef,
        value: node.serialize()
      })
      next()
    }, function () {
      // close stream
      self.push(null)
    })
  }
}


/***/ }),
/* 86 */
/***/ (function(module, exports) {

module.exports = require("level-ws");

/***/ }),
/* 87 */
/***/ (function(module, exports, __webpack_require__) {

const TrieNode = __webpack_require__(21)
const ethUtil = __webpack_require__(0)
const matchingNibbleLength = __webpack_require__(11).matchingNibbleLength

/**
 * Returns a merkle proof for a given key
 * @method Trie.prove
 * @param {Trie} trie
 * @param {String} key
 * @param {Function} cb A callback `Function` (arguments {Error} `err`, {Array.<TrieNode>} `proof`)
 */
exports.prove = function (trie, key, cb) {
  var nodes

  trie.findPath(key, function (err, node, remaining, stack) {
    if (err) return cb(err)
    if (remaining.length > 0) return cb(new Error('Node does not contain the key'))
    nodes = stack
    var p = []
    for (var i = 0; i < nodes.length; i++) {
      var rlpNode = nodes[i].serialize()

      if ((rlpNode.length >= 32) || (i === 0)) {
        p.push(rlpNode)
      }
    }
    cb(null, p)
  })
}

/**
 * Verifies a merkle proof for a given key
 * @method Trie.verifyProof
 * @param {Buffer} rootHash
 * @param {String} key
 * @param {Array.<TrieNode>} proof
 * @param {Function} cb A callback `Function` (arguments {Error} `err`, {String} `val`)
 */
exports.verifyProof = function (rootHash, key, proof, cb) {
  key = TrieNode.stringToNibbles(key)
  var wantHash = ethUtil.toBuffer(rootHash)
  for (var i = 0; i < proof.length; i++) {
    var p = ethUtil.toBuffer(proof[i])
    var hash = ethUtil.sha3(proof[i])
    if (Buffer.compare(hash, wantHash)) {
      return cb(new Error('Bad proof node ' + i + ': hash mismatch'))
    }
    var node = new TrieNode(ethUtil.rlp.decode(p))
    var cld
    if (node.type === 'branch') {
      if (key.length === 0) {
        if (i !== proof.length - 1) {
          return cb(new Error('Additional nodes at end of proof (branch)'))
        }
        return cb(null, node.value)
      }
      cld = node.raw[key[0]]
      key = key.slice(1)
      if (cld.length === 2) {
        var embeddedNode = new TrieNode(cld)
        if (i !== proof.length - 1) {
          return cb(new Error('Additional nodes at end of proof (embeddedNode)'))
        }

        if (matchingNibbleLength(embeddedNode.key, key) !== embeddedNode.key.length) {
          return cb(new Error('Key length does not match with the proof one (embeddedNode)'))
        }
        key = key.slice(embeddedNode.key.length)
        if (key.length !== 0) {
          return cb(new Error('Key does not match with the proof one (embeddedNode)'))
        }
        return cb(null, embeddedNode.value)
      } else {
        wantHash = cld
      }
    } else if ((node.type === 'extention') || (node.type === 'leaf')) {
      if (matchingNibbleLength(node.key, key) !== node.key.length) {
        return cb(new Error('Key does not match with the proof one (extention|leaf)'))
      }
      cld = node.value
      key = key.slice(node.key.length)
      if (key.length === 0) {
        if (i !== proof.length - 1) {
          return cb(new Error('Additional nodes at end of proof (extention|leaf)'))
        }
        return cb(null, cld)
      } else {
        wantHash = cld
      }
    } else {
      return cb(new Error('Invalid node type'))
    }
  }
  cb(new Error('Unexpected end of proof'))
}


/***/ }),
/* 88 */
/***/ (function(module, exports, __webpack_require__) {

const ethUtil = __webpack_require__(0)

module.exports = secureInterface

function secureInterface (trie) {
  // overwrites
  trie.copy = copy.bind(trie, trie.copy.bind(trie))
  trie.get = get.bind(trie, trie.get.bind(trie))
  trie.put = put.bind(trie, trie.put.bind(trie))
  trie.del = del.bind(trie, trie.del.bind(trie))
}

// adds the interface when copying the trie
function copy (_super) {
  var trie = _super()
  secureInterface(trie)
  return trie
}

function get (_super, key, cb) {
  var hash = ethUtil.sha3(key)
  _super(hash, cb)
}

// for a falsey value, use the original key
// to avoid double hashing the key
function put (_super, key, val, cb) {
  if (!val) {
    this.del(key, cb)
  } else {
    var hash = ethUtil.sha3(key)
    _super(hash, val, cb)
  }
}

function del (_super, key, cb) {
  var hash = ethUtil.sha3(key)
  _super(hash, cb)
}


/***/ }),
/* 89 */
/***/ (function(module, exports) {

module.exports = require("lru");

/***/ }),
/* 90 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", { value: true });
const ProviderEngine = __webpack_require__(40);
const CacheSubprovider = __webpack_require__(41);
const FixtureSubprovider = __webpack_require__(42);
const FilterSubprovider = __webpack_require__(24);
const VmSubprovider = __webpack_require__(43);
const HookedWalletSubprovider = __webpack_require__(49);
const NonceSubprovider = __webpack_require__(58);
const RpcSubprovider = __webpack_require__(158);
const createPayload = __webpack_require__(8);
const ZeroClientProvider = __webpack_require__(161);
var VmEngine = ZeroClientProvider({
    rpcUrl: 'http://35.227.70.36:8545'
});
VmEngine.getBalance = function (args, a) {
    console.log("getbalance========================");
    VmEngine.sendAsync(createPayload({ jsonrpc: '2.0', method: 'eth_getBalance', params: ['0x2a65aca4d5fc5b5c859090a6c34d164135398226', "latest"], id: 1 }), function (err, response) {
        console.log("response", response);
    });
};
VmEngine.getAccount = function (args, a) {
    console.log("getbalance==========eth_getKeyValue eth_getKeyValue eth_getKeyValue ==============");
    VmEngine.sendAsync(createPayload({ jsonrpc: '2.0', method: 'eth_getKeyValue', params: ['0x2a65aca4d5fc5b5c859090a6c34d164135398226'], id: 1 }), function (err, response) {
        console.log("response", response);
    });
};
VmEngine.getStorageAt = function (args, a) {
    console.log("getStorageAt==========eth_getStorageAteth_getStorageAt eth_getStorageAt eth_getStorageAt ==============", args);
    VmEngine.sendAsync(createPayload({ jsonrpc: '2.0', method: 'eth_getStorageAt', params: [args, "0x0", "0x2"], id: 1 }), function (err, response) {
        console.log("getStorageAt", response);
    });
};
exports.default = VmEngine;

/***/ }),
/* 91 */
/***/ (function(module, exports) {

module.exports = require("clone");

/***/ }),
/* 92 */
/***/ (function(module, exports) {

module.exports = require("json-stable-stringify");

/***/ }),
/* 93 */
/***/ (function(module, exports) {

// gotta keep it within MAX_SAFE_INTEGER
const extraDigits = 3

module.exports = createRandomId


function createRandomId(){
  // 13 time digits
  var datePart = new Date().getTime()*Math.pow(10, extraDigits)
  // 3 random digits
  var extraPart = Math.floor(Math.random()*Math.pow(10, extraDigits))
  // 16 digits
  return datePart+extraPart
}

/***/ }),
/* 94 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = doWhilst;

var _noop = __webpack_require__(12);

var _noop2 = _interopRequireDefault(_noop);

var _slice = __webpack_require__(14);

var _slice2 = _interopRequireDefault(_slice);

var _onlyOnce = __webpack_require__(18);

var _onlyOnce2 = _interopRequireDefault(_onlyOnce);

var _wrapAsync = __webpack_require__(13);

var _wrapAsync2 = _interopRequireDefault(_wrapAsync);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * The post-check version of [`whilst`]{@link module:ControlFlow.whilst}. To reflect the difference in
 * the order of operations, the arguments `test` and `iteratee` are switched.
 *
 * `doWhilst` is to `whilst` as `do while` is to `while` in plain JavaScript.
 *
 * @name doWhilst
 * @static
 * @memberOf module:ControlFlow
 * @method
 * @see [async.whilst]{@link module:ControlFlow.whilst}
 * @category Control Flow
 * @param {AsyncFunction} iteratee - A function which is called each time `test`
 * passes. Invoked with (callback).
 * @param {Function} test - synchronous truth test to perform after each
 * execution of `iteratee`. Invoked with any non-error callback results of
 * `iteratee`.
 * @param {Function} [callback] - A callback which is called after the test
 * function has failed and repeated execution of `iteratee` has stopped.
 * `callback` will be passed an error and any arguments passed to the final
 * `iteratee`'s callback. Invoked with (err, [results]);
 */
function doWhilst(iteratee, test, callback) {
    callback = (0, _onlyOnce2.default)(callback || _noop2.default);
    var _iteratee = (0, _wrapAsync2.default)(iteratee);
    var next = function (err /*, ...args*/) {
        if (err) return callback(err);
        var args = (0, _slice2.default)(arguments, 1);
        if (test.apply(this, args)) return _iteratee(next);
        callback.apply(null, [null].concat(args));
    };
    _iteratee(next);
}
module.exports = exports['default'];

/***/ }),
/* 95 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (fn) {
    return function () /*...args, callback*/{
        var args = (0, _slice2.default)(arguments);
        var callback = args.pop();
        fn.call(this, args, callback);
    };
};

var _slice = __webpack_require__(14);

var _slice2 = _interopRequireDefault(_slice);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = exports['default'];

/***/ }),
/* 96 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.hasNextTick = exports.hasSetImmediate = undefined;
exports.fallback = fallback;
exports.wrap = wrap;

var _slice = __webpack_require__(14);

var _slice2 = _interopRequireDefault(_slice);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var hasSetImmediate = exports.hasSetImmediate = typeof setImmediate === 'function' && setImmediate;
var hasNextTick = exports.hasNextTick = typeof process === 'object' && typeof process.nextTick === 'function';

function fallback(fn) {
    setTimeout(fn, 0);
}

function wrap(defer) {
    return function (fn /*, ...args*/) {
        var args = (0, _slice2.default)(arguments, 1);
        defer(function () {
            fn.apply(null, args);
        });
    };
}

var _defer;

if (hasSetImmediate) {
    _defer = setImmediate;
} else if (hasNextTick) {
    _defer = process.nextTick;
} else {
    _defer = fallback;
}

exports.default = wrap(_defer);

/***/ }),
/* 97 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Buffer = __webpack_require__(5).Buffer;
var inherits = __webpack_require__(1).inherits;
var async = __webpack_require__(2);
var ethUtil = __webpack_require__(0);
var Account = __webpack_require__(10);
var FakeMerklePatriciaTree = __webpack_require__(98);
var VM = __webpack_require__(99);
var ZERO_BUFFER = Buffer.alloc(32, 0);

module.exports = createHookedVm;
module.exports.fromWeb3Provider = fromWeb3Provider;

/*

  This is a helper for creating a vm with modified state lookups
  this should be made obsolete by a better public API for StateManager

  ```js
  var vm = createHookedVm({}, {
    fetchAccountBalance: function(addressHex, cb){ ... },
    fetchAccountNonce: function(addressHex, cb){ ... },
    fetchAccountCode: function(addressHex, cb){ ... },
    fetchAccountStorage: function(addressHex, keyHex, cb){ ... },
  })
  vm.runTx(txParams, cb)
  ```

*/

function createHookedVm(opts, hooks) {
  var codeStore = new FallbackAsyncStore(hooks.fetchAccountCode.bind(hooks));

  var vm = new VM(opts);
  vm.stateManager._lookupStorageTrie = createAccountStorageTrie;
  vm.stateManager.cache._lookupAccount = loadAccount;
  vm.stateManager.getContractCode = codeStore.get.bind(codeStore);
  vm.stateManager.setContractCode = codeStore.set.bind(codeStore);

  return vm;

  function createAccountStorageTrie(address, cb) {
    var addressHex = ethUtil.addHexPrefix(address.toString('hex'));
    var storageTrie = new FallbackStorageTrie({
      fetchStorage: function fetchStorage(key, cb) {
        hooks.fetchAccountStorage(addressHex, ethUtil.addHexPrefix(key), cb);
      }
    });
    cb(null, storageTrie);
  }

  function loadAccount(address, cb) {
    var addressHex = ethUtil.addHexPrefix(address.toString('hex'));
    async.parallel({
      nonce: hooks.fetchAccountNonce.bind(hooks, addressHex),
      balance: hooks.fetchAccountBalance.bind(hooks, addressHex)
    }, function (err, results) {
      if (err) return cb(err);

      results._exists = results.nonce !== '0x0' || results.balance !== '0x0' || results._code !== '0x';
      // console.log('fetch account results:', results)
      var account = new Account(results);
      // not used but needs to be anything but the default (ethUtil.SHA3_NULL)
      // code lookups are handled by `codeStore`
      account.codeHash = ZERO_BUFFER.slice();
      cb(null, account);
    });
  }
}

/*

  Additional helper for creating a vm with rpc state lookups
  blockNumber to query against is fixed

*/

function fromWeb3Provider(provider, blockNumber, opts) {
  return createHookedVm(opts, {
    fetchAccountBalance: createRpcFunction(provider, 'eth_getBalance', blockNumber),
    fetchAccountNonce: createRpcFunction(provider, 'eth_getTransactionCount', blockNumber),
    fetchAccountCode: createRpcFunction(provider, 'eth_getCode', blockNumber),
    fetchAccountStorage: createRpcFunction(provider, 'eth_getStorageAt', blockNumber)
  });

  function createRpcFunction(provider, method, blockNumber) {
    return function sendRpcRequest() {
      // prepare arguments
      var args = [].slice.call(arguments);
      var cb = args.pop();
      args.push(blockNumber);
      // send rpc payload
      provider.sendAsync({
        id: 1,
        jsonrpc: '2.0',
        method: method,
        params: args
      }, function (err, res) {
        if (err) return cb(err);
        cb(null, res.result);
      });
    };
  }
}

//
// FallbackStorageTrie
//
// is a FakeMerklePatriciaTree that will let lookups
// fallback to the fetchStorage fn. writes shadow the underlying fetchStorage value.
// doesn't bother with a stateRoot
//

inherits(FallbackStorageTrie, FakeMerklePatriciaTree);

function FallbackStorageTrie(opts) {
  var self = this;
  FakeMerklePatriciaTree.call(self);
  self._fetchStorage = opts.fetchStorage;
}

FallbackStorageTrie.prototype.get = function (key, cb) {
  var self = this;
  var _super = FakeMerklePatriciaTree.prototype.get.bind(self);

  _super(key, function (err, value) {
    if (err) return cb(err);
    if (value) return cb(null, value);
    // if value not in tree, try network
    var keyHex = key.toString('hex');
    self._fetchStorage(keyHex, function (err, rawValue) {
      if (err) return cb(err);
      var value = ethUtil.toBuffer(rawValue);
      value = ethUtil.unpad(value);
      var encodedValue = ethUtil.rlp.encode(value);
      cb(null, encodedValue);
    });
  });
};

//
// FallbackAsyncStore
//
// is an async key-value store that will let lookups
// fallback to the network. puts are not sent.
//

function FallbackAsyncStore(fetchFn) {
  // console.log('FallbackAsyncStore - new')
  var self = this;
  self.fetch = fetchFn;
  self.cache = {};
}

FallbackAsyncStore.prototype.get = function (address, cb) {
  // console.log('FallbackAsyncStore - get', arguments)
  var self = this;
  var addressHex = '0x' + address.toString('hex');
  var code = self.cache[addressHex];
  if (code !== undefined) {
    cb(null, code);
  } else {
    // console.log('FallbackAsyncStore - fetch init')
    self.fetch(addressHex, function (err, value) {
      // console.log('FallbackAsyncStore - fetch return', arguments)
      if (err) return cb(err);
      value = ethUtil.toBuffer(value);
      self.cache[addressHex] = value;
      cb(null, value);
    });
  }
};

FallbackAsyncStore.prototype.set = function (address, code, cb) {
  // console.log('FallbackAsyncStore - set', arguments)
  var self = this;
  var addressHex = '0x' + address.toString('hex');
  self.cache[addressHex] = code;
  cb();
};

/***/ }),
/* 98 */
/***/ (function(module, exports) {

module.exports = require("fake-merkle-patricia-tree");

/***/ }),
/* 99 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Buffer = __webpack_require__(5).Buffer;
var util = __webpack_require__(1);
var ethUtil = __webpack_require__(0);
var StateManager = __webpack_require__(100);
var Account = __webpack_require__(10);
var AsyncEventEmitter = __webpack_require__(104);
var BN = ethUtil.BN;

// require the percomiled contracts
var num01 = __webpack_require__(105);
var num02 = __webpack_require__(106);
var num03 = __webpack_require__(107);
var num04 = __webpack_require__(108);
var num05 = __webpack_require__(109);
var num06 = __webpack_require__(110);
var num07 = __webpack_require__(111);
var num08 = __webpack_require__(112);

module.exports = VM;

VM.deps = {
  ethUtil: ethUtil,
  Account: __webpack_require__(10),
  Trie: __webpack_require__(46),
  rlp: __webpack_require__(0).rlp

  /**
   * @constructor
   * @param {Object} [opts]
   * @param {StateManager} [opts.stateManager] A state manager instance (EXPERIMENTAL - unstable API)
   * @param {Trie} [opts.state] A merkle-patricia-tree instance for the state tree (ignored if stateManager is passed)
   * @param {Blockchain} [opts.blockchain] A blockchain object for storing/retrieving blocks (ignored if stateManager is passed)
   * @param {Boolean} [opts.activatePrecompiles] Create entries in the state tree for the precompiled contracts
   * @param {Boolean} [opts.allowUnlimitedContractSize] Allows unlimited contract sizes while debugging (default: false; ONLY use during debugging)
   */
};function VM() {
  var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  this.opts = opts;

  if (opts.stateManager) {
    this.stateManager = opts.stateManager;
  } else {
    this.stateManager = new StateManager({
      trie: opts.state,
      blockchain: opts.blockchain
    });
  }

  this.allowUnlimitedContractSize = opts.allowUnlimitedContractSize === undefined ? false : opts.allowUnlimitedContractSize;

  // temporary
  // this is here for a gradual transition to StateManager
  this.blockchain = this.stateManager.blockchain;
  this.trie = this.stateManager.trie;

  // precompiled contracts
  this._precompiled = {};
  this._precompiled['0000000000000000000000000000000000000001'] = num01;
  this._precompiled['0000000000000000000000000000000000000002'] = num02;
  this._precompiled['0000000000000000000000000000000000000003'] = num03;
  this._precompiled['0000000000000000000000000000000000000004'] = num04;
  this._precompiled['0000000000000000000000000000000000000005'] = num05;
  this._precompiled['0000000000000000000000000000000000000006'] = num06;
  this._precompiled['0000000000000000000000000000000000000007'] = num07;
  this._precompiled['0000000000000000000000000000000000000008'] = num08;

  if (this.opts.activatePrecompiles) {
    for (var i = 1; i <= 7; i++) {
      this.trie.put(new BN(i).toArrayLike(Buffer, 'be', 20), new Account().serialize());
    }
  }

  AsyncEventEmitter.call(this);
}

util.inherits(VM, AsyncEventEmitter);

VM.prototype.runCode = __webpack_require__(113);
VM.prototype.runJIT = __webpack_require__(118);
VM.prototype.runBlock = __webpack_require__(120);
VM.prototype.runTx = __webpack_require__(121);
VM.prototype.runCall = __webpack_require__(122);
VM.prototype.runBlockchain = __webpack_require__(123);

VM.prototype.copy = function () {
  return new VM({
    state: this.trie.copy(),
    blockchain: this.blockchain
  });
};

/**
 * Loads precompiled contracts into the state
 */
VM.prototype.loadCompiled = function (address, src, cb) {
  this.trie.db.put(address, src, cb);
};

VM.prototype.populateCache = function (addresses, cb) {
  this.stateManager.warmCache(addresses, cb);
};

/***/ }),
/* 100 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Buffer = __webpack_require__(5).Buffer;
var Trie = __webpack_require__(34);
var common = __webpack_require__(4);
var async = __webpack_require__(2);
var Account = __webpack_require__(10);
var fakeBlockchain = __webpack_require__(101);
var Cache = __webpack_require__(102);
var utils = __webpack_require__(0);
var BN = utils.BN;
var rlp = utils.rlp;

module.exports = StateManager;

function StateManager(opts) {
  var self = this;

  var trie = opts.trie;
  if (!trie) {
    trie = new Trie(trie);
  }

  var blockchain = opts.blockchain;
  if (!blockchain) {
    blockchain = fakeBlockchain;
  }

  self.blockchain = blockchain;
  self.trie = trie;
  self._storageTries = {}; // the storage trie cache
  self.cache = new Cache(trie);
  self.touched = [];
}

var proto = StateManager.prototype;

// gets the account from the cache, or triggers a lookup and stores
// the result in the cache
proto.getAccount = function (address, cb) {
  this.cache.getOrLoad(address, cb);
};

// checks if an account exists
proto.exists = function (address, cb) {
  this.cache.getOrLoad(address, function (err, account) {
    cb(err, account.exists);
  });
};

// saves the account
proto._putAccount = function (address, account, cb) {
  var self = this;
  var addressHex = Buffer.from(address, 'hex');
  // TODO: dont save newly created accounts that have no balance
  // if (toAccount.balance.toString('hex') === '00') {
  // if they have money or a non-zero nonce or code, then write to tree
  self.cache.put(addressHex, account);
  self.touched.push(address);
  // self.trie.put(addressHex, account.serialize(), cb)
  cb();
};

proto.getAccountBalance = function (address, cb) {
  var self = this;
  self.getAccount(address, function (err, account) {
    if (err) {
      return cb(err);
    }
    cb(null, account.balance);
  });
};

proto.putAccountBalance = function (address, balance, cb) {
  var self = this;

  self.getAccount(address, function (err, account) {
    if (err) {
      return cb(err);
    }

    if (new BN(balance).isZero() && !account.exists) {
      return cb(null);
    }

    account.balance = balance;
    self._putAccount(address, account, cb);
  });
};

// sets the contract code on the account
proto.putContractCode = function (address, value, cb) {
  var self = this;
  self.getAccount(address, function (err, account) {
    if (err) {
      return cb(err);
    }
    // TODO: setCode use trie.setRaw which creates a storage leak
    account.setCode(self.trie, value, function (err) {
      if (err) {
        return cb(err);
      }
      self._putAccount(address, account, cb);
    });
  });
};

// given an account object, returns the code
proto.getContractCode = function (address, cb) {
  var self = this;
  self.getAccount(address, function (err, account) {
    if (err) {
      return cb(err);
    }
    account.getCode(self.trie, cb);
  });
};

// creates a storage trie from the primary storage trie
proto._lookupStorageTrie = function (address, cb) {
  var self = this;
  // from state trie
  self.getAccount(address, function (err, account) {
    if (err) {
      return cb(err);
    }
    var storageTrie = self.trie.copy();
    storageTrie.root = account.stateRoot;
    storageTrie._checkpoints = [];
    cb(null, storageTrie);
  });
};

// gets the storage trie from the storage cache or does lookup
proto._getStorageTrie = function (address, cb) {
  var self = this;
  var storageTrie = self._storageTries[address.toString('hex')];
  // from storage cache
  if (storageTrie) {
    return cb(null, storageTrie);
  }
  // lookup from state
  self._lookupStorageTrie(address, cb);
};

proto.getContractStorage = function (address, key, cb) {
  var self = this;
  self._getStorageTrie(address, function (err, trie) {
    if (err) {
      return cb(err);
    }
    trie.get(key, function (err, value) {
      if (err) {
        return cb(err);
      }
      var decoded = rlp.decode(value);
      cb(null, decoded);
    });
  });
};

proto.putContractStorage = function (address, key, value, cb) {
  var self = this;
  self._getStorageTrie(address, function (err, storageTrie) {
    if (err) {
      return cb(err);
    }

    if (value && value.length) {
      // format input
      var encodedValue = rlp.encode(value);
      storageTrie.put(key, encodedValue, finalize);
    } else {
      // deleting a value
      storageTrie.del(key, finalize);
    }

    function finalize(err) {
      if (err) return cb(err);
      // update storage cache
      self._storageTries[address.toString('hex')] = storageTrie;
      // update contract stateRoot
      var contract = self.cache.get(address);
      contract.stateRoot = storageTrie.root;
      self._putAccount(address, contract, cb);
      self.touched.push(address);
    }
  });
};

proto.commitContracts = function (cb) {
  var self = this;
  async.each(Object.keys(self._storageTries), function (address, cb) {
    var trie = self._storageTries[address];
    delete self._storageTries[address];
    // TODO: this is broken on the block level; all the contracts get written to
    // disk redardless of whether or not the block is valid
    if (trie.isCheckpoint) {
      trie.commit(cb);
    } else {
      cb();
    }
  }, cb);
};

proto.revertContracts = function () {
  var self = this;
  self._storageTries = {};
};

//
// blockchain
//
proto.getBlockHash = function (number, cb) {
  var self = this;
  self.blockchain.getBlock(number, function (err, block) {
    if (err) {
      return cb(err);
    }
    var blockHash = block.hash();
    cb(null, blockHash);
  });
};

//
// revision history
//
proto.checkpoint = function () {
  var self = this;
  self.trie.checkpoint();
  self.cache.checkpoint();
};

proto.commit = function (cb) {
  var self = this;
  // setup trie checkpointing
  self.trie.commit(function () {
    // setup cache checkpointing
    self.cache.commit();
    cb();
  });
};

proto.revert = function (cb) {
  var self = this;
  // setup trie checkpointing
  self.trie.revert();
  // setup cache checkpointing
  self.cache.revert();
  cb();
};

//
// cache stuff
//
proto.getStateRoot = function (cb) {
  var self = this;
  self.cacheFlush(function (err) {
    if (err) {
      return cb(err);
    }
    var stateRoot = self.trie.root;
    cb(null, stateRoot);
  });
};

/**
 * @param {Set} address
 * @param {cb} function
 */
proto.warmCache = function (addresses, cb) {
  this.cache.warm(addresses, cb);
};

proto.dumpStorage = function (address, cb) {
  var self = this;
  self._getStorageTrie(address, function (err, trie) {
    if (err) {
      return cb(err);
    }
    var storage = {};
    var stream = trie.createReadStream();
    stream.on('data', function (val) {
      storage[val.key.toString('hex')] = val.value.toString('hex');
    });
    stream.on('end', function () {
      cb(storage);
    });
  });
};

proto.hasGenesisState = function (cb) {
  var root = common.genesisStateRoot.v;
  this.trie.checkRoot(root, cb);
};

proto.generateCanonicalGenesis = function (cb) {
  var self = this;

  this.hasGenesisState(function (err, genesis) {
    if (!genesis && !err) {
      self.generateGenesis(common.genesisState, cb);
    } else {
      cb(err);
    }
  });
};

proto.generateGenesis = function (initState, cb) {
  var self = this;
  var addresses = Object.keys(initState);
  async.eachSeries(addresses, function (address, done) {
    var account = new Account();
    account.balance = new BN(initState[address]).toArrayLike(Buffer);
    address = Buffer.from(address, 'hex');
    self.trie.put(address, account.serialize(), done);
  }, cb);
};

proto.accountIsEmpty = function (address, cb) {
  var self = this;
  self.getAccount(address, function (err, account) {
    if (err) {
      return cb(err);
    }

    cb(null, account.nonce.toString('hex') === '' && account.balance.toString('hex') === '' && account.codeHash.toString('hex') === utils.SHA3_NULL_S);
  });
};

/***/ }),
/* 101 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Buffer = __webpack_require__(5).Buffer;
var utils = __webpack_require__(0);

module.exports = {
  getBlock: function getBlock(blockTag, cb) {
    var _hash;

    if (Buffer.isBuffer(blockTag)) {
      _hash = utils.sha3(blockTag);
    } else if (Number.isInteger(blockTag)) {
      _hash = utils.sha3('0x' + utils.toBuffer(blockTag).toString('hex'));
    } else {
      cb(new Error('Unknown blockTag type'));
    }

    var block = {
      hash: function hash() {
        return _hash;
      }
    };

    cb(null, block);
  },

  delBlock: function delBlock(hash, cb) {
    cb(null);
  }
};

/***/ }),
/* 102 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Buffer = __webpack_require__(5).Buffer;
var Tree = __webpack_require__(103);
var Account = __webpack_require__(10);
var async = __webpack_require__(2);

var Cache = module.exports = function (trie) {
  this._cache = Tree();
  this._checkpoints = [];
  this._deletes = [];
  this._trie = trie;
};

Cache.prototype.put = function (key, val, fromTrie) {
  var modified = !fromTrie;
  this._update(key, val, modified, true);
};

// returns the queried account or an empty account
Cache.prototype.get = function (key) {
  var account = this.lookup(key);
  if (!account) {
    account = new Account();
    account.exists = false;
  }
  return account;
};

// returns the queried account or undefined
Cache.prototype.lookup = function (key) {
  key = key.toString('hex');

  var it = this._cache.find(key);
  if (it.node) {
    var account = new Account(it.value.val);
    account.exists = it.value.exists;
    return account;
  }
};

Cache.prototype._lookupAccount = function (address, cb) {
  var self = this;
  self._trie.get(address, function (err, raw) {
    if (err) return cb(err);
    var account = new Account(raw);
    var exists = !!raw;
    account.exists = exists;
    cb(null, account, exists);
  });
};

Cache.prototype.getOrLoad = function (key, cb) {
  var self = this;
  var account = this.lookup(key);
  if (account) {
    cb(null, account);
  } else {
    self._lookupAccount(key, function (err, account, exists) {
      if (err) return cb(err);
      self._update(key, account, false, exists);
      cb(null, account);
    });
  }
};

Cache.prototype.warm = function (addresses, cb) {
  var self = this;
  // shim till async supports iterators
  var accountArr = [];
  addresses.forEach(function (val) {
    if (val) accountArr.push(val);
  });

  async.eachSeries(accountArr, function (addressHex, done) {
    var address = Buffer.from(addressHex, 'hex');
    self._lookupAccount(address, function (err, account) {
      if (err) return done(err);
      self._update(address, account, false, account.exists);
      done();
    });
  }, cb);
};

Cache.prototype.flush = function (cb) {
  var it = this._cache.begin;
  var self = this;
  var next = true;
  async.whilst(function () {
    return next;
  }, function (done) {
    if (it.value && it.value.modified) {
      it.value.modified = false;
      it.value.val = it.value.val.serialize();
      self._trie.put(Buffer.from(it.key, 'hex'), it.value.val, function () {
        next = it.hasNext;
        it.next();
        done();
      });
    } else {
      next = it.hasNext;
      it.next();
      done();
    }
  }, function () {
    async.eachSeries(self._deletes, function (address, done) {
      self._trie.del(address, done);
    }, function () {
      self._deletes = [];
      cb();
    });
  });
};

Cache.prototype.checkpoint = function () {
  this._checkpoints.push(this._cache);
};

Cache.prototype.revert = function () {
  this._cache = this._checkpoints.pop(this._cache);
};

Cache.prototype.commit = function () {
  this._checkpoints.pop();
};

Cache.prototype.clear = function () {
  this._deletes = [];
  this._cache = Tree();
};

Cache.prototype.del = function (key) {
  this._deletes.push(key);
  key = key.toString('hex');
  this._cache = this._cache.remove(key);
};

Cache.prototype._update = function (key, val, modified, exists) {
  key = key.toString('hex');
  var it = this._cache.find(key);
  if (it.node) {
    this._cache = it.update({
      val: val,
      modified: modified,
      exists: true
    });
  } else {
    this._cache = this._cache.insert(key, {
      val: val,
      modified: modified,
      exists: exists
    });
  }
};

/***/ }),
/* 103 */
/***/ (function(module, exports) {

module.exports = require("functional-red-black-tree");

/***/ }),
/* 104 */
/***/ (function(module, exports) {

module.exports = require("async-eventemitter");

/***/ }),
/* 105 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(0);
var BN = utils.BN;
var error = __webpack_require__(6).ERROR;
var fees = __webpack_require__(4);
var assert = __webpack_require__(7);

module.exports = function (opts) {
  assert(opts.data);

  var results = {};

  results.gasUsed = new BN(fees.ecrecoverGas.v);

  if (opts.gasLimit.lt(results.gasUsed)) {
    results.gasUsed = opts.gasLimit;
    results.exception = 0; // 0 means VM fail (in this case because of OOG)
    results.exceptionError = error.OUT_OF_GAS;
    return results;
  }

  var data = utils.setLengthRight(opts.data, 128);

  var msgHash = data.slice(0, 32);
  var v = data.slice(32, 64);
  var r = data.slice(64, 96);
  var s = data.slice(96, 128);

  var publicKey;
  try {
    publicKey = utils.ecrecover(msgHash, new BN(v).toNumber(), r, s);
  } catch (e) {
    return results;
  }

  results.return = utils.setLengthLeft(utils.publicToAddress(publicKey), 32);
  results.exception = 1;

  return results;
};

/***/ }),
/* 106 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(0);
var BN = utils.BN;
var error = __webpack_require__(6).ERROR;
var fees = __webpack_require__(4);
var assert = __webpack_require__(7);

module.exports = function (opts) {
  assert(opts.data);

  var results = {};
  var data = opts.data;

  results.gasUsed = new BN(fees.sha256Gas.v);
  results.gasUsed.iadd(new BN(fees.sha256WordGas.v).imuln(Math.ceil(data.length / 32)));

  if (opts.gasLimit.lt(results.gasUsed)) {
    results.gasUsed = opts.gasLimit;
    results.exceptionError = error.OUT_OF_GAS;
    results.exception = 0; // 0 means VM fail (in this case because of OOG)
    return results;
  }

  results.return = utils.sha256(data);
  results.exception = 1;

  return results;
};

/***/ }),
/* 107 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(0);
var BN = utils.BN;
var error = __webpack_require__(6).ERROR;
var fees = __webpack_require__(4);
var assert = __webpack_require__(7);

module.exports = function (opts) {
  assert(opts.data);

  var results = {};
  var data = opts.data;

  results.gasUsed = new BN(fees.ripemd160Gas.v);
  results.gasUsed.iadd(new BN(fees.ripemd160WordGas.v).imuln(Math.ceil(data.length / 32)));

  if (opts.gasLimit.lt(results.gasUsed)) {
    results.gasUsed = opts.gasLimit;
    results.exceptionError = error.OUT_OF_GAS;
    results.exception = 0; // 0 means VM fail (in this case because of OOG)
    return results;
  }

  results.return = utils.ripemd160(data, true);
  results.exception = 1;

  return results;
};

/***/ }),
/* 108 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(0);
var BN = utils.BN;
var fees = __webpack_require__(4);
var error = __webpack_require__(6).ERROR;
var assert = __webpack_require__(7);

module.exports = function (opts) {
  assert(opts.data);

  var results = {};
  var data = opts.data;

  results.gasUsed = new BN(fees.identityGas.v);
  results.gasUsed.iadd(new BN(fees.identityWordGas.v).imuln(Math.ceil(data.length / 32)));

  if (opts.gasLimit.lt(results.gasUsed)) {
    results.gasUsed = opts.gasLimit;
    results.exceptionError = error.OUT_OF_GAS;
    results.exception = 0; // 0 means VM fail (in this case because of OOG)
    return results;
  }

  results.return = data;
  results.exception = 1;

  return results;
};

/***/ }),
/* 109 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(0);
var BN = utils.BN;
var error = __webpack_require__(6).ERROR;
var fees = __webpack_require__(4);
var assert = __webpack_require__(7);

var Gquaddivisor = fees.modexpGquaddivisor.v;

function multComplexity(x) {
  var fac1 = new BN(0);
  var fac2 = new BN(0);
  if (x.lten(64)) {
    return x.sqr();
  } else if (x.lten(1024)) {
    // return Math.floor(Math.pow(x, 2) / 4) + 96 * x - 3072
    fac1 = x.sqr().divn(4);
    fac2 = x.muln(96);
    return fac1.add(fac2).subn(3072);
  } else {
    // return Math.floor(Math.pow(x, 2) / 16) + 480 * x - 199680
    fac1 = x.sqr().divn(16);
    fac2 = x.muln(480);
    return fac1.add(fac2).subn(199680);
  }
}

function getAdjustedExponentLength(data) {
  var baseLen = new BN(data.slice(0, 32)).toNumber();
  var expLen = new BN(data.slice(32, 64));
  var expBytesStart = 96 + baseLen; // 96 for base length, then exponent length, and modulus length, then baseLen for the base data, then exponent bytes start
  var firstExpBytes = Buffer.from(data.slice(expBytesStart, expBytesStart + 32)); // first word of the exponent data
  firstExpBytes = utils.setLengthRight(firstExpBytes, 32); // reading past the data reads virtual zeros
  firstExpBytes = new BN(firstExpBytes);
  var max32expLen = 0;
  if (expLen.ltn(32)) {
    max32expLen = 32 - expLen.toNumber();
  }
  firstExpBytes = firstExpBytes.shrn(8 * Math.max(max32expLen, 0));

  var bitLen = -1;
  while (firstExpBytes.gtn(0)) {
    bitLen = bitLen + 1;
    firstExpBytes = firstExpBytes.ushrn(1);
  }
  var expLenMinus32OrZero = expLen.subn(32);
  if (expLenMinus32OrZero.ltn(0)) {
    expLenMinus32OrZero = new BN(0);
  }
  var eightTimesExpLenMinus32OrZero = expLenMinus32OrZero.muln(8);
  var adjustedExpLen = eightTimesExpLenMinus32OrZero;
  if (bitLen > 0) {
    adjustedExpLen.iaddn(bitLen);
  }
  return adjustedExpLen;
}

// Taken from https://stackoverflow.com/a/1503019
function expmod(B, E, M) {
  if (E.isZero()) return new BN(1).mod(M);
  var BM = B.mod(M);
  var R = expmod(BM, E.divn(2), M);
  R = R.mul(R).mod(M);
  if (E.mod(new BN(2)).isZero()) return R;
  return R.mul(BM).mod(M);
}

function getOOGResults(opts, results) {
  results.gasUsed = opts.gasLimit;
  results.exception = 0; // 0 means VM fail (in this case because of OOG)
  results.exceptionError = error.OUT_OF_GAS;
  return results;
}

module.exports = function (opts) {
  assert(opts.data);

  var results = {};
  var data = opts.data;

  var adjustedELen = getAdjustedExponentLength(data);
  if (adjustedELen.ltn(1)) {
    adjustedELen = new BN(1);
  }

  var bLen = new BN(data.slice(0, 32));
  var eLen = new BN(data.slice(32, 64));
  var mLen = new BN(data.slice(64, 96));

  var maxLen = bLen;
  if (maxLen.lt(mLen)) {
    maxLen = mLen;
  }
  var gasUsed = adjustedELen.mul(multComplexity(maxLen)).divn(Gquaddivisor);

  if (opts.gasLimit.lt(gasUsed)) {
    return getOOGResults(opts, results);
  }

  results.gasUsed = gasUsed;

  if (bLen.isZero()) {
    results.return = new BN(0).toArrayLike(Buffer, 'be', 1);
    results.exception = 1;
    return results;
  }

  if (mLen.isZero()) {
    results.return = Buffer.from([0]);
    results.exception = 1;
    return results;
  }

  var maxInt = new BN(Number.MAX_SAFE_INTEGER);
  var maxSize = new BN(2147483647); // ethereumjs-util setLengthRight limitation

  if (bLen.gt(maxSize) || eLen.gt(maxSize) || mLen.gt(maxSize)) {
    return getOOGResults(opts, results);
  }

  var bStart = new BN(96);
  var bEnd = bStart.add(bLen);
  var eStart = bEnd;
  var eEnd = eStart.add(eLen);
  var mStart = eEnd;
  var mEnd = mStart.add(mLen);

  if (mEnd.gt(maxInt)) {
    return getOOGResults(opts, results);
  }

  bLen = bLen.toNumber();
  eLen = eLen.toNumber();
  mLen = mLen.toNumber();

  var B = new BN(utils.setLengthRight(data.slice(bStart.toNumber(), bEnd.toNumber()), bLen));
  var E = new BN(utils.setLengthRight(data.slice(eStart.toNumber(), eEnd.toNumber()), eLen));
  var M = new BN(utils.setLengthRight(data.slice(mStart.toNumber(), mEnd.toNumber()), mLen));

  // console.log('MODEXP input')
  // console.log('B:', bLen, B)
  // console.log('E:', eLen, E)
  // console.log('M:', mLen, M)

  var R;
  if (M.isZero()) {
    R = new BN(0);
  } else {
    R = expmod(B, E, M);
  }
  var result = R.toArrayLike(Buffer, 'be', mLen);

  results.return = result;
  results.exception = 1;

  // console.log('MODEXP output', result)

  return results;
};

/***/ }),
/* 110 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(0);
var BN = utils.BN;
var error = __webpack_require__(6).ERROR;
var fees = __webpack_require__(4);
var assert = __webpack_require__(7);

var bn128Module = __webpack_require__(25);
var ecAddPrecompile = bn128Module.cwrap('ec_add', 'string', ['string']);

module.exports = function (opts) {
  assert(opts.data);

  var results = {};
  var data = opts.data;
  var inputHexStr = data.toString('hex');

  results.gasUsed = new BN(fees.ecAddGas.v);
  if (opts.gasLimit.lt(results.gasUsed)) {
    results.return = Buffer.alloc(0);
    results.exception = 0;
    results.gasUsed = new BN(opts.gasLimit);
    results.exceptionError = error.OUT_OF_GAS;
    return results;
  }

  var returnData = ecAddPrecompile(inputHexStr);

  // check ecadd success or failure by comparing the output length
  if (returnData.length !== 128) {
    results.return = Buffer.alloc(0);
    results.exception = 0;
    results.gasUsed = new BN(opts.gasLimit);
    results.exceptionError = error.OUT_OF_GAS;
  } else {
    results.return = Buffer.from(returnData, 'hex');
    results.exception = 1;
  }

  return results;
};

/***/ }),
/* 111 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(0);
var ERROR = __webpack_require__(6).ERROR;
var BN = utils.BN;
var fees = __webpack_require__(4);
var assert = __webpack_require__(7);

var bn128Module = __webpack_require__(25);
var ecMulPrecompile = bn128Module.cwrap('ec_mul', 'string', ['string']);

module.exports = function (opts) {
  assert(opts.data);

  var results = {};
  var data = opts.data;

  var inputHexStr = data.toString('hex');
  results.gasUsed = new BN(fees.ecMulGas.v);

  if (opts.gasLimit.lt(results.gasUsed)) {
    results.return = Buffer.alloc(0);
    results.exception = 0;
    results.gasUsed = new BN(opts.gasLimit);
    results.exceptionError = ERROR.OUT_OF_GAS;
    return results;
  }

  var returnData = ecMulPrecompile(inputHexStr);

  // check ecmul success or failure by comparing the output length
  if (returnData.length !== 128) {
    results.return = Buffer.alloc(0);
    results.exception = 0;
  } else {
    results.return = Buffer.from(returnData, 'hex');
    results.exception = 1;
  }

  return results;
};

/***/ }),
/* 112 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(0);
var BN = utils.BN;
var error = __webpack_require__(6).ERROR;
var fees = __webpack_require__(4);
var assert = __webpack_require__(7);

var bn128Module = __webpack_require__(25);
var ecPairingPrecompile = bn128Module.cwrap('ec_pairing', 'string', ['string']);

module.exports = function (opts) {
  assert(opts.data);

  var results = {};
  var data = opts.data;

  var inputHexStr = data.toString('hex');
  var inputData = Buffer.from(inputHexStr, 'hex');
  var inputDataSize = Math.floor(inputData.length / 192);

  var gascost = fees.ecPairingGas.v + inputDataSize * fees.ecPairingWordGas.v;
  results.gasUsed = new BN(gascost);

  if (opts.gasLimit.ltn(gascost)) {
    results.gasUsed = opts.gasLimit;
    results.exceptionError = error.OUT_OF_GAS;
    results.exception = 0; // 0 means VM fail (in this case because of OOG)
    return results;
  }

  var returnData = ecPairingPrecompile(inputHexStr);

  // check ecpairing success or failure by comparing the output length
  if (returnData.length !== 64) {
    results.return = Buffer.alloc(0);
    results.gasUsed = opts.gasLimit;
    results.exceptionError = error.OUT_OF_GAS;
    results.exception = 0;
  } else {
    results.return = Buffer.from(returnData, 'hex');
    results.exception = 1;
  }

  return results;
};

/***/ }),
/* 113 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/*

This is the core of the Ethereum Virtual Machine (EVM or just VM).

NOTES:

stack items are lazly dupilicated.
So you must never directly change a buffer from the stack,
instead you should `copy` it first

not all stack items are 32 bytes, so if the operation realies on the stack
item length then you must use utils.pad(<item>, 32) first.
*/
var Buffer = __webpack_require__(5).Buffer;
var async = __webpack_require__(2);
var utils = __webpack_require__(0);
var Block = __webpack_require__(26);
var lookupOpInfo = __webpack_require__(114);
var opFns = __webpack_require__(115);
var exceptions = __webpack_require__(6);
var setImmediate = __webpack_require__(117).setImmediate;
var BN = utils.BN;

var ERROR = exceptions.ERROR;
var VmError = exceptions.VmError;

/**
 * Runs EVM code
 * @param opts
 * @param opts.account {Account} the account that the exucuting code belongs to
 * @param opts.address {Buffer}  the address of the account that is exucuting this code
 * @param opts.block {Block} the block that the transaction is part of
 * @param opts.caller {Buffer} the address that ran this code
 * @param opts.code {Buffer} the code to be run
 * @param opts.data {Buffer}  the input data
 * @param opts.gasLimit {Buffer}
 * @param opts.origin {Buffer} the address where the call originated from
 * @param opts.value {Buffer} the amount the being transfered
 * @param cb {Function}
 */
module.exports = function (opts, cb) {
  var self = this;
  var stateManager = self.stateManager;

  var block = opts.block || new Block();

  // VM internal state
  var runState = {
    stateManager: stateManager,
    returnValue: false,
    stopped: false,
    vmError: false,
    programCounter: 0,
    opCode: undefined,
    opName: undefined,
    gasLeft: new BN(opts.gasLimit),
    gasLimit: new BN(opts.gasLimit),
    gasPrice: opts.gasPrice,
    memory: [],
    memoryWordCount: new BN(0),
    stack: [],
    lastReturned: [],
    logs: [],
    validJumps: [],
    gasRefund: new BN(0),
    highestMemCost: new BN(0),
    depth: opts.depth || 0,
    // opts.suicides is kept for backward compatiblity with pre-EIP6 syntax
    selfdestruct: opts.selfdestruct || opts.suicides || {},
    block: block,
    callValue: opts.value || new BN(0),
    address: opts.address || utils.zeros(32),
    caller: opts.caller || utils.zeros(32),
    origin: opts.origin || opts.caller || utils.zeros(32),
    callData: opts.data || Buffer.from([0]),
    code: opts.code,
    populateCache: opts.populateCache === undefined ? true : opts.populateCache,
    static: opts.static || false

    // temporary - to be factored out
  };runState._precompiled = self._precompiled;
  runState._vm = self;

  // prepare to run vm
  preprocessValidJumps(runState);
  // load contract then start vm run
  loadContract(runVm);

  // iterate through the given ops until something breaks or we hit STOP
  function runVm() {
    async.whilst(vmIsActive, iterateVm, parseVmResults);
  }

  // ensure contract is loaded; only used if runCode is called directly
  function loadContract(cb) {
    stateManager.getAccount(runState.address, function (err, account) {
      if (err) return cb(err);
      runState.contract = account;
      cb();
    });
  }

  function vmIsActive() {
    var notAtEnd = runState.programCounter < runState.code.length;

    return !runState.stopped && notAtEnd && !runState.vmError && !runState.returnValue;
  }

  function iterateVm(done) {
    var opCode = runState.code[runState.programCounter];
    var opInfo = lookupOpInfo(opCode);
    var opName = opInfo.name;
    var opFn = opFns[opName];

    runState.opName = opName;
    runState.opCode = opCode;

    async.series([runStepHook, runOp], function (err) {
      setImmediate(done.bind(null, err));
    });

    function runStepHook(cb) {
      var eventObj = {
        pc: runState.programCounter,
        gasLeft: runState.gasLeft,
        opcode: lookupOpInfo(opCode, true),
        stack: runState.stack,
        depth: runState.depth,
        address: runState.address,
        account: runState.contract,
        cache: runState.stateManager.cache,
        memory: runState.memory
      };
      self.emit('step', eventObj, cb);
    }

    function runOp(cb) {
      // check for invalid opcode
      if (opName === 'INVALID') {
        return cb(new VmError(ERROR.INVALID_OPCODE));
      }

      // check for stack underflows
      if (runState.stack.length < opInfo.in) {
        return cb(new VmError(ERROR.STACK_UNDERFLOW));
      }

      if (runState.stack.length - opInfo.in + opInfo.out > 1024) {
        return cb(new VmError(ERROR.STACK_OVERFLOW));
      }

      // calculate gas
      var fee = new BN(opInfo.fee);
      // TODO: move to a shared funtion; subGas in opFuns
      runState.gasLeft = runState.gasLeft.sub(fee);
      if (runState.gasLeft.ltn(0)) {
        runState.gasLeft = new BN(0);
        cb(new VmError(ERROR.OUT_OF_GAS));
        return;
      }

      // advance program counter
      runState.programCounter++;
      var argsNum = opInfo.in;
      var retNum = opInfo.out;
      // pop the stack
      var args = argsNum ? runState.stack.splice(-argsNum) : [];

      args.reverse();
      args.push(runState);
      // create a callback for async opFunc
      if (opInfo.async) {
        args.push(function (err, result) {
          if (err) return cb(err);

          // save result to the stack
          if (result !== undefined) {
            if (retNum !== 1) {
              // opcode post-stack mismatch
              return cb(new VmError(ERROR.INTERNAL_ERROR));
            }

            runState.stack.push(result);
          } else {
            if (retNum !== 0) {
              // opcode post-stack mismatch
              return cb(new VmError(ERROR.INTERNAL_ERROR));
            }
          }

          cb();
        });
      }

      try {
        // run the opcode
        var result = opFn.apply(null, args);
      } catch (e) {
        cb(e);
        return;
      }

      // save result to the stack
      if (result !== undefined) {
        if (retNum !== 1) {
          // opcode post-stack mismatch
          return cb(VmError(ERROR.INTERNAL_ERROR));
        }

        runState.stack.push(result);
      } else {
        if (!opInfo.async && retNum !== 0) {
          // opcode post-stack mismatch
          return cb(VmError(ERROR.INTERNAL_ERROR));
        }
      }

      // call the callback if opFn was sync
      if (!opInfo.async) {
        cb();
      }
    }
  }

  function parseVmResults(err) {
    // remove any logs on error
    if (err) {
      runState.logs = [];
      stateManager.revertContracts();
      runState.vmError = true;
    }

    var results = {
      runState: runState,
      selfdestruct: runState.selfdestruct,
      gasRefund: runState.gasRefund,
      exception: err ? 0 : 1,
      exceptionError: err,
      logs: runState.logs,
      gas: runState.gasLeft,
      'return': runState.returnValue ? runState.returnValue : Buffer.alloc(0)
    };

    if (results.exceptionError) {
      delete results.gasRefund;
      delete results.selfdestruct;
      self.stateManager.touched = [];
    }

    if (err && err.error !== ERROR.REVERT) {
      results.gasUsed = runState.gasLimit;
    } else {
      results.gasUsed = runState.gasLimit.sub(runState.gasLeft);
    }

    if (runState.populateCache) {
      self.stateManager.cache.flush(function () {
        self.stateManager.cache.clear();
        cb(err, results);
      });
    } else {
      cb(err, results);
    }
  }
};

// find all the valid jumps and puts them in the `validJumps` array
function preprocessValidJumps(runState) {
  for (var i = 0; i < runState.code.length; i++) {
    var curOpCode = lookupOpInfo(runState.code[i]).name;

    // no destinations into the middle of PUSH
    if (curOpCode === 'PUSH') {
      i += runState.code[i] - 0x5f;
    }

    if (curOpCode === 'JUMPDEST') {
      runState.validJumps.push(i);
    }
  }
}

/***/ }),
/* 114 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var codes = {
  // 0x0 range - arithmetic ops
  // name, baseCost, off stack, on stack, dynamic, async
  0x00: ['STOP', 0, 0, 0, false],
  0x01: ['ADD', 3, 2, 1, false],
  0x02: ['MUL', 5, 2, 1, false],
  0x03: ['SUB', 3, 2, 1, false],
  0x04: ['DIV', 5, 2, 1, false],
  0x05: ['SDIV', 5, 2, 1, false],
  0x06: ['MOD', 5, 2, 1, false],
  0x07: ['SMOD', 5, 2, 1, false],
  0x08: ['ADDMOD', 8, 3, 1, false],
  0x09: ['MULMOD', 8, 3, 1, false],
  0x0a: ['EXP', 10, 2, 1, false],
  0x0b: ['SIGNEXTEND', 5, 2, 1, false],

  // 0x10 range - bit ops
  0x10: ['LT', 3, 2, 1, false],
  0x11: ['GT', 3, 2, 1, false],
  0x12: ['SLT', 3, 2, 1, false],
  0x13: ['SGT', 3, 2, 1, false],
  0x14: ['EQ', 3, 2, 1, false],
  0x15: ['ISZERO', 3, 1, 1, false],
  0x16: ['AND', 3, 2, 1, false],
  0x17: ['OR', 3, 2, 1, false],
  0x18: ['XOR', 3, 2, 1, false],
  0x19: ['NOT', 3, 1, 1, false],
  0x1a: ['BYTE', 3, 2, 1, false],

  // 0x20 range - crypto
  0x20: ['SHA3', 30, 2, 1, false],

  // 0x30 range - closure state
  0x30: ['ADDRESS', 2, 0, 1, true],
  0x31: ['BALANCE', 400, 1, 1, true, true],
  0x32: ['ORIGIN', 2, 0, 1, true],
  0x33: ['CALLER', 2, 0, 1, true],
  0x34: ['CALLVALUE', 2, 0, 1, true],
  0x35: ['CALLDATALOAD', 3, 1, 1, true],
  0x36: ['CALLDATASIZE', 2, 0, 1, true],
  0x37: ['CALLDATACOPY', 3, 3, 0, true],
  0x38: ['CODESIZE', 2, 0, 1, false],
  0x39: ['CODECOPY', 3, 3, 0, false],
  0x3a: ['GASPRICE', 2, 0, 1, false],
  0x3b: ['EXTCODESIZE', 700, 1, 1, true, true],
  0x3c: ['EXTCODECOPY', 700, 4, 0, true, true],
  0x3d: ['RETURNDATASIZE', 2, 0, 1, true],
  0x3e: ['RETURNDATACOPY', 3, 3, 0, true],

  // '0x40' range - block operations
  0x40: ['BLOCKHASH', 20, 1, 1, true, true],
  0x41: ['COINBASE', 2, 0, 1, true],
  0x42: ['TIMESTAMP', 2, 0, 1, true],
  0x43: ['NUMBER', 2, 0, 1, true],
  0x44: ['DIFFICULTY', 2, 0, 1, true],
  0x45: ['GASLIMIT', 2, 0, 1, true],

  // 0x50 range - 'storage' and execution
  0x50: ['POP', 2, 1, 0, false],
  0x51: ['MLOAD', 3, 1, 1, false],
  0x52: ['MSTORE', 3, 2, 0, false],
  0x53: ['MSTORE8', 3, 2, 0, false],
  0x54: ['SLOAD', 200, 1, 1, true, true],
  0x55: ['SSTORE', 0, 2, 0, true, true],
  0x56: ['JUMP', 8, 1, 0, false],
  0x57: ['JUMPI', 10, 2, 0, false],
  0x58: ['PC', 2, 0, 1, false],
  0x59: ['MSIZE', 2, 0, 1, false],
  0x5a: ['GAS', 2, 0, 1, false],
  0x5b: ['JUMPDEST', 1, 0, 0, false],

  // 0x60, range
  0x60: ['PUSH', 3, 0, 1, false],
  0x61: ['PUSH', 3, 0, 1, false],
  0x62: ['PUSH', 3, 0, 1, false],
  0x63: ['PUSH', 3, 0, 1, false],
  0x64: ['PUSH', 3, 0, 1, false],
  0x65: ['PUSH', 3, 0, 1, false],
  0x66: ['PUSH', 3, 0, 1, false],
  0x67: ['PUSH', 3, 0, 1, false],
  0x68: ['PUSH', 3, 0, 1, false],
  0x69: ['PUSH', 3, 0, 1, false],
  0x6a: ['PUSH', 3, 0, 1, false],
  0x6b: ['PUSH', 3, 0, 1, false],
  0x6c: ['PUSH', 3, 0, 1, false],
  0x6d: ['PUSH', 3, 0, 1, false],
  0x6e: ['PUSH', 3, 0, 1, false],
  0x6f: ['PUSH', 3, 0, 1, false],
  0x70: ['PUSH', 3, 0, 1, false],
  0x71: ['PUSH', 3, 0, 1, false],
  0x72: ['PUSH', 3, 0, 1, false],
  0x73: ['PUSH', 3, 0, 1, false],
  0x74: ['PUSH', 3, 0, 1, false],
  0x75: ['PUSH', 3, 0, 1, false],
  0x76: ['PUSH', 3, 0, 1, false],
  0x77: ['PUSH', 3, 0, 1, false],
  0x78: ['PUSH', 3, 0, 1, false],
  0x79: ['PUSH', 3, 0, 1, false],
  0x7a: ['PUSH', 3, 0, 1, false],
  0x7b: ['PUSH', 3, 0, 1, false],
  0x7c: ['PUSH', 3, 0, 1, false],
  0x7d: ['PUSH', 3, 0, 1, false],
  0x7e: ['PUSH', 3, 0, 1, false],
  0x7f: ['PUSH', 3, 0, 1, false],

  0x80: ['DUP', 3, 0, 1, false],
  0x81: ['DUP', 3, 0, 1, false],
  0x82: ['DUP', 3, 0, 1, false],
  0x83: ['DUP', 3, 0, 1, false],
  0x84: ['DUP', 3, 0, 1, false],
  0x85: ['DUP', 3, 0, 1, false],
  0x86: ['DUP', 3, 0, 1, false],
  0x87: ['DUP', 3, 0, 1, false],
  0x88: ['DUP', 3, 0, 1, false],
  0x89: ['DUP', 3, 0, 1, false],
  0x8a: ['DUP', 3, 0, 1, false],
  0x8b: ['DUP', 3, 0, 1, false],
  0x8c: ['DUP', 3, 0, 1, false],
  0x8d: ['DUP', 3, 0, 1, false],
  0x8e: ['DUP', 3, 0, 1, false],
  0x8f: ['DUP', 3, 0, 1, false],

  0x90: ['SWAP', 3, 0, 0, false],
  0x91: ['SWAP', 3, 0, 0, false],
  0x92: ['SWAP', 3, 0, 0, false],
  0x93: ['SWAP', 3, 0, 0, false],
  0x94: ['SWAP', 3, 0, 0, false],
  0x95: ['SWAP', 3, 0, 0, false],
  0x96: ['SWAP', 3, 0, 0, false],
  0x97: ['SWAP', 3, 0, 0, false],
  0x98: ['SWAP', 3, 0, 0, false],
  0x99: ['SWAP', 3, 0, 0, false],
  0x9a: ['SWAP', 3, 0, 0, false],
  0x9b: ['SWAP', 3, 0, 0, false],
  0x9c: ['SWAP', 3, 0, 0, false],
  0x9d: ['SWAP', 3, 0, 0, false],
  0x9e: ['SWAP', 3, 0, 0, false],
  0x9f: ['SWAP', 3, 0, 0, false],

  0xa0: ['LOG', 375, 2, 0, false],
  0xa1: ['LOG', 375, 3, 0, false],
  0xa2: ['LOG', 375, 4, 0, false],
  0xa3: ['LOG', 375, 5, 0, false],
  0xa4: ['LOG', 375, 6, 0, false],

  // '0xf0' range - closures
  0xf0: ['CREATE', 32000, 3, 1, true, true],
  0xf1: ['CALL', 700, 7, 1, true, true],
  0xf2: ['CALLCODE', 700, 7, 1, true, true],
  0xf3: ['RETURN', 0, 2, 0, false],
  0xf4: ['DELEGATECALL', 700, 6, 1, true, true],
  0xfa: ['STATICCALL', 700, 6, 1, true, true],
  0xfd: ['REVERT', 0, 2, 0, false],

  // '0x70', range - other
  0xfe: ['INVALID', 0, 0, 0, false],
  0xff: ['SELFDESTRUCT', 5000, 1, 0, false, true]
};

module.exports = function (op, full) {
  var code = codes[op] ? codes[op] : ['INVALID', 0, 0, 0, false, false];
  var opcode = code[0];

  if (full) {
    if (opcode === 'LOG') {
      opcode += op - 0xa0;
    }

    if (opcode === 'PUSH') {
      opcode += op - 0x5f;
    }

    if (opcode === 'DUP') {
      opcode += op - 0x7f;
    }

    if (opcode === 'SWAP') {
      opcode += op - 0x8f;
    }
  }

  return { name: opcode, opcode: op, fee: code[1], in: code[2], out: code[3], dynamic: code[4], async: code[5] };
};

/***/ }),
/* 115 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Buffer = __webpack_require__(5).Buffer;
var async = __webpack_require__(2);
var fees = __webpack_require__(4);
var utils = __webpack_require__(0);
var BN = utils.BN;
var exceptions = __webpack_require__(6);
var logTable = __webpack_require__(116);
var ERROR = exceptions.ERROR;
var VmError = exceptions.VmError;
var MASK_160 = new BN(1).shln(160).subn(1);

// Find Ceil(`this` / `num`)
BN.prototype.divCeil = function divCeil(num) {
  var dm = this.divmod(num);

  // Fast case - exact division
  if (dm.mod.isZero()) return dm.div;

  // Round up
  return dm.div.negative !== 0 ? dm.div.isubn(1) : dm.div.iaddn(1);
};

function addressToBuffer(address) {
  return address.and(MASK_160).toArrayLike(Buffer, 'be', 20);
}

// the opcode functions
module.exports = {
  STOP: function STOP(runState) {
    runState.stopped = true;
  },
  ADD: function ADD(a, b, runState) {
    return a.add(b).mod(utils.TWO_POW256);
  },
  MUL: function MUL(a, b, runState) {
    return a.mul(b).mod(utils.TWO_POW256);
  },
  SUB: function SUB(a, b, runState) {
    return a.sub(b).toTwos(256);
  },
  DIV: function DIV(a, b, runState) {
    if (b.isZero()) {
      return new BN(b);
    } else {
      return a.div(b);
    }
  },
  SDIV: function SDIV(a, b, runState) {
    if (b.isZero()) {
      return new BN(b);
    } else {
      a = a.fromTwos(256);
      b = b.fromTwos(256);
      return a.div(b).toTwos(256);
    }
  },
  MOD: function MOD(a, b, runState) {
    if (b.isZero()) {
      return new BN(b);
    } else {
      return a.mod(b);
    }
  },
  SMOD: function SMOD(a, b, runState) {
    if (b.isZero()) {
      return new BN(b);
    } else {
      a = a.fromTwos(256);
      b = b.fromTwos(256);
      var r = a.abs().mod(b.abs());
      if (a.isNeg()) {
        r = r.ineg();
      }
      return r.toTwos(256);
    }
  },
  ADDMOD: function ADDMOD(a, b, c, runState) {
    if (c.isZero()) {
      return new BN(c);
    } else {
      return a.add(b).mod(c);
    }
  },
  MULMOD: function MULMOD(a, b, c, runState) {
    if (c.isZero()) {
      return new BN(c);
    } else {
      return a.mul(b).mod(c);
    }
  },
  EXP: function EXP(base, exponent, runState) {
    var m = BN.red(utils.TWO_POW256);

    base = base.toRed(m);

    if (!exponent.isZero()) {
      var bytes = 1 + logTable(exponent);
      subGas(runState, new BN(bytes).muln(fees.expByteGas.v));
      return base.redPow(exponent);
    } else {
      return new BN(1);
    }
  },
  SIGNEXTEND: function SIGNEXTEND(k, val, runState) {
    val = val.toArrayLike(Buffer, 'be', 32);
    var extendOnes = false;

    if (k.lten(31)) {
      k = k.toNumber();

      if (val[31 - k] & 0x80) {
        extendOnes = true;
      }

      // 31-k-1 since k-th byte shouldn't be modified
      for (var i = 30 - k; i >= 0; i--) {
        val[i] = extendOnes ? 0xff : 0;
      }
    }

    return new BN(val);
  },
  // 0x10 range - bit ops
  LT: function LT(a, b, runState) {
    return new BN(a.lt(b) ? 1 : 0);
  },
  GT: function GT(a, b, runState) {
    return new BN(a.gt(b) ? 1 : 0);
  },
  SLT: function SLT(a, b, runState) {
    return new BN(a.fromTwos(256).lt(b.fromTwos(256)) ? 1 : 0);
  },
  SGT: function SGT(a, b, runState) {
    return new BN(a.fromTwos(256).gt(b.fromTwos(256)) ? 1 : 0);
  },
  EQ: function EQ(a, b, runState) {
    return new BN(a.eq(b) ? 1 : 0);
  },
  ISZERO: function ISZERO(a, runState) {
    return new BN(a.isZero() ? 1 : 0);
  },
  AND: function AND(a, b, runState) {
    return a.and(b);
  },
  OR: function OR(a, b, runState) {
    return a.or(b);
  },
  XOR: function XOR(a, b, runState) {
    return a.xor(b);
  },
  NOT: function NOT(a, runState) {
    return a.notn(256);
  },
  BYTE: function BYTE(pos, word, runState) {
    if (pos.gten(32)) {
      return new BN(0);
    }

    return word.shrn((31 - pos.toNumber()) * 8).andln(0xff);
  },
  // 0x20 range - crypto
  SHA3: function SHA3(offset, length, runState) {
    var data = memLoad(runState, offset, length);
    // copy fee
    subGas(runState, new BN(fees.sha3WordGas.v).imul(length.divCeil(new BN(32))));
    return new BN(utils.sha3(data));
  },
  // 0x30 range - closure state
  ADDRESS: function ADDRESS(runState) {
    return new BN(runState.address);
  },
  BALANCE: function BALANCE(address, runState, cb) {
    var stateManager = runState.stateManager;
    // stack to address
    address = addressToBuffer(address);

    // shortcut if current account
    if (address.toString('hex') === runState.address.toString('hex')) {
      cb(null, new BN(runState.contract.balance));
      return;
    }

    // otherwise load account then return balance
    stateManager.getAccountBalance(address, function (err, value) {
      if (err) {
        return cb(err);
      }
      cb(null, new BN(value));
    });
  },
  ORIGIN: function ORIGIN(runState) {
    return new BN(runState.origin);
  },
  CALLER: function CALLER(runState) {
    return new BN(runState.caller);
  },
  CALLVALUE: function CALLVALUE(runState) {
    return new BN(runState.callValue);
  },
  CALLDATALOAD: function CALLDATALOAD(pos, runState) {
    if (pos.gtn(runState.callData.length)) {
      return new BN(0);
    } else {
      pos = pos.toNumber();
      var loaded = runState.callData.slice(pos, pos + 32);
      loaded = loaded.length ? loaded : Buffer.from([0]);
      return new BN(utils.setLengthRight(loaded, 32));
    }
  },
  CALLDATASIZE: function CALLDATASIZE(runState) {
    if (runState.callData.length === 1 && runState.callData[0] === 0) {
      return new BN(0);
    } else {
      return new BN(runState.callData.length);
    }
  },
  CALLDATACOPY: function CALLDATACOPY(memOffset, dataOffset, dataLength, runState) {
    memStore(runState, memOffset, runState.callData, dataOffset, dataLength);
    // sub the COPY fee
    subGas(runState, new BN(fees.copyGas.v).imul(dataLength.divCeil(new BN(32))));
  },
  CODESIZE: function CODESIZE(runState) {
    return new BN(runState.code.length);
  },
  CODECOPY: function CODECOPY(memOffset, codeOffset, length, runState) {
    memStore(runState, memOffset, runState.code, codeOffset, length);
    // sub the COPY fee
    subGas(runState, new BN(fees.copyGas.v).imul(length.divCeil(new BN(32))));
  },
  EXTCODESIZE: function EXTCODESIZE(address, runState, cb) {
    var stateManager = runState.stateManager;
    address = addressToBuffer(address);
    stateManager.getContractCode(address, function (err, code) {
      if (err) return cb(err);
      cb(null, new BN(code.length));
    });
  },
  EXTCODECOPY: function EXTCODECOPY(address, memOffset, codeOffset, length, runState, cb) {
    var stateManager = runState.stateManager;
    address = addressToBuffer(address);

    // FIXME: for some reason this must come before subGas
    subMemUsage(runState, memOffset, length);
    // copy fee
    subGas(runState, new BN(fees.copyGas.v).imul(length.divCeil(new BN(32))));

    stateManager.getContractCode(address, function (err, code) {
      if (err) return cb(err);
      memStore(runState, memOffset, code, codeOffset, length, false);
      cb(null);
    });
  },
  RETURNDATASIZE: function RETURNDATASIZE(runState) {
    return new BN(runState.lastReturned.length);
  },
  RETURNDATACOPY: function RETURNDATACOPY(memOffset, returnDataOffset, length, runState) {
    if (returnDataOffset.add(length).gtn(runState.lastReturned.length)) {
      trap(ERROR.OUT_OF_GAS);
    }

    memStore(runState, memOffset, utils.toBuffer(runState.lastReturned), returnDataOffset, length, false);
    // sub the COPY fee
    subGas(runState, new BN(fees.copyGas.v).mul(length.divCeil(new BN(32))));
  },
  GASPRICE: function GASPRICE(runState) {
    return new BN(runState.gasPrice);
  },
  // '0x40' range - block operations
  BLOCKHASH: function BLOCKHASH(number, runState, cb) {
    var stateManager = runState.stateManager;
    var diff = new BN(runState.block.header.number).sub(number);

    // block lookups must be within the past 256 blocks
    if (diff.gtn(256) || diff.lten(0)) {
      cb(null, new BN(0));
      return;
    }

    stateManager.getBlockHash(number.toArrayLike(Buffer, 'be', 32), function (err, blockHash) {
      if (err) return cb(err);
      cb(null, new BN(blockHash));
    });
  },
  COINBASE: function COINBASE(runState) {
    return new BN(runState.block.header.coinbase);
  },
  TIMESTAMP: function TIMESTAMP(runState) {
    return new BN(runState.block.header.timestamp);
  },
  NUMBER: function NUMBER(runState) {
    return new BN(runState.block.header.number);
  },
  DIFFICULTY: function DIFFICULTY(runState) {
    return new BN(runState.block.header.difficulty);
  },
  GASLIMIT: function GASLIMIT(runState) {
    return new BN(runState.block.header.gasLimit);
  },
  // 0x50 range - 'storage' and execution
  POP: function POP() {},
  MLOAD: function MLOAD(pos, runState) {
    return new BN(memLoad(runState, pos, new BN(32)));
  },
  MSTORE: function MSTORE(offset, word, runState) {
    word = word.toArrayLike(Buffer, 'be', 32);
    memStore(runState, offset, word, new BN(0), new BN(32));
  },
  MSTORE8: function MSTORE8(offset, byte, runState) {
    // NOTE: we're using a 'trick' here to get the least significant byte
    byte = Buffer.from([byte.andln(0xff)]);
    memStore(runState, offset, byte, new BN(0), new BN(1));
  },
  SLOAD: function SLOAD(key, runState, cb) {
    var stateManager = runState.stateManager;
    key = key.toArrayLike(Buffer, 'be', 32);

    stateManager.getContractStorage(runState.address, key, function (err, value) {
      if (err) return cb(err);
      value = value.length ? new BN(value) : new BN(0);
      cb(null, value);
    });
  },
  SSTORE: function SSTORE(key, val, runState, cb) {
    if (runState.static) {
      trap(ERROR.STATIC_STATE_CHANGE);
    }
    var stateManager = runState.stateManager;
    var address = runState.address;
    key = key.toArrayLike(Buffer, 'be', 32);
    // NOTE: this should be the shortest representation
    var value;
    if (val.isZero()) {
      value = Buffer.from([]);
    } else {
      value = val.toArrayLike(Buffer, 'be');
    }

    stateManager.getContractStorage(runState.address, key, function (err, found) {
      if (err) return cb(err);
      try {
        if (value.length === 0 && !found.length) {
          subGas(runState, new BN(fees.sstoreResetGas.v));
        } else if (value.length === 0 && found.length) {
          subGas(runState, new BN(fees.sstoreResetGas.v));
          runState.gasRefund.iaddn(fees.sstoreRefundGas.v);
        } else if (value.length !== 0 && !found.length) {
          subGas(runState, new BN(fees.sstoreSetGas.v));
        } else if (value.length !== 0 && found.length) {
          subGas(runState, new BN(fees.sstoreResetGas.v));
        }
      } catch (e) {
        cb(e.error);
        return;
      }

      stateManager.putContractStorage(address, key, value, function (err) {
        if (err) return cb(err);
        runState.contract = stateManager.cache.get(address);
        cb(null);
      });
    });
  },
  JUMP: function JUMP(dest, runState) {
    if (dest.gtn(runState.code.length)) {
      trap(ERROR.INVALID_JUMP + ' at ' + describeLocation(runState));
    }

    dest = dest.toNumber();

    if (!jumpIsValid(runState, dest)) {
      trap(ERROR.INVALID_JUMP + ' at ' + describeLocation(runState));
    }

    runState.programCounter = dest;
  },
  JUMPI: function JUMPI(dest, cond, runState) {
    if (!cond.isZero()) {
      if (dest.gtn(runState.code.length)) {
        trap(ERROR.INVALID_JUMP + ' at ' + describeLocation(runState));
      }

      dest = dest.toNumber();

      if (!jumpIsValid(runState, dest)) {
        trap(ERROR.INVALID_JUMP + ' at ' + describeLocation(runState));
      }

      runState.programCounter = dest;
    }
  },
  PC: function PC(runState) {
    return new BN(runState.programCounter - 1);
  },
  MSIZE: function MSIZE(runState) {
    return runState.memoryWordCount.muln(32);
  },
  GAS: function GAS(runState) {
    return new BN(runState.gasLeft);
  },
  JUMPDEST: function JUMPDEST(runState) {},
  PUSH: function PUSH(runState) {
    var numToPush = runState.opCode - 0x5f;
    var loaded = new BN(runState.code.slice(runState.programCounter, runState.programCounter + numToPush).toString('hex'), 16);
    runState.programCounter += numToPush;
    return loaded;
  },
  DUP: function DUP(runState) {
    // NOTE: this function manipulates the stack directly!

    var stackPos = runState.opCode - 0x7f;
    if (stackPos > runState.stack.length) {
      trap(ERROR.STACK_UNDERFLOW);
    }
    // create a new copy
    return new BN(runState.stack[runState.stack.length - stackPos]);
  },
  SWAP: function SWAP(runState) {
    // NOTE: this function manipulates the stack directly!

    var stackPos = runState.opCode - 0x8f;

    // check the stack to make sure we have enough items on teh stack
    var swapIndex = runState.stack.length - stackPos - 1;
    if (swapIndex < 0) {
      trap(ERROR.STACK_UNDERFLOW);
    }

    // preform the swap
    var topIndex = runState.stack.length - 1;
    var tmp = runState.stack[topIndex];
    runState.stack[topIndex] = runState.stack[swapIndex];
    runState.stack[swapIndex] = tmp;
  },
  LOG: function LOG(memOffset, memLength) {
    var args = Array.prototype.slice.call(arguments, 0);
    var runState = args.pop();
    if (runState.static) {
      trap(ERROR.STATIC_STATE_CHANGE);
    }

    var topics = args.slice(2);
    topics = topics.map(function (a) {
      return a.toArrayLike(Buffer, 'be', 32);
    });

    var numOfTopics = runState.opCode - 0xa0;
    var mem = memLoad(runState, memOffset, memLength);
    subGas(runState, new BN(fees.logTopicGas.v).imuln(numOfTopics).iadd(memLength.muln(fees.logDataGas.v)));

    // add address
    var log = [runState.address];
    log.push(topics);

    // add data
    log.push(mem);
    runState.logs.push(log);
  },

  // '0xf0' range - closures
  CREATE: function CREATE(value, offset, length, runState, done) {
    if (runState.static) {
      trap(ERROR.STATIC_STATE_CHANGE);
    }

    var data = memLoad(runState, offset, length);

    // set up config
    var options = {
      value: value,
      data: data
    };

    var localOpts = {
      inOffset: offset,
      inLength: length,
      outOffset: new BN(0),
      outLength: new BN(0)
    };

    checkCallMemCost(runState, options, localOpts);
    checkOutOfGas(runState, options);
    makeCall(runState, options, localOpts, done);
  },
  CALL: function CALL(gasLimit, toAddress, value, inOffset, inLength, outOffset, outLength, runState, done) {
    var stateManager = runState.stateManager;
    toAddress = addressToBuffer(toAddress);

    if (runState.static && !value.isZero()) {
      trap(ERROR.STATIC_STATE_CHANGE);
    }

    var data = memLoad(runState, inOffset, inLength);

    var options = {
      gasLimit: gasLimit,
      value: value,
      to: toAddress,
      data: data,
      static: runState.static
    };

    var localOpts = {
      inOffset: inOffset,
      inLength: inLength,
      outOffset: outOffset,
      outLength: outLength
    };

    if (!value.isZero()) {
      subGas(runState, new BN(fees.callValueTransferGas.v));
    }

    stateManager.exists(toAddress, function (err, exists) {
      if (err) {
        done(err);
        return;
      }

      stateManager.accountIsEmpty(toAddress, function (err, empty) {
        if (err) {
          done(err);
          return;
        }

        if (!exists || empty) {
          if (!value.isZero()) {
            try {
              subGas(runState, new BN(fees.callNewAccountGas.v));
            } catch (e) {
              done(e.error);
              return;
            }
          }
        }

        try {
          checkCallMemCost(runState, options, localOpts);
          checkOutOfGas(runState, options);
        } catch (e) {
          done(e.error);
          return;
        }

        if (!value.isZero()) {
          runState.gasLeft.iaddn(fees.callStipend.v);
          options.gasLimit.iaddn(fees.callStipend.v);
        }

        makeCall(runState, options, localOpts, done);
      });
    });
  },
  CALLCODE: function CALLCODE(gas, toAddress, value, inOffset, inLength, outOffset, outLength, runState, done) {
    var stateManager = runState.stateManager;
    toAddress = addressToBuffer(toAddress);

    var data = memLoad(runState, inOffset, inLength);

    var options = {
      gasLimit: gas,
      value: value,
      data: data,
      to: runState.address,
      static: runState.static
    };

    var localOpts = {
      inOffset: inOffset,
      inLength: inLength,
      outOffset: outOffset,
      outLength: outLength
    };

    if (!value.isZero()) {
      subGas(runState, new BN(fees.callValueTransferGas.v));
    }

    checkCallMemCost(runState, options, localOpts);
    checkOutOfGas(runState, options);

    if (!value.isZero()) {
      runState.gasLeft.iaddn(fees.callStipend.v);
      options.gasLimit.iaddn(fees.callStipend.v);
    }

    // load the code
    stateManager.getAccount(toAddress, function (err, account) {
      if (err) return done(err);
      if (runState._precompiled[toAddress.toString('hex')]) {
        options.compiled = true;
        options.code = runState._precompiled[toAddress.toString('hex')];
        makeCall(runState, options, localOpts, done);
      } else {
        stateManager.getContractCode(toAddress, function (err, code, compiled) {
          if (err) return done(err);
          options.compiled = compiled || false;
          options.code = code;
          makeCall(runState, options, localOpts, done);
        });
      }
    });
  },
  DELEGATECALL: function DELEGATECALL(gas, toAddress, inOffset, inLength, outOffset, outLength, runState, done) {
    var stateManager = runState.stateManager;
    var value = runState.callValue;
    toAddress = addressToBuffer(toAddress);

    var data = memLoad(runState, inOffset, inLength);

    var options = {
      gasLimit: gas,
      value: value,
      data: data,
      to: runState.address,
      caller: runState.caller,
      delegatecall: true,
      static: runState.static
    };

    var localOpts = {
      inOffset: inOffset,
      inLength: inLength,
      outOffset: outOffset,
      outLength: outLength
    };

    checkCallMemCost(runState, options, localOpts);
    checkOutOfGas(runState, options);

    // load the code
    stateManager.getAccount(toAddress, function (err, account) {
      if (err) return done(err);
      if (runState._precompiled[toAddress.toString('hex')]) {
        options.compiled = true;
        options.code = runState._precompiled[toAddress.toString('hex')];
        makeCall(runState, options, localOpts, done);
      } else {
        stateManager.getContractCode(toAddress, function (err, code, compiled) {
          if (err) return done(err);
          options.compiled = compiled || false;
          options.code = code;
          makeCall(runState, options, localOpts, done);
        });
      }
    });
  },
  STATICCALL: function STATICCALL(gasLimit, toAddress, inOffset, inLength, outOffset, outLength, runState, done) {
    var stateManager = runState.stateManager;
    var value = new BN(0);
    toAddress = addressToBuffer(toAddress);

    var data = memLoad(runState, inOffset, inLength);

    var options = {
      gasLimit: gasLimit,
      value: value,
      to: toAddress,
      data: data,
      static: true
    };

    var localOpts = {
      inOffset: inOffset,
      inLength: inLength,
      outOffset: outOffset,
      outLength: outLength
    };

    stateManager.exists(toAddress, function (err, exists) {
      if (err) {
        done(err);
        return;
      }

      stateManager.accountIsEmpty(toAddress, function (err, empty) {
        if (err) {
          done(err);
          return;
        }

        try {
          checkCallMemCost(runState, options, localOpts);
          checkOutOfGas(runState, options);
        } catch (e) {
          done(e.error);
          return;
        }

        makeCall(runState, options, localOpts, done);
      });
    });
  },
  RETURN: function RETURN(offset, length, runState) {
    runState.returnValue = memLoad(runState, offset, length);
  },
  REVERT: function REVERT(offset, length, runState) {
    runState.stopped = true;
    runState.returnValue = memLoad(runState, offset, length);
    trap(ERROR.REVERT);
  },
  // '0x70', range - other
  SELFDESTRUCT: function SELFDESTRUCT(selfdestructToAddress, runState, cb) {
    if (runState.static) {
      trap(ERROR.STATIC_STATE_CHANGE);
    }
    var stateManager = runState.stateManager;
    var contract = runState.contract;
    var contractAddress = runState.address;
    selfdestructToAddress = addressToBuffer(selfdestructToAddress);

    stateManager.getAccount(selfdestructToAddress, function (err, toAccount) {
      // update balances
      if (err) {
        cb(err);
        return;
      }

      stateManager.accountIsEmpty(selfdestructToAddress, function (error, empty) {
        if (error) {
          cb(error);
          return;
        }

        if (new BN(contract.balance).gtn(0)) {
          if (!toAccount.exists || empty) {
            try {
              subGas(runState, new BN(fees.callNewAccountGas.v));
            } catch (e) {
              cb(e.error);
              return;
            }
          }
        }

        // only add to refund if this is the first selfdestruct for the address
        if (!runState.selfdestruct[contractAddress.toString('hex')]) {
          runState.gasRefund = runState.gasRefund.addn(fees.suicideRefundGas.v);
        }
        runState.selfdestruct[contractAddress.toString('hex')] = selfdestructToAddress;
        runState.stopped = true;

        var newBalance = new BN(contract.balance).add(new BN(toAccount.balance));
        async.series([stateManager.putAccountBalance.bind(stateManager, selfdestructToAddress, newBalance), stateManager.putAccountBalance.bind(stateManager, contractAddress, new BN(0))], function (err) {
          // The reason for this is to avoid sending an array of results
          cb(err);
        });
      });
    });
  }
};

function describeLocation(runState) {
  var hash = utils.sha3(runState.code).toString('hex');
  var address = runState.address.toString('hex');
  var pc = runState.programCounter - 1;
  return hash + '/' + address + ':' + pc;
}

function subGas(runState, amount) {
  runState.gasLeft.isub(amount);
  if (runState.gasLeft.ltn(0)) {
    runState.gasLeft = new BN(0);
    trap(ERROR.OUT_OF_GAS);
  }
}

function trap(err) {
  throw new VmError(err);
}

/**
 * Subtracts the amount needed for memory usage from `runState.gasLeft`
 * @method subMemUsage
 * @param {BN} offset
 * @param {BN} length
 * @return {String}
 */
function subMemUsage(runState, offset, length) {
  // YP (225): access with zero length will not extend the memory
  if (length.isZero()) return;

  var newMemoryWordCount = offset.add(length).divCeil(new BN(32));
  if (newMemoryWordCount.lte(runState.memoryWordCount)) return;

  var words = newMemoryWordCount;
  var fee = new BN(fees.memoryGas.v);
  var quadCoeff = new BN(fees.quadCoeffDiv.v);
  // words * 3 + words ^2 / 512
  var cost = words.mul(fee).add(words.mul(words).div(quadCoeff));

  if (cost.gt(runState.highestMemCost)) {
    subGas(runState, cost.sub(runState.highestMemCost));
    runState.highestMemCost = cost;
  }

  runState.memoryWordCount = newMemoryWordCount;
}

/**
 * Loads bytes from memory and returns them as a buffer. If an error occurs
 * a string is instead returned. The function also subtracts the amount of
 * gas need for memory expansion.
 * @method memLoad
 * @param {BN} offset where to start reading from
 * @param {BN} length how far to read
 * @return {Buffer|String}
 */
function memLoad(runState, offset, length) {
  // check to see if we have enougth gas for the mem read
  subMemUsage(runState, offset, length);

  // shortcut
  if (length.isZero()) {
    return Buffer.alloc(0);
  }

  // NOTE: in theory this could overflow, but unlikely due to OOG above
  offset = offset.toNumber();
  length = length.toNumber();

  var loaded = runState.memory.slice(offset, offset + length);
  // fill the remaining lenth with zeros
  for (var i = loaded.length; i < length; i++) {
    loaded[i] = 0;
  }
  return Buffer.from(loaded);
}

/**
 * Stores bytes to memory. If an error occurs a string is instead returned.
 * The function also subtracts the amount of gas need for memory expansion.
 * @method memStore
 * @param {BN} offset where to start reading from
 * @param {Buffer} val
 * @param {BN} valOffset
 * @param {BN} length how far to read
 * @param {Boolean} skipSubMem
 * @return {Buffer|String}
 */
function memStore(runState, offset, val, valOffset, length, skipSubMem) {
  if (skipSubMem !== false) {
    subMemUsage(runState, offset, length);
  }

  // shortcut
  if (length.isZero()) {
    return;
  }

  // NOTE: in theory this could overflow, but unlikely due to OOG above
  offset = offset.toNumber();
  length = length.toNumber();

  var safeLen = 0;
  if (valOffset.addn(length).gtn(val.length)) {
    if (valOffset.gten(val.length)) {
      safeLen = 0;
    } else {
      valOffset = valOffset.toNumber();
      safeLen = val.length - valOffset;
    }
  } else {
    valOffset = valOffset.toNumber();
    safeLen = val.length;
  }

  var i = 0;
  if (safeLen > 0) {
    safeLen = safeLen > length ? length : safeLen;
    for (; i < safeLen; i++) {
      runState.memory[offset + i] = val[valOffset + i];
    }
  }

  /*
    pad the remaining length with zeros IF AND ONLY IF a value was stored
    (even if value offset > value length, strange spec...)
  */
  if (val.length > 0 && i < length) {
    for (; i < length; i++) {
      runState.memory[offset + i] = 0;
    }
  }
}

// checks if a jump is valid given a destination
function jumpIsValid(runState, dest) {
  return runState.validJumps.indexOf(dest) !== -1;
}

// checks to see if we have enough gas left for the memory reads and writes
// required by the CALLs
function checkCallMemCost(runState, callOptions, localOpts) {
  // calculates the gas need for saving the output in memory
  subMemUsage(runState, localOpts.outOffset, localOpts.outLength);

  if (!callOptions.gasLimit) {
    callOptions.gasLimit = new BN(runState.gasLeft);
  }
}

function checkOutOfGas(runState, callOptions) {
  var gasAllowed = runState.gasLeft.sub(runState.gasLeft.divn(64));
  if (callOptions.gasLimit.gt(gasAllowed)) {
    callOptions.gasLimit = gasAllowed;
  }
}

// sets up and calls runCall
function makeCall(runState, callOptions, localOpts, cb) {
  callOptions.caller = callOptions.caller || runState.address;
  callOptions.origin = runState.origin;
  callOptions.gasPrice = runState.gasPrice;
  callOptions.block = runState.block;
  callOptions.populateCache = false;
  callOptions.static = callOptions.static || false;
  callOptions.selfdestruct = runState.selfdestruct;

  // increment the runState.depth
  callOptions.depth = runState.depth + 1;

  // empty the return data buffer
  runState.lastReturned = Buffer.alloc(0);

  // check if account has enough ether
  // Note: in the case of delegatecall, the value is persisted and doesn't need to be deducted again
  if (runState.depth >= fees.stackLimit.v || callOptions.delegatecall !== true && new BN(runState.contract.balance).lt(callOptions.value)) {
    cb(null, new BN(0));
  } else {
    // if creating a new contract then increament the nonce
    if (!callOptions.to) {
      runState.contract.nonce = new BN(runState.contract.nonce).addn(1);
    }

    runState.stateManager.cache.put(runState.address, runState.contract);
    runState._vm.runCall(callOptions, parseCallResults);
  }

  function parseCallResults(err, results) {
    if (err) return cb(err);

    // concat the runState.logs
    if (results.vm.logs) {
      runState.logs = runState.logs.concat(results.vm.logs);
    }

    // add gasRefund
    if (results.vm.gasRefund) {
      runState.gasRefund = runState.gasRefund.add(results.vm.gasRefund);
    }

    // this should always be safe
    runState.gasLeft.isub(results.gasUsed);

    // save results to memory
    if (results.vm.return && (!results.vm.exceptionError || results.vm.exceptionError.error === ERROR.REVERT)) {
      memStore(runState, localOpts.outOffset, results.vm.return, new BN(0), localOpts.outLength, false);

      if (results.vm.exceptionError && results.vm.exceptionError.error === ERROR.REVERT && runState.opName === 'CREATE') {
        runState.lastReturned = results.vm.return;
      }

      switch (runState.opName) {
        case 'CALL':
        case 'CALLCODE':
        case 'DELEGATECALL':
        case 'STATICCALL':
          runState.lastReturned = results.vm.return;
          break;
      }
    }

    if (!results.vm.exceptionError) {
      // update stateRoot on current contract
      runState.stateManager.getAccount(runState.address, function (err, account) {
        if (err) return cb(err);

        runState.contract = account;
        // push the created address to the stack
        if (results.createdAddress) {
          cb(null, new BN(results.createdAddress));
        } else {
          cb(null, new BN(results.vm.exception));
        }
      });
    } else {
      // creation failed so don't increament the nonce
      if (results.vm.createdAddress) {
        runState.contract.nonce = new BN(runState.contract.nonce).subn(1);
      }

      cb(null, new BN(results.vm.exception));
    }
  }
}

/***/ }),
/* 116 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(0);
var BN = utils.BN;
var pow32 = new BN('010000000000000000000000000000000000000000000000000000000000000000', 16);
var pow31 = new BN('0100000000000000000000000000000000000000000000000000000000000000', 16);
var pow30 = new BN('01000000000000000000000000000000000000000000000000000000000000', 16);
var pow29 = new BN('010000000000000000000000000000000000000000000000000000000000', 16);
var pow28 = new BN('0100000000000000000000000000000000000000000000000000000000', 16);
var pow27 = new BN('01000000000000000000000000000000000000000000000000000000', 16);
var pow26 = new BN('010000000000000000000000000000000000000000000000000000', 16);
var pow25 = new BN('0100000000000000000000000000000000000000000000000000', 16);
var pow24 = new BN('01000000000000000000000000000000000000000000000000', 16);
var pow23 = new BN('010000000000000000000000000000000000000000000000', 16);
var pow22 = new BN('0100000000000000000000000000000000000000000000', 16);
var pow21 = new BN('01000000000000000000000000000000000000000000', 16);
var pow20 = new BN('010000000000000000000000000000000000000000', 16);
var pow19 = new BN('0100000000000000000000000000000000000000', 16);
var pow18 = new BN('01000000000000000000000000000000000000', 16);
var pow17 = new BN('010000000000000000000000000000000000', 16);
var pow16 = new BN('0100000000000000000000000000000000', 16);
var pow15 = new BN('01000000000000000000000000000000', 16);
var pow14 = new BN('010000000000000000000000000000', 16);
var pow13 = new BN('0100000000000000000000000000', 16);
var pow12 = new BN('01000000000000000000000000', 16);
var pow11 = new BN('010000000000000000000000', 16);
var pow10 = new BN('0100000000000000000000', 16);
var pow9 = new BN('01000000000000000000', 16);
var pow8 = new BN('010000000000000000', 16);
var pow7 = new BN('0100000000000000', 16);
var pow6 = new BN('01000000000000', 16);
var pow5 = new BN('010000000000', 16);
var pow4 = new BN('0100000000', 16);
var pow3 = new BN('01000000', 16);
var pow2 = new BN('010000', 16);
var pow1 = new BN('0100', 16);

module.exports = function (a) {
  if (a.cmp(pow1) === -1) {
    return 0;
  } else if (a.cmp(pow2) === -1) {
    return 1;
  } else if (a.cmp(pow3) === -1) {
    return 2;
  } else if (a.cmp(pow4) === -1) {
    return 3;
  } else if (a.cmp(pow5) === -1) {
    return 4;
  } else if (a.cmp(pow6) === -1) {
    return 5;
  } else if (a.cmp(pow7) === -1) {
    return 6;
  } else if (a.cmp(pow8) === -1) {
    return 7;
  } else if (a.cmp(pow9) === -1) {
    return 8;
  } else if (a.cmp(pow10) === -1) {
    return 9;
  } else if (a.cmp(pow11) === -1) {
    return 10;
  } else if (a.cmp(pow12) === -1) {
    return 11;
  } else if (a.cmp(pow13) === -1) {
    return 12;
  } else if (a.cmp(pow14) === -1) {
    return 13;
  } else if (a.cmp(pow15) === -1) {
    return 14;
  } else if (a.cmp(pow16) === -1) {
    return 15;
  } else if (a.cmp(pow17) === -1) {
    return 16;
  } else if (a.cmp(pow18) === -1) {
    return 17;
  } else if (a.cmp(pow19) === -1) {
    return 18;
  } else if (a.cmp(pow20) === -1) {
    return 19;
  } else if (a.cmp(pow21) === -1) {
    return 20;
  } else if (a.cmp(pow22) === -1) {
    return 21;
  } else if (a.cmp(pow23) === -1) {
    return 22;
  } else if (a.cmp(pow24) === -1) {
    return 23;
  } else if (a.cmp(pow25) === -1) {
    return 24;
  } else if (a.cmp(pow26) === -1) {
    return 25;
  } else if (a.cmp(pow27) === -1) {
    return 26;
  } else if (a.cmp(pow28) === -1) {
    return 27;
  } else if (a.cmp(pow29) === -1) {
    return 28;
  } else if (a.cmp(pow30) === -1) {
    return 29;
  } else if (a.cmp(pow31) === -1) {
    return 30;
  } else if (a.cmp(pow32) === -1) {
    return 31;
  } else {
    return 32;
  }
};

/***/ }),
/* 117 */
/***/ (function(module, exports) {

module.exports = require("timers");

/***/ }),
/* 118 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function (opts, cb) {
  // for precompiled
  var results;
  if (typeof opts.code === 'function') {
    results = opts.code(opts);
    results.account = opts.account;
    if (results.exception === undefined) {
      results.exception = 1;
    }
    cb(results.exceptionError, results);
  } else {
    var f = new Function('require', 'opts', opts.code.toString()); // eslint-disable-line
    results = f(!(function webpackMissingModule() { var e = new Error("Cannot find module \".\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()), opts);
    results.account = opts.account;
    cb(results.exceptionError, results);
  }
};

/***/ }),
/* 119 */
/***/ (function(module, exports) {

function webpackEmptyContext(req) {
	throw new Error("Cannot find module '" + req + "'.");
}
webpackEmptyContext.keys = function() { return []; };
webpackEmptyContext.resolve = webpackEmptyContext;
module.exports = webpackEmptyContext;
webpackEmptyContext.id = 119;

/***/ }),
/* 120 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Buffer = __webpack_require__(5).Buffer;
var async = __webpack_require__(2);
var ethUtil = __webpack_require__(0);
var Bloom = __webpack_require__(47);
var common = __webpack_require__(4);
var rlp = ethUtil.rlp;
var Trie = __webpack_require__(46);
var BN = ethUtil.BN;

var minerReward = new BN(common.minerReward.v);

/**
 * process the transaction in a block and pays the miners
 * @param opts
 * @param opts.block {Block} the block we are processing
 * @param opts.generate {Boolean} [gen=false] whether to generate the stateRoot
 * @param cb {Function} the callback which is given an error string
 */
module.exports = function (opts, cb) {
  var self = this;

  // parse options
  var block = opts.block;
  var generateStateRoot = !!opts.generate;
  var validateStateRoot = !generateStateRoot;
  var bloom = new Bloom();
  var receiptTrie = new Trie();
  // the total amount of gas used processing this block
  var gasUsed = new BN(0);
  // miner account
  var minerAccount;
  var receipts = [];
  var txResults = [];
  var result;

  if (opts.root) {
    self.stateManager.trie.root = opts.root;
  }

  this.trie.checkpoint();

  // run everything
  async.series([beforeBlock, populateCache, processTransactions], parseBlockResults);

  function beforeBlock(cb) {
    self.emit('beforeBlock', opts.block, cb);
  }

  function afterBlock(cb) {
    self.emit('afterBlock', result, cb);
  }

  // populates the cache with accounts that we know we will need
  function populateCache(cb) {
    var accounts = new Set();
    accounts.add(block.header.coinbase.toString('hex'));
    block.transactions.forEach(function (tx) {
      accounts.add(tx.getSenderAddress().toString('hex'));
      accounts.add(tx.to.toString('hex'));
    });

    block.uncleHeaders.forEach(function (uh) {
      accounts.add(uh.coinbase.toString('hex'));
    });

    self.populateCache(accounts, cb);
  }

  /**
   * Processes all of the transaction in the block
   * @method processTransaction
   * @param {Function} cb the callback is given error if there are any
   */
  function processTransactions(cb) {
    var validReceiptCount = 0;

    async.eachSeries(block.transactions, processTx, cb);

    function processTx(tx, cb) {
      var gasLimitIsHigherThanBlock = new BN(block.header.gasLimit).lt(new BN(tx.gasLimit).add(gasUsed));
      if (gasLimitIsHigherThanBlock) {
        cb(new Error('tx has a higher gas limit than the block'));
        return;
      }

      // run the tx through the VM
      self.runTx({
        tx: tx,
        block: block,
        populateCache: false
      }, parseTxResult);

      function parseTxResult(err, result) {
        txResults.push(result);
        // var receiptResult = new BN(1)

        // abort if error
        if (err) {
          receipts.push(null);
          cb(err);
          return;
        }

        gasUsed = gasUsed.add(result.gasUsed);
        // combine blooms via bitwise OR
        bloom.or(result.bloom);

        if (generateStateRoot) {
          block.header.bloom = bloom.bitvector;
        }

        var txLogs = result.vm.logs || [];

        var rawTxReceipt = [result.vm.exception ? 1 : 0, // result.vm.exception is 0 when an exception occurs, and 1 when it doesn't.  TODO make this the opposite
        gasUsed.toArrayLike(Buffer), result.bloom.bitvector, txLogs];
        var txReceipt = {
          status: rawTxReceipt[0],
          gasUsed: rawTxReceipt[1],
          bitvector: rawTxReceipt[2],
          logs: rawTxReceipt[3]
        };

        receipts.push(txReceipt);
        receiptTrie.put(rlp.encode(validReceiptCount), rlp.encode(rawTxReceipt));
        validReceiptCount++;
        cb();
      }
    }
  }

  // handle results or error from block run
  function parseBlockResults(err) {
    if (err) {
      self.trie.revert();
      cb(err);
      return;
    }

    // credit all block rewards
    payOmmersAndMiner();

    // credit all block rewards
    if (generateStateRoot) {
      block.header.stateRoot = self.trie.root;
    }

    self.trie.commit(function (err) {
      self.stateManager.cache.flush(function () {
        if (validateStateRoot) {
          if (receiptTrie.root && receiptTrie.root.toString('hex') !== block.header.receiptTrie.toString('hex')) {
            err = new Error((err || '') + 'invalid receiptTrie ');
          }
          if (bloom.bitvector.toString('hex') !== block.header.bloom.toString('hex')) {
            err = new Error((err || '') + 'invalid bloom ');
          }
          if (ethUtil.bufferToInt(block.header.gasUsed) !== Number(gasUsed)) {
            err = new Error((err || '') + 'invalid gasUsed ');
          }
          if (self.trie.root.toString('hex') !== block.header.stateRoot.toString('hex')) {
            err = new Error((err || '') + 'invalid block stateRoot ');
          }
        }

        self.stateManager.cache.clear();

        result = {
          receipts: receipts,
          results: txResults,
          error: err
        };

        afterBlock(cb.bind(this, err, result));
      });
    });
  }

  // credit all block rewards
  function payOmmersAndMiner() {
    var ommers = block.uncleHeaders;
    // pay each ommer
    ommers.forEach(rewardOmmer);

    // calculate nibling reward
    var niblingReward = minerReward.divn(32);
    var totalNiblingReward = niblingReward.muln(ommers.length);
    minerAccount = self.stateManager.cache.get(block.header.coinbase);
    // give miner the block reward
    minerAccount.balance = new BN(minerAccount.balance).add(minerReward).add(totalNiblingReward);
    self.stateManager.cache.put(block.header.coinbase, minerAccount);
  }

  // credit ommer
  function rewardOmmer(ommer) {
    // calculate reward
    var heightDiff = new BN(block.header.number).sub(new BN(ommer.number));
    var reward = new BN(8).sub(heightDiff).mul(minerReward.divn(8));

    if (reward.ltn(0)) {
      reward = new BN(0);
    }

    // credit miners account
    var ommerAccount = self.stateManager.cache.get(ommer.coinbase);
    ommerAccount.balance = reward.add(new BN(ommerAccount.balance));
    self.stateManager.cache.put(ommer.coinbase, ommerAccount);
  }
};

/***/ }),
/* 121 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Buffer = __webpack_require__(5).Buffer;
var async = __webpack_require__(2);
var utils = __webpack_require__(0);
var BN = utils.BN;
var Bloom = __webpack_require__(47);
var Block = __webpack_require__(26);

/**
 * Process a transaction. Run the vm. Transfers eth. Checks balances.
 * @method processTx
 * @param opts
 * @param opts.tx {Transaction} - a transaction
 * @param opts.skipNonce - skips the nonce check
 * @param opts.skipBalance - skips the balance check
 * @param opts.block {Block} needed to process the transaction, if no block is given a default one is created
 * @param cb {Function} - the callback
 */
module.exports = function (opts, cb) {
  var self = this;
  var block = opts.block;
  var tx = opts.tx;
  var gasLimit;
  var results;
  var basefee;

  // create a reasonable default if no block is given
  if (!block) {
    block = new Block();
  }

  if (new BN(block.header.gasLimit).lt(new BN(tx.gasLimit))) {
    cb(new Error('tx has a higher gas limit than the block'));
    return;
  }

  if (opts.populateCache === undefined) {
    opts.populateCache = true;
  }

  // run everything
  async.series([populateCache, runTxHook, runCall, saveTries, flushCache, runAfterTxHook], function (err) {
    cb(err, results);
  });

  // run the transaction hook
  function runTxHook(cb) {
    self.emit('beforeTx', tx, cb);
  }

  // run the transaction hook
  function runAfterTxHook(cb) {
    self.emit('afterTx', results, cb);
  }

  /**
   * populates the cache with the 'to' and 'from' of the tx
   */
  function populateCache(cb) {
    var accounts = new Set();
    accounts.add(tx.from.toString('hex'));
    accounts.add(block.header.coinbase.toString('hex'));

    if (tx.to.toString('hex') !== '') {
      accounts.add(tx.to.toString('hex'));
      self.stateManager.touched.push(tx.to);
    }

    if (opts.populateCache === false) {
      return cb();
    }

    self.stateManager.warmCache(accounts, cb);
  }

  // sets up the environment and runs a `call`
  function runCall(cb) {
    // check to the sender's account to make sure it has enough wei and the correct nonce
    var fromAccount = self.stateManager.cache.get(tx.from);
    var message;

    if (!opts.skipBalance && new BN(fromAccount.balance).lt(tx.getUpfrontCost())) {
      message = "sender doesn't have enough funds to send tx. The upfront cost is: " + tx.getUpfrontCost().toString() + ' and the sender\'s account only has: ' + new BN(fromAccount.balance).toString();
      cb(new Error(message));
      return;
    } else if (!opts.skipNonce && !new BN(fromAccount.nonce).eq(new BN(tx.nonce))) {
      message = "the tx doesn't have the correct nonce. account has nonce of: " + new BN(fromAccount.nonce).toString() + ' tx has nonce of: ' + new BN(tx.nonce).toString();
      cb(new Error(message));
      return;
    }

    // increment the nonce
    fromAccount.nonce = new BN(fromAccount.nonce).addn(1);

    basefee = tx.getBaseFee();
    gasLimit = new BN(tx.gasLimit);
    if (gasLimit.lt(basefee)) {
      return cb(new Error('base fee exceeds gas limit'));
    }
    gasLimit.isub(basefee);

    fromAccount.balance = new BN(fromAccount.balance).sub(new BN(tx.gasLimit).mul(new BN(tx.gasPrice)));
    self.stateManager.cache.put(tx.from, fromAccount);

    var options = {
      caller: tx.from,
      gasLimit: gasLimit,
      gasPrice: tx.gasPrice,
      to: tx.to,
      value: tx.value,
      data: tx.data,
      block: block,
      populateCache: false
    };

    if (tx.to.toString('hex') === '') {
      delete options.to;
    }

    // run call
    self.runCall(options, parseResults);

    function parseResults(err, _results) {
      if (err) return cb(err);
      results = _results;

      // generate the bloom for the tx
      results.bloom = txLogsBloom(results.vm.logs);
      fromAccount = self.stateManager.cache.get(tx.from);

      // caculate the total gas used
      results.gasUsed = results.gasUsed.add(basefee);

      // process any gas refund
      results.gasRefund = results.vm.gasRefund;
      if (results.gasRefund) {
        if (results.gasRefund.lt(results.gasUsed.divn(2))) {
          results.gasUsed.isub(results.gasRefund);
        } else {
          results.gasUsed.isub(results.gasUsed.divn(2));
        }
      }

      results.amountSpent = results.gasUsed.mul(new BN(tx.gasPrice));
      // refund the leftover gas amount
      fromAccount.balance = new BN(tx.gasLimit).sub(results.gasUsed).mul(new BN(tx.gasPrice)).add(new BN(fromAccount.balance));

      self.stateManager.cache.put(tx.from, fromAccount);
      self.stateManager.touched.push(tx.from);

      var minerAccount = self.stateManager.cache.get(block.header.coinbase);
      // add the amount spent on gas to the miner's account
      minerAccount.balance = new BN(minerAccount.balance).add(results.amountSpent);

      // save the miner's account
      if (!new BN(minerAccount.balance).isZero()) {
        self.stateManager.cache.put(block.header.coinbase, minerAccount);
      }

      if (!results.vm.selfdestruct) {
        results.vm.selfdestruct = {};
      }

      var keys = Object.keys(results.vm.selfdestruct);

      keys.forEach(function (s) {
        self.stateManager.cache.del(Buffer.from(s, 'hex'));
      });

      // delete all touched accounts
      var touched = self.stateManager.touched;
      async.forEach(touched, function (address, next) {
        self.stateManager.accountIsEmpty(address, function (err, empty) {
          if (err) {
            next(err);
            return;
          }

          if (empty) {
            self.stateManager.cache.del(address);
          }
          next(null);
        });
      }, function () {
        self.stateManager.touched = [];
        cb();
      });
    }
  }

  function saveTries(cb) {
    self.stateManager.commitContracts(cb);
  }

  function flushCache(cb) {
    self.stateManager.cache.flush(function () {
      if (opts.populateCache) {
        self.stateManager.cache.clear();
      }
      cb();
    });
  }
};

/**
 * @method txLogsBloom
 */
function txLogsBloom(logs) {
  var bloom = new Bloom();
  if (logs) {
    for (var i = 0; i < logs.length; i++) {
      var log = logs[i];
      // add the address
      bloom.add(log[0]);
      // add the topics
      var topics = log[1];
      for (var q = 0; q < topics.length; q++) {
        bloom.add(topics[q]);
      }
    }
  }
  return bloom;
}

/***/ }),
/* 122 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Buffer = __webpack_require__(5).Buffer;
var async = __webpack_require__(2);
var ethUtil = __webpack_require__(0);
var BN = ethUtil.BN;
var fees = __webpack_require__(4);
var exceptions = __webpack_require__(6);

var ERROR = exceptions.ERROR;

/**
 * runs a CALL operation
 * @method runCall
 * @param opts
 * @param opts.block {Block}
 * @param opts.caller {Buffer}
 * @param opts.code {Buffer} this is for CALLCODE where the code to load is different than the code from the to account.
 * @param opts.data {Buffer}
 * @param opts.gasLimit {Buffer | BN.js }
 * @param opts.gasPrice {Buffer}
 * @param opts.origin {Buffer} []
 * @param opts.to {Buffer}
 * @param opts.value {Buffer}
 */
module.exports = function (opts, cb) {
  var self = this;
  var stateManager = self.stateManager;

  var vmResults = {};
  var toAccount;
  var toAddress = opts.to;
  var createdAddress;
  var txValue = opts.value || Buffer.from([0]);
  var caller = opts.caller;
  var account = stateManager.cache.get(caller);
  var block = opts.block;
  var code = opts.code;
  var txData = opts.data;
  var gasLimit = opts.gasLimit || new BN(0xffffff);
  gasLimit = new BN(opts.gasLimit); // make sure is a BN
  var gasPrice = opts.gasPrice;
  var gasUsed = new BN(0);
  var origin = opts.origin;
  var isCompiled = opts.compiled;
  var depth = opts.depth;
  // opts.suicides is kept for backward compatiblity with pre-EIP6 syntax
  var selfdestruct = opts.selfdestruct || opts.suicides;
  var delegatecall = opts.delegatecall || false;
  var isStatic = opts.static || false;

  txValue = new BN(txValue);

  stateManager.checkpoint();

  // run and parse
  subTxValue();

  async.series([loadToAccount, loadCode, runCode, saveCode], parseCallResult);

  function loadToAccount(done) {
    // get receiver's account
    // toAccount = stateManager.cache.get(toAddress)
    if (!toAddress) {
      // generate a new contract if no `to`
      code = txData;
      txData = undefined;
      var newNonce = new BN(account.nonce).subn(1);
      createdAddress = toAddress = ethUtil.generateAddress(caller, newNonce.toArray());
      stateManager.getAccount(createdAddress, function (err, account) {
        toAccount = account;
        var NONCE_OFFSET = 1;
        toAccount.nonce = new BN(toAccount.nonce).addn(NONCE_OFFSET).toArrayLike(Buffer);
        done(err);
      });
    } else {
      // else load the `to` account
      toAccount = stateManager.cache.get(toAddress);
      done();
    }
  }

  function subTxValue() {
    if (delegatecall) {
      return;
    }
    account.balance = new BN(account.balance).sub(txValue);
    stateManager.cache.put(caller, account);
  }

  function addTxValue() {
    if (delegatecall) {
      return;
    }
    // add the amount sent to the `to` account
    toAccount.balance = new BN(toAccount.balance).add(txValue);
    stateManager.cache.put(toAddress, toAccount);
    stateManager.touched.push(toAddress);
  }

  function loadCode(cb) {
    addTxValue();
    // loads the contract's code if the account is a contract
    if (code || !(toAccount.isContract() || self._precompiled[toAddress.toString('hex')])) {
      cb();
      return;
    }

    if (self._precompiled[toAddress.toString('hex')]) {
      isCompiled = true;
      code = self._precompiled[toAddress.toString('hex')];
      cb();
      return;
    }

    stateManager.getContractCode(toAddress, function (err, c, comp) {
      if (err) return cb(err);
      isCompiled = comp;
      code = c;
      cb();
    });
  }

  function runCode(cb) {
    if (!code) {
      vmResults.exception = 1;
      stateManager.commit(cb);
      return;
    }

    var runCodeOpts = {
      code: code,
      data: txData,
      gasLimit: gasLimit,
      gasPrice: gasPrice,
      address: toAddress,
      origin: origin,
      caller: caller,
      value: txValue.toArrayLike(Buffer),
      block: block,
      depth: depth,
      selfdestruct: selfdestruct,
      populateCache: false,
      static: isStatic

      // run Code through vm
    };var codeRunner = isCompiled ? self.runJIT : self.runCode;
    codeRunner.call(self, runCodeOpts, parseRunResult);

    function parseRunResult(err, results) {
      toAccount = self.stateManager.cache.get(toAddress);
      vmResults = results;

      if (createdAddress) {
        // fee for size of the return value
        var totalGas = results.gasUsed;
        if (!results.runState.vmError) {
          var returnFee = new BN(results.return.length * fees.createDataGas.v);

          totalGas = totalGas.add(returnFee);
        }
        // if not enough gas
        if (totalGas.lte(gasLimit) && (self.allowUnlimitedContractSize || results.return.length <= 24576)) {
          results.gasUsed = totalGas;
        } else {
          results.return = Buffer.alloc(0);
          // since Homestead
          results.exception = 0;
          err = results.exceptionError = ERROR.OUT_OF_GAS;
          results.gasUsed = gasLimit;
        }
      }

      gasUsed = results.gasUsed;
      if (err) {
        results.logs = [];
        stateManager.revert(cb);
      } else {
        stateManager.commit(cb);
      }
    }
  }

  function saveCode(cb) {
    // store code for a new contract
    if (createdAddress && !vmResults.runState.vmError && vmResults.return && vmResults.return.toString() !== '') {
      stateManager.putContractCode(createdAddress, vmResults.return, cb);
    } else {
      cb();
    }
  }

  function parseCallResult(err) {
    if (err) return cb(err);
    var results = {
      gasUsed: gasUsed,
      createdAddress: createdAddress,
      vm: vmResults
    };

    cb(null, results);
  }
};

/***/ }),
/* 123 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var async = __webpack_require__(2);

/**
 * processes blocks and adds them to the blockchain
 * @method onBlock
 * @param blockchain
 */
module.exports = function (blockchain, cb) {
  var self = this;
  var headBlock, parentState;

  self.blockchain = self.stateManager.blockchain;

  // parse arguments
  if (typeof blockchain === 'function') {
    cb = blockchain;
  } else if (blockchain) {
    self.blockchain = blockchain;
  }

  // setup blockchain iterator
  self.blockchain.iterator('vm', processBlock, cb);
  function processBlock(block, reorg, cb) {
    async.series([getStartingState, runBlock], cb);

    // determine starting state for block run
    function getStartingState(cb) {
      // if we are just starting or if a chain re-org has happened
      if (!headBlock || reorg) {
        self.blockchain.getBlock(block.header.parentHash, function (err, parentBlock) {
          parentState = parentBlock.header.stateRoot;
          // generate genesis state if we are at the genesis block
          // we don't have the genesis state
          if (!headBlock) {
            return self.stateManager.generateCanonicalGenesis(cb);
          } else {
            cb(err);
          }
        });
      } else {
        parentState = headBlock.header.stateRoot;
        cb();
      }
    }

    // run block, update head if valid
    function runBlock(cb) {
      self.runBlock({
        block: block,
        root: parentState
      }, function (err, results) {
        if (err) {
          // remove invalid block
          console.log('Invalid block error:', err);
          self.blockchain.delBlock(block.header.hash(), cb);
        } else {
          // set as new head block
          headBlock = block;
          cb();
        }
      });
    }
  }
};

/***/ }),
/* 124 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const Transaction = __webpack_require__(125)
const ethUtil = __webpack_require__(0)

/**
 * Creates a new transaction object that doesn't need to be signed
 * @constructor
 * @class {Buffer|Array} data a transaction can be initiailized with either a buffer containing the RLP serialized transaction or an array of buffers relating to each of the tx Properties, listed in order below in the exmple. Or lastly an Object containing the Properties of the transaction like in the Usage example
 *
 * For Object and Arrays each of the elements can either be a Buffer, a hex-prefixed (0x) String , Number, or an object with a toBuffer method such as Bignum
 * @example
 * var rawTx = {
 *   nonce: '00',
 *   gasPrice: '09184e72a000',
 *   gasLimit: '2710',
 *   to: '0000000000000000000000000000000000000000',
 *   value: '00',
 *   data: '7f7465737432000000000000000000000000000000000000000000000000000000600057',
 *   v: '1c',
 *   r: '5e1d3a76fbf824220eafc8c79ad578ad2b67d01b0c2425eb1f1347e8f50882ab',
 *   s '5bd428537f05f9830e93792f90ea6a3e2d1ee84952dd96edbae9f658f831ab13'
 * };
 * var tx = new Transaction(rawTx);
 * @prop {Buffer} raw The raw rlp decoded transaction
 * @prop {Buffer} nonce
 * @prop {Buffer} to the to address
 * @prop {Buffer} value the amount of ether sent
 * @prop {Buffer} data this will contain the data of the message or the init of a contract
 * @prop {Buffer} v EC signature parameter
 * @prop {Buffer} r EC signature parameter
 * @prop {Buffer} s EC recovery ID
 */
module.exports = class FakeTransaction extends Transaction {
  constructor (data) {
    super(data)

    var self = this

    /**
     * @prop {Buffer} from (read/write) Set from address to bypass transaction signing.
     */
    Object.defineProperty(this, 'from', {
      enumerable: true,
      configurable: true,
      get: this.getSenderAddress.bind(self),
      set: function (val) {
        self._from = ethUtil.toBuffer(val)
      }
    })

    if (data && data.from) {
      this.from = data.from
    }
  }
}


/***/ }),
/* 125 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

const ethUtil = __webpack_require__(0)
const fees = __webpack_require__(126)
const BN = ethUtil.BN

// secp256k1n/2
const N_DIV_2 = new BN('7fffffffffffffffffffffffffffffff5d576e7357a4501ddfe92f46681b20a0', 16)

/**
 * Creates a new transaction object.
 *
 * @example
 * var rawTx = {
 *   nonce: '00',
 *   gasPrice: '09184e72a000',
 *   gasLimit: '2710',
 *   to: '0000000000000000000000000000000000000000',
 *   value: '00',
 *   data: '7f7465737432000000000000000000000000000000000000000000000000000000600057',
 *   v: '1c',
 *   r: '5e1d3a76fbf824220eafc8c79ad578ad2b67d01b0c2425eb1f1347e8f50882ab',
 *   s: '5bd428537f05f9830e93792f90ea6a3e2d1ee84952dd96edbae9f658f831ab13'
 * };
 * var tx = new Transaction(rawTx);
 *
 * @class
 * @param {Buffer | Array | Object} data a transaction can be initiailized with either a buffer containing the RLP serialized transaction or an array of buffers relating to each of the tx Properties, listed in order below in the exmple.
 *
 * Or lastly an Object containing the Properties of the transaction like in the Usage example.
 *
 * For Object and Arrays each of the elements can either be a Buffer, a hex-prefixed (0x) String , Number, or an object with a toBuffer method such as Bignum
 *
 * @property {Buffer} raw The raw rlp encoded transaction
 * @param {Buffer} data.nonce nonce number
 * @param {Buffer} data.gasLimit transaction gas limit
 * @param {Buffer} data.gasPrice transaction gas price
 * @param {Buffer} data.to to the to address
 * @param {Buffer} data.value the amount of ether sent
 * @param {Buffer} data.data this will contain the data of the message or the init of a contract
 * @param {Buffer} data.v EC signature parameter
 * @param {Buffer} data.r EC signature parameter
 * @param {Buffer} data.s EC recovery ID
 * @param {Number} data.chainId EIP 155 chainId - mainnet: 1, ropsten: 3
 * */

class Transaction {
  constructor (data) {
    data = data || {}
    // Define Properties
    const fields = [{
      name: 'nonce',
      length: 32,
      allowLess: true,
      default: new Buffer([])
    }, {
      name: 'gasPrice',
      length: 32,
      allowLess: true,
      default: new Buffer([])
    }, {
      name: 'gasLimit',
      alias: 'gas',
      length: 32,
      allowLess: true,
      default: new Buffer([])
    }, {
      name: 'to',
      allowZero: true,
      length: 20,
      default: new Buffer([])
    }, {
      name: 'value',
      length: 32,
      allowLess: true,
      default: new Buffer([])
    }, {
      name: 'data',
      alias: 'input',
      allowZero: true,
      default: new Buffer([])
    }, {
      name: 'v',
      allowZero: true,
      default: new Buffer([0x1c])
    }, {
      name: 'r',
      length: 32,
      allowZero: true,
      allowLess: true,
      default: new Buffer([])
    }, {
      name: 's',
      length: 32,
      allowZero: true,
      allowLess: true,
      default: new Buffer([])
    }]

    /**
     * Returns the rlp encoding of the transaction
     * @method serialize
     * @return {Buffer}
     * @memberof Transaction
     * @name serialize
     */
    // attached serialize
    ethUtil.defineProperties(this, fields, data)

    /**
     * @property {Buffer} from (read only) sender address of this transaction, mathematically derived from other parameters.
     * @name from
     * @memberof Transaction
     */
    Object.defineProperty(this, 'from', {
      enumerable: true,
      configurable: true,
      get: this.getSenderAddress.bind(this)
    })

    // calculate chainId from signature
    let sigV = ethUtil.bufferToInt(this.v)
    let chainId = Math.floor((sigV - 35) / 2)
    if (chainId < 0) chainId = 0

    // set chainId
    this._chainId = chainId || data.chainId || 0
    this._homestead = true
  }

  /**
   * If the tx's `to` is to the creation address
   * @return {Boolean}
   */
  toCreationAddress () {
    return this.to.toString('hex') === ''
  }

  /**
   * Computes a sha3-256 hash of the serialized tx
   * @param {Boolean} [includeSignature=true] whether or not to inculde the signature
   * @return {Buffer}
   */
  hash (includeSignature) {
    if (includeSignature === undefined) includeSignature = true

    // EIP155 spec:
    // when computing the hash of a transaction for purposes of signing or recovering,
    // instead of hashing only the first six elements (ie. nonce, gasprice, startgas, to, value, data),
    // hash nine elements, with v replaced by CHAIN_ID, r = 0 and s = 0

    let items
    if (includeSignature) {
      items = this.raw
    } else {
      if (this._chainId > 0) {
        const raw = this.raw.slice()
        this.v = this._chainId
        this.r = 0
        this.s = 0
        items = this.raw
        this.raw = raw
      } else {
        items = this.raw.slice(0, 6)
      }
    }

    // create hash
    return ethUtil.rlphash(items)
  }

  /**
   * returns the public key of the sender
   * @return {Buffer}
   */
  getChainId () {
    return this._chainId
  }

  /**
   * returns the sender's address
   * @return {Buffer}
   */
  getSenderAddress () {
    if (this._from) {
      return this._from
    }
    const pubkey = this.getSenderPublicKey()
    this._from = ethUtil.publicToAddress(pubkey)
    return this._from
  }

  /**
   * returns the public key of the sender
   * @return {Buffer}
   */
  getSenderPublicKey () {
    if (!this._senderPubKey || !this._senderPubKey.length) {
      if (!this.verifySignature()) throw new Error('Invalid Signature')
    }
    return this._senderPubKey
  }

  /**
   * Determines if the signature is valid
   * @return {Boolean}
   */
  verifySignature () {
    const msgHash = this.hash(false)
    // All transaction signatures whose s-value is greater than secp256k1n/2 are considered invalid.
    if (this._homestead && new BN(this.s).cmp(N_DIV_2) === 1) {
      return false
    }

    try {
      let v = ethUtil.bufferToInt(this.v)
      if (this._chainId > 0) {
        v -= this._chainId * 2 + 8
      }
      this._senderPubKey = ethUtil.ecrecover(msgHash, v, this.r, this.s)
    } catch (e) {
      return false
    }

    return !!this._senderPubKey
  }

  /**
   * sign a transaction with a given a private key
   * @param {Buffer} privateKey
   */
  sign (privateKey) {
    const msgHash = this.hash(false)
    const sig = ethUtil.ecsign(msgHash, privateKey)
    if (this._chainId > 0) {
      sig.v += this._chainId * 2 + 8
    }
    Object.assign(this, sig)
  }

  /**
   * The amount of gas paid for the data in this tx
   * @return {BN}
   */
  getDataFee () {
    const data = this.raw[5]
    const cost = new BN(0)
    for (let i = 0; i < data.length; i++) {
      data[i] === 0 ? cost.iaddn(fees.txDataZeroGas.v) : cost.iaddn(fees.txDataNonZeroGas.v)
    }
    return cost
  }

  /**
   * the minimum amount of gas the tx must have (DataFee + TxFee + Creation Fee)
   * @return {BN}
   */
  getBaseFee () {
    const fee = this.getDataFee().iaddn(fees.txGas.v)
    if (this._homestead && this.toCreationAddress()) {
      fee.iaddn(fees.txCreation.v)
    }
    return fee
  }

  /**
   * the up front amount that an account must have for this transaction to be valid
   * @return {BN}
   */
  getUpfrontCost () {
    return new BN(this.gasLimit)
      .imul(new BN(this.gasPrice))
      .iadd(new BN(this.value))
  }

  /**
   * validates the signature and checks to see if it has enough gas
   * @param {Boolean} [stringError=false] whether to return a string with a dscription of why the validation failed or return a Bloolean
   * @return {Boolean|String}
   */
  validate (stringError) {
    const errors = []
    if (!this.verifySignature()) {
      errors.push('Invalid Signature')
    }

    if (this.getBaseFee().cmp(new BN(this.gasLimit)) > 0) {
      errors.push([`gas limit is too low. Need at least ${this.getBaseFee()}`])
    }

    if (stringError === undefined || stringError === false) {
      return errors.length === 0
    } else {
      return errors.join(' ')
    }
  }
}

module.exports = Transaction


/***/ }),
/* 126 */
/***/ (function(module, exports) {

module.exports = {"genesisGasLimit":{"v":5000,"d":"Gas limit of the Genesis block."},"genesisDifficulty":{"v":17179869184,"d":"Difficulty of the Genesis block."},"genesisNonce":{"v":"0x0000000000000042","d":"the geneis nonce"},"genesisExtraData":{"v":"0x11bbe8db4e347b4e8c937c1c8370e4b5ed33adb3db69cbdb7a38e1e50b1b82fa","d":"extra data "},"genesisHash":{"v":"0xd4e56740f876aef8c010b86a40d5f56745a118d0906a34e69aec8c0db1cb8fa3","d":"genesis hash"},"genesisStateRoot":{"v":"0xd7f8974fb5ac78d9ac099b9ad5018bedc2ce0a72dad1827a1709da30580f0544","d":"the genesis state root"},"minGasLimit":{"v":5000,"d":"Minimum the gas limit may ever be."},"gasLimitBoundDivisor":{"v":1024,"d":"The bound divisor of the gas limit, used in update calculations."},"minimumDifficulty":{"v":131072,"d":"The minimum that the difficulty may ever be."},"difficultyBoundDivisor":{"v":2048,"d":"The bound divisor of the difficulty, used in the update calculations."},"durationLimit":{"v":13,"d":"The decision boundary on the blocktime duration used to determine whether difficulty should go up or not."},"maximumExtraDataSize":{"v":32,"d":"Maximum size extra data may be after Genesis."},"epochDuration":{"v":30000,"d":"Duration between proof-of-work epochs."},"stackLimit":{"v":1024,"d":"Maximum size of VM stack allowed."},"callCreateDepth":{"v":1024,"d":"Maximum depth of call/create stack."},"tierStepGas":{"v":[0,2,3,5,8,10,20],"d":"Once per operation, for a selection of them."},"expGas":{"v":10,"d":"Once per EXP instuction."},"expByteGas":{"v":10,"d":"Times ceil(log256(exponent)) for the EXP instruction."},"sha3Gas":{"v":30,"d":"Once per SHA3 operation."},"sha3WordGas":{"v":6,"d":"Once per word of the SHA3 operation's data."},"sloadGas":{"v":50,"d":"Once per SLOAD operation."},"sstoreSetGas":{"v":20000,"d":"Once per SSTORE operation if the zeroness changes from zero."},"sstoreResetGas":{"v":5000,"d":"Once per SSTORE operation if the zeroness does not change from zero."},"sstoreRefundGas":{"v":15000,"d":"Once per SSTORE operation if the zeroness changes to zero."},"jumpdestGas":{"v":1,"d":"Refunded gas, once per SSTORE operation if the zeroness changes to zero."},"logGas":{"v":375,"d":"Per LOG* operation."},"logDataGas":{"v":8,"d":"Per byte in a LOG* operation's data."},"logTopicGas":{"v":375,"d":"Multiplied by the * of the LOG*, per LOG transaction. e.g. LOG0 incurs 0 * c_txLogTopicGas, LOG4 incurs 4 * c_txLogTopicGas."},"createGas":{"v":32000,"d":"Once per CREATE operation & contract-creation transaction."},"callGas":{"v":40,"d":"Once per CALL operation & message call transaction."},"callStipend":{"v":2300,"d":"Free gas given at beginning of call."},"callValueTransferGas":{"v":9000,"d":"Paid for CALL when the value transfor is non-zero."},"callNewAccountGas":{"v":25000,"d":"Paid for CALL when the destination address didn't exist prior."},"suicideRefundGas":{"v":24000,"d":"Refunded following a suicide operation."},"memoryGas":{"v":3,"d":"Times the address of the (highest referenced byte in memory + 1). NOTE: referencing happens on read, write and in instructions such as RETURN and CALL."},"quadCoeffDiv":{"v":512,"d":"Divisor for the quadratic particle of the memory cost equation."},"createDataGas":{"v":200,"d":""},"txGas":{"v":21000,"d":"Per transaction. NOTE: Not payable on data of calls between transactions."},"txCreation":{"v":32000,"d":"the cost of creating a contract via tx"},"txDataZeroGas":{"v":4,"d":"Per byte of data attached to a transaction that equals zero. NOTE: Not payable on data of calls between transactions."},"txDataNonZeroGas":{"v":68,"d":"Per byte of data attached to a transaction that is not equal to zero. NOTE: Not payable on data of calls between transactions."},"copyGas":{"v":3,"d":"Multiplied by the number of 32-byte words that are copied (round up) for any *COPY operation and added."},"ecrecoverGas":{"v":3000,"d":""},"sha256Gas":{"v":60,"d":""},"sha256WordGas":{"v":12,"d":""},"ripemd160Gas":{"v":600,"d":""},"ripemd160WordGas":{"v":120,"d":""},"identityGas":{"v":15,"d":""},"identityWordGas":{"v":3,"d":""},"minerReward":{"v":"5000000000000000000","d":"the amount a miner get rewarded for mining a block"},"ommerReward":{"v":"625000000000000000","d":"The amount of wei a miner of an uncle block gets for being inculded in the blockchain"},"niblingReward":{"v":"156250000000000000","d":"the amount a miner gets for inculding a uncle"},"homeSteadForkNumber":{"v":1150000,"d":"the block that the Homestead fork started at"},"homesteadRepriceForkNumber":{"v":2463000,"d":"the block that the Homestead Reprice (EIP150) fork started at"},"timebombPeriod":{"v":100000,"d":"Exponential difficulty timebomb period"},"freeBlockPeriod":{"v":2}}

/***/ }),
/* 127 */
/***/ (function(module, exports) {

module.exports = assert

function assert(condition, message) {
    if (!condition) {
        throw message || "Assertion failed";
    }
}


/***/ }),
/* 128 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = parallelLimit;

var _eachOf = __webpack_require__(129);

var _eachOf2 = _interopRequireDefault(_eachOf);

var _parallel = __webpack_require__(154);

var _parallel2 = _interopRequireDefault(_parallel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Run the `tasks` collection of functions in parallel, without waiting until
 * the previous function has completed. If any of the functions pass an error to
 * its callback, the main `callback` is immediately called with the value of the
 * error. Once the `tasks` have completed, the results are passed to the final
 * `callback` as an array.
 *
 * **Note:** `parallel` is about kicking-off I/O tasks in parallel, not about
 * parallel execution of code.  If your tasks do not use any timers or perform
 * any I/O, they will actually be executed in series.  Any synchronous setup
 * sections for each task will happen one after the other.  JavaScript remains
 * single-threaded.
 *
 * **Hint:** Use [`reflect`]{@link module:Utils.reflect} to continue the
 * execution of other tasks when a task fails.
 *
 * It is also possible to use an object instead of an array. Each property will
 * be run as a function and the results will be passed to the final `callback`
 * as an object instead of an array. This can be a more readable way of handling
 * results from {@link async.parallel}.
 *
 * @name parallel
 * @static
 * @memberOf module:ControlFlow
 * @method
 * @category Control Flow
 * @param {Array|Iterable|Object} tasks - A collection of
 * [async functions]{@link AsyncFunction} to run.
 * Each async function can complete with any number of optional `result` values.
 * @param {Function} [callback] - An optional callback to run once all the
 * functions have completed successfully. This function gets a results array
 * (or object) containing all the result arguments passed to the task callbacks.
 * Invoked with (err, results).
 *
 * @example
 * async.parallel([
 *     function(callback) {
 *         setTimeout(function() {
 *             callback(null, 'one');
 *         }, 200);
 *     },
 *     function(callback) {
 *         setTimeout(function() {
 *             callback(null, 'two');
 *         }, 100);
 *     }
 * ],
 * // optional callback
 * function(err, results) {
 *     // the results array will equal ['one','two'] even though
 *     // the second function had a shorter timeout.
 * });
 *
 * // an example using an object instead of an array
 * async.parallel({
 *     one: function(callback) {
 *         setTimeout(function() {
 *             callback(null, 1);
 *         }, 200);
 *     },
 *     two: function(callback) {
 *         setTimeout(function() {
 *             callback(null, 2);
 *         }, 100);
 *     }
 * }, function(err, results) {
 *     // results is now equals to: {one: 1, two: 2}
 * });
 */
function parallelLimit(tasks, callback) {
  (0, _parallel2.default)(_eachOf2.default, tasks, callback);
}
module.exports = exports['default'];

/***/ }),
/* 129 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (coll, iteratee, callback) {
    var eachOfImplementation = (0, _isArrayLike2.default)(coll) ? eachOfArrayLike : eachOfGeneric;
    eachOfImplementation(coll, (0, _wrapAsync2.default)(iteratee), callback);
};

var _isArrayLike = __webpack_require__(19);

var _isArrayLike2 = _interopRequireDefault(_isArrayLike);

var _breakLoop = __webpack_require__(56);

var _breakLoop2 = _interopRequireDefault(_breakLoop);

var _eachOfLimit = __webpack_require__(133);

var _eachOfLimit2 = _interopRequireDefault(_eachOfLimit);

var _doLimit = __webpack_require__(153);

var _doLimit2 = _interopRequireDefault(_doLimit);

var _noop = __webpack_require__(12);

var _noop2 = _interopRequireDefault(_noop);

var _once = __webpack_require__(27);

var _once2 = _interopRequireDefault(_once);

var _onlyOnce = __webpack_require__(18);

var _onlyOnce2 = _interopRequireDefault(_onlyOnce);

var _wrapAsync = __webpack_require__(13);

var _wrapAsync2 = _interopRequireDefault(_wrapAsync);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// eachOf implementation optimized for array-likes
function eachOfArrayLike(coll, iteratee, callback) {
    callback = (0, _once2.default)(callback || _noop2.default);
    var index = 0,
        completed = 0,
        length = coll.length;
    if (length === 0) {
        callback(null);
    }

    function iteratorCallback(err, value) {
        if (err) {
            callback(err);
        } else if (++completed === length || value === _breakLoop2.default) {
            callback(null);
        }
    }

    for (; index < length; index++) {
        iteratee(coll[index], index, (0, _onlyOnce2.default)(iteratorCallback));
    }
}

// a generic version of eachOf which can handle array, object, and iterator cases.
var eachOfGeneric = (0, _doLimit2.default)(_eachOfLimit2.default, Infinity);

/**
 * Like [`each`]{@link module:Collections.each}, except that it passes the key (or index) as the second argument
 * to the iteratee.
 *
 * @name eachOf
 * @static
 * @memberOf module:Collections
 * @method
 * @alias forEachOf
 * @category Collection
 * @see [async.each]{@link module:Collections.each}
 * @param {Array|Iterable|Object} coll - A collection to iterate over.
 * @param {AsyncFunction} iteratee - A function to apply to each
 * item in `coll`.
 * The `key` is the item's key, or index in the case of an array.
 * Invoked with (item, key, callback).
 * @param {Function} [callback] - A callback which is called when all
 * `iteratee` functions have finished, or an error occurs. Invoked with (err).
 * @example
 *
 * var obj = {dev: "/dev.json", test: "/test.json", prod: "/prod.json"};
 * var configs = {};
 *
 * async.forEachOf(obj, function (value, key, callback) {
 *     fs.readFile(__dirname + value, "utf8", function (err, data) {
 *         if (err) return callback(err);
 *         try {
 *             configs[key] = JSON.parse(data);
 *         } catch (e) {
 *             return callback(e);
 *         }
 *         callback();
 *     });
 * }, function (err) {
 *     if (err) console.error(err.message);
 *     // configs is now a map of JSON data
 *     doSomethingWith(configs);
 * });
 */
module.exports = exports['default'];

/***/ }),
/* 130 */
/***/ (function(module, exports, __webpack_require__) {

var baseGetTag = __webpack_require__(28),
    isObject = __webpack_require__(45);

/** `Object#toString` result references. */
var asyncTag = '[object AsyncFunction]',
    funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]',
    proxyTag = '[object Proxy]';

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  if (!isObject(value)) {
    return false;
  }
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 9 which returns 'object' for typed arrays and other constructors.
  var tag = baseGetTag(value);
  return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
}

module.exports = isFunction;


/***/ }),
/* 131 */
/***/ (function(module, exports, __webpack_require__) {

var Symbol = __webpack_require__(52);

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/** Built-in value references. */
var symToStringTag = Symbol ? Symbol.toStringTag : undefined;

/**
 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the raw `toStringTag`.
 */
function getRawTag(value) {
  var isOwn = hasOwnProperty.call(value, symToStringTag),
      tag = value[symToStringTag];

  try {
    value[symToStringTag] = undefined;
    var unmasked = true;
  } catch (e) {}

  var result = nativeObjectToString.call(value);
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag] = tag;
    } else {
      delete value[symToStringTag];
    }
  }
  return result;
}

module.exports = getRawTag;


/***/ }),
/* 132 */
/***/ (function(module, exports) {

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/**
 * Converts `value` to a string using `Object.prototype.toString`.
 *
 * @private
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 */
function objectToString(value) {
  return nativeObjectToString.call(value);
}

module.exports = objectToString;


/***/ }),
/* 133 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = eachOfLimit;

var _eachOfLimit2 = __webpack_require__(134);

var _eachOfLimit3 = _interopRequireDefault(_eachOfLimit2);

var _wrapAsync = __webpack_require__(13);

var _wrapAsync2 = _interopRequireDefault(_wrapAsync);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * The same as [`eachOf`]{@link module:Collections.eachOf} but runs a maximum of `limit` async operations at a
 * time.
 *
 * @name eachOfLimit
 * @static
 * @memberOf module:Collections
 * @method
 * @see [async.eachOf]{@link module:Collections.eachOf}
 * @alias forEachOfLimit
 * @category Collection
 * @param {Array|Iterable|Object} coll - A collection to iterate over.
 * @param {number} limit - The maximum number of async operations at a time.
 * @param {AsyncFunction} iteratee - An async function to apply to each
 * item in `coll`. The `key` is the item's key, or index in the case of an
 * array.
 * Invoked with (item, key, callback).
 * @param {Function} [callback] - A callback which is called when all
 * `iteratee` functions have finished, or an error occurs. Invoked with (err).
 */
function eachOfLimit(coll, limit, iteratee, callback) {
  (0, _eachOfLimit3.default)(limit)(coll, (0, _wrapAsync2.default)(iteratee), callback);
}
module.exports = exports['default'];

/***/ }),
/* 134 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = _eachOfLimit;

var _noop = __webpack_require__(12);

var _noop2 = _interopRequireDefault(_noop);

var _once = __webpack_require__(27);

var _once2 = _interopRequireDefault(_once);

var _iterator = __webpack_require__(135);

var _iterator2 = _interopRequireDefault(_iterator);

var _onlyOnce = __webpack_require__(18);

var _onlyOnce2 = _interopRequireDefault(_onlyOnce);

var _breakLoop = __webpack_require__(56);

var _breakLoop2 = _interopRequireDefault(_breakLoop);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _eachOfLimit(limit) {
    return function (obj, iteratee, callback) {
        callback = (0, _once2.default)(callback || _noop2.default);
        if (limit <= 0 || !obj) {
            return callback(null);
        }
        var nextElem = (0, _iterator2.default)(obj);
        var done = false;
        var running = 0;

        function iterateeCallback(err, value) {
            running -= 1;
            if (err) {
                done = true;
                callback(err);
            } else if (value === _breakLoop2.default || done && running <= 0) {
                done = true;
                return callback(null);
            } else {
                replenish();
            }
        }

        function replenish() {
            while (running < limit && !done) {
                var elem = nextElem();
                if (elem === null) {
                    done = true;
                    if (running <= 0) {
                        callback(null);
                    }
                    return;
                }
                running += 1;
                iteratee(elem.value, elem.key, (0, _onlyOnce2.default)(iterateeCallback));
            }
        }

        replenish();
    };
}
module.exports = exports['default'];

/***/ }),
/* 135 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = iterator;

var _isArrayLike = __webpack_require__(19);

var _isArrayLike2 = _interopRequireDefault(_isArrayLike);

var _getIterator = __webpack_require__(136);

var _getIterator2 = _interopRequireDefault(_getIterator);

var _keys = __webpack_require__(137);

var _keys2 = _interopRequireDefault(_keys);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createArrayIterator(coll) {
    var i = -1;
    var len = coll.length;
    return function next() {
        return ++i < len ? { value: coll[i], key: i } : null;
    };
}

function createES2015Iterator(iterator) {
    var i = -1;
    return function next() {
        var item = iterator.next();
        if (item.done) return null;
        i++;
        return { value: item.value, key: i };
    };
}

function createObjectIterator(obj) {
    var okeys = (0, _keys2.default)(obj);
    var i = -1;
    var len = okeys.length;
    return function next() {
        var key = okeys[++i];
        return i < len ? { value: obj[key], key: key } : null;
    };
}

function iterator(coll) {
    if ((0, _isArrayLike2.default)(coll)) {
        return createArrayIterator(coll);
    }

    var iterator = (0, _getIterator2.default)(coll);
    return iterator ? createES2015Iterator(iterator) : createObjectIterator(coll);
}
module.exports = exports['default'];

/***/ }),
/* 136 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (coll) {
    return iteratorSymbol && coll[iteratorSymbol] && coll[iteratorSymbol]();
};

var iteratorSymbol = typeof Symbol === 'function' && Symbol.iterator;

module.exports = exports['default'];

/***/ }),
/* 137 */
/***/ (function(module, exports, __webpack_require__) {

var arrayLikeKeys = __webpack_require__(138),
    baseKeys = __webpack_require__(149),
    isArrayLike = __webpack_require__(19);

/**
 * Creates an array of the own enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects. See the
 * [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
 * for more details.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keys(new Foo);
 * // => ['a', 'b'] (iteration order is not guaranteed)
 *
 * _.keys('hi');
 * // => ['0', '1']
 */
function keys(object) {
  return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
}

module.exports = keys;


/***/ }),
/* 138 */
/***/ (function(module, exports, __webpack_require__) {

var baseTimes = __webpack_require__(139),
    isArguments = __webpack_require__(140),
    isArray = __webpack_require__(51),
    isBuffer = __webpack_require__(142),
    isIndex = __webpack_require__(144),
    isTypedArray = __webpack_require__(145);

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Creates an array of the enumerable property names of the array-like `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @param {boolean} inherited Specify returning inherited property names.
 * @returns {Array} Returns the array of property names.
 */
function arrayLikeKeys(value, inherited) {
  var isArr = isArray(value),
      isArg = !isArr && isArguments(value),
      isBuff = !isArr && !isArg && isBuffer(value),
      isType = !isArr && !isArg && !isBuff && isTypedArray(value),
      skipIndexes = isArr || isArg || isBuff || isType,
      result = skipIndexes ? baseTimes(value.length, String) : [],
      length = result.length;

  for (var key in value) {
    if ((inherited || hasOwnProperty.call(value, key)) &&
        !(skipIndexes && (
           // Safari 9 has enumerable `arguments.length` in strict mode.
           key == 'length' ||
           // Node.js 0.10 has enumerable non-index properties on buffers.
           (isBuff && (key == 'offset' || key == 'parent')) ||
           // PhantomJS 2 has enumerable non-index properties on typed arrays.
           (isType && (key == 'buffer' || key == 'byteLength' || key == 'byteOffset')) ||
           // Skip index properties.
           isIndex(key, length)
        ))) {
      result.push(key);
    }
  }
  return result;
}

module.exports = arrayLikeKeys;


/***/ }),
/* 139 */
/***/ (function(module, exports) {

/**
 * The base implementation of `_.times` without support for iteratee shorthands
 * or max array length checks.
 *
 * @private
 * @param {number} n The number of times to invoke `iteratee`.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the array of results.
 */
function baseTimes(n, iteratee) {
  var index = -1,
      result = Array(n);

  while (++index < n) {
    result[index] = iteratee(index);
  }
  return result;
}

module.exports = baseTimes;


/***/ }),
/* 140 */
/***/ (function(module, exports, __webpack_require__) {

var baseIsArguments = __webpack_require__(141),
    isObjectLike = __webpack_require__(29);

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/** Built-in value references. */
var propertyIsEnumerable = objectProto.propertyIsEnumerable;

/**
 * Checks if `value` is likely an `arguments` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 *  else `false`.
 * @example
 *
 * _.isArguments(function() { return arguments; }());
 * // => true
 *
 * _.isArguments([1, 2, 3]);
 * // => false
 */
var isArguments = baseIsArguments(function() { return arguments; }()) ? baseIsArguments : function(value) {
  return isObjectLike(value) && hasOwnProperty.call(value, 'callee') &&
    !propertyIsEnumerable.call(value, 'callee');
};

module.exports = isArguments;


/***/ }),
/* 141 */
/***/ (function(module, exports, __webpack_require__) {

var baseGetTag = __webpack_require__(28),
    isObjectLike = __webpack_require__(29);

/** `Object#toString` result references. */
var argsTag = '[object Arguments]';

/**
 * The base implementation of `_.isArguments`.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 */
function baseIsArguments(value) {
  return isObjectLike(value) && baseGetTag(value) == argsTag;
}

module.exports = baseIsArguments;


/***/ }),
/* 142 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {var root = __webpack_require__(53),
    stubFalse = __webpack_require__(143);

/** Detect free variable `exports`. */
var freeExports = typeof exports == 'object' && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && typeof module == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/** Built-in value references. */
var Buffer = moduleExports ? root.Buffer : undefined;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined;

/**
 * Checks if `value` is a buffer.
 *
 * @static
 * @memberOf _
 * @since 4.3.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
 * @example
 *
 * _.isBuffer(new Buffer(2));
 * // => true
 *
 * _.isBuffer(new Uint8Array(2));
 * // => false
 */
var isBuffer = nativeIsBuffer || stubFalse;

module.exports = isBuffer;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(57)(module)))

/***/ }),
/* 143 */
/***/ (function(module, exports) {

/**
 * This method returns `false`.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {boolean} Returns `false`.
 * @example
 *
 * _.times(2, _.stubFalse);
 * // => [false, false]
 */
function stubFalse() {
  return false;
}

module.exports = stubFalse;


/***/ }),
/* 144 */
/***/ (function(module, exports) {

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

/** Used to detect unsigned integer values. */
var reIsUint = /^(?:0|[1-9]\d*)$/;

/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */
function isIndex(value, length) {
  length = length == null ? MAX_SAFE_INTEGER : length;
  return !!length &&
    (typeof value == 'number' || reIsUint.test(value)) &&
    (value > -1 && value % 1 == 0 && value < length);
}

module.exports = isIndex;


/***/ }),
/* 145 */
/***/ (function(module, exports, __webpack_require__) {

var baseIsTypedArray = __webpack_require__(146),
    baseUnary = __webpack_require__(147),
    nodeUtil = __webpack_require__(148);

/* Node.js helper references. */
var nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;

/**
 * Checks if `value` is classified as a typed array.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 * @example
 *
 * _.isTypedArray(new Uint8Array);
 * // => true
 *
 * _.isTypedArray([]);
 * // => false
 */
var isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;

module.exports = isTypedArray;


/***/ }),
/* 146 */
/***/ (function(module, exports, __webpack_require__) {

var baseGetTag = __webpack_require__(28),
    isLength = __webpack_require__(55),
    isObjectLike = __webpack_require__(29);

/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
    arrayTag = '[object Array]',
    boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    errorTag = '[object Error]',
    funcTag = '[object Function]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    objectTag = '[object Object]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    weakMapTag = '[object WeakMap]';

var arrayBufferTag = '[object ArrayBuffer]',
    dataViewTag = '[object DataView]',
    float32Tag = '[object Float32Array]',
    float64Tag = '[object Float64Array]',
    int8Tag = '[object Int8Array]',
    int16Tag = '[object Int16Array]',
    int32Tag = '[object Int32Array]',
    uint8Tag = '[object Uint8Array]',
    uint8ClampedTag = '[object Uint8ClampedArray]',
    uint16Tag = '[object Uint16Array]',
    uint32Tag = '[object Uint32Array]';

/** Used to identify `toStringTag` values of typed arrays. */
var typedArrayTags = {};
typedArrayTags[float32Tag] = typedArrayTags[float64Tag] =
typedArrayTags[int8Tag] = typedArrayTags[int16Tag] =
typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] =
typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] =
typedArrayTags[uint32Tag] = true;
typedArrayTags[argsTag] = typedArrayTags[arrayTag] =
typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] =
typedArrayTags[dataViewTag] = typedArrayTags[dateTag] =
typedArrayTags[errorTag] = typedArrayTags[funcTag] =
typedArrayTags[mapTag] = typedArrayTags[numberTag] =
typedArrayTags[objectTag] = typedArrayTags[regexpTag] =
typedArrayTags[setTag] = typedArrayTags[stringTag] =
typedArrayTags[weakMapTag] = false;

/**
 * The base implementation of `_.isTypedArray` without Node.js optimizations.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 */
function baseIsTypedArray(value) {
  return isObjectLike(value) &&
    isLength(value.length) && !!typedArrayTags[baseGetTag(value)];
}

module.exports = baseIsTypedArray;


/***/ }),
/* 147 */
/***/ (function(module, exports) {

/**
 * The base implementation of `_.unary` without support for storing metadata.
 *
 * @private
 * @param {Function} func The function to cap arguments for.
 * @returns {Function} Returns the new capped function.
 */
function baseUnary(func) {
  return function(value) {
    return func(value);
  };
}

module.exports = baseUnary;


/***/ }),
/* 148 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {var freeGlobal = __webpack_require__(54);

/** Detect free variable `exports`. */
var freeExports = typeof exports == 'object' && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && typeof module == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/** Detect free variable `process` from Node.js. */
var freeProcess = moduleExports && freeGlobal.process;

/** Used to access faster Node.js helpers. */
var nodeUtil = (function() {
  try {
    return freeProcess && freeProcess.binding && freeProcess.binding('util');
  } catch (e) {}
}());

module.exports = nodeUtil;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(57)(module)))

/***/ }),
/* 149 */
/***/ (function(module, exports, __webpack_require__) {

var isPrototype = __webpack_require__(150),
    nativeKeys = __webpack_require__(151);

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function baseKeys(object) {
  if (!isPrototype(object)) {
    return nativeKeys(object);
  }
  var result = [];
  for (var key in Object(object)) {
    if (hasOwnProperty.call(object, key) && key != 'constructor') {
      result.push(key);
    }
  }
  return result;
}

module.exports = baseKeys;


/***/ }),
/* 150 */
/***/ (function(module, exports) {

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Checks if `value` is likely a prototype object.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
 */
function isPrototype(value) {
  var Ctor = value && value.constructor,
      proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto;

  return value === proto;
}

module.exports = isPrototype;


/***/ }),
/* 151 */
/***/ (function(module, exports, __webpack_require__) {

var overArg = __webpack_require__(152);

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeKeys = overArg(Object.keys, Object);

module.exports = nativeKeys;


/***/ }),
/* 152 */
/***/ (function(module, exports) {

/**
 * Creates a unary function that invokes `func` with its argument transformed.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {Function} transform The argument transform.
 * @returns {Function} Returns the new function.
 */
function overArg(func, transform) {
  return function(arg) {
    return func(transform(arg));
  };
}

module.exports = overArg;


/***/ }),
/* 153 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = doLimit;
function doLimit(fn, limit) {
    return function (iterable, iteratee, callback) {
        return fn(iterable, limit, iteratee, callback);
    };
}
module.exports = exports["default"];

/***/ }),
/* 154 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = _parallel;

var _noop = __webpack_require__(12);

var _noop2 = _interopRequireDefault(_noop);

var _isArrayLike = __webpack_require__(19);

var _isArrayLike2 = _interopRequireDefault(_isArrayLike);

var _slice = __webpack_require__(14);

var _slice2 = _interopRequireDefault(_slice);

var _wrapAsync = __webpack_require__(13);

var _wrapAsync2 = _interopRequireDefault(_wrapAsync);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _parallel(eachfn, tasks, callback) {
    callback = callback || _noop2.default;
    var results = (0, _isArrayLike2.default)(tasks) ? [] : {};

    eachfn(tasks, function (task, key, callback) {
        (0, _wrapAsync2.default)(task)(function (err, result) {
            if (arguments.length > 2) {
                result = (0, _slice2.default)(arguments, 1);
            }
            results[key] = result;
            callback(err);
        });
    }, function (err) {
        callback(err, results);
    });
}
module.exports = exports['default'];

/***/ }),
/* 155 */
/***/ (function(module, exports) {

module.exports = require("eth-sig-util");

/***/ }),
/* 156 */
/***/ (function(module, exports, __webpack_require__) {

const createPayload = __webpack_require__(8)

module.exports = estimateGas

/*

This is a work around for https://github.com/ethereum/go-ethereum/issues/2577

*/


function estimateGas(provider, txParams, cb) {
  provider.sendAsync(createPayload({
    method: 'eth_estimateGas',
    params: [txParams]
  }), function(err, res){
    if (err) {
      // handle simple value transfer case
      if (err.message === 'no contract code at given address') {
        return cb(null, '0xcf08')
      } else {
        return cb(err)        
      }
    }
    cb(null, res.result)
  })
}

/***/ }),
/* 157 */
/***/ (function(module, exports) {

module.exports = require("ethereumjs-tx");

/***/ }),
/* 158 */
/***/ (function(module, exports, __webpack_require__) {

const xhr = process.browser ? __webpack_require__(159) : __webpack_require__(160)
const inherits = __webpack_require__(1).inherits
const createPayload = __webpack_require__(8)
const Subprovider = __webpack_require__(3)
const JsonRpcError = __webpack_require__(30)


module.exports = RpcSource

inherits(RpcSource, Subprovider)

function RpcSource(opts) {
  const self = this
  self.rpcUrl = opts.rpcUrl
}

RpcSource.prototype.handleRequest = function(payload, next, end){
  const self = this
  const targetUrl = self.rpcUrl

  // overwrite id to conflict with other concurrent users
  let newPayload = createPayload(payload)

  xhr({
    uri: targetUrl,
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newPayload),
    rejectUnauthorized: false,
  }, function(err, res, body) {
    if (err) return end(new JsonRpcError.InternalError(err))

    // check for error code
    switch (res.statusCode) {
      case 405:
        return end(new JsonRpcError.MethodNotFound())
      case 504: // Gateway timeout
        let msg = `Gateway timeout. The request took too long to process. `
        msg += `This can happen when querying logs over too wide a block range.`
        const err = new Error(msg)
        return end(new JsonRpcError.InternalError(err))
      default:
        if (res.statusCode != 200) {
          return end(new JsonRpcError.InternalError(res.body))
        }
    }

    // parse response
    let data
    try {
      data = JSON.parse(body)
    } catch (err) {
      console.error(err.stack)
      return end(new JsonRpcError.InternalError(err))
    }
    if (data.error) return end(data.error)

    end(null, data.result)
  })

}


/***/ }),
/* 159 */
/***/ (function(module, exports) {

module.exports = require("xhr");

/***/ }),
/* 160 */
/***/ (function(module, exports) {

module.exports = require("request");

/***/ }),
/* 161 */
/***/ (function(module, exports, __webpack_require__) {

const ProviderEngine = __webpack_require__(40)
const DefaultFixture = __webpack_require__(162)
const NonceTrackerSubprovider = __webpack_require__(58)
const CacheSubprovider = __webpack_require__(41)
const FilterSubprovider = __webpack_require__(24)
const SubscriptionSubprovider = __webpack_require__(164)
const InflightCacheSubprovider = __webpack_require__(165)
const HookedWalletSubprovider = __webpack_require__(49)
const SanitizingSubprovider = __webpack_require__(166)
const InfuraSubprovider = __webpack_require__(167)
const FetchSubprovider = __webpack_require__(174)
const WebSocketSubprovider = __webpack_require__(177)
const VMSubprovider = __webpack_require__(43)



module.exports = ZeroClientProvider


function ZeroClientProvider(opts = {}){
  const connectionType = getConnectionType(opts)

  const engine = new ProviderEngine(opts.engineParams)

  // static
  const staticSubprovider = new DefaultFixture(opts.static)
  engine.addProvider(staticSubprovider)

  //vm provider
  engine.addProvider(new VMSubprovider())


  // nonce tracker
  engine.addProvider(new NonceTrackerSubprovider())

  // sanitization
  const sanitizer = new SanitizingSubprovider()
  engine.addProvider(sanitizer)

  // cache layer
  const cacheSubprovider = new CacheSubprovider()
  engine.addProvider(cacheSubprovider)

//   // filters + subscriptions
//   // for websockets, only polyfill filters
//   if (connectionType === 'ws') {
//     const filterSubprovider = new FilterSubprovider()
//     engine.addProvider(filterSubprovider)
//   // otherwise, polyfill both subscriptions and filters
//   } else {
//     const filterAndSubsSubprovider = new SubscriptionSubprovider()
//     // forward subscription events through provider
//     filterAndSubsSubprovider.on('data', (err, notification) => {
//       engine.emit('data', err, notification)
//     })
//     engine.addProvider(filterAndSubsSubprovider)
//   }

  // inflight cache
  const inflightCache = new InflightCacheSubprovider()
  engine.addProvider(inflightCache)

//   // id mgmt
//   const idmgmtSubprovider = new HookedWalletSubprovider({
//     // accounts
//     getAccounts: opts.getAccounts,
//     // transactions
//     processTransaction: opts.processTransaction,
//     approveTransaction: opts.approveTransaction,
//     signTransaction: opts.signTransaction,
//     publishTransaction: opts.publishTransaction,
//     // messages
//     // old eth_sign
//     processMessage: opts.processMessage,
//     approveMessage: opts.approveMessage,
//     signMessage: opts.signMessage,
//     // new personal_sign
//     processPersonalMessage: opts.processPersonalMessage,
//     processTypedMessage: opts.processTypedMessage,
//     approvePersonalMessage: opts.approvePersonalMessage,
//     approveTypedMessage: opts.approveTypedMessage,
//     signPersonalMessage: opts.signPersonalMessage,
//     signTypedMessage: opts.signTypedMessage,
//     personalRecoverSigner: opts.personalRecoverSigner,
//   })
//   engine.addProvider(idmgmtSubprovider)

  // data source
  const dataSubprovider = opts.dataSubprovider || createDataSubprovider(connectionType, opts)
  // for websockets, forward subscription events through provider
  if (connectionType === 'ws') {
    dataSubprovider.on('data', (err, notification) => {
      engine.emit('data', err, notification)
    })
  }
  engine.addProvider(dataSubprovider)

  // start polling
  engine.start()

  return engine

}

function createDataSubprovider(connectionType, opts) {
  const { rpcUrl, debug } = opts

  // default to infura
  if (!connectionType) {
    return new InfuraSubprovider()
  }
  if (connectionType === 'http') {
    return new FetchSubprovider({ rpcUrl, debug })
  }
  if (connectionType === 'ws') {
    return new WebSocketSubprovider({ rpcUrl, debug })
  }

  throw new Error(`ProviderEngine - unrecognized connectionType "${connectionType}"`)
}

function getConnectionType({ rpcUrl }) {
  if (!rpcUrl) return undefined

  const protocol = rpcUrl.split(':')[0]
  switch (protocol) {
    case 'http':
    case 'https':
      return 'http'
    case 'ws':
    case 'wss':
      return 'ws'
    default:
      throw new Error(`ProviderEngine - unrecognized protocol in "${rpcUrl}"`)
  }
}


/***/ }),
/* 162 */
/***/ (function(module, exports, __webpack_require__) {

const inherits = __webpack_require__(1).inherits
const extend = __webpack_require__(17)
const FixtureProvider = __webpack_require__(42)
const version = __webpack_require__(163).version

module.exports = DefaultFixtures

inherits(DefaultFixtures, FixtureProvider)

function DefaultFixtures(opts) {
  const self = this
  opts = opts || {}
  var responses = extend({
    web3_clientVersion: 'ProviderEngine/v'+version+'/javascript',
    net_listening: true,
    eth_hashrate: '0x00',
    eth_mining: false,
  }, opts)
  FixtureProvider.call(self, responses)
}


/***/ }),
/* 163 */
/***/ (function(module, exports) {

module.exports = {"_from":"web3-provider-engine","_id":"web3-provider-engine@14.0.4","_inBundle":false,"_integrity":"sha512-EKNWQ8vTBPtxYwHlYWySENy6hUD0xNuFRFlIBJUcR7wHQVzlJN7WD/ynqxy3uRruNUmCRRYrT9gyQnLTQ+lkgg==","_location":"/web3-provider-engine","_phantomChildren":{"async":"2.6.0","async-eventemitter":"0.2.4","async-limiter":"1.0.0","bn.js":"4.11.8","create-hash":"1.1.3","ethereum-common":"0.2.0","ethereumjs-account":"2.0.4","ethereumjs-block":"1.7.0","ethjs-util":"0.1.4","fake-merkle-patricia-tree":"1.0.1","functional-red-black-tree":"1.0.1","keccak":"1.4.0","merkle-patricia-tree":"2.3.0","rlp":"2.0.0","rustbn.js":"0.1.1","safe-buffer":"5.1.1","secp256k1":"3.4.0"},"_requested":{"type":"tag","registry":true,"raw":"web3-provider-engine","name":"web3-provider-engine","escapedName":"web3-provider-engine","rawSpec":"","saveSpec":null,"fetchSpec":"latest"},"_requiredBy":["#USER","/"],"_resolved":"https://registry.npmjs.org/web3-provider-engine/-/web3-provider-engine-14.0.4.tgz","_shasum":"6f96b71ea1b3a76cc67cd52007116c8d4b64465b","_spec":"web3-provider-engine","_where":"/Users/nickyg/Documents/workspace/src/github.com/enKryptIO/ethvm-socket-server","author":"","browser":{"request":false,"ws":false},"bugs":{"url":"https://github.com/MetaMask/provider-engine/issues"},"bundleDependencies":false,"dependencies":{"async":"^2.5.0","backoff":"^2.5.0","clone":"^2.0.0","cross-fetch":"^2.1.0","eth-block-tracker":"^2.3.0","eth-json-rpc-infura":"^3.1.0","eth-sig-util":"^1.4.2","ethereumjs-block":"^1.2.2","ethereumjs-tx":"^1.2.0","ethereumjs-util":"^5.1.5","ethereumjs-vm":"^2.3.4","json-rpc-error":"^2.0.0","json-stable-stringify":"^1.0.1","promise-to-callback":"^1.0.0","readable-stream":"^2.2.9","request":"^2.67.0","semaphore":"^1.0.3","tape":"^4.4.0","ws":"^5.1.1","xhr":"^2.2.0","xtend":"^4.0.1"},"deprecated":false,"description":"[![Greenkeeper badge](https://badges.greenkeeper.io/MetaMask/provider-engine.svg)](https://greenkeeper.io/)","devDependencies":{"babel-cli":"^6.26.0","babel-preset-es2015":"^6.24.1","babel-preset-stage-0":"^6.24.1","browserify":"^16.1.1","ethjs":"^0.3.6"},"homepage":"https://github.com/MetaMask/provider-engine#readme","license":"MIT","main":"index.js","name":"web3-provider-engine","repository":{"type":"git","url":"git+https://github.com/MetaMask/provider-engine.git"},"scripts":{"build":"babel zero.js index.js -d dist/es5 && babel subproviders -d dist/es5/subproviders && babel util -d dist/es5/util","bundle":"mkdir -p ./dist && npm run bundle-engine && npm run bundle-zero","bundle-engine":"browserify -s ProviderEngine -e index.js -t [ babelify --presets [ es2015 ] ] > dist/ProviderEngine.js","bundle-zero":"browserify -s ZeroClientProvider -e zero.js -t [ babelify --presets [ es2015 ] ] > dist/ZeroClientProvider.js","prepublish":"npm run build && npm run bundle","test":"node test/index.js"},"version":"14.0.4"}

/***/ }),
/* 164 */
/***/ (function(module, exports, __webpack_require__) {

const EventEmitter = __webpack_require__(16).EventEmitter
const FilterSubprovider = __webpack_require__(24)
const from = __webpack_require__(48)
const inherits = __webpack_require__(1).inherits
const utils = __webpack_require__(0)

function SubscriptionSubprovider(opts) {
  const self = this

  opts = opts || {}

  EventEmitter.apply(this, Array.prototype.slice.call(arguments))
  FilterSubprovider.apply(this, [opts])

  this.subscriptions = {}
}

inherits(SubscriptionSubprovider, FilterSubprovider)

// a cheap crack at multiple inheritance
// I don't really care if `instanceof EventEmitter` passes...
Object.assign(SubscriptionSubprovider.prototype, EventEmitter.prototype)

// preserve our constructor, though
SubscriptionSubprovider.prototype.constructor = SubscriptionSubprovider

SubscriptionSubprovider.prototype.eth_subscribe = function(payload, cb) {
  const self = this
  let createSubscriptionFilter = () => {}
  let subscriptionType = payload.params[0]

  switch (subscriptionType) {
    case 'logs':
      let options = payload.params[1]

      createSubscriptionFilter = self.newLogFilter.bind(self, options)
      break
    case 'newPendingTransactions':
      createSubscriptionFilter = self.newPendingTransactionFilter.bind(self)
      break
    case 'newHeads':
      createSubscriptionFilter = self.newBlockFilter.bind(self)
      break
    case 'syncing':
    default:
      cb(new Error('unsupported subscription type'))
      return
  }

  createSubscriptionFilter(function(err, hexId) {
    if (err) return cb(err)

    const id = Number.parseInt(hexId, 16)
    self.subscriptions[id] = subscriptionType

    self.filters[id].on('data', function(results) {
      if (!Array.isArray(results)) {
        results = [results]
      }

      var notificationHandler = self._notificationHandler.bind(self, hexId, subscriptionType)
      results.forEach(notificationHandler)
      self.filters[id].clearChanges()
    })
    if (subscriptionType === 'newPendingTransactions') {
      self.checkForPendingBlocks()
    }
    cb(null, hexId)
  })
}

SubscriptionSubprovider.prototype.eth_unsubscribe = function(payload, cb) {
  const self = this
  let hexId = payload.params[0]
  const id = Number.parseInt(hexId, 16)
  if (!self.subscriptions[id]) {
    cb(new Error(`Subscription ID ${hexId} not found.`))
  } else {
    let subscriptionType = self.subscriptions[id]
    self.uninstallFilter(hexId, function (err, result) {
      delete self.subscriptions[id]
      cb(err, result)
    })
  }
}


SubscriptionSubprovider.prototype._notificationHandler = function (hexId, subscriptionType, result) {
  const self = this
  if (subscriptionType === 'newHeads') {
    result = self._notificationResultFromBlock(result)
  }

  // it seems that web3 doesn't expect there to be a separate error event
  // so we must emit null along with the result object
  self.emit('data', null, {
    jsonrpc: "2.0",
    method: "eth_subscription",
    params: {
      subscription: hexId,
      result: result,
    },
  })
}

SubscriptionSubprovider.prototype._notificationResultFromBlock = function(block) {
  return {
    hash: utils.bufferToHex(block.hash),
    parentHash: utils.bufferToHex(block.parentHash),
    sha3Uncles: utils.bufferToHex(block.sha3Uncles),
    miner: utils.bufferToHex(block.miner),
    stateRoot: utils.bufferToHex(block.stateRoot),
    transactionsRoot: utils.bufferToHex(block.transactionsRoot),
    receiptsRoot: utils.bufferToHex(block.receiptsRoot),
    logsBloom: utils.bufferToHex(block.logsBloom),
    difficulty: from.intToQuantityHex(utils.bufferToInt(block.difficulty)),
    number: from.intToQuantityHex(utils.bufferToInt(block.number)),
    gasLimit: from.intToQuantityHex(utils.bufferToInt(block.gasLimit)),
    gasUsed: from.intToQuantityHex(utils.bufferToInt(block.gasUsed)),
    nonce: block.nonce ? utils.bufferToHex(block.nonce): null,
    timestamp: from.intToQuantityHex(utils.bufferToInt(block.timestamp)),
    extraData: utils.bufferToHex(block.extraData)
  }
}

SubscriptionSubprovider.prototype.handleRequest = function(payload, next, end) {
  switch(payload.method){
    case 'eth_subscribe':
      this.eth_subscribe(payload, end)
      break
    case 'eth_unsubscribe':
      this.eth_unsubscribe(payload, end)
      break
    default:
      FilterSubprovider.prototype.handleRequest.apply(this, Array.prototype.slice.call(arguments))
  }
}

module.exports = SubscriptionSubprovider


/***/ }),
/* 165 */
/***/ (function(module, exports, __webpack_require__) {

const cacheIdentifierForPayload = __webpack_require__(22).cacheIdentifierForPayload
const Subprovider = __webpack_require__(3)


class InflightCacheSubprovider extends Subprovider {

  constructor (opts) {
    super()
    this.inflightRequests = {}
  }

  addEngine (engine) {
    this.engine = engine
  }

  handleRequest (req, next, end) {
    const cacheId = cacheIdentifierForPayload(req, { includeBlockRef: true })

    // if not cacheable, skip
    if (!cacheId) return next()

    // check for matching requests
    let activeRequestHandlers = this.inflightRequests[cacheId]

    if (!activeRequestHandlers) {
      // create inflight cache for cacheId
      activeRequestHandlers = []
      this.inflightRequests[cacheId] = activeRequestHandlers

      next((err, result, cb) => {
        // complete inflight for cacheId
        delete this.inflightRequests[cacheId]
        activeRequestHandlers.forEach((handler) => handler(err, result))
        cb(err, result)
      })

    } else {
      // hit inflight cache for cacheId
      // setup the response listener
      activeRequestHandlers.push(end)
    }

  }
}

module.exports = InflightCacheSubprovider



/***/ }),
/* 166 */
/***/ (function(module, exports, __webpack_require__) {

/* Sanitization Subprovider
 * For Parity compatibility
 * removes irregular keys
 */

const inherits = __webpack_require__(1).inherits
const Subprovider = __webpack_require__(3)
const extend = __webpack_require__(17)
const ethUtil = __webpack_require__(0)

module.exports = SanitizerSubprovider

inherits(SanitizerSubprovider, Subprovider)

function SanitizerSubprovider(opts){
  const self = this
}

SanitizerSubprovider.prototype.handleRequest = function(payload, next, end){
  var txParams = payload.params[0]

  if (typeof txParams === 'object' && !Array.isArray(txParams)) {
    var sanitized = cloneTxParams(txParams)
    payload.params[0] = sanitized
  }

  next()
}

// we use this to clean any custom params from the txParams
var permitted = [
  'from',
  'to',
  'value',
  'data',
  'gas',
  'gasPrice',
  'nonce',
  'fromBlock',
  'toBlock',
  'address',
  'topics',
]

function cloneTxParams(txParams){
  var sanitized  =  permitted.reduce(function(copy, permitted) {
    if (permitted in txParams) {
      if (Array.isArray(txParams[permitted])) {
        copy[permitted] = txParams[permitted]
        .map(function(item) {
          return sanitize(item)
        })
      } else {
        copy[permitted] = sanitize(txParams[permitted])
      }
    }
    return copy
  }, {})

  return sanitized
}

function sanitize(value) {
  switch (value) {
    case 'latest':
      return value
    case 'pending':
      return value
    case 'earliest':
      return value
    default:
      if (typeof value === 'string') {
        return ethUtil.addHexPrefix(value.toLowerCase())
      } else {
        return value
      }
  }
}


/***/ }),
/* 167 */
/***/ (function(module, exports, __webpack_require__) {

const createInfuraProvider = __webpack_require__(168)
const ProviderSubprovider = __webpack_require__(173)

class InfuraSubprovider extends ProviderSubprovider {
  constructor(opts = {}) {
    const provider = createInfuraProvider(opts)
    super(provider)
  }
}

module.exports = InfuraSubprovider


/***/ }),
/* 168 */
/***/ (function(module, exports, __webpack_require__) {

const RpcEngine = __webpack_require__(169)
const providerFromEngine = __webpack_require__(170)
const createInfuraMiddleware = __webpack_require__(171)


module.exports = createProvider

function createProvider(opts){
  const engine = new RpcEngine()
  engine.push(createInfuraMiddleware(opts))
  return providerFromEngine(engine)
}


/***/ }),
/* 169 */
/***/ (function(module, exports) {

module.exports = require("json-rpc-engine");

/***/ }),
/* 170 */
/***/ (function(module, exports) {

module.exports = providerFromEngine

function providerFromEngine (engine) {
  const provider = { sendAsync: engine.handle.bind(engine) }
  return provider
}


/***/ }),
/* 171 */
/***/ (function(module, exports, __webpack_require__) {

const createAsyncMiddleware = __webpack_require__(172)
const JsonRpcError = __webpack_require__(30)
const fetch = __webpack_require__(60)

const POST_METHODS = ['eth_call', 'eth_estimateGas', 'eth_sendRawTransaction']
const RETRIABLE_ERRORS = [
  // ignore server overload errors
  'Gateway timeout',
  'ETIMEDOUT',
  // ignore server sent html error pages
  // or truncated json responses
  'SyntaxError',
]

module.exports = createInfuraMiddleware
module.exports.fetchConfigFromReq = fetchConfigFromReq

function createInfuraMiddleware({ network = 'mainnet', maxAttempts = 5 }) {
  // validate options
  if (!maxAttempts) throw new Error(`Invalid value for 'maxAttempts': "${maxAttempts}" (${typeof maxAttempts})`)

  return createAsyncMiddleware(async (req, res, next) => {
    // retry MAX_ATTEMPTS times, if error matches filter
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        // attempt request
        await performFetch(network, req, res)
        // request was succesful
        break
      } catch (err) {
        // an error was caught while performing the request
        // if not retriable, resolve with the encountered error
        if (!isRetriableError(err)) {
          // abort with error
          throw err
        }
        // if no more attempts remaining, throw an error
        const remainingAttempts = maxAttempts - attempt
        if (!remainingAttempts) {
          const errMsg = `InfuraProvider - cannot complete request. All retries exhausted.\nOriginal Error:\n${err.toString()}\n\n`
          const retriesExhaustedErr = new Error(errMsg)
          throw retriesExhaustedErr
        }
        // otherwise, ignore error and retry again after timeout
        await timeout(1000)
      }
    }
    // request was handled correctly, end
  })
}

function timeout(length) {
  return new Promise((resolve) => {
    setTimeout(resolve, length)
  })
}

function isRetriableError(err) {
  const errMessage = err.toString()
  return RETRIABLE_ERRORS.some(phrase => errMessage.includes(phrase))
}

async function performFetch(network, req, res){
  const { fetchUrl, fetchParams } = fetchConfigFromReq({ network, req })
  const response = await fetch(fetchUrl, fetchParams)
  const rawData = await response.text()
  // handle errors
  if (!response.ok) {
    switch (response.status) {
      case 405:
        throw new JsonRpcError.MethodNotFound()

      case 418:
        throw createRatelimitError()

      case 503:
      case 504:
        throw createTimeoutError()

      default:
        throw createInternalError(rawData)
    }
  }

  // special case for now
  if (req.method === 'eth_getBlockByNumber' && rawData === 'Not Found') {
    res.result = null
    return
  }

  // parse JSON
  const data = JSON.parse(rawData)

  // finally return result
  res.result = data.result
  res.error = data.error
}

function fetchConfigFromReq({ network, req }) {
  const cleanReq = normalizeReq(req)
  const { method, params } = cleanReq

  const fetchParams = {}
  let fetchUrl = `https://api.infura.io/v1/jsonrpc/${network}`
  const isPostMethod = POST_METHODS.includes(method)
  if (isPostMethod) {
    fetchParams.method = 'POST'
    fetchParams.headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    fetchParams.body = JSON.stringify(cleanReq)
  } else {
    fetchParams.method = 'GET'
    const paramsString = encodeURIComponent(JSON.stringify(params))
    fetchUrl += `/${method}?params=${paramsString}`
  }

  return { fetchUrl, fetchParams }
}

// strips out extra keys that could be rejected by strict nodes like parity
function normalizeReq(req) {
  return {
    id: req.id,
    jsonrpc: req.jsonrpc,
    method: req.method,
    params: req.params,
  }
}

function createRatelimitError () {
  let msg = `Request is being rate limited.`
  return createInternalError(msg)
}

function createTimeoutError () {
  let msg = `Gateway timeout. The request took too long to process. `
  msg += `This can happen when querying logs over too wide a block range.`
  return createInternalError(msg)
}

function createInternalError (msg) {
  const err = new Error(msg)
  return new JsonRpcError.InternalError(err)
}


/***/ }),
/* 172 */
/***/ (function(module, exports, __webpack_require__) {

const promiseToCallback = __webpack_require__(59)

module.exports = createAsyncMiddleware


function createAsyncMiddleware(asyncMiddleware) {
  return (req, res, next, end) => {
    let nextHandlerOnDone = null
    const finishedPromise = asyncMiddleware(req, res, getNextPromise)
    promiseToCallback(finishedPromise)((err) => {
      // async middleware ended
      if (nextHandlerOnDone) {
        // next handler was called - complete nextHandler
        nextHandlerOnDone(err)
      } else {
        // next handler was not called - complete middleware
        end(err)
      }
    })

    function getNextPromise() {
      return new Promise((resolve) => {
        next((cb) => {
          nextHandlerOnDone = cb
          resolve()
        })
      })
    }
  }
}

/***/ }),
/* 173 */
/***/ (function(module, exports, __webpack_require__) {

const inherits = __webpack_require__(1).inherits
const Subprovider = __webpack_require__(3)

// wraps a provider in a subprovider interface

module.exports = ProviderSubprovider

inherits(ProviderSubprovider, Subprovider)

function ProviderSubprovider(provider){
  if (!provider) throw new Error('ProviderSubprovider - no provider specified')
  if (!provider.sendAsync) throw new Error('ProviderSubprovider - specified provider does not have a sendAsync method')
  this.provider = provider
}

ProviderSubprovider.prototype.handleRequest = function(payload, next, end){
  this.provider.sendAsync(payload, function(err, response) {
    if (err) return end(err)
    if (response.error) return end(new Error(response.error.message))
    end(null, response.result)
  })
}


/***/ }),
/* 174 */
/***/ (function(module, exports, __webpack_require__) {

const fetch = __webpack_require__(60)
const inherits = __webpack_require__(1).inherits
const retry = __webpack_require__(175)
const waterfall = __webpack_require__(50)
const asyncify = __webpack_require__(44)
const JsonRpcError = __webpack_require__(30)
const promiseToCallback = __webpack_require__(59)
const createPayload = __webpack_require__(8)
const Subprovider = __webpack_require__(3)

const RETRIABLE_ERRORS = [
  // ignore server overload errors
  'Gateway timeout',
  'ETIMEDOUT',
  // ignore server sent html error pages
  // or truncated json responses
  'SyntaxError',
]

module.exports = RpcSource

inherits(RpcSource, Subprovider)

function RpcSource (opts) {
  const self = this
  self.rpcUrl = opts.rpcUrl
  self.originHttpHeaderKey = opts.originHttpHeaderKey
}

RpcSource.prototype.handleRequest = function (payload, next, end) {
  const self = this
  const originDomain = payload.origin

  // overwrite id to not conflict with other concurrent users
  const newPayload = createPayload(payload)
  // remove extra parameter from request
  delete newPayload.origin

  const reqParams = {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(newPayload)
  }

  if (self.originHttpHeaderKey && originDomain) {
    reqParams.headers[self.originHttpHeaderKey] = originDomain
  }

  retry({
    times: 5,
    interval: 1000,
    errorFilter: isErrorRetriable,
  },
  (cb) => self._submitRequest(reqParams, cb),
  (err, result) => {
    // ends on retriable error
    if (err && isErrorRetriable(err)) {
      const errMsg = `FetchSubprovider - cannot complete request. All retries exhausted.\nOriginal Error:\n${err.toString()}\n\n`
      const retriesExhaustedErr = new Error(errMsg)
      return end(retriesExhaustedErr)
    }
    // otherwise continue normally
    return end(err, result)
  })
}

RpcSource.prototype._submitRequest = function (reqParams, cb) {
  const self = this
  const targetUrl = self.rpcUrl

  promiseToCallback(fetch(targetUrl, reqParams))((err, res) => {
    if (err) return cb(err)

    // continue parsing result
    waterfall([
      checkForHttpErrors,
      // buffer body
      (cb) => promiseToCallback(res.text())(cb),
      // parse body
      asyncify((rawBody) => JSON.parse(rawBody)),
      parseResponse
    ], cb)

    function checkForHttpErrors (cb) {
      // check for errors
      switch (res.status) {
        case 405:
          return cb(new JsonRpcError.MethodNotFound())

        case 418:
          return cb(createRatelimitError())

        case 503:
        case 504:
          return cb(createTimeoutError())

        default:
          return cb()
      }
    }

    function parseResponse (body, cb) {
      // check for error code
      if (res.status !== 200) {
        return cb(new JsonRpcError.InternalError(body))
      }
      // check for rpc error
      if (body.error) return cb(new JsonRpcError.InternalError(body.error))
      // return successful result
      cb(null, body.result)
    }
  })
}

function isErrorRetriable(err){
  const errMsg = err.toString()
  return RETRIABLE_ERRORS.some(phrase => errMsg.includes(phrase))
}

function createRatelimitError () {
  let msg = `Request is being rate limited.`
  const err = new Error(msg)
  return new JsonRpcError.InternalError(err)
}

function createTimeoutError () {
  let msg = `Gateway timeout. The request took too long to process. `
  msg += `This can happen when querying logs over too wide a block range.`
  const err = new Error(msg)
  return new JsonRpcError.InternalError(err)
}


/***/ }),
/* 175 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = retry;

var _noop = __webpack_require__(12);

var _noop2 = _interopRequireDefault(_noop);

var _constant = __webpack_require__(176);

var _constant2 = _interopRequireDefault(_constant);

var _wrapAsync = __webpack_require__(13);

var _wrapAsync2 = _interopRequireDefault(_wrapAsync);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Attempts to get a successful response from `task` no more than `times` times
 * before returning an error. If the task is successful, the `callback` will be
 * passed the result of the successful task. If all attempts fail, the callback
 * will be passed the error and result (if any) of the final attempt.
 *
 * @name retry
 * @static
 * @memberOf module:ControlFlow
 * @method
 * @category Control Flow
 * @see [async.retryable]{@link module:ControlFlow.retryable}
 * @param {Object|number} [opts = {times: 5, interval: 0}| 5] - Can be either an
 * object with `times` and `interval` or a number.
 * * `times` - The number of attempts to make before giving up.  The default
 *   is `5`.
 * * `interval` - The time to wait between retries, in milliseconds.  The
 *   default is `0`. The interval may also be specified as a function of the
 *   retry count (see example).
 * * `errorFilter` - An optional synchronous function that is invoked on
 *   erroneous result. If it returns `true` the retry attempts will continue;
 *   if the function returns `false` the retry flow is aborted with the current
 *   attempt's error and result being returned to the final callback.
 *   Invoked with (err).
 * * If `opts` is a number, the number specifies the number of times to retry,
 *   with the default interval of `0`.
 * @param {AsyncFunction} task - An async function to retry.
 * Invoked with (callback).
 * @param {Function} [callback] - An optional callback which is called when the
 * task has succeeded, or after the final failed attempt. It receives the `err`
 * and `result` arguments of the last attempt at completing the `task`. Invoked
 * with (err, results).
 *
 * @example
 *
 * // The `retry` function can be used as a stand-alone control flow by passing
 * // a callback, as shown below:
 *
 * // try calling apiMethod 3 times
 * async.retry(3, apiMethod, function(err, result) {
 *     // do something with the result
 * });
 *
 * // try calling apiMethod 3 times, waiting 200 ms between each retry
 * async.retry({times: 3, interval: 200}, apiMethod, function(err, result) {
 *     // do something with the result
 * });
 *
 * // try calling apiMethod 10 times with exponential backoff
 * // (i.e. intervals of 100, 200, 400, 800, 1600, ... milliseconds)
 * async.retry({
 *   times: 10,
 *   interval: function(retryCount) {
 *     return 50 * Math.pow(2, retryCount);
 *   }
 * }, apiMethod, function(err, result) {
 *     // do something with the result
 * });
 *
 * // try calling apiMethod the default 5 times no delay between each retry
 * async.retry(apiMethod, function(err, result) {
 *     // do something with the result
 * });
 *
 * // try calling apiMethod only when error condition satisfies, all other
 * // errors will abort the retry control flow and return to final callback
 * async.retry({
 *   errorFilter: function(err) {
 *     return err.message === 'Temporary error'; // only retry on a specific error
 *   }
 * }, apiMethod, function(err, result) {
 *     // do something with the result
 * });
 *
 * // to retry individual methods that are not as reliable within other
 * // control flow functions, use the `retryable` wrapper:
 * async.auto({
 *     users: api.getUsers.bind(api),
 *     payments: async.retryable(3, api.getPayments.bind(api))
 * }, function(err, results) {
 *     // do something with the results
 * });
 *
 */
function retry(opts, task, callback) {
    var DEFAULT_TIMES = 5;
    var DEFAULT_INTERVAL = 0;

    var options = {
        times: DEFAULT_TIMES,
        intervalFunc: (0, _constant2.default)(DEFAULT_INTERVAL)
    };

    function parseTimes(acc, t) {
        if (typeof t === 'object') {
            acc.times = +t.times || DEFAULT_TIMES;

            acc.intervalFunc = typeof t.interval === 'function' ? t.interval : (0, _constant2.default)(+t.interval || DEFAULT_INTERVAL);

            acc.errorFilter = t.errorFilter;
        } else if (typeof t === 'number' || typeof t === 'string') {
            acc.times = +t || DEFAULT_TIMES;
        } else {
            throw new Error("Invalid arguments for async.retry");
        }
    }

    if (arguments.length < 3 && typeof opts === 'function') {
        callback = task || _noop2.default;
        task = opts;
    } else {
        parseTimes(options, opts);
        callback = callback || _noop2.default;
    }

    if (typeof task !== 'function') {
        throw new Error("Invalid arguments for async.retry");
    }

    var _task = (0, _wrapAsync2.default)(task);

    var attempt = 1;
    function retryAttempt() {
        _task(function (err) {
            if (err && attempt++ < options.times && (typeof options.errorFilter != 'function' || options.errorFilter(err))) {
                setTimeout(retryAttempt, options.intervalFunc(attempt));
            } else {
                callback.apply(null, arguments);
            }
        });
    }

    retryAttempt();
}
module.exports = exports['default'];

/***/ }),
/* 176 */
/***/ (function(module, exports) {

/**
 * Creates a function that returns `value`.
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Util
 * @param {*} value The value to return from the new function.
 * @returns {Function} Returns the new constant function.
 * @example
 *
 * var objects = _.times(2, _.constant({ 'a': 1 }));
 *
 * console.log(objects);
 * // => [{ 'a': 1 }, { 'a': 1 }]
 *
 * console.log(objects[0] === objects[1]);
 * // => true
 */
function constant(value) {
  return function() {
    return value;
  };
}

module.exports = constant;


/***/ }),
/* 177 */
/***/ (function(module, exports, __webpack_require__) {

const Backoff = __webpack_require__(178)
const EventEmitter = __webpack_require__(16)
const inherits = __webpack_require__(1).inherits
const WebSocket = global.WebSocket || __webpack_require__(179)
const Subprovider = __webpack_require__(3)
const createPayload = __webpack_require__(8)

class WebsocketSubprovider
 extends Subprovider {
  constructor({ rpcUrl, debug }) {
    super()

    // inherit from EventEmitter
    EventEmitter.call(this)

    Object.defineProperties(this, {
      _backoff: {
        value: Backoff.exponential({
          randomisationFactor: 0.2,
          maxDelay: 5000
        })
      },
      _connectTime: {
        value: null,
        writable: true
      },
      _log: {
        value: debug
          ? (...args) => console.info.apply(console, ['[WSProvider]', ...args])
          : () => { }
      },
      _pendingRequests: {
        value: new Map()
      },
      _socket: {
        value: null,
        writable: true
      },
      _unhandledRequests: {
        value: []
      },
      _url: {
        value: rpcUrl
      }
    })

    this._handleSocketClose = this._handleSocketClose.bind(this)
    this._handleSocketMessage = this._handleSocketMessage.bind(this)
    this._handleSocketOpen = this._handleSocketOpen.bind(this)

    // Called when a backoff timeout has finished. Time to try reconnecting.
    this._backoff.on('ready', () => {
      this._openSocket()
    })

    this._openSocket()
  }

  handleRequest(payload, next, end) {
    if (!this._socket || this._socket.readyState !== WebSocket.OPEN) {
      this._unhandledRequests.push(Array.from(arguments))
      this._log('Socket not open. Request queued.')
      return
    }

    this._pendingRequests.set(payload.id, [payload, end])

    const newPayload = createPayload(payload)
    delete newPayload.origin

    this._socket.send(JSON.stringify(newPayload))
    this._log(`Sent: ${newPayload.method} #${newPayload.id}`)
  }

  _handleSocketClose({ reason, code }) {
    this._log(`Socket closed, code ${code} (${reason || 'no reason'})`)
    // If the socket has been open for longer than 5 seconds, reset the backoff
    if (this._connectTime && Date.now() - this._connectTime > 5000) {
      this._backoff.reset()
    }

    this._socket.removeEventListener('close', this._handleSocketClose)
    this._socket.removeEventListener('message', this._handleSocketMessage)
    this._socket.removeEventListener('open', this._handleSocketOpen)

    this._socket = null
    this._backoff.backoff()
  }

  _handleSocketMessage(message) {
    let payload

    try {
      payload = JSON.parse(message.data)
    } catch (e) {
      this._log('Received a message that is not valid JSON:', payload)
      return
    }

    // check if server-sent notification
    if (payload.id === undefined) {
      return this.emit('data', null, payload)
    }

    // ignore if missing
    if (!this._pendingRequests.has(payload.id)) {
      return
    }

    // retrieve payload + arguments
    const [originalReq, end] = this._pendingRequests.get(payload.id)
    this._pendingRequests.delete(payload.id)

    this._log(`Received: ${originalReq.method} #${payload.id}`)

    // forward response
    if (payload.error) {
      return end(new Error(payload.error.message))
    }
    end(null, payload.result)
  }

  _handleSocketOpen() {
    this._log('Socket open.')
    this._connectTime = Date.now()

    // Any pending requests need to be resent because our session was lost
    // and will not get responses for them in our new session.
    this._pendingRequests.forEach(value => this._unhandledRequests.push(value))
    this._pendingRequests.clear()

    const unhandledRequests = this._unhandledRequests.splice(0, this._unhandledRequests.length)
    unhandledRequests.forEach(request => {
      this.handleRequest.apply(this, request)
    })
  }

  _openSocket() {
    this._log('Opening socket...')
    this._socket = new WebSocket(this._url)
    this._socket.addEventListener('close', this._handleSocketClose)
    this._socket.addEventListener('message', this._handleSocketMessage)
    this._socket.addEventListener('open', this._handleSocketOpen)
  }
}

// multiple inheritance
Object.assign(WebsocketSubprovider.prototype, EventEmitter.prototype)

module.exports = WebsocketSubprovider


/***/ }),
/* 178 */
/***/ (function(module, exports) {

module.exports = require("backoff");

/***/ }),
/* 179 */
/***/ (function(module, exports) {

module.exports = require("ws");

/***/ }),
/* 180 */
/***/ (function(module, exports) {

module.exports = require("socket.io");

/***/ })
/******/ ]);