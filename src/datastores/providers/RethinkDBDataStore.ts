import config from '@/config'
import ds from '@/datastores'
import { BlockStats } from '@/libs'
import { BlockModel, ChartModel, TxModel, SmallTxModel, SmallBlockModel } from '@/models'
import { VmRunner } from '@/vm/vmRunner'
import * as r from 'rethinkdb'
import { l } from '@/helpers'

export default class RethinkDBDataStore {
  private conn: r.Connection

  constructor(private readonly socketIO: SocketIO.Server, private readonly vmRunner: VmRunner) {}

  async start() {
    try {
      const c = {
        host: config.get('eth_vm_server.rethink_db.host'),
        port: config.get('eth_vm_server.rethink_db.port'),
        user: config.get('eth_vm_server.rethink_db.user'),
        password: config.get('eth_vm_server.rethink_db.password'),
        db: config.get('eth_vm_server.rethink_db.db_name'),
        ssl: {
          cert: config.get('eth_vm_server.rethink_db.raw_cert')
        }
      }

      this.conn = await r.connect(c)
      this.setAllEvents()
    } catch (error) {
      l.error(`Can't connect to RethinkDB: ${error}`)
    }
  }

  setAllEvents() {
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
      .run(this.conn, (err, cursor) => {
        cursor.each((err: Error, block: BlockModel) => {
          if (err) {
            l.error('Error while listening events in blocks')
            return
          }

          this.vmRunner.setStateRoot(block.stateRoot)

          const bstats = new BlockStats(block, block.transactions)
          block.blockStats = Object.assign({}, bstats.getBlockStats(), block.blockStats)

          const sBlock = new SmallBlockModel(block)
          const blockHash = sBlock.hash()

          this.socketIO.to(blockHash).emit(blockHash + '_update', block)

          this.onNewBlock(sBlock.smallify())
          this.onNewTx(
            block.transactions.map(tx => {
              const sTx = new SmallTxModel(tx)
              const txHash: string = sTx.hash()

              this.socketIO.to(txHash).emit(txHash + '_update', tx)

              return sTx.smallify()
            })
          )
        })
      })

    r.table('transactions')
      .changes()
      .filter(
        r
          .row('new_val')('pending')
          .eq(true)
      )
      .run(this.conn, (err, cursor) => {
        cursor.each((err, row: r.ChangeSet<any, any>) => {
          if (err) {
            l.error('Error while listening events in transactions')
            return
          }

          const tx: TxModel = row.new_val
          if (tx.pending) {
            const sTx = new SmallTxModel(tx)
            const txHash: string = sTx.hash()

            this.socketIO.to(txHash).emit(txHash + '_update', tx)
            this.socketIO.to('pendingTxs').emit('newPendingTx', sTx.smallify())
          }
        })
      })
  }

  getAddressTransactionPages(address: Buffer, hash: Buffer, bNumber: number, cb: (err: Error, result: any) => void) {
    const sendResults = cursor => {
      cursor.toArray((err: Error, results: Array<TxModel>) => {
        if (err) {
          cb(err, null)
          return
        }

        cb(null, results.map((tx: TxModel) => new SmallTxModel(tx).smallify()))
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

  getTransactionPages(hash: Buffer, bNumber: number, cb: (err: Error, result: any) => void) {
    const sendResults = cursor => {
      cursor.toArray((err: Error, results: Array<TxModel>) => {
        if (err) {
          cb(err, null)
          return
        }

        cb(null, results.map((tx: TxModel) => new SmallTxModel(tx).smallify()))
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

  getBlockTransactions(hash: string, cb: (err: Error, result: any) => void) {
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

        cb(null, result.map((tx: TxModel) => new SmallTxModel(tx).smallify()))
      })
  }

  getTotalTxs(hash: string, cb: (err: Error, result: any) => void) {
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

  getTxsOfAddress(hash: string, cb: (err: Error, result: any) => void) {
    const sendResults = (cursor: any) => {
      cursor.toArray((err: Error, results: Array<TxModel>) => {
        if (err) {
          cb(err, null)
          return
        }

        cb(
          null,
          results.map((tx: TxModel) => {
            return new SmallTxModel(tx).smallify()
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

  getChartsData(cb: (err: Error, result: any) => void) {
    r.table('blockscache')
      .between(r.time(2016, 5, 2, 'Z'), r.time(2016, 5, 11, 'Z'), {
        index: 'timestamp',
        rightBound: 'closed'
      })
      .group(r.row('timestamp').date())
      .map(r.row('accounts').count())
      .reduce((l, r) => l.add(r))
      .default(0)
      .run(this.conn, (err: Error, cursor: any) => {
        if (err) {
          cb(err, null)
          return
        }

        cursor.toArray((err: Error, results: Array<ChartModel>) => {
          if (err) {
            cb(err, null)
            return
          }

          cb(null, results)
        })
      })
  }

  getBlock(hash: string, cb: (err: Error, result: any) => void) {
    r.table('blocks')
      .get(r.args([new Buffer(hash)]))
      .run(this.conn, (err: Error, result: BlockModel) => {
        if (err) {
          cb(err, null)
          return
        }

        cb(null, result)
      })
  }

  getTx(hash: string, cb: (err: Error, result: any) => void) {
    r.table('transactions')
      .get(r.args([new Buffer(hash)]))
      .merge(tx => {
        return {
          trace: r
            .db('eth_mainnet')
            .table('traces')
            .get(tx('hash')),
          logs: r
            .db('eth_mainnet')
            .table('logs')
            .get(tx('hash'))
        }
      })
      .run(this.conn, (err: Error, result: TxModel) => {
        if (err) {
          cb(err, null)
          return
        }

        cb(null, result)
      })
  }

  private onNewBlock(block: BlockModel) {
    l.debug('got new block', block.hash)
    this.socketIO.to('blocks').emit('newBlock', block)
    ds.addBlock(block)
  }

  private onNewTx(tx: TxModel | Array<TxModel>) {
    if (Array.isArray(tx) && !tx.length) {
      return
    }
    this.socketIO.to('txs').emit('newTx', tx)
    ds.addTransaction(tx)
  }
}
