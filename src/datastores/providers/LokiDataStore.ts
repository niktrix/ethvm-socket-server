import * as Loki from 'lokijs'
import config from '@/config'
import { TxModel, BlockModel } from '@/models'

type CallbackFunction = (data: Array<any>) => void

const lokiDB = new Loki(config.get('eth_vm_server.data_stores.loki.db_name'), {
  autosave: true,
  autosaveInterval: 5000,
  autoload: true
})
const tables = ['transactions', 'blocks']

const setCollections = () => {
  tables.forEach((item: string) => {
    if (!lokiDB.getCollection(item)) {
      const ttlAge = config.get('eth_vm_server.data_stores.loki.ttl.age')
      const ttlInterval = config.get('eth_vm_server.data_stores.loki.ttl.interval')
      lokiDB
        .addCollection(item, { unique: ['hash'] })
        .setTTL(ttlAge, ttlInterval)
    }
  })
}

const hexify = (obj: any) => {
  const o = Object.assign({}, obj)
  for (var key in o) {
    if (o.hasOwnProperty(key)) {
      if (Buffer.isBuffer(o[key])) o[key] = '0x' + o[key].toString('hex')
    }
  }
  return o
}

const bufferify = (obj: any) => {
  const _obj = Object.assign({}, obj)
  for (var key in _obj) {
    if (_obj.hasOwnProperty(key)) {
      if (
        (typeof _obj[key] === 'string' || _obj[key] instanceof String) &&
        _obj[key].substring(0, 2) == '0x'
      )
        _obj[key] = new Buffer(_obj[key].substring(2).toUpperCase(), 'hex')
    }
  }
  return _obj
}

const processTx = (tx: TxModel) => {
  const hexed = hexify(tx)
  const col = lokiDB.getCollection('transactions')
  const obj = col.by('hash', hexed.hash)
  if (obj) {
    col.remove(obj)
  }
  lokiDB.getCollection('transactions').insert(hexed)
}

let addTransaction = (tx: TxModel | Array<TxModel>) => {
  if (Array.isArray(tx)) {
    tx.forEach(tTx => {
      processTx(tTx)
    })
  } else {
    processTx(tx)
  }
}

const addBlock = (block: BlockModel) => {
  const hexed = hexify(block)
  const col = lokiDB.getCollection('blocks')
  const obj = col.by('hash', hexed.hash)
  if (obj) {
    col.remove(obj)
  }
  lokiDB.getCollection('blocks').insert(hexed)
}

const getBlocks = (cb: CallbackFunction) => {
  cb(
    lokiDB
      .getCollection('blocks')
      .chain()
      .simplesort('blockNumber')
      .data()
      .map(_block => {
        return bufferify(_block)
      })
  )
}

let getTransactions = (cb: CallbackFunction) => {
  cb(
    lokiDB
      .getCollection('transactions')
      .chain()
      .simplesort('blockNumber')
      .data()
      .map(_tx => {
        return bufferify(_tx)
      })
  )
}

let initialize = (): void => {
  setCollections()
  lokiDB.getCollection('transactions').clear()
  lokiDB.getCollection('blocks').clear()
}

export default {
  initialize,
  addBlock,
  getBlocks,
  addTransaction,
  getTransactions
}
