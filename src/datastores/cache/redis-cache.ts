import config from '@app/config'
import { CacheDataStore } from '@app/datastores'
import { eth, logger } from '@app/helpers'
import { Block, Tx } from '@app/models'
import * as Redis from 'ioredis'

export class RedisDataStore implements CacheDataStore {
  private readonly redis: Redis.Redis
  private readonly socketRows: number
  private readonly cache: Map<string, Block[] | Tx[]> = new Map()

  constructor() {
    this.redis = new Redis({
      host: config.get('data_stores.redis.host'),
      port: config.get('data_stores.redis.port')
    })
    this.socketRows = config.get('data_stores.redis.socket_rows')
  }

  public initialize(): Promise<boolean> {
    return new Promise(resolve => {
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
    logger.debug(`RedisDataStore - putBlock / Block: ${eth.toHex(block.hash)}`)

    return this.getArray<Block>('blocks')
      .then((blocks: Block[]) => {
        blocks.unshift(block)

        if (blocks.length > this.socketRows) {
          blocks = blocks.slice(0, this.socketRows)
        }

        this.cache.set('blocks', blocks)
        this.redis.set('blocks', JSON.stringify(blocks))

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

  public putTransactions(txs: Tx[]): Promise<boolean> {
    logger.debug(`RedisDataStore - putTransaction / Txs: ${txs.length}`)

    return this.getArray<Tx>('transactions')
      .then((_txs: Tx[]) => {
        if (Array.isArray(txs)) {
          txs.forEach(t => {
            _txs.unshift(t)
          })
        } else {
          _txs.unshift(txs)
        }

        if (_txs.length > this.socketRows) {
          _txs = _txs.slice(0, this.socketRows)
        }

        this.cache.set('transactions', _txs)
        this.redis.set('transactions', JSON.stringify(_txs))

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
            logger.debug(`RedisDataStore - getArray() / Key: ${key} | Result: empty`)
            resolve([])
            return
          }

          logger.debug(`RedisDataStore - getArray() / Key: ${key} | Result: ${result.length}`)

          const buffered = JSON.parse(result).map(item => eth.bufferify(item))
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
