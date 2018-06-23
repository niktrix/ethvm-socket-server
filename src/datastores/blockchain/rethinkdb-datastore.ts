import config from '@app/config'
import { logger } from '@app/helpers'
import { Block, Chart, SmallTx, Tx } from '@app/models'
import * as EventEmitter from 'eventemitter3'
import * as r from 'rethinkdb'

export class RethinkDBDataStore {
  public readonly emitter: EventEmitter

  private readonly opts: any
  private conn: r.Connection

  constructor() {
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
    this.emitter = new EventEmitter()
  }

  public async initialize() {
    try {
      this.conn = await r.connect(this.opts)
    } catch (error) {
      logger.error(`Error issued while initializing RethinkDB: ${error}`)
    }
  }

  public getAddressTransactionPages(address: Buffer, hash: Buffer, bNumber: number, cb: (err: any, result: any) => void) {
    const sendResults = (cursor: r.cursor): void => {
      cursor.toArray((err: Error, results: any[]) => {
        if (err) {
          cb(err, null)
          return
        }

        cb(null, results.map((tx: any) => new SmallTx(tx).smallify()))
      })
    }

    if (!hash) {
      r.table('transactions')
        .orderBy({ index: r.desc('numberAndHash') })
        .filter(
          r
            .row('from')
            .eq(r.args([new Buffer(address)]))
            .or(r.row('to').eq(r.args([new Buffer(address)])))
        )
        .limit(25)
        .run(this.conn, (err, cursor) => {
          if (err) {
            cb(err, null)
            return
          }

          sendResults(cursor)
        })

      return
    }

    r.table('transactions')
      .orderBy({ index: r.desc('numberAndHash') })
      .between(r.args([[r.minval, r.minval]]), r.args([[bNumber, new Buffer(hash)]]), { leftBound: 'open', index: 'numberAndHash' })
      .filter(r.or(r.row('from').eq(r.args([new Buffer(address)])), r.row('to').eq(r.args([new Buffer(address)]))))
      .limit(25)
      .run(this.conn, (err, cursor) => {
        if (err) {
          cb(err, null)
          return
        }

        sendResults(cursor)
      })
  }

  public getTransactionPages(hash: Buffer, bNumber: number, cb: (err: any, result: any) => void) {
    const sendResults = cursor => {
      cursor.toArray((err: Error, results: any[]) => {
        if (err) {
          cb(err, null)
          return
        }

        cb(null, results.map((tx: any) => new SmallTx(tx).smallify()))
      })
    }

    if (!hash) {
      r.table('transactions')
        .orderBy({ index: r.desc('numberAndHash') })
        .filter({ pending: false })
        .limit(25)
        .run(this.conn, (err, cursor) => {
          if (err) {
            cb(err, null)
            return
          }

          sendResults(cursor)
        })

      return
    }

    r.table('transactions')
      .orderBy({ index: r.desc('numberAndHash') })
      .between(r.args([[r.minval, r.minval]]), r.args([[bNumber, new Buffer(hash)]]), { leftBound: 'open', index: 'numberAndHash' })
      .filter({ pending: false })
      .limit(25)
      .run(this.conn, (err, cursor) => {
        if (err) {
          cb(err, null)
          return
        }

        sendResults(cursor)
      })
  }

  public getBlockTransactions(hash: string, cb: (err: any, result: any) => void) {
    r.table('blocks')
      .get(r.args([new Buffer(hash)]))
      .do(block =>
        r
          .table('transactions')
          .getAll(r.args(block('transactionHashes')))
          .coerceTo('array')
      )
      .run(this.conn, (err: Error, result: any) => {
        if (err) {
          cb(err, null)
          return
        }

        cb(null, result.map((tx: any) => new SmallTx(tx).smallify()))
      })
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
      .limit(20)
      .run(this.conn)
      .then((cursor: r.cursor) => {
        return cursor.toArray((err: any, results: any[]) => {
          if (err) {
            return Promise.reject(err)
          }

          return results.map((tx: any) => new SmallTx(tx).smallify())
        })
      })
  }

  public getChartsData(cb: (err: any, result: any) => void): Promise<any> {
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
      .then((cursor: r.cursor) => {
        return cursor.toArray((e: any, results: Chart[]) => {
          if (e) {
            return Promise.reject(e)
          }

          return results
        })
      })
  }

  public getBlock(hash: string, cb: (err: any, result: any) => void) {
    r.table('blocks')
      .get(r.args([new Buffer(hash)]))
      .run(this.conn, (err: Error, result: any) => {
        if (err) {
          cb(err, null)
          return
        }

        cb(null, result)
      })
  }

  public getTx(hash: string, cb: (err: any, result: any) => void) {
    r.table('transactions')
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
      .run(
        this.conn,
        (err: Error, result: Tx): void => {
          if (err) {
            cb(err, null)
            return
          }

          cb(null, result)
        }
      )
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
            (e: Error, result: any): void => {
              if (e) {
                logger.error(`RethinkDBDataStore - listenToBlockAndTxEvents() / Error while listening events in blocks: ${e}`)
                return
              }

              // this.vmRunner.setStateRoot(block.stateRoot)
              // const bstats = new BlockTxStats(block, block.transactions)
              // block.blockStats = { ...bstats.getBlockStats(), ...block.blockStats }
              // const sBlock = new SmallBlock(block)
              // const blockHash = sBlock.hash()
              // this.socketIO.to(blockHash).emit(blockHash + '_update', block)
              // this.onNewBlock(sBlock.smallify())
              // this.onNewTx(
              //   block.transactions.map(tx => {
              //     const sTx = new SmallTx(tx)
              //     const txHash: string = sTx.hash()
              //     this.socketIO.to(txHash).emit(txHash + '_update', tx)
              //     return sTx.smallify()
              //   })
              // )
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

            // const tx: Tx = row.new_val
            // if (tx.pending) {
            //   const sTx = new SmallTx(tx)
            //   const txHash: string = sTx.hash()
            //   this.socketIO.to(txHash).emit(txHash + '_update', tx)
            //   this.socketIO.to('pendingTxs').emit('newPendingTx', sTx.smallify())
            // }
          }
        )
      })
      .catch(error => {
        logger.error(`RethinkDBDataStore - listenToBlockAndTxEvents() / Error while listening events in transactions: ${error}`)
      })
  }

  private onNewBlock(block: Block) {
    // this.socketIO.to('blocks').emit('newBlock', block)
    // ds.addBlock(block)
  }

  private onNewTx(tx: Tx | Tx[]) {
    // if (Array.isArray(tx) && !tx.length) {
    //   return
    // }
    // this.socketIO.to('txs').emit('newTx', tx)
    // ds.addTransaction(tx)
  }
}
