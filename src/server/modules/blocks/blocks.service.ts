import { BlockchainDataStore } from '@app/server/datastores'
import { Block } from '@app/server/modules/blocks'

export interface BlocksService {
  getBlock(hash: Buffer): Promise<Block>
  getBlockTxs(hash: Buffer): Promise<Block>
}

export class BlocksServiceImpl implements BlocksService {
  constructor(private readonly ds: BlockchainDataStore) {}

  public getBlock(hash: Buffer): Promise<Block> {
    return this.ds.getBlock(hash)
  }

  public getBlockTxs(hash: Buffer): Promise<Block> {
    return this.ds.getBlockTxs(hash)
  }
}
