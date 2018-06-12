import * as loki from 'lokijs'
import config from '@/config'
import { txLayout, blockLayout } from '@/typeLayouts'

let lokiDB = new loki(config.get('eth_vm_server.data_stores.loki.db_name'), { autosave: true, autosaveInterval: 5000, autoload: true })

let tables = ['transactions', 'blocks']

type CallbackFunction = (data: Array<any>) => void

let setCollections = () => {
  tables.forEach((item: string, idx: number) => {
    if (!lokiDB.getCollection(item)) lokiDB.addCollection(item, { unique: ['hash'] }).setTTL(config.get('eth_vm_server.data_stores.loki.ttl.age'), config.get('eth_vm_server.data_stores.loki.ttl.interval'))
  })
}

let hexify = (obj: any) => {
  let _obj = Object.assign({}, obj);
  for (var key in _obj) {
    if (_obj.hasOwnProperty(key)) {
      if (Buffer.isBuffer(_obj[key])) _obj[key] = '0x' + _obj[key].toString('hex')
    }
  }
  return _obj
}

let bufferify = (obj: any) => {
  let _obj = Object.assign({}, obj);
  for (var key in _obj) {
    if (_obj.hasOwnProperty(key)) {
      if ((typeof _obj[key] === 'string' || _obj[key] instanceof String) && _obj[key].substring(0, 2) == '0x') _obj[key] = new Buffer(_obj[key].substring(2).toUpperCase(), 'hex')
    }
  }
  return _obj
}

let processTx = (tx: txLayout) => {
  let hexed = hexify(tx)
  let col = lokiDB.getCollection('transactions')
  var obj = col.by('hash', hexed.hash);
  if (obj) {
    col.remove(obj);
  }
  lokiDB.getCollection('transactions').insert(hexed)
}

let addTransaction = (tx: txLayout | Array<txLayout>) => {
  if (Array.isArray(tx)) {
    tx.forEach((tTx) => {
      processTx(tTx)
    })
  } else {
    processTx(tx)
  }
}

let addBlock = (block: blockLayout) => {
  let hexed = hexify(block)
  let col = lokiDB.getCollection('blocks')
  var obj = col.by('hash', hexed.hash);
  if (obj) {
    col.remove(obj);
  }
  lokiDB.getCollection('blocks').insert(hexed)
}

let getBlocks = (cb: CallbackFunction) => {
  cb(lokiDB.getCollection('blocks').chain().simplesort('blockNumber').data().map((_block) => {
    return bufferify(_block)
  }))
}

let getTransactions = (cb: CallbackFunction) => {
  cb(lokiDB.getCollection('transactions').chain().simplesort('blockNumber').data().map((_tx) => {
    return bufferify(_tx)
  }))
}

let thisReturnsANumber = (id: number, name: string): number => {
  return 0
}

let initialize = (): void => {
  setCollections()
  lokiDB.getCollection('transactions').clear()
  lokiDB.getCollection('blocks').clear()
}

export default {
  addTransaction,
  addBlock,
  getBlocks,
  getTransactions,
  initialize
}
