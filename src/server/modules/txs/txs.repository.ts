import { hexToBuffer } from '@app/server/core/utils'
import { Tx } from '@app/server/modules/txs'
import { BaseRethinkDbRepository, RethinkEthVM } from '@app/server/repositories'
import * as r from 'rethinkdb'

const PAGINATION_SIZE = 25

export interface TxsRepository {
  getTx(hash: string): Promise<Tx | null>
  getTxs(): Promise<Tx[]>
  getTxsPages(bNumber: number, hash?: Buffer): Promise<Tx[]>
  getAddressTxPages(address: Buffer, bNumber: number, hash?: Buffer): Promise<Tx[]>
  getTxsOfAddress(hash: string, limit: number, page: number): Promise<Tx[]>
  getTotalTxs(hash: string): Promise<number>
}

export class RethinkTxsRepository extends BaseRethinkDbRepository implements TxsRepository {
  public getTxs(): Promise<Tx[]> {
    return r
      .table(RethinkEthVM.tables.txs)
      .limit(PAGINATION_SIZE)
      .run(this.conn)
  }

  public getTx(hash: string): Promise<Tx | null> {
    return r
      .table(RethinkEthVM.tables.txs)
      .get(r.args([new Buffer(hash)]))
      .merge(tx => {
        return {
          trace: r.table('traces').get(tx('hash')),
          logs: r.table('logs').get(tx('hash'))
        }
      })
      .run(this.conn)
  }

  public getTxsPages(bNumber: number, hash?: Buffer): Promise<Tx[]> {
    if (!hash) {
      return r
        .table(RethinkEthVM.tables.txs)
        .orderBy({ index: r.desc('numberAndHash') })
        .filter({ pending: false })
        .limit(PAGINATION_SIZE)
        .run(this.conn)
        .then(cursor => cursor.toArray())
    }

    return r
      .table(RethinkEthVM.tables.txs)
      .orderBy({ index: r.desc('numberAndHash') })
      .between(r.args([[r.minval, r.minval]]), r.args([[bNumber, new Buffer(hash)]]), { leftBound: 'open', index: 'numberAndHash' })
      .filter({ pending: false })
      .limit(PAGINATION_SIZE)
      .run(this.conn)
      .then(cursor => cursor.toArray())
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
        .then(cursor => cursor.toArray())
    }

    return r
      .table(RethinkEthVM.tables.txs)
      .orderBy({ index: r.desc('numberAndHash') })
      .between(r.args([[r.minval, r.minval]]), r.args([[bNumber, new Buffer(hash)]]), { leftBound: 'open', index: 'numberAndHash' })
      .filter(r.or(r.row('from').eq(r.args([new Buffer(address)])), r.row('to').eq(r.args([new Buffer(address)]))))
      .limit(PAGINATION_SIZE)
      .run(this.conn)
      .then(cursor => cursor.toArray())
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
      .then(cursor => cursor.toArray())
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
