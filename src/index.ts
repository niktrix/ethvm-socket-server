import config from '@app/config'
import { RedisDataStore, RethinkDBDataStore, RethinkDBOpts } from '@app/datastores'
import { logger } from '@app/helpers'
import { EthVMServer } from '@app/server'
import { VmEngine, VmRunner } from '@app/vm'
import { RedisTrieDb } from '@app/vm/trie/db'
import { ZeroClientProviderFactory } from '@app/vm/zero-client-provider-factory'
import * as EventEmitter from 'eventemitter3'

async function bootstrapServer() {
  logger.debug('bootstrapper -> Bootstraping ethvm-socket-server!')

  // Create TrieDB
  logger.debug('bootstrapper -> Initializing TrieDB')
  const trieOpts: any = {
    host: config.get('data_stores.redis.host'),
    port: config.get('data_stores.redis.port'),
    rpcHost: config.get('eth.rpc.host'),
    rpcPort: config.get('eth.rpc.port')
  }
  const trieDb = new RedisTrieDb(trieOpts)

  // Create VmEngine
  logger.debug('bootstrapper -> Initializing VmEngine')
  const vmeOpts = {
    rpcUrl: config.get('eth.vm.engine.rpc_url'),
    tokensAddress: config.get('eth.vm.engine.tokens_smart_contract'),
    account: config.get('eth.vm.engine.account')
  }
  const vmeProxy = ZeroClientProviderFactory.create(vmeOpts)
  const vme = new VmEngine(vmeProxy, vmeOpts)
  vme.start()

  // Create Cache data store
  logger.info('bootstrapper -> Initializing redis cache data store')
  const redisDsOpts = {
    host: config.get('data_stores.redis.host'),
    port: config.get('data_stores.redis.port'),
    socketRows: config.get('data_stores.redis.socket_rows')
  }
  const ds = new RedisDataStore(redisDsOpts)
  await ds.initialize().catch(() => process.exit(-1))

  // Create VmRunner
  logger.debug('bootstrapper -> Initializing VmRunner')
  const gasLimit = config.get('eth.vm.engine.gas_limit')
  const vmr = new VmRunner(trieDb, gasLimit)

  // Set default state block to VmRunner
  const blocks = await ds.getBlocks()
  const configStateRoot = config.get('eth.state_root')
  const hasStateRoot = blocks && blocks[0] && blocks[0].stateRoot
  const stateRoot = hasStateRoot ? new Buffer(blocks[0].stateRoot!!) : new Buffer(configStateRoot, 'hex')
  vmr.setStateRoot(stateRoot)

  // Create block event emmiter
  logger.debug('bootstrapper -> Initializing event emitter')
  const emitter = new EventEmitter()

  // Create Blockchain data store
  logger.debug('bootstrapper -> Initializing RethinkDBDataStore')
  const rethinkDbOpts: RethinkDBOpts = {
    host: config.get('rethink_db.host'),
    port: config.get('rethink_db.port'),
    db: config.get('rethink_db.db_name'),
    user: config.get('rethink_db.user'),
    password: config.get('rethink_db.password'),
    ssl: {
      cert: config.get('rethink_db.cert_raw')
    }
  }
  if (!rethinkDbOpts.ssl.cert) {
    delete rethinkDbOpts.ssl
  }
  const rdb = new RethinkDBDataStore(emitter, rethinkDbOpts)

  // Create server
  logger.debug('bootstrapper -> Initializing server')
  const server = new EthVMServer(trieDb, vmr, vme, ds, rdb, emitter)
  await server.start()
}

bootstrapServer()
