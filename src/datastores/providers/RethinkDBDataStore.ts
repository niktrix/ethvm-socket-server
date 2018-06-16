import config from '@app/config'
import { ds } from '@app/datastores'
import { l } from '@app/helpers'
import { BlockTxStats } from '@app/libs'
import { Block, Chart, SmallBlock, SmallTx, Tx } from '@app/models'
import { VmRunner } from '@app/vm/vmRunner'
import * as r from 'rethinkdb'

export default class RethinkDBDataStore {
  private readonly opts: any
  private conn: r.Connection

  constructor(private readonly socketIO: SocketIO.Server, private readonly vmRunner: VmRunner) {
    this.opts = {
      host: config.get('rethink_db.host'),
      port: config.get('rethink_db.port'),
      user: config.get('rethink_db.user'),
      password: config.get('rethink_db.password'),
      db: config.get('rethink_db.db_name'),
      ssl: {
        cert: config.get('rethink_db.cert_raw')
      }
    }

    if (!this.opts.ssl.cert) {
      delete this.opts.ssl
    }
  }

  public async start() {
    try {
      this.conn = await r.connect(this.opts)
      this.setAllEvents()
    } catch (error) {
      l.error(`Can't connect to RethinkDB: ${error}`)
    }
  }

  public setAllEvents() {
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
      .then(cursor => {
        if (!cursor) {
          return
        }

        cursor.each((e: Error, block: Block) => {
          if (e) {
            l.error(`Error while listening events in blocks: ${e}`)
            return
          }

          this.vmRunner.setStateRoot(block.stateRoot)

          const bstats = new BlockTxStats(block, block.transactions)
          block.blockStats = { ...bstats.getBlockStats(), ...block.blockStats }

          const sBlock = new SmallBlock(block)
          const blockHash = sBlock.hash()

          this.socketIO.to(blockHash).emit(blockHash + '_update', block)

          this.onNewBlock(sBlock.smallify())
          this.onNewTx(
            block.transactions.map(tx => {
              const sTx = new SmallTx(tx)
              const txHash: string = sTx.hash()

              this.socketIO.to(txHash).emit(txHash + '_update', tx)

              return sTx.smallify()
            })
          )
        })
      })
      .catch(error => {
        l.error(`Error while listening events in blocks: ${error}`)
      })

    r.table('transactions')
      .changes()
      .filter(
        r
          .row('new_val')('pending')
          .eq(true)
      )
      .run(this.conn)
      .then(cursor => {
        if (!cursor) {
          return
        }

        cursor.each((e, row: r.ChangeSet<any, any>) => {
          if (e) {
            l.error(`Error while listening events in transactions. Error: ${e}`)
            return
          }

          const tx: Tx = row.new_val
          if (tx.pending) {
            const sTx = new SmallTx(tx)
            const txHash: string = sTx.hash()

            this.socketIO.to(txHash).emit(txHash + '_update', tx)
            this.socketIO.to('pendingTxs').emit('newPendingTx', sTx.smallify())
          }
        })
      })
      .catch(error => {
        l.error(`Error while listening events in transactions: ${error}`)
      })
  }

  public getAddressTransactionPages(address: Buffer, hash: Buffer, bNumber: number, cb: (err: Error, result: any) => void) {
    const sendResults = cursor => {
      cursor.toArray((err: Error, results: Tx[]) => {
        if (err) {
          cb(err, null)
          return
        }

        cb(null, results.map((tx: Tx) => new SmallTx(tx).smallify()))
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

  public getTransactionPages(hash: Buffer, bNumber: number, cb: (err: Error, result: any) => void) {
    const sendResults = cursor => {
      cursor.toArray((err: Error, results: Tx[]) => {
        if (err) {
          cb(err, null)
          return
        }

        cb(null, results.map((tx: Tx) => new SmallTx(tx).smallify()))
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

  public getBlockTransactions(hash: string, cb: (err: Error, result: any) => void) {
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

        cb(null, result.map((tx: Tx) => new SmallTx(tx).smallify()))
      })
  }

  public getTotalTxs(hash: string, cb: (err: Error, result: any) => void) {
    const bhash = Buffer.from(hash.toLowerCase().replace('0x', ''), 'hex')
    r.table('transactions')
      .getAll(r.args([bhash]), { index: 'cofrom' })
      .count()
      .run(this.conn, (err: Error, count: any) => {
        if (err) {
          cb(err, null)
          return
        }

        cb(null, count)
      })
  }

  public getTxsOfAddress(hash: string, cb: (err: Error, result: any) => void) {
    const sendResults = (cursor: any) => {
      cursor.toArray((err: Error, results: Tx[]) => {
        if (err) {
          cb(err, null)
          return
        }

        cb(
          null,
          results.map((tx: Tx) => {
            return new SmallTx(tx).smallify()
          })
        )
      })
    }

    const bhash = Buffer.from(hash.toLowerCase().replace('0x', ''), 'hex')

    r.table('transactions')
      .getAll(r.args([bhash]), { index: 'cofrom' })
      .limit(20)
      .run(this.conn, (err: Error, count: any) => {
        if (err) {
          cb(err, null)
          return
        }

        sendResults(count)
      })
  }

  public getChartsData(cb: (err: Error, result: any) => void) {
    r.table('blockscache')
      .between(r.time(2016, 5, 2, 'Z'), r.time(2016, 5, 11, 'Z'), {
        index: 'timestamp',
        rightBound: 'closed'
      })
      .group(r.row('timestamp').date())
      .map(r.row('accounts').count())
      .reduce((lf, rt) => lf.add(rt))
      .default(0)
      .run(this.conn, (err: Error, cursor: any) => {
        if (err) {
          cb(err, null)
          return
        }

        cursor.toArray((e: Error, results: Chart[]) => {
          if (e) {
            cb(e, null)
            return
          }

          cb(null, results)
        })
      })
  }

  public getBlock(hash: string, cb: (err: Error, result: any) => void) {
    r.table('blocks')
      .get(r.args([new Buffer(hash)]))
      .run(this.conn, (err: Error, result: Block) => {
        if (err) {
          cb(err, null)
          return
        }

        cb(null, result)
      })
  }

  public getTx(hash: string, cb: (err: Error, result: any) => void) {
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
      .run(this.conn, (err: Error, result: Tx) => {
        if (err) {
          cb(err, null)
          return
        }

        cb(null, result)
      })
  }

  private onNewBlock(block: Block) {
    l.debug('got new block', block.hash)
    this.socketIO.to('blocks').emit('newBlock', block)
    ds.addBlock(block)
  }

  private onNewTx(tx: Tx | Tx[]) {
    if (Array.isArray(tx) && !tx.length) {
      return
    }
    this.socketIO.to('txs').emit('newTx', tx)
    ds.addTransaction(tx)
  }
}
