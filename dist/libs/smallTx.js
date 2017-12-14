"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
let smallTx = _tx => {
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
        status: _tx.status
    };
};

exports.default = smallTx;