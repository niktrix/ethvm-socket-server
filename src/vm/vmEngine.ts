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
var tokenAbi = [{ "constant": true, "inputs": [{ "name": "", "type": "address" }], "name": "balanceOf", "outputs": [{ "name": "", "type": "uint256" }], "type": "function" }, { "constant": false, "inputs": [{ "name": "_to", "type": "address" }, { "name": "_value", "type": "uint256" }], "name": "transfer", "outputs": [{ "name": "success", "type": "bool" }], "type": "function" }, { "inputs": [], "type": "constructor" }]
var BN = require('bn.js')
// var ethereum_address = require('ethereum-address');



var VmEngine = ZeroClientProvider({
  // supports http and websockets
  // but defaults to infura's mainnet rest api
  //rpcUrl: 'https://mainnet.infura.io',
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
  var payload = createPayload({ jsonrpc: '2.0', method: 'eth_getBalance', params: ['0x2a65aca4d5fc5b5c859090a6c34d164135398226', "latest"], id: 1 })
  console.log(JSON.stringify(payload))
  VmEngine.sendAsync(payload, function (err: any, response: any) {
    console.log("response", response)
  })
}


VmEngine.getAccount = function (args: any, a: any) {
   VmEngine.sendAsync(createPayload({ jsonrpc: '2.0', method: 'eth_getKeyValue', params: ['0x2a65aca4d5fc5b5c859090a6c34d164135398226'], id: 1 }), function (err: any, response: any) {
    console.log("response", response)
  })
}

VmEngine.getAllTokens = function(args:any,a:any){
  var argss = ["address", "bool", "bool", "bool", "uint256"]
  console.log("Get Token Balance for : ",args)
  var vals = [args, "true", "true", "true", 10]
  var encoded = encodeCall("getAllBalance", argss, vals)
  var pl = createPayload({ jsonrpc: '2.0', method: 'eth_call', params: [{ to: "0xbe1ecf8e340f13071761e0eef054d9a511e1cb56", data: encoded }, "pending"], id: 1 })
  console.log(JSON.stringify(pl))
  VmEngine.sendAsync(pl, function (err: any, response: any) {
    console.log("eth_call", response)
  });
}




function encodeCall(name, argumentss = [], rawValues = []) {
  const values = rawValues.map(value => value.toString()) // convert BigNumbers to string
  const methodId = abi.methodID(name, argumentss).toString('hex');
  const params = abi.rawEncode(argumentss, values).toString('hex');
  return '0x' + methodId + params;
}


var speedomatic = require("speedomatic");
var clone = require("clone");

var packageRequest = function (payload: any) {
  var tx = clone(payload);
  if (tx.params == null) {
    tx.params = [];
  } else if (!Array.isArray(tx.params)) {
    tx.params = [tx.params];
  }
  var numParams = tx.params.length;
  if (numParams) {
    if (tx.signature && tx.signature.length !== numParams) {
      //throw new RPCError("PARAMETER_NUMBER_ERROR");
    }
    for (var j = 0; j < numParams; ++j) {
      if (tx.params[j] != null && tx.signature[j]) {
        if (tx.params[j].constructor === Number) {
          tx.params[j] = speedomatic.prefixHex(tx.params[j].toString(16));
        }
        if (tx.signature[j] === "int256") {
          tx.params[j] = speedomatic.unfork(tx.params[j], true);
        } else if (tx.signature[j] === "int256[]" && Array.isArray(tx.params[j]) && tx.params[j].length) {
          for (var k = 0, arrayLen = tx.params[j].length; k < arrayLen; ++k) {
            tx.params[j][k] = speedomatic.unfork(tx.params[j][k], true);
          }
        }
      }
    }
  }
  if (tx.to) tx.to = speedomatic.formatEthereumAddress(tx.to);
  if (tx.from) tx.from = speedomatic.formatEthereumAddress(tx.from);
  var packaged = {
    from: tx.from,
    to: tx.to,
    data: (tx.data) ? speedomatic.prefixHex(tx.data) : speedomatic.abiEncodeTransactionPayload(tx),
    gas: tx.gas ? speedomatic.hex(tx.gas) : 0x2fd618,
  };
  if (tx.gasPrice) packaged.gasPrice = speedomatic.hex(tx.gasPrice);
  if (tx.value) packaged.value = speedomatic.hex(tx.value);
  if (tx.returns) packaged.returns = tx.returns;
  if (tx.nonce) packaged.nonce = tx.nonce;
  return packaged;
};





export default VmEngine

