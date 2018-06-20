import config from '@app/config'
import { Callback } from '@app/interfaces'
import { TrieDB, TrieDBOptions } from '@app/vm/trie/db/triedb-interface'
import * as rpc from '@enkrypt.io/json-rpc2'
import * as Redis from 'ioredis'

export class RedisTrieDb implements TrieDB {
  private readonly redis: any
  private readonly rpc: any

  constructor() {
    const redisUrl = config.get('data_stores.redis.url')
    const rpcHost = config.get('eth.rpc.host')
    const rpcPort = config.get('eth.rpc.port')

    this.redis = new Redis(redisUrl)
    this.rpc = rpc.Client.$create(rpcPort, rpcHost)
  }

  public get(key: Buffer, opts: TrieDBOptions, cb: Callback) {
    this.redis.get(key, (err: Error, result: string) => {
      if (!err && result) {
        cb(null, new Buffer(result, 'hex'))
        return
      }

      // Otherwise retrieve from RPC
      this.rpc.call('eth_getKeyValue', ['0x' + key.toString('hex')], (e: Error, res: string) => {
        if (e) {
          cb(err, null)
          return
        }

        const buffer: Buffer = new Buffer(res.substring(2), 'hex')
        this.redis.set(key, buffer.toString('hex'))

        cb(null, buffer)
      })
    })
  }

  public put(key: Buffer, val: Buffer, opts: TrieDBOptions, cb: Callback) {
    this.redis.set(key, val, (err: Error, result: string) => {
      if (!err && result) {
        cb(null, new Buffer(result, 'hex'))
        return
      }

      cb(err, null)
    })
  }

  public del(key: Buffer, cb: Callback) {
    throw new Error('Method not implemented.')
  }

  public batch(ops: any[], opts: TrieDBOptions, cb: Callback) {
    throw new Error('Method not implemented.')
  }
}
