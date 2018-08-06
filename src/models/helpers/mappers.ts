import config from '@app/config'
import { Block, BlockStats, SmallBlock, Tx } from '@app/models'
import BigNumber from 'bignumber.js'
import * as utils from 'web3-utils'

// TODO: Remove this to be used directly or retrieved from memory or redis
const BLOCK_TIME: number = config.get('eth.block_time')
let previousBlockTime = new BigNumber(0)

const toSmallBlock = (block: Block): SmallBlock => {
  return {
    number: block.number,
    intNumber: block.intNumber,
    hash: block.hash,
    miner: block.miner,
    timestamp: block.timestamp,
    transactionCount: block.transactionHashes ? block.transactionHashes.length : 0,
    uncleHashes: block.uncleHashes,
    isUncle: block.isUncle,
    totalBlockReward: Buffer.from(
      new BigNumber(utils.toHex(block.blockReward))
        .plus(new BigNumber(utils.toHex(block.txFees)))
        .plus(new BigNumber(utils.toHex(block.uncleReward)))
        .toString(16),
      'hex'
    ),
    blockReward: block.blockReward,
    txFees: block.txFees,
    stateRoot: block.stateRoot,
    uncleReward: block.uncleReward,
    difficulty: block.difficulty,
    blockStats: block.blockStats
  }
}

const toBlockStats = (block: Block, txs?: Tx[]): BlockStats => {
  const ts = new BigNumber(utils.toHex(block.timestamp))
  if (!previousBlockTime) {
    previousBlockTime = ts.minus(BLOCK_TIME)
  }

  const blockTime = ts.minus(previousBlockTime).abs()
  if (!block.isUncle) {
    previousBlockTime = new BigNumber(utils.toHex(block.timestamp))
  }

  if (!txs || txs.length === 0) {
    const zero = utils.toHex(0)
    return {
      blockTime: zero,
      failed: zero,
      success: zero,
      avgGasPrice: zero,
      avgTxFees: zero
    }
  }

  const txStatus = {
    blockTime: new BigNumber(0),
    failed: new BigNumber(0),
    success: new BigNumber(0),
    totGasPrice: new BigNumber(0),
    totTxFees: new BigNumber(0)
  }

  txs.forEach(tx => {
    if (tx.status) {
      txStatus.success = txStatus.success.plus(1)
    } else {
      txStatus.failed = txStatus.failed.plus(1)
    }
    txStatus.totGasPrice = txStatus.totGasPrice.plus(new BigNumber(utils.toHex(tx.gasPrice)))
    txStatus.totTxFees = txStatus.totTxFees.plus(new BigNumber(utils.toHex(tx.gasPrice)).times(new BigNumber(utils.toHex(tx.gasUsed))))
  })

  return {
    blockTime: utils.toHex(blockTime),
    failed: utils.toHex(txStatus.failed),
    success: utils.toHex(txStatus.success),
    avgGasPrice: utils.toHex(txStatus.totGasPrice.div(txs.length).integerValue(BigNumber.ROUND_CEIL)),
    avgTxFees: utils.toHex(txStatus.totTxFees.div(txs.length).integerValue(BigNumber.ROUND_CEIL))
  }
}

const mappers = {
  toSmallBlock,
  toBlockStats
}

export { mappers }
