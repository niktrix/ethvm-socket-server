import _ from 'lodash'

const validateByteArray = (arr: number[]): boolean => arr.some((item: number) => !_.isNumber(item) || item < 0 || item > 255)

export const eth = {
  toHex: (b: Buffer): string => '0x' + new Buffer(b).toString('hex'),

  hexToBuffer: (hex: string): Buffer => Buffer.from(hex.toLowerCase().replace('0x', ''), 'hex'),

  isBufferObject: (item: any, length: number): boolean =>
    item.type && item.type === 'Buffer' && item.data && _.isArray(item.data) && validateByteArray(item.data) && item.data.length === length,

  bufferify: (obj: any): any => {
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
}
