import _ from 'lodash'

const validateByteArray = (arr: number[]): boolean => arr.some((item: number) => !_.isNumber(item) || item < 0 || item > 255)

export const eth = {
  hexToBuffer: (hex: string): Buffer => Buffer.from(hex.toLowerCase().replace('0x', ''), 'hex'),

  isBufferObject: (item: any, length: number): boolean =>
    item.type && item.type === 'Buffer' && item.data && _.isArray(item.data) && validateByteArray(item.data) && item.data.length === length
}
