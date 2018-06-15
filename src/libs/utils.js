const bn = require('bignumber.js')
const Web3 = require('web3')
const abi = require('ethereumjs-abi')

const web3 = new Web3()

function sizeHex(bytes) {
  return bytes * 2;
}

function trim(str) {
  return str.replace(/\0[\s\S]*$/g, '')
}

function getAscii(hex) {
  hex = hex.substring(0, 2) === '0x' ? hex : '0x' + hex;
  return trim(web3.utils.toAscii(hex))
}

module.exports = {
  decode: (hex) => {
    const tokens = []
    hex = hex.substring(0, 2) === '0x' ? hex.substring(2) : hex;
    hex = hex.substring(0, (hex.lastIndexOf("1") - 1)) //starting point

    const offset = hex.length
    offset -= sizeHex(32)

    const countTokens = hex.substr(offset, sizeHex(32))
    offset -= sizeHex(1)

    const isName = parseInt(hex.substr(offset, sizeHex(1)))
    offset -= sizeHex(1)

    const isWebSite = parseInt(hex.substr(offset, sizeHex(1)))
    offset -= sizeHex(1)

    const isEmail = parseInt(hex.substr(offset, sizeHex(1)))

    const numTokens = new bn('0x' + countTokens).toNumber()

    for (const i = 0; i < numTokens; i++) {
      const token = {}

      offset -= sizeHex(16)
      token.symbol = getAscii(hex.substr(offset, sizeHex(16)))

      offset -= sizeHex(20)
      token.addr = '0x' + hex.substr(offset, sizeHex(20))

      offset -= sizeHex(8)
      token.decimals = new bn('0x' + hex.substr(offset, sizeHex(8))).toNumber()

      offset -= sizeHex(32)
      token.balance = new bn('0x' + hex.substr(offset, sizeHex(32))).toFixed()

      if (isName) {
        offset -= sizeHex(16)
        token.name = getAscii(hex.substr(offset, sizeHex(16)))

      }

      if (isWebSite) {
        offset -= sizeHex(32)
        token.website = getAscii(hex.substr(offset, sizeHex(32)))
      }

      if (isEmail) {
        offset -= sizeHex(32)
        token.email = getAscii(hex.substr(offset, sizeHex(32)))
      }

      tokens.push(token)
    }

    return tokens
  },

  encodeCall: (name, argumentss = [], rawValues = []) => {
    const values = rawValues.map(value => value.toString()) // convert BigNumbers to string
    const methodId = abi.methodID(name, argumentss).toString('hex');
    const params = abi.rawEncode(argumentss, values).toString('hex');
    return '0x' + methodId + params;
  }
}
