import * as r from 'rethinkdb'
import configs from '@/configs'
import * as fs from 'fs'
import { URL } from 'url'
import { argv } from 'yargs'
import { addTransaction, addBlock } from './dataStore'
import { ConnectionOptions as TLSConnectionOptions } from "tls";

class RethinkDB {
    socketIO: any
    dbConn: ConnectionOptions
    constructor(_socketIO: any) {
        this.socketIO = _socketIO
        this.start()
    }
    start():void  {
        let _this = this
        let conf = configs.global.RETHINK_DB
        let tempConfig: r.ConnectOptions = {
            host: conf.host,
            port: conf.port,
            db: conf.db
        }
        let connect = (_config: r.ConnectOptions):void => {
            r.connect(_config, (err: Error, conn: r.Connection):void => {
                if (err) {
                    _this.dbConn = conn
                  //  _this.setAllEvents()
                } else {
                    console.log(err)
                }
            })
        }
    /*    let connectWithCert = (_cert) => {
            let url = new URL(process.env[conf.env_url])
            tempConfig = {
                host: url.hostname,
                port: url.port,
                authKey: url.password,
                ssl: {
                    ca: _cert
                },
                db: rethinkdbConf.db
            }
            connect(tempConfig)
        }
        if (argv.remoteRDB && !argv.rawCert) {
            fs.readFile(process.env[rethinkdbConf.env_cert], (err, caCert) => {
                connectWithCert(caCert)
            })
        } else if (argv.remoteRDB && argv.rawCert) {
            connectWithCert(process.env[rethinkdbConf.env_cert_raw])
        } else {
            connect(tempConfig)
        } */

    }
  /*  setAllEvents() {
        let _this = this
        r.table('blocks').changes().run(_this.dbConn, function(err, cursor) {
            cursor.each((err, row) => {
                if (!err) _this.onNewBlock(row)
            });
        });
    }

    onNewBlock(_block) {
        let _this = this
        let txs = _block.new_val.transactions.slice(0)
        _block.new_val.transactions = _block.new_val.transactions.map(function(element) {
            return element.hash
        });
        this.socketIO.to('blocks').emit('newBlock', smallBlock(_block.new_val))
        txs.forEach((tx, idx) => {
            _this.onNewTx(tx)
        })
        addBlock(_block.new_val.hash, _block.new_val)
    }
    onNewTx(_tx) {
        this.socketIO.to('txs').emit('newTx', smallTx(_tx))
        addTx(_tx.hash, _tx)
    } */
}

export default RethinkDB