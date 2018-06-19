import config from '@app/config'
import { Block, Tx } from '@app/models'
import * as Redis from 'ioredis'
import { CacheDataStore } from '@app/datastores'

type CallbackFunction = (data: any[]) => void

interface TableCache {
  transactions: Tx[]
  blocks: Block[]
}

const redis = new Redis(config.get('data_stores.redis.url'))
const socketRows = config.get('data_stores.redis.socket_rows')

const tableCache: TableCache = {
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
  const tbKey: keyof TableCache = tbName
  if (tableCache[tbKey].length) {
    cb(tableCache[tbKey])
    return
  }

  redis.get(tbName, (err, result) => {
    if (!err && result) {
      const bufferedArr = JSON.parse(result).map((_item: any) => {
        return bufferify(_item)
      })
      tableCache[tbKey] = bufferedArr
      cb(bufferedArr)
      return
    }

    cb([])
  })
}

const addTransaction = (tx: Tx | Tx[]) => {
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

const addBlock = (block: Block) => {
  getArray(tables.blocks, pBlocks => {
    pBlocks.unshift(block)

    if (pBlocks.length > socketRows) {
      pBlocks = pBlocks.slice(0, socketRows)
    }

    const tbKey: keyof TableCache = 'blocks'
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

class RedisDataStore implements CacheDataStore {
  private readonly r: any
  private readonly tables: any
  private readonly socketRows: any

  constructor() {
    const redisUrl = config.get('data_stores.redis.url')
    this.r = new Redis(redisUrl)
    this.tables = {
      transactions: 'transactions',
      blocks: 'blocks'
    }
    this.socketRows = config.get('data_stores.redis.socket_rows')
  }

  initialize(): Promise<boolean> {
    return new Promise(resolve => {
      const empty = JSON.stringify([])

      this.r.set(tables.transactions, empty)
      this.r.set(tables.blocks, empty)

      resolve(true)
    })
  }

  putBlock(block: Block): Promise<boolean> {
    throw new Error('Method not implemented.')
  }

  getBlocks(): Promise<Block[]> {
    throw new Error('Method not implemented.')
  }

  putTransaction(tx: Tx | Tx[]): Promise<boolean> {
    throw new Error('Method not implemented.')
  }

  getTransactions(): Promise<Tx[]> {
    throw new Error('Method not implemented.')
  }
}

export default {
  addTransaction,
  addBlock,
  getBlocks,
  getTransactions,
  initialize
}
