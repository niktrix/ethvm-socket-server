import { BlockModel } from '@/models'

// TODO: Finish interface implementation
export interface DataStore {
  initialize(): Promise<boolean>

  putBlock(block: BlockModel)

  getBlocks()

  putTransaction()

  getTransactions()
}
