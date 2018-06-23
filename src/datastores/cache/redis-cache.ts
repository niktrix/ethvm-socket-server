import config from '@app/config'
import { CacheDataStore } from '@app/datastores'
import { logger } from '@app/helpers'
import { Block, Tx } from '@app/models'
import * as Redis from 'ioredis'

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

const SOCKET_ROWS = config.get('data_stores.redis.socket_rows')

export class RedisDataStore implements CacheDataStore {
  private readonly redis: Redis.Redis
  private readonly cache: Map<string, Block[] | Tx[]> = new Map()

  constructor() {
    this.redis = new Redis({
      host: config.get('data_stores.redis.host'),
      port: config.get('data_stores.redis.port')
    })
  }

  public initialize(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      Promise.all([this.getBlocks(), this.getTransactions()])
        .then(results => {
          this.cache.set('blocks', results[0])
          this.cache.set('transactions', results[1])
          resolve(true)
        })
        .catch(error => {
          logger.error(`RedisDataStore - initialize() / Error: ${error}`)
          this.cache.set('blocks', [])
          this.cache.set('transactions', [])
          resolve(true)
        })
    })
  }

  public putBlock(block: Block): Promise<boolean> {
    return this.getArray<Block>('blocks')
      .then((blocks: Block[]) => {
        blocks.unshift(block)

        if (blocks.length > SOCKET_ROWS) {
          blocks = blocks.slice(0, SOCKET_ROWS)
        }

        this.cache.set('blocks', blocks)
        this.redis.set('blocks', blocks)

        return Promise.resolve(true)
      })
      .catch(error => {
        logger.error(`RedisDataStore - putBlock() / Error: ${error}`)
        return Promise.resolve(false)
      })
  }

  public getBlocks(): Promise<Block[]> {
    return this.getArray<Block>('blocks')
  }

  public putTransaction(tx: Tx | Tx[]): Promise<boolean> {
    return this.getArray<Tx>('transactions')
      .then((txs: Tx[]) => {
        if (Array.isArray(tx)) {
          tx.forEach(t => {
            txs.unshift(t)
          })
        } else {
          txs.unshift(tx)
        }

        if (txs.length > SOCKET_ROWS) {
          txs = txs.slice(0, SOCKET_ROWS)
        }

        this.cache.set('transactions', txs)
        this.redis.set('transactions', JSON.stringify(txs))

        return Promise.resolve(true)
      })
      .catch(error => {
        logger.error(`RedisDataStore - putTransaction() / Error: ${error}`)
        return Promise.resolve(false)
      })
  }

  public getTransactions(): Promise<Tx[]> {
    return this.getArray<Tx>('transactions')
  }

  private getArray<T extends Tx | Block>(key: string): Promise<T[]> {
    return new Promise(resolve => {
      const values = this.cache.get(key) as T[]
      if (values && values.length) {
        resolve(values)
        return
      }

      this.redis
        .get(key)
        .then(result => {
          if (!result) {
            resolve([])
            return
          }

          const buffered = JSON.parse(result).map(item => bufferify(item))
          this.cache.set(key, buffered)

          resolve(buffered)
        })
        .catch(error => {
          logger.error(`RedisDataStore - getArray() / Error while retrieving array with key: ${key}. Error: ${error}`)
          resolve([])
        })
    })
  }
}
