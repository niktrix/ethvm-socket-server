import * as Redis from 'ioredis'
import * as rpc from 'json-rpc2'

interface ImyCallbackType { (err: Error, result: any): any }

interface IencOptions {
	keyEncoding: string;
	valueEncoding: string;
}

interface IrpcOptions {
	port: number;
	host: string;
}

interface IputValues {
	type: string,
	key: Buffer,
	value: Buffer
}

class CacheDB {
	redisConn: any;
	rpcConn: any;
  curState: string;

	constructor (_redis: string, _rpc: IrpcOptions) {
		this.redisConn = new Redis(_redis)
		this.rpcConn = rpc.Client.$create(_rpc.port, _rpc.host)
  }

	get(key: Buffer, options: IencOptions, cb: ImyCallbackType) {
		let _this = this
		this.redisConn.get(key, (err: Error, result: string) => {
			if (!err && result) {
        cb(null, new Buffer(result, 'hex'))
			}
			else {
				this.rpcConn.call('eth_getKeyValue', ['0x' + key.toString('hex')], function(err: Error, result: string) {
					if (err) {
						cb(err, null)
					}
					else {
						let resBuf: Buffer = new Buffer(result.substring(2),'hex')
						_this.redisConn.set(key, resBuf.toString('hex'))
						cb(null, resBuf)
					}
				})
			}
		})
  }

	put(key: Buffer, val: Buffer, options: IencOptions, cb: ImyCallbackType){
		let _this = this
		this.redisConn.set(key,val, (err: Error, result: string) => {
			if (!err && result) {
				cb(null, new Buffer(result, 'hex'))
			}
			else {
				cb(err, null)
			}
		})}

	getString(key: Buffer, options: IencOptions, cb: ImyCallbackType){
			let _this = this
			this.redisConn.get(key, (err: Error, result: string) => {
				if (!err && result) {
					cb(null, result)
				}
				else {
					cb(err, null)
				}
			})}

	batch(ops: Array<IputValues>, options: IencOptions, cb: ImyCallbackType){
		cb(null, true)
  }

	del(key: Buffer, cb: ImyCallbackType) {
    cb(null, true)
  }

  isOpen():boolean {
    return true
  }
}

export default CacheDB
