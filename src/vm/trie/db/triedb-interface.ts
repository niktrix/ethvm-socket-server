import { Callback } from '@app/interfaces'

export interface TrieDBOptions {
  [propName: string]: any
}

// merkle-patricia-tree module use this signature to store data
// so, in order to improve where the data is stored, we define the same interface
export interface TrieDB {
  get(key: Buffer, opts: TrieDBOptions, cb: Callback)

  put(key: Buffer, val: Buffer, options: TrieDBOptions, cb: Callback)

  del(key: Buffer, cb: Callback)

  batch(ops: any[], opts: TrieDBOptions, cb: Callback)
}
