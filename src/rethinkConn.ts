import * as r from 'rethinkdb'
import configs from '@/configs'
import * as fs from 'fs'
import { URL } from 'url'
import { argv } from 'yargs'
import ds from '@/datastores'
import { txLayout, blockLayout } from '@/typeLayouts'
import { SmallBlock, SmallTx, BlockStats } from '@/libs'

class RethinkDB {
    socketIO: any
    dbConn: r.Connection
    tempTxs: Array<txLayout>
    constructor(_socketIO: any) {
        this.socketIO = _socketIO
        this.start()
    }
    start(): void {
        let _this = this
        this.tempTxs = []
        let conf = configs.global.RETHINK_DB
        let tempConfig: r.ConnectOptions = {
            host: conf.host,
            port: conf.port,
            db: conf.db
        }
        let connect = (_config: r.ConnectOptions): void => {
            r.connect(_config, (err: Error, conn: r.Connection): void => {
                if (!err) {
                    _this.dbConn = conn
                    _this.setAllEvents()
                } else {
                    console.log(err)
                }
            })
        }
        let connectWithCert = (_cert: any) => {
            let url = new URL(process.env[conf.env_url])
            tempConfig = {
                host: url.hostname,
                port: parseInt(url.port),
                password: url.password,
                ssl: {
                    ca: _cert
                },
                db: conf.db
            }
            if(!_cert) delete tempConfig.ssl
            connect(tempConfig)
        }
        if (argv.remoteRDB && !argv.rawCert) {
            fs.readFile(process.env[conf.env_cert], (err, caCert) => {
                connectWithCert(caCert)
            })
        } else if (argv.remoteRDB && argv.rawCert) {
            connectWithCert(process.env[conf.env_cert_raw])
        } else {
            connect(tempConfig)
        }

    }

    setAllEvents(): void {
        let _this = this
        r.table('blocks').changes().map((change) => {
            return change('new_val')
        }).merge((block: any) => {
            return {
                transactions: r.table('transactions').getAll(r.args(block('transactionHashes'))).coerceTo('array'),
                blockStats: {
                    pendingTxs: r.table('transactions')('pending').count(true)
                }
            }
        }).run(_this.dbConn, (err, cursor) => {
            cursor.each((err: Error, block: blockLayout) => {
                if (!err) {
                    let bstats = new BlockStats(block, block.transactions)
                    block.blockStats = Object.assign({}, bstats.getBlockStats(), block.blockStats)
                    let sBlock = new SmallBlock(block)
                    let blockHash = sBlock.hash()
                    _this.socketIO.to(blockHash).emit(blockHash + '_update', block)
                    _this.onNewBlock(sBlock.smallify())
                    _this.onNewTx(block.transactions.map((_tx) => {
                        let sTx = new SmallTx(_tx)
                        let txHash: string = sTx.hash()
                        _this.socketIO.to(txHash).emit(txHash + '_update', _tx)
                        return sTx.smallify()
                    }))
                }
            });
        });
        r.table('transactions').changes().filter(r.row('new_val')('pending').eq(true)).run(_this.dbConn, (err, cursor) => {
            cursor.each((err, row: r.ChangeSet<any, any>) => {
                if (!err) {
                    let _tx: txLayout = row.new_val
                    if (_tx.pending) {
                        let sTx = new SmallTx(_tx)
                        let txHash: string = sTx.hash()
                        _this.socketIO.to(txHash).emit(txHash + '_update', _tx)
                        _this.socketIO.to('pendingTxs').emit('newPendingTx', sTx.smallify())
                    }
                }
            })
        })
    }
    getBlockTransactions(hash: string, cb: any): void {
        r.table('blocks').get(r.args([new Buffer(hash)])).do((block: any) => {
            return r.table('transactions').getAll(r.args(block('transactionHashes'))).coerceTo('array')
        }).run(this.dbConn, (err: Error, result) => {
            if (err) cb(err);
            else cb(result.map((_tx: txLayout)=>{
                return new SmallTx(_tx).smallify()
            }));
        })
    }
    getBlock(hash: string, cb: any): void {
        r.table('blocks').get(r.args([new Buffer(hash)])).run(this.dbConn, (err: Error, result: blockLayout) => {
            if (err) cb(err);
            else cb(result);
        })
    }
    getTx(hash: string, cb: any): void {
        r.table("transactions").get(r.args([new Buffer(hash)])).run(this.dbConn, (err: Error, result: txLayout) => {
            if (err) cb(err)
            else cb(result)
        })
    }

    onNewBlock(_block: blockLayout) {
        let _this = this
        console.log(_block.hash)
        this.socketIO.to('blocks').emit('newBlock', _block)
        ds.addBlock(_block)
    }
    onNewTx(_tx: txLayout | Array<txLayout>) {
        if (Array.isArray(_tx) && !_tx.length) return
        this.socketIO.to('txs').emit('newTx', _tx)
        ds.addTransaction(_tx)
    }
}

export default RethinkDB