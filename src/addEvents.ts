import { log } from '@/globalFuncs'
import ds from '@/datastores'
import { txLayout, blockLayout } from '@/typeLayouts'
import configs from '@/configs'
import RethinkDB from '@/rethinkConn'
import VmRunner from '@/vm/vmRunner'
import { common } from '@/libs'
import CacheDb from './vm/cacheDB'
import fetch from 'node-fetch'


type CallbackFunction = (err: Error, result: any) => any;
interface Iinstances {
    rdb: RethinkDB;
    vmR: VmRunner;
    vmE: any;

}
interface _event {
    name: string,
    onEvent: (_socket: SocketIO.Socket, _msg: string, _glob?: Iinstances, _cb?: CallbackFunction) => void;
}

let cacheDB = new CacheDb(configs.global.REDIS.URL, {
    port: configs.global.GETH_RPC.port,
    host: configs.global.GETH_RPC.host
})
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
                blocks.unshift(_block)
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
                txs.unshift(_tx)
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
    name: "getBalance",
    onEvent: (_socket, _msg, _glob, _cb): void => {
        //_glob.vmR.getAccount(_msg, _cb)
        _glob.vmE.getBalance(_msg, _cb)
    }
}, {
    name: "getTokenBalance",
    onEvent: (_socket, _msg, _glob, _cb): void => {
        _glob.vmE.getAllTokens(_msg, _cb)
    }
},
{
    name: "getTotalTxs",
    onEvent: (_socket, _msg, _glob, _cb): void => {
        _glob.rdb.getTotalTxs(_msg, _cb)
    }
},
{
    name: "getTxs",
    onEvent: (_socket, _msg, _glob, _cb): void => {
        _glob.rdb.getTxsOfAddress(_msg, _cb)
    }
},

{
    name: "getChartAccountsGrowth",
    onEvent: (_socket, _msg, _glob, _cb): void => {
        _glob.rdb.getChartAccountsGrowth(_msg,_cb)
    }
},
{
    name: "getChartBlockSize",
    onEvent: (_socket, _msg, _glob, _cb): void => {
        _glob.rdb.getChartBlockSize(_msg,_cb)
    }
},
{
    name: "ethCall",
    onEvent: (_socket, _msg: any, _glob, _cb): void => {

        _glob.vmR.call(_msg, _cb)
    }
}, {
    name: "getKeyValue",
    onEvent: (_socket, _msg: any, _glob, _cb): void => {
        if (!common.check.isBufferObject(_msg, 32)) _cb(common.newError(common.errors.notBuffer), null)
        else _glob.vmR.getKeyValue(_msg, _cb)
    }
}, {
    name: "getCurrentStateRoot",
    onEvent: (_socket, _msg: any, _glob, _cb): void => {
        if (_msg != "") _cb(common.newError(common.errors.invalidInput), null)
        else _glob.vmR.getCurrentStateRoot(_cb)
    }
},
{
    name: "getTokenToUSD",
    onEvent: (_socket, _msg: any, _glob, _cb): void => {
        let _this = this
        //make ETH query as 1st by default
        _msg.unshift("ETH");
        console.log(_msg)
        cacheDB.getMultiple(_msg, {
            keyEncoding: 'binary',
            valueEncoding: 'binary'
        }, function (err: Error, results: any) {
            if (results[0][1] != null) {
                console.log("Token Value is in cache  ")
                _cb(err, results)
            } else {
                console.log("Getting Token Value from api")
                saveTokenValueToCache(function (err, result) {
                    cacheDB.getMultiple(_msg, {
                        keyEncoding: 'binary',
                        valueEncoding: 'binary'
                    }, _cb)

                })
            }
        });

    }
},
{
    name: "getTransactionPages",
    onEvent: (_socket, reqObj: any, _glob, _cb): void => {
        if (reqObj.hash && (!common.check.isBufferObject(reqObj.hash, 32) || !common.check.isNumber(reqObj.number))) _cb(common.newError(common.errors.notBuffer), null)
        else _glob.rdb.getTransactionPages(reqObj.hash, reqObj.number, _cb)
    }
}, {
    name: "getAddressTransactionPages",
    onEvent: (_socket, reqObj: any, _glob, _cb): void => {
        if (reqObj.hash && (!common.check.isBufferObject(reqObj.hash, 32) || !common.check.isNumber(reqObj.number))) _cb(common.newError(common.errors.notBuffer), null)
        else if (!common.check.isBufferObject(reqObj.address, 20)) _cb(common.newError(common.errors.notBuffer), null)
        else _glob.rdb.getAddressTransactionPages(reqObj.address, reqObj.hash, reqObj.number, _cb)
    }
}]
let onConnection = (_socket: SocketIO.Socket, _rdb: RethinkDB, _vmR: VmRunner, _vmE: any) => {
    events.forEach((event: _event, idx: number) => {
        _socket.on(event.name, (msg: any, cb: CallbackFunction) => {
            event.onEvent(_socket, msg, {
                rdb: _rdb,
                vmR: _vmR,
                vmE: _vmE
            }, cb)
        })
    })
}


async function getTokenValues(cb: (error: Error, data: any) => void) {
    const res = await fetch('http://still-waters-52916.herokuapp.com/ticker')
    const json = await res.json();
    return cb(null, json)

};

function saveTokenValueToCache(cb: (error: Error, data: any) => void) {
    getTokenValues(function (err, data) {
        var kv: any = [];
        Object.keys(data.data).forEach(key => {
            kv.push({ key: "TOKEN_" + data.data[key]["symbol"], value: data.data[key]["quotes"]["USD"]["price"] })
            cacheDB.putMultiple(kv, cb)
        });
    });
}


export default onConnection