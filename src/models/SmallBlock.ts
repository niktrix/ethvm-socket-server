import { BlockStats } from '@app/models'

export interface SmallBlock {
  number: Buffer
  intNumber: number
  hash: Buffer
  miner: Buffer
  timestamp: Buffer
  transactionCount: number
  uncleHashes?: Buffer[]
  isUncle: boolean
  totalBlockReward?: Buffer
  blockReward?: Buffer
  txFees?: Buffer
  stateRoot?: Buffer
  uncleReward?: Buffer
  difficulty?: Buffer
  blockStats?: BlockStats
}
