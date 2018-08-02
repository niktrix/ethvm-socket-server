import { Block } from '@app/models'
import { BigNumber } from 'bignumber.js'
import * as utils from 'web3-utils'

export class SmallBlock {
  constructor(private readonly block: Block) {}

  public smallify(): Block {
    return {
      number: this.block.number,
      intNumber: this.block.intNumber,
      hash: this.block.hash,
      miner: this.block.miner,
      timestamp: this.block.timestamp,
      transactionCount: this.block.transactionHashes ? this.block.transactionHashes.length : 0,
      uncleHashes: this.block.uncleHashes,
      isUncle: this.block.isUncle,
      totalBlockReward: Buffer.from(
        new BigNumber(utils.toHex(this.block.blockReward))
          .plus(new BigNumber(utils.toHex(this.block.txFees)))
          .plus(new BigNumber(utils.toHex(this.block.uncleReward)))
          .toString(16),
        'hex'
      ),
      blockReward: this.block.blockReward,
      txFees: this.block.txFees,
      stateRoot: this.block.stateRoot,
      uncleReward: this.block.uncleReward,
      difficulty: this.block.difficulty,
      blockStats: this.block.blockStats
    }
  }
}
