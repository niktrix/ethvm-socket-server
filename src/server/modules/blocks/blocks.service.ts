import { CacheDataStore } from '@app/server/datastores'
import { Block, BlockRepository } from '@app/server/modules/blocks'

export interface BlocksService {
  getBlocks(): Promise<Block[]>
  getBlock(hash: Buffer): Promise<Block | null>
  getBlockTxs(hash: Buffer): Promise<Block | null>
}

export class BlocksServiceImpl implements BlocksService {
  constructor(private readonly blocksRepository: BlockRepository, private readonly cs: CacheDataStore) {}

  public getBlocks(): Promise<Block[]> {
    return this.cs.getBlocks()
  }

  public getBlock(hash: Buffer): Promise<Block | null> {
    return this.blocksRepository.getBlock(hash)
  }

  public getBlockTxs(hash: Buffer): Promise<Block | null> {
    return this.blocksRepository.getBlockTxs(hash)
  }
}
