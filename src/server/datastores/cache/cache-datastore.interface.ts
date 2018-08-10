import { Block, Tx } from '@app/models'

export interface CacheDataStore {
  initialize(): Promise<boolean>

  putBlock(block: Block): Promise<boolean>

  getBlocks(): Promise<Block[]>

  putTransactions(txs: Tx[]): Promise<boolean>

  getTransactions(): Promise<Tx[]>
}
