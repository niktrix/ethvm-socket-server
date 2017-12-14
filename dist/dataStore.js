'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getTxs = exports.getBlocks = exports.saveLRUToFile = exports.loadLRUFromFile = exports.addBlock = exports.addTx = undefined;

var _lru_map = require('lru_map');

var _lowdb = require('lowdb');

var _lowdb2 = _interopRequireDefault(_lowdb);

var _FileSync = require('lowdb/adapters/FileSync');

var _FileSync2 = _interopRequireDefault(_FileSync);

var _global = require('./configs/global.json');

var _global2 = _interopRequireDefault(_global);

var _lowdbDefaults = require('./configs/lowdbDefaults.json');

var _lowdbDefaults2 = _interopRequireDefault(_lowdbDefaults);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const adapter = new _FileSync2.default(_global2.default.dbName);
const db = (0, _lowdb2.default)(adapter);

db.defaults(_lowdbDefaults2.default).write();
let txs = new _lru_map.LRUMap(_global2.default.lru.maxTxs);
let blocks = new _lru_map.LRUMap(_global2.default.lru.maxBlocks);
let test = "abc";

let addTx = (hash, tx) => {
    txs.set(hash, tx);
    saveTxs();
};
let addBlock = (hash, block) => {
    blocks.set(hash, block);
    saveBlocks();
};
let getBlocks = () => {
    return blocks;
};
let getTxs = () => {
    return txs;
};
let loadLRUFromFile = () => {
    txs.clear();
    blocks.clear();
    db.get('txs').value().forEach((tx, idx) => {
        txs.set(tx.key, tx.value);
    });
    db.get('blocks').value().forEach((block, idx) => {
        blocks.set(block.key, block.value);
    });
};
let saveLRUToFile = () => {
    db.set('txs', txs.toJSON()).write();
    db.set('blocks', blocks.toJSON()).write();
};
let saveTxs = () => {
    db.set('txs', txs.toJSON()).write();
};
let saveBlocks = () => {
    db.set('blocks', blocks.toJSON()).write();
};

exports.addTx = addTx;
exports.addBlock = addBlock;
exports.loadLRUFromFile = loadLRUFromFile;
exports.saveLRUToFile = saveLRUToFile;
exports.getBlocks = getBlocks;
exports.getTxs = getTxs;