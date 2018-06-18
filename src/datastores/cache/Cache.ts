export interface CacheOpts {
  [propName: string]: any
}

export interface Cache {
  get(key: Buffer, opts: CacheOpts): Promise<Buffer>

  put(key: Buffer, val: Buffer, options: CacheOpts): Promise<Buffer>

  delete(key: Buffer): Promise<Buffer>
}
