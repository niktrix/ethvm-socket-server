import * as Web3ProviderEngine from 'web3-provider-engine'
import * as BlockCacheProvider from 'web3-provider-engine/subproviders/cache'
import * as DefaultFixture from 'web3-provider-engine/subproviders/default-fixture'
import * as RpcSource from 'web3-provider-engine/subproviders/fetch'
import * as FilterSubprovider from 'web3-provider-engine/subproviders/filters'
import * as HookedWalletSubprovider from 'web3-provider-engine/subproviders/hooked-wallet'
import * as InflightCacheSubprovider from 'web3-provider-engine/subproviders/inflight-cache'
import * as InfuraSubprovider from 'web3-provider-engine/subproviders/infura'
import * as NonceTrackerSubprovider from 'web3-provider-engine/subproviders/nonce-tracker'
import * as SanitizerSubprovider from 'web3-provider-engine/subproviders/sanitizer'
import * as SubscriptionSubprovider from 'web3-provider-engine/subproviders/subscriptions'
import * as WebSocketSubprovider from 'web3-provider-engine/subproviders/websocket'

export interface ZeroClientOptions {
  [propName: string]: any
}

export class ZeroClientProviderFactory {
  public static create(opts: ZeroClientOptions): Web3ProviderEngine {
    const connectionType = getConnectionType(opts as any)
    const engine = new Web3ProviderEngine(opts.engineParams)

    // static
    const staticSubprovider = new DefaultFixture(opts.static)
    engine.addProvider(staticSubprovider)

    // nonce tracker
    engine.addProvider(new NonceTrackerSubprovider())

    // sanitization
    const sanitizer = new SanitizerSubprovider()
    engine.addProvider(sanitizer)

    // cache layer
    const cacheSubprovider = new BlockCacheProvider()
    engine.addProvider(cacheSubprovider)

    // filters + subscriptions
    // for websockets, only polyfill filters
    if (connectionType === 'ws') {
      const filterSubprovider = new FilterSubprovider()
      engine.addProvider(filterSubprovider)
      // otherwise, polyfill both subscriptions and filters
    } else {
      const filterAndSubsSubprovider = new SubscriptionSubprovider()
      // forward subscription events through provider
      filterAndSubsSubprovider.on('data', (err, notification) => {
        engine.emit('data', err, notification)
      })
      engine.addProvider(filterAndSubsSubprovider)
    }

    // inflight cache
    const inflightCache = new InflightCacheSubprovider()
    engine.addProvider(inflightCache)

    // id mgmt
    const idmgmtSubprovider = new HookedWalletSubprovider({
      // accounts
      getAccounts: opts.getAccounts,

      // transactions
      processTransaction: opts.processTransaction,
      approveTransaction: opts.approveTransaction,
      signTransaction: opts.signTransaction,
      publishTransaction: opts.publishTransaction,

      // messages
      // old eth_sign
      processMessage: opts.processMessage,
      approveMessage: opts.approveMessage,
      signMessage: opts.signMessage,

      // new personal_sign
      processPersonalMessage: opts.processPersonalMessage,
      processTypedMessage: opts.processTypedMessage,
      approvePersonalMessage: opts.approvePersonalMessage,
      approveTypedMessage: opts.approveTypedMessage,
      signPersonalMessage: opts.signPersonalMessage,
      signTypedMessage: opts.signTypedMessage,
      personalRecoverSigner: opts.personalRecoverSigner
    })
    engine.addProvider(idmgmtSubprovider)

    // data source
    const dataSubprovider = opts.dataSubprovider || createDataSubprovider(connectionType, opts)

    // for websockets, forward subscription events through provider
    if (connectionType === 'ws') {
      dataSubprovider.on('data', (err, notification) => {
        engine.emit('data', err, notification)
      })
    }
    engine.addProvider(dataSubprovider)

    return engine
  }
}

function getConnectionType({ rpcUrl }) {
  if (!rpcUrl) {
    return undefined
  }

  const protocol = rpcUrl.split(':')[0]
  switch (protocol) {
    case 'http':
    case 'https':
      return 'http'
    case 'ws':
    case 'wss':
      return 'ws'
    default:
      throw new Error(`Web3ProviderEngine - unrecognized protocol in '${rpcUrl}'`)
  }
}

function createDataSubprovider(connectionType, opts) {
  const { rpcUrl, debug } = opts

  // default to infura
  if (!connectionType) {
    return new InfuraSubprovider()
  }

  if (connectionType === 'http') {
    return new RpcSource({
      rpcUrl,
      debug
    })
  }

  if (connectionType === 'ws') {
    return new WebSocketSubprovider({
      rpcUrl,
      debug
    })
  }

  throw new Error(`Web3ProviderEngine - unrecognized connectionType '${connectionType}'`)
}
