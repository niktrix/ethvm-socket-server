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
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", { value: true });
const global_1 = __webpack_require__(4);
const validRooms_1 = __webpack_require__(5);
exports.default = {
    global: global_1.default,
    validRooms: validRooms_1.default
};

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", { value: true });
const loki = __webpack_require__(12);
const configs_1 = __webpack_require__(0);
let lokiDB = new loki(configs_1.default.global.LOKI.dbName, { autosave: true, autosaveInterval: 5000, autoload: true });
let tables = configs_1.default.global.LOKI.tableNames;
let setCollections = () => {
    tables.forEach((item, idx) => {
        if (!lokiDB.getCollection(item)) lokiDB.addCollection(item).setTTL(configs_1.default.global.LOKI.ttl.age, configs_1.default.global.LOKI.ttl.interval);
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
setCollections();
let addTransaction = tx => {
    lokiDB.getCollection('transactions').insert(hexify(tx));
};
exports.addTransaction = addTransaction;
let addBlock = block => {
    lokiDB.getCollection('blocks').insert(hexify(block));
};
exports.addBlock = addBlock;
let getBlocks = () => {
    return lokiDB.getCollection('blocks').chain().simplesort('blockNumber').data().map(_block => {
        return bufferify(_block);
    });
};
exports.getBlocks = getBlocks;
let getTransactions = () => {
    return lokiDB.getCollection('transactions').chain().simplesort('blockNumber').data().map(_tx => {
        return bufferify(_tx);
    });
};
exports.getTransactions = getTransactions;
let thisReturnsANumber = (id, name) => {
    return 0;
};

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", { value: true });
const SmallBlock_1 = __webpack_require__(15);
exports.SmallBlock = SmallBlock_1.default;
const common = __webpack_require__(17);
exports.common = common;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", { value: true });
const configs_1 = __webpack_require__(0);
const http = __webpack_require__(6);
const rethinkConn_1 = __webpack_require__(7);
const addEvents_1 = __webpack_require__(13);
const server = http.createServer();
const io = __webpack_require__(18)(server, configs_1.default.global.SOCKET_IO);
server.listen(configs_1.default.global.SOCKET_IO.port, configs_1.default.global.SOCKET_IO.ip, () => {
    console.log("Listening on", configs_1.default.global.SOCKET_IO.port);
});
let rdb = new rethinkConn_1.default(io);
io.on('connection', _socket => {
    addEvents_1.default(_socket, rdb);
});

/***/ }),
/* 4 */
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
    SOCKET_IO: {
        port: parseInt(process.env.PORT) || 3000,
        serveClient: false,
        pingInterval: 10000,
        pingTimeout: 5000,
        cookie: true,
        ip: "0.0.0.0"
    },
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
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ["blocks", "minedtxs", "pendingTxs", "txs", "uncles"];

/***/ }),
/* 6 */
/***/ (function(module, exports) {

module.exports = require("http");

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", { value: true });
const r = __webpack_require__(8);
const configs_1 = __webpack_require__(0);
const fs = __webpack_require__(9);
const url_1 = __webpack_require__(10);
const yargs_1 = __webpack_require__(11);
const dataStore_1 = __webpack_require__(1);
class RethinkDB {
    constructor(_socketIO) {
        this.socketIO = _socketIO;
        this.start();
    }
    start() {
        let _this = this;
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
        r.table('blocks').changes().run(_this.dbConn, (err, cursor) => {
            cursor.each((err, row) => {
                if (!err) _this.onNewBlock(row.new_val);
            });
        });
        r.table('transactions').changes().run(_this.dbConn, (err, cursor) => {
            cursor.each((err, row) => {
                if (!err) _this.onNewTx(row.new_val);
            });
        });
    }
    getBlock(hash, cb) {
        r.table('blocks').get(hash).run(this.dbConn, (err, result) => {
            if (err) cb(err);else cb(result);
        });
    }
    getTx(hash, cb) {
        r.table("blocks").getAll(hash, { index: "transactions.hash" }).limit(1).run(this.dbConn, (err, result) => {
            if (err) cb(err);else cb(result);
        });
    }
    onNewBlock(_block) {
        let _this = this;
        this.socketIO.to('blocks').emit('newBlock', _block);
        console.log(_block.hash);
        dataStore_1.addBlock(_block);
    }
    onNewTx(_tx) {
        dataStore_1.addTransaction(_tx);
    }
}
exports.default = RethinkDB;

/***/ }),
/* 8 */
/***/ (function(module, exports) {

module.exports = require("rethinkdb");

/***/ }),
/* 9 */
/***/ (function(module, exports) {

module.exports = require("fs");

/***/ }),
/* 10 */
/***/ (function(module, exports) {

module.exports = require("url");

/***/ }),
/* 11 */
/***/ (function(module, exports) {

module.exports = require("yargs");

/***/ }),
/* 12 */
/***/ (function(module, exports) {

module.exports = require("lokijs");

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", { value: true });
const globalFuncs_1 = __webpack_require__(14);
const dataStore_1 = __webpack_require__(1);
const libs_1 = __webpack_require__(2);
const configs_1 = __webpack_require__(0);
let events = [{
    name: "join",
    onEvent: (_socket, _msg) => {
        if (globalFuncs_1.isValidRoom(_msg)) {
            _socket.join(_msg);
            globalFuncs_1.log.info(_socket.id, "joined", _msg);
        } else {
            globalFuncs_1.log.error(_socket.id, 'tried to join invalid room', _msg);
        }
    }
}, {
    name: "pastBlocks",
    onEvent: (_socket, _msg) => {
        let arr = [];
        dataStore_1.getBlocks().forEach(_block => {
            arr.push(_block);
        });
        _socket.emit('newBlock', arr.slice(0, configs_1.default.global.MAX.socketRows));
    }
}, {
    name: "pastTxs",
    onEvent: (_socket, _msg) => {
        let arr = [];
        dataStore_1.getTransactions().forEach(_tx => {
            arr.push(_tx);
        });
        _socket.emit('newTx', arr.slice(0, configs_1.default.global.MAX.socketRows));
    }
}, {
    name: "pastData",
    onEvent: (_socket, _msg) => {
        let txs = [];
        let blocks = [];
        txs = dataStore_1.getTransactions().slice(0, configs_1.default.global.MAX.socketRows);
        dataStore_1.getBlocks().forEach((_block, idx) => {
            blocks.unshift(new libs_1.SmallBlock(_block).smallify());
        });
        _socket.emit('newBlock', blocks);
        _socket.emit('newTx', txs);
    }
}];
let onConnection = (_socket, rdb) => {
    events.forEach((event, idx) => {
        _socket.on(event.name, msg => {
            event.onEvent(_socket, msg);
        });
    });
    _socket.on('getBlock', (msg, cb) => {
        rdb.getBlock(msg, cb);
    });
    _socket.on('getTx', (msg, cb) => {
        rdb.getTx(msg, cb);
    });
};
exports.default = onConnection;

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", { value: true });
const configs_1 = __webpack_require__(0);
let isValidRoom = _rName => {
    return configs_1.default.validRooms.indexOf(_rName) > -1;
};
exports.isValidRoom = isValidRoom;
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
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", { value: true });
const libs_1 = __webpack_require__(2);
const bignumber_js_1 = __webpack_require__(16);
class SmallBlock {
    constructor(_block) {
        this.block = _block;
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
            totalBlockReward: Buffer.from(new bignumber_js_1.default(libs_1.common.bufferToHex(_block.blockReward)).plus(new bignumber_js_1.default(libs_1.common.bufferToHex(_block.txFees))).toString(16), 'hex')
        };
    }
}
exports.default = SmallBlock;

/***/ }),
/* 16 */
/***/ (function(module, exports) {

module.exports = require("bignumber.js");

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", { value: true });
let bufferToHex = _buf => {
    let r = '0x' + new Buffer(_buf).toString('hex');
    if (r == '0x') r = "0x0";
    return r;
};
exports.bufferToHex = bufferToHex;

/***/ }),
/* 18 */
/***/ (function(module, exports) {

module.exports = require("socket.io");

/***/ })
/******/ ]);