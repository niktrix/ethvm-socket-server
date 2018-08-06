export interface CacheOpts {
  [propName: string]: any
}

export interface Cache<K, V> {
  get(key: K, opts?: CacheOpts): Promise<V>

  put(key: K, val: V, options?: CacheOpts): Promise<boolean>

  del(key: K): Promise<boolean>
}
