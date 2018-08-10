import { Block } from '@app/server/modules/blocks'

export interface BlocksService {
  getBlock(hash: Buffer): Promise<Block>
  getBlockTxs(hash: Buffer): Promise<Block>
}

export class BlocksServiceImpl implements BlocksService {
  constructor() {}

  public getBlock(hash: Buffer): Promise<Block> {
    throw new Error('Method not implemented.')
  }

  public getBlockTxs(hash: Buffer): Promise<Block> {
    throw new Error('Method not implemented.')
  }
}
