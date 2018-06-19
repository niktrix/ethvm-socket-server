import CacheDb from './cacheDB'
import configs from '@/configs'

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
var abi = require('ethereumjs-abi')
var utils = require('../libs/utils.js')


var tokenAbi = [{ "constant": true, "inputs": [{ "name": "", "type": "address" }], "name": "balanceOf", "outputs": [{ "name": "", "type": "uint256" }], "type": "function" }, { "constant": false, "inputs": [{ "name": "_to", "type": "address" }, { "name": "_value", "type": "uint256" }], "name": "transfer", "outputs": [{ "name": "success", "type": "bool" }], "type": "function" }, { "inputs": [], "type": "constructor" }]
var BN = require('bn.js')
// var ethereum_address = require('ethereum-address');


let cacheDB = new CacheDb(configs.global.REDIS.URL, {
  port: configs.global.GETH_RPC.port,
  host: configs.global.GETH_RPC.host
})


var VmEngine = ZeroClientProvider({
  // supports http and websockets
  // but defaults to infura's mainnet rest api
  //srpcUrl: 'https://mainnet.infura.io',
  //rpcUrl: 'http://35.227.70.36:8545',
  // rpcUrl: 'http://35.225.202.139:9545',  // all synced
  // rpcUrl: 'wss://mainnet.infura.io/ws',
  // rpcUrl: 'ws://localhost:8545/ws',
  rpcUrl: 'https://api.myetherwallet.com/eth',
})
// VmEngine.addProvider(new CacheSubprovider())
// VmEngine.addProvider(new RpcSubprovider({
//     rpcUrl: 'https://testrpc.metamask.io/',
//   }))

VmEngine.getBalance = function (args: any, a: any) {
  console.log("getbalance====== ==================")
  var payload = createPayload({ jsonrpc: '2.0', method: 'eth_getBalance', params: [args, "latest"], id: 1 })
  console.log(JSON.stringify(payload))
  VmEngine.sendAsync(payload, a);
}


VmEngine.getAccount = function (args: any, a: any) {
  VmEngine.sendAsync(createPayload({ jsonrpc: '2.0', method: 'eth_getKeyValue', params: ['0x2a65aca4d5fc5b5c859090a6c34d164135398226'], id: 1 }), function (err: any, response: any) {
    console.log("response", response)
  })
}

VmEngine.getAllTokens = function (args: any, a: any) {
  var argss = ["address", "bool", "bool", "bool", "uint256"]
  console.log("Get Token Balance for : ", args)
  var vals = [args, "true", "true", "true", 0]
  var encoded = utils.encodeCall("getAllBalance", argss, vals)
  var pl = createPayload({ jsonrpc: '2.0', method: 'eth_call', params: [{ to: "0xbe1ecf8e340f13071761e0eef054d9a511e1cb56", data: encoded }, "pending"], id: 1 })
  VmEngine.sendAsync(pl, function (err: any, response: any) {
    // console.log("eth_call", response)
    var tokens = utils.decode(response.result)
    //  console.log(tokens.length)
    var tokenwithbalance = []
    for (var i = 0; i <= tokens.length - 1; i++) {
      if (tokens[i].balance > 0) {
        tokenwithbalance.push(tokens[i])
      }
    }
    appendTokenValue(tokenwithbalance, a)

  });
}


function appendTokenValue(tokens: any, a: any) {
  var tk: any = [];
  tokens.forEach(element => {
    tk.push( element.symbol)
  });
  //console.log("tokenwithbalance", tk);
  cacheDB.getMultiple(tk, {
    keyEncoding: 'binary',
    valueEncoding: 'binary'
  }, function (err, results) {
    //console.log(results)
    for (var i = 0; i <= results.length - 1; i++) {
      tokens[i].USDValue = 0
      if(results[i][1] != null){
        tokens[i].USDValue = results[i][1];
      }
    }

    a(null, tokens)
  })

}












export default VmEngine

