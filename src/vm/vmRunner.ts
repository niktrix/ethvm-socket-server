import { CacheDB } from '@app/datastores'
import * as VM from '@enkrypt.io/ethereumjs-vm'
import * as Account from 'ethereumjs-account'
import * as LRU from 'lru'
import * as Trie from 'merkle-patricia-tree/secure'

const GAS_LIMIT = '0x4c4b40' // 50000000

interface Tx {
  to: string
  data: string
}

const hexToBuffer = (hex: string): Buffer => {
  return Buffer.from(hex.toLowerCase().replace('0x', ''), 'hex')
}

export class VmRunner {
  public stateTrie: any
  public codeCache: any

  constructor(private readonly db: CacheDB) {
    this.codeCache = new LRU(2000)
  }

  public setStateRoot(_hash: Buffer) {
    const _temp = new Trie(this.db, _hash)
    this.stateTrie = _temp
  }

  public call(txs: Tx | Tx[], mCB: (err: Error, result: any) => void) {
    const _trie = this.stateTrie.copy()
    const runCode = (sTree: any, to: Buffer, code: Buffer, gasLimit: string, data: Buffer, _cb: (err: Error, result: any) => void) => {
      const vm = new VM({
        state: sTree
      })
      vm.runCode(
        {
          address: to,
          code,
          gasLimit,
          data
        },
        (err: Error, result: any) => {
          _cb(err, result ? result.return : null)
        }
      )
    }
    const getResult = (tx: Tx, treeClone: any, cb: (err: Error, result: Buffer) => void) => {
      if (this.codeCache.peek(tx.to)) {
        runCode(treeClone, hexToBuffer(tx.to), this.codeCache.get(tx.to), GAS_LIMIT, hexToBuffer(tx.data), cb)
        return
      }
      treeClone.get(hexToBuffer(tx.to), (err: Error, val: Buffer) => {
        if (err) {
          cb(err, null)
          return
        }
        const account = new Account(val)
        treeClone.getRaw(account.codeHash, (e: Error, code: Buffer) => {
          if (e) {
            cb(e, null)
            return
          }
          this.codeCache.set(tx.to, code)
          runCode(treeClone, hexToBuffer(tx.to), code ? code : new Buffer('00', 'hex'), GAS_LIMIT, hexToBuffer(tx.data), cb)
        })
      })
    }
    if (Array.isArray(txs)) {
      const returnArr: Array<{ error: Error; result: any }> = []
      let counter = 0
      txs.forEach((_tx, _idx) => {
        getResult(_tx, _trie.copy(), (err: Error, result: any) => {
          counter++
          returnArr[_idx] = { error: err, result }
          if (counter === txs.length) {
            mCB(null, returnArr)
          }
        })
      })
    } else {
      getResult(txs, _trie, mCB)
    }
  }

  public getKeyValue(_key: Buffer, _cb: (err: Error, result: Buffer) => void) {
    this.db.get(
      new Buffer(_key),
      {
        keyEncoding: 'binary',
        valueEncoding: 'binary'
      },
      _cb
    )
  }

  public getCurrentStateRoot(_cb: (err: Error, result: Buffer) => void) {
    _cb(null, this.stateTrie.root)
  }

  public getAccount(_to: string, cb: (err: Error, result: Buffer) => void) {
    const treeClone = this.stateTrie.copy()
    treeClone.get(hexToBuffer(_to), (err: Error, val: Buffer) => {
      if (err) {
        cb(err, null)
        return
      }
      cb(null, val)
    })
  }
}
