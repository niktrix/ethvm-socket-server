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
/******/ 	return __webpack_require__(__webpack_require__.s = 15);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", { value: true });
const global_1 = __webpack_require__(16);
exports.default = {
    global: global_1.default
};

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

const async = __webpack_require__(6)

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
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", { value: true });
const SmallBlock_1 = __webpack_require__(25);
exports.SmallBlock = SmallBlock_1.default;
const SmallTx_1 = __webpack_require__(26);
exports.SmallTx = SmallTx_1.default;
const BlockStats_1 = __webpack_require__(27);
exports.BlockStats = BlockStats_1.default;
const common = __webpack_require__(28);
exports.common = common;

/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = require("ethereumjs-util");

/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = require("util");

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", { value: true });
const datastore_redis_1 = __webpack_require__(22);
const datastore_loki_1 = __webpack_require__(23);
const configs_1 = __webpack_require__(0);
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
/* 6 */
/***/ (function(module, exports) {

module.exports = require("async");

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

const rlp = __webpack_require__(13)
const ethUtil = __webpack_require__(3)

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
/* 8 */
/***/ (function(module, exports) {

module.exports = require("yargs");

/***/ }),
/* 9 */
/***/ (function(module, exports) {

module.exports = require("ioredis");

/***/ }),
/* 10 */
/***/ (function(module, exports) {

module.exports = require("bignumber.js");

/***/ }),
/* 11 */
/***/ (function(module, exports) {

module.exports = require("levelup");

/***/ }),
/* 12 */
/***/ (function(module, exports) {

module.exports = require("memdown");

/***/ }),
/* 13 */
/***/ (function(module, exports) {

module.exports = require("rlp");

/***/ }),
/* 14 */
/***/ (function(module, exports) {

module.exports = require("readable-stream");

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", { value: true });
const configs_1 = __webpack_require__(0);
const http = __webpack_require__(17);
const rethinkConn_1 = __webpack_require__(18);
const addEvents_1 = __webpack_require__(30);
const datastores_1 = __webpack_require__(5);
const yargs_1 = __webpack_require__(8);
const cacheDB_1 = __webpack_require__(32);
const vmRunner_1 = __webpack_require__(34);
if (yargs_1.argv.resetDS) datastores_1.default.initialize();
const server = http.createServer();
const io = __webpack_require__(47)(server, configs_1.default.global.SOCKET_IO);
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
io.on('connection', _socket => {
    addEvents_1.default(_socket, rdb, vmRunner);
});

/***/ }),
/* 16 */
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
/* 17 */
/***/ (function(module, exports) {

module.exports = require("http");

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", { value: true });
const r = __webpack_require__(19);
const configs_1 = __webpack_require__(0);
const fs = __webpack_require__(20);
const url_1 = __webpack_require__(21);
const yargs_1 = __webpack_require__(8);
const datastores_1 = __webpack_require__(5);
const libs_1 = __webpack_require__(2);
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
        console.log(_block.hash);
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
/* 19 */
/***/ (function(module, exports) {

module.exports = require("rethinkdb");

/***/ }),
/* 20 */
/***/ (function(module, exports) {

module.exports = require("fs");

/***/ }),
/* 21 */
/***/ (function(module, exports) {

module.exports = require("url");

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", { value: true });
const Redis = __webpack_require__(9);
const configs_1 = __webpack_require__(0);
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
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", { value: true });
const loki = __webpack_require__(24);
const configs_1 = __webpack_require__(0);
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
/* 24 */
/***/ (function(module, exports) {

module.exports = require("lokijs");

/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", { value: true });
const libs_1 = __webpack_require__(2);
const bignumber_js_1 = __webpack_require__(10);
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
/* 26 */
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
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", { value: true });
const bignumber_js_1 = __webpack_require__(10);
const libs_1 = __webpack_require__(2);
const configs_1 = __webpack_require__(0);
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
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", { value: true });
const _ = __webpack_require__(29);
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
    notAddress: "Not a valid Address string"
};
exports.errors = errors;

/***/ }),
/* 29 */
/***/ (function(module, exports) {

module.exports = require("lodash");

/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", { value: true });
const globalFuncs_1 = __webpack_require__(31);
const datastores_1 = __webpack_require__(5);
const libs_1 = __webpack_require__(2);
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
        _glob.vmR.getAccount(_msg, _cb);
    }
}, {
    name: "ethCall",
    onEvent: (_socket, _msg, _glob, _cb) => {
        _glob.vmR.call(_msg, _cb);
    }
}, {
    name: "getTransactionPages",
    onEvent: (_socket, reqObj, _glob, _cb) => {
        if (reqObj.hash && (!libs_1.common.check.isBufferObject(reqObj.hash, 32) || !libs_1.common.check.isNumber(reqObj.number))) _cb(libs_1.common.newError(libs_1.common.errors.notBuffer), null);else _glob.rdb.getTransactionPages(reqObj.hash, reqObj.number, _cb);
    }
}];
let onConnection = (_socket, _rdb, _vmR) => {
    events.forEach((event, idx) => {
        _socket.on(event.name, (msg, cb) => {
            event.onEvent(_socket, msg, {
                rdb: _rdb,
                vmR: _vmR
            }, cb);
        });
    });
};
exports.default = onConnection;

/***/ }),
/* 31 */
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
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", { value: true });
const Redis = __webpack_require__(9);
const rpc = __webpack_require__(33);
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
/* 33 */
/***/ (function(module, exports) {

module.exports = require("json-rpc2");

/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", { value: true });
let VM = __webpack_require__(35);
let Account = __webpack_require__(36);
let Trie = __webpack_require__(37);
const GAS_LIMIT = '0x4c4b40';
const hexToBuffer = hex => {
    return Buffer.from(hex.toLowerCase().replace('0x', ''), 'hex');
};
class VmRunner {
    constructor(_db) {
        this.db = _db;
    }
    setStateRoot(_hash) {
        let _temp = new Trie(this.db, _hash);
        this.stateTrie = _temp;
    }
    call(txs, mCB) {
        let _this = this;
        let _trie = _this.stateTrie.copy();
        let getResult = (tx, treeClone, cb) => {
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
                    let vm = new VM({
                        state: treeClone
                    });
                    vm.runCode({
                        address: hexToBuffer(tx.to),
                        code: code ? code : "0x00",
                        gasLimit: GAS_LIMIT,
                        data: hexToBuffer(tx.data)
                    }, (err, result) => {
                        cb(err, result ? result.return : null);
                    });
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
    getAccount(_to, cb) {
        let treeClone = this.stateTrie.copy();
        treeClone.get(hexToBuffer(_to), (err, val) => {
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
/* 35 */
/***/ (function(module, exports) {

module.exports = require("ethereumjs-vm");

/***/ }),
/* 36 */
/***/ (function(module, exports) {

module.exports = require("ethereumjs-account");

/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

const CheckpointTrie = __webpack_require__(38)
const secureInterface = __webpack_require__(46)
const inherits = __webpack_require__(4).inherits

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
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

const BaseTrie = __webpack_require__(39)
const checkpointInterface = __webpack_require__(43)
const inherits = __webpack_require__(4).inherits
const proof = __webpack_require__(45)

module.exports = CheckpointTrie

inherits(CheckpointTrie, BaseTrie)

function CheckpointTrie () {
  BaseTrie.apply(this, arguments)
  checkpointInterface(this)
}

CheckpointTrie.prove = proof.prove
CheckpointTrie.verifyProof = proof.verifyProof



/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

const assert = __webpack_require__(40)
const levelup = __webpack_require__(11)
const memdown = __webpack_require__(12)
const async = __webpack_require__(6)
const rlp = __webpack_require__(13)
const ethUtil = __webpack_require__(3)
const semaphore = __webpack_require__(41)
const TrieNode = __webpack_require__(7)
const ReadStream = __webpack_require__(42)
const matchingNibbleLength = __webpack_require__(1).matchingNibbleLength
const doKeysMatch = __webpack_require__(1).doKeysMatch
const callTogether = __webpack_require__(1).callTogether
const asyncFirstSeries = __webpack_require__(1).asyncFirstSeries

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
/* 40 */
/***/ (function(module, exports) {

module.exports = require("assert");

/***/ }),
/* 41 */
/***/ (function(module, exports) {

module.exports = require("semaphore");

/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

const Readable = __webpack_require__(14).Readable
const TrieNode = __webpack_require__(7)
const util = __webpack_require__(4)

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
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

const levelup = __webpack_require__(11)
const memdown = __webpack_require__(12)
const async = __webpack_require__(6)
const inherits = __webpack_require__(4).inherits
const Readable = __webpack_require__(14).Readable
const levelws = __webpack_require__(44)
const callTogether = __webpack_require__(1).callTogether

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
/* 44 */
/***/ (function(module, exports) {

module.exports = require("level-ws");

/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

const TrieNode = __webpack_require__(7)
const ethUtil = __webpack_require__(3)
const matchingNibbleLength = __webpack_require__(1).matchingNibbleLength

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
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

const ethUtil = __webpack_require__(3)

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
/* 47 */
/***/ (function(module, exports) {

module.exports = require("socket.io");

/***/ })
/******/ ]);