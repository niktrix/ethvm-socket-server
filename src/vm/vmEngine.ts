import { l } from '@app/helpers'
import { encodeCall } from '@app/libs/utils'
import { ZeroClientProviderFactory } from '@app/vm/ZeroClientProviderFactory'
import * as createPayload from 'web3-provider-engine/util/create-payload.js'

const VmEngine = ZeroClientProviderFactory.create({
  rpcUrl: 'https://api.myetherwallet.com/eth'
})

VmEngine.getBalance = (args: any, a: any) => {
  l.debug('getbalance====== ==================')
  const payload = createPayload({
    jsonrpc: '2.0',
    method: 'eth_getBalance',
    params: [args, 'latest'],
    id: 1
  })
  l.debug(JSON.stringify(payload))
  VmEngine.sendAsync(payload, a)
}

VmEngine.getAccount = (args: any, a: any) => {
  VmEngine.sendAsync(
    createPayload({
      jsonrpc: '2.0',
      method: 'eth_getKeyValue',
      params: ['0x2a65aca4d5fc5b5c859090a6c34d164135398226'],
      id: 1
    }),
    (err: any, response: any) => {
      l.debug('response', response)
    }
  )
}

VmEngine.getAllTokens = (args: any, a: any) => {
  const argss = ['address', 'bool', 'bool', 'bool', 'uint256']
  l.debug('Get Token Balance for : ', args)
  const vals = [args, 'true', 'true', 'true', 0]
  const encoded = encodeCall('getAllBalance', argss, vals)
  const pl = createPayload({
    jsonrpc: '2.0',
    method: 'eth_call',
    params: [{ to: '0xbe1ecf8e340f13071761e0eef054d9a511e1cb56', data: encoded }, 'pending'],
    id: 1
  })
  VmEngine.sendAsync(pl, a)
}

export { VmEngine }
