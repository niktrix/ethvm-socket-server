import config from '@app/config'
import { BlockchainDataStore } from '@app/datastores/blockchain'
import { logger } from '@app/helpers'
import { Block, SmallTx, Tx } from '@app/models'
import * as EventEmitter from 'eventemitter3'
import * as r from 'rethinkdb'

const PAGINATION_SIZE = 25

export class RethinkDBDataStore implements BlockchainDataStore {
  private readonly opts: any
  private conn: r.Connection

  constructor(private readonly emitter: EventEmitter) {
    this.opts = {
      host: config.get('rethink_db.host'),
      port: config.get('rethink_db.port'),
      user: config.get('rethink_db.user'),
      password: config.get('rethink_db.password'),
      db: config.get('rethink_db.db_name')
    }
    if (config.get('rethink_db.cert_raw')) {
      this.opts.ssl = {
        cert: config.get('rethink_db.cert_raw')
      }
    }
  }

  public async initialize(): Promise<boolean> {
    try {
      this.conn = await r.connect(this.opts)
      return Promise.resolve(true)
    } catch (error) {
      logger.error(`Error issued while initializing RethinkDB: ${error}`)
      return Promise.reject(error)
    }
  }

  public getAddressTransactionPages(address: Buffer, hash: Buffer, bNumber: number): Promise<any> {
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
        .then((cursor: r.cursor) => cursor.toArray())
        .then((results: any[]) => results.map((tx: any) => new SmallTx(tx).smallify()))
    }

    return r
      .table('transactions')
      .orderBy({ index: r.desc('numberAndHash') })
      .between(r.args([[r.minval, r.minval]]), r.args([[bNumber, new Buffer(hash)]]), { leftBound: 'open', index: 'numberAndHash' })
      .filter(r.or(r.row('from').eq(r.args([new Buffer(address)])), r.row('to').eq(r.args([new Buffer(address)]))))
      .limit(PAGINATION_SIZE)
      .run(this.conn)
      .then((cursor: r.cursor) => cursor.toArray())
      .then((results: any[]) => results.map((tx: any) => new SmallTx(tx).smallify()))
  }

  public getTransactionPages(hash: Buffer, bNumber: number): Promise<any> {
    if (!hash) {
      return r
        .table('transactions')
        .orderBy({ index: r.desc('numberAndHash') })
        .filter({ pending: false })
        .limit(PAGINATION_SIZE)
        .run(this.conn)
        .then((cursor: r.cursor) => cursor.toArray())
        .then((results: any[]) => results.map((tx: any) => new SmallTx(tx).smallify()))
    }

    return r
      .table('transactions')
      .orderBy({ index: r.desc('numberAndHash') })
      .between(r.args([[r.minval, r.minval]]), r.args([[bNumber, new Buffer(hash)]]), { leftBound: 'open', index: 'numberAndHash' })
      .filter({ pending: false })
      .limit(PAGINATION_SIZE)
      .run(this.conn)
      .then((cursor: r.cursor) => cursor.toArray())
      .then((results: any[]) => results.map((tx: any) => new SmallTx(tx).smallify()))
  }

  public getBlockTransactions(hash: string): Promise<any> {
    return r
      .table('blocks')
      .get(r.args([new Buffer(hash)]))
      .do(block =>
        r
          .table('transactions')
          .getAll(r.args(block('transactionHashes')))
          .coerceTo('array')
      )
      .run(this.conn)
      .then((results: any[]) => results.map((tx: any) => new SmallTx(tx).smallify()))
  }

  public getTotalTxs(hash: string): Promise<any> {
    const bhash = Buffer.from(hash.toLowerCase().replace('0x', ''), 'hex')
    return r
      .table('transactions')
      .getAll(r.args([bhash]), { index: 'cofrom' })
      .count()
      .run(this.conn)
  }

  public getTxsOfAddress(hash: string): Promise<any> {
    const bhash = Buffer.from(hash.toLowerCase().replace('0x', ''), 'hex')
    return r
      .table('transactions')
      .getAll(r.args([bhash]), { index: 'cofrom' })
      .limit(PAGINATION_SIZE)
      .run(this.conn)
      .then((cursor: r.cursor) => cursor.toArray())
  }

  public getChartsData(): Promise<any> {
    return r
      .table('blockscache')
      .between(r.time(2016, 5, 2, 'Z'), r.time(2016, 5, 11, 'Z'), {
        index: 'timestamp',
        rightBound: 'closed'
      })
      .group(r.row('timestamp').date())
      .map(r.row('accounts').count())
      .reduce((lf, rt) => lf.add(rt))
      .default(0)
      .run(this.conn)
      .then((cursor: r.cursor) => cursor.toArray())
  }

  public getBlock(hash: string): Promise<any> {
    return r
      .table('blocks')
      .get(r.args([new Buffer(hash)]))
      .run(this.conn)
  }

  public getTx(hash: string): Promise<any> {
    return r
      .table('transactions')
      .get(r.args([new Buffer(hash)]))
      .merge(tx => {
        return {
          trace: r
            .db(this.opts.db_name)
            .table('traces')
            .get(tx('hash')),
          logs: r
            .db(this.opts.db_name)
            .table('logs')
            .get(tx('hash'))
        }
      })
      .run(this.conn)
  }

  public async startListeningToEvents() {
    r.table('blocks')
      .changes()
      .map(change => change('new_val'))
      .merge(block => {
        return {
          transactions: r
            .table('transactions')
            .getAll(r.args(block('transactionHashes')))
            .coerceTo('array'),
          blockStats: {
            pendingTxs: r
              .table('data')
              .get('cached')
              .getField('pendingTxs')
          }
        }
      })
      .run(this.conn)
      .then(
        (cursor: r.cursor): void => {
          if (!cursor) {
            return
          }

          cursor.each(
            (e: Error, block: any): void => {
              if (e) {
                logger.error(`RethinkDBDataStore - listenToBlockAndTxEvents() / Error while listening events in blocks: ${e}`)
                return
              }

              this.emitter.emit('onNewBlock', block)
            }
          )
        }
      )
      .catch(error => {
        logger.error(`RethinkDBDataStore - listenToBlockAndTxEvents() / Error while listening events in blocks: ${error}`)
      })

    r.table('transactions')
      .changes()
      .filter(
        r
          .row('new_val')('pending')
          .eq(true)
      )
      .run(this.conn)
      .then((cursor: r.cursor) => {
        if (!cursor) {
          return
        }

        cursor.each(
          (e: Error, row: r.ChangeSet<any, any>): void => {
            if (e) {
              logger.error(`RethinkDBDataStore - listenToBlockAndTxEvents() / Error while listening events in transactions. Error: ${e}`)
              return
            }

            const tx = row.new_val
            this.emitter.emit('onPendingTxs', tx)
          }
        )
      })
      .catch(error => {
        logger.error(`RethinkDBDataStore - listenToBlockAndTxEvents() / Error while listening events in transactions: ${error}`)
      })
  }
}
