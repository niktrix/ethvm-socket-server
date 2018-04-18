const ProviderEngine = require('web3-provider-engine')
const DefaultFixture = require('web3-provider-engine/subproviders/default-fixture.js')
const NonceTrackerSubprovider = require('web3-provider-engine/subproviders/nonce-tracker.js')
const CacheSubprovider = require('web3-provider-engine/subproviders/cache.js')
const FilterSubprovider = require('web3-provider-engine/subproviders/filters.js')
const SubscriptionSubprovider = require('web3-provider-engine/subproviders/subscriptions')
const InflightCacheSubprovider = require('web3-provider-engine/subproviders/inflight-cache')
const HookedWalletSubprovider = require('web3-provider-engine/subproviders/hooked-wallet.js')
const SanitizingSubprovider = require('web3-provider-engine/subproviders/sanitizer.js')
const InfuraSubprovider = require('web3-provider-engine/subproviders/infura.js')
const FetchSubprovider = require('web3-provider-engine/subproviders/fetch.js')
const WebSocketSubprovider = require('web3-provider-engine/subproviders/websocket.js')
const VMSubprovider = require('web3-provider-engine/subproviders/vm.js')



module.exports = ZeroClientProvider


function ZeroClientProvider(opts = {}){
  const connectionType = getConnectionType(opts)

  const engine = new ProviderEngine(opts.engineParams)

  // static
  const staticSubprovider = new DefaultFixture(opts.static)
  engine.addProvider(staticSubprovider)

  //vm provider
  engine.addProvider(new VMSubprovider())


  // nonce tracker
  engine.addProvider(new NonceTrackerSubprovider())

//   // sanitization
//   const sanitizer = new SanitizingSubprovider()
//   engine.addProvider(sanitizer)

  // cache layer
  const cacheSubprovider = new CacheSubprovider()
  engine.addProvider(cacheSubprovider)

 
  const inflightCache = new InflightCacheSubprovider()
  engine.addProvider(inflightCache)

 

  // data source
  const dataSubprovider = opts.dataSubprovider || createDataSubprovider(connectionType, opts)
  // for websockets, forward subscription events through provider
  if (connectionType === 'ws') {
    dataSubprovider.on('data', (err, notification) => {
      engine.emit('data', err, notification)
    })
  }
  engine.addProvider(dataSubprovider)

  // start polling
  engine.start()

  return engine

}

function createDataSubprovider(connectionType, opts) {
  const { rpcUrl, debug } = opts

  // default to infura
  if (!connectionType) {
    return new InfuraSubprovider()
  }
  if (connectionType === 'http') {
    return new FetchSubprovider({ rpcUrl, debug })
  }
  if (connectionType === 'ws') {
    return new WebSocketSubprovider({ rpcUrl, debug })
  }

  throw new Error(`ProviderEngine - unrecognized connectionType "${connectionType}"`)
}

function getConnectionType({ rpcUrl }) {
  if (!rpcUrl) return undefined

  const protocol = rpcUrl.split(':')[0]
  switch (protocol) {
    case 'http':
    case 'https':
      return 'http'
    case 'ws':
    case 'wss':
      return 'ws'
    default:
      throw new Error(`ProviderEngine - unrecognized protocol in "${rpcUrl}"`)
  }
}
