import config from '@/config'
import ds from '@/datastores'
import RethinkDBDataStore from '@/datastores/providers/RethinkDBDataStore'
import { l } from '@/helpers'
import { common } from '@/libs'
import { BlockModel, TxModel } from '@/models'
import CacheDb from '@/vm/cacheDB'
import VmRunner from '@/vm/vmRunner'
import fetch from 'node-fetch'
import * as SocketIO from 'socket.io'

const redisUrl = config.get('eth_vm_server.data_stores.redis.url')
const host = config.get('eth_vm_server.geth.host')
const port = config.get('eth_vm_server.geth.port')

type CallbackFunction = (err: Error, result: any) => any

interface Iinstances {
  rdb: RethinkDBDataStore;
  vmR: VmRunner;
  vmE: any;
}

interface _event {
  name: string,
  onEvent: (_socket: SocketIO.Socket, _msg: string, _glob?: Iinstances, _cb?: CallbackFunction) => void
}

let cacheDB = new CacheDb(redisUrl, {
  port,
  host
})

const events: Array<_event> = [{
  name: "join",
  onEvent: (_socket, _msg): void => {
    if (_msg) {
      _socket.join(_msg)
      l.info(_socket.id, "joined", _msg)
    } else {
      l.error(_socket.id, 'tried to join invalid room', _msg)
    }
  }
}, {
  name: "leave",
  onEvent: (_socket, _msg): void => {
    if (_msg) {
      _socket.leave(_msg)
      l.info(_socket.id, "Left", _msg)
    } else {
      l.error(_socket.id, 'tried to leave invalid room', _msg)
    }
  }
}, {
  name: "pastBlocks",
  onEvent: (_socket, _msg, _glob, _cb): void => {
    ds.getBlocks((_blocks: Array<BlockModel>) => {
      let blocks: Array<BlockModel> = []
      _blocks.forEach((_block: BlockModel, idx: number): void => {
        blocks.unshift(_block)
      })
      _cb(null, blocks)
    })
  }
}, {
  name: "pastTxs",
  onEvent: (_socket, _msg, _glob, _cb) => {
    ds.getTransactions((_txs: Array<TxModel>) => {
      let txs: Array<TxModel> = []
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
  name: "getChartsData",
  onEvent: (_socket, _msg, _glob, _cb): void => {
    _glob.rdb.getChartsData(_cb)
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
  name: "getEthToUSD",
  onEvent: (_socket, _msg: any, _glob, _cb): void => {
    let _this = this

    cacheDB.getString(new Buffer("Iethtousd"), {
      keyEncoding: 'binary',
      valueEncoding: 'binary'
    }, function (err: Error, result: any) {
      if (err == null) {
        console.log("EthtoUSD is in cache get ")
        _cb(err, result)
      } else {
        console.log("EthtoUSD getting from api")
        getEthToUSD(function (err, data) {
          console.log("data", data[0].price_usd)
          cacheDB.put(new Buffer("Iethtousd"), new Buffer(data[0].price_usd), {
            keyEncoding: 'binary',
            valueEncoding: 'binary'
          }, function (err: Error, result: any) {
            _cb(err, result)
          })
          _cb(err, result)
        });
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

let onConnection = (_socket: SocketIO.Socket, _rdb: RethinkDBDataStore, _vmR: VmRunner, _vmE: any) => {
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

async function getEthToUSD(cb: (error: Error, data: any) => void) {
  const res = await fetch('https://api.coinmarketcap.com/v1/ticker/ethereum/')
  const json = await res.json();
  return cb(null, json)
};

export default onConnection