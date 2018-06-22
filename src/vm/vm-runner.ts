import config from '@app/config'
import { TrieDB } from '@app/vm'
import * as VM from '@enkrypt.io/ethereumjs-vm'
import * as Account from 'ethereumjs-account'
import LRU from 'lru-cache'
import * as Trie from 'merkle-patricia-tree/secure'

const GAS_LIMIT = config.get('eth.vm.engine.gas_limit')

interface Tx {
  to: string
  data: string
}

const hexToBuffer = (hex: string): Buffer => {
  return Buffer.from(hex.toLowerCase().replace('0x', ''), 'hex')
}

export class VmRunner {
  private readonly codeCache: LRU.Cache<string, any>
  private stateTrie: Trie

  constructor(private readonly db: TrieDB) {
    this.codeCache = new LRU(2000)
  }

  public setStateRoot(hash: Buffer) {
    this.stateTrie = new Trie(this.db, hash)
  }

  public getCurrentStateRoot(): Promise<Buffer> {
    return new Promise(resolve => {
      resolve(this.stateTrie.root)
    })
  }

  public call(txs: Tx | Tx[], mCB: (err: any, result: any) => void) {
    const trie = this.stateTrie.copy()

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

    const getResult = (tx: Tx, treeClone: any, cb: (err: any, result: any) => void) => {
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
        treeClone.getRaw(account.codeHash, (e: Error, code?: Buffer) => {
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
      const returnArr: any[] = []
      let counter = 0

      txs.forEach((_tx, _idx) => {
        getResult(_tx, trie.copy(), (err: Error, result: any) => {
          counter++
          returnArr[_idx] = { error: err, result }
          if (counter === txs.length) {
            mCB(null, returnArr)
          }
        })
      })
    } else {
      getResult(txs, trie, mCB)
    }
  }

  public getAccount(to: string, cb: (err: any, result?: Buffer) => void) {
    const trie = this.stateTrie.copy()
    const buffer = hexToBuffer(to)

    trie.get(buffer, (err: Error, b: Buffer) => {
      if (err) {
        cb(err)
        return
      }

      cb(null, b)
    })
  }
}
