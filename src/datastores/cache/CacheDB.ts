import { Callback } from '@/interfaces'
import * as Redis from 'ioredis'
import * as rpc from 'json-rpc2'

interface IencOptions {
  keyEncoding: string
  valueEncoding: string
}

export interface CacheDBOptions {
  redisUrl: string
  rpcHost: string
  rpcPort: number
}

export class CacheDB {
  private readonly r: any
  private readonly rpc: any

  constructor(opts: CacheDBOptions) {
    this.r = new Redis(opts.redisUrl)
    this.rpc = rpc.Client.$create(opts.rpcPort, opts.rpcHost)
  }

  public get(key: Buffer, options: IencOptions, cb: Callback) {
    this.r.get(key, (err: Error, result: string) => {
      if (!err && result) {
        cb(null, new Buffer(result, 'hex'))
      } else {
        this.rpc.call('eth_getKeyValue', ['0x' + key.toString('hex')], function(err: Error, result: string) {
          if (err) {
            cb(err, null)
          } else {
            const resBuf: Buffer = new Buffer(result.substring(2), 'hex')
            this.r.set(key, resBuf.toString('hex'))
            cb(null, resBuf)
          }
        })
      }
    })
  }

  public put(key: Buffer, val: Buffer, options: IencOptions, cb: Callback) {
    this.r.set(key, val, (err: Error, result: string) => {
      if (!err && result) {
        cb(null, new Buffer(result, 'hex'))
      } else {
        cb(err, null)
      }
    })
  }

  public getString(key: Buffer, options: IencOptions, cb: Callback) {
    this.r.get(key, (err: Error, result: string) => {
      if (!err && result) {
        cb(null, result)
      } else {
        cb(err, null)
      }
    })
  }
}
