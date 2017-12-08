import * as r from 'rethinkdb'
import rethinkdbConf from './configs/rethinkdb.json'

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
    	this.socketIO.to('blocks').emit('newBlock', _block.new_val)
    }
}

export default RethinkDB