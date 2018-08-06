import { Block } from '@app/models'

export interface BlocksService {
  getBlock(hash: string): Promise<Block>
  getBlockTxs(hash: string): Promise<Block>
}

export class BlocksServiceImpl implements BlocksService {
  public getBlock(hash: string): Promise<Block> {
    throw new Error('Method not implemented.')
  }

  public getBlockTxs(hash: string): Promise<Block> {
    throw new Error('Method not implemented.')
  }
}
