import { Block } from '@app/models'

// TODO: Finish interface implementation
export interface DataStore {
  initialize(): Promise<boolean>

  putBlock(block: Block)

  getBlocks()

  putTransaction()

  getTransactions()
}
