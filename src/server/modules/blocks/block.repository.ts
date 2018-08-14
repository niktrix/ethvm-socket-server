import { Block } from '@app/server/modules/blocks'
import { BaseRethinkDbRepository, RethinkEthVM } from '@app/server/repositories'
import * as r from 'rethinkdb'

const PAGINATION_SIZE = 25

export interface BlocksRepository {
  getBlocks(): Promise<Block[]>
  getBlock(hash: Buffer): Promise<Block | null>
  getBlockTxs(hash: Buffer): Promise<Block | null>
}

export class RethinkBlockRepository extends BaseRethinkDbRepository implements BlocksRepository {
  public getBlocks(): Promise<Block[]> {
    return r
    .table(RethinkEthVM.tables.blocks)
    .limit(PAGINATION_SIZE)
    .run(this.conn)
  }

  public getBlock(hash: Buffer): Promise<Block | null> {
    return r
      .table(RethinkEthVM.tables.blocks)
      .get(r.args([hash]))
      .run(this.conn)
  }

  public getBlockTxs(hash: Buffer): Promise<Block | null> {
    return r
      .table(RethinkEthVM.tables.blocks)
      .get(r.args([hash]))
      .do(block =>
        r
          .table(RethinkEthVM.tables.txs)
          .getAll(r.args(block('transactionHashes')))
          .coerceTo('array')
      )
      .run(this.conn)
  }
}
