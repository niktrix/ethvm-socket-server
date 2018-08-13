import { BaseRethinkDbRepository, RethinkEthVM } from '@app/server/datastores'
import { Block } from '@app/server/modules/blocks'
import r from 'rethinkdb'

export class BlockRepository extends BaseRethinkDbRepository {
  public getBlock(hash: Buffer): Promise<Block | null> {
    return r
      .table<Block>(RethinkEthVM.tables.blocks)
      .get<Block>(r.args([hash]))
      .run(this.conn)
  }

  public getBlockTxs(hash: Buffer): Promise<Block | null> {
    return r
      .table<Block>(RethinkEthVM.tables.blocks)
      .get<Block>(r.args<Buffer>([hash]))
      .do<Block>(block =>
        r.table(RethinkEthVM.tables.txs)
          .getAll(r.args(block('transactionHashes')))
          .coerceTo('array')
      )
      .run(this.conn)
  }
}
