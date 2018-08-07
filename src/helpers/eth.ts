export const isValidHash = (hash: string): boolean => /^(0x)?([A-Fa-f0-9]{64})$/.test(hash)

export const isBuffer = (item: any, length: number = 0): boolean => Buffer.isBuffer(item) && (item as Buffer).length === length

export const hexToBuffer = (hex: string): Buffer => Buffer.from(hex.toLowerCase().replace('0x', ''), 'hex')

export const bufferify = (obj: any): any => {
  for (const key in obj) {
    if (obj.hasOwnProperty(key) && obj[key]) {
      if (obj[key].type && obj[key].type === 'Buffer') {
        obj[key] = new Buffer(obj[key])
      } else if (Array.isArray(obj[key])) {
        obj[key] = obj[key].map((_item: any) => {
          if (_item.type && _item.type === 'Buffer') {
            return new Buffer(_item)
          }
          return _item
        })
      }
    }
  }
  return obj
}
