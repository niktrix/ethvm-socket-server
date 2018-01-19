import { log } from '@/globalFuncs'
import ds from '@/datastores'
import { txLayout, blockLayout } from '@/typeLayouts'
import { SmallBlock, SmallTx } from '@/libs'
import configs from '@/configs'
import * as SocketIO from 'socket.io'
import RethinkDB from '@/rethinkConn'
import VmRunner from '@/vm/vmRunner'
type CallbackFunction = (err: Error, result: any) => any;
interface Iinstances {
    rdb: RethinkDB;
    vmR: VmRunner;
}
interface _event {
    name: string,
    onEvent: (_socket: SocketIO.Socket, _msg: string, _glob?: Iinstances, _cb?: CallbackFunction) => void;
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
    name: "leave",
    onEvent: (_socket, _msg): void => {
        if (_msg) {
            _socket.leave(_msg)
            log.info(_socket.id, "Left", _msg)
        } else {
            log.error(_socket.id, 'tried to leave invalid room', _msg)
        }
    }
}, {
    name: "pastBlocks",
    onEvent: (_socket, _msg, _glob, _cb): void => {
        ds.getBlocks((_blocks: Array<blockLayout>) => {
            let blocks: Array<blockLayout> = []
            _blocks.forEach((_block: blockLayout, idx: number): void => {
                blocks.unshift(new SmallBlock(_block).smallify())
            })
            _cb(null, blocks)
        })
    }
}, {
    name: "pastTxs",
    onEvent: (_socket, _msg, _glob, _cb) => {
        ds.getTransactions((_txs: Array<txLayout>) => {
            let txs: Array<txLayout> = []
            _txs.forEach((_tx) => {
                txs.unshift(new SmallTx(_tx).smallify())
            })
            _cb(null, txs)
        })
    }
}, {
    name: "getBlock",
    onEvent: (_socket, _msg, _glob, _cb): void => {
        _glob.rdb.getBlock(_msg, _cb)
    }
}, {
    name: "getTx",
    onEvent: (_socket, _msg, _glob, _cb): void => {
        _glob.rdb.getTx(_msg, _cb)
    }
}, {
    name: "getBlockTransactions",
    onEvent: (_socket, _msg, _glob, _cb): void => {
        _glob.rdb.getBlockTransactions(_msg, _cb)
    }
}, {
    name: "getAccount",
    onEvent: (_socket, _msg, _glob, _cb): void =>{
        _glob.vmR.getAccount(_msg, _cb)
    }
}, {
    name: "ethCall",
    onEvent: (_socket, _msg:any, _glob, _cb): void => {
        _glob.vmR.call(_msg, _cb)
    }
}]
let onConnection = (_socket: SocketIO.Socket, _rdb: RethinkDB, _vmR: VmRunner) => {
    events.forEach((event: _event, idx: number) => {
        _socket.on(event.name, (msg: any, cb: CallbackFunction) => {
            event.onEvent(_socket, msg, {
                rdb: _rdb,
                vmR: _vmR
            }, cb)
        })
    })
}

export default onConnection