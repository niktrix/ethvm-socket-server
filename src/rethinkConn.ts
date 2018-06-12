import config from '@/config'
import ds from '@/datastores'
import { BlockStats, SmallBlock, SmallTx } from '@/libs'
import { blockLayout, ChartLayout, txLayout } from '@/typeLayouts'
import VmRunner from '@/vm/vmRunner'
import * as fs from 'fs'
import * as r from 'rethinkdb'
import { URL } from 'url'
import { argv } from 'yargs'
import { l } from '@/helpers'

export class RethinkDB {
  private dbConn: r.Connection

  constructor(private readonly socketIO: SocketIO.Server, private readonly vmRunner: VmRunner) {
    this.start()
  }

  async start() {
    try {
      this.dbConn = await r.connect({})
      this.setAllEvents()
    } catch (error) {
      l.error(`Can't connect to RethinkDB: ${error}`)
    }
  }

  setAllEvents() {
    r
      .table('blocks')
      .changes()
      .map(change => change('new_val'))
      .merge(block => {
        return {
          transactions: r.table('transactions').getAll(r.args(block('transactionHashes'))).coerceTo('array'),
          blockStats: {
            pendingTxs: r.table('data').get('cached').getField('pendingTxs')
          }
        }
      })
      .run(this.dbConn, (err, cursor) => {
        cursor.each((err: Error, block: blockLayout) => {
          if (!err) {
            this.vmRunner.setStateRoot(block.stateRoot)
            const bstats = new BlockStats(block, block.transactions)
            block.blockStats = Object.assign({}, bstats.getBlockStats(), block.blockStats)
            const sBlock = new SmallBlock(block)
            const blockHash = sBlock.hash()
            this.socketIO.to(blockHash).emit(blockHash + '_update', block)
            this.onNewBlock(sBlock.smallify())
            this.onNewTx(block.transactions.map((tx) => {
              const sTx = new SmallTx(tx)
              const txHash: string = sTx.hash()
              this.socketIO.to(txHash).emit(txHash + '_update', tx)
              return sTx.smallify()
            }))
          }
        })
      })

    r
      .table('transactions')
      .changes()
      .filter(r.row('new_val')('pending').eq(true))
      .run(this.dbConn, (err, cursor) => {
        cursor.each((err, row: r.ChangeSet<any, any>) => {
          if (!err) {
            const tx: txLayout = row.new_val
            if (tx.pending) {
              const sTx = new SmallTx(tx)
              const txHash: string = sTx.hash()
              this.socketIO.to(txHash).emit(txHash + '_update', tx)
              this.socketIO.to('pendingTxs').emit('newPendingTx', sTx.smallify())
            }
          }
        })
      })
  }

  getAddressTransactionPages(address: Buffer, hash: Buffer, bNumber: number, cb: (err: Error, result: any) => void) {
    const sendResults = cursor => {
      cursor.toArray((err: Error, results: Array<txLayout>) => {
        if (err) {
          cb(err, null)
          return
        }

        cb(null, results.map((tx: txLayout) => new SmallTx(tx).smallify()))
      })
    }

    if (!hash) {
      r
        .table('transactions')
        .orderBy({ index: r.desc('numberAndHash') })
        .filter(
          r.row('from')
            .eq(r.args([new Buffer(address)]))
            .or(r.row('to')
              .eq(r.args([new Buffer(address)])))
        ).limit(25)
        .run(this.dbConn, (err, cursor) => {
          if (err) {
            cb(err, null)
            return
          }

          sendResults(cursor)
        })

      return
    }

    r
      .table('transactions')
      .orderBy({ index: r.desc('numberAndHash') })
      .between(r.args([[r.minval, r.minval]]), r.args([[bNumber, new Buffer(hash)]]), { leftBound: 'open', index: 'numberAndHash' })
      .filter(
        r.or(r.row('from').eq(r.args([new Buffer(address)])), r.row('to').eq(r.args([new Buffer(address)])))
      )
      .limit(25)
      .run(this.dbConn, (err, cursor) => {
        if (err) {
          cb(err, null)
          return
        }

        sendResults(cursor)
      })
  }

