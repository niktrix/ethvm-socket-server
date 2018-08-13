import { hexToBuffer } from '@app/server/core/utils'
import { BaseRethinkDbRepository, RethinkEthVM } from '@app/server/datastores'
import { Tx } from '@app/server/modules/txs'
import r from 'rethinkdb'

const PAGINATION_SIZE = 25

export class TxsRepository extends BaseRethinkDbRepository {
  public getTx(hash: string): Promise<Tx | null> {
    return r
      .table<Tx>(RethinkEthVM.tables.txs)
      .get(r.args([new Buffer(hash)]))
      .merge(tx => {
        return {
          trace: r
            .db(this.opts.db)
            .table('traces')
            .get(tx('hash')),
          logs: r
            .db(this.opts.db)
            .table('logs')
            .get(tx('hash'))
        }
      })
      .run(this.conn)
  }

  public getTxsPages(bNumber: number, hash?: Buffer): Promise<Tx[]> {
    if (!hash) {
      return r
        .table<Tx[]>(RethinkEthVM.tables.txs)
        .orderBy({ index: r.desc('numberAndHash') })
        .filter({ pending: false })
        .limit(PAGINATION_SIZE)
        .run(this.conn)
        .then((cursor: r.CursorResult<Tx[]>) => cursor.toArray())
    }

    return r
      .table(RethinkEthVM.tables.txs)
      .orderBy({ index: r.desc('numberAndHash') })
      .between(r.args([[r.minval, r.minval]]), r.args([[bNumber, new Buffer(hash)]]), { leftBound: 'open', index: 'numberAndHash' })
      .filter({ pending: false })
      .limit(PAGINATION_SIZE)
      .run(this.conn)
      .then((cursor: r.CursorResult<Tx[]>) => cursor.toArray())
  }

  public getAddressTxPages(address: Buffer, bNumber: number, hash?: Buffer): Promise<Tx[]> {
    if (!hash) {
      return r
        .table('transactions')
        .orderBy({ index: r.desc('numberAndHash') })
        .filter(
          r
            .row('from')
            .eq(r.args([new Buffer(address)]))
            .or(r.row('to').eq(r.args([new Buffer(address)])))
        )
        .limit(PAGINATION_SIZE)
        .run(this.conn)
        .then((cursor: r.CursorResult<Tx[]>) => cursor.toArray())
    }

    return r
      .table(RethinkEthVM.tables.txs)
      .orderBy({ index: r.desc('numberAndHash') })
      .between(r.args([[r.minval, r.minval]]), r.args([[bNumber, new Buffer(hash)]]), { leftBound: 'open', index: 'numberAndHash' })
      .filter(r.or(r.row('from').eq(r.args([new Buffer(address)])), r.row('to').eq(r.args([new Buffer(address)]))))
      .limit(PAGINATION_SIZE)
      .run(this.conn)
      .then((cursor: r.CursorResult<Tx[]>) => cursor.toArray())
  }

  public getTxsOfAddress(hash: string, limit: number, page: number): Promise<Tx[]> {
    const start = page * limit
    const end = start + limit
    const bhash = hexToBuffer(hash)

    return r
      .table(RethinkEthVM.tables.txs)
      .getAll(r.args([bhash]), { index: 'cofrom' })
      .slice(start, end)
      .run(this.conn)
      .then((cursor: r.CursorResult<Tx[]>) => cursor.toArray())
  }

  public getTotalTxs(hash: string): Promise<number> {
    const bhash = hexToBuffer(hash)
    return r
      .table(RethinkEthVM.tables.txs)
      .getAll(r.args([bhash]), { index: 'cofrom' })
      .count()
      .run(this.conn)
  }
}
