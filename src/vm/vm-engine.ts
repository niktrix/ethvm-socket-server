import { BigNumber } from 'bignumber.js'
import * as abi from 'ethereumjs-abi'
import * as Web3ProviderEngine from 'web3-provider-engine'
import * as createPayload from 'web3-provider-engine/util/create-payload'
import * as utils from 'web3-utils'

export interface VmEngineOptions {
  rpcUrl: string
  tokensAddress: string
  account: string
}

export class VmEngine {
  constructor(private readonly proxy: Web3ProviderEngine, private readonly opts: VmEngineOptions) {}

  public start() {
    this.proxy.start()
  }

  public getBalance(args: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const payload = createPayload({
        jsonrpc: '2.0',
        method: 'eth_getBalance',
        params: [args, 'latest'],
        id: 1
      })

      this.proxy.sendAsync(payload, (err: Error, response: any) => {
        if (err) {
          reject(err)
          return
        }

        resolve(response)
      })
    })
  }

  public getAccount(): Promise<any> {
    return new Promise((resolve, reject) => {
      const payload = createPayload({
        jsonrpc: '2.0',
        method: 'eth_getKeyValue',
        params: [this.opts.account],
        id: 1
      })

      this.proxy.sendAsync(payload, (err: Error, response: any) => {
        if (err) {
          reject(err)
          return
        }

        resolve(response)
      })
    })
  }

  public getAllTokens(args: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const argss = ['address', 'bool', 'bool', 'bool', 'uint256']
      const vals = [args, 'true', 'true', 'true', 0]
      const encoded = this.encodeCall('getAllBalance', argss, vals)

      const payload = createPayload({
        jsonrpc: '2.0',
        method: 'eth_call',
        params: [{ to: this.opts.tokensAddress, data: encoded }, 'pending'],
        id: 1
      })

      this.proxy.sendAsync(payload, (err: Error, response: any) => {
        if (err) {
          reject(err)
          return
        }

        const tokens = this.decode(response.result || []).filter(token => token.balance > 0)
        resolve(tokens)
      })
    })
  }

  private encodeCall(name: string, args: string[] = [], rawValues: any[] = []): string {
    const values = rawValues.map(value => value.toString())
    const methodId = abi.methodID(name, args).toString('hex')
    const params = abi.rawEncode(args, values).toString('hex')
    return '0x' + methodId + params
  }

  private decode(hex: string): any[] {
    const tokens: any[] = []

    const sizeHex = bytes => bytes * 2
    const trim = (str: string): string => str.replace(/\0[\s\S]*$/g, '')

    const getAscii = (h: string): string => {
      h = h.substring(0, 2) === '0x' ? h : '0x' + h
      return trim(utils.toAscii(h))
    }

    hex = hex.substring(0, 2) === '0x' ? hex.substring(2) : hex
    hex = hex.substring(0, hex.lastIndexOf('1') - 1) // starting point

    let offset = hex.length
    offset -= sizeHex(32)

    const countTokens = hex.substr(offset, sizeHex(32))
    offset -= sizeHex(1)

    const isName = parseInt(hex.substr(offset, sizeHex(1)))
    offset -= sizeHex(1)

    const isWebSite = parseInt(hex.substr(offset, sizeHex(1)))
    offset -= sizeHex(1)

    const isEmail = parseInt(hex.substr(offset, sizeHex(1)))
    const numTokens = new BigNumber('0x' + countTokens).toNumber()

    for (let i = 0; i < numTokens; i++) {
      const token: any = {}

      offset -= sizeHex(16)

      token.symbol = getAscii(hex.substr(offset, sizeHex(16)))
      offset -= sizeHex(20)

      token.addr = '0x' + hex.substr(offset, sizeHex(20))
      offset -= sizeHex(8)

      token.decimals = new BigNumber('0x' + hex.substr(offset, sizeHex(8))).toNumber()
      offset -= sizeHex(32)

      token.balance = new BigNumber('0x' + hex.substr(offset, sizeHex(32))).toFixed()

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
  }
}
