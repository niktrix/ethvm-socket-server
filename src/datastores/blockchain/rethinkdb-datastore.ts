import { BlockchainDataStore } from '@app/datastores/blockchain'
import { logger } from '@app/helpers'
import { Block, Tx } from '@app/models'
import * as EventEmitter from 'eventemitter3'
import * as r from 'rethinkdb'

const PAGINATION_SIZE = 25

export interface RethinkDBOpts {
  host: string
  port: number
  db: string
  user?: string
  password?: string
  ssl?: any
}

export class RethinkDBDataStore implements BlockchainDataStore {
  private conn: r.Connection

  constructor(private readonly emitter: EventEmitter, private readonly opts: RethinkDBOpts) {}

  public async initialize(): Promise<boolean> {
    try {
      logger.debug('RethinkDBDataStore - initialize() / Creating connection to RethinkDB')
      this.conn = await r.connect(this.opts)

      logger.debug('RethinkDBDataStore - initialize() / Registering events')
      await this.registerEventEmitter()

      logger.debug('RethinkDBDataStore - initialize() / Initialization performed sucessfully!')
      return Promise.resolve(true)
    } catch (error) {
      logger.error(`Error issued while initializing RethinkDB: ${error}`)
      return Promise.reject(error)
    }
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
        .then((cursor: r.cursor) => cursor.toArray())
    }

    return r
      .table('transactions')
      .orderBy({ index: r.desc('numberAndHash') })
      .between(r.args([[r.minval, r.minval]]), r.args([[bNumber, new Buffer(hash)]]), { leftBound: 'open', index: 'numberAndHash' })
      .filter(r.or(r.row('from').eq(r.args([new Buffer(address)])), r.row('to').eq(r.args([new Buffer(address)]))))
      .limit(PAGINATION_SIZE)
      .run(this.conn)
      .then((cursor: r.cursor) => cursor.toArray())
  }

  public getTxsPages(bNumber: number, hash?: Buffer): Promise<Tx[]> {
    if (!hash) {
      return r
        .table('transactions')
        .orderBy({ index: r.desc('numberAndHash') })
        .filter({ pending: false })
        .limit(PAGINATION_SIZE)
        .run(this.conn)
        .then((cursor: r.cursor) => cursor.toArray())
    }

    return r
      .table('transactions')
      .orderBy({ index: r.desc('numberAndHash') })
      .between(r.args([[r.minval, r.minval]]), r.args([[bNumber, new Buffer(hash)]]), { leftBound: 'open', index: 'numberAndHash' })
      .filter({ pending: false })
      .limit(PAGINATION_SIZE)
      .run(this.conn)
      .then((cursor: r.cursor) => cursor.toArray())
  }

  public getBlockTxs(hash: string): Promise<Block> {
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
  }

  public getTotalTxs(hash: string): Promise<number> {
    const bhash = Buffer.from(hash.toLowerCase().replace('0x', ''), 'hex')
    return r
      .table('transactions')
      .getAll(r.args([bhash]), { index: 'cofrom' })
      .count()
      .run(this.conn)
  }

  public getTxsOfAddress(hash: string): Promise<Tx[]> {
    const bhash = Buffer.from(hash.toLowerCase().replace('0x', ''), 'hex')
    return r
      .table('transactions')
      .getAll(r.args([bhash]), { index: 'cofrom' })
      .limit(PAGINATION_SIZE)
      .run(this.conn)
      .then((cursor: r.cursor) => cursor.toArray())
  }

  public getChartAccountsGrowth(start: Date, end: Date): Promise<any> {
    return r
      .table('blocks_metrics')
      .between(r.epochTime(start.getTime() / 1000), r.epochTime(end.getTime() / 1000), {
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

  public getChartBlockSize(start: Date, end: Date): Promise<number> {
    return r
      .table('blocks_metrics')
      .between(r.epochTime(start.getTime() / 1000), r.epochTime(end.getTime() / 1000), {
        index: 'timestamp',
        rightBound: 'closed'
      })
      .group(r.row('timestamp').date())
      .avg(r.row('size'))
      .run(this.conn)
      .then((cursor: r.cursor) => cursor.toArray())
  }

  public getChartAvTxFee = (start: Date, end: Date): Promise<any> => {
    return r
      .table('blocks_metrics')
      .between(r.epochTime(start.getTime()), r.epochTime(end.getTime()), {
        index: 'timestamp',
        rightBound: 'closed'
      })
      .group(r.row('timestamp').date())
      .avg(r.row('txFees'))
      .run(this.conn)
      .then((cursor: r.cursor) => cursor.toArray())
  }

  public getChartGasLimit(start: Date, to: Date): Promise<number> {
    return r
      .table('blocks_metrics')
      .between(r.epochTime(start.getTime() / 1000), r.epochTime(to.getTime() / 1000), {
        index: 'timestamp',
        rightBound: 'closed'
      })
      .group(r.row('timestamp').date())
      .avg(r.row('gasLimit'))
      .run(this.conn)
  }

  public getBlock(hash: string): Promise<Block> {
    return r
      .table('blocks')
      .get(r.args([new Buffer(hash)]))
      .run(this.conn)
  }

  public getTx(hash: string): Promise<Tx[]> {
    return r
      .table('transactions')
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

  private registerEventEmitter(): Promise<any[]> {
    const blocksPromise = r
      .table('blocks')
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
                logger.error(`RethinkDBDataStore - onNewblock / Error: ${e}`)
                return
              }

              logger.info('RethinkDBDataStore - onNewBlock / Emitting new block!')
              this.emitter.emit('onNewBlock', block)
            }
          )
        }
      )
      .catch(error => {
        logger.error(`RethinkDBDataStore - onNewblock / Error: ${error}`)
      })

    const txsPromise = r
      .table('transactions')
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
              logger.error(`RethinkDBDataStore - onPendingTxs / Error: ${e}`)
              return
            }

            const tx = row.new_val
            if (tx) {
              this.emitter.emit('onPendingTxs', tx)
            }
          }
        )
      })
      .catch(error => {
        logger.error(`RethinkDBDataStore - onPendingTxs / Error: ${error}`)
      })

    return Promise.all([blocksPromise, txsPromise])
  }
}
