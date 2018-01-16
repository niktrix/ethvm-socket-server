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
/******/ 	return __webpack_require__(__webpack_require__.s = 5);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", { value: true });
const global_1 = __webpack_require__(6);
exports.default = {
    global: global_1.default
};

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", { value: true });
const SmallBlock_1 = __webpack_require__(16);
exports.SmallBlock = SmallBlock_1.default;
const SmallTx_1 = __webpack_require__(17);
exports.SmallTx = SmallTx_1.default;
const BlockStats_1 = __webpack_require__(18);
exports.BlockStats = BlockStats_1.default;
const common = __webpack_require__(19);
exports.common = common;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", { value: true });
const datastore_redis_1 = __webpack_require__(12);
const datastore_loki_1 = __webpack_require__(14);
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
/* 3 */
/***/ (function(module, exports) {

module.exports = require("yargs");

/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = require("bignumber.js");

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", { value: true });
const configs_1 = __webpack_require__(0);
const http = __webpack_require__(7);
const rethinkConn_1 = __webpack_require__(8);
const addEvents_1 = __webpack_require__(20);
const datastores_1 = __webpack_require__(2);
const yargs_1 = __webpack_require__(3);
if (yargs_1.argv.resetDS) datastores_1.default.initialize();
const server = http.createServer();
const io = __webpack_require__(22)(server, configs_1.default.global.SOCKET_IO);
server.listen(configs_1.default.global.SOCKET_IO.port, configs_1.default.global.SOCKET_IO.ip, () => {
    console.log("Listening on", configs_1.default.global.SOCKET_IO.port);
});
let rdb = new rethinkConn_1.default(io);
io.on('connection', _socket => {
    addEvents_1.default(_socket, rdb);
});

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
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
        socketRows: 100
    }
};

