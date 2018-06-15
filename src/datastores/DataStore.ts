import { BlockModel } from '@app/models'

// TODO: Finish interface implementation
export interface DataStore {
  initialize(): Promise<boolean>

  putBlock(block: BlockModel)

  getBlocks()

  putTransaction()

  getTransactions()
}
