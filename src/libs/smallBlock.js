import configs from '../configs/global'
let smallBlock = function(_block) {
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
            if (idx < configs.smallBlock.maxTxs)
                return {
                    hash: tx.hash
                }
        }),
        uncleHashes: _block.uncleHashes,
        isUncle: _block.isUncle,
        txFees: _block.txFees,
        uncles: [],
        blockReward: _block.blockReward
    }
}

export default smallBlock