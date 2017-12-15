'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _global = require('../configs/global');

var _global2 = _interopRequireDefault(_global);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let smallTx = _tx => {
    var trace = {
        isError: _tx.trace.isError,
        msg: _tx.trace.msg,
        transfers: _tx.trace.transfers.map(transfer => {
            if (transfer.value != '0x') return transfer;
        })
    };
    trace.transfers = trace.transfers.slice(0, _global2.default.smallBlock.maxTraces);
    return {
        blockHash: _tx.blockHash,
        blockNumber: _tx.blockNumber,
        from: _tx.from,
        fromBalance: _tx.fromBalance,
        to: _tx.to,
        toBalance: _tx.toBalance,
        gasUsed: _tx.gasUsed,
        contractAddress: _tx.contractAddress,
        gas: _tx.gas,
        gasPrice: _tx.gasPrice,
        hash: _tx.hash,
        input: _tx.input,
        nonce: _tx.nonce,
        value: _tx.value,
        trace: trace,
        status: _tx.status
    };
};

exports.default = smallTx;