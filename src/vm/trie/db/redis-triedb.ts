import config from '@app/config'
import { Callback } from '@app/interfaces'
import { TrieDB, TrieDBOptions } from '@app/vm/trie/db/triedb-interface'
import * as rpc from '@enkrypt.io/json-rpc2'
import * as Redis from 'ioredis'
import * as jayson from 'jayson/promise'


export interface RedisTrieDbOpts {
  host: string,
  port: number,
  rpcHost: string
  rpcPort: number
}

export class RedisTrieDb implements TrieDB {
  private readonly redis: Redis.Redis
  private readonly rpc: any
  private readonly opts: any

  constructor(options:RedisTrieDbOpts) {
    this.opts = options

    this.redis = new Redis({
      host: this.opts.host,
      port: this.opts.port
    })

    const rpcUrl = config.get('eth.vm.engine.rpc_url')
    this.rpc = jayson.client.https(rpcUrl)
  }

  public async get(key: Buffer, opts: TrieDBOptions, cb: Callback) {
    this.redis.get(key.toString(), (err: Error, result: string) => {
      if (!err && result) {
        cb(null, new Buffer(result, 'hex'))
        return
      }
      // Otherwise retrieve from RPC
      try {
        const res = this.rpc.request('eth_getKeyValue', ['0x' + key.toString('hex')])
        const buffer: Buffer = new Buffer(res.substring(2), 'hex')
        this.redis.set(key.toString(), buffer.toString('hex'))
        cb(null, buffer)
        return
      } catch (e) {
        cb(err, null)
        return
      }
    })
  }

  public put(key: Buffer, val: Buffer, opts: TrieDBOptions, cb: Callback) {
    this.redis.set(key.toString(), val, (err: Error, result: string) => {
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
