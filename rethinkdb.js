import * as r from 'rethinkdb'
import rethinkdbConf from './configs/rethinkdb.json'
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
        r.connect(rethinkdbConf, (err, conn) => {
            if (!err) {
                _this.dbConn = conn
                _this.setAllEvents()
            } else {
                console.log(err)
            }
        })
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