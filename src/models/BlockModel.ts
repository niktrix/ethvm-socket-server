import { BlockModel, BlockStatsModel, TxModel } from '@app/models'

export interface BlockModel {
  number: Buffer
  intNumber: number
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
  transactions?: TxModel[]
  transactionHashes?: Buffer[]
  transactionCount?: number
  uncleHashes?: Buffer[]
  uncles?: BlockModel[]
  isUncle: boolean
  txFees?: Buffer
  blockReward?: Buffer
  totalBlockReward?: Buffer
  uncleReward?: Buffer
  blockStats?: BlockStatsModel
}
