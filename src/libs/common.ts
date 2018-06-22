import * as _ from 'lodash'

const bufferToHex = (buf: Buffer): string => {
  let r = '0x' + new Buffer(buf).toString('hex')
  if (r === '0x') {
    r = '0x0'
  }
  return r
}

const bnToHex = (bn: any): string => {
  return '0x' + bn.toString(16)
}

const validateByteArray = (arr: number[]) => {
  let valid = true
  arr.forEach((item: number) => {
    if (!_.isNumber(item) || item < 0 || item > 255) {
      valid = false
    }
  })
  return valid
}

const check = {
  isNumber(item: number): boolean {
    return _.isNumber(item)
  },

  isBufferObject(item: any, length: number): boolean {
    return item.type && item.type === 'Buffer' && item.data && _.isArray(item.data) && validateByteArray(item.data) && item.data.length === length
  }
}

const newError = (msg: string): any => {
  return {
    message: msg
  }
}

const errors = {
  notNumber: 'Not a valid number',
  notBuffer: 'Not a valid Buffer',
  notHash: 'Not a valid Hash string',
  notAddress: 'Not a valid Address string',
  invalidInput: 'Invalid input'
}

export { bufferToHex, bnToHex, check, errors, newError }
