import { Block } from '@app/server/modules/blocks'
import { Tx } from '@app/server/modules/txs'

export interface CacheDataStore {
  initialize(): Promise<boolean>
  putBlock(block: Block): Promise<boolean>
  getBlocks(): Promise<Block[]>
  putTransactions(txs: Tx[]): Promise<boolean>
  getTransactions(): Promise<Tx[]>
}
