import { TxModel, BlockModel, BlockStatsModel } from '@/models'

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
  transactions?: Array<TxModel>
  transactionHashes?: Array<Buffer>
  transactionCount?: number
  uncleHashes?: Array<Buffer>
  uncles?: Array<BlockModel>
  isUncle: boolean
  txFees?: Buffer
  blockReward?: Buffer
  totalBlockReward?: Buffer
  uncleReward?: Buffer
  blockStats?: BlockStatsModel
}
