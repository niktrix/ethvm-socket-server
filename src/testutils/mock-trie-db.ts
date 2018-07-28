import { Callback } from '@app/interfaces/callbacks'
import { TrieDB, TrieDBOptions } from '@app/vm/trie/db/triedb-interface'

export class MockTrieDB implements TrieDB {
  public get(key: Buffer, opts: TrieDBOptions, cb: Callback) {
    cb(null, null)
  }

  public put(key: Buffer, val: Buffer, options: TrieDBOptions, cb: Callback) {
    cb(null, null)
  }

  public del(key: Buffer, cb: Callback) {
    cb(null, null)
  }

  public batch(ops: any[], opts: TrieDBOptions, cb: Callback) {
    cb(null, null)
  }
}
