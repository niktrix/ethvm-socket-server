'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _global = require('../configs/global');

var _global2 = _interopRequireDefault(_global);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let smallBlock = function (_block) {
    return {
        number: _block.number,
        intNumber: _block.intNumber,
        hash: _block.hash,
        miner: _block.miner,
        minerBalance: _block.minerBalance,
        difficulty: _block.difficulty,
        size: _block.size,
        gasLimit: _block.gasLimit,
        gasUsed: _block.gasUsed,
        timestamp: _block.timestamp,
        transactions: _block.transactions.map((tx, idx) => {
            if (idx < _global2.default.smallBlock.maxTxs) return {
                hash: tx.hash
            };
        }),
        uncleHashes: _block.uncleHashes,
        isUncle: _block.isUncle,
        txFees: _block.txFees,
        uncles: [],
        blockReward: _block.blockReward
    };
};

exports.default = smallBlock;