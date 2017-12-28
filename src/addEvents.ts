import { isValidRoom, log } from '@/globalFuncs'
import ds from '@/datastores'
import { txLayout, blockLayout } from '@/typeLayouts'
import { SmallBlock, SmallTx } from '@/libs'
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
        ds.getBlocks((_blocks: Array<blockLayout>)=>{
            _socket.emit('newBlock', _blocks)
        });
    }
}, {
    name: "pastTxs",
    onEvent: (_socket: SocketIO.Socket, _msg: string) => {
        ds.getTransactions((_txs: Array<txLayout>)=>{
            _socket.emit('newTx', _txs)
        })
    }
}, {
    name: "pastData",
    onEvent: (_socket: SocketIO.Socket, _msg: string) => {
        ds.getTransactions((_txs: Array<txLayout>)=>{
            let txs: Array<txLayout> = []
            _txs.forEach((_tx)=>{
                txs.unshift(new SmallTx(_tx).smallify())
            })
            ds.getBlocks((_blocks:Array<blockLayout>)=>{
                let blocks: Array<blockLayout> = []
                _blocks.forEach((_block: blockLayout, idx: number): void => {
                    blocks.unshift(new SmallBlock(_block).smallify())
                })
                _socket.emit('newBlock', blocks)
                _socket.emit('newTx', txs)
            })
        })
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
    _socket.on('getTx', (msg: string, cb: any)=>{
        rdb.getTx(msg, cb)
    })
}

export default onConnection