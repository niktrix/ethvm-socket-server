import * as r from 'rethinkdb'
import configs from '@/configs'
import * as fs from 'fs'
import { URL } from 'url'
import { argv } from 'yargs'
import ds from '@/datastores'
import { txLayout, blockLayout } from '@/typeLayouts'
import { SmallBlock, SmallTx, BlockStats } from '@/libs'
declare module 'rethinkdb' {
    let binary: any;
    let args: any;
}
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
        let tempConfig: r.ConnectionOptions = {
            host: conf.host,
            port: conf.port,
            db: conf.db
        }
        let connect = (_config: r.ConnectionOptions): void => {
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
        r.table('blocks').changes().run(_this.dbConn, (err: Error, cursor: r.Cursor) => {
            cursor.each((err: Error, row: any) => {
                if (!err) {
                    let hashes = row.new_val.transactionHashes.map((_hash: Buffer) => {
                        return r.binary(_hash)
                    })
                    r.table('transactions').getAll(r.args(hashes)).run(_this.dbConn, (err, cursor) => {
                        cursor.toArray(function(err, results) {
                            if (!err && results) {
                                _this.onNewTx(results.map((_tx, idx)=>{
                                    let sTx = new SmallTx(_tx)
                                    let _hashStr:string = sTx.hash()
                                    _this.socketIO.to(_hashStr).emit(_hashStr + '_update', _tx)
                                    return sTx.smallify()
                                }))
                                let bstats = new BlockStats(row.new_val, results)
                                row.new_val.blockStats = bstats.getBlockStats()
                                let sBlock = new SmallBlock(row.new_val)
                                let blockHash = sBlock.hash()
                                _this.socketIO.to(blockHash).emit(blockHash + '_update', row.new_val)
                                _this.onNewBlock(sBlock.smallify())
                            }
                        });
                    })
                }
            });
        });
        r.table('transactions').changes().run(_this.dbConn, (err: Error, cursor: r.Cursor)=>{
            cursor.each((err: Error, row: any)=>{
                if(!err) {
                    let _tx: txLayout = row.new_val
                    if(_tx.pending){
                        _this.socketIO.to('pendingTxs').emit('newPendingTx', new SmallTx(_tx).smallify())
                    }
                }
            })
        })
    }

    getBlock(hash: string, cb: any): void {
        r.table('blocks').get(r.binary(new Buffer(hash))).run(this.dbConn, (err, result) => {
            if (err) cb(err);
            else cb(result);
        })
    }
    getTx(hash: string, cb: any): void {
        r.table("transactions").get(r.binary(new Buffer(hash))).run(this.dbConn, (err, result) => {
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
        if(Array.isArray(_tx) && !_tx.length) return 
        this.socketIO.to('txs').emit('newTx', _tx)
        ds.addTransaction(_tx)
    }
}

export default RethinkDB