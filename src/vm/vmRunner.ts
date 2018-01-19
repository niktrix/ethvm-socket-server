import CacheDb from './cacheDB'
let VM =  require('ethereumjs-vm')
let Account = require('ethereumjs-account')
let Trie = require('merkle-patricia-tree/secure')
const GAS_LIMIT = '0x4c4b40' // 50000000
interface Itx {
	to: string;
	data: string;
}
const hexToBuffer = (hex: string): Buffer => {
	return Buffer.from(hex.toLowerCase().replace('0x', ''), 'hex')
}
class VmRunner {
	db: CacheDb
	stateTrie: any
	constructor(_db: CacheDb) {
		this.db = _db
	}
	setStateRoot(_hash: Buffer) {
		this.stateTrie = new Trie(this.db, _hash)
	}
	call(tx: Itx, cb: (err: Error, result: Buffer) => void) {
		let _this = this
		_this.stateTrie.get(hexToBuffer(tx.to), (err: Error, val: Buffer)=>{
			if(err) {
				cb(err, null)
				return
			}
			let account = new Account(val)
			_this.stateTrie.getRaw(account.codeHash, (err: Error, code: string)=>{
				if (err) {
					cb(err, null)
					return
				}
				let vm = new VM({
					state: _this.stateTrie
				})
				vm.runCode({
					address: hexToBuffer(tx.to),
					code: hexToBuffer(code),
					gasLimit: GAS_LIMIT,
					data: hexToBuffer(tx.data)
				}, (err: Error, result: any)=>{
					cb(err, result ? result.return : null)
				})
			})
		})
	}
	getAccount(_to: string, cb: (err: Error, result: Buffer) => void) {
		this.stateTrie.get(hexToBuffer(_to), (err: Error, val: Buffer) => {
			if(err) {
				cb(err, null)
			} else {
				cb(null, val)
			}
		})
	}
}

export default VmRunner