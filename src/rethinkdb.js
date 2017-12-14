import * as r from 'rethinkdb'
import rethinkdbConf from './configs/rethinkdb.json'
import fs from 'fs'
import {
    URL
} from 'url'
import {
    argv
} from 'yargs'
import {
    addTx,
    addBlock
} from './dataStore'
import {
    smallBlock,
    smallTx
} from './libs'
class RethinkDB {
    constructor(_socketIO) {
        this.socketIO = _socketIO
        this.start()
    }
    start() {
        let _this = this
        let tempConfig = {
            host: rethinkdbConf.host,
            port: rethinkdbConf.port,
            db: rethinkdbConf.db
        }
        let connect = (_config) => {
            r.connect(_config, (err, conn) => {
                if (!err) {
                    _this.dbConn = conn
                    _this.setAllEvents()
                } else {
                    console.log(err)
                }
            })
        }
        if (argv.remoteRDB) {
            fs.readFile(process.env[rethinkdbConf.env_cert], (err, caCert) => {
                let url = new URL(process.env[rethinkdbConf.env_url])
                tempConfig = {
                    host: url.hostname,
                    port: url.port,
                    authKey: url.password,
                    ssl: {
                        ca: caCert
                    },
                    db: rethinkdbConf.db
                }
                connect(tempConfig)
            })
        } else {
            connect(tempConfig)
        }

    }
    setAllEvents() {
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
    }
}

export default RethinkDB