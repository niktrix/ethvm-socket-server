import config from '@app/config'
import { ZeroClientProviderFactory } from '@app/vm/zero-client-provider-factory'
import * as abi from 'ethereumjs-abi'
import * as Web3ProviderEngine from 'web3-provider-engine'
import * as createPayload from 'web3-provider-engine/util/create-payload'

export class VmEngine {
  private readonly opts: any
  private readonly proxy: Web3ProviderEngine

  constructor() {
    this.opts = {
      rpcUrl: config.get('eth.vm.engine.rpc_url'),
      tokensAddress: config.get('eth.vm.engine.tokens_smart_contract')
    }
    this.proxy = ZeroClientProviderFactory.create(this.opts)
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
        params: ['0x2a65aca4d5fc5b5c859090a6c34d164135398226'],
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

        resolve(response)
      })
    })
  }

  public start() {
    this.proxy.start()
  }

  private encodeCall(name: string, args: string[] = [], rawValues: any[] = []): string {
    const values = rawValues.map(value => value.toString())
    const methodId = abi.methodID(name, args).toString('hex')
    const params = abi.rawEncode(args, values).toString('hex')
    return '0x' + methodId + params
  }
}
