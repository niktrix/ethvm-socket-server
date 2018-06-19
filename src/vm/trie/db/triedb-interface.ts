import { Callback } from '@app/interfaces'

export interface TrieDBOptions {
  [propName: string]: any
}

// merkle-patricia-tree module use this signature to store data
// So, in order to improve where the data is stored, we define the same interface and
export interface TrieDB {
  get(key: Buffer, opts: TrieDBOptions, cb: Callback)

  put(key: Buffer, val: Buffer, options: TrieDBOptions, cb: Callback)

  del(key: Buffer, cb: Callback)

  batch(ops: Array<any>, opts: TrieDBOptions, cb: Callback)
}