/***/ }),
/* 7 */
/***/ (function(module, exports) {

module.exports = require("http");

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", { value: true });
const r = __webpack_require__(9);
const configs_1 = __webpack_require__(0);
const fs = __webpack_require__(10);
const url_1 = __webpack_require__(11);
const yargs_1 = __webpack_require__(3);
const datastores_1 = __webpack_require__(2);
const libs_1 = __webpack_require__(1);
class RethinkDB {
    constructor(_socketIO) {
        this.socketIO = _socketIO;
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
                    pendingTxs: r.table('transactions')('pending').count(true)
                }
            };
        }).run(_this.dbConn, (err, cursor) => {
            cursor.each((err, block) => {
                if (!err) {
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
    getBlockTransactions(hash, cb) {
        r.table('blocks').get(r.args([new Buffer(hash)])).do(block => {
            return r.table('transactions').getAll(r.args(block('transactionHashes'))).coerceTo('array');
        }).run(this.dbConn, (err, result) => {
            if (err) cb(err);else cb(result.map(_tx => {
                return new libs_1.SmallTx(_tx).smallify();
            }));
        });
    }
    getBlock(hash, cb) {
        r.table('blocks').get(r.args([new Buffer(hash)])).run(this.dbConn, (err, result) => {
            if (err) cb(err);else cb(result);
        });
    }
    getTx(hash, cb) {
        r.table("transactions").get(r.args([new Buffer(hash)])).run(this.dbConn, (err, result) => {
            if (err) cb(err);else cb(result);
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
/* 9 */
/***/ (function(module, exports) {

module.exports = require("rethinkdb");

/***/ }),
/* 10 */
/***/ (function(module, exports) {

module.exports = require("fs");

/***/ }),
/* 11 */
/***/ (function(module, exports) {

module.exports = require("url");

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", { value: true });
const Redis = __webpack_require__(13);
const configs_1 = __webpack_require__(0);
let redis = new Redis(configs_1.default.global.REDIS.URL);
let tables = {
    transactions: 'transactions',
    blocks: 'blocks'
};
let getArray = (tbName, cb) => {
    let vals = redis.get(tbName, (err, result) => {
        if (!err && result) cb(JSON.parse(result));else cb([]);
    });
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
        redis.set(tables.transactions, JSON.stringify(pTxs));
    });
};
let addBlock = block => {
    getArray(tables.blocks, pBlocks => {
        pBlocks.unshift(block);
        if (pBlocks.length > configs_1.default.global.MAX.socketRows) pBlocks = pBlocks.slice(0, configs_1.default.global.MAX.socketRows);
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
/* 13 */
/***/ (function(module, exports) {

module.exports = require("ioredis");

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", { value: true });
const loki = __webpack_require__(15);
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
/* 15 */
/***/ (function(module, exports) {

module.exports = require("lokijs");

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", { value: true });
const libs_1 = __webpack_require__(1);
const bignumber_js_1 = __webpack_require__(4);
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
            transactionHashes: _block.transactionHashes,
            transactionCount: _block.transactionHashes.length,
            uncleHashes: _block.uncleHashes,
            isUncle: _block.isUncle,
            totalBlockReward: Buffer.from(new bignumber_js_1.default(libs_1.common.bufferToHex(_block.blockReward)).plus(new bignumber_js_1.default(libs_1.common.bufferToHex(_block.txFees))).plus(new bignumber_js_1.default(libs_1.common.bufferToHex(_block.uncleReward))).toString(16), 'hex'),
            blockReward: _block.blockReward,
            txFees: _block.txFees,
            uncleReward: _block.uncleReward,
            blockStats: _block.blockStats
        };
    }
}
exports.default = SmallBlock;

/***/ }),
/* 17 */
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
            status: _tx.status
        };
    }
}
exports.default = SmallTx;

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", { value: true });
const bignumber_js_1 = __webpack_require__(4);
const libs_1 = __webpack_require__(1);
class BlockStats {
    constructor(_block, _txs) {
        this.block = _block;
        this.txs = _txs;
    }
    getBlockStats() {
        if (!this.txs.length) return {
            failed: '0x0',
            success: '0x0',
            avgGasPrice: '0x0',
            avgTxFees: '0x0'
        };
        let txStatus = {
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
            failed: libs_1.common.bnToHex(txStatus.failed),
            success: libs_1.common.bnToHex(txStatus.success),
            avgGasPrice: libs_1.common.bnToHex(txStatus.totGasPrice.div(this.txs.length).ceil()),
            avgTxFees: libs_1.common.bnToHex(txStatus.totTxFees.div(this.txs.length).ceil())
        };
    }
}
exports.default = BlockStats;

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", { value: true });
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

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", { value: true });
const globalFuncs_1 = __webpack_require__(21);
const datastores_1 = __webpack_require__(2);
const libs_1 = __webpack_require__(1);
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
    onEvent: (_socket, _msg, _rdb, _cb) => {
        datastores_1.default.getBlocks(_blocks => {
            let blocks = [];
            _blocks.forEach((_block, idx) => {
                blocks.unshift(new libs_1.SmallBlock(_block).smallify());
            });
            _cb(blocks);
        });
    }
}, {
    name: "pastTxs",
    onEvent: (_socket, _msg, _rdb, _cb) => {
        datastores_1.default.getTransactions(_txs => {
            let txs = [];
            _txs.forEach(_tx => {
                txs.unshift(new libs_1.SmallTx(_tx).smallify());
            });
            _cb(txs);
        });
    }
}, {
    name: "getBlock",
    onEvent: (_socket, _msg, _rdb, _cb) => {
        _rdb.getBlock(_msg, _cb);
    }
}, {
    name: "getTx",
    onEvent: (_socket, _msg, _rdb, _cb) => {
        _rdb.getTx(_msg, _cb);
    }
}, {
    name: "getBlockTransactions",
    onEvent: (_socket, _msg, _rdb, _cb) => {
        _rdb.getBlockTransactions(_msg, _cb);
    }
}];
let onConnection = (_socket, rdb) => {
    events.forEach((event, idx) => {
        _socket.on(event.name, (msg, cb) => {
            event.onEvent(_socket, msg, rdb, cb);
        });
    });
};
exports.default = onConnection;

/***/ }),
/* 21 */
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
/* 22 */
/***/ (function(module, exports) {

module.exports = require("socket.io");

/***/ })
/******/ ]);