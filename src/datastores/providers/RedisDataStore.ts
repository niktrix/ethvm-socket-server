import config from '@/config'
import { BlockModel, TxModel } from '@/models'
import * as Redis from 'ioredis'

type CallbackFunction = (data: any[]) => void

interface ItableCache {
  transactions: TxModel[]
  blocks: BlockModel[]
}

const redis = new Redis()
const socketRows = config.get('eth_vm_server.data_stores.redis.socket_rows')

const tableCache: ItableCache = {
  transactions: [],
  blocks: []
}

const tables = {
  transactions: 'transactions',
  blocks: 'blocks'
}

const bufferify = (obj: any): any => {
  for (const key in obj) {
    if (obj.hasOwnProperty(key) && obj[key]) {
      if (obj[key].type && obj[key].type === 'Buffer') {
        obj[key] = new Buffer(obj[key])
      } else if (Array.isArray(obj[key])) {
        obj[key] = obj[key].map((_item: any) => {
          if (_item.type && _item.type === 'Buffer') {
            return new Buffer(_item)
          }
          return _item
        })
      }
    }
  }
  return obj
}

const getArray = (tbName: any, cb: CallbackFunction) => {
  const tbKey: keyof ItableCache = tbName
  if (tableCache[tbKey].length) {
    cb(tableCache[tbKey])
  } else {
    const vals = redis.get(tbName, (err, result) => {
      if (!err && result) {
        const bufferedArr = JSON.parse(result).map((_item: any) => {
          return bufferify(_item)
        })
        tableCache[tbKey] = bufferedArr
        cb(bufferedArr)
      } else {
        cb([])
      }
    })
  }
}

const addTransaction = (tx: TxModel | TxModel[]) => {
  getArray(tables.transactions, pTxs => {
    if (Array.isArray(tx)) {
      tx.forEach(tTx => {
        pTxs.unshift(tTx)
      })
    } else {
      pTxs.unshift(tx)
    }
    if (pTxs.length > socketRows) {
      pTxs = pTxs.slice(0, socketRows)
    }
    const tbKey: keyof ItableCache = 'transactions'
    tableCache[tbKey] = pTxs
    redis.set(tables.transactions, JSON.stringify(pTxs))
  })
}

const addBlock = (block: BlockModel) => {
  getArray(tables.blocks, pBlocks => {
    pBlocks.unshift(block)
    if (pBlocks.length > socketRows) {
      pBlocks = pBlocks.slice(0, socketRows)
    }
    const tbKey: keyof ItableCache = 'blocks'
    tableCache[tbKey] = pBlocks
    redis.set(tables.blocks, JSON.stringify(pBlocks))
  })
}

const getBlocks = (cb: CallbackFunction) => {
  getArray(tables.blocks, cb)
}

const getTransactions = (cb: CallbackFunction) => {
  getArray(tables.transactions, cb)
}

const initialize = () => {
  redis.set(tables.transactions, JSON.stringify([]))
  redis.set(tables.blocks, JSON.stringify([]))
}

export default {
  addTransaction,
  addBlock,
  getBlocks,
  getTransactions,
  initialize
}
