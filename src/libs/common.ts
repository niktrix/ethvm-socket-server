import bn from 'bignumber.js'
import * as _ from 'lodash'

let bufferToHex = (_buf: Buffer): string => {
  let r = '0x' + new Buffer(_buf).toString('hex')
  if (r == '0x') r = "0x0"
  return r
}

let bnToHex = (_bn: any): string => {
  return '0x' + _bn.toString(16)
}

let validateHexString = (str: string) => {
  if (str == "") return true
  str = str.substring(0, 2) == '0x' ? str.substring(2).toUpperCase() : str.toUpperCase()
  var re = /^[0-9A-F]+$/g
  return re.test(str)
}

let validateByteArray = (arr: Array<number>) => {
  let valid = true
  arr.forEach((_item: number) => {
    if (!_.isNumber(_item) || _item < 0 || _item > 255) valid = false
  })
  return valid
}

let check = {
  isNumber(_item: number): boolean {
    return _.isNumber(_item)
  },
  isHashString(_item: string): boolean {
    return _item.substr(0, 2) == "0x" && validateHexString(_item.substring(2).toUpperCase()) && _item.length === 66
  },
  isHashBuffer(_item: Buffer): boolean {
    return Buffer.isBuffer(_item) && _item.length === 32
  },
  isAddressString(_item: string): boolean {
    return _item.substr(0, 2) == "0x" && validateHexString(_item.substring(2).toUpperCase()) && _item.length === 42
  },
  isAddressBuffer(_item: string): boolean {
    return Buffer.isBuffer(_item) && _item.length === 20
  },
  isBufferObject(_item: any, length: number): boolean {
    return _item.type && _item.type == "Buffer" && _item.data && _.isArray(_item.data) && validateByteArray(_item.data) && _item.data.length == length
  }
}

let newError = (_msg: string): any => {
  return {
    message: _msg
  }
}

let errors = {
  notNumber: "Not a valid number",
  notBuffer: "Not a valid Buffer",
  notHash: "Not a valid Hash string",
  notAddress: "Not a valid Address string",
  invalidInput: "Invalid input"
}

export {
  bufferToHex,
  bnToHex,
  check,
  errors,
  newError
}
