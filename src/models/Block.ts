import { BlockStats, Tx } from '@app/models'

export interface Block {
  number: number
  hash: Buffer
  parentHash?: Buffer
  nonce?: Buffer
  mixHash?: Buffer
  sha3Uncles?: Buffer
  logsBloom?: Buffer
  stateRoot?: Buffer
  miner: Buffer
  minerBalance?: Buffer
  difficulty?: Buffer
  totalDifficulty?: Buffer
  extraData?: Buffer
  size?: Buffer
  gasLimit?: Buffer
  gasUsed?: Buffer
  timestamp: Buffer
  transactionsRoot?: Buffer
  receiptsRoot?: Buffer
  transactions?: Tx[]
  transactionHashes?: Buffer[]
  transactionCount?: number
  uncleHashes?: Buffer[]
  uncles?: Block[]
  isUncle: boolean
  txFees?: Buffer
  blockReward?: Buffer
  totalBlockReward?: Buffer
  uncleReward?: Buffer
  blockStats?: BlockStats
}
