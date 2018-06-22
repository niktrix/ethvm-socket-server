import { common } from '@app/libs'
import { Block } from '@app/models'
import bn from 'bignumber.js'

export class SmallBlock {
  constructor(private readonly block: Block) {}

  public hash(): string {
    return '0x' + new Buffer(this.block.hash).toString('hex')
  }

  public smallify(): Block {
    const b = new Block()
    b.number = this.block.number
    b.intNumber = this.block.intNumber
    b.hash = this.block.hash
    b.miner = this.block.miner
    b.timestamp = this.block.timestamp
    b.transactionCount = this.block.transactionHashes.length
    b.uncleHashes = this.block.uncleHashes
    b.isUncle = this.block.isUncle
    b.totalBlockReward = Buffer.from(
      new bn(common.bufferToHex(this.block.blockReward))
        .plus(new bn(common.bufferToHex(this.block.txFees)))
        .plus(new bn(common.bufferToHex(this.block.uncleReward)))
        .toString(16),
      'hex'
    )
    b.blockReward = this.block.blockReward
    b.txFees = this.block.txFees
    b.stateRoot = this.block.stateRoot
    b.uncleReward = this.block.uncleReward
    b.difficulty = this.block.difficulty
    b.blockStats = this.block.blockStats
    return b
  }
}
