import { Block, Tx } from '@app/models'

export interface CacheDataStore {
  initialize(): Promise<boolean>

  putBlock(block: Block): Promise<boolean>

  getBlocks(): Promise<Block[]>

  putTransaction(tx: Tx | Tx[]): Promise<boolean>

  getTransactions(): Promise<Tx[]>
}
