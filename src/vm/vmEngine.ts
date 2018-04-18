const ProviderEngine = require('web3-provider-engine')
const CacheSubprovider = require('web3-provider-engine/subproviders/cache.js')
const FixtureSubprovider = require('web3-provider-engine/subproviders/fixture.js')
const FilterSubprovider = require('web3-provider-engine/subproviders/filters.js')
const VmSubprovider = require('web3-provider-engine/subproviders/vm.js')
const HookedWalletSubprovider = require('web3-provider-engine/subproviders/hooked-wallet.js')
const NonceSubprovider = require('web3-provider-engine/subproviders/nonce-tracker.js')
const RpcSubprovider = require('web3-provider-engine/subproviders/rpc.js')
const createPayload = require("web3-provider-engine/util/create-payload.js")
const ZeroClientProvider = require("./Zeroclient.js")

var VmEngine = ZeroClientProvider({
  // supports http and websockets
  // but defaults to infura's mainnet rest api
  // rpcUrl: 'https://mainnet.infura.io',
   rpcUrl: 'http://35.227.70.36:8545',
  // rpcUrl: 'http://35.225.202.139:9545',  // all synced
  // rpcUrl: 'wss://mainnet.infura.io/ws',
  // rpcUrl: 'ws://localhost:8545/ws',
})
// VmEngine.addProvider(new CacheSubprovider())
// VmEngine.addProvider(new RpcSubprovider({
//     rpcUrl: 'https://testrpc.metamask.io/',
//   }))

  VmEngine.getBalance = function(args:any,a:any){
    console.log("getbalance========================")
    VmEngine.sendAsync(createPayload({jsonrpc: '2.0', method: 'eth_getBalance', params: ['0x2a65aca4d5fc5b5c859090a6c34d164135398226', "latest"], id: 1}), function(err:any, response:any){
       console.log("response",response)
    })
   }


   VmEngine.getAccount = function(args:any,a:any){
    console.log("getAccount==========")
    VmEngine.sendAsync(createPayload({jsonrpc: '2.0', method: 'eth_getKeyValue', params: ['0x2a65aca4d5fc5b5c859090a6c34d164135398226'], id: 1}), function(err:any, response:any){
       console.log("response",response)
    })
   }

   VmEngine.getStorageAt = function(args:any,a:any){
    console.log("getStorageAt==========",args)
    VmEngine.sendAsync(createPayload({jsonrpc: '2.0', method: 'eth_getStorageAt', params: [args,"0x0", "0x2"], id: 1}), function(err:any, response:any){
       console.log("getStorageAt",response)
    })
   }

  export default VmEngine

 