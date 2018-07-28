import { CacheDataStore } from '@app/datastores'
import { Block, Tx } from '@app/models'

export class MockDS implements CacheDataStore {
  public initialize(): Promise<boolean> {
    return Promise.resolve(true)
  }

  public putBlock(block: Block): Promise<boolean> {
    return Promise.resolve(true)
  }

  public getBlocks(): Promise<Block[]> {
    const b: Block[] = []
    return Promise.resolve(b)
  }

  public putTransaction(tx: Tx | Tx[]): Promise<boolean> {
    return Promise.resolve(true)
  }

  public getTransactions(): Promise<Tx[]> {
    const t: Tx[] = []
    return Promise.resolve(t)
  }
}