  getTransactionPages(hash: Buffer, bNumber: number, cb: (err: Error, result: any) => void) {
    const sendResults = cursor => {
      cursor.toArray((err: Error, results: Array<txLayout>) => {
        if (err) {
          cb(err, null)
          return
        }

        cb(null, results.map((tx: txLayout) => new SmallTx(tx).smallify()))
      })
    }

    if (!hash) {
      r
        .table('transactions')
        .orderBy({ index: r.desc('numberAndHash') })
        .filter({ pending: false })
        .limit(25)
        .run(this.dbConn, (err, cursor) => {
          if (err) {
            cb(err, null)
            return
          }

          sendResults(cursor)
        })

      return
    }

    r
      .table('transactions')
      .orderBy({ index: r.desc('numberAndHash') })
      .between(r.args([[r.minval, r.minval]]), r.args([[bNumber, new Buffer(hash)]]), { leftBound: 'open', index: 'numberAndHash' })
      .filter({ pending: false })
      .limit(25)
      .run(this.dbConn, (err, cursor) => {
        if (err) {
          cb(err, null)
          return
        }

        sendResults(cursor)
      })
  }

  getBlockTransactions(hash: string, cb: (err: Error, result: any) => void) {
    r
      .table('blocks')
      .get(r.args([new Buffer(hash)]))
      .do(block => r.table('transactions').getAll(r.args(block('transactionHashes'))).coerceTo('array'))
      .run(this.dbConn, (err: Error, result: any) => {
        if (err) {
          cb(err, null)
          return
        }

        cb(null, result.map((tx: txLayout) => new SmallTx(tx).smallify()))
      })
  }

  getTotalTxs(hash: string, cb: (err: Error, result: any) => void) {
    const bhash = Buffer.from(hash.toLowerCase().replace('0x', ''), 'hex')
    r
      .table('transactions')
      .getAll(r.args([bhash]), { index: 'cofrom' })
      .count()
      .run(this.dbConn, (err: Error, count: any) => {
        if (err) {
          cb(err, null)
          return
        }

        cb(null, count)
      })
  }

  getTxsOfAddress(hash: string, cb: (err: Error, result: any) => void) {
    const sendResults = (cursor: any) => {
      cursor.toArray((err: Error, results: Array<txLayout>) => {
        if (err) {
          cb(err, null)
          return
        }

        cb(null, results.map((tx: txLayout) => {
          return new SmallTx(tx).smallify()
        }))
      })
    }

    const bhash = Buffer.from(hash.toLowerCase().replace('0x', ''), 'hex')

    r
      .table('transactions')
      .getAll(r.args([bhash]), { index: 'cofrom' })
      .limit(20)
      .run(this.dbConn, (err: Error, count: any) => {
        if (err) {
          cb(err, null)
          return
        }

        sendResults(count)
      })
  }

  getChartsData(cb: (err: Error, result: any) => void) {
    r
      .table('blockscache')
      .between(r.time(2016, 5, 2, 'Z'), r.time(2016, 5, 11, 'Z'), {
        index: 'timestamp',
        rightBound: 'closed'
      })
      .group(r.row('timestamp').date())
      .map(r.row('accounts').count())
      .reduce((l, r) => l.add(r))
      .default(0)
      .run(this.dbConn, (err: Error, cursor: any) => {
        if (err) {
          cb(err, null)
          return
        }

        cursor.toArray((err: Error, results: Array<ChartLayout>) => {
          if (err) {
            cb(err, null)
            return
          }

          cb(null, results)
        })
      })
  }

  getBlock(hash: string, cb: (err: Error, result: any) => void) {
    r
      .table('blocks')
      .get(r.args([new Buffer(hash)]))
      .run(this.dbConn, (err: Error, result: blockLayout) => {
        if (err) {
          cb(err, null)
          return
        }

        cb(null, result)
      })
  }

  getTx(hash: string, cb: (err: Error, result: any) => void) {
    r
      .table('transactions')
      .get(r.args([new Buffer(hash)]))
      .merge(tx => {
        return {
          trace: r.db('eth_mainnet').table('traces').get(tx('hash')),
          logs: r.db('eth_mainnet').table('logs').get(tx('hash'))
        }
      })
      .run(this.dbConn, (err: Error, result: txLayout) => {
        if (err) {
          cb(err, null)
          return
        }

        cb(null, result)
      })
  }

  private onNewBlock(block: blockLayout) {
    l.debug('got new block', block.hash)
    this.socketIO.to('blocks').emit('newBlock', block)
    ds.addBlock(block)
  }

  private onNewTx(tx: txLayout | Array<txLayout>) {
    if (Array.isArray(tx) && !tx.length) {
      return
    }
    this.socketIO.to('txs').emit('newTx', tx)
    ds.addTransaction(tx)
  }
}
