import configs from '../configs/global'
let smallTx = (_tx) => {
    var trace = {
        isError: _tx.trace.isError,
        msg: _tx.trace.msg,
        transfers: _tx.trace.transfers.map((transfer) => {
            if (transfer.value != '0x') return transfer
        }).filter((n) => {
            return n != undefined
        })
    }
    trace.transfers = trace.transfers.slice(0, configs.smallBlock.maxTraces)
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
    }
}

export default smallTx