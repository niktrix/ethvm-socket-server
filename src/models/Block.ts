import { BlockStats, Tx } from '@app/models'

export class Block {
  public number: Buffer
  public intNumber: number
  public hash: Buffer
  public parentHash?: Buffer
  public nonce?: Buffer
  public mixHash?: Buffer
  public sha3Uncles?: Buffer
  public logsBloom?: Buffer
  public stateRoot?: Buffer
  public miner: Buffer
  public minerBalance?: Buffer
  public difficulty?: Buffer
  public totalDifficulty?: Buffer
  public extraData?: Buffer
  public size?: Buffer
  public gasLimit?: Buffer
  public gasUsed?: Buffer
  public timestamp: Buffer
  public transactionsRoot?: Buffer
  public receiptsRoot?: Buffer
  public transactions?: Tx[]
  public transactionHashes?: Buffer[]
  public transactionCount?: number
  public uncleHashes?: Buffer[]
  public uncles?: Block[]
  public isUncle: boolean
  public txFees?: Buffer
  public blockReward?: Buffer
  public totalBlockReward?: Buffer
  public uncleReward?: Buffer
  public blockStats?: BlockStats

  public toStringHash(): string {
    return '0x' + new Buffer(this.hash).toString('hex')
  }
}
