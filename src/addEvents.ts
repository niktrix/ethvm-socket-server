import { isValidRoom, log } from '@/globalFuncs'
import { getTransactions, getBlocks } from '@/dataStore'
import { txLayout, blockLayout } from '@/typeLayouts'
import { SmallBlock } from '@/libs'
import configs from '@/configs'
import * as SocketIO from 'socket.io'
import RethinkDB from '@/rethinkConn'
interface _event {
    name: string,
    onEvent: (_socket: SocketIO.Socket, _msg: string) => void;
}
let events = [{
    name: "join",
    onEvent: (_socket: SocketIO.Socket, _msg: string): void => {
        if (isValidRoom(_msg)) {
            _socket.join(_msg)
            log.info(_socket.id, "joined", _msg)
        } else {
            log.error(_socket.id, 'tried to join invalid room', _msg)
        }
    }
}, {
    name: "pastBlocks",
    onEvent: (_socket: SocketIO.Socket, _msg: string): void => {
        let arr: Array<blockLayout> = []
        getBlocks().forEach((_block: blockLayout): void => {
            arr.push(_block)
        });
        _socket.emit('newBlock', arr.slice(0, configs.global.MAX.socketRows))
    }
}, {
    name: "pastTxs",
    onEvent: (_socket: SocketIO.Socket, _msg: string) => {
        let arr: Array<txLayout> = []
        getTransactions().forEach((_tx: txLayout) => {
            arr.push(_tx)
        });
        _socket.emit('newTx', arr.slice(0, configs.global.MAX.socketRows))
    }
}, {
    name: "pastData",
    onEvent: (_socket: SocketIO.Socket, _msg: string) => {
        let txs: Array<txLayout> = []
        let blocks: Array<blockLayout> = []
        txs = getTransactions().slice(0, configs.global.MAX.socketRows)
        getBlocks().forEach((_block: blockLayout, idx: number): void => {
            blocks.unshift(new SmallBlock(_block).smallify())
        })
        _socket.emit('newBlock', blocks)
        _socket.emit('newTx', txs)
    }
}]
let onConnection = (_socket: SocketIO.Socket, rdb: RethinkDB) => {
    events.forEach((event: _event, idx: number) => {
        _socket.on(event.name, (msg: any) => {
            event.onEvent(_socket, msg)
        })
    })
    _socket.on('getBlock', (msg: string, cb: any) => {
        rdb.getBlock(msg, cb)
    })
}

export default onConnection