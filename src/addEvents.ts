import { log } from '@/globalFuncs'
import ds from '@/datastores'
import { txLayout, blockLayout } from '@/typeLayouts'
import { SmallBlock, SmallTx } from '@/libs'
import configs from '@/configs'
import * as SocketIO from 'socket.io'
import RethinkDB from '@/rethinkConn'
type CallbackFunction = (data: any) => any;
interface _event {
    name: string,
    onEvent: (_socket: SocketIO.Socket, _msg: string, _rdb?: RethinkDB, _cb?: CallbackFunction) => void;
}
let events: Array<_event> = [{
    name: "join",
    onEvent: (_socket, _msg): void => {
        if (_msg) {
            _socket.join(_msg)
            log.info(_socket.id, "joined", _msg)
        } else {
            log.error(_socket.id, 'tried to join invalid room', _msg)
        }
    }
}, {
    name: "pastBlocks",
    onEvent: (_socket, _msg, _rdb, _cb): void => {
        ds.getBlocks((_blocks: Array<blockLayout>) => {
            let blocks: Array<blockLayout> = []
            _blocks.forEach((_block: blockLayout, idx: number): void => {
                blocks.unshift(new SmallBlock(_block).smallify())
            })
            _socket.emit('latestBlock', blocks[blocks.length-1])
            _cb(blocks)
        })
    }
}, {
    name: "pastTxs",
    onEvent: (_socket, _msg, _rdb, _cb) => {
        ds.getTransactions((_txs: Array<txLayout>) => {
            let txs: Array<txLayout> = []
            _txs.forEach((_tx) => {
                txs.unshift(new SmallTx(_tx).smallify())
            })
            _socket.emit('latestTx', txs[txs.length-1])
            _cb(txs)
        })
    }
}, {
    name: "getBlock",
    onEvent: (_socket, _msg, _rdb, _cb): void => {
        _rdb.getBlock(_msg, _cb)
    }
}, {
    name: "getTx",
    onEvent: (_socket, _msg, _rdb, _cb): void => {
        _rdb.getTx(_msg, _cb)
    }
}]
let onConnection = (_socket: SocketIO.Socket, rdb: RethinkDB) => {
    events.forEach((event: _event, idx: number) => {
        _socket.on(event.name, (msg: any, cb: CallbackFunction) => {
            event.onEvent(_socket, msg, rdb, cb)
        })
    })
}

export default onConnection